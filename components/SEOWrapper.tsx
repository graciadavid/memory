'use client'
import { useState, useEffect } from 'react'

export default function SEOWrapper({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onStart = () => setVisible(false)
    const onResult = () => setVisible(true)
    window.addEventListener('gameStart', onStart)
    window.addEventListener('gameResult', onResult)
    return () => {
      window.removeEventListener('gameStart', onStart)
      window.removeEventListener('gameResult', onResult)
    }
  }, [])

  if (!visible) return null
  return <>{children}</>
}
