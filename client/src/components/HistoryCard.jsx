// Formats ISO date string into a readable label e.g. "Jun 27, 2025 · 12:34 PM"
function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// Score colour ring: red < 50, yellow < 70, green >= 70
function scoreColor(score) {
  if (score >= 70) return '#22c55e'   // green-500
  if (score >= 50) return '#eab308'   // yellow-500
  return '#ef4444'                    // red-500
}

export default function HistoryCard({ record }) {
  const { resumeName, targetRole, experience, score, candidateLevel, createdAt } = record
  const color = scoreColor(score)
  const dash  = 251.2
  const offset = dash - (dash * (score ?? 0)) / 100

  return (
    <div className="bg-[#13151c] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all duration-200">

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

      {/* Date */}
      <p className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">{formatDate(createdAt)}</p>
    </div>
  )
}
