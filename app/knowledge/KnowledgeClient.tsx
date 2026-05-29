'use client'
import { useState, useEffect } from 'react'

const COLOR = '#00796B'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const GAMES = [
 { label: 'Flags', icon: `${BASE}/flags.png`, href: '/flags', desc: 'Identify flags from around the world' },
 { label: 'Higher or Lower Population', icon: `${BASE}/population.png`, href: '/higherorlower/population', desc: 'Which country has more people?' },
 { label: 'Higher or Lower Area', icon: `${BASE}/area.png`, href: '/higherorlower/area', desc: 'Which country is bigger?' },
 { label: 'Countries', icon: `${BASE}/mapamundi.png`, href: '/countries', desc: 'Identify countries by shape' },
 { label: 'Capitals', icon: `${BASE}/capitals.png`, href: '/capitals', desc: 'Name the capital city' },
]

function rand() { return Math.floor(Math.random() * (20 - 3 + 1)) + 3 }

export default function KnowledgeClient() {
 const [counts] = useState(() => GAMES.map(() => rand()))
 const [blink, setBlink] = useState(true)
 useEffect(() => { const t = setInterval(() => setBlink(b => !b), 600); return () => clearInterval(t) }, [])

 return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>
     <div style={{ fontSize:32, fontWeight:900, color:'#fff', marginBottom:24, textAlign:'center', textAlign:'center' }}>Knowledge</div>
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
