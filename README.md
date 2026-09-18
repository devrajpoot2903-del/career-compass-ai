 # Career Compass AI

🚀 **Live Demo:** [https://career-compass-ai-pink.vercel.app](https://career-compass-ai-pink.vercel.app)

> AI-powered resume analysis and personalised career roadmap generator.

Upload your resume PDF, choose your target role and experience level, and receive an instant AI-driven breakdown of your strengths, skill gaps, alternative career paths, and a step-by-step growth roadmap — all stored securely under your account or locally in Guest Mode.

---

## Features

| Feature | Description |
|---|---|
| **Guest Mode (No Auth Required)** | Try the app instantly without signing up. Reports are saved directly to browser `localStorage`. |
| **Resume Upload & Parsing** | PDF upload via Multer; text extracted with pdf-parse |
| **AI Analysis** | Resume text sent to Groq (LLaMA 3.1) — returns score, level, strengths, gaps, alt paths, roadmap |
| **Analysis History** | All analyses stored in MongoDB for registered users; view, rename, or delete any past report |
| **PDF Export** | Download any analysis as a professional A4 report instantly |
| **JWT Authentication** | Signup / Login / persistent session for permanent data storage |
| **High Performance** | Optimised frontend achieving 99/100 Lighthouse performance score |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, jsPDF |
| Backend | Node.js, Express 5, Multer |
| Database | MongoDB + Mongoose |
| AI | Groq API — `llama-3.1-8b-instant` |
| Auth | JWT (`jsonwebtoken`), `bcryptjs` |
| Cloud/Hosting | Render (Backend), Vercel (Frontend) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key — [console.groq.com](https://console.groq.com)

### Installation

```bash
# 1. Clone the repository
git clone [https://github.com/devrajpoot2903-del/career-compass-ai.git](https://github.com/devrajpoot2903-del/career-compass-ai.git)
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
| `CLIENT_URL` | Frontend origin for CORS (e.g., `http://localhost:5173` or Vercel URL) |
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

**Analysis**

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/analyze` | Public | Upload PDF + analyse (Saves to DB only if Auth provided) |
| `GET` | `/api/analysis/history` | JWT | User's analysis list |
| `GET` | `/api/analysis/:id` | JWT | Full analysis detail |
| `DELETE` | `/api/analysis/:id` | JWT | Delete analysis |

---

## Folder Structure

```
career-compass-ai/
├── client/                        # React + Vite frontend
│   └── src/
│       ├── components/            # Reusable UI components
│       ├── context/               # AuthContext (JWT + localStorage)
│       ├── pages/                 # Home, Login, Signup, Profile
│       ├── services/              # API connections (Axios)
│       └── utils/                 # exportPdf.js (jsPDF Logic)
│
└── server/                        # Node.js + Express backend
    ├── config/                    # DB connections
    ├── controllers/               # Auth & Analysis Logic
    ├── middleware/                # JWT protect(), Multer upload
    ├── models/                    # Mongoose Schemas
    ├── routes/                    # API Routing
    ├── services/                  # Groq AI & pdf-parse integrations
    └── app.js                     # Express app setup
```

---

## Architecture

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full flow diagram.

```
Browser (Guest or Auth User)
  └─ React (Vite)
       │  Axios + JWT header (if logged in)
       ▼
  Express (Node.js)
       │  Dynamic CORS validation
       ├─ POST /api/analyze
       │       │  Multer saves PDF to /uploads
       │       │  pdf-parse extracts text
       │       │  Groq API returns JSON analysis
       │       │  Analysis.create() → MongoDB (Skipped if Guest Mode)
       │       └─ JSON response to client (Saved to localStorage if Guest)
       │
       ├─ GET  /api/analysis/history   → MongoDB query
       └─ /api/auth/*                  → JWT signup/login/profile
```

---

## Deployment (Production)

### 1. Backend (Render)

1. Create a New Web Service on [Render](https://render.com).
2. Set Root Directory to `server`.
3. Build Command: `npm install` | Start Command: `node server.js`
4. Add all `.env` variables (Do not add `CLIENT_URL` until Vercel is deployed).

### 2. Frontend (Vercel)

1. Import repository to [Vercel](https://vercel.com).
2. Set Root Directory to `client`.
3. Add Environment Variable: `VITE_API_BASE_URL` = `https://your-render-backend-url.onrender.com`.
4. Deploy and copy the Vercel Production Domain.

### 3. The Final Handshake
1. Go back to Render Dashboard -> Environment Variables.
2. Add `CLIENT_URL` = `https://your-vercel-frontend-url.vercel.app` (Exact URL, no trailing slash).
3. Save and let Render auto-restart.

---

## Future Scope

- **Job Description Matching** — compare resume against a specific JD
- **Multi-resume Comparison** — side-by-side analysis of two resumes
- **LinkedIn Import** — parse profile URL instead of PDF upload
- **Admin Dashboard** — platform-wide analytics
