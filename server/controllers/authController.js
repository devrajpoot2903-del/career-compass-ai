const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Analysis = require('../models/Analysis')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// POST /api/auth/signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use.' })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, password: hashed })

    const token = signToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })
    }

    const token = signToken(user._id)

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  })
}

// GET /api/auth/profile
exports.getProfile = async (req, res, next) => {
  try {
    const totalAnalyses = await Analysis.countDocuments({ user: req.user._id })

    res.status(200).json({
      success: true,
      data: {
        name:           req.user.name,
        email:          req.user.email,
        createdAt:      req.user.createdAt,
        totalAnalyses,
      },
    })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, password } = req.body
    const updates = {}

    if (name) {
      if (name.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' })
      }
      updates.name = name.trim()
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' })
      }
      updates.password = await bcrypt.hash(password, 12)
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'Nothing to update.' })
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password')

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: { id: updated._id, name: updated.name, email: updated.email },
    })
  } catch (err) {
    next(err)
  }
}
