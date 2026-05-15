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

  const [precData, f1Data, pendulumData, popData, areaData, sudokuData, wordlyData, mastermindData, aceData, data2048, nbackData] = await Promise.all([
    supabase.from('precision_scores').select('player_name, difference_ms').is('game_type', null).order('difference_ms', { ascending: true }).limit(1),
    supabase.from('precision_scores').select('player_name, difference_ms').eq('game_type', 'formula1').order('difference_ms', { ascending: true }).limit(1),
    supabase.from('precision_scores').select('player_name, difference_ms').eq('game_type', 'pendulum').order('difference_ms', { ascending: true }).limit(1),
    supabase.from('higher_lower_scores').select('player_name, level').eq('category', 'population').order('level', { ascending: false }).limit(1),
    supabase.from('higher_lower_scores').select('player_name, level').eq('category', 'area').order('level', { ascending: false }).limit(1),
    supabase.from('sudoku_scores').select('player_name, time_ms, difficulty').order('time_ms', { ascending: true }).limit(1),
    supabase.from('wordle_scores').select('player_name, time_ms, attempts').order('time_ms', { ascending: true }).limit(1),
    supabase.from('mastermind_scores').select('player_name, time_ms, attempts').order('time_ms', { ascending: true }).limit(1),
    supabase.from('ace_scores').select('player_name, level').order('level', { ascending: false }).limit(1),
    supabase.from('game2048_scores').select('player_name, best_tile, time_ms').order('best_tile', { ascending: false }).order('time_ms', { ascending: true }).limit(1),
    supabase.from('nback_scores').select('player_name, level').order('level', { ascending: false }).limit(1),
  ])

  const champions = {
    memoryEasy: memEasy,
    memoryMedium: memMed,
    memoryHard: memHard,
    digits: digitsData?.[0] || null,
    sequence: seqData?.[0] || null,
    flags: flagData?.[0] || null,
    precisionStop: precData.data?.[0] || null,
    precisionF1: f1Data.data?.[0] || null,
    precisionPendulum: pendulumData.data?.[0] || null,
    versusPopulation: popData.data?.[0] || null,
    versusArea: areaData.data?.[0] || null,
    sudoku: sudokuData.data?.[0] || null,
    wordly: wordlyData.data?.[0] || null,
    mastermind: mastermindData.data?.[0] || null,
    ace: aceData.data?.[0] || null,
    game2048: data2048.data?.[0] || null,
    nback: nbackData.data?.[0] || null,
  }

  return <HallOfFameClient champions={champions} />
}
