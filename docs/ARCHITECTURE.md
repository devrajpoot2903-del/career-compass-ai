# Career Compass AI — Architecture

## System Overview

Career Compass AI is a full-stack MERN application split into a React frontend and a Node.js/Express backend. All AI processing is delegated to the Groq cloud API; no model runs locally.

---

## High-Level Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                 │
│                                                                 │
│   React (Vite) + Tailwind CSS                                   │
│   ┌────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│   │  Auth Pages│  │  Home Page   │  │  Analysis Detail     │   │
│   │ Login/Signup│  │ Form+History │  │  + PDF Export        │   │
│   └────────────┘  └──────────────┘  └──────────────────────┘   │
│                         │                                       │
│         AuthContext (JWT stored in localStorage)                │
│                         │ Axios + Authorization: Bearer <jwt>   │
└─────────────────────────┼───────────────────────────────────────┘
                          │ HTTP / REST
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER (port 5000)                   │
│                                                                 │
│  Morgan (logging) → Helmet (security) → CORS → JSON parser     │
│                          │                                      │
│             protect() middleware (JWT verify)                   │
│                          │                                      │
│   ┌──────────────────────┼──────────────────────────────────┐  │
│   │                   ROUTES                                 │  │
│   │  /api/auth/*     authRoutes.js  → authController.js     │  │
│   │  /api/analyze    analysisRoutes.js → analysisController  │  │
│   │  /api/analysis/* historyRoutes.js → analysisController  │  │
│   └──────────────────────────────────────────────────────────┘  │
│                          │                                      │
│   ┌──────────────────────┼──────────────────────────────────┐  │
│   │                 SERVICES                                  │  │
│   │                                                          │  │
│   │  resumeParser.js          groqService.js                 │  │
│   │  ┌─────────────────┐     ┌──────────────────────────┐   │  │
│   │  │ Multer saves PDF│────▶│ pdf-parse extracts text  │   │  │
│   │  │ to /uploads/    │     └──────────┬───────────────┘   │  │
│   │  └─────────────────┘                │ resumeText        │  │
│   │                                     ▼                   │  │
│   │                         ┌──────────────────────────┐   │  │
│   │                         │ Groq API (LLaMA 3.1)     │   │  │
│   │                         │ Returns JSON:            │   │  │
│   │                         │  score, level, strengths,│   │  │
│   │                         │  gaps, altPaths, roadmap │   │  │
│   │                         └──────────┬───────────────┘   │  │
│   └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MONGODB                                 │
│                                                                 │
│   Collection: users         Collection: analyses                │
│   ┌─────────────────┐       ┌────────────────────────────────┐  │
│   │ _id             │       │ _id                            │  │
│   │ name            │ ◀─ref─│ user (ObjectId)                │  │
│   │ email (unique)  │       │ targetRole, experience, skills  │  │
│   │ password (hash) │       │ score, candidateLevel          │  │
│   │ createdAt       │       │ strengths, gaps, altPaths      │  │
│   └─────────────────┘       │ roadmap, resumeName            │  │
│                             │ createdAt, updatedAt           │  │
│                             └────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Lifecycle — POST /api/analyze

```
1. Client submits form (PDF file + metadata)
       │
2. Axios sends multipart/form-data + Bearer token
       │
3. protect() verifies JWT → attaches req.user
       │
4. Multer saves PDF to server/uploads/<uuid>.pdf
       │
5. resumeParser.js reads file → pdf-parse extracts plain text
       │
6. Temp file deleted from disk (fs.unlinkSync)
       │
7. groqService.js sends [systemPrompt + resumeText] to Groq API
       │
8. Groq returns JSON string → parsed to object
       │
9. Analysis.create() persists full record to MongoDB
       │
10. res.json({ success: true, ...groqResult }) → client
       │
11. Frontend renders ResultCards + Roadmap
```

---

## Authentication Flow

```
Signup / Login
  └─ bcrypt.hash(password) → User.create()
  └─ jwt.sign({ id }) → token returned to client
  └─ Client stores token in localStorage

Subsequent Requests
  └─ AuthContext reads localStorage → attaches Authorization header
  └─ protect() → jwt.verify() → User.findById() → req.user
  └─ Controller uses req.user._id for all queries/ownership checks

Session Restore (page refresh)
  └─ AuthContext useEffect → GET /api/auth/me with stored token
  └─ Sets user state if token is valid; clears localStorage if expired
```

---

## Frontend State Management

No Redux. State lives in:

| Location | What it holds |
|---|---|
| `AuthContext` | Authenticated user, JWT token, login/logout/signup functions |
| `Home.jsx` | Analysis form values, current AI result |
| `HistoryPanel.jsx` | History records list, rename/delete modal state |
| `Profile.jsx` | Profile data, edit modal state |
| `AnalysisDetail.jsx` | Single fetched analysis record |

---

## Security Model

- **JWT** — stateless, 7-day expiry, signed with `JWT_SECRET`
- **bcryptjs** — cost factor 12 for password hashing
- **Ownership enforcement** — every analysis endpoint checks `record.user === req.user._id`
- **Helmet** — sets security HTTP headers
- **CORS** — restricted to `CLIENT_URL`
- **Multer** — file type and size validated at upload
- **No resume text persisted** — only AI output is stored in MongoDB
