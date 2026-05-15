import { supabase } from '@/lib/supabase'
import GroupPageClient from './GroupPageClient'

export const revalidate = 0

export default async function GroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let { data: group } = await supabase.from('groups').select('*').eq('slug', slug).single()
  if (!group) {
    const res = await supabase.from('groups').select('*').eq('id', slug).single()
    group = res.data
  }

  if (!group) return <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>Group not found</div>

  const { data: members } = await supabase
    .from('group_members').select('player_name, joined_at')
    .eq('group_id', group.id).order('joined_at', { ascending: true })

  const memberNames = members?.map((m: any) => m.player_name) || []

  const [memScores, digScores, seqScores, flagScores, precScores, f1Scores, pendulumScores, vsPopScores, vsAreaScores, sudokuScores, wordlyScores, mastermindScores, geoScores, aceScores, scores2048, nbackScores] = await Promise.all([
    supabase.from('scores').select('player_name, time_ms').in('player_name', memberNames).order('time_ms', { ascending: true }),
    supabase.from('number_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('sequence_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('flag_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('precision_scores').select('player_name, difference_ms').is('game_type', null).in('player_name', memberNames).order('difference_ms', { ascending: true }),
    supabase.from('precision_scores').select('player_name, difference_ms').eq('game_type', 'formula1').in('player_name', memberNames).order('difference_ms', { ascending: true }),
    supabase.from('precision_scores').select('player_name, difference_ms').eq('game_type', 'pendulum').in('player_name', memberNames).order('difference_ms', { ascending: true }),
    supabase.from('higher_lower_scores').select('player_name, level').eq('category', 'population').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('higher_lower_scores').select('player_name, level').eq('category', 'area').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('sudoku_scores').select('player_name, time_ms').in('player_name', memberNames).order('time_ms', { ascending: true }),
    supabase.from('wordle_scores').select('player_name, time_ms, attempts').in('player_name', memberNames).order('time_ms', { ascending: true }),
    supabase.from('mastermind_scores').select('player_name, time_ms, attempts').in('player_name', memberNames).order('time_ms', { ascending: true }),
    supabase.from('shape_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('ace_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('game2048_scores').select('player_name, best_tile, time_ms').in('player_name', memberNames).order('best_tile', { ascending: false }).order('time_ms', { ascending: true }),
    supabase.from('nback_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
  ])

  const bestMemory: Record<string, number> = {}
  memScores.data?.forEach((s: any) => { if (!bestMemory[s.player_name] || s.time_ms < bestMemory[s.player_name]) bestMemory[s.player_name] = s.time_ms })

  const bestLevel = (data: any[]) => {
    const map: Record<string, number> = {}
    data?.forEach(s => { if (!map[s.player_name] || s.level > map[s.player_name]) map[s.player_name] = s.level })
    return map
  }

  const bestPrecision: Record<string, number> = {}
  precScores.data?.forEach((s: any) => { if (!bestPrecision[s.player_name] || s.difference_ms < bestPrecision[s.player_name]) bestPrecision[s.player_name] = s.difference_ms })

  const bestF1: Record<string, number> = {}
  f1Scores.data?.forEach((s: any) => { if (!bestF1[s.player_name] || s.difference_ms < bestF1[s.player_name]) bestF1[s.player_name] = s.difference_ms })

  const bestSudoku: Record<string, number> = {}
  sudokuScores.data?.forEach((s: any) => { if (!bestSudoku[s.player_name] || s.time_ms < bestSudoku[s.player_name]) bestSudoku[s.player_name] = s.time_ms })

  const bestWordly: Record<string, number> = {}
  wordlyScores.data?.forEach((s: any) => { if (!bestWordly[s.player_name] || s.time_ms < bestWordly[s.player_name]) bestWordly[s.player_name] = s.time_ms })

  const bestMastermind: Record<string, number> = {}
  mastermindScores.data?.forEach((s: any) => { if (!bestMastermind[s.player_name] || s.time_ms < bestMastermind[s.player_name]) bestMastermind[s.player_name] = s.time_ms })

  const bestGeo: Record<string, number> = {}
  geoScores.data?.forEach((s: any) => { if (!bestGeo[s.player_name] || s.level > bestGeo[s.player_name]) bestGeo[s.player_name] = s.level })

  const bestAce: Record<string, number> = {}
  aceScores.data?.forEach((s: any) => { if (!bestAce[s.player_name] || s.level > bestAce[s.player_name]) bestAce[s.player_name] = s.level })

  const bestNback: Record<string, number> = {}
  nbackScores.data?.forEach((s: any) => { if (!bestNback[s.player_name] || s.level > bestNback[s.player_name]) bestNback[s.player_name] = s.level })

  const best2048: Record<string, { tile: number, time: number }> = {}
  scores2048.data?.forEach((s: any) => { if (!best2048[s.player_name] || s.best_tile > best2048[s.player_name].tile || (s.best_tile === best2048[s.player_name].tile && s.time_ms < best2048[s.player_name].time)) best2048[s.player_name] = { tile: s.best_tile, time: s.time_ms } })

  const bestPendulum: Record<string, number> = {}
  pendulumScores.data?.forEach((s: any) => { if (!bestPendulum[s.player_name] || s.difference_ms < bestPendulum[s.player_name]) bestPendulum[s.player_name] = s.difference_ms })

  const bestVersusPop: Record<string, number> = {}
  vsPopScores.data?.forEach((s: any) => { if (!bestVersusPop[s.player_name] || s.level > bestVersusPop[s.player_name]) bestVersusPop[s.player_name] = s.level })

  const bestVersusArea: Record<string, number> = {}
  vsAreaScores.data?.forEach((s: any) => { if (!bestVersusArea[s.player_name] || s.level > bestVersusArea[s.player_name]) bestVersusArea[s.player_name] = s.level })

  return (
    <GroupPageClient
      group={group}
      members={members || []}
      memberCount={memberNames.length}
      bestMemory={bestMemory}
      bestDigits={bestLevel(digScores.data || [])}
      bestSeq={bestLevel(seqScores.data || [])}
      bestFlags={bestLevel(flagScores.data || [])}
      bestPrecision={bestPrecision}
      bestF1={bestF1}
      bestPendulum={bestPendulum}
      bestSudoku={bestSudoku}
      bestWordly={bestWordly}
      bestMastermind={bestMastermind}
      bestGeo={bestGeo}
      bestAce={bestAce}
      best2048={best2048}
      bestNback={bestNback}
      bestVersusPop={bestVersusPop}
      bestVersusArea={bestVersusArea}
    />
  )
}
