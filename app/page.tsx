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

export default function HomePage() {
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
     <div style={{ textAlign: 'center' }}>
       <img src={`${BASE}/logomemgenius.webp`} alt="MemGenius" style={{ width: '100%', maxWidth: 280, objectFit: 'contain', marginBottom: 16 }} />
       <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>Train your brain daily.</div>
       <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>Compete with the world.</div>
     </div>

     <a href={GAMES[todayGame] || '/stop'} style={{ textDecoration: 'none', width: '100%' }}>
       <div style={{ background: GREEN, borderRadius: 24, padding: '22px', textAlign: 'center', boxShadow: '0 10px 0 #1B5E2070' }}>
         <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Today's game</div>
         <div style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>{todayGame.charAt(0).toUpperCase() + todayGame.slice(1).replace('-',' ')} →</div>
       </div>
     </a>

     <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', fontWeight: 700 }}>Free · No login required</div>
   </main>
 )
}
