'use client'
import { useState, useEffect, useRef } from 'react'

const COLOR = '#4A148C'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const GAMES = [
  { label: 'Stop', icon: `${BASE}/precision.png`, href: '/stop', desc: 'Stop at exactly 5.000s' },
  { label: 'F1 Reaction', icon: `${BASE}/f1.png`, href: '/f1', desc: 'React when lights go out' },
  { label: 'Pendulum', icon: `${BASE}/pendulum.png`, href: '/pendulum', desc: 'Tap when vertical' },
  { label: 'Ace', icon: `${BASE}/padel.png`, href: '/ace', desc: 'Hit the sweet spot' },
  { label: 'Letter Rain', icon: `${BASE}/rain.png`, href: '/letter-rain', desc: 'Count the falling letters' },
  { label: 'TypeDrop', icon: `${BASE}/type.png`, href: '/typedrop', desc: 'Type the word before it falls' },
]

function rand() { return Math.floor(Math.random() * (20 - 3 + 1)) + 3 }

export default function AgilityClient() {
  const [counts] = useState(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('stopCount') : null
    return GAMES.map((g, i) => {
      if (i === 0) {
        if (stored) return parseInt(stored)
        const n = rand()
        if (typeof window !== 'undefined') sessionStorage.setItem('stopCount', String(n))
        return n
      }
      return rand()
    })
  })
  const [blink, setBlink] = useState(true)
  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 600); return () => clearInterval(t) }, [])

  return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>
      <div style={{ fontSize:32, fontWeight:900, color:'#fff', marginBottom:24, textAlign:'center' }}>Agility</div>
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
    </main>
  )
}
