import { jsPDF } from 'jspdf'

/**
 * Generates and downloads a professional A4 PDF report for an analysis record.
 * @param {Object} record - The full analysis document from MongoDB
 */
export function exportAnalysisPdf(record) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageW   = doc.internal.pageSize.getWidth()   // 210
  const pageH   = doc.internal.pageSize.getHeight()  // 297
  const margin  = 20
  const contentW = pageW - margin * 2
  const today   = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  // ── Colour palette ───────────────────────────────────────────────────────
  const INDIGO  = [79, 70, 229]   // #4F46E5
  const DARK    = [15, 23, 42]    // slate-900
  const MID     = [71, 85, 105]   // slate-500
  const LIGHT   = [248, 250, 252] // slate-50
  const WHITE   = [255, 255, 255]
  const GREEN   = [34, 197, 94]
  const RED     = [239, 68, 68]

  let y = 0  // current Y cursor

  // ── Helper: add new page if needed ──────────────────────────────────────
  const checkPage = (neededHeight = 10) => {
    if (y + neededHeight > pageH - margin) {
      doc.addPage()
      y = margin
    }
  }

  // ── Helper: section heading ──────────────────────────────────────────────
  const sectionHeading = (title, iconColor = INDIGO) => {
    checkPage(14)
    doc.setFillColor(...iconColor)
    doc.roundedRect(margin, y, 3, 7, 1, 1, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...DARK)
    doc.text(title, margin + 7, y + 5.5)
    y += 13
  }

  // ── Helper: bullet item ──────────────────────────────────────────────────
  const bulletItem = (text, color = MID) => {
    const safeTxt = text || 'Not Available'
    const lines   = doc.splitTextToSize(`• ${safeTxt}`, contentW - 8)
    checkPage(lines.length * 5.5 + 2)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...color)
    doc.text(lines, margin + 4, y)
    y += lines.length * 5.5 + 2
  }

  // ── Helper: numbered item ────────────────────────────────────────────────
  const numberedItem = (num, text) => {
    const safeTxt = text || 'Not Available'
    const label   = `${num}.`
    const lines   = doc.splitTextToSize(safeTxt, contentW - 14)
    checkPage(lines.length * 5.5 + 2)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...INDIGO)
    doc.text(label, margin + 4, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    doc.text(lines, margin + 12, y)
    y += lines.length * 5.5 + 2
  }

  // ── Helper: info row ─────────────────────────────────────────────────────
  const infoRow = (label, value) => {
    checkPage(8)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...MID)
    doc.text(label.toUpperCase(), margin, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    doc.text(String(value || 'Not Available'), margin + 45, y)
    y += 7.5
  }

  // ════════════════════════════════════════════════════════════════════════
  // HEADER BLOCK
  // ════════════════════════════════════════════════════════════════════════
  // Indigo header band
  doc.setFillColor(...INDIGO)
  doc.rect(0, 0, pageW, 38, 'F')

  // Logo text
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...WHITE)
  doc.text('Career Compass AI', margin, 16)

  // Sub title
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(200, 200, 255)
  doc.text('AI Career Analysis Report', margin, 24)

  // Date (right aligned)
  doc.setFontSize(8)
  doc.setTextColor(200, 200, 255)
  doc.text(`Generated: ${today}`, pageW - margin, 24, { align: 'right' })

  y = 48

  // ════════════════════════════════════════════════════════════════════════
  // SCORE BADGE (top-right of content area)
  // ════════════════════════════════════════════════════════════════════════
  const score     = record.score ?? 0
  const scoreColor = score >= 70 ? GREEN : score >= 50 ? [234, 179, 8] : RED

  doc.setFillColor(245, 247, 255)
  doc.roundedRect(pageW - margin - 38, y - 4, 38, 22, 4, 4, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...scoreColor)
  doc.text(`${score}%`, pageW - margin - 19, y + 10, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...MID)
  doc.text('OVERALL SCORE', pageW - margin - 19, y + 17, { align: 'center' })

  // ════════════════════════════════════════════════════════════════════════
  // CANDIDATE INFORMATION
  // ════════════════════════════════════════════════════════════════════════
  sectionHeading('Candidate Information')

  infoRow('Resume',           record.resumeName)
  infoRow('Target Role',      record.targetRole)
  infoRow('Experience',       record.experience)
  infoRow('Candidate Level',  record.candidateLevel)

  y += 4

  // Divider
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageW - margin, y)
  y += 8

  // ════════════════════════════════════════════════════════════════════════
  // TOP STRENGTHS
  // ════════════════════════════════════════════════════════════════════════
  sectionHeading('Top Strengths', GREEN)
  const strengths = record.strengths?.length ? record.strengths : ['Not Available']
  strengths.forEach((s) => bulletItem(s, [22, 101, 52]))
  y += 4

  doc.line(margin, y, pageW - margin, y)
  y += 8

  // ════════════════════════════════════════════════════════════════════════
  // SKILL GAPS
  // ════════════════════════════════════════════════════════════════════════
  sectionHeading('Skill Gaps', RED)
  const gaps = record.gaps?.length ? record.gaps : ['Not Available']
  gaps.forEach((g) => bulletItem(g, [153, 27, 27]))
  y += 4

  doc.line(margin, y, pageW - margin, y)
  y += 8

  // ════════════════════════════════════════════════════════════════════════
  // ALTERNATIVE CAREER PATHS
  // ════════════════════════════════════════════════════════════════════════
  sectionHeading('Alternative Career Paths', [124, 58, 237])
  const altPaths = record.altPaths?.length ? record.altPaths : ['Not Available']
  altPaths.forEach((p) => bulletItem(p, [76, 29, 149]))
  y += 4

  doc.line(margin, y, pageW - margin, y)
  y += 8

  // ════════════════════════════════════════════════════════════════════════
  // RECOMMENDED ROADMAP
  // ════════════════════════════════════════════════════════════════════════
  sectionHeading('Recommended Career Roadmap', INDIGO)
  const roadmap = record.roadmap?.length ? record.roadmap : ['Not Available']
  roadmap.forEach((step, i) => numberedItem(i + 1, step))
  y += 6

  // ════════════════════════════════════════════════════════════════════════
  // FOOTER (on every page)
  // ════════════════════════════════════════════════════════════════════════
  const totalPages = doc.internal.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    doc.setFillColor(...LIGHT)
    doc.rect(0, pageH - 14, pageW, 14, 'F')
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.3)
    doc.line(0, pageH - 14, pageW, pageH - 14)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...MID)
    doc.text('Generated by Career Compass AI · Confidential', margin, pageH - 5)
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 5, { align: 'right' })
  }

  // ── Build filename + save ────────────────────────────────────────────────
  const roleSlug = (record.targetRole || 'Analysis').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
  const dateSlug = new Date().toISOString().slice(0, 10)
  doc.save(`CareerCompass_${roleSlug}_${dateSlug}.pdf`)
}
