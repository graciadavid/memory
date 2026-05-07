'use client'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

function fmt(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const c = Math.floor((ms % 1000) / 10)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
}

function getColor(name: string) {
  const colors = ['#C8960C', '#1565C0', '#2E7D32', '#6A1B9A', '#B71C1C', '#00796B', '#E65100', '#4A148C']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function Avatar({ name, size = 52 }: { name: string, size?: number }) {
  const color = getColor(name)
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: `linear-gradient(135deg, ${color}, ${color}CC)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 900, color: '#fff',
      flexShrink: 0,
      boxShadow: `0 4px 16px ${color}50`,
      letterSpacing: -0.5,
    }}>{name.slice(0, 2).toUpperCase()}</div>
  )
}

const CARDS = [
  { key: 'memoryEasy', label: 'Memory Easy', sublabel: 'Fastest time', color: '#2E7D32', darkColor: '#1B5E20', icon: '/icons/memory.webp', result: (c: any) => fmt(c.time_ms), share: (c: any) => `🧠 ${c?.player_name} holds the Memory Easy world record on MemGenius!\n⏱ ${fmt(c?.time_ms)}\nhttps://memgenius.com/ranking/memory` },
  { key: 'memoryMedium', label: 'Memory Medium', sublabel: 'Fastest time', color: '#E65100', darkColor: '#BF360C', icon: '/icons/memory.webp', result: (c: any) => fmt(c.time_ms), share: (c: any) => `🧠 ${c?.player_name} holds the Memory Medium world record!\n⏱ ${fmt(c?.time_ms)}\nhttps://memgenius.com/ranking/memory` },
  { key: 'memoryHard', label: 'Memory Hard', sublabel: 'Fastest time', color: '#B71C1C', darkColor: '#7F0000', icon: '/icons/memory.webp', result: (c: any) => fmt(c.time_ms), share: (c: any) => `🧠 ${c?.player_name} holds the Memory Hard world record!\n⏱ ${fmt(c?.time_ms)}\nhttps://memgenius.com/ranking/memory` },
  { key: 'digits', label: 'Digits', sublabel: 'Most digits remembered', color: '#1565C0', darkColor: '#0D47A1', icon: '/icons/digits.webp', result: (c: any) => `${c.level} digits`, share: (c: any) => `🔢 ${c?.player_name} holds the Digits world record!\n🏆 Level ${c?.level}\nhttps://memgenius.com/digits` },
  { key: 'sequence', label: 'Sequence', sublabel: 'Longest pattern', color: '#6A1B9A', darkColor: '#4A148C', icon: '/icons/sequence.webp', result: (c: any) => `Level ${c.level}`, share: (c: any) => `🎵 ${c?.player_name} holds the Sequence world record!\n🏆 Level ${c?.level}\nhttps://memgenius.com/sequence` },
  { key: 'flags', label: 'Flags', sublabel: 'Most flags in a row', color: '#00796B', darkColor: '#004D40', icon: '/icons/flags.webp', result: (c: any) => `${c.level} flags`, share: (c: any) => `🚩 ${c?.player_name} holds the Flags world record!\n🏆 ${c?.level} flags\nhttps://memgenius.com/flags` },
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
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerGold {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <main style={{
        minHeight: '100dvh',
        background: `linear-gradient(180deg, #1A0A00 0%, #2C1500 40%, #1A0A00 100%)`,
        fontFamily: 'var(--font-nunito), sans-serif',
        maxWidth: 430, margin: '0 auto',
        padding: '0 0 100px',
      }}>

        {/* Header */}
        <div style={{ padding: '32px 20px 24px', textAlign: 'center', position: 'relative' }}>
          <a href="/ranking" style={{
            position: 'absolute', right: 20, top: 32,
            textDecoration: 'none',
            background: 'rgba(255,255,255,0.1)', borderRadius: 10,
            padding: '6px 12px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.5)',
          }}>Back ✕</a>

          <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>
            All Time Records
          </div>
          <div style={{
            fontSize: 36, fontWeight: 900, letterSpacing: -1,
            background: 'linear-gradient(135deg, #FFD700, #C8960C, #FFD700)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'shimmerGold 3s linear infinite',
            marginBottom: 6,
          }}>
            Hall of Fame
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
            The best players in the world
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 16px' }}>
          {CARDS.map((card, idx) => {
            const c = champions[card.key]
            return (
              <div key={card.key} style={{
                borderRadius: 24,
                background: `linear-gradient(135deg, ${card.color}30, ${card.darkColor}50)`,
                border: `1px solid ${card.color}40`,
                overflow: 'hidden',
                animation: `fadeUp 0.4s ease ${idx * 0.08}s both`,
                boxShadow: `0 8px 32px ${card.color}20`,
              }}>
                {/* Top accent line */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${card.color}, ${card.color}50)` }} />

                <div style={{ padding: '18px 20px' }}>
                  {/* Game label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <img src={card.icon} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: card.color, letterSpacing: 0.5 }}>{card.label}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>{card.sublabel}</div>
                    </div>
                  </div>

                  {c ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <Avatar name={c.player_name} size={52} />
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{c.player_name}</div>
                          <div style={{
                            fontSize: 22, fontWeight: 900,
                            background: `linear-gradient(135deg, ${card.color}, #fff)`,
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                          }}>{card.result(c)}</div>
                        </div>
                      </div>
                      <button onClick={() => shareChampion(card)} style={{
                        padding: '10px 16px', borderRadius: 12, border: 'none',
                        background: `linear-gradient(135deg, ${card.color}, ${card.darkColor})`,
                        color: '#fff', fontSize: 13, fontWeight: 900,
                        cursor: 'pointer', fontFamily: 'inherit',
                        boxShadow: `0 4px 12px ${card.color}50`,
                      }}>Share</button>
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 700, fontStyle: 'italic' }}>
                      No record yet — be the first! 🏆
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
