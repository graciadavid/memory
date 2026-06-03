import Link from 'next/link'

export const metadata = {
  title: 'Discover — Brain Science That Changes Your Day | MemGenius',
  description: 'Science-backed facts about memory, focus and brain performance. One new discovery unlocks every day.',
}

const POSTS = [
  { slug: 'cold-water-brain-focus-memory', title: 'Cold Water Rewires Your Brain in 30 Seconds', desc: 'A 30-second cold shower increases norepinephrine by 300%. Here is exactly how to use it.', emoji: '💧', tag: 'Focus', locked: false },
  { slug: 'exercise-neurogenesis-brain', title: 'The Exercise That Creates New Neurons', desc: 'Scientists found one specific movement grows brain cells at any age. It is not what you think.', emoji: '🏃', tag: 'Memory', locked: true },
  { slug: 'perfect-nap-duration-memory', title: 'The Exact Nap Length for Memory', desc: 'Too short does nothing. Too long leaves you groggy. The sweet spot is very specific.', emoji: '😴', tag: 'Sleep', locked: true },
  { slug: 'forgetting-curve-memory-hack', title: 'Why You Forget 70% of Everything', desc: 'Ebbinghaus discovered the forgetting curve in 1885. Most people still ignore the fix.', emoji: '📉', tag: 'Learning', locked: true },
  { slug: 'sugar-cognitive-decline-brain', title: 'What Sugar Does to Your Memory', desc: 'The effect is faster and more measurable than most people expect.', emoji: '🍬', tag: 'Nutrition', locked: true },
]

export default function DiscoverPage() {
  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      <div style={{ maxWidth:430, margin:'0 auto' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>MemGenius</div>
        <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:4 }}>Discover</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:24 }}>Brain science you can use today. One fact unlocks every day.</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {POSTS.map((post, i) => (
            post.locked
              ? (
                <div key={post.slug} style={{ background:'#252525', borderRadius:16, padding:'16px 20px', opacity:0.45 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                    <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase' }}>{post.tag}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>🔒 Day {i+1}</div>
                  </div>
                  <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:4 }}>{post.emoji} {post.title}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Play daily to unlock</div>
                </div>
              )
              : (
                <Link key={post.slug} href={`/discover/${post.slug}`} style={{ textDecoration:'none' }}>
                  <div style={{ background:'#252525', borderRadius:16, padding:'16px 20px', border:'1px solid rgba(200,150,12,0.3)' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                      <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase' }}>{post.tag}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>Day {i+1}</div>
                    </div>
                    <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:4 }}>{post.emoji} {post.title}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:8 }}>{post.desc}</div>
                    <div style={{ fontSize:11, color:'#C8960C', fontWeight:800 }}>Read now →</div>
                  </div>
                </Link>
              )
          ))}
        </div>
      </div>
    </main>
  )
}
