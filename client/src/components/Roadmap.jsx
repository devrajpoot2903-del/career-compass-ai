const DEFAULT_STEPS = [
  {
    num: 1,
    title: 'Skill Mastery',
    description: 'Complete Advanced TS & Design Patterns certification.',
    duration: 'ETA: 6 Weeks',
  },
  {
    num: 2,
    title: 'Portfolio Pivot',
    description: 'Document 3 high-scale engineering projects.',
    duration: 'ETA: 3 Weeks',
  },
  {
    num: 3,
    title: 'Mock Interviews',
    description: 'Complete 5 AI-driven behavioral technical simulations.',
    duration: 'ETA: 1 Week',
  },
  {
    num: 4,
    title: 'Market Deployment',
    description: 'Automated application to curated top-tier roles.',
    duration: 'Continuous',
  },
]

export default function Roadmap({ apiResult }) {
  // Backend returns roadmap as string[], convert to step objects for display
  const steps = apiResult?.roadmap
    ? apiResult.roadmap.map((title, i) => ({
        num: i + 1,
        title,
        description: '',
        duration: '',
      }))
    : DEFAULT_STEPS

  return (
    <section className="mt-12">
      <h2 className="text-white font-semibold text-xl mb-6">Recommended Roadmap</h2>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connector line — desktop only */}
        <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-white/10 z-0" />

        {steps.map((step, i) => (
          <div
            key={i}
            className="relative bg-[#13151c] border border-white/10 rounded-2xl p-5 flex flex-col gap-3 z-10 hover:border-indigo-500/40 hover:bg-indigo-500/[0.04] transition-all duration-200"
          >
            {/* Step number */}
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-indigo-600/40">
              {step.num}
            </div>

            {/* Content */}
            <div>
              <p className="text-white font-semibold text-sm">{step.title}</p>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">{step.description}</p>
            </div>

            {/* Duration badge */}
            <span className="text-xs text-indigo-400 font-medium">{step.duration}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
