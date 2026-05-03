'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const path = usePathname()

  const items = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/play', icon: '🧠', label: 'Play' },
    { href: '/ranking', icon: '🏆', label: 'Ranking' },
  ]

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'rgba(12,12,20,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid #1a1a2e',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '10px 0 24px',
      zIndex: 50,
    }}>
      {items.map(item => {
        const active = path === item.href
        return (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3,
              padding: '6px 24px',
            }}>
              <div style={{ fontSize: 22, filter: active ? 'none' : 'grayscale(1) opacity(0.4)' }}>
                {item.icon}
              </div>
              <div style={{
                fontSize: 10, fontWeight: 800,
                letterSpacing: 1, textTransform: 'uppercase',
                color: active ? '#FF4D6D' : '#333',
              }}>
                {item.label}
              </div>
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
