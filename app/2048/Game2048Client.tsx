'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

const TILE_COLORS: Record<number, { bg: string, color: string }> = {
 0:    { bg: '#3a3a3a', color: 'transparent' },
 2:    { bg: '#eee4da', color: '#776e65' },
 4:    { bg: '#ede0c8', color: '#776e65' },
 8:    { bg: '#f2b179', color: '#fff' },
 16:   { bg: '#f59563', color: '#fff' },
 32:   { bg: '#f67c5f', color: '#fff' },
 64:   { bg: '#f65e3b', color: '#fff' },
 128:  { bg: '#edcf72', color: '#fff' },
 256:  { bg: '#edcc61', color: '#fff' },
 512:  { bg: '#edc850', color: '#fff' },
 1024: { bg: '#edc53f', color: '#fff' },
 2048: { bg: '#edc22e', color: '#fff' },
}

function newBoard(): number[] {
 const board = Array(16).fill(0)
 return addTile(addTile(board))
}

function addTile(board: number[]): number[] {
 const empty = board.map((v,i) => v === 0 ? i : -1).filter(i => i !== -1)
 if (empty.length === 0) return board
 const idx = empty[Math.floor(Math.random() * empty.length)]
 const newBoard = [...board]
 newBoard[idx] = Math.random() < 0.9 ? 2 : 4
 return newBoard
}

function slideRow(row: number[]): { row: number[], score: number } {
 const filtered = row.filter(v => v !== 0)
 let score = 0
 for (let i = 0; i < filtered.length - 1; i++) {
   if (filtered[i] === filtered[i+1]) {
     filtered[i] *= 2
     score += filtered[i]
     filtered.splice(i+1, 1)
   }
 }
 while (filtered.length < 4) filtered.push(0)
 return { row: filtered, score }
}

function move(board: number[], dir: string): { board: number[], score: number, moved: boolean } {
 let grid = Array.from({ length: 4 }, (_, i) => board.slice(i*4, i*4+4))
 let totalScore = 0
 let moved = false

 if (dir === 'left') {
   grid = grid.map(row => { const r = slideRow(row); totalScore += r.score; if (r.row.join() !== row.join()) moved = true; return r.row })
 } else if (dir === 'right') {
   grid = grid.map(row => { const rev = [...row].reverse(); const r = slideRow(rev); totalScore += r.score; const res = r.row.reverse(); if (res.join() !== row.join()) moved = true; return res })
 } else if (dir === 'up') {
   for (let c = 0; c < 4; c++) {
     const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]]
     const r = slideRow(col)
     totalScore += r.score
     if (r.row.join() !== col.join()) moved = true
     for (let rr = 0; rr < 4; rr++) grid[rr][c] = r.row[rr]
   }
 } else if (dir === 'down') {
   for (let c = 0; c < 4; c++) {
     const col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]]
     const r = slideRow(col)
     totalScore += r.score
     if (r.row.join() !== col.join()) moved = true
     for (let rr = 0; rr < 4; rr++) grid[3-rr][c] = r.row[rr]
   }
 }

 return { board: grid.flat(), score: totalScore, moved }
}

function isGameOver(board: number[]): boolean {
 if (board.includes(0)) return false
 for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
   const v = board[i*4+j]
   if (j < 3 && v === board[i*4+j+1]) return false
   if (i < 3 && v === board[(i+1)*4+j]) return false
 }
 return true
}

type Phase = 'rules' | 'playing' | 'result'

export default function Game2048Client() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [board, setBoard] = useState<number[]>(Array(16).fill(0))
 const [score, setScore] = useState(0)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])
 const [touchStart, setTouchStart] = useState<{x:number,y:number}|null>(null)

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('game2048_scores').select('player_name, score').order('score', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.score > best[s.player_name]) best[s.player_name] = s.score })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,s]) => ({name, score:s.toLocaleString()})))
   if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
 }, [profile?.name])

 useState(() => { loadData() })

 const startGame = () => {
   setBoard(newBoard())
   setScore(0)
   setWorldRank(null)
    startTimeRef.current = Date.now()
    setTimeMs(0)
   setPhase('playing')
   window.dispatchEvent(new Event('gameStart'))
 }

 const endGame = useCallback(async (finalScore: number) => {
   setPhase('result')
   window.dispatchEvent(new Event('gameResult'))
   const { count } = await supabase.from('game2048_scores').select('player_name', { count: 'exact', head: true }).gt('score', finalScore)
   setWorldRank((count ?? 0) + 1)
   if (profile?.name && finalScore > 0) await supabase.from('game2048_scores').insert({ player_name: profile.name, score: finalScore })
 }, [profile?.name])

 const handleMove = useCallback((dir: string) => {
   if (phase !== 'playing') return
   setBoard(prev => {
     const result = move(prev, dir)
     if (!result.moved) return prev
     const newB = addTile(result.board)
     setScore(s => {
       const newScore = s + result.score
       if (isGameOver(newB)) setTimeout(() => endGame(newScore), 100)
       return newScore
     })
     return newB
   })
 }, [phase, endGame])

  useEffect(() => {
    if (phase !== 'playing') { clearInterval(timerIntervalRef.current); return }
    timerIntervalRef.current = setInterval(() => setTimeMs(Date.now() - startTimeRef.current), 100)
    return () => clearInterval(timerIntervalRef.current)
  }, [phase])

 useEffect(() => {
   const onKey = (e: KeyboardEvent) => {
     const map: Record<string,string> = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' }
     if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]) }
   }
   window.addEventListener('keydown', onKey)
   return () => window.removeEventListener('keydown', onKey)
 }, [handleMove])

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen icon="2048.png" title="2048" subtitle="Merge tiles to reach 2048" worldRecord={worldRecord} myBest={myBest !== null ? myBest.toLocaleString() : null} top5={top5} onPlay={startGame} />
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={score.toLocaleString()}
     resultColor={score >= 10000 ? '#00C853' : score >= 2000 ? GOLD : '#D32F2F'}
     background={score >= 10000 ? '#0D3320' : score >= 2000 ? '#2D1A00' : '#1A0000'}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   />
 )

 return (
   <main style={{ height:'100dvh', maxHeight:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden', position:'fixed', width:'100%', maxWidth:430, overscrollBehavior:'none', touchAction:'none' }}>
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
       <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{score.toLocaleString()}</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>2048</div>
        <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.5)' }}>{String(Math.floor(timeMs/60000)).padStart(2,'0')}:{String(Math.floor((timeMs%60000)/1000)).padStart(2,'0')}</div>
     </div>

     <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 12px', overflow:'hidden' }}
       onTouchStart={e => setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })}
       onTouchEnd={e => {
         if (!touchStart) return
         const dx = e.changedTouches[0].clientX - touchStart.x
         const dy = e.changedTouches[0].clientY - touchStart.y
         if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? 'right' : 'left')
         else handleMove(dy > 0 ? 'down' : 'up')
         setTouchStart(null)
       }}>
       <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, width:'100%', maxWidth:360 }}>
         {board.map((val, i) => {
           const tc = TILE_COLORS[val] || { bg:'#f59563', color:'#fff' }
           return (
             <div key={i} style={{ aspectRatio:'1', borderRadius:8, background:tc.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize: val >= 1024 ? 16 : val >= 128 ? 20 : 24, fontWeight:900, color:tc.color, transition:'background 0.1s' }}>
               {val || ''}
             </div>
           )
         })}
       </div>
     </div>
   </main>
 )
}
