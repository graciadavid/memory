export const metadata = {
  title: 'The Science of Memory Training — MemGenius',
  description: 'What actually works when training your memory — and what the research says about cognitive improvement.',
}
export default function Page() {
  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      <div style={{ maxWidth:430, margin:'0 auto' }}>
        <a href="/blog" style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, textDecoration:'none', display:'block', marginBottom:16 }}>← Blog</a>
        <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Memory Science</div>
        <h1 style={{ fontSize:26, fontWeight:900, color:'#fff', marginBottom:8, lineHeight:1.2 }}>The Science of Memory Training</h1>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700, marginBottom:24 }}>June 2026 · 6 min read</div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.8, display:'flex', flexDirection:'column', gap:16 }}>
          <p>Memory is not a single ability. It is a collection of distinct systems — each with its own neural substrate, its own strengths and weaknesses, and its own response to training. Understanding which system you are training and why matters enormously if you want to actually improve.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>Working memory — the most trainable system</h2>
          <p>Working memory is your brain's ability to hold and manipulate information in real time. It is what allows you to do mental arithmetic, follow a complex argument, or remember the beginning of a sentence by the time you reach the end. It is also the memory system most strongly correlated with general intelligence.</p>
          <p>N-Back training — the task used in MemGenius N-Back — is the most studied working memory training paradigm in cognitive neuroscience. Multiple peer-reviewed studies have shown that dual N-Back training produces measurable improvements in fluid intelligence, making it one of the very few cognitive training tasks with documented transfer effects to untrained abilities.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>Semantic memory — the foundation of knowledge</h2>
          <p>Semantic memory stores your knowledge of the world — facts, concepts and the relationships between them. It is what allows you to recognise a flag, name a capital city or understand an analogy. Unlike working memory, semantic memory is relatively resilient to age-related decline. But the speed of semantic retrieval — how quickly you can access stored knowledge — does decline from the forties onward.</p>
          <p>The most effective way to train semantic retrieval speed is through spaced repetition combined with active recall. Every time you play Flags or Capitals on MemGenius, you are practising active recall under time pressure — exactly the conditions that strengthen semantic memory most effectively.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>Spatial memory — navigation and pattern recognition</h2>
          <p>Spatial memory — the ability to hold and recall the position of objects in space — is trained by games like Blink and Memory on MemGenius. It engages the hippocampus and parahippocampal cortex, the same regions used for physical navigation. Spatial memory is one of the most trainable cognitive abilities and shows dramatic improvement in the early stages of training.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>What does not work</h2>
          <p>Not all brain training is equal. Passive engagement — watching videos, reading articles — does not train memory. Only active recall under mild cognitive stress produces lasting improvements. This is why MemGenius is built around games rather than exercises — the competitive element, the world ranking and the time pressure create exactly the conditions that drive neural adaptation.</p>
          <p>Single-game training also has limited transfer effects. Training only your working memory improves your working memory — it does not automatically improve your reaction time or your semantic recall. A comprehensive brain training routine needs to target multiple cognitive systems, which is why MemGenius offers 22 games across four distinct categories.</p>
        </div>
        <a href="/memory" style={{ textDecoration:'none', display:'block', marginTop:32, background:'#2E7D32', borderRadius:16, padding:'16px', textAlign:'center', fontSize:16, fontWeight:900, color:'#fff' }}>Train Your Memory →</a>
      </div>
    </main>
  )
}
