// TODO: Implement Home page
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AnalysisForm from '../components/AnalysisForm'
import ResultCards from '../components/ResultCards'
import Roadmap from '../components/Roadmap'

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <AnalysisForm />
      <ResultCards />
      <Roadmap />
    </div>
  )
}
