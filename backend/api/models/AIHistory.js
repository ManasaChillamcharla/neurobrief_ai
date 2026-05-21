const mongoose = require('mongoose');

const AIHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  actionType: {
    type: String,
    required: true, // e.g. 'SUMMARIZE', 'QUIZ', 'HIGHLIGHTS', 'GRAPH'
    index: true
  },
  inputLength: {
    type: Number,
    default: 0
  },
  outputLength: {
    type: Number,
    default: 0
  },
  apiUsed: {
    type: String,
    required: true // 'Google Gemini API' or 'Local Fallback Engine'
  },
  success: {
    type: Boolean,
    default: true
  },
  error: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AIHistory', AIHistorySchema);
