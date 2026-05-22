'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export default function StreakBadge() {
 const [streak, setStreak] = useState<number>(0)

 useEffect(() => {
   try {
     const stored = localStorage.getItem('memgenius_profile')
     if (!stored) return
     const { name } = JSON.parse(stored)
     if (!name) return
     supabase.from('profiles').select('streak').eq('player_name', name).single().then(({data}:any) => {
       if (data?.streak > 0) setStreak(data.streak)
     })
   } catch {}
 }, [])

 if (streak === 0) return null

 return (
   <div style={{
     position: 'fixed', top: 12, left: 12,
     display: 'flex', alignItems: 'center', gap: 4,
     background: 'rgba(255,109,0,0.15)',
     border: '1px solid rgba(255,109,0,0.3)',
     borderRadius: 20, padding: '4px 10px 4px 6px',
     zIndex: 999,
   }}>
     <img src={`${BASE}/streak.png`} style={{ width:20, height:20, objectFit:'contain' }} />
     <span style={{ fontSize:14, fontWeight:900, color:'#FF6D00', fontFamily:'var(--font-nunito), sans-serif' }}>{streak}</span>
   </div>
 )
}
