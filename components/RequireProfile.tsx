'use client'
import { useState, useEffect } from 'react'
import AuthModal from './AuthModal'

export default function RequireProfile({ children }: { children: React.ReactNode }) {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    setHasProfile(!!(stored && JSON.parse(stored).name))
  }, [])

  const handleSuccess = () => {
    setHasProfile(true)
    window.location.reload()
  }

  if (hasProfile === null) return null
  if (hasProfile) return <>{children}</>

  return (
    <>
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <AuthModal
          onSuccess={handleSuccess}
          onSkip={() => setHasProfile(true)}
          title="Create your profile"
          subtitle="Save your scores and compete worldwide"
        />
      </div>
      {children}
    </>
  )
}
