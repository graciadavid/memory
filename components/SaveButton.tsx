'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const GAME_PATHS = [
  '/stop', '/f1', '/pendulum', '/ace',
  '/flags', '/higherorlower/population', '/higherorlower/area', '/countries',
  '/digits', '/simon', '/nback', '/memory',
  '/sudoku', '/mastermind', '/2048', '/wordly',
  '/blackjack', '/tetris', '/poke', '/blink',
  '/capitals', '/letter-rain', '/play',
]

export default function SaveButton() {
  const [hasProfile, setHasProfile] = useState(true)
  const [isResult, setIsResult] = useState(false)
  const pathname = usePathname()

  const isGamePage = GAME_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))

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

  useEffect(() => { setIsResult(false) }, [pathname])

  if (hasProfile || !isGamePage || !isResult) return null

  return (
    <div style={{ position:'fixed', bottom:70, left:0, right:0, zIndex:999, padding:'0 16px 8px', maxWidth:430, margin:'0 auto' }}>
      <a href="/profile" style={{ textDecoration:'none', display:'block' }}>
        <div style={{
          background:'#D32F2F',
          borderRadius:16,
          padding:'16px',
          textAlign:'center',
          boxShadow:'0 -4px 20px rgba(211,47,47,0.4), 0 4px 0 #B71C1C',
        }}>
          <div style={{ fontSize:16, fontWeight:900, color:'#fff' }}>💾 Save your results</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', fontWeight:700, marginTop:2 }}>Free · Create your profile</div>
        </div>
      </a>
    </div>
  )
}
