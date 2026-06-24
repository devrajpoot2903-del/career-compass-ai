export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0d0f14]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="font-semibold text-sm text-white tracking-tight">Career Compass AI</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-indigo-400 font-medium border-b border-indigo-400 pb-0.5">Platform</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Resources</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">Login</button>
            <button className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md font-medium transition-colors">
              Start Analysis
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
