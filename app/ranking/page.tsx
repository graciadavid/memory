'use client'
import Link from 'next/link'
import { useState } from 'react'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const CATEGORIES = [
  {
    key: 'memory',
    label: 'Memory',
    color: '#E91E63',
    games: [
      { key: 'memory', href: '/ranking/memory', icon: '/icons/memory.webp', label: 'Memory', bg: '#2E7D32' },
      { key: 'digits', href: '/digits/ranking', icon: '/icons/digits.webp', label: 'Digits', bg: '#1976D2' },
      { key: 'simon', href: '/sequence/ranking', icon: '/icons/sequence.webp', label: 'Simon Says', bg: '#FF6F00' },
    ]
  },
  {
    key: 'agility',
    label: 'Agility',
    color: '#FF6F00',
    games: [
      { key: 'stop', href: '/precision/ranking', icon: `${BASE}/precision.png`, label: 'Stop', bg: '#388E3C' },
      { key: 'f1', href: '/precision/ranking', icon: `${BASE}/f1.png`, label: 'F1 Reaction', bg: '#E8002D' },
      { key: 'pendulum', href: '/precision/ranking', icon: `${BASE}/pendulum.png`, label: 'Pendulum', bg: '#1565C0' },
    ]
  },
  {
    key: 'knowledge',
    label: 'Knowledge',
    color: '#1565C0',
    games: [
      { key: 'flags', href: '/flags/ranking', icon: '/icons/flags.webp', label: 'Flags', bg: '#E65100' },
      { key: 'versus', href: '/versus/ranking', icon: `${BASE}/higuer.png`, label: 'Higher or Lower', bg: '#546E7A' },
      { key: 'geoshape', href: '/geoshape/ranking', icon: `${BASE}/mapamundi.png`, label: 'GeoShape', bg: '#1565C0' },
    ]
  },
  {
    key: 'logic',
    label: 'Logic',
    color: '#6A1B9A',
    games: [
      { key: 'sudoku', href: '/sudoku/ranking', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/sudoku.png', label: 'Sudoku', bg: '#757575' },
      { key: 'wordly', href: '/wordly/ranking', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/wordly.png', label: 'Wordly', bg: '#2E7D32' },
      { key: 'mastermind', href: '/mastermind/ranking', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/mastermind.png', label: 'Mastermind', bg: '#6A1B9A' },
    ]
  },
]

export default function RankingPage() {
  const [activeCategory, setActiveCategory] = useState('memory')

  return (
    <main style={{ minHeight: '100dvh', background: `linear-gradient(180deg, #FFF8E1 0%, ${CREAM} 100%)`, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '24px 16px 100px' }}>
      
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Compete</div>
        <div style={{ fontSize: 30, fontWeight: 900, color: BROWN, letterSpacing: -1 }}>Rankings</div>
      </div>

      {/* Rankings section */}
      <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>By game</div>
      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {CATEGORIES.map(cat => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 12, border: 'none',
            background: activeCategory === cat.key ? cat.color : '#fff',
            color: activeCategory === cat.key ? '#fff' : BROWN,
            fontSize: 11, fontWeight: 900, fontFamily: 'inherit',
            cursor: 'pointer',
            boxShadow: activeCategory === cat.key ? `0 4px 0 ${cat.color}60` : '0 2px 0 #4A2C0A10',
          }}>{cat.label}</button>
        ))}
      </div>

      {/* Game cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {CATEGORIES.find(c => c.key === activeCategory)?.games.map(game => (
          <Link key={game.key} href={game.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: game.bg, borderRadius: 20,
              padding: '12px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-start', gap: 4,
              boxShadow: `0 6px 0 ${game.bg}60`, aspectRatio: '5/2.5',
            }}>
              <img src={game.icon} alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />
              <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', textAlign: 'center' }}>{game.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Hall of Fame section */}
      <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', margin: '24px 0 10px' }}>Hall of Fame</div>
      <Link href="/ranking/hall-of-fame" style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          background: 'linear-gradient(135deg, #C8960C, #F5D062, #B8860B)',
          borderRadius: 16, padding: '16px 20px',
          boxShadow: '0 6px 0 #C8960C60',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/icons/nav-trophy.webp" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>Hall of Fame</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>All time world records</div>
            </div>
          </div>

        </div>
      </Link>
    </main>
  )
}
