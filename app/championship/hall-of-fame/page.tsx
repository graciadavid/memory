'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GOLD = '#C8960C'

export default function HallOfFamePage() {
  const [hallOfFame, setHallOfFame] = useState<any[]>([])

  useEffect(() => {
    supabase.from('championship_hall_of_fame').select('*').order('sunday_date', { ascending: false })
      .then(({ data }: any) => setHallOfFame(data || []))
  }, [])

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <img src={`${BASE}/winner.png`} style={{ width:32, height:32, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>Hall of Fame</div>
          <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>All-time Sunday Champions</div>
        </div>
      </div>

      {hallOfFame.length === 0 && (
        <div style={{ background:'#252525', borderRadius:16, padding:'20px', textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:14, fontWeight:700 }}>
          No champions yet. First championship coming soon!
        </div>
      )}

      {hallOfFame.length > 0 && (
        <div style={{ background:'#252525', borderRadius:16, padding:'16px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'40px 1fr 1fr 70px', gap:8, marginBottom:8 }}>
            {['#','Game','Champion','Result'].map(h => (
              <div key={h} style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:1, textTransform:'uppercase' }}>{h}</div>
            ))}
          </div>
          {hallOfFame.map((h, i) => (
            <a key={h.id} href={`/championship/${String(hallOfFame.length - i).padStart(3,'0')}`} style={{ textDecoration:'none', display:'grid', gridTemplateColumns:'40px 1fr 1fr 70px', gap:8, alignItems:'center', marginBottom:10, padding:'8px', borderRadius:10, background:'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize:12, fontWeight:900, color:GOLD }}>{String(hallOfFame.length - i).padStart(3,'0')}</div>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'capitalize' }}>{h.game}</div>
              <div style={{ fontSize:13, fontWeight:900, color:'#fff' }}>{h.winner_name}</div>
              <div style={{ fontSize:13, fontWeight:900, color:GOLD }}>{h.score}ms</div>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
