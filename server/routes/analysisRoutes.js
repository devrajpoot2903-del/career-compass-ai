const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const {
  createAnalysis,
  getAnalysisById,
} = require('../controllers/analysisController')

// POST /api/analysis  — upload resume + optional job description
router.post('/', upload.single('resume'), createAnalysis)

// GET  /api/analysis/:id — fetch saved analysis
router.get('/:id', getAnalysisById)

module.exports = router
