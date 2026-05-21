const Summary = require('../models/Summary');
const UploadedDocument = require('../models/UploadedDocument');
const Analytics = require('../models/Analytics');
const AIHistory = require('../models/AIHistory');
const { extractTextFromPDF } = require('../services/pdfService');
const { generateSummaryIntel } = require('../services/aiService');
const { calculateCosineSimilarity } = require('../utils/helpers');

/**
 * Utility helper to update user analytics cache aggregates on new summary creation.
 */
const updateAnalyticsCache = async (userId, wordCount, readingTimeSaved, sentimentLabel, complexityScore, topicFrequency) => {
  try {
    let analytics = await Analytics.findOne({ user: userId });
    
    if (!analytics) {
      analytics = new Analytics({
        user: userId,
        totalWordsProcessed: 0,
        totalSummariesCount: 0,
        readingTimeSaved: 0,
        sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
        topicFrequencies: [],
        averageComplexity: 50
      });
    }

    analytics.totalWordsProcessed += wordCount;
    analytics.totalSummariesCount += 1;
    analytics.readingTimeSaved += readingTimeSaved;

    // Increment sentiment count
    const label = (sentimentLabel || 'Neutral').toLowerCase();
    if (label === 'positive') analytics.sentimentDistribution.positive += 1;
    else if (label === 'negative') analytics.sentimentDistribution.negative += 1;
    else analytics.sentimentDistribution.neutral += 1;

    // Recalculate average complexity
    analytics.averageComplexity = Math.round(
      ((analytics.averageComplexity * (analytics.totalSummariesCount - 1)) + complexityScore) / analytics.totalSummariesCount
    );

    // Merge topic frequencies
    const topicMap = new Map(analytics.topicFrequencies.map(t => [t.topic, t.count]));
    if (topicFrequency && Array.isArray(topicFrequency)) {
      topicFrequency.forEach(t => {
        const currentCount = topicMap.get(t.topic) || 0;
        topicMap.set(t.topic, currentCount + t.count);
      });
    }
    
    analytics.topicFrequencies = Array.from(topicMap.entries()).map(([topic, count]) => ({
      topic,
      count
    }));

    await analytics.save();
  } catch (error) {
    console.error(`[Analytics Cache Error] Failed to update: ${error.message}`);
  }
};

/**
 * @desc    Generate summary from text paste
 * @route   POST /api/summaries/text
 * @access  Private
 */
const createSummaryFromText = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user._id;

    if (!title || !content || content.trim().length < 50) {
      return res.status(400).json({ 
        success: false, 
        message: 'A title and a substantive document body (at least 50 characters) are required.' 
      });
    }

    console.log(`[Summary Controller] Generating AI profile for user: ${userId}`);
    
    // Call AI / NLP service
    const aiIntel = await generateSummaryIntel(content, title);
    const wordCount = content.split(/\s+/).length;
    const estimatedSaved = Math.max(1, Math.round(wordCount / 200) - aiIntel.metrics.readingTime);

    // Create Mongoose record
    const summary = await Summary.create({
      user: userId,
      title: title.trim(),
      rawContent: content.trim(),
      summaryText: aiIntel.summaryText,
      bulletPoints: aiIntel.bulletPoints,
      executiveSummary: aiIntel.executiveSummary,
      studyNotes: aiIntel.studyNotes,
      highlights: aiIntel.highlights,
      quizQuestions: aiIntel.quizQuestions,
      knowledgeGraph: aiIntel.knowledgeGraph,
      keywords: aiIntel.keywords,
      metrics: aiIntel.metrics
    });

    // Update Dashboard aggregates
    await updateAnalyticsCache(
      userId, 
      wordCount, 
      estimatedSaved, 
      aiIntel.metrics.sentimentLabel, 
      aiIntel.metrics.complexityScore,
      aiIntel.metrics.topicFrequency
    );

    // Audit Log AI requests
    await AIHistory.create({
      user: userId,
      actionType: 'SUMMARIZE',
      inputLength: content.length,
      outputLength: JSON.stringify(aiIntel).length,
      apiUsed: aiIntel.apiUsed,
      success: true
    });

    res.status(201).json({
      success: true,
      message: `Content processed successfully via ${aiIntel.apiUsed}`,
      summary
    });

  } catch (error) {
    console.error(`[Summary Text Error] ${error.stack}`);
    res.status(500).json({ success: false, message: `Summarization crashed: ${error.message}` });
  }
};

/**
 * @desc    Upload document and generate summary
 * @route   POST /api/summaries/upload
 * @access  Private
 */
const createSummaryFromUpload = async (req, res) => {
  try {
    const userId = req.user._id;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF or plain text file' });
    }

    const { originalname, mimetype, buffer, size } = req.file;
    const documentTitle = req.body.title || originalname.replace(/\.[^/.]+$/, ""); // strip extension if title not provided

    let extractedText = '';

    console.log(`[Summary Controller] Processing file upload: ${originalname} (${size} bytes)`);

    if (mimetype === 'application/pdf') {
      extractedText = await extractTextFromPDF(buffer);
    } else {
      // txt or plain
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({ 
        success: false, 
        message: 'Extracted text is too short. Please upload a PDF containing searchable, indexable text.' 
      });
    }

    // Call AI / NLP service
    const aiIntel = await generateSummaryIntel(extractedText, documentTitle);
    const wordCount = extractedText.split(/\s+/).length;
    const estimatedSaved = Math.max(1, Math.round(wordCount / 200) - aiIntel.metrics.readingTime);

    // 1. Save Document source
    const docSource = await UploadedDocument.create({
      user: userId,
      fileName: originalname,
      fileSize: size,
      mimeType: mimetype,
      filePath: 'in-memory-parsed', // since serverless keeps files in-memory
      textLength: extractedText.length
    });

    // 2. Save Summary linked to doc source
    const summary = await Summary.create({
      user: userId,
      title: documentTitle,
      rawContent: extractedText.trim(),
      summaryText: aiIntel.summaryText,
      bulletPoints: aiIntel.bulletPoints,
      executiveSummary: aiIntel.executiveSummary,
      studyNotes: aiIntel.studyNotes,
      highlights: aiIntel.highlights,
      quizQuestions: aiIntel.quizQuestions,
      knowledgeGraph: aiIntel.knowledgeGraph,
      keywords: aiIntel.keywords,
      metrics: aiIntel.metrics,
      sourceDocument: docSource._id
    });

    // 3. Update dashboard analytics
    await updateAnalyticsCache(
      userId, 
      wordCount, 
      estimatedSaved, 
      aiIntel.metrics.sentimentLabel, 
      aiIntel.metrics.complexityScore,
      aiIntel.metrics.topicFrequency
    );

    // 4. Audit Log
    await AIHistory.create({
      user: userId,
      actionType: 'FILE_UPLOAD_SUMMARIZE',
      inputLength: extractedText.length,
      outputLength: JSON.stringify(aiIntel).length,
      apiUsed: aiIntel.apiUsed,
      success: true
    });

    res.status(201).json({
      success: true,
      message: `File parsed and summarized via ${aiIntel.apiUsed}`,
      summary
    });

  } catch (error) {
    console.error(`[Summary Upload Error] ${error.stack}`);
    res.status(500).json({ success: false, message: `File parsing failed: ${error.message}` });
  }
};

/**
 * @desc    Get all summaries for a user (Memory Vault)
 * @route   GET /api/summaries
 * @access  Private
 */
const getAllSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find({ user: req.user._id })
      .select('title keywords metrics createdAt summaryText')
      .sort({ createdAt: -1 });
      
    res.json({
      success: true,
      count: summaries.length,
      summaries
    });
  } catch (error) {
    console.error(`[Get All Summaries Error] ${error.message}`);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

/**
 * @desc    Get detailed summary by ID
 * @route   GET /api/summaries/:id
 * @access  Private
 */
const getSummaryById = async (req, res) => {
  try {
    const summary = await Summary.findOne({ _id: req.params.id, user: req.user._id });

    if (!summary) {
      return res.status(404).json({ success: false, message: 'Summary profile not found.' });
    }

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error(`[Get Summary Error] ${error.message}`);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

/**
 * @desc    Delete summary profile
 * @route   DELETE /api/summaries/:id
 * @access  Private
 */
const deleteSummary = async (req, res) => {
  try {
    const summary = await Summary.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!summary) {
      return res.status(404).json({ success: false, message: 'Summary profile not found.' });
    }

    // Recalculate and decrease Analytics cache metrics
    let analytics = await Analytics.findOne({ user: req.user._id });
    if (analytics) {
      const wordCount = summary.rawContent.split(/\s+/).length;
      const estimatedSaved = Math.max(1, Math.round(wordCount / 200) - summary.metrics.readingTime);

      analytics.totalWordsProcessed = Math.max(0, analytics.totalWordsProcessed - wordCount);
      analytics.totalSummariesCount = Math.max(0, analytics.totalSummariesCount - 1);
      analytics.readingTimeSaved = Math.max(0, analytics.readingTimeSaved - estimatedSaved);
      
      const label = (summary.metrics.sentimentLabel || 'Neutral').toLowerCase();
      if (label === 'positive') analytics.sentimentDistribution.positive = Math.max(0, analytics.sentimentDistribution.positive - 1);
      else if (label === 'negative') analytics.sentimentDistribution.negative = Math.max(0, analytics.sentimentDistribution.negative - 1);
      else analytics.sentimentDistribution.neutral = Math.max(0, analytics.sentimentDistribution.neutral - 1);

      await analytics.save();
    }

    res.json({
      success: true,
      message: 'Summary successfully removed from memory vaults.'
    });
  } catch (error) {
    console.error(`[Delete Summary Error] ${error.message}`);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

/**
 * @desc    Semantic search summaries
 * @route   POST /api/summaries/search
 * @access  Private
 */
const searchSummaries = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide a search query term' });
    }

    console.log(`[Semantic Search] Running TF-IDF Cosine Similarity for query: "${query}"`);
    
    // Fetch all user summaries
    const summaries = await Summary.find({ user: req.user._id });
    
    // Score each summary based on bag-of-words cosine similarity
    const matches = summaries.map(sum => {
      // Combine rawContent, keywords, and title to build the context
      const searchContext = `${sum.title} ${sum.keywords.join(' ')} ${sum.rawContent}`;
      const score = calculateCosineSimilarity(query, searchContext);
      return {
        _id: sum._id,
        title: sum.title,
        summaryText: sum.summaryText,
        keywords: sum.keywords,
        metrics: sum.metrics,
        createdAt: sum.createdAt,
        score: parseFloat(score.toFixed(4))
      };
    })
    // Filter out zero similarity scores
    .filter(match => match.score > 0.01)
    // Sort descending by similarity rating
    .sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      query,
      count: matches.length,
      matches
    });

  } catch (error) {
    console.error(`[Semantic Search Error] ${error.message}`);
    res.status(500).json({ success: false, message: `Semantic search execution failed: ${error.message}` });
  }
};

module.exports = {
  createSummaryFromText,
  createSummaryFromUpload,
  getAllSummaries,
  getSummaryById,
  deleteSummary,
  searchSummaries
};
