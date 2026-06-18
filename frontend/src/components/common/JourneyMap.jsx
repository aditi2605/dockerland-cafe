
// The winding path world map,shown on the Home page.

// Props:
//   lessons            → array of lesson objects from the API
//   completedLessonIds → array of lesson IDs the player has finished
//   currentLessonId    → the next lesson they should do

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

//  Path stop positions 

const STOP_POSITIONS = [
  { x:  70, y: 280 },   // lesson 1 — bottom left
  { x: 180, y: 200 },   // lesson 2 — mid left
  { x: 270, y: 260 },   // lesson 3 — dips down
  { x: 370, y: 160 },   // lesson 4 — rises up
  { x: 460, y: 220 },   // lesson 5 — top right
]

//  SVG path string connecting all stops
// Uses cubic bezier curves for a smooth winding road feel.
// Each C command: C cx1 cy1, cx2 cy2, x y
//   cx1/cy1 = control point leaving the previous stop
//   cx2/cy2 = control point arriving at the next stop
//   x/y     = the next stop's position
function buildPath(stops) {
  if (stops.length < 2) return ''
  let d = `M ${stops[0].x} ${stops[0].y}`
  for (let i = 1; i < stops.length; i++) {
    const prev = stops[i - 1]
    const curr = stops[i]
    // Control points: offset horizontally from midpoint for smooth curves
    const cpx1 = prev.x + (curr.x - prev.x) * 0.5
    const cpy1 = prev.y
    const cpx2 = prev.x + (curr.x - prev.x) * 0.5
    const cpy2 = curr.y
    d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`
  }
  return d
}

export default function JourneyMap({ lessons = [], completedLessonIds = [], currentLessonId }) {
  const navigate  = useNavigate()
  const pathD     = useMemo(() => buildPath(STOP_POSITIONS), [])

  // Map lesson index → status
  const getStatus = (lesson, index) => {
    if (completedLessonIds.includes(lesson.id)) return 'done'
    if (lesson.id === currentLessonId)          return 'current'
    if (index === 0 && completedLessonIds.length === 0) return 'current'
    return 'locked'
  }

  // Find the whale position — sits on current or first undone stop
  const whaleIndex = useMemo(() => {
    const idx = lessons.findIndex(l =>
      l.id === currentLessonId ||
      (!completedLessonIds.includes(l.id))
    )
    return idx === -1 ? lessons.length - 1 : idx
  }, [lessons, currentLessonId, completedLessonIds])

  const whalePos = STOP_POSITIONS[whaleIndex] || STOP_POSITIONS[0]

  return (
    <div style={{
      background:   '#0D1F3C',
      border:       '1px solid rgba(29, 99, 237, 0.18)',
      borderRadius: '16px',
      padding:      '24px',
      position:     'relative',
      overflow:     'hidden',
    }}>
      {/* Section label */}
      <div className="section-label" style={{ marginBottom: '20px' }}>
        Your journey
      </div>

      {/* Background glow */}
      <div style={{
        position:   'absolute',
        bottom:     '-40px',
        left:       '50%',
        transform:  'translateX(-50%)',
        width:      '300px',
        height:     '150px',
        background: 'radial-gradient(ellipse, rgba(29,99,237,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* SVG map */}
      <svg
        viewBox="0 0 530 310"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        {/* Dashed road (background) */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Solid road line*/}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(29, 99, 237, 0.15)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="8 6"
        />

        {/* Completed road segment (glows blue)*/}
        {completedLessonIds.length > 0 && (
          <path
            d={buildPath(
              STOP_POSITIONS.slice(0, completedLessonIds.length + 1)
            )}
            fill="none"
            stroke="#1D63ED"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          />
        )}

        {/* Stops */}
        {lessons.map((lesson, i) => {
          const pos    = STOP_POSITIONS[i]
          const status = getStatus(lesson, i)
          if (!pos) return null

          return (
            <Stop
              key={lesson.id}
              lesson={lesson}
              pos={pos}
              status={status}
              onClick={() => {
                if (status !== 'locked') navigate(`/lessons/${lesson.id}`)
              }}
            />
          )
        })}

        {/* Whale on current stop */}
        <WhaleMarker pos={whalePos} />
      </svg>

      {/* Legend  */}
      <div style={{
        display:        'flex',
        gap:            '16px',
        justifyContent: 'center',
        marginTop:      '8px',
        flexWrap:       'wrap',
      }}>
        {[
          { color: '#3DD68C', label: 'Complete' },
          { color: '#1D63ED', label: 'Current'  },
          { color: 'rgba(255,255,255,0.15)', label: 'Locked' },
        ].map(({ color, label }) => (
          <div key={label} style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '6px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize:   '10px',
            color:      'rgba(255,255,255,0.35)',
          }}>
            <div style={{
              width:        '8px',
              height:       '8px',
              borderRadius: '50%',
              background:   color,
            }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

// Stop component 
function Stop({ lesson, pos, status, onClick }) {
  const isDone    = status === 'done'
  const isCurrent = status === 'current'
  const isLocked  = status === 'locked'

  // Visual config per status
  const outerR    = 26
  const innerR    = 20

  const outerFill = isDone    ? 'rgba(61,214,140,0.15)'
                  : isCurrent ? 'rgba(29,99,237,0.2)'
                  :             'rgba(255,255,255,0.03)'

  const outerStroke = isDone    ? '#3DD68C'
                    : isCurrent ? '#1D63ED'
                    :             'rgba(255,255,255,0.12)'

  const innerFill = isDone    ? 'rgba(61,214,140,0.25)'
                  : isCurrent ? 'rgba(29,99,237,0.3)'
                  :             'rgba(255,255,255,0.05)'

  return (
    <g
      onClick={onClick}
      style={{ cursor: isLocked ? 'default' : 'pointer' }}
    >
      {/* Ripple ring on current stop */}
      {isCurrent && (
        <>
          <circle
            cx={pos.x} cy={pos.y} r={outerR + 8}
            fill="none"
            stroke="rgba(29,99,237,0.3)"
            strokeWidth="1.5"
            style={{ animation: 'ripple 1.8s ease-out infinite' }}
          />
          <circle
            cx={pos.x} cy={pos.y} r={outerR + 16}
            fill="none"
            stroke="rgba(29,99,237,0.12)"
            strokeWidth="1"
            style={{ animation: 'ripple 1.8s ease-out infinite 0.6s' }}
          />
        </>
      )}

      {/* Outer ring */}
      <circle
        cx={pos.x} cy={pos.y} r={outerR}
        fill={outerFill}
        stroke={outerStroke}
        strokeWidth={isCurrent ? 2 : 1.5}
      />

      {/* Inner circle */}
      <circle
        cx={pos.x} cy={pos.y} r={innerR}
        fill={innerFill}
      />

      {/* Lesson emoji or checkmark */}
      <text
        x={pos.x} y={pos.y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={isDone ? '14' : '16'}
        opacity={isLocked ? 0.3 : 1}
        style={{ userSelect: 'none' }}
      >
        {isDone ? '✓' : lesson.emoji || '📖'}
      </text>

      {/* Lesson title below stop */}
      <text
        x={pos.x} y={pos.y + outerR + 14}
        textAnchor="middle"
        fontSize="9"
        fontFamily="'JetBrains Mono', monospace"
        fill={
          isDone    ? 'rgba(61,214,140,0.7)'  :
          isCurrent ? 'rgba(126,179,255,0.9)' :
                      'rgba(255,255,255,0.2)'
        }
        style={{ userSelect: 'none' }}
      >
        {lesson.title?.split(' ').slice(0, 2).join(' ')}
      </text>

      {/* XP label on locked stops */}
      {isLocked && (
        <text
          x={pos.x} y={pos.y + outerR + 25}
          textAnchor="middle"
          fontSize="8"
          fontFamily="'JetBrains Mono', monospace"
          fill="rgba(232,197,71,0.4)"
          style={{ userSelect: 'none' }}
        >
          +50 XP
        </text>
      )}
    </g>
  )
}

//Whale marker 
// The whale sits above the current stop and bobs up and down
function WhaleMarker({ pos }) {
  return (
    <g style={{ animation: 'float 2s ease-in-out infinite' }}>
      {/* Shadow under whale */}
      <ellipse
        cx={pos.x} cy={pos.y - 42}
        rx="12" ry="4"
        fill="rgba(0,0,0,0.3)"
        style={{ animation: 'float 2s ease-in-out infinite reverse' }}
      />
      {/* Whale emoji */}
      <text
        x={pos.x} y={pos.y - 44}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="20"
        style={{ userSelect: 'none', animation: 'float 2s ease-in-out infinite' }}
      >
        🐳
      </text>
    </g>
  )
}