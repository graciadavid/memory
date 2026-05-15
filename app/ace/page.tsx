'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import CreateGroupBanner from '@/components/CreateGroupBanner'
import { track } from '@vercel/analytics'
import { updateStreak } from '@/lib/streak'
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
function playCorrect() { playTone(800, 400, 0.15, 'square', 0.15) }
function playWrong() { playTone(200, 120, 0.4, 'sawtooth', 0.2) }
function playPerfect() { playTone(900, 450, 0.18, 'square', 0.2) }

type Phase = 'intro' | 'playing' | 'gameover'
type HitResult = 'perfect' | 'good' | 'miss' | null

const CANVAS_W = 390
const CANVAS_H = 340
const BALL_R = 16
const TARGET_R = 36
const TARGET_X = CANVAS_W / 2
const TARGET_Y = CANVAS_H / 2 + 40

// Ball travels in an arc from left to right
function getBallPos(t: number): { x: number, y: number } {
  // t goes from 0 to 1
  const x = t * CANVAS_W
  // Ball starts high left, comes down to target level at center, goes back up right
  // At t=0.5 the ball is exactly at TARGET_Y
  const startY = TARGET_Y - 140
  const endY = TARGET_Y - 100
  // Parabola that passes through TARGET_Y at t=0.5
  const y = TARGET_Y - 140 * Math.sin(t * Math.PI) + (startY - TARGET_Y) * (1 - t) + (endY - TARGET_Y) * t
  return { x, y }
}

export default function AcePage() {
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
    const { data } = await supabase.from('ace_scores').select('player_name, level').order('level', { ascending: false }).limit(200)
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
    ctx.ellipse(x, TARGET_Y + TARGET_R + 4, BALL_R * 0.8 * (1 - Math.abs(y - TARGET_Y) / 200), 4, 0, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,0.1)'
    ctx.fill()

    // Ball
    const gradient = ctx.createRadialGradient(x - 4, y - 4, 2, x, y, BALL_R)
    gradient.addColorStop(0, '#FFEE58')
    gradient.addColorStop(1, '#F9A825')
    ctx.beginPath()
    ctx.arc(x, y, BALL_R, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Ball fuzz lines
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(x, y, BALL_R * 0.5, -0.5, 0.5)
    ctx.stroke()

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
        await updateStreak(profile.name)
        window.dispatchEvent(new Event('game_completed'))
        const { data } = await supabase.from('ace_scores').select('player_name, level').order('level', { ascending: false }).limit(200)
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
          {phase === 'playing' && (
            <div style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 900, color: TENNIS }}>{level}</div>
          )}
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

            {bestLevel !== null && (
              <div style={{ background: `${TENNIS}15`, borderRadius: 14, padding: '10px 20px', display: 'flex', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, textTransform: 'uppercase' }}>Your best</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: TENNIS }}>{bestLevel}</div>
                </div>
                {topScores[0] && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, textTransform: 'uppercase' }}>World record</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: GOLD }}>{topScores[0].level}</div>
                  </div>
                )}
              </div>
            )}

            <button onClick={startGame} style={{
              padding: '18px', borderRadius: 20, border: 'none',
              background: TENNIS, color: '#fff',
              fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: `0 8px 0 ${TENNIS}60`, width: '100%',
            }}>Play</button>

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
            onClick={handleTap}>

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

            <div style={{ fontSize: 12, color: `${BROWN}40`, fontWeight: 700, marginTop: 8 }}>
              Tap anywhere to hit
            </div>
          </div>
        )}

        {/* GAME OVER */}
        {phase === 'gameover' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 20px', width: '100%' }}>
            <div style={{
              background: CREAM, borderRadius: 24, padding: '24px 20px', width: '100%',
              boxSizing: 'border-box', boxShadow: `0 8px 32px ${BROWN}20`,
              border: `1px solid ${GOLD}30`, textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: `${BROWN}50`, textTransform: 'uppercase', marginBottom: 6 }}>Your Result</div>
              <div style={{ fontSize: 56, fontWeight: 900, color: TENNIS, lineHeight: 1 }}>{level}</div>
              <div style={{ fontSize: 13, color: `${BROWN}50`, fontWeight: 700, marginBottom: 16 }}>aces in a row</div>

              {worldRank && (
                <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}20`, borderRadius: 12, padding: '10px', marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>World Ranking</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>#{worldRank}</div>
                </div>
              )}

              {bestLevel !== null && (
                <div style={{ fontSize: 12, color: `${BROWN}50`, fontWeight: 700 }}>
                  Your best: {bestLevel} aces
                </div>
              )}
            </div>

            <CreateGroupBanner playerName={profile?.name || ''} />

            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button onClick={() => {
                const url = `${window.location.origin}/challenge?game=ace&score=${level}&by=${encodeURIComponent(profile?.name || 'Someone')}`
                const text = `🎾 ${profile?.name} hit ${level} aces in a row on MemGenius! Can you beat them? ${url}`
                track('challenge_shared')
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
              }} style={{
                width: '100%', padding: '16px', borderRadius: 16, border: 'none',
                background: '#25D366', color: '#fff', fontSize: 16, fontWeight: 900,
                fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #128C7E60',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}><span style={{ fontSize: 20 }}>📲</span> Send to WhatsApp</button>
              <button onClick={startGame} style={{
                flex: 1, padding: '16px', borderRadius: 16, border: 'none',
                background: GOLD, color: '#fff', fontSize: 13, fontWeight: 800,
                fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${GOLD}50`,
              }}>Play again</button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
