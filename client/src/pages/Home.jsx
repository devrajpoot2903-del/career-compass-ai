import { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AnalysisForm from '../components/AnalysisForm'
import ResultCards from '../components/ResultCards'
import Roadmap from '../components/Roadmap'
import HistoryPanel from '../components/HistoryPanel'
import { analyzeProfile, getAnalysisById } from '../services/api'

export default function Home() {
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
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)

  // Derived display values — selectedAnalysis overrides apiResult for rendering only
  const displayResult  = selectedAnalysis ?? apiResult
  const isSubmitted    = submitted || selectedAnalysis !== null

  const handleAnalyze = async () => {
    const newErrors = {}
    if (!role) newErrors.role = 'Please select a target role.'
    if (!resumeFile) newErrors.resume = 'Please upload your resume.'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoading(true)
    setApiError(null)
    setSelectedAnalysis(null) // clear history override so fresh result shows

    try {
      const { data } = await analyzeProfile({
        role,
        experience,
        skills,
        projectCount,
        resumeFile,
      })

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
      setSelectedAnalysis(data.data)
    } catch (err) {
      console.error('Failed to fetch analysis:', err.message)
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
          <ResultCards
            submitted={isSubmitted}
            apiResult={displayResult}
            role={role}
            experience={experience}
          />
        </div>
        <Roadmap apiResult={displayResult} />
        <HistoryPanel onSelect={handleHistorySelect} />
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
