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

  if (!memberNames.length) {
    return (
      <>
        <GroupLandingClient group={group} memberCount={0} />
        <GroupPageClient group={group} members={[]} memberCount={0} scores={{}} />
      </>
    )
  }

  // Fetch all scores for all games
  const [memS, digS, seqS, nbS, precS, aceS, flagS, hlS, shapeS, sudS, wordS, mmS, g2048S] = await Promise.all([
    supabase.from('scores').select('player_name, time_ms').in('player_name', memberNames),
    supabase.from('number_scores').select('player_name, level').in('player_name', memberNames),
    supabase.from('sequence_scores').select('player_name, level').in('player_name', memberNames),
    supabase.from('nback_scores').select('player_name, level').in('player_name', memberNames),
    supabase.from('precision_scores').select('player_name, difference_ms, game_type').in('player_name', memberNames),
    supabase.from('ace_scores').select('player_name, level').in('player_name', memberNames),
    supabase.from('flag_scores').select('player_name, level').in('player_name', memberNames),
    supabase.from('higher_lower_scores').select('player_name, level, category').in('player_name', memberNames),
    supabase.from('shape_scores').select('player_name, level').in('player_name', memberNames),
    supabase.from('sudoku_scores').select('player_name, time_ms').in('player_name', memberNames),
    supabase.from('wordle_scores').select('player_name, time_ms').in('player_name', memberNames),
    supabase.from('mastermind_scores').select('player_name, time_ms').in('player_name', memberNames),
    supabase.from('game2048_scores').select('player_name, best_tile').in('player_name', memberNames),
  ])

  const bestByPlayer = (data: any[], key: string, lower = false) => {
    const map: Record<string, number> = {}
    data?.forEach(s => {
      const v = s[key]
      if (!map[s.player_name] || (lower ? v < map[s.player_name] : v > map[s.player_name])) map[s.player_name] = v
    })
    return Object.entries(map).map(([name, raw]) => ({
      name, raw,
      score: key === 'time_ms' ? (() => { const m = Math.floor(raw/60000); const s = Math.floor((raw%60000)/1000); const c = Math.floor((raw%1000)/10); return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}` })()
        : key === 'difference_ms' ? `${(raw/1000).toFixed(3)}s`
        : `${raw}`
    }))
  }

  const scores: Record<string, any[]> = {
    memory: bestByPlayer(memS.data || [], 'time_ms', true),
    digits: bestByPlayer(digS.data || [], 'level'),
    sequence: bestByPlayer(seqS.data || [], 'level'),
    nback: bestByPlayer(nbS.data || [], 'level'),
    stopwatch: bestByPlayer((precS.data || []).filter((s: any) => !s.game_type || s.game_type === null), 'difference_ms', true),
    f1: bestByPlayer((precS.data || []).filter((s: any) => s.game_type === 'formula1'), 'difference_ms', true),
    pendulum: bestByPlayer((precS.data || []).filter((s: any) => s.game_type === 'pendulum'), 'difference_ms', true),
    ace: bestByPlayer(aceS.data || [], 'level'),
    flags: bestByPlayer(flagS.data || [], 'level'),
    population: bestByPlayer((hlS.data || []).filter((s: any) => s.category === 'population'), 'level'),
    area: bestByPlayer((hlS.data || []).filter((s: any) => s.category === 'area'), 'level'),
    geoshape: bestByPlayer(shapeS.data || [], 'level'),
    sudoku: bestByPlayer(sudS.data || [], 'time_ms', true),
    wordly: bestByPlayer(wordS.data || [], 'time_ms', true),
    mastermind: bestByPlayer(mmS.data || [], 'time_ms', true),
    '2048': bestByPlayer(g2048S.data || [], 'best_tile'),
  }

  return (
    <>
      <GroupLandingClient group={group} memberCount={memberNames.length} />
      <GroupPageClient
        group={group}
        members={members || []}
        memberCount={memberNames.length}
        scores={scores}
      />
    </>
  )
}
