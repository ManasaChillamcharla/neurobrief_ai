const Analytics = require('../models/Analytics');
const Summary = require('../models/Summary');

/**
 * @desc    Get dashboard metrics for user
 * @route   GET /api/analytics
 * @access  Private
 */
const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    let analytics = await Analytics.findOne({ user: userId });

    // Fallback if no summarization activities have occurred yet
    if (!analytics) {
      return res.json({
        success: true,
        analytics: {
          totalWordsProcessed: 0,
          totalSummariesCount: 0,
          readingTimeSaved: 0,
          sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
          topicFrequencies: [],
          averageComplexity: 0
        }
      });
    }

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error(`[Get Analytics Error] ${error.message}`);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

module.exports = {
  getUserAnalytics
};
