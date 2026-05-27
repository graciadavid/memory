'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const GAME_PATHS = [
 '/stop', '/f1', '/pendulum', '/ace',
 '/flags', '/higherorlower/population', '/higherorlower/area', '/countries',
 '/digits', '/simon', '/nback', '/memory',
 '/sudoku', '/mastermind', '/2048', '/wordly',
 '/blackjack', '/tetris', '/poke', '/blink',
 '/capitals', '/letter-rain', '/play', '/play/[slug]',
]

export default function SaveButton() {
 const [hasProfile, setHasProfile] = useState(true)
 const [isResult, setIsResult] = useState(false)
 const [blink, setBlink] = useState(true)
 const pathname = usePathname()

 const isGamePage = GAME_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))

 useEffect(() => {
   const stored = localStorage.getItem('memgenius_profile')
   setHasProfile(!!stored)

   const onResult = () => setIsResult(true)
   const onStart = () => setIsResult(false)

   window.addEventListener('gameResult', onResult)
   window.addEventListener('gameStart', onStart)
   window.addEventListener('storage', () => {
     const s = localStorage.getItem('memgenius_profile')
     setHasProfile(!!s)
   })

   return () => {
     window.removeEventListener('gameResult', onResult)
     window.removeEventListener('gameStart', onStart)
   }
 }, [pathname])

 useEffect(() => {
   setIsResult(false)
 }, [pathname])

 useEffect(() => {
   const t = setInterval(() => setBlink(b => !b), 800)
   return () => clearInterval(t)
 }, [])

 if (hasProfile || !isGamePage || !isResult) return null

 return (
   <a href="/profile" style={{ textDecoration:'none', position:'fixed', bottom:80, right:16, zIndex:999 }}>
     <div style={{
       background: blink ? '#C8960C' : '#A07010',
       borderRadius:20,
       padding:'10px 16px',
       display:'flex',
       alignItems:'center',
       gap:8,
       boxShadow:'0 4px 20px rgba(200,150,12,0.5)',
       transition:'background 0.4s'
     }}>
       <div style={{ fontSize:16 }}>💾</div>
       <div style={{ fontSize:13, fontWeight:900, color:'#000' }}>Save results</div>
     </div>
   </a>
 )
}
