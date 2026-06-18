import { useState }         from 'react'
import { Link }             from 'react-router-dom'
import { getLessons }       from '../utils/api'
import { useFetch }         from '../hooks/useFetch'
import { useStreak }        from '../hooks/useStreak'
import { useSound }         from '../hooks/useSound'
import LoadingSpinner       from '../components/common/LoadingSpinner'
import ErrorMessage         from '../components/common/ErrorMessage'

// XP reward per lesson (matches useStreak XP_VALUES.LESSON_COMPLETE)
const LESSON_XP = 50
const QUIZ_XP   = 75

export default function Lessons() {
  const { data: lessons, loading, error, refetch } = useFetch(getLessons)
  const { completedLessonIds, xp, level }          = useStreak()
  const { play }                                   = useSound()
  const [hoveredId, setHoveredId]                  = useState(null)

  if (loading) return <LoadingSpinner message="Loading missions..." />
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />

  // Find the first incomplete lesson, that's the "current" one
  const firstIncompleteId = lessons?.find(
    l => !completedLessonIds.includes(l.id)
  )?.id

  const getStatus = (lesson) => {
    if (completedLessonIds.includes(lesson.id)) return 'done'
    if (lesson.id === firstIncompleteId)         return 'current'
    return 'locked'
  }

  const totalXP    = lessons?.length * (LESSON_XP + QUIZ_XP) || 0
  const earnedXP   = completedLessonIds.length * LESSON_XP

  return (
    <div style={{
      maxWidth: '780px',
      margin:   '0 auto',
      padding:  '40px 20px 80px',
    }}>

      {/*  Page header */}
      <div className="animate-slide-down" style={{ marginBottom: '40px' }}>

        {/* Breadcrumb */}
        <div style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      '11px',
          color:         'rgba(255,255,255,0.25)',
          marginBottom:  '16px',
          letterSpacing: '0.5px',
        }}>
          ~/missions
        </div>

        {/* Title row */}
        <div style={{
          display:        'flex',
          alignItems:     'flex-end',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:            '16px',
          marginBottom:   '20px',
        }}>
          <div>
            <h1 style={{
              fontFamily:    "'Syne', sans-serif",
              fontSize:      '36px',
              fontWeight:    '800',
              letterSpacing: '-1.5px',
              color:         '#ffffff',
              lineHeight:    1,
              marginBottom:  '6px',
            }}>
              Mission Select
            </h1>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:   '14px',
              color:      'rgba(255,255,255,0.35)',
            }}>
              Complete missions in order · earn XP · unlock badges
            </p>
          </div>

          {/* Level badge */}
          <div style={{
            background:   'rgba(29,99,237,0.1)',
            border:       '1px solid rgba(29,99,237,0.25)',
            borderRadius: '12px',
            padding:      '12px 18px',
            textAlign:    'center',
          }}>
            <div style={{
              fontSize:     '24px',
              marginBottom: '4px',
            }}>
              {level[2]}
            </div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize:   '13px',
              fontWeight: '700',
              color:      '#ffffff',
            }}>
              {level[1]}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize:   '10px',
              color:      '#7EB3FF',
              marginTop:  '2px',
            }}>
              {xp} XP total
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{
          background:   '#0D1F3C',
          border:       '1px solid rgba(29,99,237,0.15)',
          borderRadius: '10px',
          padding:      '14px 18px',
        }}>
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            marginBottom:   '8px',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize:   '11px',
              color:      'rgba(255,255,255,0.3)',
            }}>
              curriculum progress
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize:   '11px',
              color:      '#7EB3FF',
            }}>
              {completedLessonIds.length} / {lessons?.length || 0} missions
            </span>
          </div>
          <div className="xp-bar-track" style={{ height: '6px' }}>
            <div
              className="xp-bar-fill"
              style={{
                width: lessons?.length
                  ? `${(completedLessonIds.length / lessons.length) * 100}%`
                  : '0%',
                height: '6px',
              }}
            />
          </div>
        </div>
      </div>

      {/*  Mission list */}
      <div style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           '10px',
        marginBottom:  '48px',
      }}>
        {lessons?.map((lesson, index) => {
          const status = getStatus(lesson)
          return (
            <div key={lesson.id} className="reveal">
              <MissionRow
                lesson={lesson}
                index={index}
                status={status}
                hovered={hoveredId === lesson.id}
                onHover={setHoveredId}
                onLeave={() => setHoveredId(null)}
                onPlay={play}
              />
            </div>
          )
        })}
      </div>

      {/*  XP breakdown */}
      <div className="reveal">
        <div className="section-label">what you earn</div>
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap:                 '10px',
        }}>
          {[
            { icon: '📚', label: 'Lesson complete', xp: LESSON_XP,           desc: 'Read through the lesson'       },
            { icon: '🧠', label: 'Quiz passed',     xp: QUIZ_XP,             desc: 'Score 70% or above'            },
            { icon: '💯', label: 'Perfect quiz',    xp: QUIZ_XP + 25,        desc: 'Score 100% — bonus XP!'        },
            { icon: '⚡', label: 'Daily challenge', xp: 30,                  desc: 'Run the daily command'         },
          ].map(({ icon, label, xp: reward, desc }) => (
            <div key={label} style={{
              background:   '#0D1F3C',
              border:       '1px solid rgba(29,99,237,0.12)',
              borderRadius: '12px',
              padding:      '16px',
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
              <div style={{
                fontFamily:   "'JetBrains Mono', monospace",
                fontSize:     '14px',
                color:        '#E8C547',
                fontWeight:   '600',
                marginBottom: '4px',
              }}>
                +{reward} XP
              </div>
              <div style={{
                fontFamily:   "'Syne', sans-serif",
                fontSize:     '12px',
                fontWeight:   '700',
                color:        '#ffffff',
                marginBottom: '4px',
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize:   '11px',
                color:      'rgba(255,255,255,0.3)',
              }}>
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

//  Mission row
function MissionRow({ lesson, index, status, hovered, onHover, onLeave, onPlay }) {
  const isDone    = status === 'done'
  const isCurrent = status === 'current'
  const isLocked  = status === 'locked'

  const content = (
    <div
      onMouseEnter={() => { if (!isLocked) onHover(lesson.id) }}
      onMouseLeave={onLeave}
      onClick={() => { if (!isLocked) onPlay('click') }}
      style={{
        display:       'flex',
        alignItems:    'center',
        gap:           '16px',
        background:    isDone    ? 'rgba(61,214,140,0.04)'
                     : isCurrent ? '#0F2240'
                     :             '#0D1F3C',
        border:        isDone    ? '1px solid rgba(61,214,140,0.2)'
                     : isCurrent ? '1px solid rgba(29,99,237,0.5)'
                     :             '1px solid rgba(255,255,255,0.06)',
        borderRadius:  '14px',
        padding:       '18px 20px',
        cursor:        isLocked ? 'not-allowed' : 'pointer',
        opacity:       isLocked ? 0.45 : 1,
        transition:    'all 0.2s',
        transform:     hovered && !isLocked ? 'translateX(4px)' : 'translateX(0)',
        position:      'relative',
        overflow:      'hidden',
      }}
    >
      {/* Current mission left accent bar */}
      {isCurrent && (
        <div style={{
          position:     'absolute',
          left:         0,
          top:          0,
          bottom:       0,
          width:        '3px',
          background:   '#1D63ED',
          borderRadius: '3px 0 0 3px',
        }} />
      )}

      {/* Mission number */}
      <div style={{
        fontFamily:    "'JetBrains Mono', monospace",
        fontSize:      '11px',
        color:         isDone    ? 'rgba(61,214,140,0.5)'
                     : isCurrent ? '#7EB3FF'
                     :             'rgba(255,255,255,0.15)',
        minWidth:      '24px',
        flexShrink:    0,
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Status circle */}
      <div style={{
        width:          '40px',
        height:         '40px',
        borderRadius:   '50%',
        background:     isDone    ? 'rgba(61,214,140,0.12)'
                      : isCurrent ? 'rgba(29,99,237,0.15)'
                      :             'rgba(255,255,255,0.04)',
        border:         isDone    ? '1.5px solid rgba(61,214,140,0.35)'
                      : isCurrent ? '1.5px solid #1D63ED'
                      :             '1.5px solid rgba(255,255,255,0.08)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '18px',
        flexShrink:     0,
        animation:      isCurrent ? 'pulse-dot 2s ease-in-out infinite' : 'none',
        position:       'relative',
      }}>
        {isDone ? '✓' : lesson.emoji || '📖'}

        {/* Ripple on current */}
        {isCurrent && (
          <div style={{
            position:     'absolute',
            inset:        '-6px',
            borderRadius: '50%',
            border:       '1px solid rgba(29,99,237,0.3)',
            animation:    'ripple 1.8s ease-out infinite',
          }} />
        )}
      </div>

      {/* Lesson info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily:   "'Syne', sans-serif",
          fontSize:     '15px',
          fontWeight:   '700',
          color:        isDone    ? 'rgba(255,255,255,0.6)'
                      : isCurrent ? '#ffffff'
                      :             'rgba(255,255,255,0.4)',
          marginBottom: '3px',
          whiteSpace:   'nowrap',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
        }}>
          {lesson.title}
        </div>
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '10px',
          flexWrap:   'wrap',
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize:   '11px',
            color:      isDone    ? 'rgba(61,214,140,0.5)'
                      : isCurrent ? 'rgba(126,179,255,0.7)'
                      :             'rgba(255,255,255,0.2)',
          }}>
            {lesson.cafe_concept}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize:   '11px',
            color:      'rgba(255,255,255,0.15)',
          }}>
            · {lesson.duration_minutes} min
          </span>
        </div>
      </div>

      {/* Right side — XP + arrow */}
      <div style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '12px',
        flexShrink: 0,
      }}>
        {isDone ? (
          <div className="pill pill-green" style={{ fontSize: '10px' }}>
            ✓ complete
          </div>
        ) : (
          <div className="pill pill-gold" style={{ fontSize: '10px' }}>
            +{LESSON_XP} XP
          </div>
        )}

        {!isLocked && (
          <div style={{
            color:      isCurrent ? '#7EB3FF' : 'rgba(255,255,255,0.2)',
            fontSize:   '16px',
            transition: 'transform 0.2s',
            transform:  hovered ? 'translateX(4px)' : 'translateX(0)',
          }}>
            →
          </div>
        )}

        {isLocked && (
          <div style={{
            color:    'rgba(255,255,255,0.15)',
            fontSize: '14px',
          }}>
            🔒
          </div>
        )}
      </div>
    </div>
  )

  // Wrap in Link only if not locked
  if (isLocked) return content

  return (
    <Link
      to={`/lessons/${lesson.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      {content}
    </Link>
  )
}