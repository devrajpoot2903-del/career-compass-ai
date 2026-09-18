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

    const resumeText = await parseResume(req.file.path)
    fs.unlinkSync(req.file.path)

    const groqResult = await analyzeResume(resumeText)

    // --- SIRF LOGGED IN USERS KA DATA DB MEIN SAVE HOGA ---
    if (req.user) {
      await Analysis.create({
        user: req.user._id,
        targetRole: role,
        experience: experience,
        skills: Array.isArray(skills) ? skills : [skills].filter(Boolean),
        projectCount: Number(projectCount) || 0,
        score: groqResult.score,
        candidateLevel: groqResult.candidateLevel,
        strengths: groqResult.strengths,
        gaps: groqResult.gaps,
        altPaths: groqResult.altPaths,
        roadmap: groqResult.roadmap,
        resumeName: req.file.originalname,
      })
    }

    return res.status(200).json({ success: true, ...groqResult })
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    next(err)
  }
}

// GET /api/analysis/history — current user only
exports.getHistory = async (req, res, next) => {
  try {
    const records = await Analysis
      .find({ user: req.user._id })
      .select('_id resumeName targetRole experience score candidateLevel createdAt')
      .sort({ createdAt: -1 })

    return res.status(200).json({ success: true, count: records.length, data: records })
  } catch (err) {
    next(err)
  }
}

// GET /api/analysis/:id — ownership enforced
exports.getAnalysisById = async (req, res, next) => {
  try {
    const record = await Analysis.findById(req.params.id)

    if (!record) {
      return res.status(404).json({ success: false, message: 'Analysis not found.' })
    }
    if (record.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden. This is not your analysis.' })
    }

    return res.status(200).json({ success: true, data: record })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/analysis/:id — rename resumeName
exports.renameAnalysis = async (req, res, next) => {
  try {
    const { resumeName } = req.body

    if (!resumeName || !resumeName.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required.' })
    }
    if (resumeName.trim().length > 80) {
      return res.status(400).json({ success: false, message: 'Title must be 80 characters or fewer.' })
    }

    const record = await Analysis.findById(req.params.id)

    if (!record) {
      return res.status(404).json({ success: false, message: 'Analysis not found.' })
    }
    if (record.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden. This is not your analysis.' })
    }

    record.resumeName = resumeName.trim()
    await record.save()

    return res.status(200).json({
      success: true,
      message: 'Analysis renamed successfully.',
      resumeName: record.resumeName,
    })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/analysis/:id — ownership enforced
exports.deleteAnalysis = async (req, res, next) => {
  try {
    const record = await Analysis.findById(req.params.id)

    if (!record) {
      return res.status(404).json({ success: false, message: 'Analysis not found.' })
    }
    if (record.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden. This is not your analysis.' })
    }

    await record.deleteOne()

    return res.status(200).json({ success: true, message: 'Analysis deleted successfully.' })
  } catch (err) {
    next(err)
  }
}
