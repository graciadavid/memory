import { supabase } from './supabase'

export async function calculateRank(
  playerName: string,
  packId: string,
  timeMs: number
): Promise<number> {
  // Get pack difficulty
  const { data: pack } = await supabase
    .from('packs')
    .select('difficulty')
    .eq('id', packId)
    .single()

  if (!pack) return 1

  // Get all packs of same difficulty
  const { data: diffPacks } = await supabase
    .from('packs')
    .select('id')
    .eq('difficulty', pack.difficulty)

  if (!diffPacks) return 1

  const packIds = diffPacks.map(p => p.id)

  // Get all scores for this difficulty
  const { data: allScores } = await supabase
    .from('scores')
    .select('player_name, time_ms')
    .in('pack_id', packIds)

  if (!allScores) return 1

  // Best score per player (include our new score)
  const bestPerPlayer: Record<string, number> = {}
  
  // Add our new score first
  bestPerPlayer[playerName] = timeMs
  
  allScores.forEach(s => {
    if (s.player_name === playerName) {
      // Keep our best (already set above or better)
      if (s.time_ms < bestPerPlayer[playerName]) {
        bestPerPlayer[playerName] = s.time_ms
      }
    } else {
      if (!bestPerPlayer[s.player_name] || s.time_ms < bestPerPlayer[s.player_name]) {
        bestPerPlayer[s.player_name] = s.time_ms
      }
    }
  })

  // Count players with strictly better time
  const rank = Object.values(bestPerPlayer).filter(t => t < bestPerPlayer[playerName]).length + 1
  return rank
}
