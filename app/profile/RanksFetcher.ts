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

    // Best score per player
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
