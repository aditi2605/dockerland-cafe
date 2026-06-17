// pages/Quiz.jsx — Interactive quiz for a given lesson
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'
import { getQuiz, submitQuiz } from '../utils/api'
import { useFetch } from '../hooks/useFetch'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

export default function Quiz() {
  const { lessonId } = useParams()

  const { data: quiz, loading, error, refetch } = useFetch(
    () => getQuiz(lessonId),
    [lessonId]
  )

  // Track which answer was selected per question: { questionId: optionIndex }
  const [answers,   setAnswers]   = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result,    setResult]    = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <LoadingSpinner message="Preparing your quiz..." />
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />
  if (!quiz)   return null

  const allAnswered = quiz.questions?.length > 0 &&
    quiz.questions.every(q => answers[q.id] !== undefined)

  // ── Submit handler ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const response = await submitQuiz({
        lesson_id: parseInt(lessonId),
        // Convert { questionId: optionIndex } → array of { question_id, answer_index }
        answers: Object.entries(answers).map(([qId, aIdx]) => ({
          question_id: parseInt(qId),
          answer_index: aIdx,
        })),
        username: 'guest', // TODO: replace with real auth
      })
      setResult(response.data)
      setSubmitted(true)
    } catch (err) {
      console.error('Submit error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
    setResult(null)
  }

  // ── Results screen ─────────────────────────────────────────────────────
  if (submitted && result) {
    const pct = Math.round((result.score / result.total) * 100)
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-7xl mb-4">{pct >= 70 ? '🏆' : '📚'}</div>
        <h2 className="font-display text-3xl font-bold text-cafe-brown mb-2">
          {pct >= 70 ? 'Great work, Chef!' : 'Keep practising!'}
        </h2>
        <p className="text-gray-600 mb-6">
          You scored <strong className="text-cafe-brown">{result.score} / {result.total}</strong> ({pct}%)
        </p>

        {/* Score ring */}
        <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full text-3xl font-bold mb-8
          ${pct >= 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {pct}%
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleRetry} className="btn-secondary">
            <RotateCcw size={16} /> Try Again
          </button>
          <Link to="/lessons" className="btn-primary">
            More Lessons <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  // ── Quiz questions ─────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🧠</div>
        <h1 className="font-display text-3xl font-bold text-cafe-brown">{quiz.title}</h1>
        <p className="text-gray-500 mt-2">{quiz.questions?.length} questions · Take your time</p>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {quiz.questions?.map((question, qi) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={qi}
            selectedAnswer={answers[question.id]}
            onSelect={(answerIndex) =>
              setAnswers(prev => ({ ...prev, [question.id]: answerIndex }))
            }
          />
        ))}
      </div>

      {/* Submit button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
          className={`btn-primary text-lg px-10 py-3 ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {submitting ? 'Marking...' : 'Submit Quiz ☕'}
        </button>
        {!allAnswered && (
          <p className="text-sm text-gray-400 mt-2">Answer all questions to submit</p>
        )}
      </div>
    </div>
  )
}

// ── Sub-component: single question card ────────────────────────────────────
function QuestionCard({ question, index, selectedAnswer, onSelect }) {
  return (
    <div className="menu-card">
      <div className="font-semibold text-cafe-brown mb-4">
        <span className="text-cafe-latte font-mono mr-2">Q{index + 1}.</span>
        {question.question_text}
      </div>
      <div className="space-y-2">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === i
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`w-full text-left px-4 py-3 rounded-cafe border-2 text-sm transition-all
                ${isSelected
                  ? 'border-cafe-brown bg-cafe-steam font-medium'
                  : 'border-cafe-steam hover:border-cafe-latte'
                }`}
            >
              <span className="font-mono text-cafe-latte mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
