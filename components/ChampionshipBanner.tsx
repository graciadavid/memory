'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export default function ChampionshipBanner() {
 const pathname = usePathname()
 const [blink, setBlink] = useState(true)

 useEffect(() => {
   const t = setInterval(() => setBlink(b => !b), 600)
   return () => clearInterval(t)
 }, [])

 if (pathname === '/' || pathname.startsWith('/championship')) return null

 return (
   <a href="/championship" style={{ textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', padding:'8px 16px', position:'sticky', top:0, zIndex:999 }}>
     <img src={`${BASE}/winner.png`} style={{ width:20, height:20, objectFit:'contain' }} />
     <span style={{ fontSize:12, fontWeight:900, color:'#000', letterSpacing:0.5 }}>Sunday Championship</span>
     <span style={{ fontSize:11, fontWeight:900, color: blink ? '#000' : 'rgba(0,0,0,0.3)', transition:'color 0.3s', letterSpacing:1 }}>● LIVE RANKING</span>
   </a>
 )
}
