'use client'
// v3
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import Onboarding from './Onboarding'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const LOGO = `${BASE}/memory.webp`
const TROPHY = `${BASE}/nav-trophy.webp`
const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

interface Props {
  easy: string | null
  medium: string | null
  hard: string | null
}

export default function HomeClient({ easy, medium, hard }: Props) {
  const { profile, loaded, createProfile } = usePlayer()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  if (!loaded || !profile?.name) {
    if (loaded && !profile?.name && typeof window !== 'undefined') window.location.href = '/'
    return null
  }

  const levels = [
    { slug: easy, label: 'Easy', bg: '#2E7D32', shadow: '#1B5E2060' },
    { slug: medium, label: 'Medium', bg: '#E65100', shadow: '#BF360C60' },
    { slug: hard, label: 'Hard', bg: '#B71C1C', shadow: '#7F000060' },
  ]

  return (
    <>
      <style>{`
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main style={{
        height: '100dvh',
        background: `radial-gradient(ellipse at 50% 0%, #fff8ee 0%, ${CREAM} 40%, #EDE5D8 100%)`,
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
              height: 70, objectFit: 'contain',
              animation: 'floatLogo 3s ease-in-out infinite',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.1))',
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: BROWN, letterSpacing: -0.5, lineHeight: 1 }}>Memory</div>
            <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Match pairs by connection</div>
          </div>
        </div>

        {/* Greeting */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '0 20px', gap: 12, width: '100%',
          animation: mounted ? 'fadeUp 0.5s ease both' : 'none',
        }}>

          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 6 }}>Find the matching pairs</div>
            <div style={{ fontSize: 13, color: `${BROWN}60`, lineHeight: 1.6 }}>
              Cards are connected, not identical.<br />The Eiffel Tower goes with Paris.<br />How fast can you match them all?
            </div>
          </div>

          {/* Level buttons */}
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
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
          <Link href="/categories" style={{ textDecoration: 'none', width: '100%' }}>
            <div style={{
              width: '100%', padding: '18px', borderRadius: 20,
              background: '#1565C0',
              boxShadow: '0 8px 0 #0D47A160',
              textAlign: 'center', cursor: 'pointer',
              boxSizing: 'border-box',
            }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>Categories</span>
            </div>
          </Link>

          {/* Rankings */}
          <Link href="/ranking/memory" style={{ textDecoration: 'none', width: '100%' }}>
            <div style={{
              width: '100%', padding: '16px', borderRadius: 18,
              background: '#fff',
              border: `1.5px solid ${BROWN}20`,
              textAlign: 'center', cursor: 'pointer',
              boxSizing: 'border-box',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: `0 4px 12px ${BROWN}08`,
            }}>
              <img src={TROPHY} alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} />
              <span style={{ fontSize: 15, fontWeight: 800, color: `${BROWN}70` }}>World Ranking</span>
            </div>
          </Link>

          {/* Footer */}
          <div style={{ textAlign: 'center', paddingTop: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: `${BROWN}30`, letterSpacing: 1 }}>
              Always free · No ads · No login
            </div>
            <a href="/privacy" style={{ fontSize: 10, color: `${BROWN}20`, textDecoration: 'none', fontWeight: 600 }}>
              Privacy Policy
            </a>
          </div>

        </div>
      </main>
    </>
  )
}
