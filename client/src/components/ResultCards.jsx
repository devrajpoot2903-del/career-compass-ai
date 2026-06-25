// Demo values shown before first submission
const DEMO = {
  score: 85,
  candidateLevel: 'High-Potential Candidate',
  strengths: [
    'Modern UI Systems Architecture',
    'Cross-functional Lead Experience',
    'Performance Optimization Specialist',
  ],
  gaps: [
    { label: 'Advanced TypeScript', priority: 'High Priority', color: 'bg-red-500', pct: 80 },
    { label: 'CI/CD Pipeline Design', priority: 'Mid Priority', color: 'bg-yellow-500', pct: 50 },
  ],
  altPaths: [
    { title: 'UX Engineer', rank: '92% Match' },
    { title: 'Systems Bot', rank: '78% Match' },
  ],
}

// Map flat backend arrays into display shape
function mapResult(apiResult) {
  const gaps = (apiResult.gaps || []).map((label, i) => ({
    label,
    priority: i === 0 ? 'High Priority' : 'Mid Priority',
    color:    i === 0 ? 'bg-red-500'   : 'bg-yellow-500',
    pct:      i === 0 ? 75             : 45,
  }))

  const altPaths = (apiResult.altPaths || []).map((title, i) => ({
    title,
    rank: `${92 - i * 10}% Match`,
  }))

  return {
    score:          apiResult.score ?? 75,
    candidateLevel: apiResult.candidateLevel ?? 'High Potential Candidate',
    strengths:      apiResult.strengths ?? [],
    gaps,
    altPaths,
  }
}

export default function ResultCards({ submitted, apiResult, role, experience }) {
  const display = submitted && apiResult ? mapResult(apiResult) : DEMO

  return (
    <div className="flex flex-col gap-4">

      {/* Submitted badge */}
      {submitted && apiResult && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5">
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-xs text-emerald-400 font-medium">
            Analysis complete for <span className="text-white">{role}</span>
            {' · '}<span className="text-gray-400">{experience}</span>
          </p>
        </div>
      )}

      {/* Top row: Score + Candidate Level */}
      <div className="grid grid-cols-2 gap-4">

        {/* Readiness Score */}
        <div className="bg-[#13151c] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-2">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="#ffffff10" strokeWidth="8" />
              <circle
                cx="48" cy="48" r="40" fill="none"
                stroke="#6366f1" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * display.score) / 100}
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{display.score}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center font-medium">Readiness Score</p>
        </div>

        {/* Candidate Level */}
        <div className="bg-[#13151c] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-semibold">{display.candidateLevel}</p>
            <p className="text-gray-500 text-xs mt-0.5">Tier 1 Analysis</p>
          </div>
        </div>
      </div>

      {/* Top Strengths */}
      <div className="bg-[#13151c] border border-white/10 rounded-2xl p-5">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-3">Top Strengths</p>
        <ul className="flex flex-col gap-2">
          {display.strengths.map((s, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
              <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Skill Gaps */}
      <div className="bg-[#13151c] border border-white/10 rounded-2xl p-5">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-4">Skill Gaps (Priority)</p>
        <div className="flex flex-col gap-4">
          {display.gaps.map((gap, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm text-gray-300">{gap.label}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                  gap.priority === 'High Priority'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {gap.priority}
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${gap.color} rounded-full transition-all duration-700`}
                  style={{ width: `${gap.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Career Paths */}
      <div className="bg-[#13151c] border border-white/10 rounded-2xl p-5">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-3">Alt Career Paths</p>
        <div className="grid grid-cols-2 gap-3">
          {display.altPaths.map((path, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center hover:border-indigo-500/30 transition-colors">
              <p className="text-sm text-white font-medium">{path.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{path.rank}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
