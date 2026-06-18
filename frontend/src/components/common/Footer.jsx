import { Link } from 'react-router-dom'
import { useStreak } from '../../hooks/useStreak'

export default function Footer() {
  const { xp, streak, level, lessonsCompleted } = useStreak()

  return (
    <footer style={{
      borderTop:  '1px solid rgba(29, 99, 237, 0.12)',
      marginTop:  'auto',
      background: 'rgba(6, 14, 28, 0.8)',
    }}>
      <div style={{
        maxWidth:  '1100px',
        margin:    '0 auto',
        padding:   '32px 20px',
      }}>

        {/* ── Top row — logo + links ──────────────────────────────────── */}
        <div style={{
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          gap:            '32px',
          flexWrap:       'wrap',
          marginBottom:   '28px',
        }}>

          {/* Logo + tagline */}
          <div>
            <div style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '7px',
              marginBottom: '10px',
            }}>
              <span style={{
                fontSize:  '16px',
                animation: 'float 3s ease-in-out infinite',
                display:   'inline-block',
              }}>
                🐳
              </span>
              <div>
                <div style={{
                  fontFamily:    "'Syne', sans-serif",
                  fontSize:      '14px',
                  fontWeight:    '800',
                  letterSpacing: '-0.3px',
                }}>
                  <span style={{ color: '#1D63ED' }}>Docker</span>
                  <span style={{ color: '#fff' }}>Land</span>
                </div>
                <div style={{
                  fontFamily:    "'Righteous', cursive",
                  fontSize:      '8px',
                  color:         '#E8C547',
                  letterSpacing: '1.5px',
                  marginTop:     '1px',
                }}>
                  CAFÉ
                </div>
              </div>
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:   '12px',
              color:      'rgba(255,255,255,0.25)',
              lineHeight: 1.6,
              maxWidth:   '220px',
            }}>
              Learn Docker through missions,
              earn XP, collect badges.
              No prior DevOps experience needed.
            </p>
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>

            <div>
              <div style={{
                fontFamily:    "'JetBrains Mono', monospace",
                fontSize:      '10px',
                color:         'rgba(255,255,255,0.2)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom:  '12px',
              }}>
                Navigate
              </div>
              <div style={{
                display:       'flex',
                flexDirection: 'column',
                gap:           '8px',
              }}>
                {[
                  { to: '/lessons',     label: '~/lessons'    },
                  { to: '/labs',        label: '~/kitchen'    },
                  { to: '/cheat-sheet', label: '~/cheatsheet' },
                  { to: '/progress',   label: '~/progress'   },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      fontFamily:     "'JetBrains Mono', monospace",
                      fontSize:       '12px',
                      color:          'rgba(255,255,255,0.35)',
                      textDecoration: 'none',
                      transition:     'color 0.15s',
                    }}
                    onMouseEnter={e => e.target.style.color = '#7EB3FF'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div style={{
                fontFamily:    "'JetBrains Mono', monospace",
                fontSize:      '10px',
                color:         'rgba(255,255,255,0.2)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom:  '12px',
              }}>
                Dictionary
              </div>
              <div style={{
                display:       'flex',
                flexDirection: 'column',
                gap:           '7px',
              }}>
                {[
                  ['🧾', 'Dockerfile', 'Recipe'         ],
                  ['🖼️', 'Image',      'Meal blueprint' ],
                  ['🍽️', 'Container',  'Cooked meal'    ],
                  ['🧊', 'Volume',     'The fridge'     ],
                  ['📋', 'Compose',    'The manager'    ],
                ].map(([emoji, docker, cafe]) => (
                  <div
                    key={docker}
                    style={{
                      display:    'flex',
                      alignItems: 'center',
                      gap:        '7px',
                    }}
                  >
                    <span style={{ fontSize: '11px' }}>{emoji}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize:   '10px',
                      color:      '#7EB3FF',
                    }}>
                      {docker}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color:    'rgba(255,255,255,0.2)',
                    }}>
                      =
                    </span>
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize:   '10px',
                      color:      'rgba(255,255,255,0.35)',
                    }}>
                      {cafe}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/*  Player stats bar  */}
        {xp > 0 && (
          <div style={{
            background:    'rgba(29, 99, 237, 0.06)',
            border:        '1px solid rgba(29, 99, 237, 0.12)',
            borderRadius:  '10px',
            padding:       '12px 20px',
            display:       'flex',
            alignItems:    'center',
            gap:           '24px',
            flexWrap:      'wrap',
            marginBottom:  '24px',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize:   '11px',
              color:      'rgba(255,255,255,0.25)',
            }}>
              your stats
            </span>

            {[
              { label: 'XP',        value: xp,               suffix: ''   },
              { label: 'Streak',    value: streak,            suffix: ' days' },
              { label: 'Level',     value: level[1],          suffix: ''   },
              { label: 'Lessons',   value: lessonsCompleted,  suffix: ' done' },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        '6px',
                }}
              >
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize:   '10px',
                  color:      'rgba(255,255,255,0.2)',
                }}>
                  {label}:
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize:   '11px',
                  color:      '#7EB3FF',
                  fontWeight: '600',
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/*  Bottom bar  */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:            '12px',
          paddingTop:     '20px',
          borderTop:      '1px solid rgba(255,255,255,0.05)',
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize:   '10px',
            color:      'rgba(255,255,255,0.15)',
          }}>
            // built with ☕ and 🐳 · open source portfolio project
          </span>

          {/* Docker version pill */}
          <div style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '16px',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize:   '10px',
              color:      'rgba(255,255,255,0.12)',
            }}>
              React · FastAPI · PostgreSQL · Docker
            </span>
            
            <a href="https://docs.docker.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily:     "'JetBrains Mono', monospace",
                fontSize:       '10px',
                color:          'rgba(29,99,237,0.5)',
                textDecoration: 'none',
                transition:     'color 0.15s',
              }}
              onMouseEnter={e => e.target.style.color = '#7EB3FF'}
              onMouseLeave={e => e.target.style.color = 'rgba(29,99,237,0.5)'}
            >
              docker docs ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}