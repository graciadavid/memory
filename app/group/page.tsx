import { supabase } from '@/lib/supabase'
import GroupPageClient from './GroupPageClient'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function GroupPage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const { id } = await searchParams
  const { data: group } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .single()

  if (!group) return <div style={{ padding: 20, fontFamily: 'var(--font-nunito)', textAlign: 'center', marginTop: 80 }}><div style={{ fontSize: 24 }}>😕</div><div style={{ fontWeight: 900, color: '#4A2C0A' }}>Group not found</div></div>

  const { data: members } = await supabase
    .from('group_members')
    .select('player_name, joined_at')
    .eq('group_id', id)
    .order('joined_at', { ascending: true })

  const memberNames = members?.map(m => m.player_name) || []
  if (memberNames.length === 0) return (
    <GroupPageClient group={group} members={[]} bestMemory={{}} bestDigits={{}} bestSeq={{}} bestFlags={{}} bestPrecision={{}} bestF1={{}} bestVersusPop={{}} bestVersusArea={{}} />
  )

  // Get best scores for each member
  const [memScores, digScores, seqScores, flagScores, precScores, f1Scores, vsPopScores, vsAreaScores] = await Promise.all([
    supabase.from('scores').select('player_name, time_ms').in('player_name', memberNames).order('time_ms', { ascending: true }),
    supabase.from('number_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('sequence_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('flag_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('precision_scores').select('player_name, difference_ms').is('game_type', null).in('player_name', memberNames).order('difference_ms', { ascending: true }),
    supabase.from('precision_scores').select('player_name, difference_ms').eq('game_type', 'formula1').in('player_name', memberNames).order('difference_ms', { ascending: true }),
    supabase.from('precision_scores').select('player_name, difference_ms').eq('game_type', 'pendulum').in('player_name', memberNames).order('difference_ms', { ascending: true }),
    supabase.from('higher_lower_scores').select('player_name, level').eq('category', 'population').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('higher_lower_scores').select('player_name, level').eq('category', 'area').in('player_name', memberNames).order('level', { ascending: false }),
  ])

  const bestMemory: Record<string, number> = {}
  memScores.data?.forEach(s => {
    if (!bestMemory[s.player_name] || s.time_ms < bestMemory[s.player_name]) bestMemory[s.player_name] = s.time_ms
  })

  const bestLevel = (data: any[]) => {
    const map: Record<string, number> = {}
    data?.forEach(s => { if (!map[s.player_name] || s.level > map[s.player_name]) map[s.player_name] = s.level })
    return map
  }

  const bestPrecision: Record<string, number> = {}
  precScores.data?.forEach((s: any) => { if (!bestPrecision[s.player_name] || s.difference_ms < bestPrecision[s.player_name]) bestPrecision[s.player_name] = s.difference_ms })

  const bestF1: Record<string, number> = {}
  f1Scores.data?.forEach((s: any) => { if (!bestF1[s.player_name] || s.difference_ms < bestF1[s.player_name]) bestF1[s.player_name] = s.difference_ms })

  const bestVersusPop: Record<string, number> = {}
  vsPopScores.data?.forEach((s: any) => { if (!bestVersusPop[s.player_name] || s.level > bestVersusPop[s.player_name]) bestVersusPop[s.player_name] = s.level })

  const bestVersusArea: Record<string, number> = {}
  vsAreaScores.data?.forEach((s: any) => { if (!bestVersusArea[s.player_name] || s.level > bestVersusArea[s.player_name]) bestVersusArea[s.player_name] = s.level })

  return (
    <GroupPageClient
      group={group}
      members={members || []}
      bestMemory={bestMemory}
      bestDigits={bestLevel(digScores.data || [])}
      bestSeq={bestLevel(seqScores.data || [])}
      bestFlags={bestLevel(flagScores.data || [])}
      bestPrecision={bestPrecision}
      bestF1={bestF1}
      bestVersusPop={bestVersusPop}
      bestVersusArea={bestVersusArea}
    />
  )
}
// force
