'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const ITEMS_LEFT = [
  { href: '/', img: `${BASE}/nav-home.webp`, label: 'Home' },
]

const ITEMS_RIGHT = [
  { href: '/profile', img: `${BASE}/nav-profile.webp`, label: 'Profile' },
]

const PULSE_STYLE = `
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
        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <img src={item.img} alt={item.label} style={{
              width: 44, height: 44, objectFit: 'contain',
              opacity: path === item.href ? 1 : 0.5,
              transition: 'opacity 0.2s',
            }} />
          </div>
        </Link>
      ))}

      {/* My Plan — center button */}
      <Link href="/my-plan" style={{ textDecoration: 'none' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: path === '/my-plan' ? 'linear-gradient(135deg, #1B5E20, #4CAF50)' : 'linear-gradient(135deg, #2E7D32, #66BB6A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
            animation: 'brainPulse 2.5s ease-in-out infinite',
            marginBottom: 4,
          }}>
            <span style={{ fontSize: 24 }}>📋</span>
          </div>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#2E7D32', letterSpacing: 0.5 }}>MY PLAN</div>
        </div>
      </Link>

      {ITEMS_RIGHT.map(item => (
        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <img src={item.img} alt={item.label} style={{
              width: 44, height: 44, objectFit: 'contain',
              opacity: path === item.href ? 1 : 0.5,
              transition: 'opacity 0.2s',
            }} />
          </div>
        </Link>
      ))}
    </nav>
    </>
  )
}
