export const metadata = {
  title: 'How to Learn All the World Flags — MemGenius',
  description: 'Memory techniques to recognise every flag in the world. Learn flags fast with spaced repetition.',
}
export default function Page() {
  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      <div style={{ maxWidth:430, margin:'0 auto' }}>
        <a href="/blog" style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, textDecoration:'none', display:'block', marginBottom:16 }}>← Blog</a>
        <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Geography</div>
        <h1 style={{ fontSize:26, fontWeight:900, color:'#fff', marginBottom:8, lineHeight:1.2 }}>How to Learn All the World Flags</h1>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700, marginBottom:24 }}>June 2026 · 4 min read</div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.8, display:'flex', flexDirection:'column', gap:16 }}>
          <p>There are 197 recognised countries in the world, each with a unique flag. Learning to identify all of them sounds like an enormous task — and attempted the wrong way, it is. Attempted the right way, it is achievable in weeks and deeply satisfying. The key is understanding how visual memory works and using that understanding to make flags stick.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>Group flags by region</h2>
          <p>Flags within the same region often share visual elements — the Arab flags tend to use red, white, black and green; the Nordic flags share the off-centre cross; the former Soviet republics often feature similar colour schemes. Learning flags by region allows you to use comparative memory — if you know one flag well, similar flags become easier to distinguish.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>Use distinctive features as anchors</h2>
          <p>Every flag has at least one distinctive element. Nepal is the only non-rectangular national flag. Bhutan has a dragon. Canada has the maple leaf. Switzerland has a square rather than rectangular shape. These distinctive features are your anchors — once you notice them, they become impossible to forget.</p>
          <p>For flags that look similar — Chad and Romania, for example, or Monaco and Indonesia — identify the single distinguishing feature (shade of blue, proportions, shade of red) and create a specific memory hook for it.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>Spaced repetition is the key</h2>
          <p>The most powerful tool for memorising flags is spaced repetition — reviewing flags at increasing intervals as you learn them. A flag you have just learned needs reviewing after one day, then three days, then a week, then a month. This pattern matches how long-term memory consolidation works and dramatically reduces the total time needed to learn all flags.</p>
          <p>The MemGenius Flags game implements a natural form of spaced repetition through its progressive difficulty and world ranking system. Flags you know well appear less often; flags you struggle with appear more frequently. The competitive element adds the emotional engagement that makes memories stick longer.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>How many flags can you identify?</h2>
          <p>The average person can identify approximately 40 to 60 flags on a first attempt. Regular players on MemGenius Flags reach 150 or more correct identifications in a row within a few weeks of daily practice. The world ranking shows exactly where you stand — and provides the competitive motivation to keep improving.</p>
        </div>
        <a href="/flags" style={{ textDecoration:'none', display:'block', marginTop:32, background:'#2E7D32', borderRadius:16, padding:'16px', textAlign:'center', fontSize:16, fontWeight:900, color:'#fff' }}>Play Flags →</a>
      </div>
    </main>
  )
}
