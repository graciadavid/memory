'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const LOGO = `${BASE}/logomemgenius.png`
const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

export default function LandingPage() {
  const { profile, loaded, createProfile } = usePlayer()
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  const handleSave = async () => {
    if (!name.trim()) return
    setChecking(true)
    setError('')

    const { count } = await supabase
      .from('scores')
      .select('*', { count: 'exact', head: true })
      .eq('player_name', name.trim())

    if ((count ?? 0) > 0) {
      setError(`"${name.trim()}" is already taken. Choose another.`)
      setChecking(false)
      return
    }

    createProfile(name.trim())
    setChecking(false)
  }

  if (!loaded) return null

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
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-nunito), sans-serif',
        maxWidth: 430, margin: '0 auto',
        padding: '0 20px',
      }}>

        {/* Logo */}
        <img
          src={LOGO}
          alt="MemGenius"
          style={{
            height: 160, objectFit: 'contain',
            animation: 'floatLogo 3s ease-in-out infinite',
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.1))',
            marginBottom: 8,
          }}
        />

        {/* Claim */}
        <div style={{
          fontSize: 14, color: `${BROWN}55`,
          fontStyle: 'italic', fontFamily: 'Georgia, serif',
          marginBottom: 24, letterSpacing: 0.3,
        }}>
          Your daily brain workout
        </div>

        {/* Name input or greeting */}
        {!profile?.name ? (
          <div style={{ width: '100%', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, textAlign: 'center' }}>
              Your name
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={e => { setName(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                maxLength={20}
                autoFocus
                style={{
                  flex: 1, padding: '12px 14px',
                  borderRadius: 14,
                  border: error ? '2px solid #B71C1C' : `2px solid ${BROWN}18`,
                  background: '#fff', color: BROWN,
                  fontSize: 16, fontWeight: 800,
                  fontFamily: 'inherit', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={handleSave}
                disabled={!name.trim() || checking}
                style={{
                  padding: '12px 18px', borderRadius: 14, border: 'none',
                  background: name.trim() ? BROWN : '#e0d9cf',
                  color: name.trim() ? '#fff' : '#aaa',
                  fontSize: 14, fontWeight: 900,
                  fontFamily: 'inherit',
                  cursor: name.trim() ? 'pointer' : 'default',
                  boxShadow: name.trim() ? `0 6px 0 ${BROWN}50` : 'none',
                  flexShrink: 0,
                }}
              >
                {checking ? '...' : 'Save'}
              </button>
            </div>
            {error && (
              <div style={{ fontSize: 11, color: '#B71C1C', fontWeight: 700, marginTop: 6, textAlign: 'center' }}>
                {error}
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 16 }}>
            Hey, {profile.name}!
          </div>
        )}

        {/* Game buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/memory" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', borderRadius: 22,
              background: BROWN,
              boxShadow: `0 8px 0 ${BROWN}60`,
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
              cursor: 'pointer', boxSizing: 'border-box',
              opacity: mounted ? 1 : 0,
              animation: mounted ? 'fadeUp 0.5s ease 0.1s both' : 'none',
            }}>
              <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/brain-green.png" alt="" style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>Memory</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>
                  Match pairs by connection
                </div>
              </div>
            </div>
          </Link>

          <Link href="/digits" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', borderRadius: 22,
              background: '#1565C0',
              boxShadow: '0 8px 0 #0D47A160',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
              cursor: 'pointer', boxSizing: 'border-box',
              opacity: mounted ? 1 : 0,
              animation: mounted ? 'fadeUp 0.5s ease 0.2s both' : 'none',
            }}>
              <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/1234.png" alt="" style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>Digits</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>
                  How many digits can you remember?
                </div>
              </div>
            </div>
          </Link>
          <Link href="/sequence" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%', borderRadius: 22,
              background: '#6A1B9A',
              boxShadow: '0 8px 0 #4A148C60',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
              cursor: 'pointer', boxSizing: 'border-box',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, width: 48, height: 48, flexShrink: 0 }}>
                {['#F44336','#2196F3','#4CAF50','#FFEB3B'].map(c => (
                  <div key={c} style={{ borderRadius: 6, background: c }} />
                ))}
              </div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>Sequence</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>
                  Repeat the pattern
                </div>
              </div>
            </div>
          </Link>

          <Link href="/flags" style={ textDecoration: 'none' }>
            <div style={{
              width: '100%', borderRadius: 22,
              background: '#00796B',
              boxShadow: '0 8px 0 #00695160',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
              cursor: 'pointer', boxSizing: 'border-box',
            }}>
              <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/flags.png" alt="" style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>Flags</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>
                  How many flags in a row?
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: `${BROWN}30`, letterSpacing: 1 }}>
            Always free · No ads · No login
          </div>
          <a href="/privacy" style={{ fontSize: 10, color: `${BROWN}20`, textDecoration: 'none', fontWeight: 600 }}>
            Privacy Policy
          </a>
        </div>

      </main>
    </>
  )
}
