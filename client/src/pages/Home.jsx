import { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AnalysisForm from '../components/AnalysisForm'
import ResultCards from '../components/ResultCards'
import Roadmap from '../components/Roadmap'
import { runAnalysisEngine } from '../utils/analysisEngine'

export default function Home() {
  const [role, setRole] = useState('Senior Product Designer')
  const [experience, setExperience] = useState('Senior (5-10 yrs)')
  const [skills, setSkills] = useState(['React', 'TailwindCSS', 'Figma'])
  const [projectCount, setProjectCount] = useState(3)
  const [resumeFile, setResumeFile] = useState(null)

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [engineResult, setEngineResult] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [errors, setErrors] = useState({})

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

    try {
      // Send to backend for logging / future Groq integration
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          experience,
          skills,
          projectCount,
          resumeFileName: resumeFile.name,
        }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
    } catch (err) {
      // Non-fatal: still run local engine even if backend is down
      setApiError(`Backend unavailable — showing local results. (${err.message})`)
    }

    // Always run local engine regardless of backend status
    const result = runAnalysisEngine({ role, experience, skills, projectCount })
    setEngineResult(result)
    setSubmitted(true)
    setLoading(false)
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
            submitted={submitted}
            engineResult={engineResult}
            role={role}
            experience={experience}
          />
        </div>
        <Roadmap engineResult={engineResult} />
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
