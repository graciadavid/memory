'use client'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const COLOR = '#C62828'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const GAMES = [
  { label: 'Memory', icon: `${BASE}/memory.png`, href: '/memory', unlocked: true },
  { label: 'Digits', icon: `${BASE}/digits.png`, href: '/digits', unlocked: true },
  { label: 'Simon Says', icon: `${BASE}/sequence.png`, href: '/sequence', unlocked: true },
  { label: 'N-Back', icon: `${BASE}/nback.png`, href: '/nback', unlocked: true },
]

export default function MemoryHubPage() {
  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '32px 16px 100px' }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: COLOR, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Category</div>
      <div style={{ fontSize: 28, fontWeight: 900, color: BROWN, marginBottom: 24 }}>Memory</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {GAMES.map(g => (
          <a key={g.label} href={g.href} style={{ textDecoration: 'none', width: 'calc(50% - 6px)' }}>
            <div style={{ background: COLOR, borderRadius: 20, padding: '16px', aspectRatio: '1', display: 'flex', flexDirection: 'column', boxShadow: `0 6px 0 ${COLOR}60` }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{g.label}</div>
              <img src={g.icon} style={{ flex: 1, width: '100%', objectFit: 'contain' }} />
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
