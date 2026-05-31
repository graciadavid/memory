'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export default function ChampionshipBanner() {
 const pathname = usePathname()
 const [blink, setBlink] = useState(true)
 const [ranking, setRanking] = useState<{name:string,ms:number}[]>([])

 useEffect(() => {
   const t = setInterval(() => setBlink(b => !b), 600)
   return () => clearInterval(t)
 }, [])

 useEffect(() => {
   supabase.from('championship_weeks').select('game, sunday_date').eq('active', true).single()
     .then(({data}:any) => {
       if (!data?.sunday_date) return
       const start = data.sunday_date + 'T00:00:00Z'
       const end = data.sunday_date + 'T23:59:59Z'
       supabase.from('precision_scores').select('player_name, difference_ms')
         .is('game_type', null).gte('created_at', start).lte('created_at', end)
         .then(({data: scores}:any) => {
           if (!scores) return
           const best: Record<string,number> = {}
           scores.forEach((s:any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
           const sorted = Object.entries(best).sort((a,b) => (a[1] as number)-(b[1] as number)).slice(0,3)
           setRanking(sorted.map(([name,ms]) => ({name, ms: ms as number})))
         })
     })
 }, [])

 if (pathname === '/' || pathname.startsWith('/championship')) return null

 return (
   <a href="/championship" style={{ textDecoration:'none', display:'block', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', padding:'6px 16px 8px', position:'sticky', top:0, zIndex:999 }}>
     <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom: ranking.length > 0 ? 4 : 0 }}>
       <img src={`${BASE}/winner.png`} style={{ width:18, height:18, objectFit:'contain' }} />
       <span style={{ fontSize:11, fontWeight:900, color:'#000', letterSpacing:0.5 }}>Sunday Championship</span>
       <span style={{ fontSize:10, fontWeight:900, color: blink ? '#000' : 'rgba(0,0,0,0.3)', transition:'color 0.3s', letterSpacing:1 }}>● LIVE</span>
     </div>
     {ranking.length > 0 && (
       <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
         {ranking.map((r, i) => (
           <div key={r.name} style={{ fontSize:10, fontWeight:800, color:'rgba(0,0,0,0.7)' }}>
             {i+1}. {r.name} {r.ms}ms
           </div>
         ))}
       </div>
     )}
   </a>
 )
}
