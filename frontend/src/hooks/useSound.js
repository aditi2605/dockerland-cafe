// Manages the ambient coffee shop sound + UI sound effects.


import { useState, useEffect, useRef, useCallback } from 'react'

const AMBIENT_URL = 'https://cdn.pixabay.com/audio/2022/10/16/audio_12de91c57e.mp3'

//  Web Audio context 
let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  // AudioContext may be suspended until a user gesture — resume it
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// Tone generator 

function playTone(frequency, type = 'sine', duration = 0.15, volume = 0.08) {
  try {
    const ctx      = getAudioContext()
    const osc      = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.type            = type
    osc.frequency.value = frequency

    // Fade in quickly, fade out smoothly — avoids clicks/pops
    const now = ctx.currentTime
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)

    osc.start(now)
    osc.stop(now + duration)
  } catch (err) {
    // Web Audio may be blocked in some environments — fail silently
    console.warn('Audio playback failed:', err)
  }
}

// Predefined sound effects 
// Each is a function that calls playTone() one or more times
// to create a musical gesture.
const SOUNDS = {
  // Short rising two-note chime — button click / lesson start
  click: () => {
    playTone(523, 'sine', 0.12, 0.06)  // C5
    setTimeout(() => playTone(659, 'sine', 0.12, 0.06), 80)  // E5
  },

  // Upward arpeggio — XP earned
  xpEarned: () => {
    playTone(523, 'sine', 0.15, 0.07)   // C5
    setTimeout(() => playTone(659, 'sine', 0.15, 0.07), 100) // E5
    setTimeout(() => playTone(784, 'sine', 0.2,  0.07), 200) // G5
  },

  // Big celebratory chord — badge unlocked
  badgeUnlocked: () => {
    playTone(523,  'sine', 0.4, 0.06)  // C5
    playTone(659,  'sine', 0.4, 0.06)  // E5
    playTone(784,  'sine', 0.4, 0.06)  // G5
    playTone(1046, 'sine', 0.4, 0.05)  // C6
  },

  // Warm descending tone — lesson complete
  lessonComplete: () => {
    playTone(880, 'sine', 0.2,  0.07)  // A5
    setTimeout(() => playTone(784, 'sine', 0.2,  0.07), 150) // G5
    setTimeout(() => playTone(659, 'sine', 0.35, 0.07), 300) // E5
  },

  // Soft pop — correct quiz answer
  correct: () => {
    playTone(880, 'sine', 0.12, 0.06)
  },

  // Low thud — wrong answer
  wrong: () => {
    playTone(220, 'triangle', 0.2, 0.06)
  },

  // Quick double-blip — daily challenge claimed
  challenge: () => {
    playTone(659, 'sine', 0.1, 0.07)
    setTimeout(() => playTone(880, 'sine', 0.15, 0.07), 120)
  },
}

// The hook 
export function useSound() {
  const [soundOn, setSoundOn] = useState(() => {
    // Default OFF — never autoplay audio without user consent
    try {
      return localStorage.getItem('dockerland_sound') === 'true'
    } catch {
      return false
    }
  })

  const [ambientOn, setAmbientOn] = useState(false)
  const ambientRef = useRef(null)  // HTMLAudioElement for the ambient track

  // Persist sound preference
  useEffect(() => {
    localStorage.setItem('dockerland_sound', String(soundOn))
  }, [soundOn])

  // Set up the ambient audio element
  useEffect(() => {
    const audio         = new Audio(AMBIENT_URL)
    audio.loop          = true
    audio.volume        = 0.18   // quiet enough to be background
    ambientRef.current  = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Play / pause ambient when ambientOn changes
  useEffect(() => {
    const audio = ambientRef.current
    if (!audio) return

    if (ambientOn && soundOn) {
      // play() returns a Promise — catch rejection (autoplay policy)
      audio.play().catch(() => {
        setAmbientOn(false)
      })
    } else {
      audio.pause()
    }
  }, [ambientOn, soundOn])

  //  Toggle handlers
  const toggleSound = useCallback(() => {
    setSoundOn(prev => {
      if (prev) {
        // Turning off — also stop ambient
        setAmbientOn(false)
      }
      return !prev
    })
  }, [])

  const toggleAmbient = useCallback(() => {
    if (!soundOn) return  // can't enable ambient if sound is off
    setAmbientOn(prev => !prev)
  }, [soundOn])

  //Play a named sound effect 
  // Usage: play('xpEarned'), play('badgeUnlocked') etc.
  const play = useCallback((soundName) => {
    if (!soundOn) return
    if (SOUNDS[soundName]) {
      SOUNDS[soundName]()
    }
  }, [soundOn])

  return {
    soundOn,
    ambientOn,
    toggleSound,
    toggleAmbient,
    play,
  }
}