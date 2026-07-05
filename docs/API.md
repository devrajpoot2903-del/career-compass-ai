# Career Compass AI — REST API Reference

Base URL (development): `http://localhost:5000`

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication

### POST `/api/auth/signup`
Create a new user account.

**Body**
```json
{ "name": "Dev Rajpoot", "email": "dev@example.com", "password": "secret123" }
```

**Response `201`**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "name": "Dev Rajpoot", "email": "dev@example.com" }
}
```

---

### POST `/api/auth/login`
Login with email and password.

**Body**
```json
{ "email": "dev@example.com", "password": "secret123" }
```

**Response `200`**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "name": "Dev Rajpoot", "email": "dev@example.com" }
}
```

---

### GET `/api/auth/me` 🔒
Returns the currently authenticated user.

**Response `200`**
```json
{
  "success": true,
  "user": { "id": "...", "name": "Dev Rajpoot", "email": "dev@example.com" }
}
```

---

### GET `/api/auth/profile` 🔒
Returns the user's profile including total number of analyses.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "name": "Dev Rajpoot",
    "email": "dev@example.com",
    "createdAt": "2026-07-04T...",
    "totalAnalyses": 5
  }
}
```

---

### PATCH `/api/auth/profile` 🔒
Update name and/or password. Email is not editable.

**Body** (all fields optional)
```json
{ "name": "New Name", "password": "newpassword123" }
```

**Validation**
- `name`: min 2 characters
- `password`: min 6 characters

**Response `200`**
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "user": { "id": "...", "name": "New Name", "email": "dev@example.com" }
}
```

---

## Analysis

### POST `/api/analyze` 🔒
Upload a resume PDF and run AI analysis.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `resume` | File | ✅ | PDF file |
| `role` | string | ✅ | Target job role |
| `experience` | string | ✅ | Experience level |
| `skills` | string[] | optional | Current skills |
| `projectCount` | number | optional | Number of projects |

**Response `200`**
```json
{
  "success": true,
  "score": 78,
  "candidateLevel": "High Potential Candidate",
  "strengths": ["React", "Problem Solving"],
  "gaps": ["System Design", "Testing"],
  "altPaths": ["Frontend Developer", "MERN Developer"],
  "roadmap": ["Step 1: ...", "Step 2: ..."]
}
```

---

### GET `/api/analysis/history` 🔒
Returns all analyses for the authenticated user, newest first.

**Response `200`**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "resumeName": "my_resume.pdf",
      "targetRole": "Frontend Developer",
      "experience": "Senior (5-10 yrs)",
      "score": 78,
      "candidateLevel": "High Potential Candidate",
      "createdAt": "2026-07-04T..."
    }
  ]
}
```

---

### GET `/api/analysis/:id` 🔒
Returns the complete analysis document. Returns `403` if the analysis belongs to another user.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "user": "...",
    "resumeName": "my_resume.pdf",
    "targetRole": "Frontend Developer",
    "experience": "Senior (5-10 yrs)",
    "skills": ["React", "Node.js"],
    "projectCount": 3,
    "score": 78,
    "candidateLevel": "High Potential Candidate",
    "strengths": [...],
    "gaps": [...],
    "altPaths": [...],
    "roadmap": [...],
    "createdAt": "2026-07-04T...",
    "updatedAt": "2026-07-04T..."
  }
}
```

---

### PATCH `/api/analysis/:id` 🔒
Rename an analysis (updates `resumeName` field). Returns `403` for ownership violations.

**Body**
```json
{ "resumeName": "My Updated Resume Name" }
```

**Validation:** required, max 80 characters

**Response `200`**
```json
{
  "success": true,
  "message": "Analysis renamed successfully.",
  "resumeName": "My Updated Resume Name"
}
```

---

### DELETE `/api/analysis/:id` 🔒
Permanently delete an analysis. Returns `403` for ownership violations.

**Response `200`**
```json
{ "success": true, "message": "Analysis deleted successfully." }
```

---

## System

### GET `/api/health`
Server health check. No authentication required.

**Response `200`**
```json
{ "status": "ok" }
```

---

## Error Responses

All errors follow the same shape:

```json
{ "success": false, "message": "Human-readable error description." }
```

| Status | Meaning |
|---|---|
| `400` | Bad request / validation failed |
| `401` | Missing or invalid JWT |
| `403` | Forbidden — resource belongs to another user |
| `404` | Resource not found |
| `409` | Conflict — e.g. email already registered |
| `500` | Internal server error |
