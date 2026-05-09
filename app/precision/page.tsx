'use client'
import { useState, useRef, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const PURPLE = '#4A148C'
const TARGET = 5000 // 5 seconds in ms

export default function PrecisionPage() {
  const { profile } = usePlayer()
  const router = useRouter()
  const [phase, setPhase] = useState<'idle' | 'running' | 'result'>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [difference, setDifference] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('precision_scores')
      .select('difference_ms')
      .eq('player_name', profile.name)
      .order('difference_ms', { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setBestScore(data[0].difference_ms)
      })
  }, [profile?.name])

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const cs = Math.floor((ms % 1000) / 10)
    return `${s}.${String(cs).padStart(2, '0')}`
  }

  const fmtDiff = (ms: number) => {
    if (ms === 0) return 'PERFECT!'
    return `${ms > 0 ? '+' : ''}${(ms / 1000).toFixed(3)}s`
  }

  const start = () => {
    startRef.current = Date.now()
    setElapsed(0)
    setPhase('running')

    const tick = () => {
      const now = Date.now() - startRef.current
      setElapsed(now)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const stop = async () => {
    cancelAnimationFrame(rafRef.current)
    const final = Date.now() - startRef.current
    setElapsed(final)
    const diff = final - TARGET
    setDifference(diff)
    setPhase('result')

    if (profile?.name) {
      await supabase.from('precision_scores').insert({
        player_name: profile.name,
        difference_ms: Math.abs(diff),
      })

      // Get world rank
      const { count } = await supabase
        .from('precision_scores')
        .select('*', { count: 'exact', head: true })
        .lt('difference_ms', Math.abs(diff))
      setWorldRank((count ?? 0) + 1)

      if (bestScore === null || Math.abs(diff) < bestScore) {
        setBestScore(Math.abs(diff))
      }
    }
  }

  const reset = () => {
    setPhase('idle')
    setElapsed(0)
    setDifference(0)
    setWorldRank(null)
  }

  return (
    <main style={{
      height: '100dvh',
      background: `radial-gradient(ellipse at 50% 0%, #EDE7F6 0%, ${CREAM} 50%, #F5EDD8 100%)`,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', gap: 12 }}>
        <div style={{ fontSize: 52, flexShrink: 0 }}>⏱</div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: PURPLE, letterSpacing: -0.5 }}>Precision</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Stop exactly at 5 seconds</div>
        </div>
      </div>

      {/* Game area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 24 }}>

        {phase === 'idle' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Target</div>
              <div style={{ fontSize: 72, fontWeight: 900, color: PURPLE, letterSpacing: -2 }}>5.00</div>
              <div style={{ fontSize: 14, color: `${BROWN}50`, marginTop: 8 }}>Press Start, then Stop at exactly 5 seconds</div>
            </div>

            {bestScore !== null && (
              <div style={{ background: `${PURPLE}10`, borderRadius: 16, padding: '12px 24px', textAlign: 'center', border: `1px solid ${PURPLE}20` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: PURPLE, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Your best</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: BROWN }}>{(bestScore / 1000).toFixed(3)}s off</div>
              </div>
            )}

            <button onClick={start} style={{
              width: '100%', padding: '20px', borderRadius: 20, border: 'none',
              background: PURPLE, color: '#fff',
              fontSize: 20, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: `0 8px 0 ${PURPLE}60`,
            }}>Start</button>
          </>
        )}

        {phase === 'running' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Time</div>
              <div style={{ fontSize: 80, fontWeight: 900, color: elapsed > TARGET ? '#B71C1C' : PURPLE, letterSpacing: -3, fontVariantNumeric: 'tabular-nums' }}>
                {fmt(elapsed)}
              </div>
              <div style={{ fontSize: 14, color: `${BROWN}40`, marginTop: 8 }}>Target: 5.00</div>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: 8, background: `${BROWN}10`, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min((elapsed / TARGET) * 100, 100)}%`,
                background: elapsed > TARGET ? '#B71C1C' : PURPLE,
                borderRadius: 4, transition: 'none',
              }} />
            </div>

            <button onClick={stop} style={{
              width: '100%', padding: '24px', borderRadius: 20, border: 'none',
              background: '#B71C1C', color: '#fff',
              fontSize: 24, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: '0 8px 0 #7F000060',
            }}>STOP</button>
          </>
        )}

        {phase === 'result' && (
          <>
            <div style={{ width: '100%', background: '#fff', borderRadius: 24, padding: '28px 24px', boxShadow: `0 8px 32px ${BROWN}15`, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>You stopped at</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: BROWN, letterSpacing: -2, marginBottom: 4 }}>{fmt(elapsed)}</div>
              <div style={{ fontSize: 11, color: `${BROWN}40`, marginBottom: 20 }}>Target was 5.00</div>

              <div style={{ background: Math.abs(difference) < 100 ? '#E8F5E9' : Math.abs(difference) < 500 ? '#FFF8E1' : '#FFEBEE', borderRadius: 16, padding: '16px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Difference</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: Math.abs(difference) < 100 ? '#2E7D32' : Math.abs(difference) < 500 ? GOLD : '#B71C1C' }}>
                  {difference === 0 ? '🎯 PERFECT!' : `${difference > 0 ? '+' : ''}${(difference / 1000).toFixed(3)}s`}
                </div>
                <div style={{ fontSize: 12, color: `${BROWN}50`, marginTop: 4 }}>
                  {difference > 0 ? 'Too slow' : difference < 0 ? 'Too fast' : 'Perfect!'}
                </div>
              </div>

              {worldRank && (
                <div style={{ fontSize: 14, color: `${BROWN}60`, fontWeight: 700, marginBottom: 16 }}>
                  World Ranking: <span style={{ color: GOLD, fontWeight: 900 }}>#{worldRank}</span>
                </div>
              )}
            </div>

            <button onClick={() => {
              const url = `${window.location.origin}/challenge?game=precision&score=${Math.abs(difference)}&by=${encodeURIComponent(profile?.name || 'Someone')}`
              const text = `⏱ ${profile?.name} stopped at ${(difference / 1000).toFixed(3)}s off on MemGenius Precision! Can you be more precise? ${url}`
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
            }} style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: '#25D366', color: '#fff', fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #128C7E60',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}><span style={{ fontSize: 20 }}>📲</span> Send to WhatsApp</button>

            <button onClick={reset} style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: PURPLE, color: '#fff', fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${PURPLE}60`,
            }}>Play again</button>
          </>
        )}
      </div>
    </main>
  )
}
