require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const errorHandler = require('./middleware/errorHandler')
const authRoutes = require('./routes/authRoutes')
const analysisRoutes = require('./routes/analysisRoutes')
const historyRoutes = require('./routes/historyRoutes')

const app = express()

// --- THE MOST BULLETPROOF CORS ---
app.use(cors({
    origin: "https://career-compass-ai-five-ecru.vercel.app", // Exact Vercel URL, no array, no function
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// --- Middlewares ---
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// --- Routes ----------------------------------------------------
app.use('/api/auth', authRoutes)
app.use('/api/analyze', analysisRoutes)
app.use('/api/analysis', historyRoutes)

// --- Health Check ----------------------------------------------
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// --- Error Handler (must be last) ------------------------------
app.use(errorHandler)

module.exports = app