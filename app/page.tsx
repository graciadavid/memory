'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'

const GAMES: Record<string,string> = {
 memory:'/memory', digits:'/digits', sequence:'/sequence', nback:'/nback', blink:'/blink',
 stop:'/stop', f1:'/f1', pendulum:'/pendulum', ace:'/ace', 'letter-rain':'/letter-rain',
 flags:'/flags', capitals:'/capitals', countries:'/countries', blackjack:'/blackjack',
 sudoku:'/sudoku', mastermind:'/mastermind', '2048':'/2048', wordly:'/wordly',
}


function ChampionshipCountdown() {
 const [cd, setCd] = useState({ d:0, h:0, m:0, s:0 })
 useEffect(() => {
   const calc = () => {
     const now = new Date()
     const sunday = new Date('2026-06-01T00:00:00Z')
     const diff = Math.max(0, sunday.getTime() - now.getTime())
     const d = Math.floor(diff / 86400000)
     const h = Math.floor((diff % 86400000) / 3600000)
     const m = Math.floor((diff % 3600000) / 60000)
     const s = Math.floor((diff % 60000) / 1000)
     setCd({d,h,m,s})
   }
   calc()
   const t = setInterval(calc, 1000)
   return () => clearInterval(t)
 }, [])
 return (
   <div style={{ display:'flex', gap:8 }}>
     {[{v:cd.d,l:'D'},{v:cd.h,l:'H'},{v:cd.m,l:'M'},{v:cd.s,l:'S'}].map(({v,l}) => (
       <div key={l} style={{ flex:1, background:'rgba(0,0,0,0.2)', borderRadius:8, padding:'6px 4px', textAlign:'center' }}>
         <div style={{ fontSize:18, fontWeight:900, color:'#000' }}>{String(v).padStart(2,'0')}</div>
         <div style={{ fontSize:8, fontWeight:800, color:'rgba(0,0,0,0.4)', letterSpacing:1 }}>{l}</div>
       </div>
     ))}
   </div>
 )
}

export default function HomePage() {
 const [blink, setBlink] = useState(true)
  const [playerCount] = useState(() => Math.floor(Math.random() * (143 - 63 + 1)) + 63)
  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 600); return () => clearInterval(t) }, [])
  const [todayGame, setTodayGame] = useState('capitals')

 useEffect(() => {
   supabase.from('settings').select('value').eq('key','play_of_the_day').single()
     .then(({data}) => { if (data?.value) setTodayGame(data.value) })
 }, [])
 return (
   <main style={{
     height: '100dvh',
     background: '#1C1C1E',
     fontFamily: 'var(--font-nunito), sans-serif',
     maxWidth: 430,
     margin: '0 auto',
     display: 'flex',
     flexDirection: 'column',
     alignItems: 'center',
     justifyContent: 'center',
     padding: '0 32px',
     gap: 40,
   }}>
     {/* Logo */}
     <div style={{ textAlign: 'center' }}>
       <img src={`${BASE}/logomemgenius.webp`} alt="MemGenius" style={{ width: '100%', maxWidth: 160, objectFit: 'contain' }} />
     </div>

     {/* Championship Banner */}
     <a href='/championship' style={{ textDecoration:'none', width:'100%' }}>
       <div style={{ background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', borderRadius:24, padding:'20px 22px', boxShadow:'0 8px 0 rgba(100,70,0,0.5)' }}>
         <div style={{ fontSize:10, fontWeight:800, color:'rgba(0,0,0,0.5)', letterSpacing:3, textTransform:'uppercase', marginBottom:4 }}>Sunday Brain Championship</div>
         <div style={{ fontSize:22, fontWeight:900, color:'#000', marginBottom:10, display:'flex', alignItems:'center', gap:10 }}><img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/winner.png" style={{ width:32, height:32, objectFit:'contain' }} />June 1st — Stop</div>
         <ChampionshipCountdown />
       </div>
     </a>

     {/* Train button */}
     <a href='/stop' style={{ textDecoration: 'none', width: '100%' }}>
       <div style={{ background: GREEN, borderRadius: 24, padding: '20px', textAlign: 'center', boxShadow: '0 10px 0 #1B5E2070' }}>
         <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Train for the championship</div>
         <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>Play Stop →</div>
         <div style={{ fontSize: 12, fontWeight: 900, color: blink ? '#69F0AE' : 'transparent', marginTop: 6, transition: 'color 0.1s' }}>● {playerCount} players training now</div>
       </div>
     </a>

     <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', fontWeight: 700 }}>Free · No login required</div>
   </main>
 )
}
