'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const path = usePathname()
  if (path.startsWith('/play/')) return null

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'rgba(15,15,25,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '8px 0 22px',
      zIndex: 50,
    }}>
      {[
        { href: '/', icon: '🏠' },
        { href: '/ranking', icon: '🏆' },
        { href: '/profile', icon: '👤' },
      ].map(item => (
        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
          <div style={{
            fontSize: 22,
            filter: path === item.href ? 'none' : 'grayscale(0.3) brightness(0.7)',
            transition: 'filter 0.2s',
          }}>
            {item.icon}
          </div>
        </Link>
      ))}
    </nav>
  )
}
