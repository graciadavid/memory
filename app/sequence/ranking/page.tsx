import { supabase } from '@/lib/supabase'
import SequenceRankingClient from './SequenceRankingClient'

export const revalidate = 60

export default async function SequenceRankingPage() {
  const { data } = await supabase
    .from('sequence_scores')
    .select('player_name, level, created_at')
    .order('level', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(500)

  const best: Record<string, { level: number, created_at: string }> = {}
  data?.forEach(s => {
    if (!best[s.player_name] || s.level > best[s.player_name].level ||
      (s.level === best[s.player_name].level && s.created_at < best[s.player_name].created_at)) {
      best[s.player_name] = { level: s.level, created_at: s.created_at }
    }
  })

  const scores = Object.entries(best)
    .map(([name, d]) => ({ name, level: d.level, created_at: d.created_at }))
    .sort((a, b) => b.level - a.level || a.created_at.localeCompare(b.created_at))

  return (
    <main style={{
      height: '100dvh',
      background: 'linear-gradient(180deg, #F3E5F5 0%, #FAF7F2 100%)',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>

      <div style={{ padding: '24px 16px 12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#C8960C', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Leaderboard</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#4A2C0A', letterSpacing: -1 }}>Simon Says Ranking</div>
        </div>
        <a href="/ranking" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: '1px solid #4A2C0A15', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 800, color: '#4A2C0A60' }}>Back ✕</div>
        </a>
      </div>
      <SequenceRankingClient scores={scores} />
    </main>
  )
}
