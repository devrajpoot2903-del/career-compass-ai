# Career Compass AI

> AI-powered resume analysis and personalised career roadmap generator.

Upload your resume PDF, choose your target role and experience level, and receive an instant AI-driven breakdown of your strengths, skill gaps, alternative career paths, and a step-by-step growth roadmap — all stored securely under your account.

---

## Features

| Feature | Description |
|---|---|
| **Resume Upload & Parsing** | PDF upload via Multer; text extracted with pdf-parse |
| **AI Analysis** | Resume text sent to Groq (LLaMA 3.1) — returns score, level, strengths, gaps, alt paths, roadmap |
| **Analysis History** | All analyses stored in MongoDB; view, rename, or delete any past report |
| **Analysis Details** | Dedicated page for any historical analysis with full breakdown |
| **PDF Export** | Download any analysis as a professional A4 report |
| **JWT Authentication** | Signup / Login / persistent session via localStorage |
| **User Profile** | View account info, total analyses, edit name and password |
| **Ownership Enforcement** | Every API endpoint verifies the requesting user owns the resource |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, jsPDF |
| Backend | Node.js, Express 5, Multer |
| Database | MongoDB + Mongoose |
| AI | Groq API — `llama-3.1-8b-instant` |
| Auth | JWT (`jsonwebtoken`), `bcryptjs` |
| PDF Parse | `pdf-parse` v2 |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key — [console.groq.com](https://console.groq.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/devrajpoot2903-del/career-compass-ai.git
cd career-compass-ai

# 2. Install server dependencies
cd server && npm install

# 3. Install client dependencies
cd ../client && npm install
```

### Environment Variables

```bash
# Copy the example file
cp server/.env.example server/.env
```

Fill in `server/.env`:

| Variable | Description |
|---|---|
| `PORT` | Express server port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `GROQ_API_KEY` | Your Groq API key |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend origin for CORS (default `http://localhost:5173`) |
| `JWT_SECRET` | Random secret string for signing JWTs (min 32 chars) |
| `JWT_EXPIRES_IN` | Token expiry e.g. `7d` |

### Running in Development

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client && npm run dev
```

---

## API Endpoints

See [`docs/API.md`](docs/API.md) for the full reference.

**Auth**

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Create account |
| `POST` | `/api/auth/login` | Public | Login, receive JWT |
| `GET` | `/api/auth/me` | JWT | Current user info |
| `GET` | `/api/auth/profile` | JWT | Profile + total analyses |
| `PATCH` | `/api/auth/profile` | JWT | Update name / password |

**Analysis**

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/analyze` | JWT | Upload PDF + analyse |
| `GET` | `/api/analysis/history` | JWT | User's analysis list |
| `GET` | `/api/analysis/:id` | JWT | Full analysis detail |
| `PATCH` | `/api/analysis/:id` | JWT | Rename analysis |
| `DELETE` | `/api/analysis/:id` | JWT | Delete analysis |

**System**

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server health check |

---

## Folder Structure

```
career-compass-ai/
├── client/                        # React + Vite frontend
│   └── src/
│       ├── components/            # Reusable UI components
│       │   ├── AnalysisForm.jsx
│       │   ├── Hero.jsx
│       │   ├── HistoryCard.jsx
│       │   ├── HistoryPanel.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── ResultCards.jsx
│       │   └── Roadmap.jsx
│       ├── context/
│       │   └── AuthContext.jsx    # JWT state + localStorage
│       ├── pages/
│       │   ├── AnalysisDetail.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Profile.jsx
│       │   └── Signup.jsx
│       ├── services/
│       │   └── api.js             # Axios instance + all API helpers
│       └── utils/
│           └── exportPdf.js       # jsPDF report generator
│
└── server/                        # Node.js + Express backend
    ├── config/
    │   └── db.js                  # MongoDB connection
    ├── controllers/
    │   ├── analysisController.js  # Analysis CRUD
    │   └── authController.js      # Auth + profile
    ├── middleware/
    │   ├── authMiddleware.js      # JWT protect()
    │   ├── errorHandler.js        # Global error handler
    │   └── upload.js              # Multer config
    ├── models/
    │   ├── Analysis.js
    │   └── User.js
    ├── routes/
    │   ├── analysisRoutes.js      # POST /api/analyze
    │   ├── authRoutes.js          # /api/auth/*
    │   └── historyRoutes.js       # /api/analysis/*
    ├── services/
    │   ├── groqService.js         # Groq AI integration
    │   └── resumeParser.js        # pdf-parse wrapper
    ├── app.js                     # Express app config
    └── server.js                  # Entry point
```

---

## Architecture

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full flow diagram.

```
Browser
  └─ React (Vite)
       │  Axios + JWT header
       ▼
  Express (Node.js)
       │  protect() middleware verifies JWT
       ├─ POST /api/analyze
       │       │  Multer saves PDF to /uploads
       │       │  pdf-parse extracts text
       │       │  Groq API returns JSON analysis
       │       │  Analysis.create() → MongoDB
       │       └─ JSON response to client
       │
       ├─ GET  /api/analysis/history   → MongoDB query (user-scoped)
       ├─ GET  /api/analysis/:id       → MongoDB findById + ownership
       ├─ PATCH /api/analysis/:id      → rename resumeName
       ├─ DELETE /api/analysis/:id     → deleteOne
       └─ /api/auth/*                  → JWT signup/login/profile
```

---

## Deployment

### Backend (e.g. Railway, Render, Heroku)

1. Set all environment variables from `.env.example` in the platform dashboard
2. Build command: `npm install`
3. Start command: `node server.js`

### Frontend (e.g. Vercel, Netlify)

1. Set `VITE_API_BASE_URL=https://your-backend-url.com` as an environment variable
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## Future Scope

- **Job Description Matching** — compare resume against a specific JD
- **Multi-resume Comparison** — side-by-side analysis of two resumes
- **Email Reports** — send PDF report to user's inbox
- **LinkedIn Import** — parse profile URL instead of PDF upload
- **Admin Dashboard** — platform-wide analytics
- **Subscription Tiers** — rate limiting and premium analysis models
