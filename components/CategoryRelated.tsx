import Link from 'next/link'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const CATS = [
 { label: 'Memory', href: '/memory-hub', color: '#C62828', icon: `${BASE}/brain-logo.webp` },
 { label: 'Agility', href: '/agility', color: '#F9A825', icon: `${BASE}/precision.png` },
 { label: 'Knowledge', href: '/knowledge', color: '#00796B', icon: `${BASE}/population.png` },
 { label: 'Logic', href: '/logic', color: '#E65100', icon: `${BASE}/target.png` },
]

export default function CategoryRelated({ current }: { current: string }) {
 const others = CATS.filter(c => c.label !== current)
 return (
   <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
     <div style={{ fontSize: 16, fontWeight: 900, color: '#4A2C0A', marginBottom: 6 }}>Your brain also needs to train these areas</div>
     <div style={{ fontSize: 13, color: '#4A2C0A80', marginBottom: 16, lineHeight: 1.6 }}>A complete brain workout covers all four cognitive categories. Focusing on just one leaves others undertrained.</div>
     <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
       {others.map(cat => (
         <Link key={cat.label} href={cat.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #4A2C0A10' }}>
           <img src={cat.icon} style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
           <div>
             <div style={{ fontSize: 15, fontWeight: 900, color: cat.color }}>{cat.label}</div>
             <div style={{ fontSize: 12, color: '#4A2C0A60', fontWeight: 700 }}>Train your {cat.label.toLowerCase()} skills →</div>
           </div>
         </Link>
       ))}
     </div>
   </div>
 )
}
