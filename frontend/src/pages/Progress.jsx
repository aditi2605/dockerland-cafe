// pages/Progress.jsx — Student progress dashboard ("My Tab")
import { useState } from 'react'
import { getProgress } from '../utils/api'
import { useFetch } from '../hooks/useFetch'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Trophy, Target, BookOpen, Star } from 'lucide-react'

export default function Progress() {
  const [username, setUsername] = useState('guest')
  const [searchName, setSearchName] = useState('guest')

  const { data: progress, loading, error, refetch } = useFetch(
    () => getProgress(searchName),
    [searchName]
  )

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchName(username)
  }

  const totalLessons = progress?.total_lessons || 0
  const completedLessons = progress?.completed_lessons?.length || 0
  const completionPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const avgScore = progress?.average_quiz_score || 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">📊</div>
        <h1 className="font-display text-4xl font-bold text-cafe-brown mb-2">My Tab</h1>
        <p className="text-gray-600">Track your progress through the DockerLand Café curriculum</p>
      </div>

      {/* Username lookup */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-sm mx-auto mb-10">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username..."
          className="flex-1 border-2 border-cafe-steam rounded-cafe px-4 py-2 focus:border-cafe-latte outline-none text-sm"
        />
        <button type="submit" className="btn-primary text-sm">Look Up</button>
      </form>

      {loading && <LoadingSpinner message="Checking your tab..." />}

      {!loading && progress && (
        <>
          {/* Stats overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: BookOpen, label: 'Lessons Done',    value: `${completedLessons}/${totalLessons}`, color: 'text-cafe-blue' },
              { icon: Target,   label: 'Completion',      value: `${completionPct}%`,                  color: 'text-cafe-green' },
              { icon: Star,     label: 'Avg Quiz Score',  value: `${avgScore}%`,                       color: 'text-cafe-yellow' },
              { icon: Trophy,   label: 'Quizzes Taken',   value: progress.quiz_attempts || 0,          color: 'text-cafe-latte' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="menu-card text-center">
                <Icon size={24} className={`mx-auto mb-2 ${color}`} />
                <div className="font-display text-2xl font-bold text-cafe-brown">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div className="menu-card mb-8">
            <h2 className="font-display font-bold text-cafe-brown text-lg mb-4">
              Overall Progress
            </h2>
            <div className="progress-bar mb-2">
              <div className="progress-bar-fill" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{completedLessons} lessons completed</span>
              <span>{completionPct}%</span>
            </div>
          </div>

          {/* Completed lessons list */}
          {progress.completed_lessons?.length > 0 && (
            <div className="menu-card">
              <h2 className="font-display font-bold text-cafe-brown text-lg mb-4">
                ✅ Completed Lessons
              </h2>
              <div className="space-y-2">
                {progress.completed_lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between bg-green-50 rounded-cafe px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm font-medium">{lesson.title}</span>
                    </div>
                    {lesson.quiz_score != null && (
                      <span className="badge bg-green-100 text-green-800 text-xs">
                        Quiz: {lesson.quiz_score}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {completedLessons === 0 && (
            <div className="text-center py-10 text-gray-400">
              <div className="text-4xl mb-3">🌱</div>
              <p>No progress yet — head to the <a href="/lessons" className="text-cafe-latte underline">Menu</a> to get started!</p>
            </div>
          )}
        </>
      )}

      {!loading && error && (
        <div className="text-center py-10 text-gray-400">
          <div className="text-4xl mb-3">🤷</div>
          <p>No progress found for <strong>{searchName}</strong>. Try a different username.</p>
        </div>
      )}
    </div>
  )
}
