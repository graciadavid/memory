'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const ITEMS_LEFT = [
  { href: '/', img: `${BASE}/nav-home.webp`, label: 'Home' },
  { href: '/ranking', img: `${BASE}/nav-trophy.webp`, label: 'Ranking' },
]

const ITEMS_RIGHT = [
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
  @keyframes brainPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
`

export default function BottomNav() {
  const path = usePathname()

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
      {ITEMS_LEFT.map(item => (
        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={item.href === '/' ? askNotifications : undefined}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <img src={item.img} alt={item.label} style={{
              width: 44, height: 44, objectFit: 'contain',
              opacity: path === item.href ? 1 : 0.6,
              transition: 'opacity 0.2s',
            }} />
          </div>
        </Link>
      ))}

      {/* Brain Age Test - center button */}
      <Link href="/brain-test" style={{ textDecoration: 'none' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1B5E20, #4CAF50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
          animation: 'brainPulse 2.5s ease-in-out infinite',
          marginBottom: 4,
        }}>
          <img src={`${BASE}/brain-logo.webp`} alt="Brain Test" style={{ width: 36, height: 36, objectFit: 'contain' }} />
        </div>
      </Link>

      {ITEMS_RIGHT.map(item => (
        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <img src={item.img} alt={item.label} style={{
              width: 44, height: 44, objectFit: 'contain',
              opacity: path === item.href ? 1 : 0.6,
              transition: 'opacity 0.2s',
              animation: item.href === '/profile' ? 'profilePulse 2.5s ease-in-out infinite' : undefined,
            }} />
          </div>
        </Link>
      ))}
    </nav>
    </>
  )
}
