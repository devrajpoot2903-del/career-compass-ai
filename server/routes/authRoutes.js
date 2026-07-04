const express = require('express')
const router = express.Router()
const { signup, login, getMe, getProfile, updateProfile } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

router.post('/signup',   signup)
router.post('/login',    login)
router.get('/me',        protect, getMe)
router.get('/profile',   protect, getProfile)
router.patch('/profile', protect, updateProfile)

module.exports = router
