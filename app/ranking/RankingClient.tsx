'use client'
import { useState } from 'react'

export default function RankingClient({ scores }: { scores: any[] }) {
  const [filter, setFilter] = useState<'all' | 1 | 2 | 3>('all')

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  const diffColor = (d: number) => d === 1 ? '#00c853' : d === 2 ? '#ff8c00' : '#FF4D6D'
  const diffLabel = (d: number) => d === 1 ? 'Easy' : d === 2 ? 'Med' : 'Hard'

  const filtered = filter === 'all'
    ? scores
    : scores.filter(s => s.packs?.difficulty === filter)

  const tabs = [
    { key: 'all', label: 'All', color: '#111' },
    { key: 1, label: 'Easy', color: '#00c853' },
    { key: 2, label: 'Medium', color: '#ff8c00' },
    { key: 3, label: 'Hard', color: '#FF4D6D' },
  ]

  return (
    <>
      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 12px 16px',
        overflowX: 'auto',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            style={{
              padding: '8px 16px', borderRadius: 20, border: 'none',
              background: filter === tab.key ? tab.color : '#e8e8e8',
              color: filter === tab.key ? '#fff' : '#888',
              fontSize: 12, fontWeight: 800,
              fontFamily: 'inherit', cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: filter === tab.key ? `0 4px 0 ${tab.color}60` : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
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
        {filtered.map((score, i) => (
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

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#bbb', fontSize: 14, fontWeight: 700, marginTop: 60 }}>
            No scores yet 🏆
          </div>
        )}
      </div>
    </>
  )
}
