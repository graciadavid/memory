'use client'
import Link from 'next/link'
import { usePlayer } from '@/lib/usePlayer'
import Onboarding from './Onboarding'

const EAGLE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/eagle.png'
const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const CREAM2 = '#F0EBE1'

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
  const playedToday = profile?.lastPlayedDate === today
  const diffColor = dailyDifficulty === 1 ? '#2E7D32' : dailyDifficulty === 2 ? '#E65100' : '#B71C1C'

  const levels = [
    { slug: easy, label: 'Easy', bg: '#2E7D32', shadow: '#1B5E2040' },
    { slug: medium, label: 'Medium', bg: '#E65100', shadow: '#BF360C40' },
    { slug: hard, label: 'Hard', bg: '#B71C1C', shadow: '#7F000040' },
  ]

  return (
    <main style={{
      height: '100dvh',
      background: `linear-gradient(180deg, ${CREAM} 0%, ${CREAM2} 100%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      overflow: 'hidden', paddingBottom: 80,
    }}>

      {/* Eagle */}
      <img
        src={EAGLE}
        alt="MemGenius"
        style={{
          width: 130, height: 130,
          objectFit: 'contain',
          filter: 'drop-shadow(0 12px 28px rgba(74,44,10,0.2))',
          marginTop: 28,
          display: 'block',
        }}
      />

      {/* Logo */}
      <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, lineHeight: 1, marginTop: 8, textAlign: 'center' }}>
        <span style={{ color: GOLD }}>Mem</span>
        <span style={{ color: BROWN }}>Genius</span>
      </div>

      {/* Claim — handwritten style */}
      <div style={{
        fontSize: 15, color: `${BROWN}70`,
        fontStyle: 'italic', marginTop: 6, marginBottom: 4,
        fontFamily: 'Georgia, serif',
        letterSpacing: 0.3,
      }}>
        Your daily brain workout
      </div>

      {/* Greeting */}
      <div style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginTop: 6, textAlign: 'center' }}>
        Hey, {profile.name}!
      </div>

      {/* Buttons */}
      <div style={{ width: '100%', padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Daily Challenge */}
        <Link href={`/play/${dailySlug}`} style={{ textDecoration: 'none' }}>
          <div style={{
            width: '100%', padding: '18px 24px', borderRadius: 20,
            background: BROWN,
            boxShadow: `0 8px 0 ${BROWN}50, 0 16px 32px ${BROWN}20`,
            textAlign: 'center', cursor: 'pointer',
            boxSizing: 'border-box',
          }}>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: GOLD, textTransform: 'uppercase', marginBottom: 4 }}>
              Daily Challenge
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>
              Play Today's Game
            </div>
            {playedToday && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 4 }}>
                Completed today
              </div>
            )}
          </div>
        </Link>

        {/* Level buttons — same size */}
        <div style={{ display: 'flex', gap: 10 }}>
          {levels.map(level => (
            <Link key={level.label} href={`/play/${level.slug}`} style={{ textDecoration: 'none', flex: 1 }}>
              <div style={{
                padding: '16px 8px', borderRadius: 18,
                background: level.bg,
                boxShadow: `0 6px 0 ${level.shadow}`,
                textAlign: 'center', cursor: 'pointer',
              }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{level.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Categories button — same height as daily */}
        <Link href="/categories" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '100%', padding: '16px', borderRadius: 18,
            background: '#fff',
            border: `1px solid ${BROWN}15`,
            textAlign: 'center', cursor: 'pointer',
            boxSizing: 'border-box',
            boxShadow: `0 4px 0 ${BROWN}10`,
          }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: `${BROWN}70` }}>
              Browse Categories
            </div>
          </div>
        </Link>

        {/* Streak */}
        {(profile?.streak ?? 0) > 0 && (
          <div style={{ textAlign: 'center', padding: '6px 0' }}>
            <div style={{
              display: 'inline-block',
              background: `${GOLD}15`,
              border: `1px solid ${GOLD}33`,
              borderRadius: 12, padding: '6px 18px',
            }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: GOLD }}>
                {profile.streak} day streak
              </span>
              {playedToday && (
                <span style={{ fontSize: 12, fontWeight: 700, color: `${BROWN}60`, marginLeft: 6 }}>
                  · Done today
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
