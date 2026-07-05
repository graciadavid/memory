'use client'
import { useState, useEffect } from 'react'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

// Icons are usually a hosted image filename (e.g. "sudoku.png"); games without a
// hosted asset can pass an emoji directly instead.
const isImageIcon = (icon: string) => /\.(png|webp|jpe?g|svg)$/i.test(icon)

interface Game {
  label: string
  icon: string
  href: string
  desc: string
}

interface Props {
  title: string
  games: Game[]
}

function rand() { return Math.floor(Math.random() * 18) + 3 }

export default function CategoryPage({ title, games }: Props) {
  const [counts] = useState(() => games.map(() => rand()))
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 600)
    return () => clearInterval(t)
  }, [])

  return (
    <main style={{ minHeight: '100dvh', background: '#1A1A1A', padding: '16px 16px 100px' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 20 }}>{title}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {games.map((g, i) => (
          <a key={g.label} href={g.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#252525', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 80, height: 80, flexShrink: 0, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isImageIcon(g.icon)
                  ? <img src={`${BASE}/${g.icon}`} style={{ width: 44, height: 44, objectFit: 'contain' }} />
                  : <span style={{ fontSize: 36, lineHeight: 1 }}>{g.icon}</span>
                }
              </div>
              <div style={{ padding: '14px 16px', flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 3 }}>{g.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{g.desc}</div>
              </div>
              <div style={{ paddingRight: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.2)' }}>›</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: blink ? '#69F0AE' : 'transparent', transition: 'color 0.3s', whiteSpace: 'nowrap' }}>● {counts[i]} playing</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
