const Material = require('../models/Material');
const path = require('path');
const fs = require('fs');

exports.uploadMaterial = async (req, res) => {
  const { title, description, course } = req.body;
  if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

  try {
    const material = await Material.create({
      title,
      description,
      course,
      fileUrl: `/uploads/${req.file.filename}`,
      size: req.file.size,
      userId: req.user._id
    });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMaterials = async (req, res) => {
  const { search } = req.query;
  let query = {};
  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } }
      ]
    };
  }
  try {
    const materials = await Material.find(query).populate('userId', 'name');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    // Only admin or the user who uploaded can delete
    if (req.user.role !== 'admin' && material.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Delete file from server
    // material.fileUrl is like "/uploads/1713...png"
    const relativePath = material.fileUrl.startsWith('/') ? material.fileUrl.substring(1) : material.fileUrl;
    const filePath = path.join(__dirname, '..', relativePath);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fsErr) {
      console.error('File deletion error:', fsErr);
      // We continue deleting the record even if the file is missing
    }

    await material.deleteOne();
    res.json({ message: 'Material removed' });
  } catch (error) {
    console.error('Delete Material Error:', error);
    res.status(500).json({ message: error.message });
  }
};
