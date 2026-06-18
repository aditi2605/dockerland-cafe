// The animated toast notification that pops up from the bottom
// whenever the player earns XP, levels up, or unlocks a badge.
// Three toast types:
//   xp      → "+50 XP" with gold shimmer
//   badge   → "Badge Unlocked 🏆" with the badge details
//   level   → "Level Up! You are now a Barista" with big celebration
//
// Usage (from any component via Context):
//   const { showToast } = useToast()
//   showToast({ type: 'xp', amount: 50 })
//   showToast({ type: 'badge', badge: { name: 'Container Chef', emoji: '🍽️' } })
//   showToast({ type: 'level', level: ['Barista', '🧑‍🍳'] })

import { createContext, useContext, useState, useCallback, useRef } from 'react'

//  Context 
const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

//  Provider — wrap App with this 
export function ToastProvider({ children }) {
  // Queue of toasts: [{ id, type, ...data }]
  const [toasts, setToasts]   = useState([])
  const counterRef            = useRef(0)

  const showToast = useCallback((toastData) => {
    const id = ++counterRef.current

    setToasts(prev => [...prev, { id, ...toastData }])

    // Auto-dismiss after duration
    const duration = toastData.type === 'level' ? 4000 : 2800
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack — fixed bottom-centre, stacks upward */}
      <div
        style={{
          position:       'fixed',
          bottom:         '28px',
          left:           '50%',
          transform:      'translateX(-50%)',
          zIndex:         9999,
          display:        'flex',
          flexDirection:  'column-reverse',
          alignItems:     'center',
          gap:            '10px',
          pointerEvents:  'none',
        }}
      >
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

//  Single toast component 
function Toast({ toast, onDismiss }) {
  if (toast.type === 'xp')    return <XPToast    toast={toast} onDismiss={onDismiss} />
  if (toast.type === 'badge') return <BadgeToast toast={toast} onDismiss={onDismiss} />
  if (toast.type === 'level') return <LevelToast toast={toast} onDismiss={onDismiss} />
  return null
}

//  Shared toast shell 
function ToastShell({ children, onClick, style = {} }) {
  return (
    <div
      onClick={onClick}
      className="animate-toast-in"
      style={{
        pointerEvents:   'all',
        cursor:          'pointer',
        userSelect:      'none',
        backdropFilter:  'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius:    '14px',
        padding:         '14px 20px',
        display:         'flex',
        alignItems:      'center',
        gap:             '12px',
        minWidth:        '220px',
        maxWidth:        '340px',
        boxShadow:       '0 8px 32px rgba(0,0,0,0.4)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

//  XP toast — "+50 XP" 
function XPToast({ toast, onDismiss }) {
  return (
    <ToastShell
      onClick={onDismiss}
      style={{
        background:  'rgba(13, 31, 60, 0.95)',
        border:      '1px solid rgba(232, 197, 71, 0.35)',
      }}
    >
      {/* Coin icon */}
      <div style={{
        width:          '38px',
        height:         '38px',
        borderRadius:   '50%',
        background:     'rgba(232, 197, 71, 0.15)',
        border:         '1px solid rgba(232, 197, 71, 0.3)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '18px',
        flexShrink:     0,
        animation:      'pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
      }}>
        ⚡
      </div>

      <div>
        {/* The shimmering XP number */}
        <div
          className="shimmer-gold"
          style={{
            fontFamily:  "'JetBrains Mono', monospace",
            fontSize:    '20px',
            fontWeight:  '700',
            lineHeight:  1,
            marginBottom: '3px',
          }}
        >
          +{toast.amount} XP
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize:   '11px',
          color:      'rgba(255,255,255,0.4)',
        }}>
          {toast.reason || 'Keep going!'}
        </div>
      </div>
    </ToastShell>
  )
}

// Badge toast — "Badge Unlocked 🏆"
function BadgeToast({ toast, onDismiss }) {
  const { badge } = toast

  return (
    <ToastShell
      onClick={onDismiss}
      style={{
        background: 'rgba(13, 31, 60, 0.95)',
        border:     '1px solid rgba(29, 99, 237, 0.4)',
      }}
    >
      {/* Badge emoji with pop animation */}
      <div style={{
        width:          '42px',
        height:         '42px',
        borderRadius:   '10px',
        background:     'rgba(29, 99, 237, 0.15)',
        border:         '1px solid rgba(29, 99, 237, 0.3)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '22px',
        flexShrink:     0,
        animation:      'pop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
      }}>
        {badge.emoji}
      </div>

      <div>
        <div style={{
          fontFamily:   "'JetBrains Mono', monospace",
          fontSize:     '10px',
          color:        '#7EB3FF',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom:  '3px',
        }}>
          Badge Unlocked
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize:   '15px',
          fontWeight: '700',
          color:      '#ffffff',
          lineHeight:  1.2,
        }}>
          {badge.name}
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize:   '11px',
          color:      'rgba(255,255,255,0.4)',
          marginTop:  '2px',
        }}>
          {badge.description}
        </div>
      </div>
    </ToastShell>
  )
}

// Level up toast — big celebration 
function LevelToast({ toast, onDismiss }) {
  const { level } = toast  // [minXP, title, emoji]

  return (
    <ToastShell
      onClick={onDismiss}
      style={{
        background: 'rgba(13, 31, 60, 0.97)',
        border:     '1px solid rgba(29, 99, 237, 0.6)',
        boxShadow:  '0 8px 40px rgba(29, 99, 237, 0.25)',
        padding:    '18px 24px',
      }}
    >
      {/* Big animated emoji */}
      <div style={{
        fontSize:  '36px',
        flexShrink: 0,
        animation: 'float 1.5s ease-in-out infinite',
      }}>
        {level[2]}
      </div>

      <div>
        <div style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      '10px',
          color:         '#1D63ED',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom:  '4px',
        }}>
          ✦ Level Up ✦
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize:   '18px',
          fontWeight: '800',
          color:      '#ffffff',
          lineHeight:  1.2,
        }}>
          {level[1]}
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize:   '11px',
          color:      'rgba(255,255,255,0.4)',
          marginTop:  '3px',
        }}>
          You reached a new level!
        </div>
      </div>

      {/* Decorative corner glow */}
      <div style={{
        position:   'absolute',
        top:        '-20px',
        right:      '-20px',
        width:      '80px',
        height:     '80px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,99,237,0.3) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
    </ToastShell>
  )
}