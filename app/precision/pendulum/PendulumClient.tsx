'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { completeWodExercise } from '@/lib/wod'
import { completePlanDay } from '@/lib/plan'
import CreateGroupBanner from '@/components/CreateGroupBanner'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const LOGO = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/pendulum.png'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const PURPLE = '#4A148C'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const PERIOD = 1400 // full swing in ms
const AMPLITUDE = 60 // max degrees

function getPendulumAngle(t: number): number {
  return AMPLITUDE * Math.sin((2 * Math.PI * t) / PERIOD)
}

function playTick(ctx: AudioContext) {
  try {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    g.gain.setValueAtTime(0.3, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.08)
  } catch(e) {}
}

export default function PendulumClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<'idle' | 'running' | 'result'>('idle')
  const [angle, setAngle] = useState(0)
  const [frozenAngle, setFrozenAngle] = useState(0)
  const [deviation, setDeviation] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [worldRecord, setWorldRecord] = useState<{ diff: number, name: string } | null>(null)
  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const lastTickSideRef = useRef<number>(0)

  useEffect(() => {
    supabase.from('precision_scores')
      .select('player_name, difference_ms')
      .eq('game_type', 'pendulum')
      .order('difference_ms', { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setWorldRecord({ diff: Math.round(data[0].difference_ms) / 10, name: data[0].player_name })
      })
  }, [])


  const startPendulum = useCallback(() => {
    audioCtxRef.current = new AudioContext()
    startRef.current = performance.now()
    setPhase('running')

    const tick = (now: number) => {
      const elapsed = now - startRef.current
      const a = getPendulumAngle(elapsed)
      setAngle(a)

      // Tick sound at extremes
      const side = a > 0 ? 1 : -1
      if (side !== lastTickSideRef.current && Math.abs(a) > AMPLITUDE * 0.9) {
        lastTickSideRef.current = side
        if (audioCtxRef.current) playTick(audioCtxRef.current)
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const stop = useCallback(async () => {
    if (phase !== 'running') return
    cancelAnimationFrame(rafRef.current)

    const now = performance.now()
    const elapsed = now - startRef.current
    const currentAngle = getPendulumAngle(elapsed)
    setFrozenAngle(currentAngle)

    // Find nearest center crossing time
    const cyclePos = elapsed % PERIOD
    const halfPeriod = PERIOD / 2
    const nearestCenter = cyclePos < halfPeriod / 2
      ? elapsed - cyclePos
      : cyclePos < halfPeriod
        ? elapsed - cyclePos + halfPeriod / 2
        : cyclePos < halfPeriod * 1.5
          ? elapsed - cyclePos + halfPeriod
          : elapsed - cyclePos + halfPeriod * 1.5

    const angleDev = Math.abs(Math.round(currentAngle * 10)) / 10  // degrees from center, 1 decimal
    const dev = Math.abs(Math.round(elapsed - nearestCenter))
    const clampedDev = Math.min(dev, PERIOD / 4)
    setDeviation(angleDev)
    setPhase('result')

    if (profile?.name) {
      await supabase.from('precision_scores').insert({
        player_name: profile.name,
        difference_ms: Math.round(angleDev * 10),  // store as tenths of degree * 10 for precision
        game_type: 'pendulum',
      })
        window.dispatchEvent(new Event('game_completed'))
      completeWodExercise(profile?.name || '', '/precision/pendulum')
      completePlanDay(profile?.name || profile?.name || '', '/precision/pendulum')

      const { data } = await supabase
        .from('precision_scores')
        .select('player_name, difference_ms')
        .eq('game_type', 'pendulum')
        .order('difference_ms', { ascending: true })
        .limit(500)

      if (data) {
        const best: Record<string, number> = {}
        data.forEach((s: any) => {
          if (!best[s.player_name] || s.difference_ms < best[s.player_name])
            best[s.player_name] = s.difference_ms
        })
        const myBest = Math.min(clampedDev, best[profile.name] || clampedDev)
        const rank = Object.values(best).filter(d => d < myBest).length + 1
        setWorldRank(rank)
        if (!bestScore || angleDev < bestScore) setBestScore(angleDev)
      }
    }
  }, [phase, profile?.name, bestScore])

  const reset = () => {
    cancelAnimationFrame(rafRef.current)
    setPhase('idle')
    setAngle(0)
    setFrozenAngle(0)
    setDeviation(0)
    setWorldRank(null)
    lastTickSideRef.current = 0
  }

  const displayAngle = angle

  return (
    <main style={{
      height: '100dvh',
      background: `radial-gradient(ellipse at 50% 0%, #F3E5F5 0%, ${CREAM} 50%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      overflow: 'hidden', paddingBottom: 80,
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', width: '100%', gap: 12 }}>
        <img src={LOGO} alt="Pendulum" style={{ height: 52, objectFit: 'contain', animation: 'floatLogo 3s ease-in-out infinite', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: PURPLE, letterSpacing: -0.5, lineHeight: 1 }}>Pendulum</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Stop it at the center</div>
        </div>
        <Link href="/precision" style={{ marginLeft: 'auto', textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: `1px solid ${BROWN}15`, borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 800, color: `${BROWN}60` }}>← Back</div>
        </Link>
      </div>

      {/* IDLE */}
      {phase === 'idle' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 24px', width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 6 }}>Stop the pendulum at center</div>
            <div style={{ fontSize: 13, color: `${BROWN}60`, lineHeight: 1.6 }}>
              Watch the pendulum swing.<br />Press STOP when it reaches the center.<br />Precision measured in milliseconds.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #4A2C0A10' }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Your best</div>
              {bestScore !== null ? (
                <div style={{ fontSize: 32, fontWeight: 900, color: PURPLE }}>{bestScore}°</div>
              ) : (
                <div style={{ fontSize: 14, color: '#4A2C0A30', fontWeight: 700 }}>—</div>
              )}
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #4A2C0A10' }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>World record</div>
              {worldRecord ? (
                <>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#C8960C' }}>{worldRecord.diff}°</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#4A2C0A60', marginTop: 4 }}>{worldRecord.name}</div>
                </>
              ) : (
                <div style={{ fontSize: 14, color: '#4A2C0A30', fontWeight: 700 }}>—</div>
              )}
            </div>
          </div>
          <button onClick={startPendulum} style={{
            width: '100%', padding: '18px', borderRadius: 20, border: 'none',
            background: PURPLE, color: '#fff',
            fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
            cursor: 'pointer', boxShadow: `0 8px 0 #4A148C60`,
          }}>Start</button>
        </div>
      )}

      {/* RUNNING + RESULT */}
      {phase === 'running' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, width: '100%', padding: '0 24px' }}>

          {/* Pendulum canvas */}
          <div style={{ position: 'relative', width: 200, height: 240, display: 'flex', justifyContent: 'center' }}>
            {/* Center line */}
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0,
              width: 1, background: `${BROWN}20`,
              transform: 'translateX(-50%)',
            }} />
            {/* Pivot point */}
            <div style={{
              position: 'absolute', top: 0, left: '50%',
              width: 14, height: 14, borderRadius: 7,
              background: PURPLE,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 2px 8px ${PURPLE}60`,
              zIndex: 2,
            }} />
            {/* Pendulum rod + bob */}
            <div style={{
              position: 'absolute', top: 0, left: '50%',
              width: 4, height: 200,
              transformOrigin: '50% 0%',
              transform: `translateX(-50%) rotate(${displayAngle}deg)`,
              transition: undefined,
            }}>
              <div style={{
                width: '100%', height: '100%',
                background: `linear-gradient(180deg, ${PURPLE}, ${PURPLE}AA)`,
                borderRadius: 2,
              }} />
              {/* Bob */}
              <div style={{
                position: 'absolute', bottom: -20, left: '50%',
                width: 40, height: 40, borderRadius: 20,
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD}AA)`,
                transform: 'translateX(-50%)',
                boxShadow: `0 4px 16px ${GOLD}60`,
              }} />
            </div>
          </div>
        )}

        {/* Result */}
        {phase === 'result' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Main result card */}
              <div style={{ width: '100%', background: '#fff', borderRadius: 24, padding: '24px', boxShadow: `0 8px 32px ${BROWN}15`, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}40`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>You stopped at</div>
                <div style={{ fontSize: 72, fontWeight: 900, color: BROWN, lineHeight: 1, marginBottom: 8 }}>
                  {frozenAngle > 0 ? '+' : ''}{frozenAngle.toFixed(1)}°
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: deviation < 2 ? '#2E7D32' : deviation < 5 ? '#2E7D32' : deviation < 15 ? '#E65100' : '#B71C1C' }}>
                  {deviation < 2 ? '🏆 Perfect!' : deviation < 5 ? '🔥 Excellent!' : deviation < 15 ? '⚡ Good' : '💪 Keep training'}
                </div>
                {bestScore !== null && (
                  <div style={{ fontSize: 12, color: `${BROWN}40`, fontWeight: 700, marginTop: 6 }}>Best: {bestScore}°</div>
                )}
              </div>

              {/* Deviation card */}
              <div style={{ width: '100%', background: deviation < 5 ? '#F1F8E9' : deviation < 15 ? '#FFF8E1' : '#FFEBEE', borderRadius: 20, padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Deviation from center</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: deviation < 5 ? '#2E7D32' : deviation < 15 ? '#E65100' : '#B71C1C', lineHeight: 1 }}>
                  {deviation < 0.1 ? '0.0' : deviation.toFixed(1)}°
                </div>
                <div style={{ fontSize: 13, color: `${BROWN}50`, marginTop: 8, fontWeight: 700 }}>
                  {frozenAngle > 0 ? 'Right of center' : frozenAngle < 0 ? 'Left of center' : 'Perfect center!'}
                </div>
              </div>

              {/* World ranking */}
              {worldRank && (
                <div style={{ width: '100%', background: 'linear-gradient(135deg, #0D2B5E, #1565C0)', borderRadius: 20, padding: '20px', textAlign: 'center', boxShadow: '0 8px 0 #0D2B5E60' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>World Ranking</div>
                  <div style={{ fontSize: 52, fontWeight: 900, color: '#FFD600', lineHeight: 1 }}>#{worldRank}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 4 }}>out of all players worldwide</div>
                </div>
              )}
            </div>
          )}

          {/* STOP button */}
          {phase === 'running' && (
            <button onClick={stop} style={{
              width: '100%', padding: '20px', borderRadius: 20, border: 'none',
              background: PURPLE, color: '#fff',
              fontSize: 22, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: `0 8px 0 #4A148C60`,
            }}>STOP</button>
          )}

          {phase === 'result' && (
            <>
              <CreateGroupBanner playerName={profile?.name || ''} />
              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <button onClick={reset} style={{ flex: 1, padding: '16px', borderRadius: 16, border: 'none', background: PURPLE, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${PURPLE}60` }}>Play again</button>
                <button onClick={() => window.location.href = '/precision/ranking'} style={{ flex: 1, padding: '16px', borderRadius: 16, border: 'none', background: '#0D2B5E', color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #0D2B5E60' }}>🏆 Ranking</button>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  )
}
