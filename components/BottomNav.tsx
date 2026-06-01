'use client'
import Link from 'next/link'
import RegisterBar from '@/components/RegisterBar'
import RegisterBar from '@/components/RegisterBar'
import { usePathname } from 'next/navigation'

const BROWN = '#4A2C0A'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const ITEMS = [
  { href: '/memory-hub', label: 'Memory', color: '#C62828', icon: `${BASE}/brain-logo.webp` },
  { href: '/agility', label: 'Agility', color: '#4A148C', icon: `${BASE}/precision.png` },
  { href: '/knowledge', label: 'Knowledge', color: '#00796B', icon: `${BASE}/population.png` },
  { href: '/logic', label: 'Logic', color: '#E65100', icon: `${BASE}/target.png` },
  { href: '/profile', label: 'Profile', color: BROWN, icon: `${BASE}/nav-profile.webp` },
]

export default function BottomNav() {
  const path = usePathname()

  return (
    <>
    <RegisterBar />
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'rgba(250,247,242,0.97)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(74,44,10,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '6px 0 10px',
      zIndex: 50,
    }}>
      {ITEMS.map(item => {
        const active = path === item.href || path.startsWith(item.href + '/')
        return (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <img src={item.icon} alt={item.label} style={{ width: 28, height: 28, objectFit: 'contain', opacity: active ? 1 : 0.35 }} />
            <div style={{ fontSize: 9, fontWeight: 900, color: active ? item.color : `${BROWN}50`, letterSpacing: 0.5, textTransform: 'uppercase' }}>{item.label}</div>
          </Link>
        )
      })}
    </nav>
    </>
  )
}
