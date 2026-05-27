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
     <div style={{ fontSize:11, fontWeight:800, color:COLOR, letterSpacing:3, textTransform:'uppercase', marginBottom:4 }}>Category</div>
     <div style={{ fontSize:32, fontWeight:900, color:'#fff', marginBottom:8 }}>Knowledge</div>
     <div style={{ fontSize:14, color:'rgba(255,255,255,0.35)', fontWeight:700, marginBottom:32 }}>Explore the world and learn geography</div>
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
