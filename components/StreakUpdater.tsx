'use client'
import { useEffect } from 'react'
import { updateStreak } from '@/lib/streak'

export default function StreakUpdater() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('memgenius_profile')
      if (!stored) return
      const { name } = JSON.parse(stored)
      if (name) updateStreak(name)
    } catch {}
  }, [])
  return null
}
