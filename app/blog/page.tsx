import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

const POSTS = [
  {
    slug: 'brain-training-games-for-classrooms',
    title: 'Best Free Brain Training Games for Classrooms',
    desc: 'How teachers are using memory, reaction and geography games to engage students on mobile — with zero setup.',
    date: 'May 2026',
    tag: 'Education',
  },
]

export default function BlogPage() {
  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 860, margin: '0 auto', padding: '40px 24px 100px', color: BROWN }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: `${BROWN}50`, marginBottom: 32 }}>← Back to MemGenius</div>
      </Link>
      <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>MemGenius Blog</div>
      <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 40px', letterSpacing: -0.5 }}>Train Your Brain</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {POSTS.map(p => (
          <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: `1px solid ${BROWN}10` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, marginBottom: 8 }}>{p.tag} · {p.date}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: BROWN, marginBottom: 8 }}>{p.title}</div>
              <div style={{ fontSize: 14, color: `${BROWN}70`, lineHeight: 1.7 }}>{p.desc}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: BROWN, marginTop: 12 }}>Read more →</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
