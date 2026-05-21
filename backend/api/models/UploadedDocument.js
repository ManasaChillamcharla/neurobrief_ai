const mongoose = require('mongoose');

const UploadedDocumentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  fileSize: {
    type: Number, // in bytes
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  textLength: {
    type: Number, // length of raw string extracted
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UploadedDocument', UploadedDocumentSchema);
