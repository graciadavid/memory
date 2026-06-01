'use client'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const CATEGORIES = [
 { label: 'Brain Memory', icon: `${BASE}/brain-logo.webp`, href: '/memory-hub' },
 { label: 'Brain Agility', icon: `${BASE}/precision.png`, href: '/agility' },
 { label: 'Brain Knowledge', icon: `${BASE}/population.png`, href: '/knowledge' },
 { label: 'Brain Logic', icon: `${BASE}/target.png`, href: '/logic' },
]

export default function TrainingPage() {
 return (
   <main style={{ minHeight: '100dvh', background: '#1A1A1A', padding: '16px 16px 100px' }}>
     <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 4 }}>MemGenius Training</div>
     <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 20 }}>Choose a category</div>

     <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
       {CATEGORIES.map(cat => (
         <a key={cat.label} href={cat.href} style={{ textDecoration: 'none' }}>
           <div style={{ background: '#252525', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
             <div style={{ width: 80, height: 80, flexShrink: 0, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <img src={cat.icon} style={{ width: 44, height: 44, objectFit: 'contain' }} />
             </div>
             <div style={{ padding: '14px 16px', flex: 1 }}>
               <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>{cat.label}</div>
             </div>
             <div style={{ paddingRight: 16, fontSize: 18, color: 'rgba(255,255,255,0.3)' }}>›</div>
           </div>
         </a>
       ))}
     </div>
   </main>
 )
}
