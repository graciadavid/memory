'use client'
import Link from 'next/link'
import { usePlayer } from '@/lib/usePlayer'
import Onboarding from './Onboarding'

interface Props {
  easy: string | null
  medium: string | null
  hard: string | null
}

export default function HomeClient({ easy, medium, hard }: Props) {
  const { profile, loaded, createProfile } = usePlayer()

  if (!loaded) return null

  if (!profile?.name) {
    return <Onboarding onCreate={createProfile} />
  }

  const today = new Date().toISOString().split('T')[0]
  const playedToday = profile.lastPlayedDate === today

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
      overflow: 'hidden',
    }}>
      {/* Header personalizado */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontSize: 48, marginBottom: 6 }}>🧠</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#111' }}>
          Hey, {profile.name}!
        </div>
        <div style={{ fontSize: 13, color: '#aaa', fontWeight: 700, marginTop: 4 }}>
          {profile.streak > 0
            ? `🔥 ${profile.streak} day streak ${playedToday ? '· Played today ✅' : '· Play to keep it!'}`
            : 'Start your streak today 🔥'}
        </div>
      </div>

      {/* Level buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {levels.map(level => (
          <Link key={level.label} href={`/play/${level.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', padding: '20px 24px', borderRadius: 20,
              background: level.bg,
              boxShadow: `0 8px 0 ${level.shadow}, 0 12px 20px ${level.shadow}`,
              textAlign: 'center', cursor: 'pointer',
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>
                {level.label}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginTop: 2 }}>
                {level.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
