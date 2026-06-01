import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Flag Quiz — Free Online | MemGenius',
  description: 'Test your knowledge of world flags. Identify countries by their flags.',
}

export default function FlagQuizPage() {
  return (
    <main style={{ maxWidth:680, margin:'0 auto', padding:'40px 24px 100px', fontFamily:'var(--font-nunito),sans-serif', background:'#1A1A1A', minHeight:'100dvh', color:'#fff' }}>
      <h1 style={{ fontSize:28, fontWeight:900, marginBottom:12 }}>Flag Quiz</h1>
      <p style={{ fontSize:15, lineHeight:1.8, color:'rgba(255,255,255,0.6)', marginBottom:32 }}>A flag appears. Tap the right country. Sounds simple. Most people fail before 10 in a row. There are 195 countries and a surprising number of flags that look almost identical.</p>

      <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40 }}>
        {[
          { href:'/flags', title:'Flags', desc:'Identify countries by their flag. 195 countries, world rankings.' },
          { href:'/capitals', title:'Capitals Quiz', desc:'Name the capital city of each country.' },
          { href:'/countries', title:'Countries by Shape', desc:'Identify a country from its silhouette.' },
        ].map(g => (
          <Link key={g.href} href={g.href} style={{ textDecoration:'none', background:'#252525', borderRadius:14, padding:'16px 20px', display:'block' }}>
            <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:4 }}>{g.title}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{g.desc}</div>
            <div style={{ fontSize:12, fontWeight:800, color:'#2E7D32', marginTop:6 }}>Play free →</div>
          </Link>
        ))}
      </div>

      <Link href="/flags" style={{ textDecoration:'none', display:'block', background:'#2E7D32', borderRadius:14, padding:'18px', textAlign:'center', fontSize:16, fontWeight:900, color:'#fff' }}>
        Start the flag quiz →
      </Link>
    </main>
  )
}
