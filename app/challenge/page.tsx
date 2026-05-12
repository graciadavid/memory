'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

const GAME_CONFIG: Record<string, { label: string, icon: string, color: string, url: string, unit: string }> = {
  memory: { label: 'Memory', icon: '/icons/memory.webp', color: BROWN, url: '/memory', unit: 'time' },
  digits: { label: 'Digits', icon: '/icons/digits.webp', color: '#1565C0', url: '/digits', unit: 'digits' },
  sequence: { label: 'Simon Says', icon: '/icons/sequence.webp', color: '#6A1B9A', url: '/sequence', unit: 'level' },
  flags: { label: 'Flags', icon: '/icons/flags.webp', color: '#00796B', url: '/flags', unit: 'flags' },
}

function fmt(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const c = Math.floor((ms % 1000) / 10)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
}

function ChallengeContent() {
  const params = useSearchParams()
  const router = useRouter()
  const { profile, createProfile } = usePlayer()

  const game = params.get('game') || 'flags'
  const score = params.get('score') || '0'
  const by = params.get('by') || 'Someone'

  const [name, setName] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  const config = GAME_CONFIG[game] || GAME_CONFIG.flags

  useEffect(() => {
    setMounted(true)
    // If already has profile, pre-fill name
    if (profile?.name) setName(profile.name)
  }, [profile?.name])

  const formatScore = () => {
    if (game === 'memory') return fmt(Number(score))
    if (game === 'digits') return `${score} digits`
    if (game === 'sequence') return `Level ${score}`
    return `${score} flags`
  }

  const handleAccept = async () => {
    if (!name.trim()) return
    setChecking(true)
    setError('')

    // If new name, check availability
    if (!profile?.name || profile.name !== name.trim()) {
      const { count } = await supabase.from('scores').select('*', { count: 'exact', head: true }).eq('player_name', name.trim())
      const { count: count2 } = await supabase.from('number_scores').select('*', { count: 'exact', head: true }).eq('player_name', name.trim())
      if ((count ?? 0) > 0 || (count2 ?? 0) > 0) {
        // Name exists — it's probably their name, allow it
      }
      createProfile(name.trim())
    }

    // Go to the game
    router.push(config.url)
  }

  if (!mounted) return null

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <main style={{
        height: '100dvh',
        background: `radial-gradient(ellipse at 50% 0%, #fff8ee 0%, ${CREAM} 50%, #EDE5D8 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-nunito), sans-serif',
        maxWidth: 430, margin: '0 auto',
        padding: '0 20px',
      }}>

        {/* Logo */}
        <img src="/icons/logomemgenius.webp" alt="MemGenius" style={{ height: 80, objectFit: 'contain', marginBottom: 24, animation: 'pulse 3s ease-in-out infinite' }} />

        {/* Challenge card */}
        <div style={{
          width: '100%', background: '#fff',
          borderRadius: 24, padding: '28px 24px',
          boxShadow: `0 16px 48px ${BROWN}20`,
          border: `1px solid ${GOLD}30`,
          animation: 'fadeUp 0.5s ease both',
          boxSizing: 'border-box',
        }}>
          {/* Game icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <img src={config.icon} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
            <div style={{ fontSize: 11, fontWeight: 800, color: config.color, letterSpacing: 2, textTransform: 'uppercase' }}>
              {config.label} Challenge
            </div>
          </div>

          {/* Challenge message */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 8 }}>
              <span style={{ color: config.color }}>{by}</span> challenges you!
            </div>
            <div style={{
              fontSize: 36, fontWeight: 900, color: BROWN,
              background: `${config.color}10`, borderRadius: 16,
              padding: '16px', marginBottom: 8,
            }}>
              {formatScore()}
            </div>
            <div style={{ fontSize: 14, color: `${BROWN}60`, fontWeight: 700 }}>
              Can you beat {by}?
            </div>
          </div>

          {/* Name input */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
              Your name
            </div>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && name.trim() && handleAccept()}
              maxLength={20}
              autoFocus={!profile?.name}
              style={{
                width: '100%', padding: '14px 16px',
                borderRadius: 14, border: `2px solid ${error ? '#B71C1C' : BROWN}20`,
                background: CREAM, color: BROWN,
                fontSize: 16, fontWeight: 800,
                fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {error && <div style={{ fontSize: 11, color: '#B71C1C', fontWeight: 700, marginTop: 6 }}>{error}</div>}
          </div>

          {/* Accept button */}
          <button
            onClick={handleAccept}
            disabled={!name.trim() || checking}
            style={{
              width: '100%', padding: '18px',
              borderRadius: 18, border: 'none',
              background: name.trim() ? config.color : '#e0e0e0',
              color: name.trim() ? '#fff' : '#aaa',
              fontSize: 18, fontWeight: 900,
              fontFamily: 'inherit',
              cursor: name.trim() ? 'pointer' : 'default',
              boxShadow: name.trim() ? `0 8px 0 ${config.color}60` : 'none',
              transition: 'all 0.2s',
            }}
          >
            {checking ? 'Loading...' : `Accept the challenge →`}
          </button>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 20, fontSize: 12, color: `${BROWN}40`, fontWeight: 700 }}>
          Free to play · No signup required
        </div>
      </main>
    </>
  )
}

export default function ChallengePage() {
  return (
    <Suspense>
      <ChallengeContent />
    </Suspense>
  )
}
