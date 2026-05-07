'use client'
import { useEffect, useState } from 'react'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'

const TABS = [
  { key: 1, label: 'Easy', color: '#2E7D32' },
  { key: 2, label: 'Medium', color: '#E65100' },
  { key: 3, label: 'Hard', color: '#B71C1C' },
]

export default function MemoryRankingClient({ ranked }: { ranked: Record<number, any[]> }) {
  const [filter, setFilter] = useState(1)
  const [myName, setMyName] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) setMyName(JSON.parse(stored).name || '')
  }, [])

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  const scores = ranked[filter] || []
  const myIndex = scores.findIndex((s: any) => s.player_name === myName)
  const myScore = myIndex >= 0 ? scores[myIndex] : null

  const diffLabel = (d: number) => d === 1 ? 'Easy' : d === 2 ? 'Medium' : 'Hard'

  const share = async (position: number, score: any) => {
    const text = `🧠 I'm #${position} in ${diffLabel(filter)} Memory on MemGenius with ${fmt(score.time_ms)}!\nhttps://memgenius.com/memory`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  return (
    <>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 10px', flexShrink: 0 }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
            flex: 1, padding: '9px 4px', borderRadius: 12, border: 'none',
            background: filter === tab.key ? tab.color : '#fff',
            color: filter === tab.key ? '#fff' : `${BROWN}60`,
            fontSize: 12, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: filter === tab.key ? `0 5px 0 ${tab.color}50` : `0 2px 6px ${BROWN}08`,
            transition: 'all 0.2s',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 80px 32px', padding: '0 16px 6px', gap: 6, flexShrink: 0 }}>
        {['#', 'Player', 'Time', ''].map((h, i) => (
          <div key={i} style={{ fontSize: 9, fontWeight: 900, color: `${BROWN}35`, letterSpacing: 2, textTransform: 'uppercase' }}>{h}</div>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px', paddingBottom: myScore ? 140 : 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {scores.length === 0 ? (
            <div style={{ textAlign: 'center', color: `${BROWN}30`, fontSize: 14, fontWeight: 700, marginTop: 60 }}>No scores yet</div>
          ) : scores.map((score: any, i: number) => {
            const isMe = score.player_name === myName
            return (
              <div key={score.player_name} id={isMe ? 'my-row' : undefined} style={{
                display: 'grid', gridTemplateColumns: '36px 1fr 80px 32px',
                alignItems: 'center', gap: 6,
                background: isMe ? `${GOLD}22` : i === 0 ? `${GOLD}08` : '#fff',
                border: `1px solid ${isMe ? GOLD + '60' : i === 0 ? GOLD + '20' : BROWN + '08'}`,
                borderRadius: 12, padding: '10px 10px',
                boxShadow: isMe ? `0 4px 16px ${GOLD}25` : `0 1px 4px ${BROWN}06`,
              }}>
                <div style={{ fontSize: 13, fontWeight: 900, textAlign: 'center', color: i === 0 ? GOLD : i === 1 ? '#999' : i === 2 ? '#A0522D' : `${BROWN}30` }}>{i + 1}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: BROWN, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {score.player_name}
                  {isMe && <span style={{ fontSize: 8, color: GOLD, fontWeight: 900, background: `${GOLD}20`, padding: '1px 5px', borderRadius: 4 }}>YOU</span>}
                </div>
                <div style={{ fontSize: 11, fontWeight: 900, color: BROWN, fontFamily: 'monospace', textAlign: 'center' }}>{fmt(score.time_ms)}</div>
                {isMe ? (
                  <button onClick={() => share(i + 1, score)} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: GOLD, color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
                ) : <div />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Sticky position */}
      {myScore && (
        <div onClick={() => document.getElementById('my-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          style={{ position: 'fixed', bottom: 60, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '8px 10px', background: 'rgba(250,247,242,0.97)', backdropFilter: 'blur(16px)', borderTop: `2px solid ${GOLD}40`, zIndex: 40, boxSizing: 'border-box', cursor: 'pointer' }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5, paddingLeft: 4 }}>Your position · tap to find</div>
          <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 80px 32px', alignItems: 'center', gap: 6, background: `${GOLD}22`, border: `1px solid ${GOLD}60`, borderRadius: 12, padding: '10px 10px' }}>
            <div style={{ fontSize: 13, fontWeight: 900, textAlign: 'center', color: GOLD }}>{myIndex + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: BROWN }}>{myScore.player_name}</div>
            <div style={{ fontSize: 11, fontWeight: 900, color: BROWN, fontFamily: 'monospace', textAlign: 'center' }}>{fmt(myScore.time_ms)}</div>
            <button onClick={(e) => { e.stopPropagation(); share(myIndex + 1, myScore) }} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: GOLD, color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
          </div>
        </div>
      )}
    </>
  )
}
