const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are an expert career advisor and resume analyst.
Analyze the provided resume and job description (if given).
Return a structured JSON response with the following fields:
- matchScore: number (0-100)
- strengths: string[]
- gaps: string[]
- suggestions: string[]
- roadmap: { title: string, steps: string[] }[]`

/**
 * Sends resume text and optional job description to Groq for analysis.
 * @param {string} resumeText
 * @param {string} jobDescription
 * @returns {Promise<object>} Parsed Groq JSON response
 */
const analyzeWithGroq = async (resumeText, jobDescription = '') => {
  const userMessage = jobDescription
    ? `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`
    : `Resume:\n${resumeText}`

  const completion = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
  })

  const content = completion.choices[0]?.message?.content
  return JSON.parse(content)
}

module.exports = { analyzeWithGroq }
