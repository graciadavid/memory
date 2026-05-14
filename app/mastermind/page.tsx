'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const PURPLE = '#6A1B9A'

const COLORS = ['#6A1B9A', '#1E88E5', '#43A047', '#FDD835', '#FB8C00']
const EMPTY = '#E0E0E0'
const MAX_ATTEMPTS = 7
const CODE_LENGTH = 5

const generateCode = () => Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * COLORS.length))

const getFeedback = (guess: number[], code: number[]) => {
  const codeUsed = Array(CODE_LENGTH).fill(false)
  const guessUsed = Array(CODE_LENGTH).fill(false)
  const correctPos: number[] = []
  const wrongPos: number[] = []

  guess.forEach((g, i) => {
    if (g === code[i]) { correctPos.push(i); codeUsed[i] = true; guessUsed[i] = true }
  })
  guess.forEach((g, i) => {
    if (guessUsed[i]) return
    const idx = code.findIndex((c, j) => c === g && !codeUsed[j])
    if (idx !== -1) { wrongPos.push(i); codeUsed[idx] = true }
  })

  return { black: correctPos.length, white: wrongPos.length, correctPos, wrongPos }
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
  const [feedbacks, setFeedbacks] = useState<{ black: number, white: number, correctPos: number[], wrongPos: number[] }[]>([])
  const [current, setCurrent] = useState<(number | null)[]>(Array(CODE_LENGTH).fill(null))
  const [phase, setPhase] = useState<'playing' | 'won' | 'lost'>('playing')
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [finalTime, setFinalTime] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [bestScore, setBestScore] = useState<{ time_ms: number, attempts: number } | null>(null)
  const [blinking, setBlinking] = useState<number[]>([])
  const [selectedPos, setSelectedPos] = useState<number>(0)
  const [checking, setChecking] = useState(false)

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
    if (current.some(v => v === null) || checking) return
    setChecking(true)
    const guess = current as number[]
    const fb = getFeedback(guess, code)

    // Blink wrong positions
    setBlinking(fb.wrongPos)
    
    setTimeout(async () => {
      setBlinking([])
      const newGuesses = [...guesses, guess]
      const newFeedbacks = [...feedbacks, fb]
      setGuesses(newGuesses)
      setFeedbacks(newFeedbacks)

      const won = fb.black === CODE_LENGTH
      const lost = !won && newGuesses.length >= MAX_ATTEMPTS

      if (won || lost) {
        const time = Date.now() - startTime
        setFinalTime(time)
        setPhase(won ? 'won' : 'lost')
        if (won && profile?.name) {
          await supabase.from('mastermind_scores').insert({ player_name: profile.name, attempts: newGuesses.length, time_ms: time })
          const { data } = await supabase.from('mastermind_scores').select('player_name, time_ms').order('time_ms', { ascending: true }).limit(500)
          if (data) {
            const best: Record<string, number> = {}
            data.forEach((s: any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
            setWorldRank(Object.values(best).filter(t => t < time).length + 1)
          }
        }
      } else {
        // Pre-fill next row with correct positions
        const fixed: (number | null)[] = Array(CODE_LENGTH).fill(null)
        fb.correctPos.forEach(i => { fixed[i] = guess[i] })
        setCurrent(fixed)
        const firstEmpty = fixed.findIndex(v => v === null)
        setSelectedPos(firstEmpty !== -1 ? firstEmpty : 0)
      }
      setChecking(false)
    }, 1000)
  }, [current, guesses, feedbacks, code, startTime, profile?.name, checking])

  const selectColor = (colorIdx: number) => {
    if (phase !== 'playing' || checking) return
    const next = [...current]
    next[selectedPos] = colorIdx
    setCurrent(next)
    const nextEmpty = next.findIndex((v, i) => i > selectedPos && v === null)
    if (nextEmpty !== -1) setSelectedPos(nextEmpty)
    else {
      const anyEmpty = next.findIndex(v => v === null)
      if (anyEmpty !== -1) setSelectedPos(anyEmpty)
    }
  }

  const clearPos = (pos: number) => {
    if (phase !== 'playing' || checking) return
    const lastFb = feedbacks[feedbacks.length - 1]
    if (lastFb && lastFb.correctPos.includes(pos)) return
    const next = [...current]
    next[pos] = null
    setCurrent(next)
    setSelectedPos(pos)
  }

  const lastFb = feedbacks[feedbacks.length - 1]
  const fixedPositions = lastFb?.correctPos ?? []
  const canSubmit = current.every(v => v !== null) && phase === 'playing' && !checking

  return (
    <main style={{ minHeight: '100dvh', background: `linear-gradient(180deg, #EDE7F6 0%, ${CREAM} 40%)`, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '0 0 100px', color: BROWN }}>

      <style>{`
        @keyframes blink { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:0.4; transform:scale(0.8) } }
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

      {/* Board */}
      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Past rows */}
        {guesses.map((guess, rowIdx) => {
          const fb = feedbacks[rowIdx]
          return (
            <div key={rowIdx} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {guess.map((col, j) => {
                const isCorrect = fb.correctPos.includes(j)
                const isWrong = fb.wrongPos.includes(j)
                return (
                  <div key={j} style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: COLORS[col],
                    boxShadow: `0 4px 0 ${COLORS[col]}50`,
                    border: isCorrect ? '4px solid #2E7D32' : isWrong ? '4px solid #E91E63' : 'none',
                    opacity: !isCorrect && !isWrong ? 0.4 : 1,
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
              const isFixed = fixedPositions.includes(j)
              return (
                <div key={j} onClick={() => !isFixed && clearPos(j)} style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: col !== null ? COLORS[col] : EMPTY,
                  boxShadow: col !== null ? `0 4px 0 ${COLORS[col]}50` : 'none',
                  border: selectedPos === j && !isFixed ? `3px solid ${PURPLE}` : 'none',
                  cursor: isFixed ? 'default' : 'pointer',
                  opacity: isFixed ? 0.8 : 1,
                }} />
              )
            })}
          </div>
        )}

        {/* Empty rows */}
        {phase === 'playing' && Array(MAX_ATTEMPTS - guesses.length - 1).fill(null).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, justifyContent: 'center', opacity: 0.2 }}>
            {Array(CODE_LENGTH).fill(null).map((_, j) => (
              <div key={j} style={{ width: 52, height: 52, borderRadius: '50%', background: EMPTY }} />
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
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
              {code.map((c, i) => <div key={i} style={{ width: 40, height: 40, borderRadius: '50%', background: COLORS[c], boxShadow: `0 3px 0 ${COLORS[c]}60` }} />)}
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
            <button onClick={() => window.location.reload()} style={{ flex: 1, padding: '14px', borderRadius: 14, border: 'none', background: GOLD, color: '#fff', fontSize: 13, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>Play again</button>
          </div>
        </div>
      )}

      {/* Color picker */}
      {phase === 'playing' && (
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
            {COLORS.map((color, i) => (
              <button key={i} onClick={() => selectColor(i)} style={{
                width: 52, height: 52, borderRadius: '50%', border: 'none',
                background: color, cursor: 'pointer',
                boxShadow: `0 4px 0 ${color}60`,
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
