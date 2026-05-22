'use client'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const COLOR = '#E65100'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const GAMES = [
  { label: 'Sudoku', icon: `${BASE}/sudoku.png`, href: '/sudoku', unlocked: true },
  { label: 'Mastermind', icon: `${BASE}/mastermind.png`, href: '/mastermind', unlocked: false },
  { label: '2048', icon: `${BASE}/2048.png`, href: '/2048', unlocked: false },
  { label: 'Wordly', icon: `${BASE}/wordly.png`, href: '/wordly', unlocked: false },
]

export default function LogicPage() {
  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '32px 16px 100px' }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: COLOR, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Category</div>
      <div style={{ fontSize: 28, fontWeight: 900, color: BROWN, marginBottom: 24 }}>Logic</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {GAMES.map(g => g.unlocked ? (
          <a key={g.label} href={g.href} style={{ textDecoration: 'none', width: 'calc(50% - 6px)' }}>
            <div style={{ background: COLOR, borderRadius: 20, padding: '16px', aspectRatio: '1', display: 'flex', flexDirection: 'column', boxShadow: `0 6px 0 ${COLOR}60` }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{g.label}</div>
              <img src={g.icon} style={{ flex: 1, width: '100%', objectFit: 'contain' }} />
            </div>
          </a>
        ) : (
          <div key={g.label} style={{ width: 'calc(50% - 6px)', background: COLOR, borderRadius: 20, padding: '16px', aspectRatio: '1', display: 'flex', flexDirection: 'column', opacity: 0.25 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{g.label}</div>
            <img src={g.icon} style={{ flex: 1, width: '100%', objectFit: 'contain' }} />
          </div>
        ))}
      </div>
    </main>
  )
}
