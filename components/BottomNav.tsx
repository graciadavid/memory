'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const ITEMS = [
  { href: '/', img: `${BASE}/nav-home.webp`, label: 'Home' },
  { href: '/ranking', img: `${BASE}/nav-trophy.webp`, label: 'Ranking' },
  { href: '/groups', img: `${BASE}/groups.png`, label: 'Groups' },
  { href: '/profile', img: `${BASE}/nav-profile.webp`, label: 'Profile' },
]

function askNotifications() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem('notif_asked')) return
  localStorage.setItem('notif_asked', '1')
  const w = window as any
  if (w.OneSignalDeferred) {
    w.OneSignalDeferred.push(function(OneSignal: any) {
      OneSignal.Slidedown.promptPush()
    })
  }
}

const PULSE_STYLE = `
  @keyframes profilePulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.12); opacity: 0.75; }
  }
`

export default function BottomNav() {
  const path = usePathname()
  const [hasProfile] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('memgenius_profile')
    return !!(stored && JSON.parse(stored).name)
  })

  // Hide bottom nav on home if no profile (onboarding)
  if (path === '/' && !hasProfile) return null

  return (
    <>
    <style>{PULSE_STYLE}</style>
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'rgba(250,247,242,0.97)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(74,44,10,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '4px 0 8px',
      zIndex: 50,
    }}>
      {ITEMS.map(item => {
        const isActive = path === item.href
        return (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={item.href === '/' ? askNotifications : undefined}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <img
                src={item.img!}
                alt={item.label}
                style={{ width: 44, height: 44, objectFit: 'contain', opacity: 1, transition: 'opacity 0.2s', animation: item.href === '/profile' ? 'profilePulse 2.5s ease-in-out infinite' : undefined }}
              />
            </div>
          </Link>
        )
      })}
    </nav>
    </>
  )
}
