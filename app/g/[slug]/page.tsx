import { supabase } from '@/lib/supabase'
import GroupPageClient from './GroupPageClient'
import GroupLandingClient from './GroupLandingClient'

export const revalidate = 0

export default async function GroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let { data: group } = await supabase.from('groups').select('*').eq('slug', slug).maybeSingle()
  if (!group) {
    const res = await supabase.from('groups').select('*').eq('id', slug).maybeSingle()
    group = res.data
  }

  if (!group) return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif', color: '#4A2C0A' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
      <div style={{ fontSize: 20, fontWeight: 900 }}>Group not found</div>
    </div>
  )

  const { data: members } = await supabase
    .from('group_members').select('player_name, joined_at')
    .eq('group_id', group.id).order('joined_at', { ascending: true })

  const memberNames = members?.map((m: any) => m.player_name) || []

  const [memScores, digScores, seqScores, flagScores, precScores, vsScores] = await Promise.all([
    memberNames.length ? supabase.from('scores').select('player_name, time_ms').in('player_name', memberNames) : { data: [] },
    memberNames.length ? supabase.from('number_scores').select('player_name, level').in('player_name', memberNames) : { data: [] },
    memberNames.length ? supabase.from('sequence_scores').select('player_name, level').in('player_name', memberNames) : { data: [] },
    memberNames.length ? supabase.from('flag_scores').select('player_name, level').in('player_name', memberNames) : { data: [] },
    memberNames.length ? supabase.from('precision_scores').select('player_name, difference_ms').in('player_name', memberNames) : { data: [] },
    memberNames.length ? supabase.from('higher_lower_scores').select('player_name, level').in('player_name', memberNames) : { data: [] },
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

  const bestVersus: Record<string, number> = {}
  vsScores.data?.forEach((s: any) => { if (!bestVersus[s.player_name] || s.level > bestVersus[s.player_name]) bestVersus[s.player_name] = s.level })

  return (
    <>
      <GroupLandingClient group={group} memberCount={memberNames.length} />
      <GroupPageClient
        group={group}
        members={members || []}
        memberCount={memberNames.length}
        bestMemory={bestMemory}
        bestDigits={bestLevel(digScores.data || [])}
        bestSeq={bestLevel(seqScores.data || [])}
        bestFlags={bestLevel(flagScores.data || [])}
        bestPrecision={bestPrecision}
        bestVersus={bestVersus}
      />
    </>
  )
}
