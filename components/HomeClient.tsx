'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import Onboarding from './Onboarding'

const EAGLE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/eagle.png'
const GOLD = '#C8960C'
const BROWN = '#4A2C0A'

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

  useEffect(() => {
    setTimeout(() => setMounted(true), 50)
  }, [])

  if (!loaded) return null
  if (!profile?.name) return <Onboarding onCreate={createProfile} />

  const today = new Date().toISOString().split('T')[0]
  const playedToday = profile?.lastPlayedDate === today

  const levels = [
    { slug: easy, label: 'Easy', bg: '#2E7D32', shadow: '#1B5E20' },
    { slug: medium, label: 'Medium', bg: '#E65100', shadow: '#BF360C' },
    { slug: hard, label: 'Hard', bg: '#B71C1C', shadow: '#7F0000' },
  ]

  return (
    <>
      <style>{`
        @keyframes floatEagle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,150,12,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(200,150,12,0); }
        }
        .btn-level:active { transform: translateY(3px); transition: transform 0.1s; }
        .btn-daily:active { transform: translateY(4px); transition: transform 0.1s; }
      `}</style>

      <main style={{
        height: '100dvh',
        background: `radial-gradient(ellipse at 50% 0%, #fff8ee 0%, #FAF7F2 40%, #EDE5D8 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'var(--font-nunito), sans-serif',
        maxWidth: 430, margin: '0 auto',
        overflow: 'hidden', paddingBottom: 80,
        position: 'relative',
      }}>

        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -80, right: -60,
          width: 220, height: 220, borderRadius: '50%',
          background: `radial-gradient(circle, ${GOLD}15, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 40, left: -80,
          width: 180, height: 180, borderRadius: '50%',
          background: `radial-gradient(circle, ${BROWN}08, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Eagle — floating */}
        <div style={{
          marginTop: 28,
          animation: 'floatEagle 3s ease-in-out infinite',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
          <img
            src={EAGLE}
            alt="MemGenius"
            style={{
              width: 100, height: 100,
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 24px rgba(74,44,10,0.25))',
              display: 'block',
            }}
          />
        </div>

        {/* Logo */}
        <div style={{
          marginTop: 10, textAlign: 'center',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'fadeUp 0.6s ease 0.1s both' : 'none',
        }}>
          <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1 }}>
            <span style={{
              background: `linear-gradient(135deg, ${GOLD}, #E8A800)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Mem</span>
            <span style={{ color: BROWN }}>Genius</span>
          </div>
          <div style={{
            fontSize: 13, color: `${BROWN}55`,
            fontStyle: 'italic', fontFamily: 'Georgia, serif',
            marginTop: 4, letterSpacing: 0.3,
          }}>
            Your daily brain workout
          </div>
        </div>

        {/* Greeting + streak */}
        <div style={{
          marginTop: 16, textAlign: 'center',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'fadeUp 0.6s ease 0.2s both' : 'none',
        }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: BROWN, letterSpacing: -0.5 }}>
            Hey, {profile.name}!
          </div>
          {(profile?.streak ?? 0) > 0 && (
            <div style={{ marginTop: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: `${GOLD}90`, fontFamily: 'var(--font-nunito), sans-serif' }}>
                {profile.streak} day streak
              </span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{
          width: '100%', padding: '20px 20px 0',
          display: 'flex', flexDirection: 'column', gap: 10,
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'fadeUp 0.6s ease 0.3s both' : 'none',
        }}>

          {/* Daily Challenge — hero button */}
          <Link href={`/play/${dailySlug}`} style={{ textDecoration: 'none' }} className="btn-daily">
            <div style={{
              width: '100%', padding: '20px 24px', borderRadius: 22,
              background: `linear-gradient(135deg, ${BROWN} 0%, #2C1A05 100%)`,
              boxShadow: `0 8px 0 ${BROWN}60, 0 16px 40px ${BROWN}25`,
              textAlign: 'center', cursor: 'pointer',
              boxSizing: 'border-box',
              position: 'relative', overflow: 'hidden',
              animation: playedToday ? 'none' : 'pulse 2s ease-in-out infinite',
            }}>
              {/* Shine effect */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite',
              }} />
              <div style={{
                fontSize: 10, fontWeight: 900, letterSpacing: 4,
                color: GOLD, textTransform: 'uppercase', marginBottom: 5,
              }}>
                ⚡ Daily Challenge
              </div>
              <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', letterSpacing: -0.3 }}>
                {playedToday ? 'Completed today ✓' : "Play Today's Game"}
              </div>
            </div>
          </Link>

          {/* Level buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            {levels.map((level, i) => (
              <Link key={level.label} href={`/play/${level.slug}`} style={{ textDecoration: 'none', flex: 1 }} className="btn-level">
                <div style={{
                  padding: '16px 8px', borderRadius: 18,
                  background: `linear-gradient(145deg, ${level.bg}, ${level.shadow})`,
                  boxShadow: `0 6px 0 ${level.shadow}80`,
                  textAlign: 'center', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: -10, right: -10,
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                  }} />
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', position: 'relative' }}>{level.label}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Categories */}
          <Link href="/categories" style={{ textDecoration: 'none', marginTop: 6 }}>
            <div style={{
              width: '100%', padding: '16px', borderRadius: 18,
              background: '#1565C0',
              boxShadow: '0 6px 0 #0D47A160',
              textAlign: 'center', cursor: 'pointer',
              boxSizing: 'border-box',
            }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: 0.3 }}>
                Categories
              </span>
            </div>
          </Link>

        </div>
      </main>
    </>
  )
}
