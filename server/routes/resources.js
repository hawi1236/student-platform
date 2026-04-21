const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().populate('user', 'name email');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload a new resource
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a file' });
    
    const { title, description, subject } = req.body;
    
    const resource = await Resource.create({
      title,
      description,
      subject,
      fileUrl: `/uploads/${req.file.filename}`,
      user: req.user._id
    });
    
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a resource
router.delete('/:id', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user is owner or admin
    if (resource.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this resource' });
    }
    
    await Resource.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Resource removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
