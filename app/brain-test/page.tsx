'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

// COLORS for N-Back
const NBACK_COLORS = [
  { name: 'Red', bg: '#E53935', shadow: '#B71C1C' },
  { name: 'Blue', bg: '#1E88E5', shadow: '#1565C0' },
  { name: 'Green', bg: '#43A047', shadow: '#2E7D32' },
  { name: 'Yellow', bg: '#FDD835', shadow: '#F9A825' },
  { name: 'Orange', bg: '#FB8C00', shadow: '#E65100' },
  { name: 'Purple', bg: '#8E24AA', shadow: '#6A1B9A' },
]

// MASTERMIND
const MM_COLORS = ['#6A1B9A', '#1E88E5', '#43A047', '#FDD835', '#FB8C00']
const generateCode = () => Array.from({ length: 5 }, () => Math.floor(Math.random() * MM_COLORS.length))
const getFeedback = (guess: number[], code: number[]) => {
  const codeUsed = Array(5).fill(false)
  const guessUsed = Array(5).fill(false)
  const correctPos: number[] = []
  const wrongPos: number[] = []
  guess.forEach((g, i) => { if (g === code[i]) { correctPos.push(i); codeUsed[i] = true; guessUsed[i] = true } })
  guess.forEach((g, i) => { if (guessUsed[i]) return; const idx = code.findIndex((c, j) => c === g && !codeUsed[j]); if (idx !== -1) { wrongPos.push(i); codeUsed[idx] = true } })
  return { correctPos, wrongPos }
}

// GEOSHAPE countries
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

// ACE canvas constants
const CANVAS_W = 390
const CANVAS_H = 260
const BALL_R = 16
const TARGET_R = 36
const TARGET_X = CANVAS_W / 2
const TARGET_Y = CANVAS_H / 2 - 20

function getBallPos(t: number) {
  const x = t * CANVAS_W
  const startY = CANVAS_H - 40
  const y = startY - (startY - TARGET_Y) * Math.sin(t * Math.PI)
  return { x, y }
}

function fmt(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const c = Math.floor((ms % 1000) / 100)
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}.${c}` : `${s}.${c}s`
}

type GamePhase = 'intro' | 'ace' | 'nback' | 'stop' | 'geoshape' | 'mastermind' | 'result'

export default function BrainTestPage() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [scores, setScores] = useState({ ace: 0, nback: 0, stop: 0, geoshape: 0, mastermind: 0 })
  const [worldPercent, setWorldPercent] = useState<number | null>(null)
  const [topScore, setTopScore] = useState<number | null>(null)

  // ACE state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const startTimeRef = useRef(0)
  const durationRef = useRef(1800)
  const acePhaseRef = useRef<'playing' | 'done'>('playing')
  const [aceLevel, setAceLevel] = useState(0)
  const [aceResult, setAceResult] = useState<'perfect' | 'good' | 'miss' | null>(null)
  const [aceDone, setAceDone] = useState(false)
  const aceLevelRef = useRef(0)

  // N-Back state
  const [nbCards, setNbCards] = useState<number[]>([])
  const [nbCurrent, setNbCurrent] = useState<number>(0)
  const [nbPrev, setNbPrev] = useState<number | null>(null)
  const [nbShowCard, setNbShowCard] = useState(false)
  const [nbPhase, setNbPhase] = useState<'show' | 'answer' | 'feedback' | 'done'>('show')
  const [nbScore, setNbScore] = useState(0)
  const [nbIndex, setNbIndex] = useState(0)
  const [nbFeedback, setNbFeedback] = useState<'correct' | 'wrong' | null>(null)
  const nbTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const NB_TOTAL = 10

  // STOP state
  const [stopPhase, setStopPhase] = useState<'ready' | 'running' | 'done'>('ready')
  const [stopElapsed, setStopElapsed] = useState(0)
  const [stopDiff, setStopDiff] = useState(0)
  const stopStart = useRef(0)
  const stopRaf = useRef(0)

  // GEOSHAPE state
  const [geoCountries, setGeoCountries] = useState<typeof GEO_COUNTRIES>([])
  const [geoIndex, setGeoIndex] = useState(0)
  const [geoOptions, setGeoOptions] = useState<string[]>([])
  const [geoSelected, setGeoSelected] = useState<string | null>(null)
  const [geoScore, setGeoScore] = useState(0)
  const GEO_TOTAL = 5

  // MASTERMIND state
  const [mmCode] = useState(generateCode)
  const [mmGuesses, setMmGuesses] = useState<number[][]>([])
  const [mmFeedbacks, setMmFeedbacks] = useState<{ correctPos: number[], wrongPos: number[] }[]>([])
  const [mmCurrent, setMmCurrent] = useState<(number | null)[]>(Array(5).fill(null))
  const [mmDone, setMmDone] = useState(false)
  const [mmStartTime] = useState(Date.now())
  const MM_MAX = 7

  const calcBrainScore = (s: typeof scores) => {
    const aceP = Math.min(200, s.ace * 40)
    const nbP = Math.min(200, s.nback * 20)
    const stopP = Math.max(0, 200 - Math.floor(s.stop / 10))
    const geoP = Math.min(200, s.geoshape * 40)
    const mmAttempts = s.mastermind
    const mmP = mmAttempts === 0 ? 0 : Math.max(0, 200 - (mmAttempts - 1) * 30)
    return aceP + nbP + stopP + geoP + mmP
  }

  const saveResult = async (finalScores: typeof scores) => {
    const total = calcBrainScore(finalScores)
    if (profile?.name) {
      await supabase.from('brain_test_scores').insert({
        player_name: profile.name,
        score: total,
        ace_score: finalScores.ace,
        nback_score: finalScores.nback,
        stop_score: finalScores.stop,
        geoshape_score: finalScores.geoshape,
        mastermind_score: finalScores.mastermind,
      })
    }
    const { data } = await supabase.from('brain_test_scores').select('score').order('score', { ascending: false })
    if (data) {
      const scores_arr = data.map((s: any) => s.score)
      const better = scores_arr.filter((s: number) => s < total).length
      setWorldPercent(Math.round((better / scores_arr.length) * 100))
      setTopScore(scores_arr[0])
    }
    setScores(finalScores)
    setPhase('result')
  }

  // ACE
  const drawAceFrame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const elapsed = Date.now() - startTimeRef.current
    const t = Math.min(elapsed / durationRef.current, 1)
    const { x, y } = getBallPos(t)
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    // Target
    const dist = Math.sqrt((x - TARGET_X) ** 2 + (y - TARGET_Y) ** 2)
    const inTarget = dist < TARGET_R
    ctx.beginPath(); ctx.arc(TARGET_X, TARGET_Y, TARGET_R, 0, Math.PI * 2)
    ctx.fillStyle = inTarget ? 'rgba(76,175,80,0.2)' : 'rgba(74,44,10,0.06)'; ctx.fill()
    ctx.strokeStyle = inTarget ? '#4CAF50' : 'rgba(74,44,10,0.2)'; ctx.lineWidth = 3; ctx.stroke()
    // Level
    ctx.font = '900 48px sans-serif'; ctx.fillStyle = '#4CAF50'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(String(aceLevelRef.current), TARGET_X, TARGET_Y - TARGET_R - 40)
    // Ball
    ctx.font = `${BALL_R * 2}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText('🎾', x, y)
    if (t < 1 && acePhaseRef.current === 'playing') animRef.current = requestAnimationFrame(drawAceFrame)
    else if (t >= 1 && acePhaseRef.current === 'playing') endAceRound('miss')
  }, [])

  const startAceRound = useCallback(() => {
    durationRef.current = Math.max(700, 1800 - aceLevelRef.current * 80)
    startTimeRef.current = Date.now()
    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(drawAceFrame)
  }, [drawAceFrame])

  const endAceRound = useCallback((result: 'perfect' | 'good' | 'miss') => {
    acePhaseRef.current = 'done'
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setAceResult(result)
    if (result !== 'miss' && aceLevelRef.current < 5) {
      const next = aceLevelRef.current + 1
      aceLevelRef.current = next
      setAceLevel(next)
      setTimeout(() => {
        setAceResult(null)
        acePhaseRef.current = 'playing'
        startAceRound()
      }, 500)
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
    if (dist < TARGET_R) {
      endAceRound(dist < TARGET_R * 0.5 ? 'perfect' : 'good')
    } else {
      endAceRound('miss')
    }
  }, [endAceRound])

  // Start ACE
  useEffect(() => {
    if (phase !== 'ace') return
    acePhaseRef.current = 'playing'
    aceLevelRef.current = 0
    setTimeout(() => startAceRound(), 300)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [phase, startAceRound])

  // Finish ACE
  useEffect(() => {
    if (!aceDone) return
    const s = { ...scores, ace: aceLevelRef.current }
    setScores(s)
    setTimeout(() => { setNbIndex(0); setNbScore(0); startNbRound(0, null); setPhase('nback') }, 1000)
  }, [aceDone])

  // N-Back
  const startNbRound = useCallback((idx: number, prev: number | null) => {
    const next = Math.floor(Math.random() * NBACK_COLORS.length)
    setNbCurrent(next); setNbPrev(prev); setNbShowCard(true); setNbPhase('show'); setNbFeedback(null)
    nbTimer.current = setTimeout(() => {
      setNbShowCard(false)
      if (idx === 0) {
        // First card - just show it then show second card
        setTimeout(() => {
          const second = Math.floor(Math.random() * NBACK_COLORS.length)
          setNbCurrent(second)
          setNbPrev(next)
          setNbShowCard(true)
          setNbPhase('show')
          setNbIndex(1)
          nbTimer.current = setTimeout(() => {
            setNbShowCard(false)
            setNbPhase('answer')
          }, 1200)
        }, 300)
      } else {
        setNbPhase('answer')
      }
    }, 1200)
    return next
  }, [])

  const handleNbAnswer = useCallback((same: boolean) => {
    if (nbPhase !== 'answer') return
    if (nbTimer.current) clearTimeout(nbTimer.current)
    const isSame = nbCurrent === nbPrev
    const correct = same === isSame
    setNbFeedback(correct ? 'correct' : 'wrong')
    const newScore = correct ? nbScore + 1 : nbScore
    const newIdx = nbIndex + 1
    setTimeout(() => {
      if (newIdx >= NB_TOTAL) {
        setScores(s => ({ ...s, nback: newScore }))
        setTimeout(() => { setStopPhase('ready'); setPhase('stop') }, 500)
      } else {
        setNbIndex(newIdx); setNbScore(newScore)
        const next = startNbRound(newIdx, nbCurrent)
      }
    }, 500)
  }, [nbPhase, nbCurrent, nbPrev, nbScore, nbIndex, startNbRound])

  useEffect(() => {
    if (phase === 'nback') { startNbRound(0, null) }
    return () => { if (nbTimer.current) clearTimeout(nbTimer.current) }
  }, [phase])

  // STOP
  const startStop = () => {
    stopStart.current = Date.now()
    setStopPhase('running')
    const tick = () => { setStopElapsed(Date.now() - stopStart.current); stopRaf.current = requestAnimationFrame(tick) }
    stopRaf.current = requestAnimationFrame(tick)
  }

  const stopIt = () => {
    cancelAnimationFrame(stopRaf.current)
    const diff = Math.abs((Date.now() - stopStart.current) - 5000)
    setStopDiff(diff); setStopPhase('done')
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
    const newScore = correct ? geoScore + 1 : geoScore
    setTimeout(() => {
      const nextIdx = geoIndex + 1
      if (nextIdx >= GEO_TOTAL) {
        setScores(s => ({ ...s, geoshape: newScore }))
        setTimeout(() => setPhase('mastermind'), 500)
      } else {
        setGeoIndex(nextIdx); setGeoScore(newScore); setGeoSelected(null)
        setGeoOptions(getGeoOptions(geoCountries[nextIdx].name))
      }
    }, 800)
  }

  // MASTERMIND
  const handleMmColor = (colorIdx: number, posIdx: number) => {
    if (mmDone) return
    const next = [...mmCurrent]; next[posIdx] = colorIdx; setMmCurrent(next)
  }

  const handleMmSubmit = () => {
    if (mmCurrent.some(v => v === null) || mmDone) return
    const guess = mmCurrent as number[]
    const fb = getFeedback(guess, mmCode)
    const newGuesses = [...mmGuesses, guess]
    const newFbs = [...mmFeedbacks, fb]
    setMmGuesses(newGuesses); setMmFeedbacks(newFbs)
    const won = fb.correctPos.length === 5
    if (won || newGuesses.length >= MM_MAX) {
      setMmDone(true)
      const finalScores = { ...scores, mastermind: newGuesses.length }
      setTimeout(() => saveResult(finalScores), 800)
    } else {
      const nextRow = Array(5).fill(null)
      fb.correctPos.forEach(i => { nextRow[i] = guess[i] })
      setMmCurrent(nextRow)
    }
  }

  const brainScore = calcBrainScore(scores)
  const strongest = Object.entries({ ace: scores.ace * 40, nback: scores.nback * 20, geoshape: scores.geoshape * 40 }).sort((a, b) => b[1] - a[1])[0][0]
  const strongestLabel: Record<string, string> = { ace: 'Timing & Agility', nback: 'Working Memory', geoshape: 'Spatial Knowledge' }

  return (
    <main style={{ minHeight: '100dvh', background: `linear-gradient(180deg, #E8EAF6 0%, ${CREAM} 100%)`, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 80 }}>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} } @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }`}</style>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>MemGenius</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: BROWN, letterSpacing: -1, lineHeight: 1.1 }}>Brain Test</div>
            <div style={{ fontSize: 15, color: `${BROWN}60`, marginTop: 10, lineHeight: 1.7 }}>
              5 mini-games. 4 minutes.<br />Discover your cognitive profile<br />and your % in the world.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            {[
              { icon: '🎾', label: 'Ace', desc: 'Timing & Agility' },
              { icon: '🧠', label: 'N-Back', desc: 'Working Memory' },
              { icon: '⏱', label: 'Stop', desc: 'Precision' },
              { icon: '🌍', label: 'GeoShape', desc: 'Spatial Knowledge' },
              { icon: '🔵', label: 'Mastermind', desc: 'Deductive Logic' },
            ].map((g, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #4A2C0A08' }}>
                <div style={{ fontSize: 24 }}>{g.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: BROWN }}>{g.label}</div>
                  <div style={{ fontSize: 12, color: `${BROWN}50`, fontWeight: 700 }}>{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { acePhaseRef.current = 'playing'; setPhase('ace') }} style={{
            width: '100%', padding: '18px', borderRadius: 20, border: 'none',
            background: BROWN, color: '#fff', fontSize: 18, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 8px 0 ${BROWN}60`,
          }}>Start Brain Test</button>
        </div>
      )}

      {/* ACE */}
      {phase === 'ace' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>1 of 5 — Ace</div>
          <div style={{ fontSize: 13, color: `${BROWN}50`, marginBottom: 8 }}>Hit the ball through the circle — {5 - aceLevel} left</div>
          <div style={{ position: 'relative', width: '100%' }} onClick={handleAceTap}>
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{ width: '100%', touchAction: 'none' }} />
            {aceResult && (
              <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', fontSize: 28, fontWeight: 900, color: aceResult === 'miss' ? '#C62828' : '#2E7D32', animation: 'popIn 0.3s ease' }}>
                {aceResult === 'perfect' ? 'ACE! 🎾' : aceResult === 'good' ? 'GOOD!' : 'MISS!'}
              </div>
            )}
          </div>
          <button onClick={handleAceTap} style={{ marginTop: 8, width: '80%', padding: '16px', borderRadius: 20, border: 'none', background: '#4CAF50', color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #2E7D3260' }}>SERVE!</button>
        </div>
      )}

      {/* N-BACK */}
      {phase === 'nback' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px', gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase' }}>2 of 5 — N-Back</div>
          <div style={{ fontSize: 13, color: `${BROWN}50` }}>{nbIndex + 1} of {NB_TOTAL} — Score: {nbScore}</div>
          <div style={{ width: 200, height: 200, borderRadius: 28, background: nbShowCard ? NBACK_COLORS[nbCurrent].bg : '#E0E0E0', boxShadow: nbShowCard ? `0 8px 0 ${NBACK_COLORS[nbCurrent].shadow}` : '0 4px 0 #BDBDBD', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            {!nbShowCard && <div style={{ fontSize: 20, fontWeight: 900, color: `${BROWN}25`, textAlign: 'center' }}>Same<br />or<br />Different?</div>}
          </div>
          {nbFeedback && <div style={{ fontSize: 20, fontWeight: 900, color: nbFeedback === 'correct' ? '#2E7D32' : '#C62828' }}>{nbFeedback === 'correct' ? '✓ Correct' : '✗ Wrong'}</div>}
          {nbPhase === 'answer' && (
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <button onClick={() => handleNbAnswer(false)} style={{ flex: 1, padding: '18px', borderRadius: 18, border: 'none', background: '#E53935', color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 5px 0 #B71C1C60' }}>Different</button>
              <button onClick={() => handleNbAnswer(true)} style={{ flex: 1, padding: '18px', borderRadius: 18, border: 'none', background: '#43A047', color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 5px 0 #2E7D3260' }}>Same</button>
            </div>
          )}
          {nbPhase !== 'answer' && <div style={{ display: 'flex', gap: 12, width: '100%', opacity: 0.3 }}>
            <div style={{ flex: 1, padding: '18px', borderRadius: 18, background: '#E53935', textAlign: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>Different</div>
            <div style={{ flex: 1, padding: '18px', borderRadius: 18, background: '#43A047', textAlign: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>Same</div>
          </div>}
        </div>
      )}

      {/* STOP */}
      {phase === 'stop' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', gap: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase' }}>3 of 5 — Stop</div>
          <div style={{ fontSize: 13, color: `${BROWN}50` }}>Stop at exactly 5 seconds</div>
          <div style={{ fontSize: 72, fontWeight: 900, color: '#4A148C', fontVariantNumeric: 'tabular-nums' }}>
            {stopPhase === 'ready' ? '5.00' : stopPhase === 'done' ? (stopElapsed / 1000).toFixed(2) : (stopElapsed / 1000).toFixed(2)}
          </div>
          {stopPhase === 'done' && <div style={{ fontSize: 20, fontWeight: 900, color: stopDiff < 100 ? '#2E7D32' : stopDiff < 500 ? GOLD : '#C62828' }}>{stopDiff}ms off</div>}
          {stopPhase === 'ready' && <button onClick={startStop} style={{ width: '100%', padding: '20px', borderRadius: 20, border: 'none', background: '#4A148C', color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #4A148C60' }}>Start</button>}
          {stopPhase === 'running' && <button onClick={stopIt} style={{ width: '100%', padding: '20px', borderRadius: 20, border: 'none', background: '#B71C1C', color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #B71C1C60' }}>Stop!</button>}
        </div>
      )}

      {/* GEOSHAPE */}
      {phase === 'geoshape' && geoCountries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px', gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase' }}>4 of 5 — GeoShape</div>
          <div style={{ fontSize: 13, color: `${BROWN}50` }}>{geoIndex + 1} of {GEO_TOTAL}</div>
          <img src={`${BASE}/shapes/${geoCountries[geoIndex].code}.svg`} alt="" style={{ width: 200, height: 180, objectFit: 'contain' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
            {geoOptions.map(opt => (
              <button key={opt} onClick={() => handleGeoAnswer(opt)} style={{
                padding: '14px', borderRadius: 14, border: 'none', fontFamily: 'inherit', cursor: 'pointer', fontSize: 13, fontWeight: 800,
                background: geoSelected === null ? '#fff' : opt === geoCountries[geoIndex].name ? '#2E7D32' : geoSelected === opt ? '#C62828' : '#fff',
                color: geoSelected && (opt === geoCountries[geoIndex].name || geoSelected === opt) ? '#fff' : BROWN,
                outline: 'none',
              }}>{opt}</button>
            ))}
          </div>
        </div>
      )}

      {/* MASTERMIND */}
      {phase === 'mastermind' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px', gap: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase' }}>5 of 5 — Mastermind</div>
          <div style={{ fontSize: 13, color: `${BROWN}50` }}>Crack the code — {MM_MAX - mmGuesses.length} attempts left</div>
          {mmGuesses.map((g, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 8 }}>
              {g.map((c, ci) => (
                <div key={ci} style={{ width: 44, height: 44, borderRadius: 10, background: MM_COLORS[c], border: mmFeedbacks[ri].correctPos.includes(ci) ? '3px solid #2E7D32' : mmFeedbacks[ri].wrongPos.includes(ci) ? '3px solid #E91E8C' : '3px solid transparent' }} />
              ))}
            </div>
          ))}
          {!mmDone && mmGuesses.length < MM_MAX && (
            <>
              <div style={{ display: 'flex', gap: 8 }}>
                {mmCurrent.map((c, ci) => (
                  <div key={ci} style={{ width: 44, height: 44, borderRadius: 10, background: c !== null ? MM_COLORS[c] : '#E0E0E0', border: `2px dashed ${BROWN}30` }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {MM_COLORS.map((col, ci) => (
                  <div key={ci} style={{ display: 'flex', gap: 6 }}>
                    {mmCurrent.map((_, pi) => (
                      <div key={pi} onClick={() => handleMmColor(ci, pi)} style={{ width: 36, height: 36, borderRadius: 8, background: col, cursor: 'pointer', opacity: mmCurrent[pi] === ci ? 1 : 0.5 }} />
                    ))}
                  </div>
                ))}
              </div>
              <button onClick={handleMmSubmit} disabled={mmCurrent.some(v => v === null)} style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', background: BROWN, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>Check →</button>
            </>
          )}
        </div>
      )}

      {/* RESULT */}
      {phase === 'result' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase' }}>Your Brain Profile</div>
          <div style={{ fontSize: 80, fontWeight: 900, color: BROWN, lineHeight: 1 }}>{brainScore}</div>
          <div style={{ fontSize: 14, color: `${BROWN}50`, fontWeight: 700 }}>Brain Score out of 1000</div>
          {worldPercent !== null && (
            <div style={{ background: `${GOLD}15`, borderRadius: 16, padding: '16px 24px', textAlign: 'center', border: `1px solid ${GOLD}30`, width: '100%' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>World ranking</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: GOLD }}>Top {100 - worldPercent}%</div>
            </div>
          )}
          <div style={{ width: '100%', background: '#fff', borderRadius: 20, padding: '20px', border: '1px solid #4A2C0A10' }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: `${BROWN}50`, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Your scores</div>
            {[
              { label: 'Ace', value: `${scores.ace}/5`, points: scores.ace * 40 },
              { label: 'N-Back', value: `${scores.nback}/${NB_TOTAL}`, points: scores.nback * 20 },
              { label: 'Stop', value: `${scores.stop}ms off`, points: Math.max(0, 200 - Math.floor(scores.stop / 10)) },
              { label: 'GeoShape', value: `${scores.geoshape}/${GEO_TOTAL}`, points: scores.geoshape * 40 },
              { label: 'Mastermind', value: `${scores.mastermind} tries`, points: Math.max(0, 200 - (scores.mastermind - 1) * 30) },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>{s.label}</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontSize: 13, color: `${BROWN}50` }}>{s.value}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: GOLD }}>{s.points}pts</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => {
            const text = `🧠 My Brain Score is ${brainScore}/1000 on MemGenius Brain Test! I'm in the top ${100 - (worldPercent || 50)}% worldwide. Can you beat me? memgenius.com/brain-test`
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
          }} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#25D366', color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #128C7E60' }}>
            Share on WhatsApp
          </button>
          <button onClick={() => window.location.href = '/'} style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', background: BROWN, color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>
            Play all games →
          </button>
        </div>
      )}
    </main>
  )
}
