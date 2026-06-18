// Manages the player's XP, streak, and level — all stored in localStorage
// so progress survives page refreshes and browser closes.
//
// concept:
//   XP        = points earned by completing lessons + quizzes
//   Streak    = consecutive days the user visited the site
//   Level     = title earned at XP thresholds (Barista → Head Chef etc.)
//   Badges    = unlocked by specific achievements
//
// Everything here is self-contained — no backend needed for the game layer.
// The backend handles lesson content;

import { useState, useEffect, useCallback } from 'react'

//  XP values — how much each action is worth 
export const XP_VALUES = {
  LESSON_COMPLETE:  50,
  QUIZ_PASS:        75,
  QUIZ_PERFECT:     25,   // bonus on top of QUIZ_PASS for 100%
  DAILY_CHALLENGE:  30,
  FIRST_VISIT:      10,
}

//  Level thresholds
// Each entry: [minXP, title, emoji]
// The player is at the highest level whose minXP they've passed.
export const LEVELS = [
  [0,    'Curious Visitor',   '👀'],
  [50,   'Coffee Taster',     '☕'],
  [150,  'Junior Barista',    '🥛'],
  [300,  'Barista',           '🧑‍🍳'],
  [500,  'Senior Barista',    '⭐'],
  [750,  'Kitchen Manager',   '🍳'],
  [1000, 'Head Chef',         '👨‍🍳'],
  [1500, 'Docker Wizard',     '🐳'],
]

//  Badge definitions 
// id must be stable, it's stored in localStorage
export const BADGES = [
  {
    id:          'first_brew',
    name:        'First Brew',
    emoji:       '☕',
    description: 'Completed your first lesson',
    condition:   (stats) => stats.lessonsCompleted >= 1,
  },
  {
    id:          'recipe_reader',
    name:        'Recipe Reader',
    emoji:       '🧾',
    description: 'Learned how to write a Dockerfile',
    condition:   (stats) => stats.completedLessonIds.includes(2),
  },
  {
    id:          'container_chef',
    name:        'Container Chef',
    emoji:       '🍽️',
    description: 'Mastered images and containers',
    condition:   (stats) => stats.completedLessonIds.includes(3),
  },
  {
    id:          'fridge_master',
    name:        'Fridge Master',
    emoji:       '🧊',
    description: 'Understood volumes and ports',
    condition:   (stats) => stats.completedLessonIds.includes(4),
  },
  {
    id:          'compose_wizard',
    name:        'Compose Wizard',
    emoji:       '📋',
    description: 'Completed the Docker Compose lesson',
    condition:   (stats) => stats.completedLessonIds.includes(5),
  },
  {
    id:          'full_menu',
    name:        'Full Menu',
    emoji:       '🏆',
    description: 'Completed every lesson',
    condition:   (stats) => stats.lessonsCompleted >= 5,
  },
  {
    id:          'hot_streak',
    name:        'Hot Streak',
    emoji:       '🔥',
    description: '3 day learning streak',
    condition:   (stats) => stats.streak >= 3,
  },
  {
    id:          'perfectionist',
    name:        'Perfectionist',
    emoji:       '💯',
    description: 'Scored 100% on any quiz',
    condition:   (stats) => stats.perfectQuizzes >= 1,
  },
  {
    id:          'daily_grind',
    name:        'Daily Grind',
    emoji:       '⚡',
    description: 'Completed a daily challenge',
    condition:   (stats) => stats.dailyChallengesCompleted >= 1,
  },
]

// Default state 
const DEFAULT_STATE = {
  xp:                      0,
  streak:                  0,
  lastVisitDate:           null,   // ISO date string 'YYYY-MM-DD'
  completedLessonIds:      [],
  lessonsCompleted:        0,
  perfectQuizzes:          0,
  dailyChallengesCompleted: 0,
  earnedBadgeIds:          [],
}

//  Helpers 
const today = () => new Date().toISOString().slice(0, 10)  // 'YYYY-MM-DD'

function getLevel(xp) {
  // Walk LEVELS backwards — return the highest one the player qualifies for
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i][0]) return { index: i, ...LEVELS[i] }
  }
  return { index: 0, ...LEVELS[0] }
}

function getNextLevel(xp) {
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp < LEVELS[i][0]) return LEVELS[i]
  }
  return null 
}

function checkNewBadges(stats, alreadyEarned) {
  // Return array of badge objects the player just newly qualified for
  return BADGES.filter(
    (b) => !alreadyEarned.includes(b.id) && b.condition(stats)
  )
}

// The hook 
export function useStreak() {
  const [state, setState] = useState(() => {
    // Load from localStorage on first render
    try {
      const saved = localStorage.getItem('dockerland_progress')
      return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE
    } catch {
      return DEFAULT_STATE
    }
  })

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('dockerland_progress', JSON.stringify(state))
  }, [state])

  //  Update streak on every visit
  useEffect(() => {
    const todayStr    = today()
    const lastVisit   = state.lastVisitDate

    if (lastVisit === todayStr) return  // already counted today

    setState(prev => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().slice(0, 10)

      const newStreak = lastVisit === yesterdayStr
        ? prev.streak + 1   // visited yesterday → extend streak
        : 1                 // gap → reset to 1

      return {
        ...prev,
        streak:        newStreak,
        lastVisitDate: todayStr,
        xp:            lastVisit ? prev.xp : prev.xp + XP_VALUES.FIRST_VISIT,
      }
    })
  }, [])  // run once on mount

  //  Award XP 
  const awardXP = useCallback((amount, reason = '') => {
    setState(prev => ({ ...prev, xp: prev.xp + amount }))
    return amount
  }, [])

  // Mark lesson complete 
  // Returns array of newly earned badges so caller can show toasts
  const completeLesson = useCallback((lessonId) => {
    let newBadges = []

    setState(prev => {
      if (prev.completedLessonIds.includes(lessonId)) return prev  // already done

      const updated = {
        ...prev,
        xp:                 prev.xp + XP_VALUES.LESSON_COMPLETE,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
        lessonsCompleted:   prev.lessonsCompleted + 1,
      }

      newBadges = checkNewBadges(updated, prev.earnedBadgeIds)
      updated.earnedBadgeIds = [
        ...prev.earnedBadgeIds,
        ...newBadges.map(b => b.id),
      ]

      return updated
    })

    return newBadges
  }, [])

  //  Record quiz result 
  const recordQuiz = useCallback((percentage) => {
    const passed  = percentage >= 70
    const perfect = percentage === 100
    let   earned  = 0
    let   newBadges = []

    setState(prev => {
      if (!passed) return prev

      earned = XP_VALUES.QUIZ_PASS + (perfect ? XP_VALUES.QUIZ_PERFECT : 0)

      const updated = {
        ...prev,
        xp:            prev.xp + earned,
        perfectQuizzes: perfect
          ? prev.perfectQuizzes + 1
          : prev.perfectQuizzes,
      }

      newBadges = checkNewBadges(updated, prev.earnedBadgeIds)
      updated.earnedBadgeIds = [
        ...prev.earnedBadgeIds,
        ...newBadges.map(b => b.id),
      ]

      return updated
    })

    return { earned, newBadges }
  }, [])

  // Complete daily challenge 
  const completeDailyChallenge = useCallback(() => {
    let newBadges = []

    setState(prev => {
      const updated = {
        ...prev,
        xp: prev.xp + XP_VALUES.DAILY_CHALLENGE,
        dailyChallengesCompleted: prev.dailyChallengesCompleted + 1,
      }

      newBadges = checkNewBadges(updated, prev.earnedBadgeIds)
      updated.earnedBadgeIds = [
        ...prev.earnedBadgeIds,
        ...newBadges.map(b => b.id),
      ]

      return updated
    })

    return newBadges
  }, [])

  //  Derived values (computed, not stored)
  const level     = getLevel(state.xp)
  const nextLevel = getNextLevel(state.xp)

  const xpTowardNext = nextLevel
    ? state.xp - LEVELS[level.index][0]
    : 0
  const xpNeededForNext = nextLevel
    ? nextLevel[0] - LEVELS[level.index][0]
    : 1

  const levelProgress = Math.min(
    Math.round((xpTowardNext / xpNeededForNext) * 100),
    100
  )

  const earnedBadges = BADGES.filter(b =>
    state.earnedBadgeIds.includes(b.id)
  )

  return {
    // Raw state
    xp:                       state.xp,
    streak:                   state.streak,
    completedLessonIds:       state.completedLessonIds,
    lessonsCompleted:         state.lessonsCompleted,
    earnedBadgeIds:           state.earnedBadgeIds,

    // Derived / computed
    level,
    nextLevel,
    levelProgress,
    earnedBadges,

    // Actions
    awardXP,
    completeLesson,
    recordQuiz,
    completeDailyChallenge,
  }
}