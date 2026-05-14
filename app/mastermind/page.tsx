'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const PURPLE = '#6A1B9A'

const COLORS = ['#E53935', '#1E88E5', '#43A047', '#FDD835', '#FB8C00', '#8E24AA']
const COLOR_NAMES = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple']
const EMPTY = '#E0E0E0'
const MAX_ATTEMPTS = 8
const CODE_LENGTH = 5

const generateCode = () => Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * COLORS.length))

const getFeedback = (guess: number[], code: number[]) => {
  let black = 0, white = 0
  const codeUsed = Array(CODE_LENGTH).fill(false)
  const guessUsed = Array(CODE_LENGTH).fill(false)

  // Black pegs
  guess.forEach((g, i) => { if (g === code[i]) { black++; codeUsed[i] = true; guessUsed[i] = true } })

  // White pegs
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
  const [feedbacks, setFeedbacks] = useState<{ black: number, white: number }[]>([])
  const [current, setCurrent] = useState<number[]>([])
  const [selected, setSelected] = useState<number>(0)
  const [phase, setPhase] = useState<'playing' | 'won' | 'lost'>('playing')
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [finalTime, setFinalTime] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [bestScore, setBestScore] = useState<{ time_ms: number, attempts: number } | null>(null)

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

  const submitGuess = useCallback(async () => {
    if (current.length !== CODE_LENGTH) return
    const fb = getFeedback(current, code)
    const newGuesses = [...guesses, current]
    const newFeedbacks = [...feedbacks, fb]
    setGuesses(newGuesses)
    setFeedbacks(newFeedbacks)
    setCurrent([])

    const won = fb.black === CODE_LENGTH
    const lost = !won && newGuesses.length >= MAX_ATTEMPTS

    if (won || lost) {
      const time = Date.now() - startTime
      setFinalTime(time)
      setPhase(won ? 'won' : 'lost')

      if (won && profile?.name) {
        await supabase.from('mastermind_scores').insert({
          player_name: profile.name,
          attempts: newGuesses.length,
          time_ms: time,
        })
        const { data } = await supabase.from('mastermind_scores').select('player_name, time_ms').order('time_ms', { ascending: true }).limit(500)
        if (data) {
          const best: Record<string, number> = {}
          data.forEach((s: any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
          setWorldRank(Object.values(best).filter(t => t < time).length + 1)
        }
      }
    }
  }, [current, guesses, feedbacks, code, startTime, profile?.name])

  const addColor = (colorIdx: number) => {
    if (phase !== 'playing' || current.length >= CODE_LENGTH) return
    setCurrent(p => [...p, colorIdx])
  }

  const removeColor = () => {
    if (phase !== 'playing') return
    setCurrent(p => p.slice(0, -1))
  }

  const playAgain = () => window.location.reload()

  return (
    <main style={{ minHeight: '100dvh', background: `linear-gradient(180deg, #EDE7F6 0%, ${CREAM} 40%)`, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '0 0 100px', color: BROWN }}>

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
          <div style={{ width: 10, height: 10, borderRadius: '50%', border: '3px solid #E91E63' }} />
          Wrong position
        </div>
      </div>

      {/* Board */}
      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array(MAX_ATTEMPTS).fill(null).map((_, rowIdx) => {
          const guess = guesses[rowIdx]
          const fb = feedbacks[rowIdx]
          const isActive = rowIdx === guesses.length && phase === 'playing'
          const row = isActive ? [...current, ...Array(CODE_LENGTH - current.length).fill(-1)] : guess || Array(CODE_LENGTH).fill(-2)

          return (
            <div key={rowIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              {row.map((col, j) => {
                const isBlack = fb && j < fb.black
                const isWhite = fb && !isBlack && j < fb.black + fb.white
                return (
                  <div key={j} style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: col >= 0 ? COLORS[col] : EMPTY,
                    border: isBlack ? '4px solid #2E7D32' : isWhite ? '4px solid #E91E63' : isActive && j === current.length ? `4px solid ${PURPLE}` : isActive ? '2px solid #E0E0E0' : '2px solid transparent',
                    boxShadow: col >= 0 ? `0 4px 0 ${COLORS[col]}60` : 'none',
                    transition: 'background 0.2s',
                  }} />
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Result */}
      {phase !== 'playing' && (
        <div style={{ margin: '20px 20px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: phase === 'won' ? PURPLE : '#C62828' }}>
            {phase === 'won' ? fmt(finalTime) : 'Game Over'}
          </div>
          {phase === 'lost' && (
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
              {code.map((c, i) => <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: COLORS[c] }} />)}
            </div>
          )}
          <div style={{ fontSize: 14, color: `${BROWN}60`, marginTop: 4 }}>
            {phase === 'won' ? `Solved in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}` : 'The code was'}
          </div>
          {worldRank && <div style={{ fontSize: 20, fontWeight: 900, color: PURPLE, marginTop: 8 }}>#{worldRank} World</div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {phase === 'won' && (
              <button onClick={() => {
                const text = `I cracked the Mastermind code in ${fmt(finalTime)} with ${guesses.length} tries on MemGenius! Can you beat me? memgenius.com/mastermind`
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
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
            {COLORS.map((color, i) => (
              <button key={i} onClick={() => addColor(i)} style={{
                width: 44, height: 44, borderRadius: '50%', border: 'none',
                background: color, cursor: 'pointer',
                boxShadow: `0 4px 0 ${color}60`,
                transform: selected === i ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.1s',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={removeColor} style={{ flex: 1, padding: '12px', borderRadius: 14, border: 'none', background: '#fff', color: `${BROWN}60`, fontSize: 14, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 2px 0 #4A2C0A10' }}>⌫ Remove</button>
            <button onClick={submitGuess} disabled={current.length !== CODE_LENGTH} style={{ flex: 2, padding: '12px', borderRadius: 14, border: 'none', background: current.length === CODE_LENGTH ? PURPLE : `${PURPLE}40`, color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: current.length === CODE_LENGTH ? 'pointer' : 'default', boxShadow: current.length === CODE_LENGTH ? `0 4px 0 ${PURPLE}60` : 'none' }}>Check →</button>
          </div>
        </div>
      )}
    </main>
  )
}
