import { useState, useEffect } from 'react'

export interface PlayerProfile {
  name: string
  avatar?: string
  streak: number
  lastPlayedDate: string
  totalPairs: number
  gamesPlayed: number
  bestRanks: Record<string, number>
  bestTimes: Record<string, number>
  joinedDate: string
  achievements: string[]
}

const DEFAULT_PROFILE: PlayerProfile = {
  name: '',
  avatar: undefined,
  streak: 0,
  lastPlayedDate: '',
  totalPairs: 0,
  gamesPlayed: 0,
  bestRanks: {},
  bestTimes: {},
  joinedDate: new Date().toISOString().split('T')[0],
  achievements: [],
}

function loadProfile(): PlayerProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('memgenius_profile')
    return stored ? JSON.parse(stored) : null
  } catch { return null }
}

export function usePlayer() {
  // Initialize synchronously from localStorage — no flash
  const [profile, setProfile] = useState<PlayerProfile | null>(() => loadProfile())
  const [loaded, setLoaded] = useState(() => typeof window !== 'undefined')

  useEffect(() => {
    if (!loaded) {
      const p = loadProfile()
      setProfile(p)
      setLoaded(true)
    }
  }, [])

  const save = (p: PlayerProfile) => {
    localStorage.setItem('memgenius_profile', JSON.stringify(p))
    setProfile(p)
  }

  const createProfile = (name: string) => {
    const p: PlayerProfile = {
      ...DEFAULT_PROFILE,
      name,
      joinedDate: new Date().toISOString().split('T')[0],
    }
    save(p)
    return p
  }

  const recordGame = (packSlug: string, pairsCount: number, worldRank: number, timeMs: number) => {
    if (!profile) return
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const newStreak = profile.lastPlayedDate === yesterday
      ? profile.streak + 1
      : profile.lastPlayedDate === today
      ? profile.streak
      : 1

    const bestRanks = { ...profile.bestRanks }
    if (!bestRanks[packSlug] || worldRank < bestRanks[packSlug]) bestRanks[packSlug] = worldRank

    const bestTimes = { ...profile.bestTimes }
    if (!bestTimes[packSlug] || timeMs < bestTimes[packSlug]) bestTimes[packSlug] = timeMs

    const achievements = [...(profile.achievements || [])]
    if (timeMs < 30000 && !achievements.includes('speed_genius')) achievements.push('speed_genius')
    if (newStreak >= 7 && !achievements.includes('week_streak')) achievements.push('week_streak')
    if (newStreak >= 30 && !achievements.includes('month_streak')) achievements.push('month_streak')
    if (worldRank === 1 && !achievements.includes('world_1')) achievements.push('world_1')
    if ((profile.gamesPlayed + 1) >= 10 && !achievements.includes('10_games')) achievements.push('10_games')

    const updated: PlayerProfile = {
      ...profile,
      streak: newStreak,
      lastPlayedDate: today,
      totalPairs: profile.totalPairs + pairsCount,
      gamesPlayed: profile.gamesPlayed + 1,
      bestRanks,
      bestTimes,
      achievements,
    }
    save(updated)
    return updated
  }

  return { profile, loaded, createProfile, recordGame, save }
}
