'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import CreateGroupBanner from '@/components/CreateGroupBanner'
import { track } from '@vercel/analytics'
import { updateStreak } from '@/lib/streak'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const TROPHY = `${BASE}/nav-trophy.webp`
const LOGO = `${BASE}/2048.png`

const TILE_COLORS: Record<number, { bg: string, color: string }> = {
  0:    { bg: '#EEE4DA40', color: 'transparent' },
  2:    { bg: '#EEE4DA', color: '#776E65' },
  4:    { bg: '#EDE0C8', color: '#776E65' },
  8:    { bg: '#F2B179', color: '#fff' },
  16:   { bg: '#F59563', color: '#fff' },
  32:   { bg: '#F67C5F', color: '#fff' },
  64:   { bg: '#F65E3B', color: '#fff' },
  128:  { bg: '#EDCF72', color: '#fff' },
  256:  { bg: '#EDCC61', color: '#fff' },
  512:  { bg: '#EDC850', color: '#fff' },
  1024: { bg: '#EDC53F', color: '#fff' },
  2048: { bg: '#EDC22E', color: '#fff' },
  4096: { bg: '#6A1B9A', color: '#fff' },
  8192: { bg: '#E91E63', color: '#fff' },
}

type Board = number[][]
type Phase = 'intro' | 'playing' | 'gameover'

const emptyBoard = (): Board => Array(4).fill(null).map(() => Array(4).fill(0))

const addRandom = (board: Board): Board => {
  const empty: [number, number][] = []
  board.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]) }))
  if (!empty.length) return board
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  const next = board.map(row => [...row])
  next[r][c] = Math.random() < 0.9 ? 2 : 4
  return next
}

const initBoard = (): Board => addRandom(addRandom(emptyBoard()))

const moveLeft = (board: Board): [Board, number] => {
  let score = 0
  const next = board.map(row => {
    const nums = row.filter(v => v)
    const merged: number[] = []
    let i = 0
    while (i < nums.length) {
      if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
        merged.push(nums[i] * 2)
        score += nums[i] * 2
        i += 2
      } else {
        merged.push(nums[i])
        i++
      }
    }
    while (merged.length < 4) merged.push(0)
    return merged
  })
  return [next, score]
}

const rotate90 = (board: Board): Board =>
  board[0].map((_, i) => board.map(row => row[i]).reverse())

const move = (board: Board, dir: 'left' | 'right' | 'up' | 'down'): [Board, number] => {
  let b = board
  let rotations = 0
  if (dir === 'right') rotations = 2
  if (dir === 'up') rotations = 3
  if (dir === 'down') rotations = 1
  for (let i = 0; i < rotations; i++) b = rotate90(b)
  const [moved, score] = moveLeft(b)
  let result = moved
  for (let i = 0; i < (4 - rotations) % 4; i++) result = rotate90(result)
  return [result, score]
}

const boardsEqual = (a: Board, b: Board) =>
  a.every((row, r) => row.every((v, c) => v === b[r][c]))

const isGameOver = (board: Board): boolean => {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (!board[r][c]) return false
    if (c < 3 && board[r][c] === board[r][c + 1]) return false
    if (r < 3 && board[r][c] === board[r + 1][c]) return false
  }
  return true
}

const getBestTile = (board: Board) => Math.max(...board.flat())

function fmt(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export default function Game2048Page() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('intro')
  const [board, setBoard] = useState<Board>(emptyBoard)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [topScores, setTopScores] = useState<{ name: string, best_tile: number, time_ms: number }[]>([])
  const [bestTile, setBestTile] = useState(0)
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null)
  const [won, setWon] = useState(false)

  useEffect(() => { fetchTop() }, [])

  useEffect(() => {
    if (phase !== 'playing') return
    const t = setInterval(() => setElapsed(Date.now() - startTime), 1000)
    return () => clearInterval(t)
  }, [phase, startTime])

  const fetchTop = async () => {
    const { data } = await supabase.from('game2048_scores').select('player_name, best_tile, time_ms').order('best_tile', { ascending: false }).order('time_ms', { ascending: true }).limit(200)
    if (data) {
      const best: Record<string, { tile: number, time: number }> = {}
      data.forEach((s: any) => {
        if (!best[s.player_name] || s.best_tile > best[s.player_name].tile || (s.best_tile === best[s.player_name].tile && s.time_ms < best[s.player_name].time))
          best[s.player_name] = { tile: s.best_tile, time: s.time_ms }
      })
      setTopScores(Object.entries(best).map(([name, d]) => ({ name, best_tile: d.tile, time_ms: d.time })).sort((a, b) => b.best_tile - a.best_tile || a.time_ms - b.time_ms))
    }
  }

  const startGame = () => {
    const b = initBoard()
    setBoard(b)
    setScore(0)
    setElapsed(0)
    setWon(false)
    setWorldRank(null)
    setPhase('playing')
    setStartTime(Date.now())
  }

  const handleMove = useCallback(async (dir: 'left' | 'right' | 'up' | 'down') => {
    if (phase !== 'playing') return
    setBoard(prev => {
      const [moved, gained] = move(prev, dir)
      if (boardsEqual(prev, moved)) return prev
      const next = addRandom(moved)
      const tile = getBestTile(next)
      setBestTile(tile)
      setScore(s => {
        const newScore = s + gained
        if (newScore > bestScore) setBestScore(newScore)
        return newScore
      })

      if (tile === 2048 && !won) {
        setWon(true)
      }

      if (isGameOver(next)) {
        const finalTime = Date.now() - startTime
        setElapsed(finalTime)
        setPhase('gameover')
        if (profile?.name) {
          supabase.from('game2048_scores').insert({ player_name: profile.name, best_tile: tile, time_ms: finalTime })
            .then(() => updateStreak(profile.name))
            .then(() => { window.dispatchEvent(new Event('game_completed')) })
            .then(() => supabase.from('game2048_scores').select('player_name, best_tile, time_ms').order('best_tile', { ascending: false }).order('time_ms', { ascending: true }).limit(200))
            .then(({ data }) => {
              if (data) {
                const best: Record<string, { tile: number, time: number }> = {}
                data.forEach((s: any) => {
                  if (!best[s.player_name] || s.best_tile > best[s.player_name].tile || (s.best_tile === best[s.player_name].tile && s.time_ms < best[s.player_name].time))
                    best[s.player_name] = { tile: s.best_tile, time: s.time_ms }
                })
                const sorted = Object.entries(best).map(([name, d]) => ({ name, tile: d.tile, time: d.time })).sort((a, b) => b.tile - a.tile || a.time - b.time)
                setWorldRank(sorted.findIndex(s => s.name === profile.name) + 1)
                fetchTop()
              }
            })
        }
      }
      return next
    })
  }, [phase, won, startTime, profile?.name, bestScore])

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); handleMove('left') }
      if (e.key === 'ArrowRight') { e.preventDefault(); handleMove('right') }
      if (e.key === 'ArrowUp') { e.preventDefault(); handleMove('up') }
      if (e.key === 'ArrowDown') { e.preventDefault(); handleMove('down') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleMove])

  // Touch
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    const dx = e.changedTouches[0].clientX - touchStart.x
    const dy = e.changedTouches[0].clientY - touchStart.y
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return
    if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? 'right' : 'left')
    else handleMove(dy > 0 ? 'down' : 'up')
    setTouchStart(null)
  }

  const tileSize = 72
  const gap = 8

  return (
    <>
      <style>{`
        @keyframes floatLogo { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes popTile { from{transform:scale(0)} to{transform:scale(1)} }
      `}</style>

      <main style={{
        height: '100dvh', background: `linear-gradient(180deg, #FFF8E1 0%, ${CREAM} 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto',
        overflow: 'auto', paddingBottom: 80,
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px 0', width: '100%', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={LOGO} alt='2048' style={{ height: 48, objectFit: 'contain' }} />
            <div style={{ fontSize: 28, fontWeight: 900, color: BROWN, letterSpacing: -0.5, lineHeight: 1 }}>2048</div>
            <div style={{ fontSize: 11, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Reach the highest tile</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <div style={{ background: '#BBADA0', borderRadius: 10, padding: '6px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: '#EEE4DA', letterSpacing: 1 }}>SCORE</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{score}</div>
            </div>
            {phase === 'playing' && <div style={{ background: '#BBADA0', borderRadius: 10, padding: '6px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: '#EEE4DA', letterSpacing: 1 }}>TIME</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{fmt(elapsed)}</div>
            </div>}
          </div>
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 16, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 6 }}>Combine the tiles to reach 2048</div>
              <div style={{ fontSize: 13, color: `${BROWN}60`, lineHeight: 1.6 }}>Swipe to move all tiles.<br />Same numbers merge into one.<br />Reach the highest tile possible.</div>
            </div>

            {topScores[0] && (
              <div style={{ background: `${GOLD}15`, borderRadius: 14, padding: '10px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, textTransform: 'uppercase' }}>World record</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>{topScores[0].best_tile}</div>
                <div style={{ fontSize: 11, color: `${BROWN}50` }}>{topScores[0].name} · {fmt(topScores[0].time_ms)}</div>
              </div>
            )}

            <button onClick={startGame} style={{
              padding: '18px', borderRadius: 20, border: 'none',
              background: BROWN, color: '#fff',
              fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: `0 8px 0 ${BROWN}60`, width: '100%',
            }}>Play</button>

            <Link href="/2048/ranking" style={{ textDecoration: 'none', width: '100%' }}>
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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '12px 20px 0' }}
            onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

            {won && (
              <div style={{ background: '#EDC22E', borderRadius: 12, padding: '8px 20px', marginBottom: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>🎉 You reached 2048! Keep going!</div>
              </div>
            )}

            <div style={{
              background: '#BBADA0', borderRadius: 16, padding: gap,
              display: 'grid', gridTemplateColumns: `repeat(4, ${tileSize}px)`,
              gap, touchAction: 'none',
            }}>
              {board.flat().map((val, i) => {
                const colors = TILE_COLORS[val] || { bg: '#6A1B9A', color: '#fff' }
                return (
                  <div key={i} style={{
                    width: tileSize, height: tileSize, borderRadius: 8,
                    background: colors.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: val >= 1024 ? 18 : val >= 128 ? 22 : 26,
                    fontWeight: 900, color: colors.color,
                    transition: 'background 0.1s',
                  }}>
                    {val || ''}
                  </div>
                )
              })}
            </div>

            <button onClick={startGame} style={{
              marginTop: 16, padding: '10px 24px', borderRadius: 12, border: 'none',
              background: '#BBADA0', color: '#fff', fontSize: 13, fontWeight: 800,
              fontFamily: 'inherit', cursor: 'pointer',
            }}>New game</button>
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
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: `${BROWN}50`, textTransform: 'uppercase', marginBottom: 6 }}>Game Over</div>
              <div style={{ fontSize: 64, fontWeight: 900, color: BROWN, lineHeight: 1 }}>{bestTile}</div>
              <div style={{ fontSize: 13, color: `${BROWN}50`, fontWeight: 700, marginBottom: 8 }}>best tile · {fmt(elapsed)}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: BROWN, marginBottom: 16 }}>Score: {score}</div>


            </div>

            <CreateGroupBanner playerName={profile?.name || ''} />

            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button onClick={() => {
                const url = `${window.location.origin}/challenge?game=2048&score=${bestTile}&by=${encodeURIComponent(profile?.name || 'Someone')}`
                const text = `🧩 ${profile?.name} reached ${bestTile} in 2048 on MemGenius! Can you beat them? ${url}`
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
