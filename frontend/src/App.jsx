import { useEffect }              from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Providers
import { ToastProvider }  from './components/common/XPToast'

// Layout
import Navbar  from './components/common/Navbar'
import Footer  from './components/common/Footer'

// Pages
import Home         from './pages/Home'
import Lessons      from './pages/Lessons'
import LessonDetail from './pages/LessonDetail'
import Labs         from './pages/Labs'
import Quiz         from './pages/Quiz'
import Progress     from './pages/Progress'
import CheatSheet   from './pages/CheatSheet'

// Scroll reveal setup 
// Any element with className="reveal" starts invisible (opacity 0, translateY 20px)
// When it enters the viewport, the observer adds "revealed" → CSS transition plays.
// This is defined in index.css under .reveal and .reveal.revealed
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            // Unobserve after reveal, animation only plays once
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold:  0.12,   // trigger when 12% of the element is visible
        rootMargin: '0px 0px -40px 0px',  // trigger slightly before fully in view
      }
    )

    // Observe all current .reveal elements
    const revealEls = document.querySelectorAll('.reveal')
    revealEls.forEach(el => observer.observe(el))

    // Re-scan after a short delay to catch elements added by async renders
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
        observer.observe(el)
      })
    }, 500)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])
}

// Inner app has access to all contexts
function AppInner() {
  useScrollReveal()

  return (
    <BrowserRouter>
      <div style={{
        minHeight:     '100vh',
        display:       'flex',
        flexDirection: 'column',
      }}>
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"               element={<Home />}         />
            <Route path="/lessons"        element={<Lessons />}      />
            <Route path="/lessons/:id"    element={<LessonDetail />} />
            <Route path="/labs"           element={<Labs />}         />
            <Route path="/quiz/:lessonId" element={<Quiz />}         />
            <Route path="/progress"       element={<Progress />}     />
            <Route path="/cheat-sheet"    element={<CheatSheet />}   />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

// Root — providers wrap everything 
export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  )
}