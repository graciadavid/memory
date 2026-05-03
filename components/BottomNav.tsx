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
      background: 'rgba(30,30,30,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid #333',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '6px 0 16px',
      zIndex: 50,
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontSize: 22 }}>🏠</div>
      </Link>
      <Link href="/ranking" style={{ textDecoration: 'none' }}>
        <div style={{ fontSize: 22 }}>🏆</div>
      </Link>
      <Link href="/profile" style={{ textDecoration: 'none' }}>
        <div style={{ fontSize: 22 }}>👤</div>
      </Link>
    </nav>
  )
}
