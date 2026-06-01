import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Reaction Time Test — Free Online | MemGenius',
  description: 'Test your reaction time for free. 5 different reaction time tests with world rankings.',
}

export default function ReactionTimeTestPage() {
  return (
    <main style={{ maxWidth:680, margin:'0 auto', padding:'40px 24px 100px', fontFamily:'var(--font-nunito),sans-serif', background:'#1A1A1A', minHeight:'100dvh', color:'#fff' }}>
      <h1 style={{ fontSize:28, fontWeight:900, marginBottom:12 }}>Reaction Time Test</h1>
      <p style={{ fontSize:15, lineHeight:1.8, color:'rgba(255,255,255,0.6)', marginBottom:32 }}>How fast is your brain? The average human reaction time is 250ms. Formula 1 drivers react in under 200ms. Test yours for free and find out where you stand globally.</p>

      <h2 style={{ fontSize:20, fontWeight:900, marginBottom:16 }}>5 Free Reaction Time Tests</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40 }}>
        {[
          { href:'/stop', title:'Stop', desc:'Stop a timer at exactly 5 seconds. Tests your internal clock precision.' },
          { href:'/f1', title:'F1 Reaction', desc:'React the moment the Formula 1 lights go out. Pure reaction time.' },
          { href:'/pendulum', title:'Pendulum', desc:'Stop a swinging pendulum at dead center. Anticipatory timing.' },
          { href:'/ace', title:'Ace', desc:'Tap when a moving ball crosses the target. Spatial reaction timing.' },
          { href:'/letter-rain', title:'Letter Rain', desc:'Count a target letter as letters fall. Selective attention speed.' },
        ].map(g => (
          <Link key={g.href} href={g.href} style={{ textDecoration:'none', background:'#252525', borderRadius:14, padding:'16px 20px', display:'block' }}>
            <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:4 }}>{g.title}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{g.desc}</div>
            <div style={{ fontSize:12, fontWeight:800, color:'#2E7D32', marginTop:6 }}>Play free →</div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize:20, fontWeight:900, marginBottom:12 }}>What is reaction time?</h2>
      <p style={{ fontSize:15, lineHeight:1.8, color:'rgba(255,255,255,0.6)', marginBottom:16 }}>Reaction time is the interval between a stimulus and your response. Simple reactions average 200 to 300ms. Complex tasks take longer. Both are trainable.</p>
      <p style={{ fontSize:15, lineHeight:1.8, color:'rgba(255,255,255,0.6)', marginBottom:32 }}>Sleep deprivation is the biggest degrader — one bad night makes you react like someone who is legally drunk. Regular training and exercise improve reaction time measurably within weeks.</p>

      <h2 style={{ fontSize:20, fontWeight:900, marginBottom:12 }}>World data</h2>
      <p style={{ fontSize:15, lineHeight:1.8, color:'rgba(255,255,255,0.6)', marginBottom:40 }}>MemGenius has collected reaction time data from players across 50 countries. Egypt consistently ranks first in Stop precision with an average error of 23ms — seven times more precise than the US average of 168ms.</p>

      <Link href="/stop" style={{ textDecoration:'none', display:'block', background:'#2E7D32', borderRadius:14, padding:'18px', textAlign:'center', fontSize:16, fontWeight:900, color:'#fff' }}>
        Test your reaction time →
      </Link>
    </main>
  )
}
