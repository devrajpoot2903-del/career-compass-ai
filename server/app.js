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

// --- Bypassing CORS Completely for Testing (Nuclear Option) ---
app.use(cors({
    origin: function (origin, callback) {
        // Yeh har frontend URL ko allow kar dega (Vercel, Localhost, everything)
        callback(null, true);
    },
    credentials: true
}));



// --- Middlewares ---
app.use(helmet());
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