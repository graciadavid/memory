import { supabase } from '@/lib/supabase'

const DIFF_PACKS: Record<string, { slugs: string[] }> = {
  easy: { slugs: ['monuments-countries', 'animals-habitats', 'cities-skylines'] },
  medium: { slugs: ['foods-monuments', 'artworks-museums', 'civilizations-landmarks'] },
  hard: { slugs: ['inventions-inventors', 'phenomena-locations'] },
}

export async function fetchLiveRanks(playerName: string) {
  const result: Record<string, { rank: number | null, time: number | null }> = {}

  const { data: packs } = await supabase
    .from('packs')
    .select('id, slug, difficulty')

  const { data: allScores } = await supabase
    .from('scores')
    .select('pack_id, player_name, time_ms')

  if (!packs || !allScores) return result

  for (const [diff, val] of Object.entries(DIFF_PACKS)) {
    const diffPackIds = packs
      .filter(p => val.slugs.includes(p.slug))
      .map(p => p.id)

    const diffScores = allScores.filter(s => diffPackIds.includes(s.pack_id))

    const bestPerPlayer: Record<string, number> = {}
    diffScores.forEach(s => {
      if (!bestPerPlayer[s.player_name] || s.time_ms < bestPerPlayer[s.player_name]) {
        bestPerPlayer[s.player_name] = s.time_ms
      }
    })

    const myBest = bestPerPlayer[playerName]
    if (!myBest) {
      result[diff] = { rank: null, time: null }
      continue
    }

    const rank = Object.values(bestPerPlayer).filter(t => t < myBest).length + 1
    result[diff] = { rank, time: myBest }
  }

  return result
}

export async function fetchDailyRank(playerName: string): Promise<{ rank: number | null, time: number | null }> {
  const today = new Date().toISOString().split('T')[0]
  console.log('fetchDailyRank for:', playerName, 'date:', today)

  const { data: allScores, error } = await supabase
    .from('scores')
    .select('player_name, time_ms')
    .eq('is_daily', true)
    .eq('play_date', today)
  
  console.log('daily scores:', allScores?.length, 'error:', error)
  const myScores = allScores?.filter(s => s.player_name === playerName)
  console.log('my daily scores:', myScores?.length, myScores)

  if (!allScores) return { rank: null, time: null }

  const bestPerPlayer: Record<string, number> = {}
  allScores.forEach(s => {
    if (!bestPerPlayer[s.player_name] || s.time_ms < bestPerPlayer[s.player_name]) {
      bestPerPlayer[s.player_name] = s.time_ms
    }
  })

  const myBest = bestPerPlayer[playerName]
  if (!myBest) return { rank: null, time: null }

  const rank = Object.values(bestPerPlayer).filter(t => t < myBest).length + 1
  return { rank, time: myBest }
}
