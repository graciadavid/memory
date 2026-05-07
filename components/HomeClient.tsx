'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import Onboarding from './Onboarding'

const BRAIN = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/brain-logo.png'
const LOGO = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/memory.png'
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
  if (!profile?.name) return null

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

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', width: '100%', gap: 12 }}>
          <img
            src={LOGO}
            alt="Memory"
            style={{
              height: 80, objectFit: 'contain',
              animation: 'floatBrain 3s ease-in-out infinite',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.1))',
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: BROWN, letterSpacing: -0.5, lineHeight: 1 }}>Memory</div>
            <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Match pairs by connection</div>
          </div>
        </div>



        {/* Greeting + streak */}
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginBottom: 4 }}>
            Your daily brain workout
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: BROWN }}>
            Hey, {profile.name}!
          </div>
          {(profile?.streak ?? 0) > 0 && (
            <div style={{ fontSize: 12, fontWeight: 800, color: `${GOLD}90`, marginTop: 3 }}>
              {profile.streak} day streak {playedToday ? '✓' : ''}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ width: '100%', padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>



          {/* Level buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {levels.map(level => (
              <Link key={level.label} href={`/play/${level.slug}`} style={{ textDecoration: 'none', flex: 1 }}>
                <div style={{
                  padding: '20px 8px', borderRadius: 20,
                  background: level.bg,
                  boxShadow: `0 8px 0 ${level.shadow}`,
                  textAlign: 'center', cursor: 'pointer',
                }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{level.label}</div>
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

          {/* Rankings */}
          <Link href="/ranking/memory" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', padding: '14px', borderRadius: 18,
              background: '#fff',
              border: '1.5px solid #4A2C0A20',
              textAlign: 'center', cursor: 'pointer',
              boxSizing: 'border-box',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/nav-trophy.png" alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
              <span style={{ fontSize: 14, fontWeight: 800, color: '#4A2C0A60' }}>Rankings</span>
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
