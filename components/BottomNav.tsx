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
      background: 'rgba(245,245,245,0.9)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid #e0e0e0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '8px 0 20px',
      zIndex: 50,
    }}>
      <Link href="/" style={{ textDecoration: 'none', opacity: path === '/' ? 1 : 0.3 }}>
        <div style={{ fontSize: 22 }}>🏠</div>
      </Link>
      <Link href="/ranking" style={{ textDecoration: 'none', opacity: path === '/ranking' ? 1 : 0.3 }}>
        <div style={{ fontSize: 22 }}>🏆</div>
      </Link>
    </nav>
  )
}
