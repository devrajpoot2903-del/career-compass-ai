import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * POST /api/analyze
 * @param {{ role, experience, skills, projectCount, resumeFileName }} payload
 */
export const analyzeProfile = (payload) => api.post('/api/analyze', payload)

export default api
