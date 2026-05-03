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
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      overflow: 'hidden', paddingBottom: 80,
    }}>

      {/* Top section — eagle + logo */}
      <div style={{ textAlign: 'center', paddingTop: 32, paddingBottom: 8 }}>

        {/* Eagle — large, centered */}
        <img
          src={EAGLE}
          alt="MemGenius"
          style={{
            width: 160, height: 160,
            objectFit: 'contain',
            filter: 'drop-shadow(0 12px 28px rgba(74,44,10,0.2))',
          }}
        />

        {/* Logo below eagle */}
        <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1, lineHeight: 1, marginTop: 4 }}>
          <span style={{ color: GOLD }}>Mem</span>
          <span style={{ color: BROWN }}>Genius</span>
        </div>

        {/* Greeting */}
        {profile?.name && (
          <div style={{ fontSize: 18, fontWeight: 800, color: BROWN, opacity: 0.5, marginTop: 6 }}>
            Hey, {profile.name}
          </div>
        )}

        {/* Streak */}
        {(profile?.streak ?? 0) > 0 && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${GOLD}18`,
            border: `1px solid ${GOLD}44`,
            borderRadius: 20, padding: '5px 14px', marginTop: 8,
          }}>
            <span style={{ fontSize: 13 }}>🔥</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: BROWN, opacity: 0.7 }}>
              {profile.streak} day streak {playedToday ? '· Done today' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 12, flex: 1, justifyContent: 'center' }}>

        {/* Daily Challenge */}
        <Link href={`/play/${dailySlug}`} style={{ textDecoration: 'none' }}>
          <div style={{
            width: '100%', padding: '20px 24px', borderRadius: 22,
            background: BROWN,
            boxShadow: `0 8px 0 ${BROWN}50, 0 16px 32px ${BROWN}30`,
            textAlign: 'center', cursor: 'pointer',
            boxSizing: 'border-box',
            border: `1px solid ${GOLD}33`,
          }}>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: GOLD, textTransform: 'uppercase', marginBottom: 4 }}>
              Daily Challenge
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
              {dailyTitle}
            </div>
            {playedToday && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 4 }}>
                Completed today
              </div>
            )}
          </div>
        </Link>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: `${BROWN}18` }} />
          <div style={{ fontSize: 10, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase' }}>
            Free Play
          </div>
          <div style={{ flex: 1, height: 1, background: `${BROWN}18` }} />
        </div>

        {/* Level buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {levels.map(level => (
            <Link key={level.label} href={`/play/${level.slug}`} style={{ textDecoration: 'none', flex: 1 }}>
              <div style={{
                padding: '18px 8px', borderRadius: 18,
                background: level.bg,
                boxShadow: `0 6px 0 ${level.shadow}, 0 10px 24px ${level.shadow}`,
                textAlign: 'center', cursor: 'pointer',
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
