import { supabase } from '@/lib/supabase'
import GroupPageClient from './GroupPageClient'

export const revalidate = 0

export default async function GroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Try by slug first, then by id
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

  const [memScores, digScores, seqScores, flagScores, precScores] = await Promise.all([
    supabase.from('scores').select('player_name, time_ms').in('player_name', memberNames).order('time_ms', { ascending: true }),
    supabase.from('number_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('sequence_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('flag_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('precision_scores').select('player_name, difference_ms').in('player_name', memberNames).order('difference_ms', { ascending: true }),
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
    />
  )
}
