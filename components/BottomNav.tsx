'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const path = usePathname()
  // Show bottom nav always

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'rgba(250,247,242,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(74,44,10,0.08)',
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
          <div style={{ fontSize: 22 }}>{item.icon}</div>
        </Link>
      ))}
    </nav>
  )
}
