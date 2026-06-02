'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const COLS = 10
const ROWS = 20

const PIECES = [
 { shape: [[1,1,1,1]], color: '#00BCD4' },
 { shape: [[1,1],[1,1]], color: '#FFD740' },
 { shape: [[0,1,0],[1,1,1]], color: '#CE93D8' },
 { shape: [[1,0,0],[1,1,1]], color: '#FF8A65' },
 { shape: [[0,0,1],[1,1,1]], color: '#1565C0' },
 { shape: [[0,1,1],[1,1,0]], color: '#2E7D32' },
 { shape: [[1,1,0],[0,1,1]], color: '#D32F2F' },
]

type Board = (string|null)[][]
type Piece = { shape: number[][], color: string, x: number, y: number }
type Phase = 'rules' | 'playing' | 'result'

function emptyBoard(): Board {
 return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function randomPiece(): Piece {
 const p = PIECES[Math.floor(Math.random() * PIECES.length)]
 return { ...p, x: Math.floor(COLS/2) - Math.floor(p.shape[0].length/2), y: 0 }
}

function rotate(shape: number[][]): number[][] {
 return shape[0].map((_, i) => shape.map(row => row[i]).reverse())
}

function isValid(board: Board, piece: Piece): boolean {
 for (let r = 0; r < piece.shape.length; r++) {
   for (let c = 0; c < piece.shape[r].length; c++) {
     if (!piece.shape[r][c]) continue
     const newR = piece.y + r
     const newC = piece.x + c
     if (newR < 0 || newR >= ROWS || newC < 0 || newC >= COLS) return false
     if (board[newR][newC]) return false
   }
 }
 return true
}

function placePiece(board: Board, piece: Piece): Board {
 const newBoard = board.map(row => [...row])
 for (let r = 0; r < piece.shape.length; r++) {
   for (let c = 0; c < piece.shape[r].length; c++) {
     if (piece.shape[r][c]) newBoard[piece.y+r][piece.x+c] = piece.color
   }
 }
 return newBoard
}

function clearLines(board: Board): { board: Board, lines: number } {
 const newBoard = board.filter(row => row.some(cell => !cell))
 const lines = ROWS - newBoard.length
 const empty = Array.from({ length: lines }, () => Array(COLS).fill(null))
 return { board: [...empty, ...newBoard], lines }
}

export default function TetrisClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [board, setBoard] = useState<Board>(emptyBoard())
 const [piece, setPiece] = useState<Piece|null>(null)
 const [score, setScore] = useState(0)
 const [level, setLevel] = useState(1)
 const [lines, setLines] = useState(0)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])
 const [touchX, setTouchX] = useState<number|null>(null)

 const boardRef = useRef<Board>(emptyBoard())
 const pieceRef = useRef<Piece|null>(null)
 const scoreRef = useRef(0)
 const linesRef = useRef(0)
 const levelRef = useRef(1)
 const phaseRef = useRef<Phase>('rules')
 const timerRef = useRef<any>(null)

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('tetris_scores').select('player_name, score').order('score', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.score > best[s.player_name]) best[s.player_name] = s.score })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,s]) => ({name, score:s.toLocaleString()})))
   if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
 }, [profile?.name])

 useState(() => { loadData() })

 const endGame = useCallback(async () => {
   clearInterval(timerRef.current)
   phaseRef.current = 'result'
   setPhase('result')
   window.dispatchEvent(new Event('gameResult'))
   const finalScore = scoreRef.current
   const { count } = await supabase.from('tetris_scores').select('player_name', { count: 'exact', head: true }).gt('score', finalScore)
   setWorldRank((count ?? 0) + 1)
   if (profile?.name && finalScore > 0) await supabase.from('tetris_scores').insert({ player_name: profile.name, score: finalScore })
 }, [profile?.name])

 const spawnPiece = useCallback((currentBoard: Board) => {
   const p = randomPiece()
   if (!isValid(currentBoard, p)) { endGame(); return }
   pieceRef.current = p
   setPiece(p)
 }, [endGame])

 const tick = useCallback(() => {
   if (phaseRef.current !== 'playing') return
   const p = pieceRef.current
   const b = boardRef.current
   if (!p) return
   const moved = { ...p, y: p.y + 1 }
   if (isValid(b, moved)) {
     pieceRef.current = moved
     setPiece({ ...moved })
   } else {
     const newBoard = placePiece(b, p)
     const { board: cleared, lines: clearedLines } = clearLines(newBoard)
     const newLines = linesRef.current + clearedLines
     const newLevel = Math.floor(newLines / 10) + 1
     const points = [0, 100, 300, 500, 800][clearedLines] * levelRef.current
     scoreRef.current += points
     linesRef.current = newLines
     levelRef.current = newLevel
     boardRef.current = cleared
     setBoard([...cleared])
     setScore(scoreRef.current)
     setLines(newLines)
     setLevel(newLevel)
     clearInterval(timerRef.current)
     const speed = Math.max(100, 800 - (newLevel-1)*70)
     timerRef.current = setInterval(tick, speed)
     spawnPiece(cleared)
   }
 }, [spawnPiece])

 const startGame = () => {
   const b = emptyBoard()
   boardRef.current = b
   scoreRef.current = 0
   linesRef.current = 0
   levelRef.current = 1
   phaseRef.current = 'playing'
   setBoard(b)
   setScore(0)
   setLines(0)
   setLevel(1)
   setPhase('playing')
   window.dispatchEvent(new Event('gameStart'))
   const p = randomPiece()
   pieceRef.current = p
   setPiece(p)
   clearInterval(timerRef.current)
   timerRef.current = setInterval(tick, 800)
 }

 const move = useCallback((dx: number) => {
   const p = pieceRef.current
   if (!p || phaseRef.current !== 'playing') return
   const moved = { ...p, x: p.x + dx }
   if (isValid(boardRef.current, moved)) { pieceRef.current = moved; setPiece({ ...moved }) }
 }, [])

 const drop = useCallback(() => {
   const p = pieceRef.current
   if (!p || phaseRef.current !== 'playing') return
   let dropped = { ...p }
   while (isValid(boardRef.current, { ...dropped, y: dropped.y + 1 })) dropped.y++
   pieceRef.current = dropped
   setPiece({ ...dropped })
   tick()
 }, [tick])

 const rotatePiece = useCallback(() => {
   const p = pieceRef.current
   if (!p || phaseRef.current !== 'playing') return
   const rotated = { ...p, shape: rotate(p.shape) }
   if (isValid(boardRef.current, rotated)) { pieceRef.current = rotated; setPiece({ ...rotated }) }
 }, [])

 useEffect(() => {
   const onKey = (e: KeyboardEvent) => {
     if (phaseRef.current !== 'playing') return
     if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1) }
     if (e.key === 'ArrowRight') { e.preventDefault(); move(1) }
     if (e.key === 'ArrowDown') { e.preventDefault(); tick() }
     if (e.key === 'ArrowUp') { e.preventDefault(); rotatePiece() }
     if (e.key === ' ') { e.preventDefault(); drop() }
   }
   window.addEventListener('keydown', onKey)
   return () => { window.removeEventListener('keydown', onKey); clearInterval(timerRef.current) }
 }, [move, tick, rotatePiece, drop])

 const renderBoard = () => {
   const display = board.map(row => [...row])
   if (piece) {
     for (let r = 0; r < piece.shape.length; r++) {
       for (let c = 0; c < piece.shape[r].length; c++) {
         if (piece.shape[r][c]) {
           const br = piece.y + r
           const bc = piece.x + c
           if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS) display[br][bc] = piece.color
         }
       }
     }
   }
   return display
 }

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen icon="tetris.png" title="Tetris" subtitle="Stack the blocks. Clear the lines." worldRecord={worldRecord} myBest={myBest !== null ? myBest.toLocaleString() : null} top5={top5} onPlay={startGame} />
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={score.toLocaleString()}
     resultColor={score >= 5000 ? '#00C853' : score >= 1000 ? GOLD : '#D32F2F'}
     background={score >= 5000 ? '#0D3320' : score >= 1000 ? '#2D1A00' : '#1A0000'}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   >
     <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Level {level} · {lines} lines</div>
   </GameResultScreen>
 )

 const display = renderBoard()

 return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden', position:'fixed', width:'100%', maxWidth:430 }}>
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 20px', flexShrink:0 }}>
       <div style={{ fontSize:18, fontWeight:900, color:GOLD }}>{score.toLocaleString()}</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>TETRIS</div>
       <div style={{ fontSize:14, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>Lv {level}</div>
     </div>

     <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'4px 16px', overflow:'hidden' }}
       onTouchStart={e => setTouchX(e.touches[0].clientX)}
       onTouchEnd={e => {
         if (touchX === null) return
         const dx = e.changedTouches[0].clientX - touchX
         if (Math.abs(dx) > 30) move(dx > 0 ? 1 : -1)
         else rotatePiece()
         setTouchX(null)
       }}>
       <div style={{ display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gap:1, background:'#111', padding:3, borderRadius:8, width:'min(220px, 45vw)', aspectRatio:'1/2' }}>
         {display.map((row, r) => row.map((cell, c) => (
           <div key={r+'-'+c} style={{ borderRadius:1, background: cell || '#1a1a1a', border: cell ? 'none' : '1px solid #1f1f1f', aspectRatio:'1' }} />
         )))}
       </div>
     </div>

     <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, padding:'8px 16px 80px', flexShrink:0 }}>
       <button onPointerDown={() => move(-1)} style={{ padding:'14px', borderRadius:12, border:'none', background:'#252525', color:'#fff', fontSize:22, fontWeight:900, cursor:'pointer', fontFamily:'inherit' }}>←</button>
       <button onPointerDown={drop} style={{ padding:'14px', borderRadius:12, border:'none', background:GREEN, color:'#fff', fontSize:18, fontWeight:900, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 0 #1B5E20' }}>DROP</button>
       <button onPointerDown={() => move(1)} style={{ padding:'14px', borderRadius:12, border:'none', background:'#252525', color:'#fff', fontSize:22, fontWeight:900, cursor:'pointer', fontFamily:'inherit' }}>→</button>
       <button onPointerDown={rotatePiece} style={{ padding:'12px', borderRadius:12, border:'none', background:'#252525', color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'inherit', gridColumn:'1/-1' }}>↻ Rotate</button>
     </div>
   </main>
 )
}
