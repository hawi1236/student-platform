const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Material = require('../models/Material');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

router.get('/', protect, async (req, res) => {
  try {
    const materials = await Material.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(5);
    const questions = await Question.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5);
    const answers = await Answer.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5);

    const activity = [
      ...materials.map(m => ({ id: m._id, type: 'material', text: `You uploaded ${m.title}`, createdAt: m.createdAt })),
      ...questions.map(q => ({ id: q._id, type: 'qa', text: `You asked: ${q.title}`, createdAt: q.createdAt })),
      ...answers.map(a => ({ id: a._id, type: 'qa', text: `You answered a question`, createdAt: a.createdAt }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
