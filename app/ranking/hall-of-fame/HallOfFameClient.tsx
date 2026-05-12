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

function Avatar({ name, avatar, size = 52 }: { name: string, avatar?: string, size?: number }) {
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
  { key: 'memoryEasy', label: 'Memory Easy', phrase: 'The best in the world at Memory Easy is', color: '#2E7D32', bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', border: '#2E7D3240', icon: '/icons/memory.webp', result: (c: any) => fmt(c.time_ms) },
  { key: 'memoryMedium', label: 'Memory Medium', phrase: 'The best in the world at Memory Medium is', color: '#E65100', bg: 'linear-gradient(135deg, #FBE9E7, #FFCCBC)', border: '#E6510040', icon: '/icons/memory.webp', result: (c: any) => fmt(c.time_ms) },
  { key: 'memoryHard', label: 'Memory Hard', phrase: 'The best in the world at Memory Hard is', color: '#B71C1C', bg: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', border: '#B71C1C40', icon: '/icons/memory.webp', result: (c: any) => fmt(c.time_ms) },
  { key: 'digits', label: 'Digits', phrase: 'The best in the world at Digits is', color: '#1565C0', bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', border: '#1565C040', icon: '/icons/digits.webp', result: (c: any) => `${c.level} digits` },
  { key: 'sequence', label: 'Simon Says', phrase: 'The best Simon Says player in the world is', color: '#6A1B9A', bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', border: '#6A1B9A40', icon: '/icons/sequence.webp', result: (c: any) => `Level ${c.level}` },
  { key: 'flags', label: 'Flags', phrase: 'The best in the world at Flags is', color: '#00796B', bg: 'linear-gradient(135deg, #E0F2F1, #B2DFDB)', border: '#00796B40', icon: '/icons/flags.webp', result: (c: any) => `${c.level} flags` },
  { key: 'precisionStop', label: 'Stop', phrase: 'The most precise Stop player in the world is', color: '#4A148C', bg: 'linear-gradient(135deg, #EDE7F6, #D1C4E9)', border: '#4A148C40', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/precision.png', result: (c: any) => `${(c.difference_ms/1000).toFixed(3)}s off` },
  { key: 'precisionF1', label: 'Formula 1', phrase: 'The fastest F1 reactor in the world is', color: '#E8002D', bg: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', border: '#E8002D40', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/f1.png', result: (c: any) => `${c.difference_ms}ms` },
  { key: 'precisionPendulum', label: 'Pendulum', phrase: 'The best Pendulum player in the world is', color: '#4A148C', bg: 'linear-gradient(135deg, #EDE7F6, #D1C4E9)', border: '#4A148C40', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/pendulum.png', result: (c: any) => `${c.difference_ms}ms off` },
  { key: 'versusPopulation', label: 'Population', phrase: 'The best Higher or Lower Population player is', color: '#C62828', bg: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', border: '#C6282840', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/higuer.png', result: (c: any) => `${c.level} correct` },
  { key: 'versusArea', label: 'Area km²', phrase: 'The best Higher or Lower Area player is', color: '#B71C1C', bg: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', border: '#B71C1C40', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/higuer.png', result: (c: any) => `${c.level} correct` },
]

export default function HallOfFameClient({ champions }: { champions: Record<string, any> }) {
  const [avatars, setAvatars] = useState<Record<string, string>>({})

  useEffect(() => {
    const names = [...new Set(Object.values(champions).filter(Boolean).map((c: any) => c.player_name))]
    if (!names.length) return
    const stored = localStorage.getItem('memgenius_profile')
    const localMap: Record<string, string> = {}
    if (stored) {
      const p = JSON.parse(stored)
      if (p.name && p.avatar) localMap[p.name] = p.avatar
    }
    supabase.from('profiles').select('player_name, avatar_url').in('player_name', names).then(({ data }) => {
      const map: Record<string, string> = { ...localMap }
      if (data) data.forEach(p => { if (p.avatar_url) map[p.player_name] = p.avatar_url })
      setAvatars(map)
    })
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
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
          <img src="/icons/nav-trophy.webp" alt="" style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 8, filter: 'drop-shadow(0 4px 12px #C8960C60)' }} />
          <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 6 }}>All Time Records</div>
          <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, color: BROWN, marginBottom: 4 }}>Hall of Fame</div>
          <div style={{ fontSize: 13, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>The greatest MemGenius players ever</div>
          <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: '16px 0 0' }} />
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 16px' }}>
          {CARDS.map((card, idx) => {
            const c = champions[card.key]
            return (
              <div key={card.key} style={{
                borderRadius: 24, background: card.bg,
                border: `1.5px solid ${card.border}`,
                overflow: 'hidden',
                animation: `fadeUp 0.4s ease ${idx * 0.07}s both`,
                boxShadow: `0 6px 24px ${card.color}15`,
              }}>
                <div style={{ padding: '20px' }}>
                  {/* Game label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    {card.icon.startsWith('/') ? (
                      <img src={card.icon} alt="" style={{ width: 48, height: 48, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }} />
                    ) : (
                      <div style={{ fontSize: 40 }}>{card.icon}</div>
                    )}
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: card.color }}>{card.label}</div>
                      <div style={{ fontSize: 11, color: `${BROWN}50`, fontWeight: 700, marginTop: 1 }}>{card.phrase}</div>
                    </div>
                  </div>

                  {c ? (
                    <div style={{
                      background: '#fff', borderRadius: 16, padding: '14px 16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      boxShadow: `0 4px 16px ${card.color}15`,
                      border: `1px solid ${card.color}20`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar name={c.player_name} avatar={avatars[c.player_name]} size={52} />
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 900, color: BROWN }}>{c.player_name}</div>
                          <div style={{ fontSize: 22, fontWeight: 900, color: card.color, lineHeight: 1.2 }}>{card.result(c)}</div>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div style={{ background: '#fff', borderRadius: 16, padding: '20px', textAlign: 'center', border: `1px dashed ${card.color}30` }}>
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
