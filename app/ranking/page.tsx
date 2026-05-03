import { supabase } from '@/lib/supabase'

export const revalidate = 60

export default async function RankingPage() {
  const { data: scores } = await supabase
    .from('scores')
    .select('*, packs(title, slug, difficulty)')
    .order('time_ms', { ascending: true })
    .limit(300)

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  const easy = scores?.filter(s => s.packs?.difficulty === 1).slice(0, 10) || []
  const medium = scores?.filter(s => s.packs?.difficulty === 2).slice(0, 10) || []
  const hard = scores?.filter(s => s.packs?.difficulty === 3).slice(0, 10) || []

  const Column = ({ title, color, data, emoji }: { title: string, color: string, data: any[], emoji: string }) => (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontSize: 11, fontWeight: 900, letterSpacing: 2,
        textTransform: 'uppercase', color, marginBottom: 8,
        textAlign: 'center',
      }}>
        {emoji} {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {data.map((score, i) => (
          <div key={score.id} style={{
            background: '#111120',
            border: '1px solid #1a1a2e',
            borderRadius: 10, padding: '8px 10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: '#333' }}>#{i + 1}</span>
              <span style={{ fontSize: 10, fontWeight: 900, color, fontFamily: 'monospace' }}>{fmt(score.time_ms)}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {score.player_name}
            </div>
            <div style={{ fontSize: 9, color: '#333', fontWeight: 700, marginTop: 1 }}>
              #{score.packs?.slug?.split('-')[0]}
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div style={{ fontSize: 11, color: '#222', textAlign: 'center', padding: '20px 0', fontWeight: 700 }}>
            No scores yet
          </div>
        )}
      </div>
    </div>
  )

  return (
    <main style={{
      minHeight: '100dvh', background: '#0c0c14',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '16px 10px 100px',
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: 'white' }}>
          Pair<span style={{ color: '#FF4D6D' }}>IQ</span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#444', letterSpacing: 3, textTransform: 'uppercase', marginTop: 2 }}>
          🏆 World Ranking
        </div>
      </div>

      {/* 3 columns */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Column title="Easy" emoji="🟢" color="#00e676" data={easy} />
        <Column title="Medium" emoji="🟡" color="#ff8c00" data={medium} />
        <Column title="Hard" emoji="🔴" color="#FF4D6D" data={hard} />
      </div>

    </main>
  )
}
