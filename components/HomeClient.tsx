'use client'
import Link from 'next/link'
import { usePlayer } from '@/lib/usePlayer'
import Onboarding from './Onboarding'

interface Props {
  easy: string | null
  medium: string | null
  hard: string | null
  dailySlug: string | null
  dailyTitle: string | null
  dailyDifficulty: number
}

export default function HomeClient({ easy, medium, hard, dailySlug, dailyTitle, dailyDifficulty }: Props) {
  const { profile, loaded, createProfile } = usePlayer()

  if (!loaded) return null
  if (!profile?.name) return <Onboarding onCreate={createProfile} />

  const today = new Date().toISOString().split('T')[0]
  const playedToday = profile.lastPlayedDate === today

  const diffBg = dailyDifficulty === 1 ? '#00c853' : dailyDifficulty === 2 ? '#ff8c00' : '#FF4D6D'
  const diffShadow = dailyDifficulty === 1 ? '#00c85340' : dailyDifficulty === 2 ? '#ff8c0040' : '#FF4D6D40'

  const levels = [
    { slug: easy, label: 'Easy', description: 'Monuments · Animals · Cities', bg: '#00c853', shadow: '#00c85340' },
    { slug: medium, label: 'Medium', description: 'Foods · Art · Civilizations', bg: '#ff8c00', shadow: '#ff8c0040' },
    { slug: hard, label: 'Hard', description: 'Inventors · Phenomena · Locations', bg: '#FF4D6D', shadow: '#FF4D6D40' },
  ]

  return (
    <main style={{
      height: '100dvh', background: '#f2f2f2',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      overflow: 'hidden', paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{ padding: '28px 24px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#111', letterSpacing: -1 }}>
          Mem<span style={{ color: '#FF4D6D' }}>Genius</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#aaa', marginTop: 4 }}>
          {profile.streak > 0
            ? `${profile.streak} day streak ${playedToday ? '· Played today' : ''}`
            : `Hey, ${profile.name}!`}
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>

        {/* Daily Challenge — mismo estilo que los otros */}
        <Link href={`/play/${dailySlug}`} style={{ textDecoration: 'none' }}>
          <div style={{
            width: '100%', padding: '18px 22px', borderRadius: 18,
            background: diffBg,
            boxShadow: `0 6px 0 ${diffShadow}`,
            textAlign: 'center', cursor: 'pointer',
            boxSizing: 'border-box',
            position: 'relative',
          }}>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 2 }}>
              Daily Challenge
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>
              {dailyTitle}
            </div>
            {playedToday && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginTop: 2 }}>
                Completed today
              </div>
            )}
          </div>
        </Link>

        {/* Divider */}
        <div style={{ fontSize: 10, fontWeight: 800, color: '#bbb', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', margin: '4px 0' }}>
          Free Play
        </div>

        {/* Levels */}
        {levels.map(level => (
          <Link key={level.label} href={`/play/${level.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', padding: '16px 22px', borderRadius: 18,
              background: level.bg,
              boxShadow: `0 6px 0 ${level.shadow}`,
              textAlign: 'center', cursor: 'pointer',
              boxSizing: 'border-box',
            }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{level.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginTop: 2 }}>
                {level.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
