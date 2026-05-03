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
    { slug: easy, label: 'Easy', emoji: '🟢', description: 'Monuments, Animals, Cities', color: '#00c853' },
    { slug: medium, label: 'Medium', emoji: '🟡', description: 'Foods, Art, Civilizations', color: '#ff8c00' },
    { slug: hard, label: 'Hard', emoji: '🔴', description: 'Inventors, Phenomena, Locations', color: '#FF4D6D' },
  ]

  return (
    <main style={{
      height: '100dvh', background: '#f0f0f0',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-nunito), sans-serif',
      padding: '0 24px', maxWidth: 430, margin: '0 auto',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>🧠</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: '#111', letterSpacing: -1 }}>
          Pair<span style={{ color: '#FF4D6D' }}>IQ</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#999', letterSpacing: 3, textTransform: 'uppercase', marginTop: 4 }}>
          Association Memory Game
        </div>
      </div>

      {/* Levels */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {levels.map(level => (
          <Link key={level.label} href={`/play/${level.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', padding: '18px 24px', borderRadius: 20,
              background: '#fff',
              border: `2px solid ${level.color}22`,
              boxShadow: `0 4px 16px ${level.color}18`,
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', cursor: 'pointer',
            }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#111' }}>
                  {level.emoji} {level.label}
                </div>
                <div style={{ fontSize: 12, color: '#999', fontWeight: 700, marginTop: 2 }}>
                  {level.description}
                </div>
              </div>
              <div style={{ fontSize: 20, color: level.color }}>→</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
