// pages/Lessons.jsx — Shows all available lessons (the café "menu")
import { Link } from 'react-router-dom'
import { Clock, Star, ArrowRight, ChefHat } from 'lucide-react'
import { getLessons } from '../utils/api'
import { useFetch } from '../hooks/useFetch'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

// Colour map for difficulty badges
const DIFFICULTY_STYLES = {
  beginner:     'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced:     'bg-red-100   text-red-800',
}

export default function Lessons() {
  // useFetch calls getLessons() on mount and gives us data/loading/error
  const { data: lessons, loading, error, refetch } = useFetch(getLessons)

  if (loading) return <LoadingSpinner message="Reading the menu board..." />
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-5xl mb-3">📚</div>
        <h1 className="font-display text-4xl font-bold text-cafe-brown mb-3">Today's Menu</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Each lesson is a dish. Start from the top and work your way through — 
          every item builds on the last. No rushing the kitchen! 🧑‍🍳
        </p>
      </div>

      {/* Lesson grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons?.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/lessons/${lesson.id}`}
            className="menu-card group flex flex-col hover:border-cafe-latte border border-transparent transition-all"
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-3">
              <div className="text-4xl">{lesson.emoji || '📖'}</div>
              <span className={`badge ${DIFFICULTY_STYLES[lesson.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                {lesson.difficulty}
              </span>
            </div>

            {/* Lesson number + title */}
            <div className="text-xs font-mono text-cafe-latte mb-1">
              Lesson {lesson.order_index}
            </div>
            <h2 className="font-display font-bold text-cafe-brown text-xl mb-2 group-hover:text-cafe-latte transition-colors">
              {lesson.title}
            </h2>
            <p className="text-gray-600 text-sm flex-1 leading-relaxed mb-4">
              {lesson.summary}
            </p>

            {/* Footer: meta info */}
            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-cafe-steam pt-3 mt-auto">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {lesson.duration_minutes} min
              </span>
              <span className="flex items-center gap-1">
                <ChefHat size={12} /> {lesson.cafe_concept}
              </span>
              <span className="flex items-center gap-1 text-cafe-latte font-medium">
                Start <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {lessons?.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-gray-500">The kitchen is still prepping — check back soon!</p>
        </div>
      )}
    </div>
  )
}
