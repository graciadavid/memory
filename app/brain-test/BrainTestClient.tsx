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
  { code: 'ru', name: 'Russia' }, { code: 'ng', name: 'Nigeria' },
  { code: 'eg', name: 'Egypt' }, { code: 'za', name: 'South Africa' },
  { code: 'th', name: 'Thailand' }, { code: 'vn', name: 'Vietnam' },
  { code: 'pl', name: 'Poland' }, { code: 'ua', name: 'Ukraine' },
  { code: 'se', name: 'Sweden' }, { code: 'no', name: 'Norway' },
  { code: 'fi', name: 'Finland' }, { code: 'cl', name: 'Chile' },
  { code: 'co', name: 'Colombia' }, { code: 'pe', name: 'Peru' },
  { code: 'iq', name: 'Iraq' }, { code: 'ir', name: 'Iran' },
]

const CANVAS_W = 390
const CANVAS_H = 240
const TARGET_R = 26
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
  const colors = ['#E91E63','#2196F3','#4CAF50','#FF9800','#9C27B0','#FFD600','#00E676','#FFEA00','#FF5252']
  const shapes = ['8px', '10px', '6px']
  for (let i = 0; i < 120; i++) {
    const div = document.createElement('div')
    const size = shapes[i % shapes.length]
    const duration = 1.5 + Math.random() * 2.5
    const delay = Math.random() * 0.8
    const left = Math.random() * 100
    const rotation = Math.random() * 720
    div.style.cssText = `position:fixed;width:${size};height:${size};background:${colors[i%colors.length]};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};left:${left}vw;top:-10px;z-index:9999;animation:confettiFall ${duration}s ease-in forwards;animation-delay:${delay}s;transform:rotate(${rotation}deg)`
    document.body.appendChild(div)
    setTimeout(() => div.remove(), (duration + delay + 0.5) * 1000)
  }
}

const FLAG_COUNTRIES = [
  { code: 'us', name: 'United States' }, { code: 'gb', name: 'United Kingdom' },
  { code: 'fr', name: 'France' }, { code: 'de', name: 'Germany' },
  { code: 'es', name: 'Spain' }, { code: 'it', name: 'Italy' },
  { code: 'jp', name: 'Japan' }, { code: 'cn', name: 'China' },
  { code: 'br', name: 'Brazil' }, { code: 'in', name: 'India' },
  { code: 'ca', name: 'Canada' }, { code: 'au', name: 'Australia' },
  { code: 'mx', name: 'Mexico' }, { code: 'kr', name: 'South Korea' },
  { code: 'ru', name: 'Russia' }, { code: 'za', name: 'South Africa' },
  { code: 'ng', name: 'Nigeria' }, { code: 'ar', name: 'Argentina' },
  { code: 'se', name: 'Sweden' }, { code: 'no', name: 'Norway' },
  { code: 'pt', name: 'Portugal' }, { code: 'nl', name: 'Netherlands' },
  { code: 'ch', name: 'Switzerland' }, { code: 'tr', name: 'Turkey' },
  { code: 'eg', name: 'Egypt' }, { code: 'th', name: 'Thailand' },
  { code: 'pl', name: 'Poland' }, { code: 'id', name: 'Indonesia' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function FlagsMinigame({ onComplete }: { onComplete: (correct: number) => void }) {
  const BROWN = '#4A2C0A'
  const GOLD = '#C8960C'
  const questions = shuffle(FLAG_COUNTRIES).slice(0, 10)
  const [idx, setIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [options, setOptions] = useState<string[]>([])

  useEffect(() => {
    const q = questions[idx]
    const wrong = shuffle(FLAG_COUNTRIES.filter(c => c.code !== q.code)).slice(0, 3).map(c => c.name)
    setOptions(shuffle([q.name, ...wrong]))
    setFeedback(null)
  }, [idx])

  const handleAnswer = (answer: string) => {
    if (feedback) return
    const isCorrect = answer === questions[idx].name
    const newCorrect = isCorrect ? correct + 1 : correct
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setCorrect(newCorrect)
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        onComplete(newCorrect)
      } else {
        setIdx(i => i + 1)
      }
    }, 600)
  }

  const q = questions[idx]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', gap: 20, minHeight: '90dvh', justifyContent: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase' }}>Game 2 of 5 · Flags</div>
      <div style={{ fontSize: 13, color: `${BROWN}50`, fontWeight: 700 }}>{idx + 1} / 10</div>
      <img src={`https://flagcdn.com/w160/${q.code}.png`} alt="" style={{ width: 160, height: 'auto', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        {options.map(opt => (
          <button key={opt} onClick={() => handleAnswer(opt)} style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none',
            background: feedback
              ? opt === questions[idx].name ? '#2E7D32' : opt === (feedback === 'wrong' ? opt : '') ? '#B71C1C' : '#fff'
              : '#fff',
            color: feedback && (opt === questions[idx].name) ? '#fff' : `${BROWN}`,
            fontSize: 15, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: `1px solid ${BROWN}10`,
          }}>{opt}</button>
        ))}
      </div>
    </div>
  )
}

type GamePhase = 'intro' | 'ace' | 'flags' | 'stop' | 'geoshape' | 'digits' | 'result'

export default function BrainTestClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [scores, setScores] = useState({ ace: 0, flags: 0, stop: 0, geoshape: 0, digits: 0 })
  const [worldPercent, setWorldPercent] = useState<number | null>(null)
  const testStartTimeRef = useRef(0)
  const resultCardRef = useRef<HTMLDivElement>(null)

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
  const [aceStarted, setAceStarted] = useState(false)
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
  const [nbStarted, setNbStarted] = useState(false)
  const nbTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const NB_TOTAL = 5
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
  const [digitResult, setDigitResult] = useState<{ correct: number, total: number, points: number } | null>(null)

  const calcBrainScore = (s: typeof scores) => {
    // Ace: max 150pts (less weight)
    const aceP = Math.min(150, s.ace * 0.75)
    // Flags: max 250pts (10 questions, 25pts each)
    const nbP = Math.min(250, s.flags * 25)
    // Stop: 200pts base, -20pts per 100ms off
    const stopP = Math.max(0, Math.round(200 - (s.stop / 100) * 20))
    // GeoShape: max 200pts
    const geoP = Math.min(200, s.geoshape * 40)
    // Digits: fixed scale
    const digMap: Record<number, number> = { 7: 200, 6: 150, 5: 100, 4: 75, 3: 75, 2: 75, 1: 75, 0: 0 }
    const digCorrect = Math.round(s.digits / (200/7))
    const digP = digMap[Math.min(7, Math.max(0, digCorrect))] || 0
    return Math.round(aceP + nbP + stopP + geoP + digP)
  }

  const saveResult = async (finalScores: typeof scores) => {
    const total = calcBrainScore(finalScores)
    // Always save to localStorage for later use
    localStorage.setItem('pending_brain_test', JSON.stringify({
      score: total,
      ace_score: finalScores.ace,
      nback_score: finalScores.flags,
      stop_score: finalScores.stop,
      geoshape_score: finalScores.geoshape,
      mastermind_score: finalScores.digits,
    }))
    if (profile?.name) {
      await supabase.from('brain_test_scores').insert({
        player_name: profile.name, score: total,
        ace_score: finalScores.ace, nback_score: finalScores.flags,
        stop_score: finalScores.stop, geoshape_score: finalScores.geoshape,
        mastermind_score: finalScores.digits,
      })
      localStorage.removeItem('pending_brain_test')
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
      confetti()
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
    // no level display
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
    aceLevelRef.current = 0
    acePointsRef.current = 0
    setAceStarted(false)
    // Draw initial canvas with target circle
    setTimeout(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
      ctx.beginPath(); ctx.arc(TARGET_X, TARGET_Y, TARGET_R, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(76,175,80,0.15)'; ctx.fill()
      ctx.strokeStyle = '#4CAF50'; ctx.lineWidth = 3; ctx.stroke()
      ctx.strokeStyle = 'rgba(76,175,80,0.3)'; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(TARGET_X - TARGET_R, TARGET_Y); ctx.lineTo(TARGET_X + TARGET_R, TARGET_Y)
      ctx.moveTo(TARGET_X, TARGET_Y - TARGET_R); ctx.lineTo(TARGET_X, TARGET_Y + TARGET_R)
      ctx.stroke()
    }, 100)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [phase, startAceRound])

  const startAce = () => {
    setAceStarted(true)
    acePhaseRef.current = 'playing'
    setTimeout(() => startAceRound(), 300)
  }

  useEffect(() => {
    if (!aceDone) return
    const s = { ...scores, ace: acePointsRef.current }
    setScores(s)
    setTimeout(() => {
      nbIndexRef.current = 0; nbScoreRef.current = 0
      setNbIndex(0); setNbScore(0)
      startNbRound(0, null)
      setPhase('flags')
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
        // First card done - show second card, no answer needed yet
        setTimeout(() => {
          const second = Math.floor(Math.random() * NBACK_COLORS.length)
          nbPrevRef.current = next
          nbCurrentRef.current = second
          setNbPrev(next); setNbCurrent(second)
          setNbShowCard(true); setNbPhase('show')
          nbIndexRef.current = 1; setNbIndex(1)
          nbTimer.current = setTimeout(() => {
            // Second card done - NOW show answer buttons
            setNbShowCard(false)
            setNbPhase('answer')
          }, 2000)
        }, 500)
      } else {
        // All subsequent cards - show answer buttons
        setNbPhase('answer')
      }
    }, 2000)
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
        setTimeout(() => { setStopPhase('ready'); setPhase('stop') }, 300)
      } else {
        nbIndexRef.current = newIdx; setNbIndex(newIdx); setNbScore(newScore)
        startNbRound(newIdx, nbCurrentRef.current)
      }
    }, 300)
  }, [nbPhase, startNbRound])

  useEffect(() => {
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
        const seq = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10))
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
    if (next.length === 7) {
      const timeTaken = Date.now() - digitStartTime
      let correct = 0
      next.forEach((d, i) => { if (d === digitSeq[i]) correct++ })
      const digMap: Record<number, number> = { 7: 200, 6: 150, 5: 100, 4: 75, 3: 75, 2: 75, 1: 75, 0: 0 }
      const pts = digMap[correct] || 0
      setDigitResult({ correct, total: 7, points: pts })
      setScores(s => ({ ...s, digits: pts }))
      setDigitPhase('done')
      playSound(correct >= 5 ? 660 : 330, correct >= 5 ? 880 : 220, 0.3, 0.2)
    }
  }

  const handleDigitDelete = () => {
    if (digitPhase !== 'input') return
    setDigitInput(prev => prev.slice(0, -1))
  }

  const brainScore = calcBrainScore(scores)
  // Brain Age: base from score, penalized by total test time
  // Perfect score fast = age 18, zero score slow = age 65
  const testDuration = testStartTimeRef.current > 0 ? (Date.now() - testStartTimeRef.current) / 1000 : 240
  const expectedTime = 180 // 3 minutes expected
  const timePenalty = Math.max(0, Math.round((testDuration - expectedTime) / 30)) // +1 year per 30s over 3min
  const baseAge = Math.round(65 - (brainScore / 1000) * 47)
  const brainAge = Math.min(65, Math.max(18, baseAge + timePenalty))


  const shareImage = async () => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 800
      canvas.height = 1000
      const ctx = canvas.getContext('2d')!
      
      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, 1000)
      grad.addColorStop(0, '#0A0A1A')
      grad.addColorStop(0.6, '#0D1B2A')
      grad.addColorStop(1, '#0A1628')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 800, 1000)

      // Name
      if (profile?.name) {
        ctx.fillStyle = '#C8960C'
        ctx.font = '700 32px sans-serif'
        ctx.textAlign = 'center'
        ctx.letterSpacing = '6px'
        ctx.fillText(profile.name.toUpperCase(), 400, 180)
      }

      // Age number
      const ageColor = brainAge <= 25 ? '#00E676' : brainAge <= 35 ? '#69F0AE' : brainAge <= 45 ? '#FF9100' : '#FF5252'
      ctx.fillStyle = ageColor
      ctx.font = '900 280px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(String(brainAge), 400, 480)

      // years old
      ctx.fillStyle = ageColor
      ctx.globalAlpha = 0.8
      ctx.font = '700 40px sans-serif'
      ctx.fillText('years old', 400, 540)
      ctx.globalAlpha = 1

      // Message
      const msgs: Record<string, string[]> = {
        great: ['Exceptional.', 'Top 5% worldwide.'],
        good: ['Sharp mind.', 'Better than most.'],
        mid: ['Good performance.', 'Keep training.'],
        low: ['Room to grow.', 'Train daily.'],
        bad: ['Your brain needs training.', 'Start today.'],
      }
      const key = brainAge <= 25 ? 'great' : brainAge <= 32 ? 'good' : brainAge <= 40 ? 'mid' : brainAge <= 50 ? 'low' : 'bad'
      ctx.fillStyle = '#ffffff'
      ctx.font = '900 44px sans-serif'
      ctx.fillText(msgs[key][0], 400, 650)
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.font = '600 28px sans-serif'
      ctx.fillText(msgs[key][1], 400, 700)

      // URL watermark
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.font = '600 24px sans-serif'
      ctx.fillText('memgenius.com/brain-test', 400, 940)

      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], 'brain-age.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'MemGenius Brain Age',
            text: `My Brain Age is ${brainAge}! What's yours? memgenius.com/brain-test`,
            files: [file],
          })
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url; a.download = 'brain-age.png'; a.click()
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    } catch(e) {
      const text = `🧠 My Brain Age is ${brainAge} on MemGenius! What's yours?`
      const url = 'https://memgenius.com/brain-test'
      if (navigator.share) navigator.share({ title: 'MemGenius', text, url })
      else window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank')
    }
  }

  const getWeakArea = (s: typeof scores) => {
    const areas = [
      { key: 'flags', label: 'World Knowledge', score: Math.min(250, s.flags * 25), games: ['Flags', 'GeoShape'], hrefs: ['/flags', '/geoshape'], icon: '🌍' },
      { key: 'stop', label: 'Precision', score: Math.max(0, 200 - (s.stop / 100) * 20), games: ['Stop', 'F1 Reaction'], hrefs: ['/precision/stopwatch', '/precision/formula1'], icon: '⏱' },
      { key: 'geoshape', label: 'Spatial Knowledge', score: Math.min(200, s.geoshape * 40), games: ['GeoShape', 'Flags'], hrefs: ['/geoshape', '/flags'], icon: '🌍' },
      { key: 'digits', label: 'Short-term Memory', score: Math.min(200, s.digits), games: ['Digits', 'Simon Says'], hrefs: ['/digits', '/sequence'], icon: '🔢' },
      { key: 'ace', label: 'Agility', score: Math.min(200, s.ace), games: ['Ace', 'Pendulum'], hrefs: ['/ace', '/precision/pendulum'], icon: '🎾' },
    ]
    return areas.sort((a, b) => a.score - b.score)[0]
  }

  const getBrainMessage = (age: number) => {
    if (age <= 25) return { msg: 'Exceptional. Top 5% worldwide.', sub: 'Your brain performs like an elite.' }
    if (age <= 32) return { msg: 'Sharp mind. Better than most.', sub: 'You are above average.' }
    if (age <= 40) return { msg: 'Good performance. Keep training.', sub: 'Daily practice will lower your age.' }
    if (age <= 50) return { msg: 'Room to grow. Train daily.', sub: 'Consistency is the key.' }
    return { msg: 'Your brain needs training.', sub: 'Start today. Come back tomorrow.' }
  }

  return (
    <main style={{ minHeight: '100dvh', background: `linear-gradient(180deg, #E8EAF6 0%, ${CREAM} 100%)`, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
      `}</style>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: '0 32px', gap: 32 }}>
          <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/memgeniuslogofull.png" alt="MemGenius" style={{ width: '100%', maxWidth: 200, objectFit: 'contain', marginTop: -40 }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: BROWN, letterSpacing: -1, lineHeight: 1.1, marginBottom: 16 }}>Brain Age Test</div>
            <div style={{ fontSize: 20, color: `${BROWN}60`, lineHeight: 1.7, fontWeight: 600 }}>
              How old is your brain?<br />5 games. One result.
            </div>
          </div>
          <button onClick={() => { acePhaseRef.current = 'playing'; setPhase('ace') }} style={{
            width: '100%', padding: '22px', borderRadius: 20, border: 'none',
            background: '#2E7D32', color: '#fff', fontSize: 22, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #1B5E2060',
          }}>Start Brain Age Test</button>
        </div>
      )}

      {/* ACE */}
      {phase === 'ace' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 8 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: BROWN }}>Ace</div>
          <div style={{ fontSize: 16, color: `${BROWN}60`, fontWeight: 700, textAlign: 'center' }}>Hit the ball through the circle</div>
          <div style={{ position: 'relative', width: '100%' }} onClick={aceStarted ? handleAceTap : undefined}>
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{ width: '100%', touchAction: 'none' }} />
            {aceResult && (
              <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', fontSize: 32, fontWeight: 900, color: aceResult === 'miss' ? '#C62828' : aceResult === 'perfect' ? '#C8960C' : '#2E7D32', animation: 'popIn 0.3s ease' }}>
                {aceResult === 'perfect' ? 'ACE! 🎾' : aceResult === 'good' ? 'GOOD!' : 'MISS!'}
              </div>
            )}
          </div>
          {!aceStarted
            ? <button onClick={startAce} style={{ width: '80%', padding: '18px', borderRadius: 20, border: 'none', background: '#2E7D32', color: '#fff', fontSize: 22, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #1B5E2060' }}>Start</button>
            : <button onClick={handleAceTap} style={{ width: '80%', padding: '18px', borderRadius: 20, border: 'none', background: '#4CAF50', color: '#fff', fontSize: 22, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #2E7D3260' }}>SERVE!</button>
          }
        </div>
      )}

      {/* FLAGS */}
      {phase === 'flags' && (
        <FlagsMinigame onComplete={(correct: number) => {
          setScores(s => ({ ...s, flags: correct }))
          setPhase('stop')
        }} />
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
              <div style={{ fontSize: 60, fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: stopPhase === 'done' ? (stopDiff === 0 ? '#2E7D32' : '#C62828') : '#4A148C' }}>
                {(stopElapsed / 1000).toFixed(3)}s
              </div>
            </div>
          )}
          {stopPhase === 'done' && <div style={{ fontSize: 28, fontWeight: 900, color: stopDiff === 0 ? '#2E7D32' : '#C62828' }}>{stopDiff}ms off</div>}
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
            {digitPhase === 'show' ? 'Memorize these 7 digits' : digitPhase === 'input' ? 'Type them in order — fast!' : 'Done!'}
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
                {Array(7).fill(null).map((_, i) => (
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

          {digitPhase === 'done' && digitResult && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: `${BROWN}40`, letterSpacing: 1, textTransform: 'uppercase' }}>Correct sequence</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {digitSeq.map((d, i) => (
                  <div key={i} style={{ width: 36, height: 48, borderRadius: 10, background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff', boxShadow: '0 3px 0 #1B5E2060' }}>{d}</div>
                ))}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: `${BROWN}40`, letterSpacing: 1, textTransform: 'uppercase' }}>Your answer</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {digitSeq.map((d, i) => (
                  <div key={i} style={{ width: 36, height: 48, borderRadius: 10, background: digitInput[i] === d ? '#2E7D32' : '#C62828', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff', boxShadow: digitInput[i] === d ? '0 3px 0 #1B5E2060' : '0 3px 0 #B71C1C60' }}>{digitInput[i] ?? '?'}</div>
                ))}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: BROWN }}>
                {digitResult.correct} of 7 correct
              </div>
              <button onClick={() => saveResult({...scores})} style={{
                width: '100%', padding: '20px', borderRadius: 20, border: 'none',
                background: '#0D1B4B', color: '#fff', fontSize: 18, fontWeight: 900,
                fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #08103060',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              }}>Discover your Brain Age <span style={{ fontSize: 22 }}>→</span></button>
            </div>
          )}
        </div>
      )}

      {/* RESULT */}
      {phase === 'result' && (() => {
        const { msg, sub } = getBrainMessage(brainAge)
        const ageColor = brainAge <= 25 ? '#00E676' : brainAge <= 35 ? '#69F0AE' : brainAge <= 45 ? '#FF9100' : '#FF5252'
        return (
        <div ref={resultCardRef} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100dvh', padding: '40px 24px', gap: 0,
          background: 'linear-gradient(180deg, #0A0A1A 0%, #0D1B2A 60%, #0A1628 100%)',
          paddingBottom: 100,
        }}>
          {/* Name */}
          {profile?.name && (
            <div style={{ fontSize: 16, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 32 }}>{profile.name}</div>
          )}
          {!profile?.name && (
            <div style={{ marginBottom: 32 }} />
          )}

          {/* Age number */}
          <div style={{ fontSize: 120, fontWeight: 900, color: ageColor, lineHeight: 1, animation: 'popIn 0.5s ease', textShadow: `0 0 60px ${ageColor}40` }}>{brainAge}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: ageColor, marginTop: 4, marginBottom: 32, opacity: 0.8 }}>years old</div>

          {/* Message */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{msg}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>{sub}</div>
          </div>

          {/* Logo watermark */}
          <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/memgeniuslogofull.png" alt="MemGenius" style={{ width: 120, objectFit: 'contain', opacity: 0.6, marginBottom: 32 }} />

                    <div style={{ width: '100%' }}>
           <button onClick={() => window.location.href = '/my-plan'} style={{
             width: '100%', padding: '22px', borderRadius: 16, border: 'none',
             background: 'linear-gradient(135deg, #2E7D32, #1B5E20)',
             color: '#fff', fontSize: 20, fontWeight: 900,
             fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #1B5E2060',
           }}>Start my training plan →</button>
         </div>
        </div>
        )
      })()}
    </main>
  )
}
