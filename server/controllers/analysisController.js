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

    const resumeText = await parseResume(req.file.path)

    fs.unlinkSync(req.file.path)
    console.log('  temp file deleted ✓')

    console.log('\n📄 Extracted Resume Text (first 500 chars):')
    console.log(resumeText.slice(0, 500))
    console.log('...')

    console.log('\n🤖 Sending to Groq...')
    const groqResult = await analyzeResume(resumeText)
    console.log('✅ Groq response received:', JSON.stringify(groqResult, null, 2))

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

    return res.status(200).json({
      success: true,
      ...groqResult,
    })
  } catch (err) {
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

// GET /api/analysis/:id
exports.getAnalysisById = async (req, res, next) => {
  try {
    const record = await Analysis.findById(req.params.id)

    if (!record) {
      return res.status(404).json({ success: false, message: 'Analysis not found.' })
    }

    return res.status(200).json({ success: true, data: record })
  } catch (err) {
    next(err)
  }
}
