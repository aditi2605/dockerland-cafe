// pages/LessonDetail.jsx — Full lesson content with code examples and quiz CTA
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, Trophy } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getLesson } from '../utils/api'
import { useFetch } from '../hooks/useFetch'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

export default function LessonDetail() {
  // useParams() reads the :id part from the URL (e.g. /lessons/3 → id = "3")
  const { id } = useParams()

  const { data: lesson, loading, error, refetch } = useFetch(
    () => getLesson(id),
    [id]  // Re-fetch whenever the lesson ID in the URL changes
  )

  if (loading) return <LoadingSpinner message="Preparing your dish..." />
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />
  if (!lesson) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Breadcrumb */}
      <Link to="/lessons" className="flex items-center gap-1 text-cafe-latte text-sm mb-8 hover:text-cafe-brown transition-colors">
        <ArrowLeft size={14} /> Back to Menu
      </Link>

      {/* Lesson header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-5xl">{lesson.emoji || '📖'}</span>
          <div>
            <div className="text-xs font-mono text-cafe-latte">Lesson {lesson.order_index}</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-cafe-brown leading-tight">
              {lesson.title}
            </h1>
          </div>
        </div>

        {/* Meta bar */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 bg-cafe-steam rounded-cafe p-3">
          <span className="flex items-center gap-1"><Clock size={14} /> {lesson.duration_minutes} min read</span>
          <span>🎯 Difficulty: <strong>{lesson.difficulty}</strong></span>
          <span>☕ Café concept: <strong>{lesson.cafe_concept}</strong></span>
        </div>
      </header>

      {/* Café analogy callout box */}
      {lesson.cafe_analogy && (
        <div className="bg-amber-50 border-l-4 border-cafe-latte rounded-r-cafe p-5 mb-8">
          <div className="font-semibold text-cafe-brown mb-1">☕ Think of it this way...</div>
          <p className="text-gray-700 leading-relaxed">{lesson.cafe_analogy}</p>
        </div>
      )}

      {/* Main lesson content — rendered as markdown-style paragraphs */}
      <article className="prose prose-lg max-w-none mb-10">
        {/* The content field contains structured sections from the DB */}
        {lesson.content_sections?.map((section, i) => (
          <LessonSection key={i} section={section} />
        ))}
      </article>

      {/* Key takeaways */}
      {lesson.key_takeaways?.length > 0 && (
        <div className="bg-cafe-green/10 border border-cafe-green/30 rounded-cafe p-5 mb-8">
          <h3 className="font-display font-bold text-cafe-green mb-3">✅ Key Takeaways</h3>
          <ul className="space-y-2">
            {lesson.key_takeaways.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-cafe-green font-bold mt-0.5">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quiz CTA */}
      <div className="menu-card bg-gradient-to-r from-cafe-brown to-cafe-espresso text-cafe-cream text-center">
        <Trophy size={32} className="mx-auto mb-3 text-cafe-yellow" />
        <h3 className="font-display text-xl font-bold mb-2">Ready to test your knowledge?</h3>
        <p className="text-cafe-steam/80 text-sm mb-4">
          Take a quick quiz on this lesson to make sure it sticks!
        </p>
        <Link
          to={`/quiz/${lesson.id}`}
          className="bg-cafe-yellow text-cafe-espresso font-semibold px-6 py-2.5 rounded-cafe hover:bg-cafe-cream transition-colors inline-flex items-center gap-2"
        >
          Start Quiz <ArrowRight size={16} />
        </Link>
      </div>

      {/* Next lesson navigation */}
      {lesson.next_lesson_id && (
        <div className="mt-6 text-right">
          <Link
            to={`/lessons/${lesson.next_lesson_id}`}
            className="btn-secondary"
          >
            Next Lesson <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  )
}

// ─── Sub-component: renders one content section (text or code) ─────────────
function LessonSection({ section }) {
  if (section.type === 'code') {
    return (
      <div className="my-6">
        {section.title && (
          <div className="text-sm font-mono text-cafe-latte mb-2">
            # {section.title}
          </div>
        )}
        {/* react-syntax-highlighter gives us coloured code blocks */}
        <SyntaxHighlighter
          language={section.language || 'bash'}
          style={vscDarkPlus}
          customStyle={{
            borderRadius: '12px',
            fontSize: '0.875rem',
            margin: 0,
          }}
        >
          {section.content}
        </SyntaxHighlighter>
        {section.explanation && (
          <p className="text-sm text-gray-500 mt-2 italic">{section.explanation}</p>
        )}
      </div>
    )
  }

  return (
    <div className="my-4">
      {section.title && (
        <h2 className="font-display text-xl font-bold text-cafe-brown mt-8 mb-3">
          {section.title}
        </h2>
      )}
      <p className="text-gray-700 leading-relaxed">{section.content}</p>
    </div>
  )
}
