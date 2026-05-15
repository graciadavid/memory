import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 60

export default async function Game2048RankingPage() {
  const { data } = await supabase
    .from('game2048_scores')
    .select('player_name, best_tile, time_ms')
    .order('best_tile', { ascending: false })
    .order('time_ms', { ascending: true })
    .limit(500)

  const best: Record<string, { tile: number, time: number }> = {}
  data?.forEach((s: any) => {
    if (!best[s.player_name] || s.best_tile > best[s.player_name].tile || (s.best_tile === best[s.player_name].tile && s.time_ms < best[s.player_name].time))
      best[s.player_name] = { tile: s.best_tile, time: s.time_ms }
  })

  const scores = Object.entries(best)
    .map(([name, d]) => ({ name, best_tile: d.tile, time_ms: d.time }))
    .sort((a, b) => b.best_tile - a.best_tile || a.time_ms - b.time_ms)

  const BROWN = '#4A2C0A'
  const GOLD = '#C8960C'

  function fmt(ms: number) {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  }

  return (
    <main style={{
      height: '100dvh',
      background: 'linear-gradient(180deg, #FFF8E1 0%, #FAF7F2 100%)',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '24px 16px 12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Leaderboard</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: BROWN, letterSpacing: -1 }}>2048 Ranking</div>
        </div>
        <Link href="/ranking" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: '1px solid #4A2C0A15', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 800, color: '#4A2C0A60' }}>Back ✕</div>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 60px 70px', padding: '0 16px 8px', gap: 6 }}>
        {['#', 'Player', 'Tile', 'Time'].map((h, i) => (
          <div key={i} style={{ fontSize: 9, fontWeight: 900, color: `${BROWN}35`, letterSpacing: 2, textTransform: 'uppercase' }}>{h}</div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {scores.slice(0, 50).map((s, i) => (
          <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 60px 70px', gap: 6, padding: '10px 12px', borderRadius: 12, background: i % 2 === 0 ? '#fff' : 'transparent', marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: i < 3 ? GOLD : `${BROWN}50` }}>#{i + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: BROWN }}>{s.name}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#EDC22E' }}>{s.best_tile}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: `${BROWN}60` }}>{fmt(s.time_ms)}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
