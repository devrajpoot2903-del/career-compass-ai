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

app.use(cors(corsOptions));

// --- Middleware ------------------------------------------------
app.use(helmet())

// Robust CORS Configuration for Production (Vercel) & Local
const corsOptions = {
    origin: [
        process.env.CLIENT_URL,
        "https://career-compass-ai-five-ecru.vercel.app", // Tera live Vercel URL
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
};


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