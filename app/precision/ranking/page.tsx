import { supabase } from '@/lib/supabase'
import PrecisionRankingClient from './PrecisionRankingClient'

export const revalidate = 60

export default async function PrecisionRankingPage() {
  const [stopData, f1Data, pendulumData] = await Promise.all([
    supabase.from('precision_scores').select('player_name, difference_ms, created_at')
      .is('game_type', null)
      .order('difference_ms', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(5000),
    supabase.from('precision_scores').select('player_name, difference_ms, created_at')
      .eq('game_type', 'formula1')
      .order('difference_ms', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(5000),
    supabase.from('precision_scores').select('player_name, difference_ms, created_at')
      .eq('game_type', 'pendulum')
      .order('difference_ms', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(5000),
  ])

  const getBest = (data: any[], lowerIsBetter = true) => {
    const best: Record<string, { diff: number, created_at: string }> = {}
    data?.forEach(s => {
      if (!best[s.player_name] || (lowerIsBetter ? s.difference_ms < best[s.player_name].diff : s.difference_ms > best[s.player_name].diff)) {
        best[s.player_name] = { diff: s.difference_ms, created_at: s.created_at }
      }
    })
    return Object.entries(best)
      .map(([name, d]) => ({ name, diff: d.diff, created_at: d.created_at }))
      .sort((a, b) => a.diff - b.diff || a.created_at.localeCompare(b.created_at))
  }

  return (
    <main style={{
      height: '100dvh',
      background: 'linear-gradient(180deg, #EDE7F6 0%, #FAF7F2 100%)',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '24px 16px 12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#C8960C', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Leaderboard</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#4A2C0A', letterSpacing: -1 }}>Agility Ranking</div>
        </div>
        <a href="/ranking" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: '1px solid #4A2C0A15', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 800, color: '#4A2C0A60' }}>Back ✕</div>
        </a>
      </div>
      <PrecisionRankingClient stopScores={getBest(stopData.data || [])} f1Scores={getBest(f1Data.data || [])} pendulumScores={getBest(pendulumData.data || [])} />

    </main>
  )
}
