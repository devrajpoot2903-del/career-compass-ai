const Groq = require('groq-sdk')

const SYSTEM_PROMPT = `You are an expert career advisor and resume analyst.
Analyze the provided resume text and return ONLY a valid JSON object.
No markdown. No explanation. No code block. JSON only.

Required JSON structure:
{
  "score": <integer 0-100>,
  "candidateLevel": "<Beginner Candidate | Emerging Candidate | High Potential Candidate | Industry Ready Candidate>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "altPaths": ["<alt role 1>", "<alt role 2>"],
  "roadmap": ["<step 1>", "<step 2>", "<step 3>", "<step 4>"]
}`

/**
 * Sends extracted resume text to Groq and returns structured JSON analysis.
 * Client is instantiated inside the function so it always reads from
 * process.env AFTER dotenv has loaded in app.js.
 * @param {string} resumeText - Full extracted text from the PDF
 * @returns {Promise<object>} Parsed analysis JSON
 */
const analyzeResume = async (resumeText) => {
  // Instantiate here — NOT at module load time — so dotenv is already applied
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Analyze this resume:\n\n${resumeText}` },
    ],
    temperature: 0.3,
    max_tokens: 1024,
  })

  const raw = completion.choices[0]?.message?.content?.trim()
  if (!raw) throw new Error('Groq returned an empty response.')

  // Strip any accidental markdown fences before parsing
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()

  return JSON.parse(clean)
}

module.exports = { analyzeResume }
