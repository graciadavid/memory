'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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
  const colors = ['#C8960C', '#1565C0', '#2E7D32', '#6A1B9A', '#B71C1C', '#00796B']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function Avatar({ name, avatar, size = 56 }: { name: string, avatar?: string, size?: number }) {
  const color = getColor(name)
  if (avatar) return (
    <img src={avatar} alt={name} style={{ width: size, height: size, borderRadius: size * 0.3, objectFit: 'cover', boxShadow: `0 4px 16px ${GOLD}40` }} />
  )
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3,
      background: `linear-gradient(135deg, ${color}, ${color}AA)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 900, color: '#fff',
      flexShrink: 0, boxShadow: `0 4px 16px ${color}50`,
    }}>{name.slice(0, 2).toUpperCase()}</div>
  )
}

const CARDS = [
  { key: 'memoryEasy', label: 'Memory Easy', phrase: 'The best in the world at Memory Easy is', color: '#2E7D32', bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', border: '#2E7D3240', icon: '/icons/memory.webp', result: (c: any) => fmt(c.time_ms), unit: 'time', share: (c: any) => `🧠 ${c?.player_name} is the world champion in Memory Easy!\n⏱ ${fmt(c?.time_ms)}\nhttps://memgenius.com/ranking/memory` },
  { key: 'memoryMedium', label: 'Memory Medium', phrase: 'The best in the world at Memory Medium is', color: '#E65100', bg: 'linear-gradient(135deg, #FBE9E7, #FFCCBC)', border: '#E6510040', icon: '/icons/memory.webp', result: (c: any) => fmt(c.time_ms), unit: 'time', share: (c: any) => `🧠 ${c?.player_name} is the world champion in Memory Medium!\n⏱ ${fmt(c?.time_ms)}\nhttps://memgenius.com/ranking/memory` },
  { key: 'memoryHard', label: 'Memory Hard', phrase: 'The best in the world at Memory Hard is', color: '#B71C1C', bg: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', border: '#B71C1C40', icon: '/icons/memory.webp', result: (c: any) => fmt(c.time_ms), unit: 'time', share: (c: any) => `🧠 ${c?.player_name} is the world champion in Memory Hard!\n⏱ ${fmt(c?.time_ms)}\nhttps://memgenius.com/ranking/memory` },
  { key: 'digits', label: 'Digits', phrase: 'The best in the world at Digits is', color: '#1565C0', bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', border: '#1565C040', icon: '/icons/digits.webp', result: (c: any) => `${c.level} digits`, unit: 'digits', share: (c: any) => `🔢 ${c?.player_name} is the world champion in Digits!\n🏆 Level ${c?.level}\nhttps://memgenius.com/digits` },
  { key: 'sequence', label: 'Sequence', phrase: 'The best in the world at Sequence is', color: '#6A1B9A', bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', border: '#6A1B9A40', icon: '/icons/sequence.webp', result: (c: any) => `Level ${c.level}`, unit: 'sequence', share: (c: any) => `🎵 ${c?.player_name} is the world champion in Sequence!\n🏆 Level ${c?.level}\nhttps://memgenius.com/sequence` },
  { key: 'flags', label: 'Flags', phrase: 'The best in the world at Flags is', color: '#00796B', bg: 'linear-gradient(135deg, #E0F2F1, #B2DFDB)', border: '#00796B40', icon: '/icons/flags.webp', result: (c: any) => `${c.level} flags`, unit: 'flags', share: (c: any) => `🚩 ${c?.player_name} is the world champion in Flags!\n🏆 ${c?.level} flags\nhttps://memgenius.com/flags` },
]

function LeaderBadge({ since }: { since?: string }) {
  const days = since ? Math.max(0, Math.floor((Date.now() - new Date(since.replace(' ', 'T')).getTime()) / 86400000)) : 0
  return (
    <div style={{
      background: `linear-gradient(135deg, #C8960C, #FFD700)`,
      borderRadius: 12, padding: '8px 12px',
      textAlign: 'center',
      boxShadow: `0 4px 12px #C8960C50`,
      flexShrink: 0,
    }}>
      <div style={{ fontSize: 9, fontWeight: 900, color: '#fff', letterSpacing: 1, textTransform: 'uppercase' }}>Leader</div>
      <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{days}</div>
      <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>days</div>
    </div>
  )
}

export default function HallOfFameClient({ champions }: { champions: Record<string, any> }) {
  const [avatars, setAvatars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load avatars for all champions
    const names = [...new Set(Object.values(champions).filter(Boolean).map((c: any) => c.player_name))]
    if (!names.length) return
    supabase.from('profiles').select('player_name, avatar_url').in('player_name', names).then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {}
        data.forEach(p => { if (p.avatar_url) map[p.player_name] = p.avatar_url })
        setAvatars(map)
      }
    })
  }, [])

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
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerGold {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <main style={{
        minHeight: '100dvh',
        background: `linear-gradient(180deg, #FFF8E1 0%, ${CREAM} 30%, #F5EDD8 100%)`,
        fontFamily: 'var(--font-nunito), sans-serif',
        maxWidth: 430, margin: '0 auto',
        padding: '0 0 100px',
      }}>

        {/* Header */}
        <div style={{ padding: '28px 20px 20px', textAlign: 'center', position: 'relative' }}>
          <a href="/ranking" style={{
            position: 'absolute', right: 20, top: 28,
            textDecoration: 'none',
            background: `${BROWN}15`, borderRadius: 10,
            padding: '6px 12px', fontSize: 12, fontWeight: 800, color: `${BROWN}60`,
          }}>Back ✕</a>

          {/* Trophy image */}
          <img src="/icons/nav-trophy.webp" alt="" style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 8, filter: 'drop-shadow(0 4px 12px #C8960C60)' }} />

          <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 6 }}>
            All Time Records
          </div>
          <div style={{
            fontSize: 34, fontWeight: 900, letterSpacing: -1, color: BROWN,
            marginBottom: 4,
          }}>
            Hall of Fame
          </div>
          <div style={{ fontSize: 13, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
            The greatest MemGenius players ever
          </div>

          {/* Gold divider */}
          <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: '16px 0 0' }} />
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 16px' }}>
          {CARDS.map((card, idx) => {
            const c = champions[card.key]
            return (
              <div key={card.key} style={{
                borderRadius: 24,
                background: card.bg,
                border: `1.5px solid ${card.border}`,
                overflow: 'hidden',
                animation: `fadeUp 0.4s ease ${idx * 0.07}s both`,
                boxShadow: `0 6px 24px ${card.color}15`,
              }}>
                <div style={{ padding: '20px' }}>
                  {/* Game icon + label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <img src={card.icon} alt="" style={{ width: 48, height: 48, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: card.color }}>{card.label}</div>
                      <div style={{ fontSize: 11, color: `${BROWN}50`, fontWeight: 700, marginTop: 1 }}>{card.phrase}</div>
                    </div>
                  </div>

                  {c ? (
                    <>
                      {/* Champion row */}
                      <div style={{
                        background: '#fff',
                        borderRadius: 16, padding: '14px 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        boxShadow: `0 4px 16px ${card.color}15`,
                        border: `1px solid ${card.color}20`,
                        marginBottom: 10,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <Avatar name={c.player_name} avatar={avatars[c.player_name]} size={52} />
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 900, color: BROWN }}>{c.player_name}</div>
                            <div style={{ fontSize: 20, fontWeight: 900, color: card.color, lineHeight: 1.2 }}>{card.result(c)}</div>
                          </div>
                        </div>
                        {/* Leader badge */}
                        <LeaderBadge since={c.created_at} />
                      </div>

                      {/* Share button */}
                      <button onClick={() => shareChampion(card)} style={{
                        width: '100%', padding: '12px', borderRadius: 14, border: 'none',
                        background: card.color,
                        color: '#fff', fontSize: 14, fontWeight: 900,
                        cursor: 'pointer', fontFamily: 'inherit',
                        boxShadow: `0 5px 0 ${card.color}60`,
                      }}>Share</button>
                    </>
                  ) : (
                    <div style={{
                      background: '#fff', borderRadius: 16, padding: '20px',
                      textAlign: 'center', border: `1px dashed ${card.color}30`,
                    }}>
                      <img src="/icons/nav-trophy.webp" alt="" style={{ width: 36, height: 36, objectFit: 'contain', marginBottom: 4, opacity: 0.3 }} />
                      <div style={{ fontSize: 13, color: `${BROWN}40`, fontWeight: 700 }}>No record yet</div>
                      <div style={{ fontSize: 11, color: `${BROWN}30`, marginTop: 2 }}>Be the first champion!</div>
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
