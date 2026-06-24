import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Analysis ─────────────────────────────────────────────────────────────────

/**
 * Upload a resume PDF and optional job description for analysis.
 * @param {FormData} formData - Must contain `resume` (File) and optionally `jobDescription` (string)
 */
export const analyzeResume = (formData) =>
  api.post('/api/analysis', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

/**
 * Fetch a previously saved analysis by ID.
 * @param {string} id
 */
export const getAnalysis = (id) => api.get(`/api/analysis/${id}`)

export default api
