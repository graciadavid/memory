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
   supabase.from('championship_hall_of_fame').select('*').order('sunday_date', { ascending: false })
     .then(({ data }) => setWinners(data || []))
 }, [])

 return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>
     
     <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
       <img src={`${BASE}/winner.png`} style={{ width:48, height:48, objectFit:'contain' }} />
       <div>
         <div style={{ fontSize:26, fontWeight:900, color:'#fff' }}>Hall of Fame</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Sunday Brain Championship</div>
       </div>
     </div>

     {winners.length === 0 && (
       <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:14, fontWeight:700, marginTop:60 }}>
         No champions yet. First championship coming soon.
       </div>
     )}

     <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
       {winners.map((w, i) => (
         <div key={w.id} style={{ background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', borderRadius:16, padding:'12px 16px', boxShadow:'0 4px 0 rgba(100,70,0,0.4)' }}>
           <div style={{ display:'flex', alignItems:'center', gap:12 }}>
             <div style={{ fontSize:22, fontWeight:900, color:'rgba(0,0,0,0.4)', minWidth:32 }}>#{winners.length - i}</div>
             <img src={GAME_ICONS[w.game] || `${BASE}/precision.png`} style={{ width:32, height:32, objectFit:'contain' }} />
             <div style={{ flex:1 }}>
               <div style={{ fontSize:16, fontWeight:900, color:'#000' }}>{w.winner_name}</div>
               <div style={{ fontSize:11, fontWeight:800, color:'rgba(0,0,0,0.5)', letterSpacing:1, textTransform:'uppercase' }}>
                 {w.game} · {new Date(w.sunday_date).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}
               </div>
             </div>
             <div style={{ textAlign:'right' }}>
               <div style={{ fontSize:20, fontWeight:900, color:'#000' }}>{w.score}ms</div>
               <div style={{ fontSize:10, fontWeight:800, color:'rgba(0,0,0,0.4)' }}>{w.participants} players</div>
             </div>
           </div>
         </div>
       ))}
     </div>

     <div style={{ marginTop:32, textAlign:'center' }}>
       <a href="/championship" style={{ textDecoration:'none', fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>← Back to Championship</a>
     </div>
   </main>
 )
}
