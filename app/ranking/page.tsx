import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const GAMES = [
  { key: 'memory', href: '/ranking/memory', icon: `${BASE}/memory.webp`, label: 'Memory', bg: '#4A2C0A', shadow: '#4A2C0A60', emoji: false },
  { key: 'digits', href: '/digits/ranking', icon: `${BASE}/digits.webp`, label: 'Digits', bg: '#1565C0', shadow: '#1565C060', emoji: false },
  { key: 'sequence', href: '/sequence/ranking', icon: `${BASE}/sequence.webp`, label: 'Sequence', bg: '#6A1B9A', shadow: '#6A1B9A60', emoji: false },
  { key: 'flags', href: '/flags/ranking', icon: `${BASE}/flags.webp`, label: 'Flags', bg: '#00796B', shadow: '#00796B60', emoji: false },
  { key: 'precision', href: '/precision/ranking', icon: '', label: 'Precision', bg: '#4A148C', shadow: '#4A148C60', emoji: true, emojiIcon: '⏱' },
  { key: 'versus', href: '/versus/ranking', icon: '', label: 'Versus', bg: '#C62828', shadow: '#C6282860', emoji: true, emojiIcon: '⚔️' },
]

export default function RankingPage() {
  return (
    <>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>
      <main style={{
        minHeight: '100dvh',
        background: `linear-gradient(180deg, #FFF8E1 0%, ${CREAM} 100%)`,
        fontFamily: 'var(--font-nunito), sans-serif',
        maxWidth: 430, margin: '0 auto',
        padding: '24px 16px 100px',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Compete</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: BROWN, letterSpacing: -1 }}>Rankings</div>
        </div>

        {/* Hall of Fame */}
        <Link href="/ranking/hall-of-fame" style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
          <div style={{
            background: `linear-gradient(135deg, ${BROWN}, #7A4C1A)`,
            borderRadius: 20, padding: '18px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: `0 8px 0 ${BROWN}60`,
          }}>
            <img src={`/icons/nav-trophy.webp`} alt="" style={{ width: 52, height: 52, objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>All time records</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>Hall of Fame</div>
            </div>
          </div>
        </Link>

        {/* Games grid */}
        <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>By game</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {GAMES.map((game, i) => (
            <Link key={game.key} href={game.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: game.bg,
                borderRadius: 20,
                padding: '10px 12px 8px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
                gap: 4, paddingTop: 10,
                boxShadow: `0 6px 0 ${game.shadow}`,
                aspectRatio: '5/2.5',
                animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
              }}>
                {game.emoji ? (
                  <div style={{ fontSize: 44 }}>{(game as any).emojiIcon}</div>
                ) : (
                  <img src={game.icon} alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />
                )}
                <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', textAlign: 'center' }}>{game.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
