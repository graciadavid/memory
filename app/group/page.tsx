import { supabase } from '@/lib/supabase'
import GroupPageClient from './GroupPageClient'
import { notFound } from 'next/navigation'

export const revalidate = 60

export default async function GroupPage({ searchParams }: { searchParams: { id: string } }) {
  const id = searchParams.id
  const { data: group } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .single()

  if (!group) return notFound()

  const { data: members } = await supabase
    .from('group_members')
    .select('player_name, joined_at')
    .eq('group_id', id)
    .order('joined_at', { ascending: true })

  const memberNames = members?.map(m => m.player_name) || []

  // Get best scores for each member
  const [memScores, digScores, seqScores, flagScores] = await Promise.all([
    supabase.from('scores').select('player_name, time_ms').in('player_name', memberNames).order('time_ms', { ascending: true }),
    supabase.from('number_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('sequence_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
    supabase.from('flag_scores').select('player_name, level').in('player_name', memberNames).order('level', { ascending: false }),
  ])

  // Best per player
  const bestMemory: Record<string, number> = {}
  memScores.data?.forEach(s => {
    if (!bestMemory[s.player_name] || s.time_ms < bestMemory[s.player_name]) bestMemory[s.player_name] = s.time_ms
  })

  const bestLevel = (data: any[]) => {
    const map: Record<string, number> = {}
    data?.forEach(s => { if (!map[s.player_name] || s.level > map[s.player_name]) map[s.player_name] = s.level })
    return map
  }

  const bestDigits = bestLevel(digScores.data || [])
  const bestSeq = bestLevel(seqScores.data || [])
  const bestFlags = bestLevel(flagScores.data || [])

  return (
    <GroupPageClient
      group={group}
      members={members || []}
      bestMemory={bestMemory}
      bestDigits={bestDigits}
      bestSeq={bestSeq}
      bestFlags={bestFlags}
    />
  )
}
// force
