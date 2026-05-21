'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { completeWodExercise } from '@/lib/wod'
import { completePlanDay } from '@/lib/plan'
import { track } from '@vercel/analytics'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const GREEN = '#2E7D32'
const RED = '#B71C1C'
const TENNIS = '#4CAF50'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const LOGO = `${BASE}/padel.png`
const TROPHY = `${BASE}/nav-trophy.webp`

let sharedCtx: AudioContext | null = null
function getAudioCtx() {
  if (!sharedCtx || sharedCtx.state === 'closed') sharedCtx = new AudioContext()
  if (sharedCtx.state === 'suspended') sharedCtx.resume()
  return sharedCtx
}
function playTone(freq1: number, freq2: number, duration: number, type: OscillatorType, vol: number) {
  try {
    const ctx = getAudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq1, ctx.currentTime)
    osc.frequency.setValueAtTime(freq2, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + duration)
  } catch(e) {}
}
function playCorrect() { playTone(440, 330, 0.2, 'sine', 0.12) }
function playWrong() { playTone(220, 180, 0.3, 'sine', 0.1) }
function playPerfect() { playTone(523, 440, 0.25, 'sine', 0.15) }

type Phase = 'intro' | 'playing' | 'gameover'
type HitResult = 'perfect' | 'good' | 'miss' | null

const CANVAS_W = 390
const CANVAS_H = 340
const BALL_R = 16
const TARGET_R = 36
const TARGET_X = CANVAS_W / 2
const TARGET_Y = CANVAS_H / 2 - 40

// Ball travels in an arc from left to right
function getBallPos(t: number): { x: number, y: number } {
  const x = t * CANVAS_W
  // Arc peaks exactly at TARGET_X, TARGET_Y (t=0.5)
  const startY = CANVAS_H - 40
  const endY = CANVAS_H - 40
  // Parabola: y = startY - (startY - TARGET_Y) * sin(t * PI)
  const y = startY - (startY - TARGET_Y) * Math.sin(t * Math.PI)
  return { x, y }
}

export default function AceClient() {
  const { profile } = usePlayer()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const durationRef = useRef<number>(2000) // ms for ball to cross
  const [phase, setPhase] = useState<Phase>('intro')
  const [level, setLevel] = useState(0)
  const [hitResult, setHitResult] = useState<HitResult>(null)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [topScores, setTopScores] = useState<{ name: string, level: number }[]>([])
  const [bestLevel, setBestLevel] = useState<number | null>(null)
  const levelRef = useRef(0)
  const phaseRef = useRef<Phase>('intro')

  useEffect(() => { fetchTop() }, [])

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('ace_scores').select('level').eq('player_name', profile.name).order('level', { ascending: false }).limit(1)
      .then(({ data }) => { if (data?.[0]) setBestLevel(data[0].level) })
  }, [profile?.name])

  const fetchTop = async () => {
    const { data } = await supabase.from('ace_scores').select('player_name, level').order('level', { ascending: false }).limit(1000)
    if (data) {
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
      setTopScores(Object.entries(best).map(([name, level]) => ({ name, level })).sort((a, b) => b.level - a.level))
    }
  }

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const elapsed = Date.now() - startTimeRef.current
    const t = Math.min(elapsed / durationRef.current, 1)
    const { x, y } = getBallPos(t)

    // Clear
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    // Court lines
    ctx.strokeStyle = 'rgba(74,44,10,0.08)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, TARGET_Y + TARGET_R + 10)
    ctx.lineTo(CANVAS_W, TARGET_Y + TARGET_R + 10)
    ctx.stroke()

    // Level number above target
    ctx.font = '900 72px sans-serif'
    ctx.fillStyle = '#4CAF50'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(levelRef.current), TARGET_X, TARGET_Y - TARGET_R - 60)

    // Target zone
    const dist = Math.sqrt((x - TARGET_X) ** 2 + (y - TARGET_Y) ** 2)
    const inTarget = dist < TARGET_R
    ctx.beginPath()
    ctx.arc(TARGET_X, TARGET_Y, TARGET_R, 0, Math.PI * 2)
    ctx.fillStyle = inTarget ? 'rgba(76,175,80,0.2)' : 'rgba(74,44,10,0.06)'
    ctx.fill()
    ctx.strokeStyle = inTarget ? '#4CAF50' : 'rgba(74,44,10,0.2)'
    ctx.lineWidth = 3
    ctx.stroke()

    // Target crosshair
    ctx.strokeStyle = inTarget ? '#4CAF50' : 'rgba(74,44,10,0.15)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(TARGET_X - TARGET_R, TARGET_Y)
    ctx.lineTo(TARGET_X + TARGET_R, TARGET_Y)
    ctx.moveTo(TARGET_X, TARGET_Y - TARGET_R)
    ctx.lineTo(TARGET_X, TARGET_Y + TARGET_R)
    ctx.stroke()

    // Ball shadow
    ctx.beginPath()
    ctx.ellipse(x, CANVAS_H - 30, BALL_R * 0.6, 5, 0, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,0.08)'
    ctx.fill()

    // Ball emoji
    ctx.font = `${BALL_R * 2}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🎾', x, y)

    if (t < 1 && phaseRef.current === 'playing') {
      animRef.current = requestAnimationFrame(drawFrame)
    } else if (t >= 1 && phaseRef.current === 'playing') {
      // Ball went past — miss
      handleMiss()
    }
  }, [])

  const startRound = useCallback((lvl: number) => {
    // Speed increases with level
    durationRef.current = Math.max(600, 2000 - lvl * 80)
    startTimeRef.current = Date.now()
    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(drawFrame)
  }, [drawFrame])

  const handleMiss = useCallback(async () => {
    if (phaseRef.current !== 'playing') return
    phaseRef.current = 'gameover'
    playWrong()
    setHitResult('miss')
    const finalLevel = levelRef.current
    if (animRef.current) cancelAnimationFrame(animRef.current)

    setTimeout(async () => {
      if (profile?.name) {
        await supabase.from('ace_scores').insert({ player_name: profile.name, level: finalLevel })
            window.dispatchEvent(new Event('game_completed'))
      completeWodExercise(profile?.name || '', '/ace')
      completePlanDay(profile?.name || profile?.name || '', '/ace')
        const { data } = await supabase.from('ace_scores').select('player_name, level').order('level', { ascending: false }).limit(1000)
        if (data) {
          const best: Record<string, number> = {}
          data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
          const myBest = best[profile.name] || finalLevel
          setWorldRank(Object.values(best).filter(l => l > myBest).length + 1)
          if (!bestLevel || finalLevel > bestLevel) setBestLevel(finalLevel)
        }
        fetchTop()
      }
      setPhase('gameover')
    }, 600)
  }, [profile?.name, bestLevel])

  const handleTap = useCallback(() => {
    if (phaseRef.current !== 'playing') return
    const elapsed = Date.now() - startTimeRef.current
    const t = elapsed / durationRef.current
    const { x, y } = getBallPos(t)
    const dist = Math.sqrt((x - TARGET_X) ** 2 + (y - TARGET_Y) ** 2)

    if (dist < TARGET_R) {
      // Hit
      const isPerfect = dist < TARGET_R * 0.5
      if (isPerfect) playPerfect()
      else playCorrect()
      setHitResult(isPerfect ? 'perfect' : 'good')
      if (animRef.current) cancelAnimationFrame(animRef.current)

      setTimeout(() => {
        const newLevel = levelRef.current + 1
        levelRef.current = newLevel
        setLevel(newLevel)
        setHitResult(null)
        startRound(newLevel)
      }, 600)
    } else {
      handleMiss()
    }
  }, [startRound, handleMiss])

  const startGame = () => {
    try { getAudioCtx() } catch(e) {}
    levelRef.current = 0
    phaseRef.current = 'playing'
    setLevel(0)
    setHitResult(null)
    setPhase('playing')
    setTimeout(() => startRound(0), 100)
  }

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  return (
    <>
      <style>{`
        @keyframes floatLogo { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
      `}</style>

      <main style={{
        height: '100dvh', background: `linear-gradient(180deg, #E8F5E9 0%, ${CREAM} 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto',
        overflow: 'auto', paddingBottom: 80,
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', width: '100%', gap: 12 }}>
          <img src={LOGO} alt="Ace" style={{ height: 56, objectFit: 'contain', animation: 'floatLogo 3s ease-in-out infinite', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: TENNIS, letterSpacing: -0.5, lineHeight: 1 }}>Ace</div>
            {phase === 'intro' && <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Hit the ball at the perfect moment</div>}
          </div>

        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 16, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 6 }}>Tap when the ball hits the sweet spot</div>
              <div style={{ fontSize: 13, color: `${BROWN}60`, lineHeight: 1.6 }}>
                The ball crosses the court in an arc.<br />
                Tap when it passes through the circle.<br />
                Each ace gets faster. How many can you hit?
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #4A2C0A10' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Your best</div>
                {bestLevel !== null ? (
                  <div style={{ fontSize: 32, fontWeight: 900, color: TENNIS }}>{bestLevel}</div>
                ) : (
                  <div style={{ fontSize: 14, color: '#4A2C0A30', fontWeight: 700 }}>—</div>
                )}
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #4A2C0A10' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>World record</div>
                {topScores[0] ? (
                  <>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#C8960C' }}>{topScores[0].level}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#4A2C0A60', marginTop: 4 }}>{topScores[0].name}</div>
                  </>
                ) : (
                  <div style={{ fontSize: 14, color: '#4A2C0A30', fontWeight: 700 }}>—</div>
                )}
              </div>
            </div>


            <button onClick={startGame} style={{
              padding: '18px', borderRadius: 20, border: 'none',
              background: TENNIS, color: '#fff',
              fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: `0 8px 0 ${TENNIS}60`, width: '100%',
            }}>Start</button>

            <Link href="/ace/ranking" style={{ textDecoration: 'none', width: '100%' }}>
              <div style={{
                width: '100%', padding: '14px', borderRadius: 16,
                background: '#fff', border: `1.5px solid ${BROWN}20`,
                textAlign: 'center', cursor: 'pointer', boxSizing: 'border-box',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <img src={TROPHY} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>World Ranking</span>
              </div>
            </Link>
          </div>
        )}

        {/* PLAYING */}
        {phase === 'playing' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0 0', position: 'relative' }}
>

            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H}
              style={{ width: '100%', maxWidth: CANVAS_W, touchAction: 'none', cursor: 'pointer' }} />

            {hitResult && (
              <div style={{
                position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
                fontSize: 32, fontWeight: 900,
                color: hitResult === 'perfect' ? GOLD : hitResult === 'good' ? GREEN : RED,
                animation: 'popIn 0.4s ease',
                pointerEvents: 'none',
              }}>
                {hitResult === 'perfect' ? 'ACE! 🎾' : hitResult === 'good' ? 'GOOD!' : 'MISS!'}
              </div>
            )}

            <button onClick={handleTap} style={{
              marginTop: 16, width: '80%', padding: '18px',
              borderRadius: 20, border: 'none',
              background: TENNIS, color: '#fff',
              fontSize: 22, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: `0 8px 0 ${TENNIS}60`,
              letterSpacing: 1,
            }}>SERVE!</button>
          </div>
        )}

        {phase === 'gameover' && (
         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 20px', width: '100%' }}>

           {/* Card 1: aces + world rank this game */}
           <div style={{ width: '100%', background: '#fff', borderRadius: 24, padding: '24px', boxShadow: `0 8px 32px ${BROWN}15`, textAlign: 'center' }}>
             <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}40`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Aces in a row</div>
             <div style={{ fontSize: 72, fontWeight: 900, color: BROWN, lineHeight: 1 }}>{level}</div>
             {worldRank && (
               <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BROWN}10` }}>
                 <div style={{ fontSize: 10, fontWeight: 800, color: `${BROWN}30`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>This game · World Ranking</div>
                 <div style={{ fontSize: 36, fontWeight: 900, color: '#0D2B5E', lineHeight: 1 }}>#{worldRank}</div>
               </div>
             )}
           </div>

           {/* Card 2: best + try again */}
           {bestLevel !== null && (
             <div style={{ width: '100%', background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}08)`, border: `1.5px solid ${GOLD}40`, borderRadius: 24, padding: '20px 24px', textAlign: 'center' }}>
               <div style={{ fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Your best</div>
               <div style={{ fontSize: 36, fontWeight: 900, color: BROWN, lineHeight: 1 }}>{bestLevel} aces</div>
               <button onClick={startGame} style={{
                 width: '100%', marginTop: 16, padding: '14px', borderRadius: 14, border: 'none',
                 background: '#2E7D32', color: '#fff', fontSize: 15, fontWeight: 900,
                 fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #1B5E2060',
               }}>Try again</button>
             </div>
           )}

           {/* Buttons */}
           <div style={{ display: 'flex', gap: 10, width: '100%' }}>
             <button onClick={() => window.location.href = '/my-plan'} style={{ flex: 1, padding: '14px', borderRadius: 14, border: 'none', background: '#0D2B5E', color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #0D2B5E60' }}>My Plan</button>
             <button onClick={() => window.location.href = '/ace/ranking'} style={{ flex: 1, padding: '14px', borderRadius: 14, border: 'none', background: GOLD, color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/nav-trophy.webp" alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />Ranking</button>
           </div>
         </div>
       )}
      </main>
    </>
  )
}
