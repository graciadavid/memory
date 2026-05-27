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
]

function rand() { return Math.floor(Math.random() * (20 - 3 + 1)) + 3 }

export default function AgilityClient() {
  const [counts] = useState(() => GAMES.map(() => rand()))
  const [blink, setBlink] = useState(true)
  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 600); return () => clearInterval(t) }, [])

  return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>
      <div style={{ fontSize:11, fontWeight:800, color:COLOR, letterSpacing:3, textTransform:'uppercase', marginBottom:4 }}>Category</div>
      <div style={{ fontSize:32, fontWeight:900, color:'#fff', marginBottom:8 }}>Agility</div>
      <div style={{ fontSize:14, color:'rgba(255,255,255,0.35)', fontWeight:700, marginBottom:32 }}>Train your reaction time and precision</div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {GAMES.map((g, i) => (
          <a key={g.label} href={g.href} style={{ textDecoration:'none' }}>
            <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, border:'1px solid rgba(255,255,255,0.08)' }}>
              <img src={g.icon} style={{ width:52, height:52, objectFit:'contain', flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <div style={{ fontSize:17, fontWeight:900, color:'#fff' }}>{g.label}</div>
                  <div style={{ fontSize:11, fontWeight:900, color: blink ? '#69F0AE' : 'transparent', transition:'color 0.6s' }}>● {counts[i]} playing</div>
                </div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{g.desc}</div>
              </div>
              <div style={{ fontSize:18, color:'rgba(255,255,255,0.2)' }}>→</div>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
