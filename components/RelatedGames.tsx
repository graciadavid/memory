import Link from 'next/link'

const BROWN = '#4A2C0A'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const CATEGORIES = {
 memory: {
   label: 'Memory Games',
   color: '#E91E63',
   games: [
     { href: '/memory', img: `${BASE}/brain-logo.webp`, label: 'Memory', desc: 'Match connected concepts' },
     { href: '/digits', img: `${BASE}/digits.webp`, label: 'Digits', desc: 'Remember the sequence' },
     { href: '/sequence', img: `${BASE}/sequence.webp`, label: 'Simon Says', desc: 'Repeat the pattern' },
     { href: '/nback', img: `${BASE}/nback.png`, label: 'N-Back', desc: 'Same color as before?' },
   ],
 },
 agility: {
   label: 'Agility Games',
   color: '#FF6F00',
   games: [
     { href: '/precision/stopwatch', img: `${BASE}/precision.png`, label: 'Stop', desc: 'Stop at 5 seconds' },
     { href: '/f1', img: `${BASE}/f1.png`, label: 'F1 Reaction', desc: 'React to the lights' },
     { href: '/precision/pendulum', img: `${BASE}/pendulum.png`, label: 'Pendulum', desc: 'Stop at the center' },
     { href: '/ace', img: `${BASE}/padel.png`, label: 'Ace', desc: 'Hit the ball' },
   ],
 },
 knowledge: {
   label: 'Knowledge Games',
   color: '#1565C0',
   games: [
     { href: '/flags', img: `${BASE}/flags.png`, label: 'Flags', desc: 'Identify country flags' },
     { href: '/higherorlower/population', img: `${BASE}/population.png`, label: 'Higher or Lower Population', desc: 'Which country has more people?' },
     { href: '/higherorlower/area', img: `${BASE}/area.png`, label: 'Higher or Lower Area', desc: 'Which country is bigger?' },
     { href: '/countries', img: `${BASE}/mapamundi.png`, label: 'GeoShape', desc: 'Guess by shape' },
   ],
 },
 logic: {
   label: 'Logic Games',
   color: '#6A1B9A',
   games: [
     { href: '/sudoku', img: `${BASE}/sudoku.png`, label: 'Sudoku', desc: 'Solve the puzzle' },
     { href: '/wordly', img: `${BASE}/wordly.png`, label: 'Wordly', desc: 'Guess the word' },
     { href: '/mastermind', img: `${BASE}/mastermind.png`, label: 'Mastermind', desc: 'Crack the code' },
     { href: '/2048', img: `${BASE}/2048.png`, label: '2048', desc: 'Reach the tile' },
   ],
 },
}

export default function RelatedGames({ category, current }: { category: keyof typeof CATEGORIES, current: string }) {
 const cat = CATEGORIES[category]
 const games = cat.games.filter(g => g.label !== current)

 return (
   <div style={{ marginTop: 32 }}>
     <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
       More {cat.label}
     </div>
     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
       {games.map(g => (
         <Link key={g.href} href={g.href} style={{ textDecoration: 'none' }}>
           <div style={{ background: '#fff', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #4A2C0A08', boxShadow: '0 2px 8px #4A2C0A06' }}>
             <img src={g.img} alt={g.label} style={{ width: 40, height: 40, objectFit: 'contain', flexShrink: 0 }} />
             <div style={{ flex: 1 }}>
               <div style={{ fontSize: 14, fontWeight: 900, color: BROWN }}>{g.label}</div>
               <div style={{ fontSize: 12, color: `${BROWN}50`, fontWeight: 700 }}>{g.desc}</div>
             </div>
             <div style={{ fontSize: 16, color: `${BROWN}30` }}>→</div>
           </div>
         </Link>
       ))}
     </div>
   </div>
 )
}
