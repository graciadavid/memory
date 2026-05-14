'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const PURPLE = '#6A1B9A'

const COLORS = ['#E53935', '#1E88E5', '#43A047', '#FDD835', '#FB8C00']
const EMPTY = '#E0E0E0'
const MAX_ATTEMPTS = 7
const CODE_LENGTH = 5

const generateCode = () => Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * COLORS.length))

const getFeedback = (guess: number[], code: number[]) => {
  let black = 0, white = 0
  const codeUsed = Array(CODE_LENGTH).fill(false)
  const guessUsed = Array(CODE_LENGTH).fill(false)
  guess.forEach((g, i) => { if (g === code[i]) { black++; codeUsed[i] = true; guessUsed[i] = true } })
  guess.forEach((g, i) => {
    if (guessUsed[i]) return
    const idx = code.findIndex((c, j) => c === g && !codeUsed[j])
    if (idx !== -1) { white++; codeUsed[idx] = true }
  })
  return { black, white }
}

function fmt(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const c = Math.floor((ms % 1000) / 100)
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}.${c}` : `${s}.${c}s`
}

export default function MastermindPage() {
  const { profile } = usePlayer()
  const [code] = useState(generateCode)
  const [guesses, setGuesses] = useState<number[][]>([])
  const [feedbacks, setFeedbacks] = useState<{ black: number, white: number, whitePositions: number[] }[]>([])
  const [current, setCurrent] = useState<(number | null)[]>(Array(CODE_LENGTH).fill(null))
  const [phase, setPhase] = useState<'playing' | 'won' | 'lost'>('playing')
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [finalTime, setFinalTime] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [bestScore, setBestScore] = useState<{ time_ms: number, attempts: number } | null>(null)
  const [blinking, setBlinking] = useState<number[]>([])
  const [selectedPos, setSelectedPos] = useState<number>(0)

  useEffect(() => {
    if (phase !== 'playing') return
    const t = setInterval(() => setElapsed(Date.now() - startTime), 100)
    return () => clearInterval(t)
  }, [phase, startTime])

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('mastermind_scores').select('time_ms, attempts').eq('player_name', profile.name).order('time_ms', { ascending: true }).limit(1)
      .then(({ data }) => { if (data?.[0]) setBestScore(data[0]) })
  }, [profile?.name])

  // Build next row with fixed correct positions
  const getFixedPositions = useCallback(() => {
    if (guesses.length === 0) return Array(CODE_LENGTH).fill(null)
    const lastGuess = guesses[guesses.length - 1]
    const lastFb = feedbacks[feedbacks.length - 1]
    return lastGuess.map((color, i) => {
      if (i < lastFb.black) return color // correct position — pre-fill
      return null
    })
  }, [guesses, feedbacks])

  useEffect(() => {
    if (phase !== 'playing') {
      const fixed = getFixedPositions()
      setCurrent(fixed)
      setSelectedPos(fixed.findIndex(v => v === null) ?? 0)
    }
  }, [guesses.length])

  const submitGuess = useCallback(async () => {
    if (current.some(v => v === null)) return
    const guess = current as number[]
    const fb = getFeedback(guess, code)

    // Find white positions for blinking
    const codeUsed = Array(CODE_LENGTH).fill(false)
    const guessUsed = Array(CODE_LENGTH).fill(false)
    const blackPos: number[] = []
    const whitePos: number[] = []

    guess.forEach((g, i) => { if (g === code[i]) { blackPos.push(i); codeUsed[i] = true; guessUsed[i] = true } })
    guess.forEach((g, i) => {
      if (guessUsed[i]) return
      const idx = code.findIndex((c, j) => c === g && !codeUsed[j])
      if (idx !== -1) { whitePos.push(i); codeUsed[idx] = true }
    })

    // Blink white positions
    setBlinking(whitePos)
    setTimeout(() => setBlinking([]), 1200)

    const newGuesses = [...guesses, guess]
    const newFeedbacks = [...feedbacks, { ...fb, whitePositions: whitePos }]

    setTimeout(() => {
      setGuesses(newGuesses)
      setFeedbacks(newFeedbacks)

      const won = fb.black === CODE_LENGTH
      const lost = !won && newGuesses.length >= MAX_ATTEMPTS

      if (won || lost) {
        const time = Date.now() - startTime
        setFinalTime(time)
        setPhase(won ? 'won' : 'lost')
        if (won && profile?.name) {
          supabase.from('mastermind_scores').insert({ player_name: profile.name, attempts: newGuesses.length, time_ms: time })
            .then(() => supabase.from('mastermind_scores').select('player_name, time_ms').order('time_ms', { ascending: true }).limit(500))
            .then(({ data }) => {
              if (data) {
                const best: Record<string, number> = {}
                data.forEach((s: any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
                setWorldRank(Object.values(best).filter(t => t < time).length + 1)
              }
            })
        }
      } else {
        // Pre-fill next row with correct positions
        const fixed = newGuesses[newGuesses.length - 1].map((color, i) => i < fb.black ? color : null)
        setCurrent(fixed)
        setSelectedPos(fixed.findIndex(v => v === null) ?? 0)
      }
    }, 1200)
  }, [current, guesses, feedbacks, code, startTime, profile?.name])

  const selectColor = (colorIdx: number) => {
    if (phase !== 'playing') return
    const next = [...current]
    next[selectedPos] = colorIdx
    setCurrent(next)
    // Move to next empty position
    const nextEmpty = next.findIndex((v, i) => i > selectedPos && v === null)
    if (nextEmpty !== -1) setSelectedPos(nextEmpty)
    else {
      const anyEmpty = next.findIndex(v => v === null)
      if (anyEmpty !== -1) setSelectedPos(anyEmpty)
    }
  }

  const clearPos = (pos: number) => {
    if (phase !== 'playing') return
    const lastFb = feedbacks[feedbacks.length - 1]
    if (lastFb && pos < lastFb.black) return // can't clear fixed positions
    const next = [...current]
    next[pos] = null
    setCurrent(next)
    setSelectedPos(pos)
  }

  const playAgain = () => window.location.reload()

  const lastFb = feedbacks[feedbacks.length - 1]
  const fixedCount = lastFb?.black ?? 0
  const canSubmit = current.every(v => v !== null) && phase === 'playing'

  return (
    <main style={{ minHeight: '100dvh', background: `linear-gradient(180deg, #EDE7F6 0%, ${CREAM} 40%)`, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '0 0 100px', color: BROWN }}>

      <style>{`
        @keyframes blink { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:0.3; transform:scale(0.85) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', gap: 12 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: PURPLE, letterSpacing: -0.5 }}>Mastermind</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Crack the color code</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {phase === 'playing' && <div style={{ fontSize: 18, fontWeight: 900, color: BROWN }}>{fmt(elapsed)}</div>}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: `1px solid ${BROWN}15`, borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 800, color: `${BROWN}60` }}>← Home</div>
          </Link>
        </div>
      </div>

      {bestScore && (
        <div style={{ margin: '12px 20px 0', background: `${PURPLE}10`, borderRadius: 14, padding: '10px 16px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, textTransform: 'uppercase' }}>Your best</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: PURPLE }}>{fmt(bestScore.time_ms)} · {bestScore.attempts} tries</div>
        </div>
      )}

      {/* Legend */}
      <div style={{ margin: '12px 20px 0', display: 'flex', gap: 16, fontSize: 11, fontWeight: 800, color: `${BROWN}50` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', border: '3px solid #2E7D32' }} />
          Correct position
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', border: '3px solid #E91E63', animation: 'blink 0.6s ease infinite' }} />
          Wrong position
        </div>
      </div>

      {/* Board — past rows */}
      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {guesses.map((guess, rowIdx) => {
          const fb = feedbacks[rowIdx]
          return (
            <div key={rowIdx} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {guess.map((col, j) => {
                const isCorrect = j < fb.black
                const isWrong = fb.whitePositions.includes(j)
                const isBlinking = rowIdx === guesses.length - 1 && blinking.includes(j)
                return (
                  <div key={j} style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: COLORS[col],
                    border: isCorrect ? '4px solid #2E7D32' : isWrong ? '4px solid #E91E63' : '2px solid transparent',
                    boxShadow: `0 4px 0 ${COLORS[col]}60`,
                    animation: isBlinking ? 'blink 0.6s ease 2' : undefined,
                    transition: 'border 0.3s',
                  }} />
                )
              })}
            </div>
          )
        })}

        {/* Active row */}
        {phase === 'playing' && (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {current.map((col, j) => {
              const isFixed = j < fixedCount
              return (
                <div key={j} onClick={() => !isFixed && clearPos(j)} style={{
                  width: 50, height: 50, borderRadius: '50%',
                  background: col !== null ? COLORS[col] : EMPTY,
                  border: selectedPos === j && !isFixed ? `4px solid ${PURPLE}` : isFixed ? '4px solid #2E7D32' : '2px solid #E0E0E0',
                  boxShadow: col !== null ? `0 4px 0 ${COLORS[col]}60` : 'none',
                  cursor: isFixed ? 'default' : 'pointer',
                  transition: 'border 0.2s',
                }} />
              )
            })}
          </div>
        )}

        {/* Empty rows */}
        {phase === 'playing' && Array(MAX_ATTEMPTS - guesses.length - 1).fill(null).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, justifyContent: 'center', opacity: 0.3 }}>
            {Array(CODE_LENGTH).fill(null).map((_, j) => (
              <div key={j} style={{ width: 50, height: 50, borderRadius: '50%', background: EMPTY, border: '2px solid #E0E0E0' }} />
            ))}
          </div>
        ))}
      </div>

      {/* Result */}
      {phase !== 'playing' && (
        <div style={{ margin: '20px 20px 0', textAlign: 'center', animation: 'fadeUp 0.4s ease' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: phase === 'won' ? PURPLE : '#C62828' }}>
            {phase === 'won' ? fmt(finalTime) : 'Game Over'}
          </div>
          {phase === 'lost' && (
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
              {code.map((c, i) => <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS[c], boxShadow: `0 3px 0 ${COLORS[c]}60` }} />)}
            </div>
          )}
          <div style={{ fontSize: 14, color: `${BROWN}60`, marginTop: 8 }}>
            {phase === 'won' ? `Solved in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}` : 'The code was'}
          </div>
          {worldRank && <div style={{ fontSize: 20, fontWeight: 900, color: PURPLE, marginTop: 8 }}>#{worldRank} World</div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {phase === 'won' && (
              <button onClick={() => {
                const text = `I cracked the Mastermind code in ${fmt(finalTime)} with ${guesses.length} tries on MemGenius! memgenius.com/mastermind`
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
              }} style={{ flex: 2, padding: '14px', borderRadius: 16, border: 'none', background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>Share</button>
            )}
            <button onClick={playAgain} style={{ flex: 1, padding: '14px', borderRadius: 14, border: 'none', background: GOLD, color: '#fff', fontSize: 13, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>Play again</button>
          </div>
        </div>
      )}

      {/* Color picker */}
      {phase === 'playing' && (
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
            {COLORS.map((color, i) => (
              <button key={i} onClick={() => selectColor(i)} style={{
                width: 50, height: 50, borderRadius: '50%', border: 'none',
                background: color, cursor: 'pointer',
                boxShadow: `0 4px 0 ${color}60`,
                transition: 'transform 0.1s',
              }} />
            ))}
          </div>
          <button onClick={submitGuess} disabled={!canSubmit} style={{
            width: '100%', padding: '14px', borderRadius: 16, border: 'none',
            background: canSubmit ? PURPLE : `${PURPLE}40`,
            color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit',
            cursor: canSubmit ? 'pointer' : 'default',
            boxShadow: canSubmit ? `0 4px 0 ${PURPLE}60` : 'none',
          }}>Check →</button>
        </div>
      )}
    </main>
  )
}
