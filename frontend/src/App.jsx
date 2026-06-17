import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home         from './pages/Home'
import Lessons      from './pages/Lessons'
import LessonDetail from './pages/LessonDetail'
import Labs         from './pages/Labs'
import Quiz         from './pages/Quiz'
import Progress     from './pages/Progress'
import CheatSheet   from './pages/CheatSheet'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/quiz/:lessonId" element={<Quiz />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/cheat-sheet" element={<CheatSheet />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
