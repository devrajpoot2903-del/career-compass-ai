import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AnalysisDetail from './pages/AnalysisDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis/:id" element={<AnalysisDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
