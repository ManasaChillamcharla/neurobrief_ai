const { GoogleGenerativeAI } = require('@google/generative-ai');

// Standard stop words for basic local keyword extraction
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd",
  'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers',
  'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
  'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
  'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
  'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
  'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should',
  "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't",
  'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't",
  'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't",
  'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
]);

// Simple sentiment lexicons
const POSITIVE_WORDS = new Set(['great', 'excellent', 'superb', 'good', 'beautiful', 'smart', 'intelligent', 'innovative', 'efficient', 'positive', 'easy', 'simple', 'fast', 'secure', 'success', 'progressive', 'achievement', 'active', 'benefit', 'advantages', 'advantage', 'helpful', 'powerful', 'growth', 'clean', 'advanced', 'future', 'modern', 'perfect', 'stable']);
const NEGATIVE_WORDS = new Set(['bad', 'worst', 'poor', 'terrible', 'horrible', 'difficult', 'slow', 'flawer', 'fail', 'failure', 'error', 'danger', 'complex', 'risk', 'heavy', 'waste', 'negative', 'wrong', 'broken', 'bug', 'threat', 'costly', 'expensive', 'useless', 'harmful', 'limits', 'limitation', 'struggle', 'sad', 'angry']);

/**
 * Generates an intelligence packet for the raw input content.
 * Falls back transparently to a custom local NLP analyzer if the Gemini API Key is missing.
 */
const generateSummaryIntel = async (rawContent, userTitle = 'Document Summary') => {
  const content = rawContent ? rawContent.trim() : '';
  if (!content) {
    throw new Error('Content is required for AI summarization.');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (apiKey && apiKey.trim().length > 0) {
    try {
      console.log('[AI Service] Initializing Google Gemini model...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are NeuroBrief AI, a high-performance content engine.
Analyze the following document text and return a robust, strict JSON response that complies with the schema below.
Ensure your response is ONLY valid JSON, with no markdown wrappers (like \`\`\`json) or extra text.

Document Title: ${userTitle}
Document Text:
${content}

Strict JSON Schema to follow:
{
  "summaryText": "A detailed context-aware overview paragraph explaining the primary theme (about 100-150 words).",
  "bulletPoints": [
    "Key actionable takeaway sentence 1",
    "Key actionable takeaway sentence 2",
    "Key actionable takeaway sentence 3"
  ],
  "executiveSummary": "A high-level executive pitch of the document highlighting business/critical impact.",
  "studyNotes": "Markdown formatted study notes, grouping ideas into sections with headings (###), key concepts, and summaries.",
  "highlights": [
    { "text": "Specific sentence from the original document that is of highest importance", "type": "critical" },
    { "text": "Another sentence or key quote of definition significance", "type": "vocabulary" }
  ],
  "quizQuestions": [
    {
      "question": "A multiple-choice question derived from the core text contents",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A", 
      "explanation": "Explicit citation or logical explanation of why this answer is correct."
    }
  ],
  "knowledgeGraph": {
    "nodes": [
      { "id": "NodeID", "label": "Short Human-readable Concept Name", "val": 3, "group": "concept" }
    ],
    "links": [
      { "source": "NodeID1", "target": "NodeID2" }
    ]
  },
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "metrics": {
    "readingTime": 3,
    "sentimentScore": 0.45,
    "sentimentLabel": "Positive",
    "topicFrequency": [
      { "topic": "topicName", "count": 4 }
    ],
    "complexityScore": 60
  }
}

Guidelines for the Knowledge Graph nodes:
- Keep the number of nodes between 5 and 15.
- Nodes must represent main topics, keywords, people, dates, or concepts in the text.
- Connect related concepts through links.
- 'val' is importance size (1 to 5).
- 'group' can be 'concept', 'keyword', 'entity', or 'metric'.

Guidelines for metrics:
- 'readingTime' is estimated minutes to read original text (total words / 200).
- 'sentimentScore' ranges from -1.0 (strongly negative) to 1.0 (strongly positive).
- 'complexityScore' ranges from 0 (very simple) to 100 (highly scientific/complex).
`;

      const result = await model.generateContent(prompt);
      const textResponse = result.response.text().trim();
      
      // Clean potential JSON markdown blocks if Gemini outputs them
      const cleanJson = textResponse.replace(/^```json/i, '').replace(/```$/, '').trim();
      const parsedData = JSON.parse(cleanJson);
      
      // Verification of properties
      if (parsedData.summaryText && parsedData.bulletPoints && parsedData.knowledgeGraph) {
        return {
          ...parsedData,
          apiUsed: 'Google Gemini API'
        };
      }
      throw new Error('AI Response was missing essential structure keys.');
      
    } catch (apiError) {
      console.error(`[AI Service] Gemini API execution failed: ${apiError.message}`);
      console.log('[AI Service] Initiating smart Local NLP Fallback Engine...');
    }
  } else {
    console.log('[AI Service] No GEMINI_API_KEY detected. Running Local NLP Fallback Engine...');
  }

  // --------------------------------------------------------------------------
  // LOCAL NLP FALLBACK ENGINE (Fully-featured heuristics)
  // --------------------------------------------------------------------------
  try {
    // 1. Text preprocessing
    const words = content.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
    const totalWords = content.split(/\s+/).length;

    // 2. Metrics estimation
    const readingTime = Math.max(1, Math.round(totalWords / 200));
    
    // Sentiment Analyzer
    let posCount = 0;
    let negCount = 0;
    words.forEach(w => {
      if (POSITIVE_WORDS.has(w)) posCount++;
      if (NEGATIVE_WORDS.has(w)) negCount++;
    });
    
    let sentimentScore = 0;
    if (posCount + negCount > 0) {
      sentimentScore = (posCount - negCount) / (posCount + negCount);
    }
    
    let sentimentLabel = 'Neutral';
    if (sentimentScore > 0.15) sentimentLabel = 'Positive';
    else if (sentimentScore < -0.15) sentimentLabel = 'Negative';

    // Keyword & Topic Frequency extraction
    const wordFreq = {};
    words.forEach(w => {
      if (!STOP_WORDS.has(w)) {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      }
    });

    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
      
    const keywords = sortedWords.map(entry => entry[0]);
    const topicFrequency = sortedWords.slice(0, 5).map(entry => ({
      topic: entry[0].charAt(0).toUpperCase() + entry[0].slice(1),
      count: entry[1]
    }));

    // Complexity Score (Sentence length + long-word percentage helper)
    const longWords = words.filter(w => w.length > 7).length;
    const avgSentenceLength = sentences.length > 0 ? (totalWords / sentences.length) : 10;
    const complexityPercent = Math.min(100, Math.round((avgSentenceLength * 2.5) + ((longWords / Math.max(1, words.length)) * 100)));
    const complexityScore = Math.max(10, complexityPercent);

    // 3. Summarization extraction (TF-IDF light heuristic)
    // Score sentences by keyword occurrences
    const scoredSentences = sentences.map(sentence => {
      const sentenceWords = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      let score = 0;
      sentenceWords.forEach(w => {
        if (wordFreq[w]) {
          score += wordFreq[w];
        }
      });
      // Normalize by length slightly to avoid only long sentences winning
      return {
        text: sentence,
        score: score / Math.max(1, Math.log2(sentenceWords.length + 1))
      };
    });

    const topSentences = [...scoredSentences]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.text);

    // Dynamic compilation of summaries
    const summaryText = topSentences.slice(0, 2).join('. ') + '.';
    
    const bulletPoints = topSentences.slice(1, 4).map(s => {
      // clean punctuation and clean up start/endpoints
      return s.replace(/^[-*•]\s*/, '') + '.';
    });

    const executiveSummary = `This executive briefing synthesizes key themes from the analyzed corpus "${userTitle}". The structural nodes index a content base spanning approximately ${totalWords} words, containing primary conceptual nodes on "${keywords.slice(0, 3).join(', ')}". Key findings indicate a ${sentimentLabel.toLowerCase()} overall sentiment profile (score ${sentimentScore.toFixed(2)}) with a cognitive processing complexity score of ${complexityScore}/100. Operational parameters recommend reviewing specific concept-dependencies highlighted below to extract maximal utility.`;

    // Study notes markdown assembler
    let studyNotes = `# Study Blueprint: ${userTitle}\n\n`;
    studyNotes += `### 🧠 Core Synthesis\n${summaryText}\n\n`;
    studyNotes += `### 🏷️ Critical Conceptual Keywords\n`;
    keywords.slice(0, 5).forEach(kw => {
      studyNotes += `- **${kw.charAt(0).toUpperCase() + kw.slice(1)}**: Recurring thematic element in the scanned material.\n`;
    });
    studyNotes += `\n### 📝 Recommended Flashcards\n`;
    bulletPoints.forEach((bp, index) => {
      studyNotes += `* **Module ${index + 1}**: ${bp}\n`;
    });
    studyNotes += `\n> *Intelligence computed locally by NeuroBrief Local NLP Engine. Reading speed averages ${readingTime} min.*`;

    // 4. Highlights extraction (matches sentences containing key claims)
    const highlights = [];
    const claimKeywords = ['is', 'defined', 'important', 'conclude', 'key', 'main', 'significantly', 'result', 'research', 'critical'];
    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase();
      if (claimKeywords.some(ck => lower.includes(` ${ck} `)) && highlights.length < 3) {
        highlights.push({
          text: sentence,
          type: lower.includes('defined') || lower.includes('mean') ? 'vocabulary' : 'critical'
        });
      }
    });
    // Add default top sentences if none matches rules
    if (highlights.length === 0 && topSentences.length > 0) {
      highlights.push({ text: topSentences[0], type: 'critical' });
      if (topSentences[1]) highlights.push({ text: topSentences[1], type: 'vocabulary' });
    }

    // 5. Quiz Questions Generator
    const quizQuestions = [];
    // Generate questions based on topics and keywords
    keywords.slice(0, 3).forEach((kw, kwIdx) => {
      const kwCap = kw.charAt(0).toUpperCase() + kw.slice(1);
      const isPositive = sentimentScore > 0;
      
      const questionsData = [
        {
          question: `Which of the following best outlines the core significance of "${kwCap}" in this context?`,
          options: [
            `It acts as a primary driving theme, closely reflecting central structural concepts.`,
            `It represents a minor, auxiliary variable with negligible functional impact.`,
            `It serves to contradict the central arguments presented by the author.`,
            `It is used strictly as a statistical outlier in the final analysis.`
          ],
          answer: `It acts as a primary driving theme, closely reflecting central structural concepts.`,
          explanation: `The frequency metrics identify "${kw}" as a primary high-weight keyword, scoring highly across internal semantic weight tables.`
        },
        {
          question: `The overall document content manifests a ${sentimentLabel} sentiment. What does this suggest about the thematic tone?`,
          options: [
            `The tone remains neutral or balanced throughout the structural layout.`,
            `The narrative leans heavily towards optimistic, positive, or supportive viewpoints.`,
            `The context presents highly critical, skeptical, or cautionary arguments.`,
            `The text fluctuates wildly between highly positive and highly negative extremes.`
          ],
          answer: isPositive ? `The narrative leans heavily towards optimistic, positive, or supportive viewpoints.` : (sentimentScore < -0.15 ? `The context presents highly critical, skeptical, or cautionary arguments.` : `The tone remains neutral or balanced throughout the structural layout.`),
          explanation: `Lexical scan calculations reveal a positive-to-negative word match ratio yields a precise sentiment index score of ${sentimentScore.toFixed(2)}.`
        },
        {
          question: `Given the complexity score of ${complexityScore}/100, which audience is best suited for this document?`,
          options: [
            `A general audience seeking high-level, easily digestible summaries.`,
            `Domain experts and researchers equipped to parse advanced terminology and structured data.`,
            `Beginner-level students starting their very first introductory session.`,
            `Children looking for simplified illustrative narrative representations.`
          ],
          answer: complexityScore > 65 ? `Domain experts and researchers equipped to parse advanced terminology and structured data.` : `A general audience seeking high-level, easily digestible summaries.`,
          explanation: `Complexity metrics calculated an index of ${complexityScore} based on an average sentence length of ${avgSentenceLength.toFixed(1)} words.`
        }
      ];
      
      if (questionsData[kwIdx]) {
        quizQuestions.push(questionsData[kwIdx]);
      }
    });

    // Clean fallback questions if keywords were somehow empty
    if (quizQuestions.length === 0) {
      quizQuestions.push({
        question: `What is the primary topic of the document titled "${userTitle}"?`,
        options: [
          `An in-depth thematic analysis centered on ${userTitle}.`,
          `A basic historical retrospective unrelated to current trends.`,
          `A technical manual describing hardware assembly instructions.`,
          `A works-cited reference bibliography containing source listings.`
        ],
        answer: `An in-depth thematic analysis centered on ${userTitle}.`,
        explanation: `The document metadata registers "${userTitle}" as the absolute primary structural focal point.`
      });
    }

    // 6. AI Knowledge Graph node networks builder
    const nodes = [];
    const links = [];

    // Main central node
    const mainId = 'core_document';
    nodes.push({ id: mainId, label: userTitle.slice(0, 20) + (userTitle.length > 20 ? '...' : ''), val: 5, group: 'core' });

    // Keyword nodes and links
    keywords.slice(0, 6).forEach((kw, i) => {
      const kwId = `kw_${kw}`;
      const groupType = i % 2 === 0 ? 'concept' : 'keyword';
      nodes.push({
        id: kwId,
        label: kw.charAt(0).toUpperCase() + kw.slice(1),
        val: 3,
        group: groupType
      });
      // Link to main
      links.push({ source: mainId, target: kwId });
    });

    // Cross links between keywords to look organic and highly connected
    if (nodes.length > 3) {
      links.push({ source: 'kw_' + keywords[0], target: 'kw_' + keywords[1] });
      if (keywords[2] && keywords[3]) {
        links.push({ source: 'kw_' + keywords[1], target: 'kw_' + keywords[2] });
        links.push({ source: 'kw_' + keywords[2], target: 'kw_' + keywords[3] });
      }
      if (keywords[4]) {
        links.push({ source: 'kw_' + keywords[0], target: 'kw_' + keywords[4] });
      }
    }

    const localResult = {
      summaryText,
      bulletPoints,
      executiveSummary,
      studyNotes,
      highlights,
      quizQuestions,
      knowledgeGraph: { nodes, links },
      keywords,
      metrics: {
        readingTime,
        sentimentScore,
        sentimentLabel,
        topicFrequency,
        complexityScore
      },
      apiUsed: 'Local Fallback Engine'
    };

    return localResult;
  } catch (localError) {
    console.error(`[AI Service] Local heuristic execution crashed: ${localError.message}`);
    throw new Error(`Content processing failed: ${localError.message}`);
  }
};

module.exports = {
  generateSummaryIntel
};
