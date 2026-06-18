import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStreak } from '../../hooks/useStreak'
import { useSound }  from '../../hooks/useSound'

//  Nav links 
const NAV_LINKS = [
  { to: '/lessons',     label: '~/lessons'     },
  { to: '/labs',        label: '~/kitchen'     },
  { to: '/cheat-sheet', label: '~/cheatsheet'  },
  { to: '/progress',   label: '~/progress'    },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname }            = useLocation()

  // Pull game state from the streak hook
  const {
    xp,
    streak,
    level,
    nextLevel,
    levelProgress,
  } = useStreak()

  // Sound toggle
  const { soundOn, ambientOn, toggleSound, toggleAmbient, play } = useSound()

  const isActive = (to) => pathname.startsWith(to)

  const handleNavClick = () => {
    play('click')
    setMenuOpen(false)
  }

  return (
    <nav style={{
      position:        'sticky',
      top:             0,
      zIndex:          100,
      background:      'rgba(10, 22, 40, 0.92)',
      backdropFilter:  'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom:    '1px solid rgba(29, 99, 237, 0.15)',
    }}>
      <div style={{
        maxWidth:      '1100px',
        margin:        '0 auto',
        padding:       '0 20px',
        height:        '56px',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'space-between',
        gap:           '16px',
      }}>

        {/*  Logo  */}
        <Link
          to="/"
          onClick={() => play('click')}
          style={{ textDecoration: 'none', flexShrink: 0 }}
        >
          <Logo />
        </Link>

        {/*  Desktop nav links*/}
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '2px',
          flex:       1,
          justifyContent: 'center',
        }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={handleNavClick}
              style={{
                fontFamily:     "'JetBrains Mono', monospace",
                fontSize:       '12px',
                padding:        '6px 14px',
                borderRadius:   '8px',
                textDecoration: 'none',
                transition:     'all 0.15s',
                color:          isActive(to)
                  ? '#7EB3FF'
                  : 'rgba(255,255,255,0.4)',
                background:     isActive(to)
                  ? 'rgba(29, 99, 237, 0.12)'
                  : 'transparent',
                border:         isActive(to)
                  ? '1px solid rgba(29, 99, 237, 0.25)'
                  : '1px solid transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side HUD  */}
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '8px',
          flexShrink:  0,
        }}>

          {/* Streak pill */}
          {streak > 0 && (
            <div className="pill pill-gold" style={{ gap: '5px' }}>
              🔥
              <span>Day {streak}</span>
            </div>
          )}

          {/* XP + level pill with progress bar */}
          <div style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '3px',
            background:    'rgba(29, 99, 237, 0.1)',
            border:        '1px solid rgba(29, 99, 237, 0.22)',
            borderRadius:  '10px',
            padding:       '5px 11px',
            minWidth:      '90px',
          }}>
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              gap:            '8px',
            }}>
              <span style={{
                fontFamily:  "'JetBrains Mono', monospace",
                fontSize:    '11px',
                color:       '#7EB3FF',
                fontWeight:  '600',
              }}>
                {level[2]} {xp} XP
              </span>
              {nextLevel && (
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize:   '9px',
                  color:      'rgba(255,255,255,0.25)',
                }}>
                  lv{level.index + 1}
                </span>
              )}
            </div>

            {/* XP progress bar toward next level */}
            {nextLevel && (
              <div className="xp-bar-track">
                <div
                  className="xp-bar-fill"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Sound toggle button */}
          <SoundButton
            soundOn={soundOn}
            ambientOn={ambientOn}
            onToggleSound={toggleSound}
            onToggleAmbient={toggleAmbient}
          />

          {/* Continue / Start button */}
          <Link
            to="/lessons"
            onClick={() => play('click')}
            className="btn-primary"
            style={{
              fontSize:  '12px',
              padding:   '7px 16px',
              borderRadius: '8px',
            }}
          >
            ▶ {xp > 0 ? 'Continue' : 'Start'}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="show-mobile"
            style={{
              background:   'none',
              border:       '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              color:        'rgba(255,255,255,0.6)',
              padding:      '6px 10px',
              cursor:       'pointer',
              fontFamily:   "'JetBrains Mono', monospace",
              fontSize:     '14px',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/*  Mobile dropdown */}
      {menuOpen && (
        <div
          className="animate-slide-down"
          style={{
            borderTop:   '1px solid rgba(29, 99, 237, 0.15)',
            padding:     '12px 20px 16px',
            display:     'flex',
            flexDirection:'column',
            gap:         '4px',
          }}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={handleNavClick}
              style={{
                fontFamily:     "'JetBrains Mono', monospace",
                fontSize:       '13px',
                padding:        '10px 14px',
                borderRadius:   '8px',
                textDecoration: 'none',
                color:          isActive(to) ? '#7EB3FF' : 'rgba(255,255,255,0.55)',
                background:     isActive(to) ? 'rgba(29,99,237,0.1)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* Mobile-only CSS helpers */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  )
}

//  Logo component 
function Logo() {
  return (
    <div style={{
      display:    'flex',
      alignItems: 'center',
      gap:        '7px',
    }}>
      {/* Whale — floats gently */}
      <span style={{
        fontSize:  '18px',
        display:   'inline-block',
        animation: 'float 3s ease-in-out infinite',
        lineHeight: 1,
      }}>
        🐳
      </span>

      {/* Wordmark */}
      <div style={{ lineHeight: 1 }}>
        {/* DockerLand — Syne bold, split colour */}
        <div style={{
          fontFamily:  "'Syne', sans-serif",
          fontSize:    '15px',
          fontWeight:  '800',
          letterSpacing: '-0.5px',
          lineHeight:  1,
        }}>
          <span style={{ color: '#1D63ED' }}>Docker</span>
          <span style={{ color: '#ffffff' }}>Land</span>
        </div>

        {/* CAFÉ subtitle row */}
        <div style={{
          display:     'flex',
          alignItems:  'center',
          gap:         '4px',
          marginTop:   '2px',
        }}>
          <span style={{
            fontSize:      '8px',
            color:         'rgba(232,197,71,0.5)',
            letterSpacing: '1px',
          }}>
            ~ ~
          </span>
          <span style={{
            fontFamily:    "'Righteous', cursive",
            fontSize:      '9px',
            color:         '#E8C547',
            letterSpacing: '1.5px',
          }}>
            CAFÉ
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '8px' }}>
            ·
          </span>
          <span style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      '8px',
            color:         'rgba(255,255,255,0.25)',
            letterSpacing: '0.3px',
          }}>
            learn docker
          </span>
        </div>
      </div>
    </div>
  )
}

// Sound toggle button 
// Two-layer button — click once for sound on/off, hold to see ambient toggle
function SoundButton({ soundOn, ambientOn, onToggleSound, onToggleAmbient }) {
  const [showAmbient, setShowAmbient] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggleSound}
        onMouseEnter={() => soundOn && setShowAmbient(true)}
        onMouseLeave={() => setShowAmbient(false)}
        title={soundOn ? 'Sound on — hover for ambient' : 'Sound off'}
        style={{
          background:   soundOn
            ? 'rgba(29, 99, 237, 0.15)'
            : 'rgba(255,255,255,0.05)',
          border:       soundOn
            ? '1px solid rgba(29, 99, 237, 0.3)'
            : '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          color:        soundOn ? '#7EB3FF' : 'rgba(255,255,255,0.3)',
          padding:      '6px 10px',
          cursor:       'pointer',
          fontSize:     '14px',
          transition:   'all 0.15s',
        }}
      >
        {soundOn ? '🔊' : '🔇'}
      </button>

      {/* Ambient toggle — appears on hover when sound is on */}
      {showAmbient && soundOn && (
        <div
          onMouseEnter={() => setShowAmbient(true)}
          onMouseLeave={() => setShowAmbient(false)}
          className="animate-fade-in"
          style={{
            position:   'absolute',
            top:        '100%',
            right:      0,
            marginTop:  '6px',
            background: 'rgba(10, 22, 40, 0.97)',
            border:     '1px solid rgba(29, 99, 237, 0.25)',
            borderRadius: '10px',
            padding:    '10px 14px',
            whiteSpace: 'nowrap',
            boxShadow:  '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize:   '10px',
            color:      'rgba(255,255,255,0.35)',
            marginBottom: '8px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            Ambient
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleAmbient() }}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '8px',
              background:   ambientOn
                ? 'rgba(29, 99, 237, 0.15)'
                : 'rgba(255,255,255,0.05)',
              border:       ambientOn
                ? '1px solid rgba(29, 99, 237, 0.3)'
                : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color:        ambientOn ? '#7EB3FF' : 'rgba(255,255,255,0.4)',
              padding:      '7px 12px',
              cursor:       'pointer',
              fontFamily:   "'JetBrains Mono', monospace",
              fontSize:     '12px',
              width:        '100%',
              transition:   'all 0.15s',
            }}
          >
            ☕ {ambientOn ? 'Café sounds on' : 'Café sounds off'}
          </button>
        </div>
      )}
    </div>
  )
}