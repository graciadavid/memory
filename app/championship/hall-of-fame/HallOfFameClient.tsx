'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const GAME_ICONS: Record<string,string> = {
 stop: `${BASE}/precision.png`,
 blink: `${BASE}/blink.png`,
 capitals: `${BASE}/capitals.png`,
 flags: `${BASE}/flags.png`,
 pendulum: `${BASE}/pendulum.png`,
 digits: `${BASE}/digits.png`,
 nback: `${BASE}/nback.png`,
 ace: `${BASE}/ace.png`,
 'letter-rain': `${BASE}/rain.png`,
 mastermind: `${BASE}/mastermind.png`,
}

export default function HallOfFameClient() {
 const [winners, setWinners] = useState<any[]>([])

 useEffect(() => {
   supabase.from('championship_hall_of_fame').select('*').order('sunday_date', { ascending: true })
     .then(({ data }) => setWinners(data || []))
 }, [])

 return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>

     <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
       <img src={`${BASE}/trophy.png`} style={{ width:48, height:48, objectFit:'contain' }} />
       <div>
         <div style={{ fontSize:26, fontWeight:900, color:'#fff' }}>Hall of Fame</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Sunday Brain Championship</div>
       </div>
     </div>

     {winners.length === 0 && (
       <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:14, fontWeight:700, marginTop:60 }}>
         No champions yet.
       </div>
     )}

     <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
       {winners.map((w, i) => (
         <div key={w.id} style={{ background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', borderRadius:20, padding:'18px 20px', boxShadow:'0 6px 0 rgba(100,70,0,0.5)' }}>
           
           {/* Header */}
           <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
             <div style={{ fontSize:11, fontWeight:900, color:'rgba(0,0,0,0.5)', letterSpacing:2 }}>CHAMPION #{String(i+1).padStart(3,'0')}</div>
             <img src={`${BASE}/trophy.png`} style={{ width:24, height:24, objectFit:'contain' }} />
           </div>

           {/* Winner name */}
           <div style={{ fontSize:26, fontWeight:900, color:'#000', marginBottom:14 }}>{w.winner_name}</div>

           {/* Details grid */}
           <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
             <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:10, padding:'8px 10px' }}>
               <div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:3 }}>Day</div>
               <div style={{ fontSize:12, fontWeight:900, color:'#000' }}>
                 {new Date(w.sunday_date).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}
               </div>
             </div>
             <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:10, padding:'8px 10px' }}>
               <div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:3 }}>Game</div>
               <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                 <img src={GAME_ICONS[w.game] || `${BASE}/precision.png`} style={{ width:16, height:16, objectFit:'contain' }} />
                 <div style={{ fontSize:12, fontWeight:900, color:'#000', textTransform:'capitalize' }}>{w.game}</div>
               </div>
             </div>
             <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:10, padding:'8px 10px' }}>
               <div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:3 }}>Result</div>
               <div style={{ fontSize:12, fontWeight:900, color:'#000' }}>{w.score}ms</div>
             </div>
           </div>

           <div style={{ marginTop:10, fontSize:10, fontWeight:700, color:'rgba(0,0,0,0.35)', textAlign:'right' }}>{w.participants} players competed</div>
         </div>
       ))}
     </div>

     <div style={{ marginTop:32, textAlign:'center' }}>
       <a href="/championship" style={{ textDecoration:'none', fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>← Back to Championship</a>
     </div>
   </main>
 )
}
