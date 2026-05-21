const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  rawContent: {
    type: String,
    required: [true, 'Raw content is required']
  },
  summaryText: {
    type: String,
    required: [true, 'Summarized text is required']
  },
  bulletPoints: {
    type: [String],
    default: []
  },
  executiveSummary: {
    type: String,
    default: ''
  },
  studyNotes: {
    type: String,
    default: ''
  },
  highlights: [
    {
      text: { type: String, required: true },
      type: { type: String, default: 'critical' } // critical, vocabulary, quote
    }
  ],
  quizQuestions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      answer: { type: String, required: true }, // exact option string or index
      explanation: { type: String, default: '' }
    }
  ],
  knowledgeGraph: {
    nodes: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        val: { type: Number, default: 1 }, // scale size based on importance
        group: { type: String, default: 'concept' } // concept, keyword, person, date
      }
    ],
    links: [
      {
        source: { type: String, required: true },
        target: { type: String, required: true }
      }
    ]
  },
  keywords: {
    type: [String],
    default: []
  },
  metrics: {
    readingTime: { type: Number, default: 0 }, // minutes
    sentimentScore: { type: Number, default: 0 }, // -1.0 to 1.0
    sentimentLabel: { type: String, default: 'Neutral' }, // Positive, Negative, Neutral
    topicFrequency: [
      {
        topic: { type: String, required: true },
        count: { type: Number, default: 1 }
      }
    ],
    complexityScore: { type: Number, default: 50 } // 0 to 100
  },
  sourceDocument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadedDocument',
    default: null
  }
}, {
  timestamps: true
});

// Add full text index on title and rawContent for searching
SummarySchema.index({ title: 'text', rawContent: 'text', keywords: 'text' });

module.exports = mongoose.model('Summary', SummarySchema);
