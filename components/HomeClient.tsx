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
  const diffColor = dailyDifficulty === 1 ? '#00c853' : dailyDifficulty === 2 ? '#ff8c00' : '#FF4D6D'
  const diffLabel = dailyDifficulty === 1 ? '🟢 Easy' : dailyDifficulty === 2 ? '🟡 Medium' : '🔴 Hard'

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
      <div style={{ padding: '24px 24px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#aaa' }}>
          {profile.streak > 0
            ? `🔥 ${profile.streak} day streak ${playedToday ? '· ✅ today' : ''}`
            : 'Start your streak 🔥'}
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#111', marginTop: 2 }}>
          Hey, {profile.name}!
        </div>
      </div>

      {/* Daily Challenge */}
      <div style={{ padding: '0 16px 16px' }}>
        <Link href={`/play/${dailySlug}`} style={{ textDecoration: 'none' }}>
          <div style={{
            background: '#111', borderRadius: 22, padding: '18px 20px',
            boxShadow: '0 8px 0 #00000030, 0 12px 20px #00000020',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -20, right: -20,
              fontSize: 80, opacity: 0.06,
            }}>🔥</div>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: diffColor, textTransform: 'uppercase', marginBottom: 4 }}>
              🔥 Daily Challenge
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'white', marginBottom: 4 }}>
              {dailyTitle}
            </div>
            <div style={{ fontSize: 12, color: '#666', fontWeight: 700 }}>
              {diffLabel} · New challenge every day
            </div>
            {playedToday && (
              <div style={{
                marginTop: 8, fontSize: 12, fontWeight: 800,
                color: diffColor,
              }}>
                ✅ Completed today!
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Levels */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#bbb', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
          Free Play
        </div>
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
