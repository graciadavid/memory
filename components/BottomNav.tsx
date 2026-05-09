'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const ITEMS = [
  { href: '/', img: `${BASE}/nav-home.webp`, label: 'Home', emoji: null },
  { href: '/ranking', img: `${BASE}/nav-trophy.webp`, label: 'Ranking', emoji: null },
  { href: '/groups', img: null, label: 'Groups', emoji: '👥' },
  { href: '/profile', img: `${BASE}/nav-profile.webp`, label: 'Profile', emoji: null },
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
              {item.emoji ? (
                <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{item.emoji}</div>
              ) : (
                <img
                  src={item.img!}
                  alt={item.label}
                  style={{ width: 44, height: 44, objectFit: 'contain', opacity: 1, transition: 'opacity 0.2s' }}
                />
              )}
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
