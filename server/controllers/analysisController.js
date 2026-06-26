const fs = require('fs')
const { parseResume } = require('../services/resumeParser')
const { analyzeResume } = require('../services/groqService')
const Analysis = require('../models/Analysis')

// POST /api/analyze
exports.analyze = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No resume file uploaded.' })
    }

    const { role, experience, skills, projectCount } = req.body

    console.log('\n📥 [analyze] Request received:')
    console.log('  role          :', role)
    console.log('  experience    :', experience)
    console.log('  skills        :', skills)
    console.log('  projectCount  :', projectCount)
    console.log('  file saved to :', req.file.path)

    // Step 1: Extract text from PDF
    const resumeText = await parseResume(req.file.path)

    // Step 2: Delete temp file immediately after extraction
    fs.unlinkSync(req.file.path)
    console.log('  temp file deleted ✓')

    console.log('\n📄 Extracted Resume Text (first 500 chars):')
    console.log(resumeText.slice(0, 500))
    console.log('...')

    // Step 3: Send to Groq for analysis
    console.log('\n🤖 Sending to Groq...')
    const groqResult = await analyzeResume(resumeText)
    console.log('✅ Groq response received:', JSON.stringify(groqResult, null, 2))

    // Step 4: Save analysis to MongoDB
    const saved = await Analysis.create({
      targetRole:     role,
      experience:     experience,
      skills:         Array.isArray(skills) ? skills : [skills].filter(Boolean),
      projectCount:   Number(projectCount) || 0,
      score:          groqResult.score,
      candidateLevel: groqResult.candidateLevel,
      strengths:      groqResult.strengths,
      gaps:           groqResult.gaps,
      altPaths:       groqResult.altPaths,
      roadmap:        groqResult.roadmap,
      resumeName:     req.file.originalname,
    })
    console.log('💾 Analysis saved to MongoDB, id:', saved._id)

    // Step 5: Return Groq result — API response unchanged
    return res.status(200).json({
      success: true,
      ...groqResult,
    })
  } catch (err) {
    // Clean up temp file if anything fails before deletion
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    next(err)
  }
}

// GET /api/analysis/history
exports.getHistory = async (_req, res, next) => {
  try {
    const records = await Analysis
      .find()
      .select('_id resumeName targetRole experience score candidateLevel createdAt')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count:   records.length,
      data:    records,
    })
  } catch (err) {
    next(err)
  }
}
