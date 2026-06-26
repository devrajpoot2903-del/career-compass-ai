const { PDFParse } = require('pdf-parse')

/**
 * Parses a PDF from a disk path and returns the extracted plain text.
 * @param {string} filePath - Absolute path to the PDF on disk
 * @returns {Promise<string>} Extracted text content
 */
const parseResume = async (filePath) => {
  const parser = new PDFParse({ url: filePath })
  const result = await parser.getText()
  return result.text.trim()
}

module.exports = { parseResume }
