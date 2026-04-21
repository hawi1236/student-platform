const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  course: { type: String, required: true },
  fileUrl: { type: String, required: true },
  size: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);
