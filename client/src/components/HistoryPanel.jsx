import { useState, useEffect, useCallback } from 'react'
import { getHistory, renameAnalysis, deleteAnalysis } from '../services/api'
import HistoryCard from './HistoryCard'

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-xl
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

// ── Rename Modal ───────────────────────────────────────────────────────────
function RenameModal({ id, current, onClose, onRenamed }) {
  const [value,   setValue]   = useState(current)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!value.trim())             { setError('Title is required.');                      return }
    if (value.trim().length > 80)  { setError('Title must be 80 characters or fewer.');   return }
    setLoading(true)
    try {
      await renameAnalysis(id, value.trim())
      onRenamed(id, value.trim())
    } catch (err) {
      setError(err?.response?.data?.message || 'Rename failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#13151c] border border-white/10 rounded-2xl p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Rename Analysis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4 text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              New Title <span className="text-gray-600">({value.length}/80)</span>
            </label>
            <input
              autoFocus
              type="text"
              value={value}
              maxLength={80}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-[#0d0f14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex gap-3">
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
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Confirm Delete Modal ───────────────────────────────────────────────────
function DeleteModal({ id, title, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const handleDelete = async () => {
    setError(null)
    setLoading(true)
    try {
      await deleteAnalysis(id)
      onDeleted(id)
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#13151c] border border-white/10 rounded-2xl p-7 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-semibold">Delete Analysis</h2>
            <p className="text-gray-500 text-xs mt-0.5">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-5">
          Are you sure you want to delete <span className="text-white font-medium">"{title}"</span>?
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4 text-red-400 text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 text-sm bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── HistoryPanel ───────────────────────────────────────────────────────────
export default function HistoryPanel() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [toast,   setToast]   = useState(null)   // { message, type }

  // modal state: { type: 'rename'|'delete', id, title }
  const [modal, setModal] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getHistory()
      .then(({ data }) => { if (!cancelled) setRecords(data.data ?? []) })
      .catch((err) => { if (!cancelled) setError(err?.response?.data?.message || err.message || 'Failed to load history.') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  // Optimistic rename
  const handleRenamed = useCallback((id, newName) => {
    setRecords((prev) => prev.map((r) => r._id === id ? { ...r, resumeName: newName } : r))
    setModal(null)
    setToast({ message: 'Analysis renamed successfully.', type: 'success' })
  }, [])

  // Optimistic delete
  const handleDeleted = useCallback((id) => {
    setRecords((prev) => prev.filter((r) => r._id !== id))
    setModal(null)
    setToast({ message: 'Analysis deleted.', type: 'success' })
  }, [])

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-xl">Analysis History</h2>
          <p className="text-gray-500 text-xs mt-0.5">Your previous resume analyses</p>
        </div>
        {!loading && !error && records.length > 0 && (
          <span className="text-xs text-gray-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            {records.length} {records.length === 1 ? 'record' : 'records'}
          </span>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#13151c] border border-white/10 rounded-2xl p-5 h-24 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 flex items-center gap-3">
          <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && records.length === 0 && (
        <div className="bg-[#13151c] border border-white/10 rounded-2xl py-14 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm font-medium">No analyses yet</p>
          <p className="text-gray-600 text-xs">Upload a resume above to get started.</p>
        </div>
      )}

      {/* Record list */}
      {!loading && !error && records.length > 0 && (
        <div className="flex flex-col gap-3">
          {records.map((record) => (
            <HistoryCard
              key={record._id}
              record={record}
              onRename={(id, title) => setModal({ type: 'rename', id, title })}
              onDelete={(id, title) => setModal({ type: 'delete', id, title })}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'rename' && (
        <RenameModal
          id={modal.id}
          current={modal.title}
          onClose={() => setModal(null)}
          onRenamed={handleRenamed}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteModal
          id={modal.id}
          title={modal.title}
          onClose={() => setModal(null)}
          onDeleted={handleDeleted}
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
    </section>
  )
}
