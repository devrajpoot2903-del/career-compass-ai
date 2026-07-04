import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => localStorage.getItem('cc_token'))
  const [loading, setLoading] = useState(true)   // true while restoring session

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('cc_token')
    if (!stored) { setLoading(false); return }

    axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then(({ data }) => { setUser(data.user); setToken(stored) })
      .catch(() => { localStorage.removeItem('cc_token'); setToken(null) })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post(`${BASE_URL}/api/auth/login`, { email, password })
    localStorage.setItem('cc_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const signup = useCallback(async (name, email, password) => {
    const { data } = await axios.post(`${BASE_URL}/api/auth/signup`, { name, email, password })
    localStorage.setItem('cc_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('cc_token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
