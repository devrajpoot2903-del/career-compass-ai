const pdfParse = require('pdf-parse')

/**
 * Parses a PDF buffer and returns the extracted plain text.
 * @param {Buffer} buffer - File buffer from Multer memory storage
 * @returns {Promise<string>} Extracted text content
 */
const parseResume = async (buffer) => {
  const data = await pdfParse(buffer)
  return data.text.trim()
}

module.exports = { parseResume }
