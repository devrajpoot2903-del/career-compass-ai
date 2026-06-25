// ─── Score Engine ─────────────────────────────────────────────────────────────

const EXPERIENCE_BONUS = {
  'Junior (0-2 yrs)': 5,
  'Mid (2-5 yrs)': 15,
  'Senior (5-10 yrs)': 25,
  'Lead (10+ yrs)': 25,
}

export function computeScore(skills, projectCount, experience) {
  const base = 40
  const skillBonus = skills.length * 4
  const projectBonus = projectCount * 3
  const expBonus = EXPERIENCE_BONUS[experience] ?? 5
  const raw = base + skillBonus + projectBonus + expBonus
  return Math.max(25, Math.min(95, raw))
}

// ─── Candidate Level ──────────────────────────────────────────────────────────

export function computeLevel(score) {
  if (score >= 85) return 'Industry Ready Candidate'
  if (score >= 70) return 'High Potential Candidate'
  if (score >= 50) return 'Emerging Candidate'
  return 'Beginner Candidate'
}

// ─── Strengths ────────────────────────────────────────────────────────────────

const SKILL_STRENGTH_MAP = [
  { match: /react/i,          label: 'React Development' },
  { match: /next/i,           label: 'Next.js Expertise' },
  { match: /vue|angular/i,    label: 'Frontend Framework Expertise' },
  { match: /node/i,           label: 'Backend Development' },
  { match: /express/i,        label: 'REST API Development' },
  { match: /mongo/i,          label: 'Database Knowledge' },
  { match: /sql|postgres/i,   label: 'Relational Database Skills' },
  { match: /python/i,         label: 'Python Proficiency' },
  { match: /typescript|ts/i,  label: 'TypeScript Proficiency' },
  { match: /docker|k8s/i,     label: 'Containerization & DevOps' },
  { match: /aws|gcp|azure/i,  label: 'Cloud Infrastructure' },
  { match: /figma|design/i,   label: 'UI/UX Design Skills' },
  { match: /tailwind|css/i,   label: 'Modern Styling Systems' },
  { match: /ml|ai|tensorflow/i, label: 'Machine Learning Knowledge' },
  { match: /git/i,            label: 'Version Control Proficiency' },
]

export function computeStrengths(skills, projectCount, experience) {
  const found = []

  for (const { match, label } of SKILL_STRENGTH_MAP) {
    if (skills.some((s) => match.test(s))) {
      found.push(label)
    }
  }

  if (projectCount >= 5) found.push('Strong Portfolio')
  else if (projectCount >= 3) found.push('Project Experience')

  if (experience === 'Senior (5-10 yrs)' || experience === 'Lead (10+ yrs)') {
    found.push('Advanced Industry Experience')
  } else if (experience === 'Mid (2-5 yrs)') {
    found.push('Professional Experience')
  }

  if (found.length === 0) found.push('Foundational Technical Knowledge')

  return [...new Set(found)].slice(0, 3)
}

// ─── Skill Gaps ───────────────────────────────────────────────────────────────

const ROLE_GAPS = {
  'Frontend Developer':       ['System Design', 'Testing', 'Performance Optimization'],
  'Frontend Engineer':        ['System Design', 'Testing', 'Performance Optimization'],
  'Backend Developer':        ['System Design', 'Scalability', 'DevOps'],
  'MERN Developer':           ['DevOps', 'Scaling', 'System Architecture'],
  'Full Stack Developer':     ['DevOps', 'Scaling', 'System Architecture'],
  'AI/ML Engineer':           ['Mathematics', 'MLOps', 'Model Training'],
  'Data Analyst':             ['SQL Optimization', 'Data Visualization', 'Statistics'],
  'Data Scientist':           ['MLOps', 'Model Deployment', 'Statistics'],
  'Cybersecurity Analyst':    ['Networking', 'Incident Response', 'Threat Hunting'],
  'DevOps Engineer':          ['Security Hardening', 'Cost Optimization', 'Chaos Engineering'],
  'Senior Product Designer':  ['User Research', 'Prototyping at Scale', 'Design Systems'],
  'UX Researcher':            ['Quantitative Analysis', 'A/B Testing', 'Accessibility'],
  'Mobile Developer':         ['CI/CD for Mobile', 'Performance Profiling', 'App Store Optimization'],
}

const DEFAULT_GAPS = ['Advanced Architecture', 'Technical Leadership', 'System Design']

const GAP_PRIORITIES = [
  { priority: 'High Priority', color: 'bg-red-500', pct: 75 },
  { priority: 'Mid Priority',  color: 'bg-yellow-500', pct: 45 },
]

export function computeGaps(role) {
  const raw = ROLE_GAPS[role] ?? DEFAULT_GAPS
  return raw.slice(0, 2).map((label, i) => ({ label, ...GAP_PRIORITIES[i] }))
}

// ─── Alternative Career Paths ─────────────────────────────────────────────────

const ROLE_ALT_PATHS = {
  'Frontend Developer':       ['UI Developer', 'React Developer'],
  'Frontend Engineer':        ['UI Developer', 'React Developer'],
  'Backend Developer':        ['API Developer', 'Node.js Developer'],
  'MERN Developer':           ['Full Stack Developer', 'Backend Engineer'],
  'Full Stack Developer':     ['Solutions Architect', 'Backend Engineer'],
  'AI/ML Engineer':           ['Data Scientist', 'ML Engineer'],
  'Data Analyst':             ['BI Analyst', 'Product Analyst'],
  'Data Scientist':           ['ML Engineer', 'AI Researcher'],
  'Cybersecurity Analyst':    ['SOC Analyst', 'Security Engineer'],
  'DevOps Engineer':          ['Site Reliability Engineer', 'Cloud Architect'],
  'Senior Product Designer':  ['UX Engineer', 'Design Lead'],
  'UX Researcher':            ['Product Manager', 'CX Strategist'],
  'Mobile Developer':         ['iOS Engineer', 'React Native Developer'],
}

const DEFAULT_ALT_PATHS = ['Tech Lead', 'Engineering Manager']

export function computeAltPaths(role, score) {
  const paths = ROLE_ALT_PATHS[role] ?? DEFAULT_ALT_PATHS
  return paths.map((title, i) => ({
    title,
    rank: `${Math.min(98, score + 8 - i * 10)}% Match`,
  }))
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────

const ROADMAP_LOW = [
  { title: 'Learn Fundamentals',       description: 'Study core concepts and build a solid technical base.',         duration: 'ETA: 6 Weeks' },
  { title: 'Build Projects',           description: 'Create 2–3 small real-world projects to apply your skills.',    duration: 'ETA: 4 Weeks' },
  { title: 'Build Your Portfolio',     description: 'Document projects and publish to GitHub & portfolio site.',      duration: 'ETA: 2 Weeks' },
  { title: 'Apply & Iterate',          description: 'Apply to entry-level roles and iterate on feedback.',            duration: 'Continuous'   },
]

const ROADMAP_HIGH = [
  { title: 'Advanced Projects',        description: 'Build high-scale production-grade engineering projects.',        duration: 'ETA: 4 Weeks' },
  { title: 'Mock Interviews',          description: 'Complete 5 AI-driven behavioral & technical simulations.',       duration: 'ETA: 1 Week'  },
  { title: 'Resume Optimization',      description: 'Tailor resume to top target roles using ATS keywords.',          duration: 'ETA: 3 Days'  },
  { title: 'Job Applications',         description: 'Apply to curated top-tier companies matching your profile.',     duration: 'Continuous'   },
]

export function computeRoadmap(score) {
  return (score >= 70 ? ROADMAP_HIGH : ROADMAP_LOW).map((step, i) => ({
    ...step,
    num: i + 1,
  }))
}

// ─── Master Runner ────────────────────────────────────────────────────────────

export function runAnalysisEngine({ role, experience, skills, projectCount }) {
  const score          = computeScore(skills, projectCount, experience)
  const candidateLevel = computeLevel(score)
  const strengths      = computeStrengths(skills, projectCount, experience)
  const gaps           = computeGaps(role)
  const altPaths       = computeAltPaths(role, score)
  const roadmap        = computeRoadmap(score)
  return { score, candidateLevel, strengths, gaps, altPaths, roadmap }
}
