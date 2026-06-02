export const metadata = {
  title: 'What Is a Good Reaction Time? — MemGenius',
  description: 'Average human reaction times by age, sport and profession. Test your reaction time free online.',
}
export default function Page() {
  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      <div style={{ maxWidth:430, margin:'0 auto' }}>
        <a href="/blog" style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, textDecoration:'none', display:'block', marginBottom:16 }}>← Blog</a>
        <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Reaction Time</div>
        <h1 style={{ fontSize:26, fontWeight:900, color:'#fff', marginBottom:8, lineHeight:1.2 }}>What Is a Good Reaction Time?</h1>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700, marginBottom:24 }}>June 2026 · 4 min read</div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.8, display:'flex', flexDirection:'column', gap:16 }}>
          <p>Reaction time is one of the most fundamental measures of cognitive and physical performance. It reflects the total speed of the chain from perception to decision to action — and it varies dramatically between individuals, ages and training levels.</p>
          <p>The average simple reaction time for a healthy adult to a visual stimulus is approximately 250 milliseconds. But this number hides enormous variation. Elite athletes react in under 200ms. Formula 1 drivers consistently react in 150 to 200ms at race starts. The theoretical minimum for human simple reaction time is around 100ms — any faster and the FIA flags it as a jump start.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>Average reaction times by age</h2>
          <p>Reaction time peaks in the mid-twenties and declines gradually thereafter. Children under 12 have slower reaction times due to incomplete myelination of neural pathways. Teenagers improve rapidly. Adults in their twenties are at peak performance. From the thirties onward, simple reaction time increases by approximately 1-2ms per year on average.</p>
          <p>By age 60, the average simple reaction time is around 310-320ms — noticeably slower than a 25-year-old but still well within a functional range. Regular exercise and cognitive training can significantly offset this decline.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>Reaction time by sport</h2>
          <p>Different sports demand different types of reaction. A sprinter reacting to a starting gun uses simple reaction time — one stimulus, one response. A tennis player returning a serve uses choice reaction time — multiple possible stimuli, multiple possible responses — which is significantly more complex and typically 50-100ms slower.</p>
          <p>The fastest documented simple reaction times belong to combat sport athletes and racket sport players who train specifically for this ability. Table tennis players at elite level have demonstrated reaction times under 150ms in controlled conditions.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>How to improve your reaction time</h2>
          <p>Reaction time is trainable. Regular practice with simple reaction time tests produces measurable improvement within two to four weeks. The mechanism is neural — repeated activation of the perception-decision-action chain accelerates signal transmission along those specific pathways.</p>
          <p>The most effective training combines reaction time testing with physical exercise. Cardiovascular exercise increases cerebral blood flow and has been shown to improve reaction time independently of specific cognitive training. The combination of daily aerobic exercise and regular reaction time training produces the greatest gains.</p>
          <p>Test your reaction time free on MemGenius with F1 Reaction — the same format used to measure Formula 1 driver reactions at race starts. Five red lights, random delay, tap when they go out. Your result in milliseconds, ranked against players worldwide.</p>
        </div>
        <a href="/f1" style={{ textDecoration:'none', display:'block', marginTop:32, background:'#2E7D32', borderRadius:16, padding:'16px', textAlign:'center', fontSize:16, fontWeight:900, color:'#fff' }}>Test Your Reaction Time →</a>
      </div>
    </main>
  )
}
