'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const TROPHY = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/nav-trophy.webp'
const LOGO = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/sudoku.png'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const PURPLE = '#4A148C'

// Sudoku generator
function generateSudoku(difficulty: 'easy' | 'medium' | 'hard') {
  const base = 3, side = base * base
  const nums = (n: number) => Array.from({length: n}, (_, i) => i + 1)
  const shuffle = (arr: number[]) => arr.sort(() => Math.random() - 0.5)

  const pattern = (r: number, c: number) => (base * (r % base) + Math.floor(r / base) + c) % side
  const rows = [...nums(base).flatMap(g => shuffle(nums(base)).map(r => g * base + r - base - 1))]
  const cols = [...nums(base).flatMap(g => shuffle(nums(base)).map(c => g * base + c - base - 1))]
  const nums2 = shuffle(nums(side))

  const board: number[][] = Array.from({length: side}, (_, r) =>
    Array.from({length: side}, (_, c) => nums2[pattern(rows[r], cols[c])])
  )

  const removals = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 55
  const puzzle = board.map(row => [...row])
  let removed = 0
  while (removed < removals) {
    const r = Math.floor(Math.random() * 9)
    const c = Math.floor(Math.random() * 9)
    if (puzzle[r][c] !== 0) { puzzle[r][c] = 0; removed++ }
  }
  return { puzzle, solution: board }
}

function fmt(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export default function SudokuClient() {
  const { profile } = usePlayer()
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null)
  const [puzzle, setPuzzle] = useState<number[][]>([])
  const [solution, setSolution] = useState<number[][]>([])
  const [board, setBoard] = useState<number[][]>([])
  const [fixed, setFixed] = useState<boolean[][]>([])
  const [selected, setSelected] = useState<[number,number] | null>(null)
  const [phase, setPhase] = useState<'menu' | 'playing' | 'result'>('menu')
  const [elapsed, setElapsed] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [topScores, setTopScores] = useState<{ name: string, time_ms: number, difficulty: string }[]>([])
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(0)

  useEffect(() => {
    supabase.from('sudoku_scores').select('player_name, time_ms, difficulty').order('time_ms', { ascending: true }).limit(200)
      .then(({ data }) => {
        if (data) {
          const best: Record<string, { time_ms: number, difficulty: string }> = {}
          data.forEach((s: any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name].time_ms) best[s.player_name] = { time_ms: s.time_ms, difficulty: s.difficulty } })
          setTopScores(Object.entries(best).map(([name, d]) => ({ name, ...d })).sort((a, b) => a.time_ms - b.time_ms))
        }
      })
  }, [])

  useEffect(() => {
    if (!profile?.name || !difficulty) return
    supabase.from('sudoku_scores')
      .select('time_ms')
      .eq('player_name', profile.name)
      .eq('difficulty', difficulty)
      .order('time_ms', { ascending: true })
      .limit(1)
      .then(({ data }) => { if (data?.[0]) setBestScore(data[0].time_ms) })
  }, [profile?.name, difficulty])

  const startGame = (diff: 'easy' | 'medium' | 'hard') => {
    const { puzzle: p, solution: s } = generateSudoku(diff)
    setPuzzle(p)
    setSolution(s)
    setBoard(p.map(r => [...r]))
    setFixed(p.map(r => r.map(v => v !== 0)))
    setSelected(null)
    setErrors(new Set())
    setDifficulty(diff)
    setPhase('playing')
    setElapsed(0)
    startRef.current = Date.now()
    timerRef.current = setInterval(() => setElapsed(Date.now() - startRef.current), 1000)
  }

  const handleCell = (r: number, c: number) => {
    if (!fixed[r]?.[c]) setSelected([r, c])
  }

  const handleNumber = useCallback((n: number) => {
    if (!selected) return
    const [r, c] = selected
    if (fixed[r][c]) return
    const newBoard = board.map(row => [...row])
    newBoard[r][c] = n
    setBoard(newBoard)

    const newErrors = new Set(errors)
    const key = `${r}-${c}`
    if (solution[r][c] !== n) newErrors.add(key)
    else newErrors.delete(key)
    setErrors(newErrors)

    // Check win
    const complete = newBoard.every((row, ri) => row.every((v, ci) => v === solution[ri][ci]))
    if (complete) {
      if (timerRef.current) clearInterval(timerRef.current)
      const finalTime = Date.now() - startRef.current
      setElapsed(finalTime)
      setPhase('result')
      saveScore(finalTime)
    }
  }, [selected, fixed, board, solution, errors])

  const saveScore = async (timeMs: number) => {
    if (!profile?.name || !difficulty) return
    await supabase.from('sudoku_scores').insert({ player_name: profile.name, difficulty, time_ms: timeMs })
    const { data } = await supabase.from('sudoku_scores').select('player_name, time_ms').eq('difficulty', difficulty).order('time_ms', { ascending: true }).limit(500)
    if (data) {
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
      const myBest = Math.min(timeMs, best[profile.name] || timeMs)
      setWorldRank(Object.values(best).filter(t => t < myBest).length + 1)
      if (!bestScore || timeMs < bestScore) setBestScore(timeMs)
    }
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const COLORS = { easy: '#2E7D32', medium: GOLD, hard: '#C62828' }

  return (
    <main style={{ minHeight: '100dvh', background: `linear-gradient(180deg, #EDE7F6 0%, ${CREAM} 50%)`, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '0 0 140px', color: BROWN }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', gap: 12 }}>
        <img src={LOGO} alt="Sudoku" style={{ height: 52, objectFit: 'contain', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: PURPLE, letterSpacing: -0.5 }}>Sudoku</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>How fast can you solve it?</div>
        </div>
        <Link href="/" style={{ marginLeft: 'auto', textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: `1px solid ${BROWN}15`, borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 800, color: `${BROWN}60` }}>← Home</div>
        </Link>
      </div>

      {/* MENU */}
      {phase === 'menu' && (
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>

          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #4A2C0A10' }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Your best</div>
              {bestScore ? (
                <div style={{ fontSize: 28, fontWeight: 900, color: PURPLE }}>{fmt(bestScore)}</div>
              ) : (
                <div style={{ fontSize: 14, color: '#4A2C0A30', fontWeight: 700 }}>--</div>
              )}
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #4A2C0A10' }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>World record</div>
              {topScores[0] ? (
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#C8960C' }}>{fmt(topScores[0].time_ms)}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#4A2C0A60', marginTop: 4 }}>{topScores[0].name}</div>
                </div>
              ) : (
                <div style={{ fontSize: 14, color: '#4A2C0A30', fontWeight: 700 }}>--</div>
              )}
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: BROWN, alignSelf: 'flex-start' }}>Choose difficulty</div>
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button key={d} onClick={() => startGame(d)} style={{
              width: '100%', padding: '20px', borderRadius: 20, border: 'none',
              background: COLORS[d], color: '#fff',
              fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: '0 8px 0 ' + COLORS[d] + '60',
              textTransform: 'capitalize',
            }}>{d}</button>
          ))}
          <a href="/sudoku/ranking" style={{ textDecoration: 'none', width: '100%' }}>
            <div style={{ width: '100%', padding: '14px', borderRadius: 16, background: '#fff', border: '1.5px solid #4A2C0A20', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxSizing: 'border-box' }}>
              <img src={TROPHY} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
              <span style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>World Ranking</span>
            </div>
          </a>
        </div>
      )}

      {/* PLAYING */}
      {(phase === 'playing' || phase === 'result') && (
        <div style={{ padding: '16px 12px' }}>

          {/* Timer */}
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: PURPLE, fontVariantNumeric: 'tabular-nums' }}>{fmt(elapsed)}</div>
            {bestScore && <div style={{ fontSize: 12, color: `${BROWN}50` }}>Best: {fmt(bestScore)}</div>}
          </div>

          {/* Board */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)',
            gap: 2, background: '#E0E0E0', padding: 2, borderRadius: 12,
            marginBottom: 16,
          }}>
            {board.map((row, r) => row.map((val, c) => {
              const isSelected = selected?.[0] === r && selected?.[1] === c
              const isFixed = fixed[r]?.[c]
              const isError = errors.has(`${r}-${c}`)
              const isHighlight = selected && (selected[0] === r || selected[1] === c || (Math.floor(selected[0]/3) === Math.floor(r/3) && Math.floor(selected[1]/3) === Math.floor(c/3)))
              const borderR = (c + 1) % 3 === 0 && c !== 8
              const borderB = (r + 1) % 3 === 0 && r !== 8

              return (
                <div key={`${r}-${c}`} onClick={() => handleCell(r, c)} style={{
                  aspectRatio: '1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? '#F3F0FF' : isError ? '#FFEBEE' : '#fff',
                  fontSize: 16, fontWeight: isFixed ? 900 : 700,
                  color: isError ? '#C62828' : BROWN,
                  cursor: isFixed ? 'default' : 'pointer',
                  borderRight: borderR ? '2px solid #BDBDBD' : undefined,
                  borderBottom: borderB ? '2px solid #BDBDBD' : undefined,
                  borderRadius: 4,
                  transition: 'background 0.1s',
                }}>
                  {val !== 0 ? val : ''}
                </div>
              )
            }))}
          </div>

          {/* Number pad */}
          {phase === 'playing' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 6, marginBottom: 16 }}>
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} onClick={() => handleNumber(n)} style={{
                  aspectRatio: '1', borderRadius: 10, border: 'none',
                  background: '#fff', color: PURPLE,
                  fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
                  cursor: 'pointer', boxShadow: `0 3px 0 ${PURPLE}20`,
                }}>{n}</button>
              ))}
            </div>
          )}

          {/* Erase button */}
          {phase === 'playing' && (
            <button onClick={() => handleNumber(0)} style={{
              width: '100%', padding: '12px', borderRadius: 14, border: 'none',
              background: '#fff', color: `${BROWN}60`,
              fontSize: 14, fontWeight: 800, fontFamily: 'inherit',
              cursor: 'pointer', marginBottom: 8,
            }}>Erase</button>
          )}

          {/* Result */}
          {phase === 'result' && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: PURPLE }}>{fmt(elapsed)}</div>
              {worldRank && <div style={{ fontSize: 20, fontWeight: 900, color: GOLD, marginTop: 4 }}>#{worldRank} World · {difficulty}</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button onClick={() => {
                  const text = `🧩 I solved the ${difficulty} Sudoku in ${fmt(elapsed)} on MemGenius! Can you beat me? memgenius.com/sudoku`
                  const url = 'https://memgenius.com/sudoku'
                  if (navigator.share) { navigator.share({ title: 'MemGenius', text, url }) } else { window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank') }
                }} style={{
                  flex: 2, padding: '16px', borderRadius: 16, border: 'none',
                  background: '#25D366', color: '#fff',
                  fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
                }}>Share</button>
                <button onClick={() => setPhase('menu')} style={{
                  flex: 1, padding: '14px', borderRadius: 14, border: 'none',
                  background: GOLD, color: '#fff',
                  fontSize: 13, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
                }}>Play again</button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
