import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { usePlayer } from './usePlayer'
import { updateStreak } from './streak'

interface UseGameResultOptions {
  table: string
  scoreField: string
  score: number
  phase: string
  higherIsBetter: boolean
  filter?: Record<string, any> | null
}

export function useGameResult({ table, scoreField, score, phase, higherIsBetter, filter = null }: UseGameResultOptions) {
  const { profile } = usePlayer()
  const [saved, setSaved] = useState(false)
  const [worldRank, setWorldRank] = useState<number | null>(null)

  // Calculate worldRank whenever phase is over
  useEffect(() => {
    if (phase !== 'over' && phase !== 'gameover' && phase !== 'result' && phase !== 'won') return
    if (score === 0) return

    let query = supabase.from(table).select('*', { count: 'exact', head: true })

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value === null) query = (query as any).is(key, null)
        else query = (query as any).eq(key, value)
      })
    }

    if (higherIsBetter) {
      query = (query as any).gt(scoreField, score)
    } else {
      query = (query as any).lt(scoreField, score)
    }

    query.then(({ count }: any) => {
      setWorldRank((count || 0) + 1)
    })
  }, [phase, score])

  // Save when profile exists and phase is over
  useEffect(() => {
    if (phase !== 'over' && phase !== 'gameover' && phase !== 'result' && phase !== 'won') return
    if (!profile?.name) return
    if (saved) return
    if (score === 0) return

    const insert: Record<string, any> = { player_name: profile.name, [scoreField]: score }
    if (filter) Object.assign(insert, filter)

    supabase.from(table).insert(insert).then(() => {
      setSaved(true)
      updateStreak(profile.name)
    })
  }, [phase, profile?.name])

  // Reset on new game
  useEffect(() => {
    if (phase === 'idle' || phase === 'rules' || phase === 'playing' || phase === 'countdown') {
      setSaved(false)
      setWorldRank(null)
    }
  }, [phase])

  return { saved, worldRank }
}
