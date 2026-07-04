import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
})

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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

export const getHistory      = ()   => api.get('/api/analysis/history')
export const getAnalysisById = (id) => api.get(`/api/analysis/${id}`)

export default api
