import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'World Capitals Quiz — Free Online | MemGenius',
  description: 'Test your knowledge of world capitals. How many can you name?',
}

export default function WorldCapitalsQuizPage() {
  return (
    <main style={{ maxWidth:680, margin:'0 auto', padding:'40px 24px 100px', fontFamily:'var(--font-nunito),sans-serif', background:'#1A1A1A', minHeight:'100dvh', color:'#fff' }}>
      <h1 style={{ fontSize:28, fontWeight:900, marginBottom:12 }}>World Capitals Quiz</h1>
      <p style={{ fontSize:15, lineHeight:1.8, color:'rgba(255,255,255,0.6)', marginBottom:32 }}>What is the capital of Australia? Most people say Sydney. It is Canberra. That is the kind of thing this quiz does to you.</p>

      <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40 }}>
        {[
          { href:'/capitals', title:'Capitals Quiz', desc:'Name the capital of each country. 195 countries, world rankings.' },
          { href:'/flags', title:'Flags Quiz', desc:'Identify countries by their flags.' },
          { href:'/countries', title:'Countries by Shape', desc:'Identify countries from their silhouettes.' },
        ].map(g => (
          <Link key={g.href} href={g.href} style={{ textDecoration:'none', background:'#252525', borderRadius:14, padding:'16px 20px', display:'block' }}>
            <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:4 }}>{g.title}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{g.desc}</div>
            <div style={{ fontSize:12, fontWeight:800, color:'#2E7D32', marginTop:6 }}>Play free →</div>
          </Link>
        ))}
      </div>

      <Link href="/capitals" style={{ textDecoration:'none', display:'block', background:'#2E7D32', borderRadius:14, padding:'18px', textAlign:'center', fontSize:16, fontWeight:900, color:'#fff' }}>
        Start the capitals quiz →
      </Link>
    </main>
  )
}
