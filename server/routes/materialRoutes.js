const express = require('express');
const router = express.Router();
const { uploadMaterial, getMaterials, deleteMaterial } = require('../controllers/materialController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getMaterials);
router.post('/', protect, upload.single('file'), uploadMaterial);
router.delete('/:id', protect, deleteMaterial);

module.exports = router;
