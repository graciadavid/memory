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
          <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/myplan.png" alt="" style={{ width: 44, height: 44, objectFit: 'contain', opacity: path === '/my-plan' ? 1 : 0.7 }} />
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
