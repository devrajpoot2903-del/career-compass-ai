const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getHistory, getAnalysisById } = require('../controllers/analysisController')

// GET /api/analysis/history — protected
router.get('/history', protect, getHistory)

// GET /api/analysis/:id — protected
router.get('/:id', protect, getAnalysisById)

module.exports = router
