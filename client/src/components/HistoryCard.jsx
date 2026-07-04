import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function scoreColor(score) {
  if (score >= 70) return '#22c55e'
  if (score >= 50) return '#eab308'
  return '#ef4444'
}

export default function HistoryCard({ record, onRename, onDelete }) {
  const navigate   = useNavigate()
  const menuRef    = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const { _id, resumeName, targetRole, experience, score, candidateLevel, createdAt } = record
  const color  = scoreColor(score)
  const dash   = 251.2
  const offset = dash - (dash * (score ?? 0)) / 100

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleCardClick = (e) => {
    // Don't navigate if clicking the menu area
    if (menuRef.current && menuRef.current.contains(e.target)) return
    navigate(`/analysis/${_id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-[#13151c] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all duration-200 cursor-pointer"
    >
      {/* Score ring */}
      <div className="relative w-14 h-14 flex-shrink-0">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="22" fill="none" stroke="#ffffff10" strokeWidth="5" />
          <circle
            cx="28" cy="28" r="22" fill="none"
            stroke={color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={dash}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{score ?? '—'}%</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{targetRole}</p>
        <p className="text-gray-400 text-xs mt-0.5 truncate">{resumeName}</p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-medium">
            {experience}
          </span>
          <span className="text-xs text-gray-500">{candidateLevel}</span>
        </div>
      </div>

      {/* Right: date + three-dot menu */}
      <div className="flex items-center gap-3 flex-shrink-0" ref={menuRef}>
        <p className="text-xs text-gray-600 whitespace-nowrap hidden sm:block">{formatDate(createdAt)}</p>

        {/* Three-dot button */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5"  cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-9 w-36 bg-[#1a1d27] border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onRename(_id, resumeName) }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Rename
              </button>
              <div className="border-t border-white/5" />
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(_id, resumeName) }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
