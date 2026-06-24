const Analysis = require('../models/Analysis')
const { parseResume } = require('../services/resumeParser')
const { analyzeWithGroq } = require('../services/groqService')

// POST /api/analysis
exports.createAnalysis = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume PDF is required.' })
    }

    const resumeText = await parseResume(req.file.buffer)
    const jobDescription = req.body.jobDescription || ''

    const groqResponse = await analyzeWithGroq(resumeText, jobDescription)

    const analysis = await Analysis.create({
      resumeText,
      jobDescription,
      groqResponse,
      status: 'completed',
    })

    res.status(201).json({ success: true, data: analysis })
  } catch (error) {
    next(error)
  }
}

// GET /api/analysis/:id
exports.getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id)
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found.' })
    }
    res.json({ success: true, data: analysis })
  } catch (error) {
    next(error)
  }
}
