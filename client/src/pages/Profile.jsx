import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

// ── Toast ─────────────────────────────────────────────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-xl transition-all
      ${type === 'success'
        ? 'bg-green-500/20 border border-green-500/40 text-green-300'
        : 'bg-red-500/20 border border-red-500/40 text-red-300'}`}
    >
      {type === 'success'
        ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        : <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      {message}
    </div>
  )
}

// ── Edit Modal ─────────────────────────────────────────────────────────────
function EditModal({ currentName, onClose, onSaved }) {
  const [name,     setName]     = useState(currentName)
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters.'); return
    }
    if (password && password !== confirm) {
      setError('Passwords do not match.'); return
    }
    if (!name.trim()) {
      setError('Name cannot be empty.'); return
    }

    const payload = {}
    if (name.trim() !== currentName) payload.name = name.trim()
    if (password) payload.password = password

    if (Object.keys(payload).length === 0) {
      onClose(); return
    }

    setLoading(true)
    try {
      const { data } = await api.patch('/api/auth/profile', payload)
      onSaved(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#13151c] border border-white/10 rounded-2xl p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0d0f14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              New Password <span className="text-gray-600">(leave blank to keep current)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-[#0d0f14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {password && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-[#0d0f14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 py-2.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Skeleton ───────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-[#0d0f14] text-white font-sans">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-[#13151c] border border-white/10 rounded-2xl p-8 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-white/10" />
            <div className="flex flex-col gap-3 flex-1">
              <div className="h-5 w-40 bg-white/10 rounded-md" />
              <div className="h-3 w-56 bg-white/10 rounded-md" />
              <div className="h-3 w-32 bg-white/10 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map(i => <div key={i} className="h-20 bg-white/10 rounded-xl" />)}
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Profile() {
  const { user: authUser, logout } = useAuth()
  const navigate = useNavigate()

  const [profile,    setProfile]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [showEdit,   setShowEdit]   = useState(false)
  const [toast,      setToast]      = useState(null)   // { message, type }

  useEffect(() => {
    api.get('/api/auth/profile')
      .then(({ data }) => setProfile(data.data))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSaved = (data) => {
    // Update local display
    setProfile((prev) => ({ ...prev, name: data.user.name }))
    setShowEdit(false)
    setToast({ message: 'Profile updated successfully!', type: 'success' })
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const initial = (profile?.name || authUser?.name || '?')[0].toUpperCase()

  if (loading) return <Skeleton />

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0f14] text-white font-sans">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-6 py-8 flex flex-col items-center gap-3 text-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Profile card */}
        <div className="bg-[#13151c] border border-white/10 rounded-2xl p-8">

          {/* Top row: avatar + info + edit button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
              {initial}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-xl font-semibold truncate">{profile.name}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{profile.email}</p>
              <p className="text-gray-600 text-xs mt-1.5">
                Member since {formatDate(profile.createdAt)}
              </p>
            </div>

            {/* Edit button */}
            <button
              onClick={() => setShowEdit(true)}
              className="flex-shrink-0 flex items-center gap-2 text-sm text-gray-300 hover:text-white border border-white/10 hover:border-indigo-500/40 bg-white/5 hover:bg-indigo-500/10 px-4 py-2 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-6" />

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Total analyses */}
            <div className="bg-[#0d0f14] border border-white/10 rounded-xl px-5 py-4">
              <p className="text-gray-500 text-xs font-medium mb-1">Total Analyses</p>
              <p className="text-white text-3xl font-bold">{profile.totalAnalyses}</p>
              <p className="text-gray-600 text-xs mt-1">resume{profile.totalAnalyses !== 1 ? 's' : ''} analysed</p>
            </div>

            {/* Activity */}
            <div className="bg-[#0d0f14] border border-white/10 rounded-xl px-5 py-4">
              <p className="text-gray-500 text-xs font-medium mb-1">Account Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-sm font-medium">Active</span>
              </div>
              <p className="text-gray-600 text-xs mt-2">JWT authenticated session</p>
            </div>
          </div>

          {/* Recent activity summary */}
          <div className="bg-[#0d0f14] border border-white/10 rounded-xl px-5 py-4">
            <p className="text-gray-500 text-xs font-medium mb-3">Recent Activity</p>
            {profile.totalAnalyses === 0 ? (
              <p className="text-gray-600 text-sm">No analyses yet. Upload your first resume to get started.</p>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {profile.totalAnalyses} {profile.totalAnalyses === 1 ? 'analysis' : 'analyses'} completed
                  </p>
                  <p className="text-gray-500 text-xs">View them in Analysis History on the home page</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit modal */}
      {showEdit && (
        <EditModal
          currentName={profile.name}
          onClose={() => setShowEdit(false)}
          onSaved={handleSaved}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  )
}
