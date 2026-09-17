require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

const errorHandler = require('./middleware/errorHandler')
const authRoutes = require('./routes/authRoutes')
const analysisRoutes = require('./routes/analysisRoutes')
const historyRoutes = require('./routes/historyRoutes')

const app = express()

app.use(morgan('dev'))

// --- DYNAMIC GOD MODE CORS ---
app.use((req, res, next) => {
    // Ab yeh tera frontend URL Render ke dashboard (.env) se uthayega
    const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/analyze', analysisRoutes)
app.use('/api/analysis', historyRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use(errorHandler)

module.exports = app