'use client'
import { getSpainToday } from '@/lib/dailyChallenge'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { calculateRank } from '@/lib/rankUtils'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

interface Props {
 ms: number
 pack: any
 worldRank: number | null
 lastFact: string
 onReset: () => void
}

export default function ResultOverlay({ ms, pack, worldRank, lastFact, onReset }: Props) {
 const { profile, recordGame } = usePlayer()
 const [rank, setRank] = useState<number | null>(null)
 const saved = useRef(false)

 useEffect(() => {
   if (saved.current) return
   if (!profile?.name) return
   saved.current = true
   const saveAndRank = async () => {
     const today = getSpainToday()
     const { data: dailyCheck } = await supabase.from('daily_challenges').select('pack_slug').eq('date', today).single()
     const isDaily = dailyCheck?.pack_slug === pack.slug
     await supabase.from('scores').insert({
       pack_id: pack.id,
       player_name: profile.name,
       time_ms: ms,
       moves: 0,
       is_daily: isDaily,
       play_date: today,
     })
     const r = await calculateRank(profile.name, pack.id, ms)
     setRank(r)
     recordGame(pack.slug, pack.pairs?.length || 6, r, ms)
   }
   saveAndRank()
 }, [profile?.name])

 const fmt = (ms: number) => {
   const m = Math.floor(ms / 60000)
   const s = Math.floor((ms % 60000) / 1000)
   const c = Math.floor((ms % 1000) / 10)
   return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
 }

 const diffLabel = pack.difficulty === 1 ? 'Easy' : pack.difficulty === 2 ? 'Medium' : 'Hard'
 const diffColor = pack.difficulty === 1 ? '#2E7D32' : pack.difficulty === 2 ? '#E65100' : '#B71C1C'
 const bgResult = pack.difficulty === 1 ? '#0D3320' : pack.difficulty === 2 ? '#2D1A00' : '#1A0000'

 return (
   <>
     <div style={{
       position: 'fixed', inset: 0,
       background: 'rgba(0,0,0,0.7)',
       backdropFilter: 'blur(10px)',
       zIndex: 100,
       display: 'flex', alignItems: 'center', justifyContent: 'center',
       padding: '20px 20px 80px',
     }}>
       <div style={{
         background: bgResult,
         borderRadius: 28,
         padding: '32px 24px',
         width: '100%', maxWidth: 360,
         textAlign: 'center',
         border: '1px solid rgba(255,255,255,0.08)',
       }}>
         <div style={{ fontSize:10, fontWeight:900, letterSpacing:3, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:8 }}>
           Your Time
         </div>
         <div style={{ fontSize:42, fontWeight:900, color:'#fff', letterSpacing:-1, lineHeight:1, marginBottom:6, fontFamily:'var(--font-nunito), sans-serif' }}>
           {fmt(ms)}
         </div>
         <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>
           <span style={{ color:diffColor, fontWeight:900, background:`${diffColor}20`, padding:'2px 8px', borderRadius:6, marginRight:6 }}>{diffLabel}</span>
           {pack.title}
         </div>

         <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px 20px', marginBottom:20 }}>
           <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>
             World Ranking
           </div>
           <div style={{ fontSize:36, fontWeight:900, color:GOLD, letterSpacing:-1 }}>
             {rank ? `#${rank}` : '...'}
           </div>
         </div>

         <button onClick={() => {
           const url = `${window.location.origin}/challenge?game=memory&score=${pack?.slug}&by=${encodeURIComponent(profile?.name || 'Someone')}`

         <div style={{ display:'flex', gap:10 }}>
           <button onClick={onReset} style={{
             flex:1, padding:'14px', borderRadius:14, border:'none',
             background:'rgba(255,255,255,0.08)', color:'#fff',
             fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer',
           }}>Play again</button>
           <Link href="/memory" style={{ flex:1, textDecoration:'none' }}>
             <button style={{
               width:'100%', padding:'14px', borderRadius:14, border:'none',
               background:GOLD, color:'#fff',
               fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer',
               boxShadow:`0 5px 0 ${GOLD}80`,
             }}>← Back</button>
           </Link>
         </div>
       </div>
     </div>
   </>
 )
}
