'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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

  return (
    <Link href="/" style={{ textDecoration:'none', position:'fixed', top:12, right:12, zIndex:999, display:'flex', alignItems:'center', gap:5, background:'rgba(0,0,0,0.3)', borderRadius:20, padding:'4px 10px 4px 6px', backdropFilter:'blur(8px)' }}>
      <img src={`${BASE}/brain-logo.webp`} style={{ width:30, height:30, objectFit:'contain' }} />
      {streak > 0 && <span style={{ fontSize:16, fontWeight:900, color:'#FF6D00', fontFamily:'var(--font-nunito), sans-serif' }}>{streak}</span>}
    </Link>
  )
}
