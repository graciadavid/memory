export const metadata = {
  title: 'What Is a Brain Age Test? — MemGenius',
  description: 'How cognitive tests measure your brain age and what you can do to improve it with brain training.',
}
export default function Page() {
  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      <div style={{ maxWidth:430, margin:'0 auto' }}>
        <a href="/blog" style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, textDecoration:'none', display:'block', marginBottom:16 }}>← Blog</a>
        <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Cognitive Science</div>
        <h1 style={{ fontSize:26, fontWeight:900, color:'#fff', marginBottom:8, lineHeight:1.2 }}>What Is a Brain Age Test?</h1>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700, marginBottom:24 }}>June 2026 · 5 min read</div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.8, display:'flex', flexDirection:'column', gap:16 }}>
          <p>Brain age is a concept from cognitive neuroscience that attempts to express cognitive performance as a single number — your estimated cognitive age based on how you perform relative to population norms. A 45-year-old with a brain age of 35 performs on cognitive tests like an average 35-year-old. A 25-year-old with a brain age of 30 performs below the typical level for their chronological age.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>What brain age tests actually measure</h2>
          <p>A genuine brain age assessment measures multiple cognitive domains — not just memory or reaction time in isolation, but the full profile of abilities that decline or improve with age. These include processing speed, working memory capacity, episodic memory, executive function and semantic knowledge retrieval.</p>
          <p>Single-task tests — like a simple reaction time test or a memory span test — are informative but incomplete. The MemGenius Brain Score attempts a more comprehensive assessment by combining your percentile rankings across all four cognitive categories: agility, memory, knowledge and logic.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>What affects your brain age</h2>
          <p>Sleep is the most powerful single factor. Chronic sleep restriction of even one hour per night produces measurable cognitive decline equivalent to several years of ageing. A single night of poor sleep reduces working memory capacity by approximately 30%.</p>
          <p>Physical exercise is the second most powerful factor. Cardiovascular exercise increases BDNF — brain-derived neurotrophic factor — which promotes the growth of new neurons and synaptic connections. Even a 20-minute walk produces measurable cognitive improvement for the following two hours.</p>
          <p>Cognitive training — systematic practice across multiple cognitive domains — is the third factor. The key word is systematic: playing one game occasionally produces no lasting benefit. Daily training across varied cognitive challenges, tracked over months, produces measurable and lasting improvement.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>How to improve your brain age</h2>
          <p>The evidence-based path to a younger brain age combines consistent sleep, regular cardiovascular exercise and daily cognitive training. MemGenius provides the cognitive training component — free, no registration required, with world rankings that make your progress visible and meaningful. Create a profile to track your Brain Score over time and watch your cognitive age improve.</p>
        </div>
        <a href="/brain-test" style={{ textDecoration:'none', display:'block', marginTop:32, background:'#2E7D32', borderRadius:16, padding:'16px', textAlign:'center', fontSize:16, fontWeight:900, color:'#fff' }}>Take the Brain Test →</a>
      </div>
    </main>
  )
}
