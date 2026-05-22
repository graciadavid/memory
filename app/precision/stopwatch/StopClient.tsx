'use client'
import { useState, useRef, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { completeWodExercise } from '@/lib/wod'
import { completePlanDay } from '@/lib/plan'
import { useRouter } from 'next/navigation'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const PURPLE = '#4A148C'
const TARGET = 5000 // 5 seconds in ms
const LOGO = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/precision.png'

export default function StopClient() {
  const { profile } = usePlayer()
  const router = useRouter()
  const [phase, setPhase] = useState<'idle' | 'running' | 'result'>('idle')
 const [countdown, setCountdown] = useState<number | null>(null)

 useEffect(() => {
   const params = new URLSearchParams(window.location.search)
   if (params.get('autostart') === 'true') {
     setCountdown(3)
     const t1 = setTimeout(() => setCountdown(2), 1000)
     const t2 = setTimeout(() => setCountdown(1), 2000)
     const t3 = setTimeout(() => { setCountdown(null) }, 3000)
     return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
   }
 }, [])
  const [elapsed, setElapsed] = useState(0)
  const [difference, setDifference] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [wodReps, setWodReps] = useState<{ done: number, total: number } | null>(null)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [bestRank, setBestRank] = useState<number | null>(null)
  const [worldRecord, setWorldRecord] = useState<{ diff: number, name: string } | null>(null)
  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    // World record
    supabase.from('precision_scores')
      .select('player_name, difference_ms')
      .is('game_type', null)
      .order('difference_ms', { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setWorldRecord({ diff: data[0].difference_ms, name: data[0].player_name })
      })
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
        window.dispatchEvent(new Event('game_completed'))
      completeWodExercise(profile?.name || '', '/precision/stopwatch')
      await completePlanDay(profile.name, '/precision/stopwatch')
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
     // Store result and redirect to rules
     sessionStorage.setItem('stop_last_result', JSON.stringify({ difference: diff }))
     setTimeout(() => { window.location.href = '/precision/stopwatch/rules' }, 1500)

     // Check WOD completion and redirect
       try {
         const { checkAndSaveWodCompletion } = await import('@/lib/wod')
         const shouldRedirect = await checkAndSaveWodCompletion(profile.name, '/precision/stopwatch')
         if (shouldRedirect) {
           setTimeout(() => { window.location.href = '/my-plan' }, 1500)
         }
       } catch(e) {}
   }
 }

  const reset = () => {
    setPhase('idle')
    setElapsed(0)
    setDifference(0)
    setWorldRank(null)
  }

  return (
    <>
    <main style={{
      height: '100dvh',
      background: `radial-gradient(ellipse at 50% 0%, #EDE7F6 0%, ${CREAM} 50%, #F5EDD8 100%)`,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      overflow: 'auto', paddingBottom: 80,
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', gap: 12 }}>
        <img src={LOGO} alt='Stop' style={{ height: 52, objectFit: 'contain', animation: 'floatLogo 3s ease-in-out infinite', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: PURPLE, letterSpacing: -0.5 }}>Stop</div>
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

            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #4A2C0A10' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Your best</div>
                {bestScore !== null ? (
                  <div style={{ fontSize: 32, fontWeight: 900, color: PURPLE }}>{(bestScore/1000).toFixed(3)}s</div>
                ) : (
                  <div style={{ fontSize: 14, color: '#4A2C0A30', fontWeight: 700 }}>—</div>
                )}
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #4A2C0A10' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>World record</div>
                {worldRecord ? (
                  <>
                    <div style={{ fontSize: 32, fontWeight: 900, color: GOLD }}>{(worldRecord.diff/1000).toFixed(3)}s</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#4A2C0A60', marginTop: 4 }}>{worldRecord.name}</div>
                  </>
                ) : (
                  <div style={{ fontSize: 14, color: '#4A2C0A30', fontWeight: 700 }}>—</div>
                )}
              </div>
            </div>

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
            {/* Card 1: This game result + world rank */}
            <div style={{ width: '100%', background: '#fff', borderRadius: 24, padding: '24px', boxShadow: `0 8px 32px ${BROWN}15`, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}40`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Difference from 5s</div>
              <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: -2, lineHeight: 1, color: difference === 0 ? '#2E7D32' : Math.abs(difference) < 100 ? '#2E7D32' : Math.abs(difference) < 500 ? '#E65100' : '#B71C1C' }}>
                {difference === 0 ? '🎯 0.000s' : `${difference > 0 ? '+' : ''}${(difference / 1000).toFixed(3)}s`}
              </div>
              <div style={{ fontSize: 12, color: `${BROWN}40`, fontWeight: 700, marginTop: 4 }}>
                {difference > 0 ? 'Too slow' : difference < 0 ? 'Too fast' : 'Perfect!'}
              </div>
              {worldRank && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BROWN}10` }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: `${BROWN}30`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>This game · World Ranking</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#0D1B4B', lineHeight: 1 }}>#{worldRank}</div>
                </div>
              )}
            </div>

            {/* Card 2: Best time + best rank + Train more */}
            {bestScore !== null && (
              <div style={{ width: '100%', background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}08)`, border: `1.5px solid ${GOLD}40`, borderRadius: 24, padding: '20px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Your best</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: BROWN, lineHeight: 1 }}>{(bestScore/1000).toFixed(3)}s</div>
                {bestRank && (
                  <div style={{ fontSize: 13, color: GOLD, fontWeight: 900, marginTop: 4 }}>#{bestRank} in the world</div>
                )}
                <button onClick={reset} style={{
                  width: '100%', marginTop: 16, padding: '14px', borderRadius: 14, border: 'none',
                  background: '#2E7D32', color: '#fff', fontSize: 15, fontWeight: 900,
                  fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #1B5E2060',
                }}>Try again</button>
              </div>
            )}

           {/* Buttons */}
           <div style={{ display: 'flex', gap: 10, width: '100%' }}>
             <button onClick={reset} style={{ flex: 1, padding: '14px', borderRadius: 14, border: 'none', background: PURPLE, color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${PURPLE}60` }}>Play again</button>
             <button onClick={() => window.location.href = '/precision/stopwatch/rules'} style={{ flex: 1, padding: '14px', borderRadius: 14, border: 'none', background: '#0D1B4B', color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #08103060' }}>See results</button>
           </div>
          </>
        )}
      </div>
    </main>

    {/* SEO Content */}
    <section style={{
      maxWidth: 430, margin: '0 auto',
      padding: '48px 24px 120px',
      fontFamily: 'var(--font-nunito), sans-serif',
      background: '#FAF7F2',
    }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>
        Stop — Precision Timing Game
      </h2>
      <p style={{ fontSize: 14, color: '#4A2C0A99', lineHeight: 1.8, marginBottom: 24 }}>
        Stop is a pure precision challenge. A timer starts running and your goal is to stop it at exactly 5 seconds — no more, no less. Your score is measured by deviation in milliseconds. The closer you are to 5.000 seconds, the higher you rank on the world leaderboard. Sounds simple. It is not.
      </p>
      <p style={{ fontSize: 14, color: '#4A2C0A99', lineHeight: 1.8, marginBottom: 32 }}>
        Stop trains your internal sense of time — a surprisingly trainable cognitive skill. Studies show that people who regularly practice timing tasks develop a more accurate internal clock. Top players on the world ranking consistently stop within 10 milliseconds of the target. Can you join them?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { q: 'How does Stop work?', a: 'Press start and a timer begins counting. Press stop when you think exactly 5 seconds have passed. Your deviation from 5.000s is your score — lower is better.' },
          { q: 'How is the score calculated?', a: 'Your score is the absolute difference between when you stopped and the 5 second target, measured in milliseconds. A score of 0ms would be a perfect stop.' },
          { q: 'Can you actually improve at this?', a: 'Yes. Your internal sense of time is trainable. With regular practice most players see their average deviation drop significantly within a few weeks.' },
          { q: 'Is Stop free to play?', a: 'Completely free, no login required. Your best score is submitted to the world ranking automatically.' },
          { q: 'Can I play on mobile?', a: 'Yes, Stop works perfectly on mobile. Just tap the screen to start and stop the timer.' },
        ].map((item, i) => (
          <details key={i} style={{
            background: '#fff', borderRadius: 14,
            border: '1px solid #4A2C0A15',
            padding: '14px 18px',
          }}>
            <summary style={{
              fontSize: 14, fontWeight: 800, color: '#4A2C0A',
              cursor: 'pointer', listStyle: 'none',
            }}>
              {item.q}
            </summary>
            <p style={{ fontSize: 13, color: '#4A2C0A80', lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>

    </>
  )
}
