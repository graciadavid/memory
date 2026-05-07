import { supabase } from '@/lib/supabase'
import HallOfFameClient from './HallOfFameClient'

export const revalidate = 3600

export default async function HallOfFamePage() {
  const [memEasy, memMed, memHard, digits, sequence, flags] = await Promise.all([
    supabase.from('scores').select('player_name, time_ms, packs(difficulty)').eq('packs.difficulty', 1).order('time_ms', { ascending: true }).limit(500),
    supabase.from('scores').select('player_name, time_ms, packs(difficulty)').eq('packs.difficulty', 2).order('time_ms', { ascending: true }).limit(500),
    supabase.from('scores').select('player_name, time_ms, packs(difficulty)').eq('packs.difficulty', 3).order('time_ms', { ascending: true }).limit(500),
    supabase.from('number_scores').select('player_name, level').order('level', { ascending: false }).order('created_at', { ascending: true }).limit(500),
    supabase.from('sequence_scores').select('player_name, level').order('level', { ascending: false }).order('created_at', { ascending: true }).limit(500),
    supabase.from('flag_scores').select('player_name, level').order('level', { ascending: false }).order('created_at', { ascending: true }).limit(500),
  ])

  // Get best per player
  const getBestMemory = (data: any[]) => {
    const map: Record<string, any> = {}
    data?.forEach(s => { if (s.packs && (!map[s.player_name] || s.time_ms < map[s.player_name].time_ms)) map[s.player_name] = s })
    return Object.values(map).sort((a, b) => a.time_ms - b.time_ms)[0] || null
  }

  const getBestLevel = (data: any[]) => {
    const map: Record<string, number> = {}
    data?.forEach(s => { if (!map[s.player_name] || s.level > map[s.player_name]) map[s.player_name] = s.level })
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1])
    return sorted[0] ? { player_name: sorted[0][0], level: sorted[0][1] } : null
  }

  const champions = {
    memoryEasy: getBestMemory(memEasy.data || []),
    memoryMedium: getBestMemory(memMed.data || []),
    memoryHard: getBestMemory(memHard.data || []),
    digits: getBestLevel(digits.data || []),
    sequence: getBestLevel(sequence.data || []),
    flags: getBestLevel(flags.data || []),
  }

  return <HallOfFameClient champions={champions} />
}
