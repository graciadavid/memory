'use client'
import { useState, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

function fmt(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const c = Math.floor((ms % 1000) / 10)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
}

const CATEGORIES = [
  {
    key: 'memory', label: 'Memory', color: '#4A2C0A',
    games: [
      { key: 'memory', label: 'Memory', color: '#4A2C0A' },
      { key: 'digits', label: 'Digits', color: '#1565C0' },
      { key: 'sequence', label: 'Sequence', color: '#6A1B9A' },
      { key: 'nback', label: 'N-Back', color: '#7B1FA2' },
    ]
  },
  {
    key: 'agility', label: 'Agility', color: '#C62828',
    games: [
      { key: 'stopwatch', label: 'Stop', color: '#4A148C' },
      { key: 'f1', label: 'Formula 1', color: '#E8002D' },
      { key: 'pendulum', label: 'Pendulum', color: '#1565C0' },
      { key: 'ace', label: 'Ace', color: '#2E7D32' },
    ]
  },
  {
    key: 'knowledge', label: 'Knowledge', color: '#00796B',
    games: [
      { key: 'flags', label: 'Flags', color: '#00796B' },
      { key: 'population', label: 'Population', color: '#C62828' },
      { key: 'area', label: 'Area km²', color: '#C62828' },
      { key: 'geoshape', label: 'GeoShape', color: '#1565C0' },
    ]
  },
  {
    key: 'logic', label: 'Logic', color: '#6A1B9A',
    games: [
      { key: 'sudoku', label: 'Sudoku', color: '#757575' },
      { key: 'wordly', label: 'Wordly', color: '#2E7D32' },
      { key: 'mastermind', label: 'Mastermind', color: '#6A1B9A' },
      { key: '2048', label: '2048', color: '#EDC22E' },
    ]
  },
]

export default function GroupPageClient({ group, members, memberCount, scores }: any) {
  const { profile } = usePlayer()
  const [category, setCategory] = useState('memory')
  const [game, setGame] = useState('memory')
  const myName = profile?.name || ''

  const currentCategory = CATEGORIES.find(c => c.key === category)!
  
  // When category changes, reset game to first of that category
  const handleCategoryChange = (cat: string) => {
    const newCat = CATEGORIES.find(c => c.key === cat)!
    setCategory(cat)
    setGame(newCat.games[0].key)
  }

  const getRanking = () => {
    const data = scores[game] || []
    const lowerBetter = ['stopwatch', 'f1', 'pendulum', 'memory', 'sudoku', 'wordly', 'mastermind']
    return [...data].sort((a: any, b: any) => lowerBetter.includes(game) ? a.raw - b.raw : b.raw - a.raw)
  }

  const formatScore = (r: any) => {
    const lowerBetter = ['stopwatch', 'f1', 'pendulum', 'sudoku', 'wordly', 'mastermind']
    if (lowerBetter.includes(game)) {
      const ms = r.raw
      if (ms < 10000) return `${(ms/1000).toFixed(3)}s`
      const m = Math.floor(ms/60000)
      const s = Math.floor((ms%60000)/1000)
      return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
    }
    return r.score
  }

  const ranking = getRanking()
  const currentGame = currentCategory.games.find(g => g.key === game)!

  const shareGroup = () => {
    const url = `${window.location.origin}/g/${group.slug || group.id}`
    const text = `🧠 Join "${group.name}" on MemGenius!\n${url}`
    if (navigator.share) navigator.share({ text })
    else navigator.clipboard.writeText(url).then(() => alert('Link copied!'))
  }

  return (
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, #FFF8E1 0%, ${CREAM} 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      paddingBottom: 100,
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A3A5C, #1565C0)',
        padding: '28px 20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Group</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{group.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{memberCount} member{memberCount !== 1 ? 's' : ''}</div>
          </div>
          <button onClick={shareGroup} style={{
            padding: '10px 16px', borderRadius: 12, border: 'none',
            background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 800,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>Invite</button>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '16px 16px 8px', overflowX: 'auto' }}>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => handleCategoryChange(c.key)} style={{
            padding: '8px 16px', borderRadius: 20, border: 'none', flexShrink: 0,
            background: category === c.key ? c.color : '#fff',
            color: category === c.key ? '#fff' : `${BROWN}60`,
            fontSize: 13, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: category === c.key ? `0 4px 0 ${c.color}50` : `0 2px 8px ${BROWN}08`,
          }}>{c.label}</button>
        ))}
      </div>

      {/* Game tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px 12px', overflowX: 'auto' }}>
        {currentCategory.games.map(g => (
          <button key={g.key} onClick={() => setGame(g.key)} style={{
            padding: '6px 12px', borderRadius: 16, border: 'none', flexShrink: 0,
            background: game === g.key ? g.color : `${BROWN}08`,
            color: game === g.key ? '#fff' : `${BROWN}50`,
            fontSize: 11, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
          }}>{g.label}</button>
        ))}
      </div>

      {/* Ranking */}
      <div style={{ padding: '0 16px' }}>
        {ranking.length === 0 ? (
          <div style={{ textAlign: 'center', color: `${BROWN}30`, fontSize: 14, fontWeight: 700, padding: '40px 0' }}>
            No scores yet in {currentGame.label}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ranking.map((r: any, i: number) => {
              const isMe = r.name === myName
              return (
                <div key={r.name} style={{
                  display: 'grid', gridTemplateColumns: '36px 1fr auto',
                  alignItems: 'center', gap: 10,
                  background: isMe ? `${GOLD}22` : i === 0 ? `${GOLD}08` : '#fff',
                  border: `1px solid ${isMe ? GOLD + '60' : i === 0 ? GOLD + '20' : BROWN + '08'}`,
                  borderRadius: 14, padding: '14px 12px',
                }}>
                  <div style={{ fontSize: 15, fontWeight: 900, textAlign: 'center', color: i === 0 ? GOLD : i === 1 ? '#999' : i === 2 ? '#A0522D' : `${BROWN}30` }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: BROWN, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {r.name}
                    {isMe && <span style={{ fontSize: 8, color: GOLD, fontWeight: 900, background: `${GOLD}20`, padding: '1px 5px', borderRadius: 4 }}>YOU</span>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: currentGame.color }}>{formatScore(r)}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
