'use client'
const COLOR = '#E65100'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const GAMES = [
  { label: 'Sudoku', icon: `${BASE}/sudoku.png`, href: '/sudoku', desc: 'Fill the grid with logic' },
  { label: 'Mastermind', icon: `${BASE}/mastermind.png`, href: '/mastermind', desc: 'Crack the color code' },
  { label: '2048', icon: `${BASE}/2048.png`, href: '/2048', desc: 'Merge tiles to reach 2048' },
  { label: 'Wordly', icon: `${BASE}/wordly.png`, href: '/wordly', desc: 'Guess the hidden word' },
]

export default function LogicPage() {
  return (
    <main style={{ minHeight:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>
      <div style={{ fontSize:11, fontWeight:800, color:COLOR, letterSpacing:3, textTransform:'uppercase', marginBottom:4 }}>Category</div>
      <div style={{ fontSize:32, fontWeight:900, color:'#fff', marginBottom:8 }}>Logic</div>
      <div style={{ fontSize:14, color:'rgba(255,255,255,0.35)', fontWeight:700, marginBottom:32 }}>Challenge your reasoning and strategy</div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {GAMES.map(g => (
          <a key={g.label} href={g.href} style={{ textDecoration:'none' }}>
            <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, border:'1px solid rgba(255,255,255,0.08)' }}>
              <img src={g.icon} style={{ width:52, height:52, objectFit:'contain', flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:17, fontWeight:900, color:'#fff', marginBottom:4 }}>{g.label}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{g.desc}</div>
              </div>
              <div style={{ fontSize:18, color:'rgba(255,255,255,0.2)' }}>→</div>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
