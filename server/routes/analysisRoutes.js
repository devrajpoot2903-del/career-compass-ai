const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const { protect } = require('../middleware/authMiddleware')
const { analyze } = require('../controllers/analysisController')

// POST /api/analyze — protected
router.post('/', protect, upload.single('resume'), analyze)

module.exports = router
