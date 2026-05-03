import { supabase } from '@/lib/supabase'

export const revalidate = 0

export default async function RankingPage() {
  const { data: scores } = await supabase
    .from('scores')
    .select('*, packs(title, slug, difficulty)')
    .order('time_ms', { ascending: true })
    .limit(50)

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  const diffColor = (d: number) => d === 1 ? '#00c853' : d === 2 ? '#ff8c00' : '#FF4D6D'
  const diffLabel = (d: number) => d === 1 ? 'Easy' : d === 2 ? 'Med' : 'Hard'

  return (
    <main style={{
      minHeight: '100dvh', background: '#f0f0f0',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      paddingBottom: 100,
    }}>
      {/* Header */}
      <div style={{ padding: '24px 16px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#999', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
          Leaderboard
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#111', letterSpacing: -1 }}>
          🏆 World Ranking
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '40px 1fr 56px 90px',
        padding: '0 16px 8px', gap: 8,
      }}>
        {['#', 'Player', 'Level', 'Time'].map(h => (
          <div key={h} style={{ fontSize: 10, fontWeight: 900, color: '#bbb', letterSpacing: 2, textTransform: 'uppercase' }}>{h}</div>
        ))}
      </div>

      {/* Scores */}
      <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {scores?.map((score, i) => (
          <div key={score.id} style={{
            display: 'grid', gridTemplateColumns: '40px 1fr 56px 90px',
            alignItems: 'center', gap: 8,
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: 14, padding: '12px 10px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              fontSize: 14, fontWeight: 900, textAlign: 'center',
              color: i === 0 ? '#FFD700' : i === 1 ? '#aaa' : i === 2 ? '#cd7f32' : '#ccc',
            }}>
              {i + 1}
            </div>
            <div style={{
              fontSize: 14, fontWeight: 800, color: '#111',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {score.player_name}
            </div>
            <div style={{
              fontSize: 10, fontWeight: 900,
              color: diffColor(score.packs?.difficulty),
              background: `${diffColor(score.packs?.difficulty)}15`,
              borderRadius: 6, padding: '3px 6px', textAlign: 'center',
            }}>
              {diffLabel(score.packs?.difficulty)}
            </div>
            <div style={{
              fontSize: 13, fontWeight: 900, color: '#111',
              fontFamily: 'monospace', textAlign: 'right',
            }}>
              {fmt(score.time_ms)}
            </div>
          </div>
        ))}

        {(!scores || scores.length === 0) && (
          <div style={{ textAlign: 'center', color: '#bbb', fontSize: 14, fontWeight: 700, marginTop: 60 }}>
            No scores yet. Be the first! 🏆
          </div>
        )}
      </div>
    </main>
  )
}
