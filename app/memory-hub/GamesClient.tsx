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

function rand() { return Math.floor(Math.random() * (20 - 3 + 1)) + 3 }

export default function MemoryGamesClient() {
  const [counts] = useState(() => GAMES.map(() => rand()))
  const [blink, setBlink] = useState(true)
  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 600); return () => clearInterval(t) }, [])

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
       {GAMES.map((g, i) => (
         <a key={g.label} href={g.href} style={{ textDecoration:'none' }}>
           <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:'16px 12px', display:'flex', flexDirection:'column', alignItems:'center', gap:10, border:'1px solid rgba(255,255,255,0.08)', textAlign:'center' }}>
             <img src={g.icon} style={{ width:56, height:56, objectFit:'contain' }} />
             <div style={{ fontSize:14, fontWeight:900, color:'#fff' }}>{g.label}</div>
             <div style={{ fontSize:11, fontWeight:900, color: blink ? '#69F0AE' : 'transparent', transition:'color 0.6s' }}>● {counts[i]} playing</div>
           </div>
         </a>
       ))}
     </div>
  )
}
