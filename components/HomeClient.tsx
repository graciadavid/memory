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

      {/* Header — logo + eagle inline */}
      <div style={{ textAlign: 'center', paddingTop: 36 }}>
        <img
          src={EAGLE}
          alt="MemGenius"
          style={{
            width: 90, height: 90,
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 16px rgba(74,44,10,0.15))',
            display: 'block',
            margin: '0 auto 10px',
          }}
        />
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, lineHeight: 1 }}>
          <span style={{ color: GOLD }}>Mem</span>
          <span style={{ color: BROWN }}>Genius</span>
        </div>
        <div style={{
          fontSize: 14, color: `${BROWN}60`,
          fontStyle: 'italic',
          fontFamily: 'Georgia, serif',
          marginTop: 5,
        }}>
          Your daily brain workout
        </div>

        {/* Name + streak inline */}
        <div style={{
          marginTop: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: BROWN }}>
            {profile.name}
          </div>
          {(profile?.streak ?? 0) > 0 && (
            <div style={{
              background: `${GOLD}15`,
              border: `1px solid ${GOLD}33`,
              borderRadius: 20, padding: '3px 10px',
              fontSize: 12, fontWeight: 800, color: GOLD,
            }}>
              {profile.streak} day streak {playedToday ? '✓' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ width: '100%', padding: '24px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Daily Challenge */}
        <Link href={`/play/${dailySlug}`} style={{ textDecoration: 'none' }}>
          <div style={{
            width: '100%', padding: '20px 24px', borderRadius: 20,
            background: BROWN,
            boxShadow: `0 8px 0 ${BROWN}50`,
            textAlign: 'center', cursor: 'pointer',
            boxSizing: 'border-box',
          }}>
            <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 2, color: GOLD, textTransform: 'uppercase' }}>
              Daily Challenge
            </div>
            {playedToday && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 4 }}>
                Completed today
              </div>
            )}
          </div>
        </Link>

        {/* Level buttons */}
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

        {/* Categories — subtle */}
        <Link href="/categories" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '100%', padding: '14px', borderRadius: 18,
            background: 'transparent',
            border: `1.5px solid ${BROWN}20`,
            textAlign: 'center', cursor: 'pointer',
            boxSizing: 'border-box',
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: `${BROWN}60`, letterSpacing: 0.5 }}>
              Categories
            </div>
          </div>
        </Link>

      </div>
    </main>
  )
}
