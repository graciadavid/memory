'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'

export default function HallOfFamePage() {
  const [winners, setWinners] = useState<any[]>([])

  useEffect(() => {
    supabase.from('championship_hall_of_fame').select('*').order('sunday_date', { ascending: false })
      .then(({ data }) => setWinners(data || []))
  }, [])

  return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>
      <a href="/championship" style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:800, textDecoration:'none', display:'block', marginBottom:24 }}>← Championship</a>
      
      <div style={{ fontSize:11, fontWeight:800, color:GOLD, letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Sunday Brain Championship</div>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
       <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/winner.png" style={{ width:52, height:52, objectFit:'contain' }} />
       <div style={{ fontSize:32, fontWeight:900, color:'#fff' }}>Hall of Fame</div>
     </div>

      {winners.length === 0 ? (
        <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:14, fontWeight:700, marginTop:60 }}>
          No champions yet. First Sunday is June 1st.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {winners.map((w, i) => (
            <div key={w.id} style={{ background: i === 0 ? 'linear-gradient(135deg, #1a1500, #2D1A00)' : 'rgba(255,255,255,0.04)', borderRadius:20, padding:'20px', border: i === 0 ? '1px solid rgba(200,150,12,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:1, marginBottom:10 }}>
                {new Date(w.sunday_date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})} · {w.game.charAt(0).toUpperCase()+w.game.slice(1)}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                {i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅'}
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:18, fontWeight:900, color:'#fff' }}>{w.winner_name}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>{w.participants} participants</div>
                </div>
                <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{w.score}ms</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
