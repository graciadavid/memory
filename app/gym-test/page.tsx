'use client'

const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

const CATS = [
 { label: 'Memory', color: '#C62828', games: [
   { label: 'Memory', icon: '/icons/memory.webp', unlocked: true, href: '/memory' },
   { label: 'Digits', icon: '/icons/digits.webp', unlocked: false, href: '/digits' },
   { label: 'Simon Says', icon: '/icons/sequence.webp', unlocked: false, href: '/sequence' },
   { label: 'N-Back', icon: '/icons/memory.webp', unlocked: false, href: '/nback' },
 ]},
 { label: 'Agility', color: '#4A148C', games: [
   { label: 'Stop', icon: '/icons/precision.png', unlocked: true, href: '/precision/stopwatch' },
   { label: 'F1', icon: '/icons/f1.png', unlocked: false, href: '/precision/formula1' },
   { label: 'Pendulum', icon: '/icons/pendulum.png', unlocked: false, href: '/precision/pendulum' },
   { label: 'Ace', icon: '/icons/padel.png', unlocked: false, href: '/ace' },
 ]},
 { label: 'Knowledge', color: '#00796B', games: [
   { label: 'Flags', icon: '/icons/flags.webp', unlocked: true, href: '/flags' },
   { label: 'Versus Pop', icon: '/icons/flags.webp', unlocked: false, href: '/versus/population' },
   { label: 'Versus Area', icon: '/icons/flags.webp', unlocked: false, href: '/versus/area' },
   { label: 'GeoShape', icon: '/icons/flags.webp', unlocked: false, href: '/geoshape' },
 ]},
 { label: 'Logic', color: '#E65100', games: [
   { label: 'Sudoku', icon: '/icons/memory.webp', unlocked: true, href: '/sudoku' },
   { label: 'Mastermind', icon: '/icons/memory.webp', unlocked: false, href: '/mastermind' },
   { label: '2048', icon: '/icons/memory.webp', unlocked: false, href: '/2048' },
   { label: 'Wordly', icon: '/icons/memory.webp', unlocked: false, href: '/wordly' },
 ]},
]

export default function GymTestPage() {
 return (
   <main style={{ height: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
     <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
       <img src="/icons/brain-logo.webp" style={{ width: 36, height: 36 }} />
       <div style={{ fontSize: 20, fontWeight: 900, color: BROWN }}>MemGenius</div>
     </div>
     <div style={{ flex: 1, padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
       {CATS.map(cat => (
         <div key={cat.label}>
           <div style={{ fontSize: 12, fontWeight: 900, color: BROWN, marginBottom: 6 }}>{cat.label}</div>
           <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
             {cat.games.map(g => g.unlocked ? (
               <a key={g.label} href={g.href} style={{ textDecoration: 'none', flexShrink: 0 }}>
                 <div style={{ background: cat.color, borderRadius: 14, padding: '10px', width: 95, height: 105, display: 'flex', flexDirection: 'column', boxShadow: `0 4px 0 ${cat.color}60` }}>
                   <div style={{ fontWeight: 900, color: '#fff', fontSize: 10, marginBottom: 4 }}>{g.label}</div>
                   <img src={g.icon} style={{ flex: 1, width: '100%', objectFit: 'contain' }} />
                 </div>
               </a>
             ) : (
               <div key={g.label} style={{ background: cat.color, borderRadius: 14, padding: '10px', width: 95, height: 105, flexShrink: 0, display: 'flex', flexDirection: 'column', opacity: 0.25 }}>
                 <div style={{ fontWeight: 900, color: '#fff', fontSize: 10, marginBottom: 4 }}>{g.label}</div>
                 <img src={g.icon} style={{ flex: 1, width: '100%', objectFit: 'contain' }} />
               </div>
             ))}
           </div>
         </div>
       ))}
     </div>
   </main>
 )
}
