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

/**
 * Tokenizes text and filters out punctuation and common stop words.
 * @param {string} text - The input text string.
 * @returns {Array<string>} List of clean lowercase words.
 */
const tokenize = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
};

/**
 * Computes the word frequencies (vector representation) of a token list.
 * @param {Array<string>} tokens - List of words.
 * @returns {Object} Term frequency mapping.
 */
const getFrequencies = (tokens) => {
  const freqs = {};
  tokens.forEach(token => {
    freqs[token] = (freqs[token] || 0) + 1;
  });
  return freqs;
};

/**
 * Computes Cosine Similarity between a query and a document text string.
 * @param {string} query - The search query.
 * @param {string} docText - The document body content.
 * @returns {number} The similarity score ranging from 0.0 to 1.0.
 */
const calculateCosineSimilarity = (query, docText) => {
  if (!query || !docText) return 0;
  
  const queryTokens = tokenize(query);
  const docTokens = tokenize(docText);
  
  if (queryTokens.length === 0 || docTokens.length === 0) return 0;
  
  const queryFreq = getFrequencies(queryTokens);
  const docFreq = getFrequencies(docTokens);
  
  // Find all unique terms across both vectors
  const allTerms = new Set([...Object.keys(queryFreq), ...Object.keys(docFreq)]);
  
  let dotProduct = 0;
  let magnitudeQuery = 0;
  let magnitudeDoc = 0;
  
  allTerms.forEach(term => {
    const qCount = queryFreq[term] || 0;
    const dCount = docFreq[term] || 0;
    
    dotProduct += qCount * dCount;
    magnitudeQuery += qCount * qCount;
    magnitudeDoc += dCount * dCount;
  });
  
  if (magnitudeQuery === 0 || magnitudeDoc === 0) return 0;
  
  return dotProduct / (Math.sqrt(magnitudeQuery) * Math.sqrt(magnitudeDoc));
};

module.exports = {
  calculateCosineSimilarity,
  tokenize
};
