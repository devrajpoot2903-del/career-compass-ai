import { useState, useEffect } from 'react'
import { getHistory } from '../services/api'
import HistoryCard from './HistoryCard'

export default function HistoryPanel() {
  const [records, setRecords]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getHistory()
      .then(({ data }) => {
        if (!cancelled) setRecords(data.data ?? [])
      })
      .catch((err) => {
        if (!cancelled) setError(
          err?.response?.data?.message || err.message || 'Failed to load history.'
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
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
            <div
              key={i}
              className="bg-[#13151c] border border-white/10 rounded-2xl p-5 h-24 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 flex items-center gap-3">
          <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Empty state */}
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
            <HistoryCard key={record._id} record={record} />
          ))}
        </div>
      )}
    </section>
  )
}
