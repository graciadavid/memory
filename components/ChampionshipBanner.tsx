'use client'
import { usePathname } from 'next/navigation'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export default function ChampionshipBanner() {
 const pathname = usePathname()
 if (pathname === '/') return null

 return (
   <a href="/championship" style={{ textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', padding:'8px 16px', position:'sticky', top:0, zIndex:999 }}>
     <img src={`${BASE}/winner.png`} style={{ width:20, height:20, objectFit:'contain' }} />
     <span style={{ fontSize:12, fontWeight:900, color:'#000', letterSpacing:0.5 }}>Sunday Championship — Stop — June 1st</span>
     <span style={{ fontSize:11, fontWeight:800, color:'rgba(0,0,0,0.5)', background:'rgba(0,0,0,0.15)', borderRadius:20, padding:'2px 8px' }}>Join →</span>
   </a>
 )
}
