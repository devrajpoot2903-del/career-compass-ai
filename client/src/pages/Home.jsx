import { useState } from 'react'
import { Link } from 'react-router-dom'
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

  const handleAnalyze = async () => {
    // Guest guard
    if (!user) {
      setApiError('Please sign in to analyse your resume.')
      return
    }

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
        score:          rec.score,
        candidateLevel: rec.candidateLevel,
        strengths:      rec.strengths,
        gaps:           rec.gaps,
        altPaths:       rec.altPaths,
        roadmap:        rec.roadmap,
      })
      setSubmitted(true)
      setApiError(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Failed to load analysis.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white font-sans">
      <Navbar />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* History — gated for guests */}
        {user ? (
          <HistoryPanel onSelect={handleHistorySelect} />
        ) : (
          <section className="mt-12">
            <h2 className="text-white font-semibold text-xl mb-2">Analysis History</h2>
            <div className="bg-[#13151c] border border-white/10 rounded-2xl py-12 flex flex-col items-center gap-3">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-gray-400 text-sm">Sign in to view your analysis history</p>
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                Sign In →
              </Link>
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
