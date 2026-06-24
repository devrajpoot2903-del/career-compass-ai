import { useState, useRef } from 'react'

const ROLES = [
  'Senior Product Designer',
  'Frontend Engineer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'UX Researcher',
  'Mobile Developer',
]

const EXPERIENCE_LEVELS = [
  'Junior (0-2 yrs)',
  'Mid (2-5 yrs)',
  'Senior (5-10 yrs)',
  'Lead (10+ yrs)',
]

export default function AnalysisForm({
  role, setRole,
  experience, setExperience,
  skills, setSkills,
  projectCount, setProjectCount,
  resumeFile, setResumeFile,
  onAnalyze,
  errors,
}) {
  const [skillInput, setSkillInput] = useState('')
  const fileInputRef = useRef(null)

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed])
    }
    setSkillInput('')
  }

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setResumeFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) setResumeFile(file)
  }

  const handleDragOver = (e) => e.preventDefault()

  const decrement = () => setProjectCount((c) => Math.max(0, c - 1))
  const increment = () => setProjectCount((c) => c + 1)

  return (
    <div className="bg-[#13151c] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-base">Profile Analysis</h2>
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-md">v1.4.0</span>
      </div>

      {/* Resume Upload */}
      <div
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 py-8 px-4 bg-white/[0.02] cursor-pointer transition-all duration-200 ${
          errors.resume
            ? 'border-red-500/60 hover:border-red-400/70'
            : resumeFile
            ? 'border-indigo-500/60 hover:border-indigo-400/70 bg-indigo-500/5'
            : 'border-white/15 hover:border-indigo-500/50 hover:bg-indigo-500/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${resumeFile ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
          <svg className={`w-5 h-5 ${resumeFile ? 'text-indigo-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        {resumeFile ? (
          <p className="text-sm text-indigo-400 font-medium text-center">{resumeFile.name}</p>
        ) : (
          <>
            <p className="text-sm text-gray-400">
              <span className="text-indigo-400 font-medium">Upload Resume</span> or drag and drop
            </p>
            <p className="text-xs text-gray-600">PDF, DOC up to 10MB</p>
          </>
        )}
      </div>
      {errors.resume && (
        <p className="text-xs text-red-400 -mt-4">{errors.resume}</p>
      )}

      {/* Target Role & Experience Level */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-500 font-medium">Target Role</label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full appearance-none bg-[#1a1d27] border text-sm text-gray-300 rounded-lg px-3 py-2.5 pr-8 focus:outline-none cursor-pointer transition-colors ${
                errors.role ? 'border-red-500/60' : 'border-white/10 focus:border-indigo-500/60'
              }`}
            >
              <option value="">Select a role...</option>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {errors.role && <p className="text-xs text-red-400">{errors.role}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-500 font-medium">Experience Level</label>
          <div className="relative">
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full appearance-none bg-[#1a1d27] border border-white/10 text-sm text-gray-300 rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:border-indigo-500/60 cursor-pointer"
            >
              {EXPERIENCE_LEVELS.map((lvl) => <option key={lvl}>{lvl}</option>)}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Technical Skills */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500 font-medium">Technical Skills</label>
        <div className="flex flex-wrap gap-2 bg-[#1a1d27] border border-white/10 rounded-lg p-2.5 min-h-[44px]">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-md"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-indigo-400 hover:text-white transition-colors leading-none text-base"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={skills.length === 0 ? 'Type a skill and press Enter...' : 'Add a skill...'}
            className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none"
          />
        </div>
        {skillInput.trim() && (
          <button
            onClick={addSkill}
            className="self-start text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            + Add &quot;{skillInput.trim()}&quot;
          </button>
        )}
      </div>

      {/* Relevant Projects Count */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500 font-medium">Relevant Projects Count</label>
        <div className="flex items-center gap-3">
          <button
            onClick={decrement}
            className="w-8 h-8 rounded-lg bg-[#1a1d27] border border-white/10 text-gray-400 hover:text-white hover:border-indigo-500/50 transition-all flex items-center justify-center font-semibold text-lg leading-none"
          >
            −
          </button>
          <div className="w-12 h-8 rounded-lg bg-[#1a1d27] border border-white/10 flex items-center justify-center">
            <span className="text-sm text-white font-medium">{projectCount}</span>
          </div>
          <button
            onClick={increment}
            className="w-8 h-8 rounded-lg bg-[#1a1d27] border border-white/10 text-gray-400 hover:text-white hover:border-indigo-500/50 transition-all flex items-center justify-center font-semibold text-lg leading-none"
          >
            +
          </button>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={onAnalyze}
        className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 text-sm tracking-wide mt-1"
      >
        Analyze Profile
      </button>
    </div>
  )
}
