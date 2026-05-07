'use client'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

function fmt(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const c = Math.floor((ms % 1000) / 10)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
}

const CARDS = [
  { key: 'memoryEasy', label: 'Memory — Easy', color: '#2E7D32', icon: '/icons/memory.webp', result: (c: any) => c ? fmt(c.time_ms) : '—', share: (c: any) => `🧠 ${c?.player_name} holds the Memory Easy world record on MemGenius with ${fmt(c?.time_ms)}!\nhttps://memgenius.com/ranking/memory` },
  { key: 'memoryMedium', label: 'Memory — Medium', color: '#E65100', icon: '/icons/memory.webp', result: (c: any) => c ? fmt(c.time_ms) : '—', share: (c: any) => `🧠 ${c?.player_name} holds the Memory Medium world record on MemGenius with ${fmt(c?.time_ms)}!\nhttps://memgenius.com/ranking/memory` },
  { key: 'memoryHard', label: 'Memory — Hard', color: '#B71C1C', icon: '/icons/memory.webp', result: (c: any) => c ? fmt(c.time_ms) : '—', share: (c: any) => `🧠 ${c?.player_name} holds the Memory Hard world record on MemGenius with ${fmt(c?.time_ms)}!\nhttps://memgenius.com/ranking/memory` },
  { key: 'digits', label: 'Digits', color: '#1565C0', icon: '/icons/digits.webp', result: (c: any) => c ? `Level ${c.level}` : '—', share: (c: any) => `🔢 ${c?.player_name} holds the Digits world record on MemGenius with level ${c?.level}!\nhttps://memgenius.com/digits` },
  { key: 'sequence', label: 'Sequence', color: '#6A1B9A', icon: '/icons/sequence.webp', result: (c: any) => c ? `Level ${c.level}` : '—', share: (c: any) => `🎵 ${c?.player_name} holds the Sequence world record on MemGenius with level ${c?.level}!\nhttps://memgenius.com/sequence` },
  { key: 'flags', label: 'Flags', color: '#00796B', icon: '/icons/flags.webp', result: (c: any) => c ? `${c.level} flags` : '—', share: (c: any) => `🚩 ${c?.player_name} holds the Flags world record on MemGenius with ${c?.level} flags!\nhttps://memgenius.com/flags` },
]

export default function HallOfFameClient({ champions }: { champions: Record<string, any> }) {
  const shareChampion = async (card: typeof CARDS[0]) => {
    const c = champions[card.key]
    if (!c) return
    const text = card.share(c)
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  return (
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, #FFF8E1 0%, ${CREAM} 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '0 0 100px',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
            🏆 All Time
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: BROWN, letterSpacing: -1 }}>
            Hall of Fame
          </div>
        </div>
        <a href="/ranking" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: `1px solid ${BROWN}15`, borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 800, color: `${BROWN}60` }}>Back ✕</div>
        </a>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
        {CARDS.map(card => {
          const c = champions[card.key]
          return (
            <div key={card.key} style={{
              background: '#fff',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: `0 4px 20px ${BROWN}10`,
              border: `1px solid ${GOLD}20`,
            }}>
              {/* Color bar */}
              <div style={{ height: 6, background: card.color }} />

              <div style={{ padding: '16px 18px' }}>
                {/* Game label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <img src={card.icon} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                  <div style={{ fontSize: 12, fontWeight: 900, color: card.color, letterSpacing: 1, textTransform: 'uppercase' }}>
                    {card.label}
                  </div>
                </div>

                {c ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 22, fontWeight: 900, color: GOLD }}>👑</span>
                        <span style={{ fontSize: 20, fontWeight: 900, color: BROWN }}>{c.player_name}</span>
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: card.color }}>
                        {card.result(c)}
                      </div>
                    </div>
                    <button onClick={() => shareChampion(card)} style={{
                      padding: '10px 16px', borderRadius: 12, border: 'none',
                      background: GOLD, color: '#fff',
                      fontSize: 13, fontWeight: 900, cursor: 'pointer',
                      fontFamily: 'var(--font-nunito), sans-serif',
                      boxShadow: `0 4px 0 ${GOLD}60`,
                    }}>Share</button>
                  </div>
                ) : (
                  <div style={{ fontSize: 14, color: `${BROWN}30`, fontWeight: 700 }}>No record yet — be the first!</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
