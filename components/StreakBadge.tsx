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
    <Link href="/" style={{ textDecoration:'none', position:'fixed', top:12, right:12, zIndex:999, display:'flex', alignItems:'center', gap:6, background:'rgba(0,0,0,0.3)', borderRadius:20, padding:'6px 14px 6px 8px', backdropFilter:'blur(8px)' }}>
      <img src={`${BASE}/brain-logo.webp`} style={{ width:44, height:44, objectFit:'contain' }} />
      {streak > 0 && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', lineHeight:1 }}>
          <span style={{ fontSize:22, fontWeight:900, color:'#FF6D00', fontFamily:'var(--font-nunito), sans-serif' }}>{streak}</span>
          <span style={{ fontSize:9, fontWeight:800, color:'rgba(255,109,0,0.7)', fontFamily:'var(--font-nunito), sans-serif', letterSpacing:0.5, marginTop:1 }}>{streakLabel(streak)}</span>
        </div>
      )}
    </Link>
  )
}
