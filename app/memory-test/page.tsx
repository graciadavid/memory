import { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export const metadata: Metadata = {
  title: 'Memory Test — Free Online | MemGenius',
  description: 'Test your memory for free. 6 different memory tests with world rankings.',
}

export default function MemoryTestPage() {
  return (
    <main style={{ maxWidth:680, margin:'0 auto', padding:'40px 24px 100px', fontFamily:'var(--font-nunito),sans-serif', background:'#1A1A1A', minHeight:'100dvh', color:'#fff' }}>
      <h1 style={{ fontSize:28, fontWeight:900, marginBottom:12 }}>Memory Test</h1>
      <p style={{ fontSize:15, lineHeight:1.8, color:'rgba(255,255,255,0.6)', marginBottom:32 }}>How good is your memory? The human brain holds about 7 items in working memory at once. Some manage 4. A few reach 12. Find out where you stand.</p>

      <h2 style={{ fontSize:20, fontWeight:900, marginBottom:16 }}>6 Free Memory Tests</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40 }}>
        {[
          { href:'/digits', icon:'digits.png', title:'Digits', desc:'How many numbers can you remember in order?' },
          { href:'/sequence', icon:'sequence.png', title:'Simon Says', desc:'Repeat growing color sequences.' },
          { href:'/nback', icon:'nback.png', title:'N-Back', desc:'Does this match the one from 2 rounds ago?' },
          { href:'/blink', icon:'blink.png', title:'Blink', desc:'Remember which cells lit up in the grid.' },
          { href:'/memory', icon:'memory.png', title:'Memory', desc:'Match connected concepts against the clock.' },
          { href:'/poke', icon:'salmon.png', title:'Poke', desc:'Remember the poke bowl ingredients.' },
        ].map(g => (
          <Link key={g.href} href={g.href} style={{ textDecoration:'none', background:'#252525', borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', gap:14 }}>
            <img src={`${BASE}/${g.icon}`} style={{ width:44, height:44, objectFit:'contain', flexShrink:0 }} />
            <div>
              <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:4 }}>{g.title}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{g.desc}</div>
              <div style={{ fontSize:12, fontWeight:800, color:'#2E7D32', marginTop:4 }}>Play free →</div>
            </div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize:20, fontWeight:900, marginBottom:12 }}>Why does memory matter?</h2>
      <p style={{ fontSize:15, lineHeight:1.8, color:'rgba(255,255,255,0.6)', marginBottom:16 }}>Working memory is the mental workspace where your brain holds and manipulates information in the moment. Better working memory means faster learning, sharper focus and better decisions under pressure.</p>
      <p style={{ fontSize:15, lineHeight:1.8, color:'rgba(255,255,255,0.6)', marginBottom:40 }}>Short daily sessions outperform long occasional ones. Ten minutes every day beats ninety minutes once a week.</p>

      <Link href="/digits" style={{ textDecoration:'none', display:'block', background:'#2E7D32', borderRadius:14, padding:'18px', textAlign:'center', fontSize:16, fontWeight:900, color:'#fff' }}>
        Test your memory →
      </Link>
    </main>
  )
}
