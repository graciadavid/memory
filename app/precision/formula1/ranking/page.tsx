import { supabase } from '@/lib/supabase'
import F1RankingClient from './F1RankingClient'

export const revalidate = 60

export default async function F1RankingPage() {
  const { data } = await supabase
    .from('precision_scores')
    .select('player_name, difference_ms, created_at')
    .eq('game_type', 'formula1')
    .order('difference_ms', { ascending: true })
    .limit(5000)

  const best: Record<string, { diff: number, created_at: string }> = {}
  data?.forEach((s: any) => {
    if (!best[s.player_name] || s.difference_ms < best[s.player_name].diff)
      best[s.player_name] = { diff: s.difference_ms, created_at: s.created_at }
  })

  const scores = Object.entries(best)
    .map(([name, d]) => ({ name, diff: d.diff, created_at: d.created_at }))
    .sort((a, b) => a.diff - b.diff)

  return <F1RankingClient scores={scores} />
}
