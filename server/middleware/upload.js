const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const cleanFileName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${cleanFileName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB
});

module.exports = upload;
