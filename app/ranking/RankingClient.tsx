'use client'
import { useState } from 'react'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'

export default function RankingClient({ scores }: { scores: any[] }) {
  const [filter, setFilter] = useState<1 | 2 | 3>(1)

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  const diffColor = (d: number) => d === 1 ? '#2E7D32' : d === 2 ? '#E65100' : '#B71C1C'
  const diffLabel = (d: number) => d === 1 ? 'Easy' : d === 2 ? 'Medium' : 'Hard'

  // Filter by difficulty and keep only best score per player
  const filtered = scores
    .filter(s => s.packs?.difficulty === filter)
    .reduce((acc: any[], score) => {
      const existing = acc.find(s => s.player_name === score.player_name)
      if (!existing) {
        acc.push(score)
      } else if (score.time_ms < existing.time_ms) {
        const idx = acc.indexOf(existing)
        acc[idx] = score
      }
      return acc
    }, [])
    .sort((a, b) => a.time_ms - b.time_ms)

  const tabs = [
    { key: 1 as const, label: 'Easy', color: '#2E7D32' },
    { key: 2 as const, label: 'Medium', color: '#E65100' },
    { key: 3 as const, label: 'Hard', color: '#B71C1C' },
  ]

  return (
    <>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, padding: '0 16px 16px' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
            flex: 1, padding: '10px 8px', borderRadius: 14, border: 'none',
            background: filter === tab.key ? tab.color : '#fff',
            color: filter === tab.key ? '#fff' : `${BROWN}60`,
            fontSize: 13, fontWeight: 800,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: filter === tab.key ? `0 6px 0 ${tab.color}50` : `0 2px 8px ${BROWN}08`,
            transition: 'all 0.2s',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '44px 1fr 100px',
        padding: '0 16px 8px', gap: 8,
      }}>
        {['#', 'Player', 'Time'].map((h, i) => (
          <div key={h} style={{
            fontSize: 10, fontWeight: 900, color: `${BROWN}40`,
            letterSpacing: 2, textTransform: 'uppercase',
            textAlign: i === 2 ? 'center' : 'left',
          }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map((score, i) => (
          <div key={score.id} style={{
            display: 'grid', gridTemplateColumns: '44px 1fr 100px',
            alignItems: 'center', gap: 8,
            background: i === 0 ? `${GOLD}10` : '#fff',
            border: `1px solid ${i === 0 ? GOLD + '30' : BROWN + '08'}`,
            borderRadius: 14, padding: '14px 10px',
            boxShadow: `0 2px 8px ${BROWN}06`,
          }}>
            <div style={{
              fontSize: 15, fontWeight: 900, textAlign: 'center',
              color: i === 0 ? GOLD : i === 1 ? '#888' : i === 2 ? '#A0522D' : `${BROWN}25`,
            }}>
              {i + 1}
            </div>
            <div style={{
              fontSize: 14, fontWeight: 800, color: BROWN,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {score.player_name}
            </div>
            <div style={{
              fontSize: 13, fontWeight: 900, color: BROWN,
              fontFamily: 'monospace', textAlign: 'center',
            }}>
              {fmt(score.time_ms)}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: `${BROWN}30`, fontSize: 14, fontWeight: 700, marginTop: 60 }}>
            No scores yet
          </div>
        )}
      </div>
    </>
  )
}
