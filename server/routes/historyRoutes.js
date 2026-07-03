const express = require('express')
const router = express.Router()
const { getHistory, getAnalysisById } = require('../controllers/analysisController')

// GET /api/analysis/history
router.get('/history', getHistory)

// GET /api/analysis/:id
router.get('/:id', getAnalysisById)

module.exports = router
