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
    {
      slug: easy,
      label: 'Easy',
      emoji: '🟢',
      description: 'Monuments, Animals, Cities',
      bg: 'linear-gradient(135deg, #00c853, #69f0ae)',
      shadow: 'rgba(0,200,83,0.3)',
    },
    {
      slug: medium,
      label: 'Medium',
      emoji: '🟡',
      description: 'Foods, Art, Civilizations',
      bg: 'linear-gradient(135deg, #ff8c00, #ffd740)',
      shadow: 'rgba(255,140,0,0.3)',
    },
    {
      slug: hard,
      label: 'Hard',
      emoji: '🔴',
      description: 'Inventors, Phenomena, Locations',
      bg: 'linear-gradient(135deg, #FF4D6D, #f50057)',
      shadow: 'rgba(255,77,109,0.3)',
    },
  ]

  return (
    <main style={{
      height: '100dvh',
      background: '#0c0c14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-nunito), sans-serif',
      padding: '0 24px',
      maxWidth: 430,
      margin: '0 auto',
    }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>🧠</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: 'white', letterSpacing: -1 }}>
          Pair<span style={{ color: '#FF4D6D' }}>IQ</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#444', letterSpacing: 3, textTransform: 'uppercase', marginTop: 4 }}>
          Association Memory Game
        </div>
      </div>

      {/* Level buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {levels.map(level => (
          <Link key={level.label} href={`/play/${level.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%',
              padding: '20px 24px',
              borderRadius: 20,
              background: level.bg,
              boxShadow: `0 8px 32px ${level.shadow}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: -0.5 }}>
                  {level.emoji} {level.label}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 700, marginTop: 2 }}>
                  {level.description}
                </div>
              </div>
              <div style={{ fontSize: 28 }}>→</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Ranking link */}
      <Link href="/ranking" style={{ textDecoration: 'none', marginTop: 32 }}>
        <div style={{
          fontSize: 13, fontWeight: 800, color: '#444',
          letterSpacing: 2, textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          🏆 World Ranking
        </div>
      </Link>

    </main>
  )
}
