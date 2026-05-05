'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import Onboarding from './Onboarding'

const BRAIN = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/brain-logo.png'
const LOGO = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/logomemgenius.png'
const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

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
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

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
    <>
      <style>{`
        @keyframes floatBrain {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <main style={{
        height: '100dvh',
        background: `radial-gradient(ellipse at 50% 0%, #fff8ee 0%, #FAF7F2 40%, #EDE5D8 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'var(--font-nunito), sans-serif',
        maxWidth: 430, margin: '0 auto',
        overflow: 'hidden', paddingBottom: 80,
      }}>

        {/* Brain mascot */}
        <img
          src={BRAIN}
          alt=""
          style={{
            width: 110, height: 110,
            objectFit: 'contain',
            marginTop: 28,
            animation: 'floatBrain 3s ease-in-out infinite',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))',
          }}
        />

        {/* Logo image */}
        <img
          src={LOGO}
          alt="MemGenius"
          style={{
            height: 70,
            objectFit: 'contain',
            marginTop: 8,
          }}
        />

        {/* Claim */}
        <div style={{
          fontSize: 13, color: `${BROWN}55`,
          fontStyle: 'italic', fontFamily: 'Georgia, serif',
          marginTop: 4,
        }}>
          Your daily brain workout
        </div>

        {/* Greeting + streak */}
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: BROWN }}>
            Hey, {profile.name}!
          </div>
          {(profile?.streak ?? 0) > 0 && (
            <div style={{ fontSize: 12, fontWeight: 800, color: `${GOLD}90`, marginTop: 3 }}>
              {profile.streak} day streak {playedToday ? '✓' : ''}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ width: '100%', padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Daily Challenge */}
          <Link href={`/play/${dailySlug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', padding: '20px 24px', borderRadius: 22,
              background: `linear-gradient(135deg, ${BROWN} 0%, #2C1A05 100%)`,
              boxShadow: `0 8px 0 ${BROWN}60`,
              textAlign: 'center', cursor: 'pointer',
              boxSizing: 'border-box',
            }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 4, color: GOLD, textTransform: 'uppercase', marginBottom: 5 }}>
                ⚡ Daily Challenge
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>
                {playedToday ? 'Completed today ✓' : "Play Today's Game"}
              </div>
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

          {/* Categories */}
          <Link href="/categories" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', padding: '16px', borderRadius: 18,
              background: '#1565C0',
              boxShadow: '0 6px 0 #0D47A160',
              textAlign: 'center', cursor: 'pointer',
              boxSizing: 'border-box',
            }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>Categories</span>
            </div>
          </Link>

          {/* Footer */}
          <div style={{ textAlign: 'center', paddingTop: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: `${BROWN}35`, letterSpacing: 1 }}>
              Always free · No ads · No login
            </div>
            <a href="/privacy" style={{ fontSize: 10, color: `${BROWN}25`, textDecoration: 'none', fontWeight: 600 }}>
              Privacy Policy
            </a>
          </div>

        </div>
      </main>
    </>
  )
}
