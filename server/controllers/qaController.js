const Question = require('../models/Question');
const Answer = require('../models/Answer');

exports.askQuestion = async (req, res) => {
  const { title, content } = req.body;
  try {
    const question = await Question.create({
      title,
      content,
      user: req.user._id
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('user', 'name')
      .populate({
        path: 'answers',
        populate: { path: 'user', select: 'name' }
      })
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.answerQuestion = async (req, res) => {
  const { content } = req.body;
  const questionId = req.params.id;
  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const answer = await Answer.create({
      content,
      user: req.user._id,
      question: questionId
    });

    question.answers.push(answer._id);
    await question.save();

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (req.user.role !== 'admin' && question.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete all associated answers
    await Answer.deleteMany({ question: req.params.id });
    await question.deleteOne();
    
    res.json({ message: 'Question removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    if (req.user.role !== 'admin' && answer.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Remove from Question's answers array
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: req.params.answerId }
    });

    await answer.deleteOne();
    res.json({ message: 'Answer removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
