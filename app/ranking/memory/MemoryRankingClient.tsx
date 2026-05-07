'use client'
import { useState, useEffect } from 'react'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const BLUE = '#1565C0'

export default function MemoryRankingClient({ scores, dailyScores }: { scores: any[], dailyScores: any[], digitScores: any[] }) {
  const game = 'memory'
  const [filter, setFilter] = useState<1 | 2 | 3>(1)
  const [myName, setMyName] = useState<string>('')

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

  const getBest = (diff?: number) => {
    const fil = diff ? scores.filter(s => s.packs?.difficulty === diff) : scores
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

  const getDigitsBest = () => {
    const map: Record<string, { level: number, created_at: string }> = {}
    digitScores.forEach(s => {
      if (!map[s.player_name] || s.level > map[s.player_name].level ||
        (s.level === map[s.player_name].level && s.created_at < map[s.player_name].created_at)) {
        map[s.player_name] = { level: s.level, created_at: s.created_at }
      }
    })
    return Object.entries(map)
      .map(([name, data]) => ({ name, level: data.level, created_at: data.created_at }))
      .sort((a, b) => b.level - a.level || a.created_at.localeCompare(b.created_at))
  }

  const memoryFiltered = getBest(filter)
  const digitsFiltered = getDigitsBest()

  const share = async (position: number, score: any) => {
    const text = game === 'memory'
      ? `🧠 I'm #${position} in Memory on MemGenius with ${fmt(score.time_ms)}!\nhttps://memgenius.com/memory`
      : `🔢 I'm #${position} in Digits on MemGenius with level ${score.level}!\nhttps://memgenius.com/digits`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  const memoryTabs = [
    { key: 1 as const, label: 'Easy', color: '#2E7D32' },
    { key: 2 as const, label: 'Medium', color: '#E65100' },
    { key: 3 as const, label: 'Hard', color: '#B71C1C' },
  ]

  const MemoryRow = ({ score, position }: { score: any, position: number }) => {
    const isMe = score.player_name === myName
    return (
      <div id={isMe ? 'my-row' : undefined} style={{
        display: 'grid', gridTemplateColumns: '36px 1fr 48px 80px 32px',
        alignItems: 'center', gap: 6,
        background: isMe ? `${GOLD}22` : position === 1 ? `${GOLD}08` : '#fff',
        border: `1px solid ${isMe ? GOLD + '60' : position === 1 ? GOLD + '20' : BROWN + '08'}`,
        borderRadius: 12, padding: '10px 10px',
        boxShadow: isMe ? `0 4px 16px ${GOLD}25` : `0 1px 4px ${BROWN}06`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 900, textAlign: 'center', color: position === 1 ? GOLD : position === 2 ? '#999' : position === 3 ? '#A0522D' : `${BROWN}30` }}>{position}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: BROWN, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
          {score.player_name}
          {isMe && <span style={{ fontSize: 8, color: GOLD, fontWeight: 900, background: `${GOLD}20`, padding: '1px 5px', borderRadius: 4 }}>YOU</span>}
        </div>
        <div style={{ fontSize: 9, fontWeight: 900, color: diffColor(score.packs?.difficulty), background: `${diffColor(score.packs?.difficulty)}15`, borderRadius: 5, padding: '2px 4px', textAlign: 'center' }}>{diffLabel(score.packs?.difficulty)}</div>
        <div style={{ fontSize: 11, fontWeight: 900, color: BROWN, fontFamily: 'monospace', textAlign: 'center' }}>{fmt(score.time_ms)}</div>
        {isMe ? (
          <button onClick={() => share(position, score)} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: GOLD, color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
        ) : <div />}
      </div>
    )
  }

  const DigitsRow = ({ score, position }: { score: any, position: number }) => {
    const isMe = score.name === myName
    return (
      <div id={isMe ? 'my-row' : undefined} style={{
        display: 'grid', gridTemplateColumns: '36px 1fr 90px 32px',
        alignItems: 'center', gap: 6,
        background: isMe ? `${GOLD}22` : position === 1 ? `${GOLD}08` : '#fff',
        border: `1px solid ${isMe ? GOLD + '60' : position === 1 ? GOLD + '20' : BROWN + '08'}`,
        borderRadius: 12, padding: '10px 10px',
        boxShadow: isMe ? `0 4px 16px ${GOLD}25` : `0 1px 4px ${BROWN}06`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 900, textAlign: 'center', color: position === 1 ? GOLD : position === 2 ? '#999' : position === 3 ? '#A0522D' : `${BROWN}30` }}>{position}</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: BROWN, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
          {score.name}
          {isMe && <span style={{ fontSize: 8, color: GOLD, fontWeight: 900, background: `${GOLD}20`, padding: '1px 5px', borderRadius: 4 }}>YOU</span>}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: BLUE }}>{score.level} digits</div>
          {score.created_at && (
            <div style={{ fontSize: 8, color: `${BROWN}35`, fontWeight: 700 }}>
              {new Date(score.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })} {new Date(score.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
        {isMe ? (
          <button onClick={() => share(position, score)} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: GOLD, color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
        ) : <div />}
      </div>
    )
  }

  const scrollToMe = () => {
    document.getElementById('my-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const myMemoryIndex = memoryFiltered.findIndex(s => s.player_name === myName)
  const myDigitsIndex = digitsFiltered.findIndex(s => s.name === myName)

  return (
    <>


      {/* Memory tabs */}
      {game === 'memory' && (
        <div style={{ display: 'flex', gap: 6, padding: '0 16px 10px', flexShrink: 0 }}>
          {memoryTabs.map(tab => (
            <button key={String(tab.key)} onClick={() => setFilter(tab.key)} style={{
              flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none',
              background: filter === tab.key ? tab.color : '#fff',
              color: filter === tab.key ? '#fff' : `${BROWN}60`,
              fontSize: 11, fontWeight: 800,
              fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: filter === tab.key ? `0 4px 0 ${tab.color}50` : `0 2px 6px ${BROWN}08`,
              transition: 'all 0.2s',
            }}>{tab.label}</button>
          ))}
        </div>
      )}

      {/* Headers */}
      {game === 'memory' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 48px 80px 32px', padding: '0 16px 6px', gap: 6, flexShrink: 0 }}>
          {['#', 'Player', 'Lvl', 'Time', ''].map((h, i) => (
            <div key={i} style={{ fontSize: 9, fontWeight: 900, color: `${BROWN}35`, letterSpacing: 2, textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 80px 32px', padding: '0 16px 6px', gap: 6, flexShrink: 0 }}>
          {['#', 'Player', 'Digits', ''].map((h, i) => (
            <div key={i} style={{ fontSize: 9, fontWeight: 900, color: `${BROWN}35`, letterSpacing: 2, textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
      )}

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px', paddingBottom: 140 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {game === 'memory' ? (
            memoryFiltered.length === 0 ? (
              <div style={{ textAlign: 'center', color: `${BROWN}30`, fontSize: 14, fontWeight: 700, marginTop: 60 }}>No scores yet</div>
            ) : memoryFiltered.map((score, i) => <MemoryRow key={score.id} score={score} position={i + 1} />)
          ) : (
            digitsFiltered.length === 0 ? (
              <div style={{ textAlign: 'center', color: `${BROWN}30`, fontSize: 14, fontWeight: 700, marginTop: 60 }}>No scores yet</div>
            ) : digitsFiltered.map((score, i) => <DigitsRow key={score.name} score={score} position={i + 1} />)
          )}
        </div>
      </div>

      {/* Sticky my position */}
      {(myMemoryIndex >= 0) && (
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
          {myMemoryIndex >= 0 && (
            <MemoryRow score={memoryFiltered[myMemoryIndex]} position={myMemoryIndex + 1} />
          )}
        </div>
      )}
    </>
  )
}
