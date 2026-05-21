const pdf = require('pdf-parse');

/**
 * Extracts raw text content from a PDF file buffer.
 * @param {Buffer} dataBuffer - The PDF file buffer.
 * @returns {Promise<string>} The extracted text content.
 */
const extractTextFromPDF = async (dataBuffer) => {
  try {
    if (!dataBuffer || dataBuffer.length === 0) {
      throw new Error('Empty PDF file buffer provided.');
    }
    const data = await pdf(dataBuffer);
    
    // Return extracted text or fallback
    if (data && data.text) {
      return data.text.trim();
    }
    throw new Error('No readable text content extracted from PDF.');
  } catch (error) {
    console.error(`[PDF Service Error] ${error.message}`);
    // If it fails, let's attempt to convert the buffer into basic string format as a safe fallback
    const basicString = dataBuffer.toString('utf-8');
    if (basicString && basicString.length > 50) {
      return basicString.replace(/[^\x20-\x7E\n\r]/g, ''); // strip binary control chars
    }
    throw new Error(`PDF text extraction failed: ${error.message}`);
  }
};

module.exports = {
  extractTextFromPDF
};
