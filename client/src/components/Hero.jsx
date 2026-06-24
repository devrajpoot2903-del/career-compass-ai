export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0d0f14] pt-20 pb-16 text-center">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
          Career Compass AI
        </h1>
        <p className="mt-4 text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Precision analysis for your next career move. Leverage specialized AI to map your skills
          against industry demands and find your optimal growth path.
        </p>
        <div className="mt-8">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40">
            Start Analysis
          </button>
        </div>
      </div>
    </section>
  )
}
