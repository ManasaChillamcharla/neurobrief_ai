const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  totalWordsProcessed: {
    type: Number,
    default: 0
  },
  totalSummariesCount: {
    type: Number,
    default: 0
  },
  readingTimeSaved: {
    type: Number, // Estimated saved time in minutes
    default: 0
  },
  sentimentDistribution: {
    positive: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    negative: { type: Number, default: 0 }
  },
  topicFrequencies: [
    {
      topic: { type: String, required: true },
      count: { type: Number, default: 1 }
    }
  ],
  averageComplexity: {
    type: Number,
    default: 50
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
