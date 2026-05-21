const multer = require('multer');
const path = require('path');

// Configure in-memory storage to support Serverless deployment structures
const storage = multer.memoryStorage();

// File filter checking formats
const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|txt|plain/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype || extname) {
    return cb(null, true);
  }
  cb(new Error('Invalid file type! Only PDF and Plain Text files (.txt) are allowed.'));
};

// Limit size to 10MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});

module.exports = upload;
