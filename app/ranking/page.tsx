import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 60

export default async function RankingPage() {
  const { data: scores } = await supabase
    .from('scores')
    .select('*, packs(title, slug, difficulty)')
    .order('time_ms', { ascending: true })
    .limit(100)

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  const diffEmoji = (d: number) => d === 1 ? '🟢' : d === 2 ? '🟡' : '🔴'

  return (
    <main style={{
      minHeight: '100dvh', background: '#0c0c14',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto', padding: '0 0 40px',
    }}>

      {/* Header */}
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>
            Pair<span style={{ color: '#FF4D6D' }}>IQ</span>
          </div>
        </Link>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#444', letterSpacing: 2, textTransform: 'uppercase' }}>
          🏆 World Ranking
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {scores?.map((score, i) => (
          <div key={score.id} style={{
            background: i === 0 ? 'rgba(255,215,0,0.08)' : '#111120',
            border: `1px solid ${i === 0 ? 'rgba(255,215,0,0.3)' : '#1e1e35'}`,
            borderRadius: 16, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            {/* Position */}
            <div style={{
              fontSize: i < 3 ? 22 : 14,
              fontWeight: 900,
              color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#333',
              minWidth: 32, textAlign: 'center',
            }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'white', marginBottom: 2 }}>
                {score.player_name}
              </div>
              <div style={{ fontSize: 11, color: '#444', fontWeight: 700 }}>
                {diffEmoji(score.packs?.difficulty)} #{score.packs?.slug}
              </div>
            </div>

            {/* Time */}
            <div style={{
              fontSize: 15, fontWeight: 900, color: '#FF4D6D',
              fontFamily: 'monospace', letterSpacing: 0.5,
            }}>
              {fmt(score.time_ms)}
            </div>
          </div>
        ))}

        {(!scores || scores.length === 0) && (
          <div style={{ textAlign: 'center', color: '#333', fontSize: 14, fontWeight: 700, marginTop: 60 }}>
            No scores yet. Be the first! 🏆
          </div>
        )}
      </div>
    </main>
  )
}
