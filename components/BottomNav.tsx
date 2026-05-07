'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const ITEMS = [
  { href: '/', img: `${BASE}/nav-home.png`, label: 'Home' },
  { href: '/ranking', img: `${BASE}/nav-trophy.png`, label: 'Ranking' },
  { href: '/profile', img: `${BASE}/nav-profile.png`, label: 'Profile' },
]

export default function BottomNav() {
  const path = usePathname()

  return (
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
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <img
                src={item.img}
                alt={item.label}
                style={{
                  width: 44, height: 44,
                  objectFit: 'contain',
                  opacity: 1,
                  transition: 'opacity 0.2s',
                }}
              />
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
