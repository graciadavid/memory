import { supabase } from '@/lib/supabase'
import HallOfFameClient from './HallOfFameClient'

export const revalidate = 0

export default async function HallOfFamePage() {

  // Get best flag score
  const { data: flagData } = await supabase
    .from('flag_scores')
    .select('player_name, level')
    .order('level', { ascending: false })
    .limit(1)

  // Get best digits score  
  const { data: digitsData } = await supabase
    .from('number_scores')
    .select('player_name, level')
    .order('level', { ascending: false })
    .limit(1)

  // Get best sequence score
  const { data: seqData } = await supabase
    .from('sequence_scores')
    .select('player_name, level')
    .order('level', { ascending: false })
    .limit(1)

  // Get best memory scores per difficulty
  const { data: packsData } = await supabase
    .from('packs')
    .select('id, difficulty')

  const easyIds = packsData?.filter(p => p.difficulty === 1).map(p => p.id) || []
  const medIds = packsData?.filter(p => p.difficulty === 2).map(p => p.id) || []
  const hardIds = packsData?.filter(p => p.difficulty === 3).map(p => p.id) || []

  const getBestMemory = async (ids: string[]) => {
    if (!ids.length) return null
    const { data } = await supabase
      .from('scores')
      .select('player_name, time_ms')
      .in('pack_id', ids)
      .order('time_ms', { ascending: true })
      .limit(1)
    return data?.[0] || null
  }

  const [memEasy, memMed, memHard] = await Promise.all([
    getBestMemory(easyIds),
    getBestMemory(medIds),
    getBestMemory(hardIds),
  ])

  const champions = {
    memoryEasy: memEasy,
    memoryMedium: memMed,
    memoryHard: memHard,
    digits: digitsData?.[0] || null,
    sequence: seqData?.[0] || null,
    flags: flagData?.[0] || null,
  }

  return <HallOfFameClient champions={champions} />
}
