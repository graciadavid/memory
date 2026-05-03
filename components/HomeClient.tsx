'use client'
import Link from 'next/link'
import { usePlayer } from '@/lib/usePlayer'
import Onboarding from './Onboarding'

const EAGLE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/eagle.png'

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

  const today = new Date().toISOString().split('T')[0]
  const playedToday = profile?.lastPlayedDate === today
  const diffColor = dailyDifficulty === 1 ? '#00c853' : dailyDifficulty === 2 ? '#ff8c00' : '#FF4D6D'
  const diffShadow = dailyDifficulty === 1 ? '#00c85330' : dailyDifficulty === 2 ? '#ff8c0030' : '#FF4D6D30'

  const levels = [
    { slug: easy, label: 'Easy', bg: '#00c853', shadow: '#00c85330' },
    { slug: medium, label: 'Medium', bg: '#ff8c00', shadow: '#ff8c0030' },
    { slug: hard, label: 'Hard', bg: '#FF4D6D', shadow: '#FF4D6D30' },
  ]

  const handlePlay = (slug: string | null) => {
    if (!slug) return
    if (!profile?.name) {
      // guardar destino y mostrar onboarding
      window.location.href = `/play/${slug}`
    }
  }

  return (
    <main style={{
      height: '100dvh',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      overflow: 'hidden', paddingBottom: 80,
      position: 'relative',
    }}>

      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,77,109,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ padding: '36px 24px 0', textAlign: 'center', position: 'relative' }}>

        {/* Logo text first */}
        <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: -1, lineHeight: 1 }}>
          Mem<span style={{ color: '#FF4D6D' }}>Genius</span>
        </div>

        {/* Eagle below logo */}
        <img
          src={EAGLE}
          alt="MemGenius"
          style={{
            width: 130, height: 130,
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 24px rgba(255,77,109,0.25))',
            marginTop: 4,
            marginBottom: 4,
          }}
        />

        {/* Greeting or CTA */}
        {profile?.name ? (
          <>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
              Hey, {profile.name}
            </div>
            {profile.streak > 0 && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20, padding: '5px 14px', marginTop: 8,
              }}>
                <span style={{ fontSize: 13 }}>🔥</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>
                  {profile.streak} day streak {playedToday ? '· Done today' : ''}
                </span>
              </div>
            )}
          </>
        ) : (
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>
            Test your knowledge
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>

        {/* Daily Challenge */}
        <Link href={profile?.name ? `/play/${dailySlug}` : '#'} 
          onClick={() => !profile?.name && createProfile('') }
          style={{ textDecoration: 'none' }}>
          <div style={{
            width: '100%', padding: '18px 22px', borderRadius: 20,
            background: `linear-gradient(135deg, ${diffColor}cc, ${diffColor}88)`,
            boxShadow: `0 8px 0 ${diffShadow}, 0 16px 32px ${diffShadow}`,
            textAlign: 'center', cursor: 'pointer',
            boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
            border: `1px solid ${diffColor}44`,
          }}>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 3 }}>
              Daily Challenge
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
              {dailyTitle}
            </div>
            {playedToday && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 3 }}>
                Completed today
              </div>
            )}
          </div>
        </Link>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 4px' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.2)', letterSpacing: 2, textTransform: 'uppercase' }}>
            Free Play
          </div>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Level buttons — solo label */}
        <div style={{ display: 'flex', gap: 10 }}>
          {levels.map(level => (
            <Link key={level.label} href={`/play/${level.slug}`} style={{ textDecoration: 'none', flex: 1 }}>
              <div style={{
                padding: '18px 8px', borderRadius: 18,
                background: `linear-gradient(145deg, ${level.bg}cc, ${level.bg}88)`,
                boxShadow: `0 6px 0 ${level.shadow}, 0 10px 24px ${level.shadow}`,
                textAlign: 'center', cursor: 'pointer',
                border: `1px solid ${level.bg}44`,
              }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{level.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
