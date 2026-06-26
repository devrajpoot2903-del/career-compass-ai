const express = require('express')
const router = express.Router()

// POST /api/analyze
// Receives: { role, experience, skills, projectCount, resumeFileName }
// Returns: mock analysis response
router.post('/', (req, res) => {
  const { role, experience, skills, projectCount, resumeFileName } = req.body

  console.log('📥 Analysis request received:')
  console.log('  role          :', role)
  console.log('  experience    :', experience)
  console.log('  skills        :', skills)
  console.log('  projectCount  :', projectCount)
  console.log('  resumeFileName:', resumeFileName)

  const mockResponse = {
    score: 78,
    candidateLevel: 'High Potential Candidate',
    strengths: [
      'React',
      'Problem Solving',
      'Project Experience',
    ],
    gaps: [
      'System Design',
      'Testing',
    ],
    altPaths: [
      'Frontend Developer',
      'MERN Developer',
    ],
  }

  res.status(200).json({ success: true, data: mockResponse })
})

module.exports = router
