import { useEffect, useState }    from 'react'
import { Link }                   from 'react-router-dom'
import { getLessons }             from '../utils/api'
import { useStreak }              from '../hooks/useStreak'
import { useSound }               from '../hooks/useSound'
import { useToast }               from '../components/common/XPToast'
import JourneyMap                 from '../components/common/JourneyMap'
import DailyChallenge             from '../components/common/DailyChallenge'
import LoadingSpinner             from '../components/common/LoadingSpinner'

//  Concept dictionary data 
const CONCEPTS = [
  { emoji: '🧾', docker: 'Dockerfile', cafe: 'Recipe',        desc: 'Step-by-step build instructions' },
  { emoji: '🖼️', docker: 'Image',      cafe: 'Blueprint',     desc: 'Read-only packaged template'     },
  { emoji: '🍽️', docker: 'Container',  cafe: 'Cooked meal',   desc: 'A running instance'              },
  { emoji: '🪟', docker: 'Port',       cafe: 'Serving window',desc: 'How the world reaches your app'  },
  { emoji: '🧊', docker: 'Volume',     cafe: 'Fridge',        desc: 'Persistent storage'              },
  { emoji: '🛤️', docker: 'Network',    cafe: 'Waiter path',   desc: 'How containers talk'             },
  { emoji: '📋', docker: 'Compose',    cafe: 'Manager',       desc: 'Orchestrates everything'         },
  { emoji: '🛒', docker: 'Docker Hub', cafe: 'Supermarket',   desc: 'Public image registry'           },
]

export default function Home() {
  const [lessons, setLessons]   = useState([])
  const [loading, setLoading]   = useState(true)

  const {
    xp,
    streak,
    level,
    nextLevel,
    levelProgress,
    completedLessonIds,
    lessonsCompleted,
  } = useStreak()

  const { play }      = useSound()
  const { showToast } = useToast()

  // Find the current lesson — first incomplete one
  const currentLessonId = lessons.find(
    l => !completedLessonIds.includes(l.id)
  )?.id || lessons[0]?.id

  // Fetch lessons for the journey map
  useEffect(() => {
    getLessons()
      .then(res => setLessons(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>

      {/*  1. HERO  */}
      <section style={{ marginBottom: '56px', textAlign: 'center' }}>

        {/* Eyebrow badge */}
        <div
          className="animate-fade-in"
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '8px',
            background:     'rgba(29, 99, 237, 0.1)',
            border:         '1px solid rgba(29, 99, 237, 0.25)',
            borderRadius:   '100px',
            padding:        '6px 16px',
            fontFamily:     "'JetBrains Mono', monospace",
            fontSize:       '11px',
            color:          '#7EB3FF',
            marginBottom:   '28px',
          }}
        >
          <span style={{
            width:        '6px',
            height:       '6px',
            borderRadius: '50%',
            background:   '#1D63ED',
            animation:    'pulse-dot 1.5s ease-in-out infinite',
            display:      'inline-block',
          }} />
          Docker for humans · no experience needed
        </div>

        {/* Main headline */}
        <h1
          className="animate-slide-up"
          style={{
            fontFamily:    "'Syne', sans-serif",
            fontSize:      'clamp(36px, 6vw, 60px)',
            fontWeight:    '800',
            lineHeight:    1.05,
            letterSpacing: '-2px',
            marginBottom:  '16px',
          }}
        >
          <span style={{ color: '#ffffff' }}>Ship code like a </span>
          <span style={{ color: '#1D63ED' }}>pro</span>
          <br />
          <span style={{ color: '#ffffff' }}>one </span>
          <span style={{ color: '#E8C547' }}>coffee</span>
          <span style={{ color: '#ffffff' }}> at a time ☕</span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-slide-up"
          style={{
            fontFamily:     "'Inter', sans-serif",
            fontSize:       '16px',
            color:          'rgba(255,255,255,0.45)',
            maxWidth:       '480px',
            margin:         '0 auto 32px',
            lineHeight:     1.6,
            animationDelay: '80ms',
          }}
        >
          Containers are meals. Dockerfiles are recipes.
          Volumes are fridges. It finally makes sense.
        </p>

        {/* Terminal strip */}
        <div
          className="terminal animate-slide-up"
          style={{
            maxWidth:       '420px',
            margin:         '0 auto 28px',
            animationDelay: '160ms',
            textAlign:      'left',
          }}
        >
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: '#FF5F57' }} />
            <div className="terminal-dot" style={{ background: '#FFBD2E' }} />
            <div className="terminal-dot" style={{ background: '#28CA41' }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize:   '10px',
              color:      'rgba(255,255,255,0.2)',
              marginLeft: '6px',
            }}>
              ~/dockerland-cafe
            </span>
          </div>
          <div className="terminal-body">
            <div>
              <span className="terminal-prompt">➜ </span>
              <span className="terminal-cmd">docker compose up --build</span>
            </div>
            <div style={{ marginTop: '6px' }}>
              <span className="terminal-out">✓ frontend  · started on :3000</span>
            </div>
            <div>
              <span className="terminal-out">✓ backend   · started on :8000</span>
            </div>
            <div>
              <span className="terminal-out">✓ db        · PostgreSQL ready</span>
            </div>
            <div style={{ marginTop: '6px' }}>
              <span className="terminal-prompt">➜ </span>
              <span className="terminal-cursor" />
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div
          className="animate-slide-up"
          style={{
            display:        'flex',
            gap:            '12px',
            justifyContent: 'center',
            flexWrap:       'wrap',
            animationDelay: '240ms',
          }}
        >
          <Link
            to={currentLessonId ? `/lessons/${currentLessonId}` : '/lessons'}
            className="btn-primary"
            onClick={() => play('click')}
            style={{ fontSize: '14px', padding: '12px 28px' }}
          >
            ▶ {xp > 0 ? 'Resume mission' : 'Start mission 01'}
          </Link>
          <Link
            to="/cheat-sheet"
            className="btn-ghost"
            onClick={() => play('click')}
            style={{ fontSize: '14px', padding: '12px 24px' }}
          >
            📋 Cheat sheet
          </Link>
        </div>
      </section>

      {/* 2. JOURNEY MAP  */}
      <section className="reveal" style={{ marginBottom: '40px' }}>
        {loading
          ? <LoadingSpinner message="Loading your journey..." />
          : (
            <JourneyMap
              lessons={lessons}
              completedLessonIds={completedLessonIds}
              currentLessonId={currentLessonId}
            />
          )
        }
      </section>

      {/* 3. DAILY CHALLENGE */}
      <section className="reveal" style={{ marginBottom: '48px' }}>
        <DailyChallenge />
      </section>

      {/*  4. CONCEPT STRIP  */}
      <section className="reveal" style={{ marginBottom: '48px' }}>
        <div className="section-label">The café ↔ docker dictionary</div>

        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap:                 '10px',
        }}>
          {CONCEPTS.map((c, i) => (
            <div
              key={c.docker}
              className="reveal"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <ConceptCard concept={c} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. PLAYER STATS  */}
      {xp > 0 && (
        <section className="reveal">
          <div className="section-label">your stats</div>

          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap:                 '10px',
          }}>
            {[
              { label: 'Total XP',   value: xp,                icon: '⚡' },
              { label: 'Day Streak', value: `${streak} days`,  icon: '🔥' },
              { label: 'Level',      value: level[1],           icon: level[2] },
              { label: 'Lessons',    value: `${lessonsCompleted} / 5`, icon: '📚' },
            ].map(({ label, value, icon }) => (
              <StatCard key={label} label={label} value={value} icon={icon} />
            ))}
          </div>

          {/* Level progress bar */}
          {nextLevel && (
            <div style={{
              marginTop:  '16px',
              background: '#0D1F3C',
              border:     '1px solid rgba(29,99,237,0.15)',
              borderRadius: '12px',
              padding:    '16px 20px',
            }}>
              <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                marginBottom:   '8px',
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize:   '11px',
                  color:      'rgba(255,255,255,0.35)',
                }}>
                  {level[2]} {level[1]}
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize:   '11px',
                  color:      '#7EB3FF',
                }}>
                  {nextLevel[2]} {nextLevel[1]} →
                </span>
              </div>
              <div className="xp-bar-track">
                <div
                  className="xp-bar-fill"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize:   '10px',
                color:      'rgba(255,255,255,0.2)',
                marginTop:  '6px',
                textAlign:  'right',
              }}>
                {nextLevel[0] - xp} XP to next level
              </div>
            </div>
          )}
        </section>
      )}

      {/* First visit — no stats yet, show a gentle nudge */}
      {xp === 0 && (
        <section className="reveal" style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize:   '12px',
            color:      'rgba(255,255,255,0.2)',
          }}>
            // complete your first mission to start earning XP
          </p>
        </section>
      )}
    </div>
  )
}

// Concept card 
function ConceptCard({ concept }) {
  return (
    <div style={{
      background:   '#0D1F3C',
      border:       '1px solid rgba(29, 99, 237, 0.12)',
      borderRadius: '12px',
      padding:      '16px',
      transition:   'border-color 0.2s, transform 0.2s',
      cursor:       'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(29,99,237,0.35)'
        e.currentTarget.style.transform   = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(29,99,237,0.12)'
        e.currentTarget.style.transform   = 'translateY(0)'
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>
        {concept.emoji}
      </div>
      <div style={{
        fontFamily:   "'JetBrains Mono', monospace",
        fontSize:     '10px',
        color:        '#7EB3FF',
        fontWeight:   '600',
        letterSpacing:'0.5px',
        marginBottom: '3px',
        textTransform:'uppercase',
      }}>
        {concept.docker}
      </div>
      <div style={{
        fontFamily:   "'Syne', sans-serif",
        fontSize:     '13px',
        fontWeight:   '700',
        color:        '#ffffff',
        marginBottom: '4px',
      }}>
        {concept.cafe}
      </div>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize:   '11px',
        color:      'rgba(255,255,255,0.3)',
        lineHeight: 1.5,
      }}>
        {concept.desc}
      </div>
    </div>
  )
}

// Stat card 
function StatCard({ label, value, icon }) {
  return (
    <div style={{
      background:   '#0D1F3C',
      border:       '1px solid rgba(29,99,237,0.15)',
      borderRadius: '12px',
      padding:      '16px',
      textAlign:    'center',
    }}>
      <div style={{ fontSize: '22px', marginBottom: '8px' }}>{icon}</div>
      <div style={{
        fontFamily:   "'Syne', sans-serif",
        fontSize:     '18px',
        fontWeight:   '700',
        color:        '#ffffff',
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize:   '10px',
        color:      'rgba(255,255,255,0.3)',
        letterSpacing: '0.5px',
      }}>
        {label}
      </div>
    </div>
  )
}