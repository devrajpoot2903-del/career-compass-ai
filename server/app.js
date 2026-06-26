require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const errorHandler = require('./middleware/errorHandler')
const analysisRoutes = require('./routes/analysisRoutes')
const historyRoutes  = require('./routes/historyRoutes')

const app = express()

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(helmet())
// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/analyze',   analysisRoutes)
app.use('/api/analysis',  historyRoutes)

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// ── Error Handler (must be last) ───────────────────────────────────
app.use(errorHandler)

module.exports = app

