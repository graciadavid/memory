'use client'
const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const COLOR = '#C62828'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const GAMES = [
 { label: 'Memory', icon: `${BASE}/memory.png`, href: '/memory', desc: 'Match connected concepts' },
 { label: 'Digits', icon: `${BASE}/digits.png`, href: '/digits', desc: 'Remember sequences of numbers' },
 { label: 'Simon Says', icon: `${BASE}/sequence.png`, href: '/sequence', desc: 'Repeat the color pattern' },
 { label: 'N-Back', icon: `${BASE}/nback.png`, href: '/nback', desc: 'Working memory challenge' },
]

export default function MemoryHubPage() {
 return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>
     <div style={{ fontSize:11, fontWeight:800, color:COLOR, letterSpacing:3, textTransform:'uppercase', marginBottom:4 }}>Category</div>
     <div style={{ fontSize:32, fontWeight:900, color:'#fff', marginBottom:8 }}>Memory</div>
     <div style={{ fontSize:14, color:'rgba(255,255,255,0.35)', fontWeight:700, marginBottom:32 }}>Train your memory and recall</div>
     <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
       {GAMES.map(g => (
         <a key={g.label} href={g.href} style={{ textDecoration:'none' }}>
           <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, border:'1px solid rgba(255,255,255,0.08)' }}>
             <img src={g.icon} style={{ width:52, height:52, objectFit:'contain', flexShrink:0 }} />
             <div style={{ flex:1 }}>
               <div style={{ fontSize:17, fontWeight:900, color:'#fff', marginBottom:4 }}>{g.label}</div>
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
