import Link from 'next/link'
import { supabase } from '@/lib/supabase'

async function getRandomPack(difficulty: number) {
  const { data } = await supabase
    .from('packs')
    .select('slug')
    .eq('difficulty', difficulty)
  if (!data || data.length === 0) return null
  return data[Math.floor(Math.random() * data.length)].slug
}

export default async function Home() {
  const [easy, medium, hard] = await Promise.all([
    getRandomPack(1),
    getRandomPack(2),
    getRandomPack(3),
  ])

  const levels = [
    { slug: easy, label: 'Easy', description: 'Monuments · Animals · Cities', bg: '#00c853', shadow: '#00c85340' },
    { slug: medium, label: 'Medium', description: 'Foods · Art · Civilizations', bg: '#ff8c00', shadow: '#ff8c0040' },
    { slug: hard, label: 'Hard', description: 'Inventors · Phenomena · Locations', bg: '#FF4D6D', shadow: '#FF4D6D40' },
  ]

  return (
    <main style={{
      height: '100dvh', background: '#f2f2f2',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-nunito), sans-serif',
      padding: '0 24px', maxWidth: 430, margin: '0 auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🧠</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: '#111', letterSpacing: -1 }}>
          Pair<span style={{ color: '#FF4D6D' }}>IQ</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: 3, textTransform: 'uppercase', marginTop: 4 }}>
          Association Memory Game
        </div>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {levels.map(level => (
          <Link key={level.label} href={`/play/${level.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', padding: '22px 24px', borderRadius: 20,
              background: level.bg,
              boxShadow: `0 8px 0 ${level.shadow}, 0 12px 20px ${level.shadow}`,
              textAlign: 'center', cursor: 'pointer',
              transform: 'translateY(0)',
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
                {level.label}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginTop: 3 }}>
                {level.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
