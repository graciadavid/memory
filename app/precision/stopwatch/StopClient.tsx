'use client'
import { useState, useRef, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { completeWodExercise } from '@/lib/wod'
import { completePlanDay } from '@/lib/plan'
import CreateGroupBanner from '@/components/CreateGroupBanner'
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
  const [elapsed, setElapsed] = useState(0)
  const [difference, setDifference] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [bestScore, setBestScore] = useState<number | null>(null)
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

     // Check WOD completion and redirect
     try {
       const { getTodayPlays } = await import('@/lib/wod')
       const todayPlays = await getTodayPlays(profile.name, '/precision/stopwatch')
       const { data: planData } = await supabase.from('brain_plans').select('start_date').eq('player_name', profile.name).order('created_at', { ascending: false }).limit(1)
       if (planData?.[0]) {
         const planDiff = Math.floor((new Date().getTime() - new Date(planData[0].start_date).getTime()) / 86400000)
         const wodDay = Math.min(7, Math.max(1, planDiff + 1))
         const { data: wodData } = await supabase.from('wod').select('exercises').eq('day_number', wodDay).limit(1)
         if (wodData?.[0]) {
           const ex = wodData[0].exercises.find((e: any) => e.href === '/precision/stopwatch')
           if (ex && todayPlays >= ex.reps) {
             setTimeout(() => { window.location.href = '/my-plan' }, 1500)
           }
         }
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
            <div style={{ width: '100%', background: '#fff', borderRadius: 24, padding: '18px 20px', boxShadow: `0 8px 32px ${BROWN}15`, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>You stopped at</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: BROWN, letterSpacing: -2, marginBottom: 2 }}>{fmt(elapsed)}</div>
              <div style={{ marginBottom: 12 }} />

              <div style={{ background: Math.abs(difference) < 100 ? '#E8F5E9' : Math.abs(difference) < 500 ? '#FFF8E1' : '#FFEBEE', borderRadius: 16, padding: '10px 16px', marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Difference</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: Math.abs(difference) < 100 ? '#2E7D32' : Math.abs(difference) < 500 ? GOLD : '#B71C1C' }}>
                  {difference === 0 ? '🎯 PERFECT!' : `${difference > 0 ? '+' : ''}${(difference / 1000).toFixed(3)}s`}
                </div>
                <div style={{ fontSize: 12, color: `${BROWN}50`, marginTop: 4 }}>
                  {difference > 0 ? 'Too slow' : difference < 0 ? 'Too fast' : 'Perfect!'}
                </div>
              </div>

               {worldRank && (
                <div style={{ background: 'linear-gradient(135deg, #0D1B4B, #1565C0)', borderRadius: 16, padding: '16px', marginBottom: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>World Ranking</div>
                  <div style={{ fontSize: 52, fontWeight: 900, color: '#FFD600', lineHeight: 1 }}>#{worldRank}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 4 }}>out of all players worldwide</div>
                </div>
              )}
            </div>

            <button onClick={() => {
              const url = `${window.location.origin}/challenge?game=precision&score=${Math.abs(difference)}&by=${encodeURIComponent(profile?.name || 'Someone')}`
              const text = `${profile?.name} stopped at ${(difference / 1000).toFixed(3)}s off on MemGenius Stop! Can you be more precise? ${url}`
              if (navigator.share) { navigator.share({ title: 'MemGenius', text, url }) } else { window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank') }
            }} style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: 'rgba(0,0,0,0.06)', color: '#4A2C0A60', fontSize: 13, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}><span style={{ fontSize: 20 }}>📲</span> Send to WhatsApp</button>

            <button onClick={reset} style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: PURPLE, color: '#fff', fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${PURPLE}60`,
            }}>Play again</button>

            <CreateGroupBanner playerName={profile?.name || ''} />
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
