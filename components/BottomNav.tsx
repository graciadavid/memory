'use client'
import { usePathname } from 'next/navigation'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const ITEMS = [
  { href: '/', label: 'Home', icon: `${BASE}/nav-home.webp` },
  { href: '/training', label: 'Training', icon: `${BASE}/brain-logo.webp` },
  { href: '/championship', label: 'Championship', icon: `${BASE}/winner.png` },
  
  { href: '/more', label: 'More', icon: null },
]

export default function BottomNav() {
  const pathname = usePathname()

  

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: '#1A1A1A',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '8px 0 16px',
      zIndex: 50,
    }}>
      {ITEMS.map(item => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
        return (
          <a key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1 }}>
            {item.icon
              ? <img src={item.icon} style={{ width: 24, height: 24, objectFit: 'contain', opacity: active ? 1 : 0.4 }} />
              : <div style={{ fontSize: 18, fontWeight: 900, color: active ? '#fff' : 'rgba(255,255,255,0.4)', lineHeight: 1 }}>≡</div>
            }
            <div style={{ fontSize: 10, fontWeight: 800, color: active ? '#fff' : 'rgba(255,255,255,0.35)', letterSpacing: 0.5 }}>{item.label}</div>
          </a>
        )
      })}
    </nav>
  )
}
