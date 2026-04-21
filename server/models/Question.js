const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
