'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const GAMES = [
  { label: 'Memory', icon: `${BASE}/memory.png`, href: '/memory', desc: 'Match connected concepts' },
  { label: 'Digits', icon: `${BASE}/digits.png`, href: '/digits', desc: 'Remember sequences of numbers' },
  { label: 'Simon Says', icon: `${BASE}/sequence.png`, href: '/sequence', desc: 'Repeat the color pattern' },
  { label: 'N-Back', icon: `${BASE}/nback.png`, href: '/nback', desc: 'Working memory challenge' },
  { label: 'Blink', icon: `${BASE}/blink.png`, href: '/blink', desc: 'Remember the grid' },
  { label: 'Poke', icon: `${BASE}/salmon.png`, href: '/poke', desc: 'Remember the bowl ingredients' },
]

function rand() { return Math.floor(Math.random() * (23 - 7 + 1)) + 7 }

export default function MemoryGamesClient() {
  const [counts] = useState(() => GAMES.map(() => rand()))
  const [blink, setBlink] = useState(true)
  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 600); return () => clearInterval(t) }, [])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {GAMES.map((g, i) => (
        <Link key={g.label} href={g.href} style={{ textDecoration:'none' }}>
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, border:'1px solid rgba(255,255,255,0.08)' }}>
            <img src={g.icon} style={{ width:52, height:52, objectFit:'contain', flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <div style={{ fontSize:17, fontWeight:900, color:'#fff' }}>{g.label}</div>
                <div style={{ fontSize:11, fontWeight:900, color: blink ? '#69F0AE' : 'transparent', transition:'color 0.1s' }}>● {counts[i]} playing</div>
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{g.desc}</div>
            </div>
            <div style={{ fontSize:18, color:'rgba(255,255,255,0.2)' }}>→</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
