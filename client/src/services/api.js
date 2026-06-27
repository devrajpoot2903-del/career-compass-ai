import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
})

/**
 * POST /api/analyze — multipart/form-data
 * @param {{ role, experience, skills, projectCount, resumeFile: File }} payload
 */
export const analyzeProfile = ({ role, experience, skills, projectCount, resumeFile }) => {
  const form = new FormData()
  form.append('resume', resumeFile)
  form.append('role', role)
  form.append('experience', experience)
  form.append('projectCount', String(projectCount))
  skills.forEach((s) => form.append('skills', s))

  return api.post('/api/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * GET /api/analysis/history
 * Returns all past analyses sorted newest first.
 */
export const getHistory = () => api.get('/api/analysis/history')

export default api
