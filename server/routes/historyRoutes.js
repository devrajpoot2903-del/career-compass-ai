const express = require('express')
const router = express.Router()
const { getHistory } = require('../controllers/analysisController')

// GET /api/analysis/history
router.get('/history', getHistory)

module.exports = router
