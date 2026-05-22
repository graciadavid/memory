'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BROWN = '#4A2C0A'

const ITEMS = [
 { href: '/memory-hub', label: 'Memory', color: '#C62828', icon: '🧠' },
 { href: '/agility', label: 'Agility', color: '#4A148C', icon: '⚡' },
 { href: '/knowledge', label: 'Knowledge', color: '#00796B', icon: '🌍' },
 { href: '/logic', label: 'Logic', color: '#E65100', icon: '🔷' },
 { href: '/profile', label: 'Profile', color: BROWN, icon: '👤' },
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
     padding: '6px 0 10px',
     zIndex: 50,
   }}>
     {ITEMS.map(item => {
       const active = path.startsWith(item.href)
       return (
         <Link key={item.href} href={item.href} style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
           <div style={{ fontSize: 22, opacity: active ? 1 : 0.35 }}>{item.icon}</div>
           <div style={{ fontSize: 9, fontWeight: 900, color: active ? item.color : `${BROWN}50`, letterSpacing: 0.5, textTransform: 'uppercase' }}>{item.label}</div>
         </Link>
       )
     })}
   </nav>
 )
}
