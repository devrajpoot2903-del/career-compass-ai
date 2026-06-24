# Career Compass AI

AI-powered resume analysis and career roadmap generator.

## Tech Stack

- **Client**: React + Vite + Tailwind CSS
- **Server**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **AI**: Groq API (llama3-8b-8192)
- **PDF Parsing**: pdf-parse

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Groq API key

### Installation

```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Environment Variables

Copy the example files and fill in your credentials:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### Running in Development

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analysis` | Upload resume PDF + optional job description |
| `GET` | `/api/analysis/:id` | Fetch a saved analysis |
| `GET` | `/api/health` | Server health check |

## Project Structure

```
career-compass-ai/
├── client/          # React + Vite frontend
├── server/          # Express backend
├── .gitignore
└── README.md
```
