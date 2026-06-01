import { useState, useEffect } from 'react'

export interface PlayerProfile {
  name: string
  avatar?: string
}

function loadProfile(): PlayerProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('memgenius_profile')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (!parsed.name) return null
    return { name: parsed.name, avatar: parsed.avatar }
  } catch { return null }
}

export function usePlayer() {
  const [profile, setProfile] = useState<PlayerProfile | null>(() => loadProfile())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setProfile(loadProfile())
    setLoaded(true)

    const onUpdate = () => setProfile(loadProfile())
    window.addEventListener('storage', onUpdate)
    window.addEventListener('profileUpdated', onUpdate)
    return () => {
      window.removeEventListener('storage', onUpdate)
      window.removeEventListener('profileUpdated', onUpdate)
    }
  }, [])

  const createProfile = (name: string, avatar?: string) => {
    const p = { name, avatar }
    localStorage.setItem('memgenius_profile', JSON.stringify(p))
    setProfile(p)
    return p
  }

  return { profile, loaded, createProfile }
}
