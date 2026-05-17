'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const LOGO = `${BASE}/brain-logo.webp`

const NBACK_COLORS = [
  { bg: '#E53935', shadow: '#B71C1C' },
  { bg: '#1E88E5', shadow: '#1565C0' },
  { bg: '#43A047', shadow: '#2E7D32' },
  { bg: '#FDD835', shadow: '#F9A825' },
  { bg: '#FB8C00', shadow: '#E65100' },
  { bg: '#8E24AA', shadow: '#6A1B9A' },
]

const GEO_COUNTRIES = [
  { code: 'fr', name: 'France' }, { code: 'es', name: 'Spain' },
  { code: 'it', name: 'Italy' }, { code: 'de', name: 'Germany' },
  { code: 'gb', name: 'United Kingdom' }, { code: 'jp', name: 'Japan' },
  { code: 'br', name: 'Brazil' }, { code: 'us', name: 'United States' },
  { code: 'au', name: 'Australia' }, { code: 'mx', name: 'Mexico' },
  { code: 'ar', name: 'Argentina' }, { code: 'in', name: 'India' },
  { code: 'cn', name: 'China' }, { code: 'ca', name: 'Canada' },
  { code: 'ru', name: 'Russia' },
]

const CANVAS_W = 390
const CANVAS_H = 240
const TARGET_R = 36
const TARGET_X = CANVAS_W / 2
const TARGET_Y = CANVAS_H / 2 - 20
const BALL_R = 16

function getBallPos(t: number) {
  const x = t * CANVAS_W
  const startY = CANVAS_H - 40
  const y = startY - (startY - TARGET_Y) * Math.sin(t * Math.PI)
  return { x, y }
}

function playSound(freq1: number, freq2: number, duration: number, vol: number) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq1, ctx.currentTime)
    osc.frequency.setValueAtTime(freq2, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + duration)
  } catch(e) {}
}

function confetti() {
  const colors = ['#E91E63','#2196F3','#4CAF50','#FF9800','#9C27B0','#FFD600']
  for (let i = 0; i < 80; i++) {
    const div = document.createElement('div')
    div.style.cssText = `position:fixed;width:8px;height:8px;background:${colors[i%colors.length]};border-radius:2px;left:${Math.random()*100}vw;top:-10px;z-index:9999;animation:confettiFall ${1+Math.random()*2}s linear forwards`
    div.style.animationDelay = `${Math.random()*0.5}s`
    document.body.appendChild(div)
    setTimeout(() => div.remove(), 3000)
  }
}

type GamePhase = 'intro' | 'ace' | 'nback' | 'stop' | 'geoshape' | 'digits' | 'result'

export default function BrainTestPage() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [scores, setScores] = useState({ ace: 0, nback: 0, stop: 0, geoshape: 0, digits: 0 })
  const [worldPercent, setWorldPercent] = useState<number | null>(null)

  // ACE
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const startTimeRef = useRef(0)
  const durationRef = useRef(1800)
  const acePhaseRef = useRef<'playing' | 'done'>('playing')
  const [aceLevel, setAceLevel] = useState(0)
  const [acePoints, setAcePoints] = useState(0)
  const [aceResult, setAceResult] = useState<'perfect' | 'good' | 'miss' | null>(null)
  const [aceDone, setAceDone] = useState(false)
  const aceLevelRef = useRef(0)
  const acePointsRef = useRef(0)

  // N-Back
  const [nbCurrent, setNbCurrent] = useState(0)
  const [nbPrev, setNbPrev] = useState<number | null>(null)
  const [nbShowCard, setNbShowCard] = useState(false)
  const [nbPhase, setNbPhase] = useState<'show' | 'answer' | 'feedback'>('show')
  const [nbScore, setNbScore] = useState(0)
  const [nbIndex, setNbIndex] = useState(0)
  const [nbFeedback, setNbFeedback] = useState<'correct' | 'wrong' | null>(null)
  const nbTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const NB_TOTAL = 10
  const nbCurrentRef = useRef(0)
  const nbPrevRef = useRef<number | null>(null)
  const nbScoreRef = useRef(0)
  const nbIndexRef = useRef(0)

  // STOP
  const [stopPhase, setStopPhase] = useState<'ready' | 'running' | 'done'>('ready')
  const [stopElapsed, setStopElapsed] = useState(0)
  const [stopDiff, setStopDiff] = useState(0)
  const stopStart = useRef(0)
  const stopRaf = useRef(0)

  // GEOSHAPE
  const [geoCountries, setGeoCountries] = useState<typeof GEO_COUNTRIES>([])
  const [geoIndex, setGeoIndex] = useState(0)
  const [geoOptions, setGeoOptions] = useState<string[]>([])
  const [geoSelected, setGeoSelected] = useState<string | null>(null)
  const [geoScore, setGeoScore] = useState(0)
  const GEO_TOTAL = 5

  // DIGITS
  const [digitSeq, setDigitSeq] = useState<number[]>([])
  const [digitInput, setDigitInput] = useState<number[]>([])
  const [digitPhase, setDigitPhase] = useState<'show' | 'input' | 'done'>('show')
  const [digitStartTime, setDigitStartTime] = useState(0)

  const calcBrainScore = (s: typeof scores) => {
    const aceP = Math.min(200, s.ace)
    const nbP = Math.min(200, s.nback * 20)
    const stopP = Math.max(0, Math.round(200 - (s.stop / 2000) * 200))
    const geoP = Math.min(200, s.geoshape * 40)
    const digP = Math.min(200, s.digits)
    return aceP + nbP + stopP + geoP + digP
  }

  const saveResult = async (finalScores: typeof scores) => {
    const total = calcBrainScore(finalScores)
    if (profile?.name) {
      await supabase.from('brain_test_scores').insert({
        player_name: profile.name, score: total,
        ace_score: finalScores.ace, nback_score: finalScores.nback,
        stop_score: finalScores.stop, geoshape_score: finalScores.geoshape,
        mastermind_score: finalScores.digits,
      })
    }
    const { data } = await supabase.from('brain_test_scores').select('score').order('score', { ascending: false })
    if (data && data.length > 1) {
      const arr = data.map((s: any) => s.score)
      const better = arr.filter((s: number) => s < total).length
      setWorldPercent(Math.round((better / (arr.length - 1)) * 100))
    } else {
      setWorldPercent(50)
    }
    setScores(finalScores)
    setPhase('result')
    setTimeout(() => {
      confetti()
      playSound(523, 784, 0.5, 0.3)
    }, 300)
  }

  // ACE draw
  const drawAceFrame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const elapsed = Date.now() - startTimeRef.current
    const t = Math.min(elapsed / durationRef.current, 1)
    const { x, y } = getBallPos(t)
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    const dist = Math.sqrt((x - TARGET_X) ** 2 + (y - TARGET_Y) ** 2)
    const inTarget = dist < TARGET_R
    ctx.beginPath(); ctx.arc(TARGET_X, TARGET_Y, TARGET_R, 0, Math.PI * 2)
    ctx.fillStyle = inTarget ? 'rgba(76,175,80,0.2)' : 'rgba(74,44,10,0.06)'; ctx.fill()
    ctx.strokeStyle = inTarget ? '#4CAF50' : 'rgba(74,44,10,0.2)'; ctx.lineWidth = 3; ctx.stroke()
    ctx.font = '900 44px sans-serif'; ctx.fillStyle = '#4CAF50'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(String(aceLevelRef.current) + '/5', TARGET_X, TARGET_Y - TARGET_R - 36)
    ctx.font = `${BALL_R * 2}px serif`
    ctx.fillText('🎾', x, y)
    if (t < 1 && acePhaseRef.current === 'playing') animRef.current = requestAnimationFrame(drawAceFrame)
    else if (t >= 1 && acePhaseRef.current === 'playing') handleAceMiss()
  }, [])

  const startAceRound = useCallback(() => {
    durationRef.current = Math.max(700, 1800 - aceLevelRef.current * 100)
    startTimeRef.current = Date.now()
    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(drawAceFrame)
  }, [drawAceFrame])

  const handleAceMiss = useCallback(() => {
    acePhaseRef.current = 'done'
    if (animRef.current) cancelAnimationFrame(animRef.current)
    playSound(220, 150, 0.3, 0.15)
    setAceResult('miss')
    if (aceLevelRef.current < 4) {
      aceLevelRef.current += 1
      setAceLevel(aceLevelRef.current)
      setTimeout(() => {
        setAceResult(null)
        acePhaseRef.current = 'playing'
        startAceRound()
      }, 600)
    } else {
      setAceDone(true)
    }
  }, [startAceRound])

  const handleAceTap = useCallback(() => {
    if (acePhaseRef.current !== 'playing') return
    const elapsed = Date.now() - startTimeRef.current
    const t = elapsed / durationRef.current
    const { x, y } = getBallPos(t)
    const dist = Math.sqrt((x - TARGET_X) ** 2 + (y - TARGET_Y) ** 2)
    acePhaseRef.current = 'done'
    if (animRef.current) cancelAnimationFrame(animRef.current)
    if (dist < TARGET_R) {
      const isPerfect = dist < TARGET_R * 0.5
      const pts = isPerfect ? 200 : 100
      const newPts = Math.min(200, acePointsRef.current + pts)
      acePointsRef.current = newPts
      setAcePoints(newPts)
      playSound(isPerfect ? 660 : 523, isPerfect ? 880 : 660, 0.25, 0.2)
      setAceResult(isPerfect ? 'perfect' : 'good')
      if (aceLevelRef.current < 4) {
        aceLevelRef.current += 1
        setAceLevel(aceLevelRef.current)
        setTimeout(() => {
          setAceResult(null)
          acePhaseRef.current = 'playing'
          startAceRound()
        }, 500)
      } else {
        setAceDone(true)
      }
    } else {
      handleAceMiss()
    }
  }, [startAceRound])

  useEffect(() => {
    if (phase !== 'ace') return
    acePhaseRef.current = 'playing'
    aceLevelRef.current = 0
    acePointsRef.current = 0
    setTimeout(() => startAceRound(), 400)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [phase, startAceRound])

  useEffect(() => {
    if (!aceDone) return
    const s = { ...scores, ace: acePointsRef.current }
    setScores(s)
    setTimeout(() => {
      nbIndexRef.current = 0; nbScoreRef.current = 0
      setNbIndex(0); setNbScore(0)
      startNbRound(0, null)
      setPhase('nback')
    }, 1000)
  }, [aceDone])

  // N-Back
  const startNbRound = useCallback((idx: number, prev: number | null) => {
    const next = Math.floor(Math.random() * NBACK_COLORS.length)
    nbCurrentRef.current = next
    nbPrevRef.current = prev
    setNbCurrent(next); setNbPrev(prev)
    setNbShowCard(true); setNbPhase('show'); setNbFeedback(null)
    nbTimer.current = setTimeout(() => {
      setNbShowCard(false)
      if (idx === 0) {
        setTimeout(() => {
          const second = Math.floor(Math.random() * NBACK_COLORS.length)
          nbPrevRef.current = next
          nbCurrentRef.current = second
          setNbPrev(next); setNbCurrent(second)
          setNbShowCard(true); setNbPhase('show')
          nbIndexRef.current = 1; setNbIndex(1)
          nbTimer.current = setTimeout(() => { setNbShowCard(false); setNbPhase('answer') }, 1200)
        }, 400)
      } else {
        setNbPhase('answer')
      }
    }, 1200)
    return next
  }, [])

  const handleNbAnswer = useCallback((same: boolean) => {
    if (nbPhase !== 'answer') return
    if (nbTimer.current) clearTimeout(nbTimer.current)
    const isSame = nbCurrentRef.current === nbPrevRef.current
    const correct = same === isSame
    playSound(correct ? 660 : 220, correct ? 660 : 180, 0.15, 0.15)
    setNbFeedback(correct ? 'correct' : 'wrong')
    const newScore = correct ? nbScoreRef.current + 1 : nbScoreRef.current
    nbScoreRef.current = newScore
    const newIdx = nbIndexRef.current + 1
    setTimeout(() => {
      if (newIdx >= NB_TOTAL) {
        setScores(s => ({ ...s, nback: newScore }))
        setTimeout(() => { setStopPhase('ready'); setPhase('stop') }, 500)
      } else {
        nbIndexRef.current = newIdx; setNbIndex(newIdx); setNbScore(newScore)
        startNbRound(newIdx, nbCurrentRef.current)
      }
    }, 500)
  }, [nbPhase, startNbRound])

  useEffect(() => {
    if (phase === 'nback') startNbRound(0, null)
    return () => { if (nbTimer.current) clearTimeout(nbTimer.current) }
  }, [phase])

  // STOP
  const startStop = () => {
    stopStart.current = Date.now()
    setStopElapsed(0)
    setStopPhase('running')
    const tick = () => { setStopElapsed(Date.now() - stopStart.current); stopRaf.current = requestAnimationFrame(tick) }
    stopRaf.current = requestAnimationFrame(tick)
  }

  const stopIt = () => {
    cancelAnimationFrame(stopRaf.current)
    const elapsed = Date.now() - stopStart.current
    setStopElapsed(elapsed)
    const diff = Math.abs(elapsed - 5000)
    setStopDiff(diff); setStopPhase('done')
    playSound(diff < 200 ? 660 : 330, diff < 200 ? 880 : 220, 0.3, 0.2)
    setScores(s => ({ ...s, stop: diff }))
    setTimeout(() => {
      const shuffled = [...GEO_COUNTRIES].sort(() => Math.random() - 0.5).slice(0, GEO_TOTAL)
      setGeoCountries(shuffled); setGeoIndex(0); setGeoScore(0); setGeoSelected(null)
      setGeoOptions(getGeoOptions(shuffled[0].name))
      setPhase('geoshape')
    }, 1500)
  }

  // GEOSHAPE
  const getGeoOptions = (correct: string) => {
    const others = GEO_COUNTRIES.filter(c => c.name !== correct).sort(() => Math.random() - 0.5).slice(0, 3)
    return [...others.map(c => c.name), correct].sort(() => Math.random() - 0.5)
  }

  const handleGeoAnswer = (answer: string) => {
    if (geoSelected) return
    setGeoSelected(answer)
    const correct = answer === geoCountries[geoIndex].name
    playSound(correct ? 660 : 220, correct ? 660 : 180, 0.15, 0.15)
    const newScore = correct ? geoScore + 1 : geoScore
    setTimeout(() => {
      const nextIdx = geoIndex + 1
      if (nextIdx >= GEO_TOTAL) {
        setScores(s => ({ ...s, geoshape: newScore }))
        const seq = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10))
        setDigitSeq(seq); setDigitInput([]); setDigitPhase('show')
        setTimeout(() => setPhase('digits'), 500)
      } else {
        setGeoIndex(nextIdx); setGeoScore(newScore); setGeoSelected(null)
        setGeoOptions(getGeoOptions(geoCountries[nextIdx].name))
      }
    }, 800)
  }

  // DIGITS
  useEffect(() => {
    if (phase !== 'digits' || digitPhase !== 'show') return
    const t = setTimeout(() => {
      setDigitPhase('input')
      setDigitStartTime(Date.now())
    }, 2500)
    return () => clearTimeout(t)
  }, [phase, digitPhase])

  const handleDigitInput = (n: number) => {
    if (digitPhase !== 'input') return
    const next = [...digitInput, n]
    setDigitInput(next)
    if (next.length === 6) {
      const timeTaken = Date.now() - digitStartTime
      let correct = 0
      next.forEach((d, i) => { if (d === digitSeq[i]) correct++ })
      const basePoints = correct * 30
      const speedBonus = timeTaken < 5000 ? 20 : timeTaken < 10000 ? 10 : timeTaken > 15000 ? -10 : 0
      const total = Math.max(0, Math.min(200, basePoints + speedBonus))
      setDigitPhase('done')
      playSound(correct === 6 ? 660 : 330, correct === 6 ? 880 : 220, 0.3, 0.2)
      const finalScores = { ...scores, digits: total }
      setTimeout(() => saveResult(finalScores), 800)
    }
  }

  const handleDigitDelete = () => {
    if (digitPhase !== 'input') return
    setDigitInput(prev => prev.slice(0, -1))
  }

  const brainScore = calcBrainScore(scores)

  return (
    <main style={{ minHeight: '100dvh', background: `linear-gradient(180deg, #E8EAF6 0%, ${CREAM} 100%)`, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        @keyframes confettiFall { to{transform:translateY(110vh) rotate(720deg);opacity:0} }
      `}</style>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: '40px 24px', gap: 28 }}>
          <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/memgeniuslogofull.png" alt="MemGenius" style={{ width: '100%', maxWidth: 280, objectFit: 'contain' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: BROWN, letterSpacing: -1, lineHeight: 1.1, marginBottom: 20 }}>Brain Test</div>
            <div style={{ fontSize: 22, color: `${BROWN}70`, lineHeight: 1.6, fontWeight: 700 }}>
              Discover your cognitive<br />profile and your %<br />in the world.
            </div>
          </div>
          <button onClick={() => { acePhaseRef.current = 'playing'; setPhase('ace') }} style={{
            width: '100%', padding: '22px', borderRadius: 20, border: 'none',
            background: '#2E7D32', color: '#fff', fontSize: 22, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #1B5E2060',
          }}>Start Brain Test</button>
        </div>
      )}

      {/* ACE */}
      {phase === 'ace' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase' }}>Game 1 of 5</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: BROWN }}>Ace</div>
          <div style={{ fontSize: 16, color: `${BROWN}60`, fontWeight: 700, textAlign: 'center', padding: '0 20px' }}>Hit the ball through the circle</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#4CAF50' }}>{acePoints} pts</div>
          <div style={{ position: 'relative', width: '100%' }} onClick={handleAceTap}>
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{ width: '100%', touchAction: 'none' }} />
            {aceResult && (
              <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', fontSize: 32, fontWeight: 900, color: aceResult === 'miss' ? '#C62828' : aceResult === 'perfect' ? '#C8960C' : '#2E7D32', animation: 'popIn 0.3s ease' }}>
                {aceResult === 'perfect' ? 'ACE! 🎾' : aceResult === 'good' ? 'GOOD!' : 'MISS!'}
              </div>
            )}
          </div>
          <button onClick={handleAceTap} style={{ width: '80%', padding: '18px', borderRadius: 20, border: 'none', background: '#4CAF50', color: '#fff', fontSize: 22, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #2E7D3260' }}>SERVE!</button>
        </div>
      )}

      {/* N-BACK */}
      {phase === 'nback' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 24px', gap: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase' }}>Game 2 of 5</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: BROWN }}>N-Back</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: BROWN, textAlign: 'center' }}>
            {nbShowCard ? 'Remember this color' : nbIndex === 0 ? 'Memorizing first color...' : 'Same color as before?'}
          </div>
          <div style={{ fontSize: 16, color: GOLD, fontWeight: 900 }}>{Math.min(nbIndex, NB_TOTAL)} / {NB_TOTAL} · {nbScore} correct</div>
          <div style={{ width: 200, height: 200, borderRadius: 28, background: nbShowCard ? NBACK_COLORS[nbCurrent].bg : '#E0E0E0', boxShadow: nbShowCard ? `0 8px 0 ${NBACK_COLORS[nbCurrent].shadow}` : '0 4px 0 #BDBDBD', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            {!nbShowCard && nbIndex > 0 && <img src={LOGO} alt="" style={{ width: 60, height: 60, objectFit: 'contain', opacity: 0.25 }} />}
          </div>
          {nbFeedback && <div style={{ fontSize: 22, fontWeight: 900, color: nbFeedback === 'correct' ? '#2E7D32' : '#C62828', animation: 'popIn 0.3s ease' }}>{nbFeedback === 'correct' ? '✓ Correct' : '✗ Wrong'}</div>}
          {nbPhase === 'answer' && (
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <button onClick={() => handleNbAnswer(false)} style={{ flex: 1, padding: '20px', borderRadius: 18, border: 'none', background: '#E53935', color: '#fff', fontSize: 18, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 5px 0 #B71C1C60' }}>Different</button>
              <button onClick={() => handleNbAnswer(true)} style={{ flex: 1, padding: '20px', borderRadius: 18, border: 'none', background: '#43A047', color: '#fff', fontSize: 18, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 5px 0 #2E7D3260' }}>Same</button>
            </div>
          )}
          {nbPhase !== 'answer' && <div style={{ display: 'flex', gap: 12, width: '100%', opacity: 0.25 }}>
            <div style={{ flex: 1, padding: '20px', borderRadius: 18, background: '#E53935', textAlign: 'center', fontSize: 18, fontWeight: 900, color: '#fff' }}>Different</div>
            <div style={{ flex: 1, padding: '20px', borderRadius: 18, background: '#43A047', textAlign: 'center', fontSize: 18, fontWeight: 900, color: '#fff' }}>Same</div>
          </div>}
        </div>
      )}

      {/* STOP */}
      {phase === 'stop' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', gap: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase' }}>Game 3 of 5</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: BROWN }}>Stop</div>
          <div style={{ fontSize: 16, color: `${BROWN}60`, fontWeight: 700, textAlign: 'center' }}>Press Start, then Stop at exactly 5 seconds</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: `${BROWN}40`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Target</div>
            <div style={{ fontSize: 60, fontWeight: 900, color: '#4A148C', fontVariantNumeric: 'tabular-nums' }}>5.000s</div>
          </div>
          {stopPhase !== 'ready' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: `${BROWN}40`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Your time</div>
              <div style={{ fontSize: 60, fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: stopPhase === 'done' ? (stopDiff < 200 ? '#2E7D32' : stopDiff < 800 ? '#F9A825' : '#C62828') : '#4A148C' }}>
                {(stopElapsed / 1000).toFixed(3)}s
              </div>
            </div>
          )}
          {stopPhase === 'done' && <div style={{ fontSize: 28, fontWeight: 900, color: stopDiff < 200 ? '#2E7D32' : stopDiff < 800 ? '#F9A825' : '#C62828' }}>{stopDiff}ms off</div>}
          {stopPhase === 'ready' && <button onClick={startStop} style={{ width: '100%', padding: '20px', borderRadius: 20, border: 'none', background: '#2E7D32', color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #1B5E2060' }}>Start</button>}
          {stopPhase === 'running' && <button onClick={stopIt} style={{ width: '100%', padding: '20px', borderRadius: 20, border: 'none', background: '#B71C1C', color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #B71C1C60' }}>Stop!</button>}
        </div>
      )}

      {/* GEOSHAPE */}
      {phase === 'geoshape' && geoCountries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px', gap: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase' }}>Game 4 of 5</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: BROWN }}>GeoShape</div>
          <div style={{ fontSize: 16, color: `${BROWN}60`, fontWeight: 700 }}>Which country is this? {geoIndex + 1}/{GEO_TOTAL}</div>
          <img src={`https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${geoCountries[geoIndex].code.toLowerCase()}/512.png`} alt="" style={{ width: 200, height: 180, objectFit: 'contain', filter: 'brightness(0) opacity(0.8)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
            {geoOptions.map(opt => (
              <button key={opt} onClick={() => handleGeoAnswer(opt)} style={{
                padding: '16px', borderRadius: 14, border: 'none', fontFamily: 'inherit', cursor: 'pointer', fontSize: 14, fontWeight: 800,
                background: geoSelected === null ? '#fff' : opt === geoCountries[geoIndex].name ? '#2E7D32' : geoSelected === opt ? '#C62828' : '#fff',
                color: geoSelected && (opt === geoCountries[geoIndex].name || geoSelected === opt) ? '#fff' : BROWN,
                boxShadow: '0 2px 0 #4A2C0A10',
              }}>{opt}</button>
            ))}
          </div>
        </div>
      )}

      {/* DIGITS */}
      {phase === 'digits' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 24px', gap: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase' }}>Game 5 of 5</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: BROWN }}>Digits</div>
          <div style={{ fontSize: 16, color: `${BROWN}60`, fontWeight: 700, textAlign: 'center' }}>
            {digitPhase === 'show' ? 'Memorize these 6 digits' : digitPhase === 'input' ? 'Type them in order — fast!' : 'Done!'}
          </div>

          {digitPhase === 'show' && (
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              {digitSeq.map((d, i) => (
                <div key={i} style={{ width: 44, height: 56, borderRadius: 12, background: '#1976D2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff', boxShadow: '0 4px 0 #1565C060' }}>{d}</div>
              ))}
            </div>
          )}

          {digitPhase === 'input' && (
            <>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                {Array(6).fill(null).map((_, i) => (
                  <div key={i} style={{ width: 44, height: 56, borderRadius: 12, background: digitInput[i] !== undefined ? '#1976D2' : '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: digitInput[i] !== undefined ? '#fff' : `${BROWN}20`, border: `2px solid ${digitInput[i] !== undefined ? '#1976D2' : '#90CAF9'}` }}>
                    {digitInput[i] !== undefined ? digitInput[i] : ''}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%', maxWidth: 280, marginTop: 8 }}>
                {[1,2,3,4,5,6,7,8,9,'⌫',0,''].map((n, i) => (
                  n === '' ? <div key={i} /> :
                  n === '⌫' ? (
                    <button key={i} onClick={handleDigitDelete} style={{ padding: '16px', borderRadius: 14, border: 'none', background: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 3px 0 #4A2C0A10' }}>⌫</button>
                  ) : (
                    <button key={i} onClick={() => handleDigitInput(n as number)} style={{ padding: '16px', borderRadius: 14, border: 'none', background: '#fff', fontSize: 22, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 3px 0 #4A2C0A10', color: BROWN }}>{n}</button>
                  )
                ))}
              </div>
            </>
          )}

          {digitPhase === 'done' && (
            <div style={{ fontSize: 20, fontWeight: 900, color: '#2E7D32' }}>Calculating your score...</div>
          )}
        </div>
      )}

      {/* RESULT */}
      {phase === 'result' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: '40px 24px', gap: 20 }}>
          <img src={LOGO} alt="" style={{ width: 70, height: 70, objectFit: 'contain' }} />
          <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase' }}>Your Brain Profile</div>
          <div style={{ fontSize: 96, fontWeight: 900, color: brainScore >= 500 ? '#2E7D32' : '#C62828', lineHeight: 1, animation: 'popIn 0.5s ease' }}>{brainScore}</div>
          <div style={{ fontSize: 16, color: `${BROWN}50`, fontWeight: 700 }}>out of 1000</div>
          {worldPercent !== null && (
            <div style={{ background: `${GOLD}15`, borderRadius: 20, padding: '20px 32px', textAlign: 'center', border: `1px solid ${GOLD}30`, width: '100%' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>World ranking</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: GOLD }}>Top {100 - worldPercent}%</div>
            </div>
          )}
          <button onClick={() => {
            const text = `🧠 My Brain Score is ${brainScore}/1000 on MemGenius! I'm in the top ${100 - (worldPercent || 50)}% worldwide. Can you beat me? memgenius.com/brain-test`
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
          }} style={{ width: '100%', padding: '18px', borderRadius: 16, border: 'none', background: '#25D366', color: '#fff', fontSize: 18, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #128C7E60' }}>
            Share on WhatsApp
          </button>
          <button onClick={() => window.location.href = '/'} style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', background: BROWN, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>
            Play all games →
          </button>
        </div>
      )}
    </main>
  )
}
