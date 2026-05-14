'use client'
import { useState, useEffect } from 'react'

const BROWN = '#4A2C0A'
const PURPLE = '#6A1B9A'

function fmt(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const c = Math.floor((ms % 1000) / 100)
  return m > 0 ? `${m}:${String(s).padStart(2,'0')}.${c}` : `${s}.${c}s`
}

export default function MastermindRankingClient({ scores }: { scores: any[] }) {
  const [myName, setMyName] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) setMyName(JSON.parse(stored).name || '')
  }, [])

  const myIndex = scores.findIndex(s => s.name === myName)
  const myScore = myIndex >= 0 ? scores[myIndex] : null

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 80px 50px', padding: '0 16px 8px', gap: 6 }}>
        {['#', 'Player', 'Time', 'Tries'].map((h, i) => (
          <div key={i} style={{ fontSize: 9, fontWeight: 900, color: `${BROWN}35`, letterSpacing: 2, textTransform: 'uppercase' }}>{h}</div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {myScore && myIndex > 10 && (
          <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 80px 50px', gap: 6, padding: '10px 12px', borderRadius: 12, background: `${PURPLE}15`, marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: PURPLE }}>#{myIndex + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: PURPLE }}>{myScore.name}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: PURPLE }}>{fmt(myScore.time)}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: PURPLE }}>{myScore.attempts}</div>
          </div>
        )}
        {scores.slice(0, 50).map((s, i) => (
          <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 80px 50px', gap: 6, padding: '10px 12px', borderRadius: 12, background: s.name === myName ? `${PURPLE}15` : i % 2 === 0 ? '#fff' : 'transparent', marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: i < 3 ? '#C8960C' : `${BROWN}50` }}>#{i + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.name === myName ? PURPLE : BROWN }}>{s.name}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: BROWN }}>{fmt(s.time)}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: `${BROWN}60` }}>{s.attempts}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
