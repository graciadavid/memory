import { supabase } from '@/lib/supabase'

const DIFF_PACKS: Record<string, { slugs: string[] }> = {
  easy: { slugs: ['monuments-countries', 'animals-habitats', 'cities-skylines'] },
  medium: { slugs: ['foods-monuments', 'artworks-museums', 'civilizations-landmarks', 'instruments-genres', 'skyscrapers-cities'] },
  hard: { slugs: ['inventions-inventors', 'phenomena-locations'] },
}

export async function fetchAllRanks(playerName: string) {
  const today = new Date().toISOString().split('T')[0]

  // All queries in parallel
  const [packsRes, scoresRes, dailyRes, digitsRes, seqRes] = await Promise.all([
    supabase.from('packs').select('id, slug, difficulty'),
    supabase.from('scores').select('pack_id, player_name, time_ms'),
    supabase.from('scores').select('player_name, time_ms').eq('is_daily', true).eq('play_date', today),
    supabase.from('number_scores').select('player_name, level'),
    supabase.from('sequence_scores').select('player_name, level'),
  ])

  const packs = packsRes.data || []
  const allScores = scoresRes.data || []
  const dailyScores = dailyRes.data || []
  const digitsScores = digitsRes.data || []
  const seqScores = seqRes.data || []

  // Memory ranks by difficulty
  const memoryRanks: Record<string, { rank: number | null, time: number | null }> = {}
  for (const [diff, val] of Object.entries(DIFF_PACKS)) {
    const ids = packs.filter(p => val.slugs.includes(p.slug)).map(p => p.id)
    const diffScores = allScores.filter(s => ids.includes(s.pack_id))
    const best: Record<string, number> = {}
    diffScores.forEach(s => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
    const myBest = best[playerName]
    if (!myBest) { memoryRanks[diff] = { rank: null, time: null }; continue }
    memoryRanks[diff] = { rank: Object.values(best).filter(t => t < myBest).length + 1, time: myBest }
  }

  // Daily rank
  const dailyBest: Record<string, number> = {}
  dailyScores.forEach(s => { if (!dailyBest[s.player_name] || s.time_ms < dailyBest[s.player_name]) dailyBest[s.player_name] = s.time_ms })
  const myDaily = dailyBest[playerName]
  const dailyRank = myDaily ? { rank: Object.values(dailyBest).filter(t => t < myDaily).length + 1, time: myDaily } : { rank: null, time: null }

  // Digits rank
  const digitsBest: Record<string, number> = {}
  digitsScores.forEach(s => { if (!digitsBest[s.player_name] || s.level > digitsBest[s.player_name]) digitsBest[s.player_name] = s.level })
  const myDigits = digitsBest[playerName]
  const digitsRank = myDigits ? { level: myDigits, rank: Object.values(digitsBest).filter(l => l > myDigits).length + 1 } : { level: null, rank: null }

  // Sequence rank
  const seqBest: Record<string, number> = {}
  seqScores.forEach(s => { if (!seqBest[s.player_name] || s.level > seqBest[s.player_name]) seqBest[s.player_name] = s.level })
  const mySeq = seqBest[playerName]
  const seqRank = mySeq ? { level: mySeq, rank: Object.values(seqBest).filter(l => l > mySeq).length + 1 } : { level: null, rank: null }

  return { memoryRanks, dailyRank, digitsRank, seqRank }
}
