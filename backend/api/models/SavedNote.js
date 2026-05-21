const mongoose = require('mongoose');

const SavedNoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  summary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Summary',
    required: true,
    index: true
  },
  noteTitle: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true
  },
  noteContent: {
    type: String,
    required: [true, 'Note content is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SavedNote', SavedNoteSchema);
