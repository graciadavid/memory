import Link from 'next/link'

export const metadata = {
  title: 'Blog — Brain Training Tips & Science | MemGenius',
  description: 'Articles about brain training, reaction time, memory, cognitive science and free online brain games.',
}

const POSTS = [
  { slug: 'how-to-train-your-brain-daily', title: 'How to Train Your Brain Daily', desc: 'A science-backed daily routine to improve memory, reaction time and focus.', date: 'June 2026' },
  { slug: 'brain-training-games-for-classrooms', title: 'Brain Training Games for Classrooms', desc: 'Free online games that teachers can use to improve student focus and memory.', date: 'June 2026' },
  { slug: 'reaction-time-test', title: 'What Is a Good Reaction Time?', desc: 'Average reaction times by age, sport and profession. How do you compare?', date: 'June 2026' },
  { slug: 'memory-training-science', title: 'The Science of Memory Training', desc: 'What actually works when training your memory — and what does not.', date: 'June 2026' },
  { slug: 'sudoku-tips-tricks', title: 'Sudoku Tips and Tricks for Beginners', desc: 'The essential strategies to solve any Sudoku puzzle faster.', date: 'June 2026' },
  { slug: 'mastermind-game-online', title: 'How to Win at Mastermind', desc: 'The logic behind the classic code-breaking game and how to crack it every time.', date: 'June 2026' },
  { slug: 'brain-age-test', title: 'What Is a Brain Age Test?', desc: 'How cognitive tests measure your brain age and what you can do to improve it.', date: 'June 2026' },
  { slug: 'geography-quiz-flags', title: 'How to Learn All the World Flags', desc: 'Memory techniques to recognise every flag in the world.', date: 'June 2026' },
]

export default function BlogPage() {
  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:4 }}>Blog</div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:24 }}>Brain training science and tips</div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {POSTS.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration:'none' }}>
            <div style={{ background:'#252525', borderRadius:16, padding:'16px 20px' }}>
              <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:4 }}>{post.title}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:8 }}>{post.desc}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:700 }}>{post.date}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
