import { supabase } from '@/lib/supabase'
import MastermindRankingClient from './MastermindRankingClient'

export const revalidate = 60

export default async function MastermindRankingPage() {
  const { data } = await supabase
    .from('mastermind_scores')
    .select('player_name, time_ms, attempts')
    .order('time_ms', { ascending: true })
    .limit(500)

  const best: Record<string, { time: number, attempts: number }> = {}
  data?.forEach((s: any) => {
    if (!best[s.player_name] || s.time_ms < best[s.player_name].time)
      best[s.player_name] = { time: s.time_ms, attempts: s.attempts }
  })

  const scores = Object.entries(best)
    .map(([name, d]) => ({ name, time: d.time, attempts: d.attempts }))
    .sort((a, b) => a.time - b.time)

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
          <div style={{ fontSize: 26, fontWeight: 900, color: '#4A2C0A', letterSpacing: -1 }}>Mastermind Ranking</div>
        </div>
        <a href="/ranking" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: '1px solid #4A2C0A15', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 800, color: '#4A2C0A60' }}>Back ✕</div>
        </a>
      </div>
      <MastermindRankingClient scores={scores} />
    </main>
  )
}
