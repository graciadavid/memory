import Link from "next/link"

const BROWN = "#4A2C0A"
const GOLD = "#C8960C"
const CREAM = "#FAF7F2"

const POSTS = [
  {
    slug: 'brain-age-test',
    title: 'Brain Age Test Online — Discover How Old Your Brain Really Is',
    desc: 'Free online Brain Age Test. 5 cognitive games measuring memory, reaction time, precision, geography and logic. Discover your brain age in 4 minutes.',
    date: 'May 2026',
    tag: 'Brain Training',
  },
  {
    slug: 'sudoku-tips-tricks',
    title: 'Sudoku Tips and Tricks — How to Solve Any Puzzle Faster',
    desc: 'Master Sudoku with proven techniques from beginner elimination to advanced X-Wing patterns.',
    date: 'May 2026',
    tag: 'Sudoku',
  },
  {
    slug: 'mastermind-game-online',
    title: 'Mastermind Game Online — Free, No Download',
    desc: 'Crack the color code in 7 attempts. The classic deduction game with a world ranking.',
    date: 'May 2026',
    tag: 'Logic Games',
  },
  {
    slug: 'sudoku-tips-tricks',
    title: 'Sudoku Tips and Tricks — How to Solve Any Puzzle Faster',
    desc: 'Master Sudoku with proven techniques from beginner elimination to advanced X-Wing patterns.',
    date: 'May 2026',
    tag: 'Sudoku',
  },
  {
    slug: 'mastermind-game-online',
    title: 'Mastermind Game Online — Free, No Download',
    desc: 'Crack the color code in 7 attempts. The classic deduction game with a world ranking.',
    date: 'May 2026',
    tag: 'Logic Games',
  },
  {
    slug: 'sudoku-tips-tricks',
    title: 'Sudoku Tips and Tricks — How to Solve Any Puzzle Faster',
    desc: 'Master Sudoku with proven techniques from beginner elimination to advanced X-Wing patterns.',
    date: 'May 2026',
    tag: 'Sudoku',
  },
  {
    slug: 'mastermind-game-online',
    title: 'Mastermind Game Online — Free, No Download',
    desc: 'Crack the color code in 7 attempts. The classic deduction game with a world ranking.',
    date: 'May 2026',
    tag: 'Logic Games',
  },
  {
    slug: 'sudoku-game-online',
    title: 'Sudoku Online — Why It Is the Best Brain Game for Adults Over 50',
    desc: 'Science-backed benefits of daily Sudoku for cognitive health. Free online Sudoku with world ranking.',
    date: 'May 2026',
    tag: 'Brain Health',
  },
  {
    slug: "higher-or-lower-game",
    title: "Higher or Lower Game Online — Countries, Population and Area",
    desc: "Guess which country has more people or bigger area. Free, no login, world ranking. The geography game that breaks all your assumptions.",
    date: "May 2026",
    tag: "Geography Games",
  },
  {
    slug: "simon-says-game-online",
    title: "Simon Says Game Online — Free, No Download",
    desc: "Play the classic Simon Says color pattern game online. Free, no login, world ranking. How far can you go?",
    date: "May 2026",
    tag: "Memory Games",
  },
  {
    slug: "how-to-train-your-brain-daily",
    title: "How to Train Your Brain Daily in 5 Minutes",
    desc: "Science-backed daily brain training routine. Improve memory, reaction time and focus in just 5 minutes a day with free online games.",
    date: "May 2026",
    tag: "Brain Training",
  },
  {
    slug: "brain-training-games-for-classrooms",
    title: "Best Free Brain Training Games for Classrooms",
    desc: "How teachers are using memory, reaction and geography games to engage students on mobile — with zero setup.",
    date: "May 2026",
    tag: "Education",
  },
]

export default function BlogPage() {
  return (
    <main style={{ minHeight: "100dvh", background: CREAM, fontFamily: "var(--font-nunito), sans-serif", maxWidth: 860, margin: "0 auto", padding: "40px 24px 100px", color: BROWN }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#4A2C0A50", marginBottom: 32 }}>Back to MemGenius</div>
      </Link>
      <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>MemGenius Blog</div>
      <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 40px", letterSpacing: -0.5 }}>Train Your Brain</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {POSTS.map(p => (
          <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #4A2C0A10" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, marginBottom: 8 }}>{p.tag} · {p.date}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: BROWN, marginBottom: 8 }}>{p.title}</div>
              <div style={{ fontSize: 14, color: "#4A2C0A70", lineHeight: 1.7 }}>{p.desc}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: BROWN, marginTop: 12 }}>Read more →</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
