'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

function streakLabel(n: number): string {
 if (n >= 100) return 'MemGenius'
 if (n >= 90) return 'Grandmaster'
 if (n >= 80) return 'Master'
 if (n >= 70) return 'Legend'
 if (n >= 60) return 'Champion'
 if (n >= 50) return 'Elite'
 if (n >= 40) return 'Relentless'
 if (n >= 30) return 'Focused'
 if (n >= 20) return 'Dedicated'
 if (n >= 10) return 'Consistent'
 return 'Starter'
}

export default function StreakBadge() {
 const [streak, setStreak] = useState<number>(0)
 const [ready, setReady] = useState(false)

 useEffect(() => {
   try {
     const stored = localStorage.getItem('memgenius_profile')
     if (!stored) { setReady(true); return }
     const { name } = JSON.parse(stored)
     if (!name) { setReady(true); return }
     supabase.from('profiles').select('streak').eq('player_name', name).single().then(({data}:any) => {
       if (data?.streak > 0) setStreak(data.streak)
       setReady(true)
     })
   } catch { setReady(true) }
 }, [])

 if (!ready) return null

 return (
   <Link href="/" style={{ textDecoration:'none', position:'fixed', top:10, right:10, zIndex:999, display:'flex', alignItems:'center', gap:5, background:'rgba(0,0,0,0.35)', borderRadius:18, padding:'4px 8px 4px 4px', backdropFilter:'blur(10px)' }}>
     <img src={`${BASE}/brain-logo.webp`} style={{ width:28, height:28, objectFit:'contain', flexShrink:0 }} />
     {streak > 0 && (
       <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
         <span style={{ fontSize:26, fontWeight:900, color:'#FF6D00', fontFamily:'var(--font-nunito), sans-serif', lineHeight:1 }}>{streak}</span>
         <span style={{ fontSize:9, fontWeight:800, color:'rgba(255,109,0,0.65)', fontFamily:'var(--font-nunito), sans-serif', letterSpacing:0.5, lineHeight:1, marginTop:2 }}>{streakLabel(streak).toUpperCase()}</span>
       </div>
     )}
   </Link>
 )
}
