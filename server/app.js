require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const connectDB = require('./config/db')
const analysisRoutes = require('./routes/analysisRoutes')
const errorHandler = require('./middleware/errorHandler')

// Connect to MongoDB
connectDB()

const app = express()

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/analysis', analysisRoutes)

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// ── Error Handler (must be last) ───────────────────────────────────────────
app.use(errorHandler)

module.exports = app
