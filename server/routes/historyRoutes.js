const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  getHistory,
  getAnalysisById,
  renameAnalysis,
  deleteAnalysis,
} = require('../controllers/analysisController')

// GET /api/analysis/history — protected
router.get('/history', protect, getHistory)

// GET  /api/analysis/:id — protected, ownership checked
router.get('/:id',    protect, getAnalysisById)

// PATCH /api/analysis/:id — rename, protected, ownership checked
router.patch('/:id',  protect, renameAnalysis)

// DELETE /api/analysis/:id — delete, protected, ownership checked
router.delete('/:id', protect, deleteAnalysis)

module.exports = router
