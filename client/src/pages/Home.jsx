import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AnalysisForm from '../components/AnalysisForm'
import ResultCards from '../components/ResultCards'
import Roadmap from '../components/Roadmap'
import HistoryPanel from '../components/HistoryPanel'
import { analyzeProfile, getAnalysisById } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('Senior Product Designer')
  const [experience, setExperience] = useState('Senior (5-10 yrs)')
  const [skills, setSkills] = useState(['React', 'TailwindCSS', 'Figma'])
  const [projectCount, setProjectCount] = useState(3)
  const [resumeFile, setResumeFile] = useState(null)

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiResult, setApiResult] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [errors, setErrors] = useState({})

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // --- GUEST HISTORY STATE ---
  const [guestHistory, setGuestHistory] = useState([])

  // Load LocalStorage data on mount (For Guests)
  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem('guestHistory')
      if (stored) {
        setGuestHistory(JSON.parse(stored))
      }
    }
  }, [user, refreshTrigger])

  const handleStartClick = () => {
    // Ab guest aur user dono direct form par scroll honge
    const analysisSection = document.getElementById('main-analysis-section')
    if (analysisSection) {
      analysisSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleAnalyze = async () => {
    const newErrors = {}
    if (!role) newErrors.role = 'Please select a target role.'
    if (!resumeFile) newErrors.resume = 'Please upload your resume.'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setErrors({})
    setLoading(true)
    setApiError(null)

    try {
      const { data } = await analyzeProfile({ role, experience, skills, projectCount, resumeFile })
      setApiResult(data)
      setSubmitted(true)

      // --- LOCAL STORAGE LOGIC FOR GUESTS ---
      if (!user) {
        const newRecord = {
          _id: Date.now().toString(), // Fake ID for local mapping
          targetRole: role,
          experience: experience,
          score: data.score || 75,
          createdAt: new Date().toISOString(),
          ...data
        }
        const existing = JSON.parse(localStorage.getItem('guestHistory') || '[]')
        const updated = [newRecord, ...existing]
        localStorage.setItem('guestHistory', JSON.stringify(updated))
      }

      setRefreshTrigger(prev => prev + 1)
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
        err.message ||
        'Failed to connect to server. Is it running on port 5000?'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleHistorySelect = async (id) => {
    try {
      const { data } = await getAnalysisById(id)
      const rec = data.data
      setRole(rec.targetRole)
      setExperience(rec.experience)
      setApiResult({
        score: rec.score,
        candidateLevel: rec.candidateLevel,
        strengths: rec.strengths,
        gaps: rec.gaps,
        altPaths: rec.altPaths,
        roadmap: rec.roadmap,
      })
      setSubmitted(true)
      setApiError(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Failed to load analysis.')
    }
  }

  // Guest wali history card click handle karne ke liye
  const handleGuestHistorySelect = (item) => {
    setRole(item.targetRole)
    setExperience(item.experience)
    setApiResult(item)
    setSubmitted(true)
    setApiError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white font-sans">
      <Navbar />
      <Hero onStartClick={handleStartClick} />

      <main id="main-analysis-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalysisForm
            role={role} setRole={setRole}
            experience={experience} setExperience={setExperience}
            skills={skills} setSkills={setSkills}
            projectCount={projectCount} setProjectCount={setProjectCount}
            resumeFile={resumeFile} setResumeFile={setResumeFile}
            onAnalyze={handleAnalyze}
            errors={errors}
            loading={loading}
            apiError={apiError}
          />
          <ResultCards submitted={submitted} apiResult={apiResult} role={role} experience={experience} />
        </div>

        <Roadmap apiResult={apiResult} />

        {user ? (
          <HistoryPanel key={refreshTrigger} onSelect={handleHistorySelect} />
        ) : (
          <section className="mt-12">
            <h2 className="text-white font-semibold text-xl mb-2">Analysis History (Guest Mode)</h2>
            <div className="bg-[#13151c] border border-white/10 rounded-2xl p-6">

              {/* --- GUEST WARNING BANNER --- */}
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-indigo-200 text-sm font-medium">
                  ⚠️ You are in Guest Mode. This data is saved locally and will be lost if you clear your browser.
                </p>
                <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg whitespace-nowrap transition-colors shadow-lg">
                  Create Account to Save Permanently
                </Link>
              </div>

              {/* --- GUEST HISTORY LIST --- */}
              {guestHistory.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {guestHistory.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleGuestHistorySelect(item)}
                      className="cursor-pointer border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] p-4 rounded-xl flex justify-between items-center transition-colors"
                    >
                      <div>
                        <h3 className="text-white font-medium text-sm">{item.targetRole}</h3>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(item.createdAt).toLocaleDateString()} · {item.experience}
                        </p>
                      </div>
                      <div className="bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-md text-sm">
                        {item.score}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center opacity-50">
                  <p className="text-gray-400 text-sm">No analysis history found. Start an analysis above!</p>
                </div>
              )}

            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-white/10 mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <span>© 2024 Career Compass AI · Precision Career Intelligence.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Contact Support</a>
            <a href="#" className="hover:text-gray-300 transition-colors">API Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  )
}