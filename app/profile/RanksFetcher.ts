import { supabase } from '@/lib/supabase'

const DIFF_PACKS: Record<string, { label: string, color: string, slugs: string[] }> = {
  easy: { label: 'Easy', color: '#2E7D32', slugs: ['monuments-countries', 'animals-habitats', 'cities-skylines'] },
  medium: { label: 'Medium', color: '#E65100', slugs: ['foods-monuments', 'artworks-museums', 'civilizations-landmarks'] },
  hard: { label: 'Hard', color: '#B71C1C', slugs: ['inventions-inventors', 'phenomena-locations'] },
}

export async function fetchLiveRanks(playerName: string) {
  const result: Record<string, { rank: number | null, time: number | null }> = {}

  // Get all packs IDs in one query
  const { data: packs } = await supabase
    .from('packs')
    .select('id, slug, difficulty')

  if (!packs) return result

  // Get all scores for this player in one query
  const { data: myScores } = await supabase
    .from('scores')
    .select('pack_id, time_ms')
    .eq('player_name', playerName)

  if (!myScores) return result

  // Get all scores globally in one query
  const { data: allScores } = await supabase
    .from('scores')
    .select('pack_id, time_ms')

  if (!allScores) return result

  for (const [diff, val] of Object.entries(DIFF_PACKS)) {
    let bestRank: number | null = null
    let bestTime: number | null = null

    for (const slug of val.slugs) {
      const pack = packs.find(p => p.slug === slug)
      if (!pack) continue

      // My best time for this pack
      const myPackScores = myScores
        .filter(s => s.pack_id === pack.id)
        .sort((a, b) => a.time_ms - b.time_ms)

      if (myPackScores.length === 0) continue

      const myBest = myPackScores[0].time_ms

      // Count how many scores beat mine
      const beaten = allScores.filter(s => s.pack_id === pack.id && s.time_ms < myBest).length
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
