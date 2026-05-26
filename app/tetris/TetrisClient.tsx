'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import AuthModal from '@/components/AuthModal'

const COLS = 10
const ROWS = 18
const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const PIECES = {
  I: { shape: [[1,1,1,1]], color: '#00BCD4' },
  O: { shape: [[1,1],[1,1]], color: '#FFEB3B' },
  T: { shape: [[0,1,0],[1,1,1]], color: '#9C27B0' },
  S: { shape: [[0,1,1],[1,1,0]], color: '#4CAF50' },
  Z: { shape: [[1,1,0],[0,1,1]], color: '#F44336' },
  J: { shape: [[1,0,0],[1,1,1]], color: '#2196F3' },
  L: { shape: [[0,0,1],[1,1,1]], color: '#FF9800' },
}

type Board = (string | null)[][]
type Piece = { shape: number[][], color: string, x: number, y: number }

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function randomPiece(): Piece {
  const keys = Object.keys(PIECES) as (keyof typeof PIECES)[]
  const key = keys[Math.floor(Math.random() * keys.length)]
  const p = PIECES[key]
  return { shape: p.shape, color: p.color, x: Math.floor(COLS / 2) - Math.floor(p.shape[0].length / 2), y: 0 }
}

function isValid(board: Board, piece: Piece, dx = 0, dy = 0, shape = piece.shape) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue
      const nx = piece.x + c + dx
      const ny = piece.y + r + dy
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false
      if (ny >= 0 && board[ny][nx]) return false
    }
  }
  return true
}

function rotate(shape: number[][]) {
  const rows = shape.length
  const cols = shape[0].length
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c]
    }
  }
  return rotated
}

function placePiece(board: Board, piece: Piece): Board {
  const b = board.map(r => [...r])
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c] && piece.y + r >= 0) {
        b[piece.y + r][piece.x + c] = piece.color
      }
    }
  }
  return b
}

function clearLines(board: Board): { board: Board, lines: number } {
  const filtered = board.filter(row => row.some(cell => !cell))
  const lines = ROWS - filtered.length
  const newRows = Array.from({ length: lines }, () => Array(COLS).fill(null))
  return { board: [...newRows, ...filtered], lines }
}

export default function TetrisClient() {
  const { profile } = usePlayer()
  const [board, setBoard] = useState<Board>(emptyBoard())
  const [piece, setPiece] = useState<Piece | null>(null)
  const [next, setNext] = useState<Piece>(randomPiece())
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [saved, setSaved] = useState(false)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const boardRef = useRef(board)
  const pieceRef = useRef(piece)
  const scoreRef = useRef(score)
  const linesRef = useRef(lines)
  const levelRef = useRef(level)
  boardRef.current = board
  pieceRef.current = piece
  scoreRef.current = score
  linesRef.current = lines
  levelRef.current = level

  const speed = useCallback(() => Math.max(100, 800 - (level - 1) * 70), [level])

  const drop = useCallback(() => {
    const p = pieceRef.current
    const b = boardRef.current
    if (!p) return
    if (isValid(b, p, 0, 1)) {
      setPiece({ ...p, y: p.y + 1 })
    } else {
      const newBoard = placePiece(b, p)
      const { board: cleared, lines: clearedLines } = clearLines(newBoard)
      const points = [0, 100, 300, 500, 800][Math.min(clearedLines, 4)] * levelRef.current
      const newScore = scoreRef.current + points
      const newLines = linesRef.current + clearedLines
      const newLevel = Math.floor(newLines / 10) + 1
      setBoard(cleared)
      setScore(newScore)
      setLines(newLines)
      setLevel(newLevel)
      const np = next
      const nn = randomPiece()
      setNext(nn)
      if (!isValid(cleared, np)) {
        setPhase('over')
        setPiece(null)
        // Get rank
        supabase.from('tetris_scores').select('*', { count: 'exact', head: true }).gt('score', newScore)
          .then(({ count }) => setWorldRank((count || 0) + 1))
      } else {
        setPiece(np)
      }
    }
  }, [next, level])

  useEffect(() => {
    if (phase !== 'playing') return
    const t = setInterval(drop, speed())
    return () => clearInterval(t)
  }, [phase, drop, speed])

  const start = () => {
    setBoard(emptyBoard())
    setScore(0)
    setLines(0)
    setLevel(1)
    setSaved(false)
    setWorldRank(null)
    const p = randomPiece()
    setPiece(p)
    setNext(randomPiece())
    setPhase('playing')
  }

  const moveLeft = () => { if (piece && isValid(board, piece, -1, 0)) setPiece({ ...piece, x: piece.x - 1 }) }
  const moveRight = () => { if (piece && isValid(board, piece, 1, 0)) setPiece({ ...piece, x: piece.x + 1 }) }
  const moveDown = () => { if (piece && isValid(board, piece, 0, 1)) setPiece({ ...piece, y: piece.y + 1 }) }
  const rotatePiece = () => {
    if (!piece) return
    const rotated = rotate(piece.shape)
    if (isValid(board, { ...piece, shape: rotated })) setPiece({ ...piece, shape: rotated })
  }
  const hardDrop = () => {
    if (!piece) return
    let p = { ...piece }
    while (isValid(board, p, 0, 1)) p = { ...p, y: p.y + 1 }
    setPiece(p)
    setTimeout(drop, 0)
  }

  // Render board with current piece
  const displayBoard = board.map(r => [...r])
  if (piece) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] && piece.y + r >= 0 && piece.y + r < ROWS) {
          displayBoard[piece.y + r][piece.x + c] = piece.color
        }
      }
    }
  }

  // Ghost piece
  if (piece) {
    let ghost = { ...piece }
    while (isValid(board, ghost, 0, 1)) ghost = { ...ghost, y: ghost.y + 1 }
    for (let r = 0; r < ghost.shape.length; r++) {
      for (let c = 0; c < ghost.shape[r].length; c++) {
        if (ghost.shape[r][c] && ghost.y + r >= 0 && ghost.y + r < ROWS && !displayBoard[ghost.y + r][ghost.x + c]) {
          displayBoard[ghost.y + r][ghost.x + c] = 'ghost'
        }
      }
    }
  }

  const CELL = 26

  return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', display:'flex', flexDirection:'column', alignItems:'center', padding:'16px 0 100px' }}>

      {/* Header */}
      <div style={{ width:'100%', maxWidth:380, display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, padding:'0 16px' }}>
        <div>
          <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>SCORE</div>
          <div style={{ fontSize:24, fontWeight:900, color:'#fff' }}>{score}</div>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>LEVEL</div>
          <div style={{ fontSize:24, fontWeight:900, color:GOLD }}>{level}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>LINES</div>
          <div style={{ fontSize:24, fontWeight:900, color:'#fff' }}>{lines}</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
        {/* Board */}
        <div style={{ border:'2px solid rgba(255,255,255,0.1)', borderRadius:8, overflow:'hidden', background:'rgba(0,0,0,0.5)' }}>
          {displayBoard.map((row, r) => (
            <div key={r} style={{ display:'flex' }}>
              {row.map((cell, c) => (
                <div key={c} style={{
                  width: CELL, height: CELL,
                  background: cell === 'ghost' ? 'rgba(255,255,255,0.1)' : cell || 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxSizing:'border-box',
                  borderRadius: cell && cell !== 'ghost' ? 3 : 0,
                }} />
              ))}
            </div>
          ))}
        </div>

        {/* Right panel: next + controls */}
       <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:12, padding:'10px', border:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, marginBottom:8 }}>NEXT</div>
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              {next.shape.map((row, r) => (
                <div key={r} style={{ display:'flex', gap:2 }}>
                  {row.map((cell, c) => (
                    <div key={c} style={{ width:16, height:16, background: cell ? next.color : 'transparent', borderRadius:2 }} />
                  ))}
                </div>
              ))}
            </div>
          </div>

         {/* Controls */}
         {phase === 'playing' && (
           <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
             <button onTouchStart={(e)=>{e.preventDefault();rotatePiece()}} onMouseDown={rotatePiece} style={{ width:'100%', height:52, borderRadius:14, border:'none', background:'rgba(255,255,255,0.12)', color:'#fff', fontSize:16, fontWeight:900, cursor:'pointer', fontFamily:'inherit' }}>↻ Rotate</button>
             <div style={{ display:'flex', gap:8 }}>
               <button onTouchStart={(e)=>{e.preventDefault();moveLeft()}} onMouseDown={moveLeft} style={{ flex:1, height:52, borderRadius:14, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:22, cursor:'pointer', fontFamily:'inherit' }}>←</button>
               <button onTouchStart={(e)=>{e.preventDefault();moveRight()}} onMouseDown={moveRight} style={{ flex:1, height:52, borderRadius:14, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:22, cursor:'pointer', fontFamily:'inherit' }}>→</button>
             </div>
             <button onTouchStart={(e)=>{e.preventDefault();hardDrop()}} onMouseDown={hardDrop} style={{ width:'100%', height:52, borderRadius:14, border:'none', background:GOLD, color:'#000', fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'inherit' }}>⬇ Drop</button>
           </div>
         )}
       </div>
     </div>

      {/* Game Over */}
      {phase === 'over' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, zIndex:100 }}>
          <div style={{ background:'#1C1C1E', borderRadius:24, padding:'28px 24px', width:'100%', maxWidth:340, border:'1px solid rgba(255,255,255,0.08)', textAlign:'center' }}>
            <div style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:4 }}>Game Over</div>
            <div style={{ fontSize:40, fontWeight:900, color:GOLD, marginBottom:4 }}>{score}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Level {level} · {lines} lines</div>
            {worldRank && <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:16 }}>#{worldRank} in the world</div>}
            {!profile?.name && !saved && (
              <div style={{ marginBottom:16 }}>
                <AuthModal onSuccess={async (playerName) => {
                  await supabase.from('tetris_scores').insert({ player_name: playerName, score, lines, level })
                  setSaved(true)
                }} title="Save your result" subtitle="Free · No email needed" />
              </div>
            )}
            {profile?.name && !saved && (
              <button onClick={async () => {
                await supabase.from('tetris_scores').insert({ player_name: profile.name, score, lines, level })
                setSaved(true)
              }} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:12 }}>
                Save Score
              </button>
            )}
            {saved && <div style={{ fontSize:13, color:'#69F0AE', fontWeight:800, marginBottom:12 }}>✓ Saved!</div>}
            <button onClick={start} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
              Play Again →
            </button>
          </div>
        </div>
      )}

      {/* Start screen */}
      {phase === 'idle' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, zIndex:100 }}>
          <div style={{ background:'#1C1C1E', borderRadius:24, padding:'32px 24px', width:'100%', maxWidth:340, border:'1px solid rgba(255,255,255,0.08)', textAlign:'center' }}>
            <div style={{ fontSize:36, fontWeight:900, color:'#fff', marginBottom:8 }}>Tetris</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:24 }}>Classic block stacking game</div>
            <button onClick={start} style={{ width:'100%', padding:'18px', borderRadius:16, border:'none', background:GREEN, color:'#fff', fontSize:18, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080' }}>
              Play →
            </button>
          </div>
        </div>
      )}



    </main>
  )
}
