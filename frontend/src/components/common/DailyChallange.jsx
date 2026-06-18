// A rotating daily Docker command challenge, shown on the Home page.

import { useState, useMemo } from 'react'
import { useToast }            from './XPToast'
import { useStreak }           from '../../hooks/useStreak'
import { useSound }            from '../../hooks/useSound'

// Challenge bank 
// Each challenge has:
//   command     → the Docker command to try
//   explanation → what it does in plain English
//   cafeHint    → the café metaphor connection
//   difficulty  → beginner / intermediate
//   tags        → what concepts it covers

const CHALLENGES = [
  {
    command:     'docker run hello-world',
    explanation: 'Run the official Docker test container. It downloads, runs, prints a message and exits.',
    cafeHint:    'Ordering a free sample — quick, no commitment, just to check the kitchen is open.',
    difficulty:  'beginner',
    tags:        ['containers', 'images'],
  },
  {
    command:     'docker images',
    explanation: 'List every image stored on your machine — name, tag, size, and when it was created.',
    cafeHint:    'Checking what recipe cards are in your drawer before you start cooking.',
    difficulty:  'beginner',
    tags:        ['images'],
  },
  {
    command:     'docker ps -a',
    explanation: 'List ALL containers — running and stopped. The -a flag means "all", not just active ones.',
    cafeHint:    'Checking every table in the restaurant — occupied, empty, and recently cleared.',
    difficulty:  'beginner',
    tags:        ['containers'],
  },
  {
    command:     'docker pull nginx:alpine',
    explanation: 'Download the Nginx web server image using the lightweight Alpine Linux variant.',
    cafeHint:    'Grabbing a specific ingredient from the supermarket — the small economy size.',
    difficulty:  'beginner',
    tags:        ['images', 'docker hub'],
  },
  {
    command:     'docker run -d -p 8080:80 nginx',
    explanation: 'Run Nginx in the background (-d) and map your port 8080 to the container\'s port 80.',
    cafeHint:    'Opening the serving window — now customers outside can reach the kitchen inside.',
    difficulty:  'beginner',
    tags:        ['containers', 'ports'],
  },
  {
    command:     'docker volume create mydata',
    explanation: 'Create a named volume called "mydata" — a persistent storage area Docker manages for you.',
    cafeHint:    'Installing a new fridge shelf — ready to store ingredients that outlast any single cook.',
    difficulty:  'beginner',
    tags:        ['volumes'],
  },
  {
    command:     'docker network ls',
    explanation: 'List all Docker networks — the virtual paths containers use to talk to each other.',
    cafeHint:    'Looking at the floor plan — which routes can waiters take between the kitchen and tables?',
    difficulty:  'beginner',
    tags:        ['networking'],
  },
  {
    command:     'docker system df',
    explanation: 'Show how much disk space Docker is using — images, containers, volumes, and build cache.',
    cafeHint:    'Checking the restaurant\'s storage costs — are we paying for too many unused ingredients?',
    difficulty:  'intermediate',
    tags:        ['maintenance'],
  },
  {
    command:     'docker logs --tail 20 $(docker ps -q | head -1)',
    explanation: 'Show the last 20 log lines from your most recently started container.',
    cafeHint:    'Reading the last few entries in the kitchen order book — what just came out of the pass?',
    difficulty:  'intermediate',
    tags:        ['containers', 'debugging'],
  },
  {
    command:     'docker stats --no-stream',
    explanation: 'Show a one-time snapshot of CPU, memory, and network usage for all running containers.',
    cafeHint:    'A quick health check — how busy is each chef, how much fridge space is left?',
    difficulty:  'intermediate',
    tags:        ['containers', 'monitoring'],
  },
  {
    command:     'docker image prune',
    explanation: 'Remove all dangling images — untagged leftovers from old builds that waste disk space.',
    cafeHint:    'Clearing out stale prep work — half-made dishes nobody ordered that are just taking up counter space.',
    difficulty:  'beginner',
    tags:        ['images', 'maintenance'],
  },
  {
    command:     'docker run -it ubuntu bash',
    explanation: 'Start an Ubuntu container and drop straight into an interactive bash shell inside it.',
    cafeHint:    'Walking into the kitchen yourself — you\'re now inside the container, not watching from outside.',
    difficulty:  'beginner',
    tags:        ['containers', 'interactive'],
  },
  {
    command:     'docker inspect $(docker ps -q | head -1)',
    explanation: 'Show the full JSON config of your newest container — IP address, mounts, env vars, everything.',
    cafeHint:    'Reading the full docket for a meal — every ingredient, every instruction, every allergy note.',
    difficulty:  'intermediate',
    tags:        ['containers', 'debugging'],
  },
  {
    command:     'docker compose config',
    explanation: 'Validate and print your docker-compose.yml with all environment variables resolved.',
    cafeHint:    'The manager reading the staff handbook aloud to check nothing was miswritten.',
    difficulty:  'intermediate',
    tags:        ['compose'],
  },
]

//  Date seed helper 
// Returns the same index for everyone on the same calendar day.
// Uses a simple hash of YYYYMMDD so it changes at midnight.
function getTodayIndex() {
  const today = new Date()
  const seed  = parseInt(
    `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}`
  )
  return seed % CHALLENGES.length
}

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

// Copy to clipboard helper 
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// Component 
export default function DailyChallenge() {
  const { showToast }              = useToast()
  const { completeDailyChallenge } = useStreak()
  const { play }                   = useSound()

  // Today's challenge — same for everyone today
  const challenge = useMemo(() => CHALLENGES[getTodayIndex()], [])

  // Has this user already claimed today's XP?
  const [claimed, setClaimed] = useState(() => {
    try {
      return localStorage.getItem('dockerland_daily') === todayKey()
    } catch {
      return false
    }
  })

  const [copied, setCopied] = useState(false)

  //  Claim XP 
  const handleClaim = () => {
    if (claimed) return

    play('challenge')

    const newBadges = completeDailyChallenge()

    // Save claim date
    localStorage.setItem('dockerland_daily', todayKey())
    setClaimed(true)

    // Show XP toast
    showToast({
      type:   'xp',
      amount: 30,
      reason: 'Daily challenge complete!',
    })

    // Show badge toasts if any unlocked
    newBadges.forEach((badge, i) => {
      setTimeout(() => {
        play('badgeUnlocked')
        showToast({ type: 'badge', badge })
      }, 600 + i * 400)
    })
  }

  // ── Copy command ─────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    const ok = await copyToClipboard(challenge.command)
    if (ok) {
      play('click')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{
      background:    '#0D1F3C',
      border:        '1px solid rgba(232, 197, 71, 0.2)',
      borderRadius:  '16px',
      overflow:      'hidden',
      position:      'relative',
    }}>

      {/* Top accent bar — gold for daily challenge */}
      <div style={{
        height:     '3px',
        background: 'linear-gradient(90deg, #E8C547, rgba(232,197,71,0.2))',
      }} />

      <div style={{ padding: '20px' }}>

        {/* Header row */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginBottom:   '16px',
        }}>
          <div style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '8px',
          }}>
            <span style={{ fontSize: '20px' }}>⚡</span>
            <div>
              <div style={{
                fontFamily:  "'Syne', sans-serif",
                fontSize:    '15px',
                fontWeight:  '700',
                color:       '#ffffff',
                lineHeight:   1,
              }}>
                Daily Challenge
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize:   '10px',
                color:      'rgba(232,197,71,0.6)',
                marginTop:  '2px',
              }}>
                +30 XP · resets at midnight
              </div>
            </div>
          </div>

          {/* Difficulty badge */}
          <div className={`pill ${challenge.difficulty === 'beginner' ? 'pill-green' : 'pill-blue'}`}>
            {challenge.difficulty}
          </div>
        </div>

        {/* The command — terminal style with copy button */}
        <div className="terminal" style={{ marginBottom: '14px' }}>
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: '#FF5F57' }} />
            <div className="terminal-dot" style={{ background: '#FFBD2E' }} />
            <div className="terminal-dot" style={{ background: '#28CA41' }} />
            <span style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      '10px',
              color:         'rgba(255,255,255,0.25)',
              marginLeft:    '6px',
              letterSpacing: '0.5px',
            }}>
              terminal
            </span>

            {/* Copy button in terminal header */}
            <button
              onClick={handleCopy}
              style={{
                marginLeft:   'auto',
                background:   copied
                  ? 'rgba(61,214,140,0.15)'
                  : 'rgba(255,255,255,0.06)',
                border:       copied
                  ? '1px solid rgba(61,214,140,0.3)'
                  : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color:        copied ? '#3DD68C' : 'rgba(255,255,255,0.4)',
                padding:      '3px 10px',
                cursor:       'pointer',
                fontFamily:   "'JetBrains Mono', monospace",
                fontSize:     '10px',
                transition:   'all 0.15s',
              }}
            >
              {copied ? '✓ copied' : 'copy'}
            </button>
          </div>

          <div className="terminal-body">
            <span className="terminal-prompt">➜ ~ </span>
            <span className="terminal-cmd">{challenge.command}</span>
            <span className="terminal-cursor" />
          </div>
        </div>

        {/* Explanation */}
        <p style={{
          fontFamily:   "'Inter', sans-serif",
          fontSize:     '13px',
          color:        'rgba(255,255,255,0.55)',
          lineHeight:   1.6,
          marginBottom: '10px',
        }}>
          {challenge.explanation}
        </p>

        {/* Café hint */}
        <div style={{
          background:   'rgba(232, 197, 71, 0.06)',
          border:       '1px solid rgba(232, 197, 71, 0.15)',
          borderRadius: '8px',
          padding:      '10px 14px',
          marginBottom: '16px',
          display:      'flex',
          gap:          '8px',
          alignItems:   'flex-start',
        }}>
          <span style={{ fontSize: '14px', flexShrink: 0 }}>☕</span>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize:   '12px',
            color:      'rgba(232,197,71,0.7)',
            lineHeight: 1.5,
            margin:     0,
          }}>
            {challenge.cafeHint}
          </p>
        </div>

        {/* Tags */}
        <div style={{
          display:      'flex',
          gap:          '6px',
          flexWrap:     'wrap',
          marginBottom: '16px',
        }}>
          {challenge.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontFamily:    "'JetBrains Mono', monospace",
                fontSize:      '10px',
                color:         'rgba(29,99,237,0.7)',
                background:    'rgba(29,99,237,0.08)',
                border:        '1px solid rgba(29,99,237,0.15)',
                borderRadius:  '4px',
                padding:       '2px 8px',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Claim XP button */}
        <button
          onClick={handleClaim}
          disabled={claimed}
          style={{
            width:        '100%',
            padding:      '11px',
            borderRadius: '10px',
            border:       'none',
            cursor:       claimed ? 'default' : 'pointer',
            fontFamily:   "'JetBrains Mono', monospace",
            fontSize:     '13px',
            fontWeight:   '600',
            transition:   'all 0.15s',
            background:   claimed
              ? 'rgba(61,214,140,0.1)'
              : 'rgba(232,197,71,0.15)',
            color:        claimed
              ? '#3DD68C'
              : '#E8C547',
            border:       claimed
              ? '1px solid rgba(61,214,140,0.25)'
              : '1px solid rgba(232,197,71,0.3)',
          }}
        >
          {claimed
            ? '✓ Claimed today · come back tomorrow'
            : '⚡ Claim +30 XP — I ran this command!'}
        </button>
      </div>

      {/* Countdown to next challenge */}
      <MidnightCountdown />
    </div>
  )
}

//Midnight countdown 
// Shows "Next challenge in 4h 23m" at the bottom of the card
function MidnightCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight())

  // Update every minute
  useState(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight())
    }, 60000)
    return () => clearInterval(interval)
  })

  return (
    <div style={{
      borderTop:      '1px solid rgba(255,255,255,0.05)',
      padding:        '10px 20px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '6px',
    }}>
      <span style={{ fontSize: '11px' }}>🕐</span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize:   '10px',
        color:      'rgba(255,255,255,0.2)',
      }}>
        Next challenge in {timeLeft}
      </span>
    </div>
  )
}

function getTimeUntilMidnight() {
  const now       = new Date()
  const midnight  = new Date()
  midnight.setHours(24, 0, 0, 0)
  const diffMs    = midnight - now
  const hours     = Math.floor(diffMs / 3600000)
  const minutes   = Math.floor((diffMs % 3600000) / 60000)
  return `${hours}h ${minutes}m`
}