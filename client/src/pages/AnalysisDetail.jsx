import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAnalysisById } from '../services/api'
import Navbar from '../components/Navbar'
import ResultCards from '../components/ResultCards'
import Roadmap from '../components/Roadmap'
import { exportAnalysisPdf } from '../utils/exportPdf'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function AnalysisDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [record,      setRecord]      = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [pdfLoading,  setPdfLoading]  = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getAnalysisById(id)
      .then(({ data }) => { if (!cancelled) setRecord(data.data) })
      .catch((err) => {
        if (!cancelled) setError(
          err?.response?.data?.message || err.message || 'Failed to load analysis.'
        )
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [id])

  const handleDownloadPdf = () => {
    if (!record || pdfLoading) return
    setPdfLoading(true)
    try {
      exportAnalysisPdf(record)
    } finally {
      // Small delay so the button animation is visible
      setTimeout(() => setPdfLoading(false), 800)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Top bar: back + download */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>

          {/* Download PDF button — only shown when record is loaded */}
          {record && (
            <button
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {pdfLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-6">
            <div className="h-10 bg-white/5 rounded-2xl animate-pulse w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
            </div>
            <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white font-semibold text-lg">Analysis not found</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              ← Return to Home
            </button>
          </div>
        )}

        {/* Full report */}
        {!loading && !error && record && (
          <>
            {/* Page header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{record.targetRole}</h1>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full font-medium">
                  {record.experience}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                {record.resumeName && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {record.resumeName}
                  </span>
                )}
                {record.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(record.createdAt)}
                  </span>
                )}
              </div>

              {/* Skills chips */}
              {record.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {record.skills.map((skill, i) => (
                    <span key={i} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Reuse existing ResultCards + Roadmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="hidden lg:block" />
              <ResultCards
                submitted={true}
                apiResult={record}
                role={record.targetRole}
                experience={record.experience}
              />
            </div>

            <Roadmap apiResult={record} />
          </>
        )}
      </main>
    </div>
  )
}
