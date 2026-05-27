'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SaveButton() {
  const [show, setShow] = useState(false)
  const [blink, setBlink] = useState(true)
  const pathname = usePathname()

  const hideOn = ['/', '/profile', '/championship', '/brain-test', '/agility', '/knowledge', '/logic', '/memory-hub']

  useEffect(() => {
    const check = () => {
      const stored = localStorage.getItem('memgenius_profile')
      setShow(!stored)
    }
    check()
    window.addEventListener('storage', check)
    return () => window.removeEventListener('storage', check)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 800)
    return () => clearInterval(t)
  }, [])

  if (!show || hideOn.includes(pathname)) return null

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
