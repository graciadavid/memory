'use client'
import { useState, useEffect, useRef } from 'react'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'

export default function RankingClient({ scores, dailyScores }: { scores: any[], dailyScores: any[] }) {
  const [filter, setFilter] = useState<'today' | 1 | 2 | 3>('today')
  const [myName, setMyName] = useState<string>('')
  const myRowRef = useRef<HTMLDivElement>(null)

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

  const diffColor = (d: number) => d === 1 ? '#2E7D32' : d === 2 ? '#E65100' : '#B71C1C'
  const diffLabel = (d: number) => d === 1 ? 'Easy' : d === 2 ? 'Med' : 'Hard'

  const getBest = (diff: number) => {
    const fil = scores.filter(s => s.packs?.difficulty === diff)
    const map: Record<string, any> = {}
    fil.forEach(s => {
      const key = s.player_name
      if (!map[key] || s.time_ms < map[key].time_ms) map[key] = s
    })
    return Object.values(map).sort((a, b) => a.time_ms - b.time_ms)
  }

  const getDailyBest = () => {
    const map: Record<string, any> = {}
    dailyScores.forEach(s => {
      if (!map[s.player_name] || s.time_ms < map[s.player_name].time_ms) map[s.player_name] = s
    })
    return Object.values(map).sort((a, b) => a.time_ms - b.time_ms)
  }

  const filtered = filter === 'today' ? getDailyBest() : getBest(filter)
  const myIndex = filtered.findIndex(s => s.player_name === myName)
  const myScore = myIndex >= 0 ? filtered[myIndex] : null
  const myPosition = myIndex + 1

  const scrollToMe = () => {
    const el = document.getElementById('my-row')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const share = async (position: number, score: any) => {
    const cat = filter === 'today' ? 'Daily Challenge' : filter === 1 ? 'Easy' : filter === 2 ? 'Medium' : 'Hard'
    const text = `🦅 I'm #${position} in ${cat} on MemGenius!\nTime: ${fmt(score.time_ms)}\nCan you beat me?\nhttps://memgenius.com`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  const tabs = [
    { key: 'today' as const, label: 'Today', color: BROWN },
    { key: 1 as const, label: 'Easy', color: '#2E7D32' },
    { key: 2 as const, label: 'Medium', color: '#E65100' },
    { key: 3 as const, label: 'Hard', color: '#B71C1C' },
  ]

  const ScoreRow = ({ score, position }: { score: any, position: number }) => {
    const isMe = score.player_name === myName
    return (
      <div
        id={isMe ? 'my-row' : undefined}
        style={{
          display: 'grid', gridTemplateColumns: '36px 1fr 48px 80px 32px',
          alignItems: 'center', gap: 6,
          background: isMe ? `${GOLD}22` : position === 1 ? `${GOLD}08` : '#fff',
          border: `1px solid ${isMe ? GOLD + '60' : position === 1 ? GOLD + '20' : BROWN + '08'}`,
          borderRadius: 12, padding: '10px 10px',
          boxShadow: isMe ? `0 4px 16px ${GOLD}25` : `0 1px 4px ${BROWN}06`,
          boxSizing: 'border-box',
        }}>
        <div style={{
          fontSize: 13, fontWeight: 900, textAlign: 'center',
          color: position === 1 ? GOLD : position === 2 ? '#999' : position === 3 ? '#A0522D' : `${BROWN}30`,
        }}>{position}</div>
        <div style={{
          fontSize: 13, fontWeight: 800, color: BROWN,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {score.player_name}
          {isMe && <span style={{ fontSize: 8, color: GOLD, fontWeight: 900, letterSpacing: 1, background: `${GOLD}20`, padding: '1px 5px', borderRadius: 4 }}>YOU</span>}
        </div>
        <div style={{
          fontSize: 9, fontWeight: 900,
          color: diffColor(score.packs?.difficulty),
          background: `${diffColor(score.packs?.difficulty)}15`,
          borderRadius: 5, padding: '2px 4px', textAlign: 'center',
        }}>{diffLabel(score.packs?.difficulty)}</div>
        <div style={{
          fontSize: 11, fontWeight: 900, color: BROWN,
          fontFamily: 'monospace', textAlign: 'center',
        }}>{fmt(score.time_ms)}</div>
        {isMe ? (
          <button onClick={() => share(position, score)} style={{
            width: 26, height: 26, borderRadius: 7, border: 'none',
            background: GOLD, color: '#fff', fontSize: 11,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>↑</button>
        ) : <div />}
      </div>
    )
  }

  return (
    <>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', flexShrink: 0 }}>
        {tabs.map(tab => (
          <button key={String(tab.key)} onClick={() => setFilter(tab.key)} style={{
            flex: 1, padding: '9px 4px', borderRadius: 12, border: 'none',
            background: filter === tab.key ? tab.color : '#fff',
            color: filter === tab.key ? '#fff' : `${BROWN}60`,
            fontSize: 11, fontWeight: 800,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: filter === tab.key ? `0 5px 0 ${tab.color}50` : `0 2px 6px ${BROWN}08`,
            transition: 'all 0.2s',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '36px 1fr 48px 80px 32px',
        padding: '0 16px 6px', gap: 6, flexShrink: 0,
      }}>
        {['#', 'Player', 'Lvl', 'Time', ''].map((h, i) => (
          <div key={i} style={{ fontSize: 9, fontWeight: 900, color: `${BROWN}35`, letterSpacing: 2, textTransform: 'uppercase' }}>{h}</div>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px', paddingBottom: myScore ? 140 : 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: `${BROWN}30`, fontSize: 14, fontWeight: 700, marginTop: 60 }}>
              {filter === 'today' ? 'No one has played today yet. Be first!' : 'No scores yet'}
            </div>
          )}
          {filtered.map((score, i) => (
            <ScoreRow key={score.id} score={score} position={i + 1} />
          ))}
        </div>
      </div>

      {/* Sticky my position */}
      {myScore && (
        <div onClick={scrollToMe} style={{
          position: 'fixed', bottom: 60,
          left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430,
          padding: '8px 10px',
          background: 'rgba(250,247,242,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: `2px solid ${GOLD}40`,
          zIndex: 40, boxSizing: 'border-box', cursor: 'pointer',
        }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5, paddingLeft: 4 }}>
            Your position · tap to find
          </div>
          <ScoreRow score={myScore} position={myPosition} />
        </div>
      )}
    </>
  )
}
