import { supabase } from '@/lib/supabase'

const DIFF_PACKS: Record<string, { slugs: string[] }> = {
  easy: { slugs: ['monuments-countries', 'animals-habitats', 'cities-skylines'] },
  medium: { slugs: ['foods-monuments', 'artworks-museums', 'civilizations-landmarks'] },
  hard: { slugs: ['inventions-inventors', 'phenomena-locations'] },
}

export async function fetchLiveRanks(playerName: string) {
  const result: Record<string, { rank: number | null, time: number | null }> = {}

  // Get all packs
  const { data: packs } = await supabase
    .from('packs')
    .select('id, slug, difficulty')

  if (!packs) return result

  // Get all scores in one query
  const { data: allScores } = await supabase
    .from('scores')
    .select('pack_id, player_name, time_ms')

  if (!allScores) return result

  for (const [diff, val] of Object.entries(DIFF_PACKS)) {
    let bestRank: number | null = null
    let bestTime: number | null = null

    for (const slug of val.slugs) {
      const pack = packs.find(p => p.slug === slug)
      if (!pack) continue

      const packScores = allScores.filter(s => s.pack_id === pack.id)

      // My best time in this pack
      const myScores = packScores
        .filter(s => s.player_name === playerName)
        .sort((a, b) => a.time_ms - b.time_ms)

      if (myScores.length === 0) continue
      const myBest = myScores[0].time_ms

      // Best score per player in this pack
      const bestPerPlayer: Record<string, number> = {}
      packScores.forEach(s => {
        if (!bestPerPlayer[s.player_name] || s.time_ms < bestPerPlayer[s.player_name]) {
          bestPerPlayer[s.player_name] = s.time_ms
        }
      })

      // Count players with better time than mine
      const beaten = Object.values(bestPerPlayer).filter(t => t < myBest).length
      const rank = beaten + 1

      if (bestRank === null || rank < bestRank) {
        bestRank = rank
        bestTime = myBest
      }
    }

    result[diff] = { rank: bestRank, time: bestTime }
  }

  return result
}
