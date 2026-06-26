const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const { analyze } = require('../controllers/analysisController')

// POST /api/analyze — multipart/form-data (resume PDF + JSON fields)
router.post('/', upload.single('resume'), analyze)

module.exports = router
