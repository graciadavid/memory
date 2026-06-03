'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

type Difficulty = 'easy' | 'medium' | 'hard'
type Phase = 'rules' | 'playing' | 'result'

// [puzzle, solution] - 0 means empty cell
const PUZZLES: Record<Difficulty, [number[], number[]][]> = {
 easy: [
   [
     [5,3,0,0,7,0,0,0,0, 6,0,0,1,9,5,0,0,0, 0,9,8,0,0,0,0,6,0,
      8,0,0,0,6,0,0,0,3, 4,0,0,8,0,3,0,0,1, 7,0,0,0,2,0,0,0,6,
      0,6,0,0,0,0,2,8,0, 0,0,0,4,1,9,0,0,5, 0,0,0,0,8,0,0,7,9],
     [5,3,4,6,7,8,9,1,2, 6,7,2,1,9,5,3,4,8, 1,9,8,3,4,2,5,6,7,
      8,5,9,7,6,1,4,2,3, 4,2,6,8,5,3,7,9,1, 7,1,3,9,2,4,8,5,6,
      9,6,1,5,3,7,2,8,4, 2,8,7,4,1,9,6,3,5, 3,4,5,2,8,6,1,7,9]
   ],
   [
     [0,0,3,0,2,0,6,0,0, 9,0,0,3,0,5,0,0,1, 0,0,1,8,0,6,4,0,0,
      0,0,8,1,0,2,9,0,0, 7,0,0,0,0,0,0,0,8, 0,0,6,7,0,8,2,0,0,
      0,0,2,6,0,9,5,0,0, 8,0,0,2,0,3,0,0,9, 0,0,5,0,1,0,3,0,0],
     [4,8,3,9,2,1,6,5,7, 9,6,7,3,4,5,8,2,1, 2,5,1,8,7,6,4,9,3,
      5,4,8,1,3,2,9,7,6, 7,2,9,5,6,4,1,3,8, 1,3,6,7,9,8,2,4,5,
      3,7,2,6,8,9,5,1,4, 8,1,4,2,5,3,7,6,9, 6,9,5,4,1,7,3,8,2]
   ],
 ],
 medium: [
   [
     [0,0,0,2,6,0,7,0,1, 6,8,0,0,7,0,0,9,0, 1,9,0,0,0,4,5,0,0,
      8,2,0,1,0,0,0,4,0, 0,0,4,6,0,2,9,0,0, 0,5,0,0,0,3,0,2,8,
      0,0,9,3,0,0,0,7,4, 0,4,0,0,5,0,0,3,6, 7,0,3,0,1,8,0,0,0],
     [4,3,5,2,6,9,7,8,1, 6,8,2,5,7,1,4,9,3, 1,9,7,8,3,4,5,6,2,
      8,2,6,1,9,5,3,4,7, 3,7,4,6,8,2,9,1,5, 9,5,1,7,4,3,6,2,8,
      5,1,9,3,2,6,8,7,4, 2,4,8,9,5,7,1,3,6, 7,6,3,4,1,8,2,5,9]
   ],
   [
     [0,0,0,6,0,0,4,0,0, 7,0,0,0,0,3,6,0,0, 0,0,0,0,9,1,0,8,0,
      0,0,0,0,0,0,0,0,0, 0,5,0,1,8,0,0,0,3, 0,0,0,3,0,6,0,4,5,
      0,4,0,2,0,0,0,6,0, 9,0,3,0,0,0,0,0,0, 0,2,0,0,0,0,1,0,0],
     [5,8,1,6,7,2,4,3,9, 7,9,2,8,4,3,6,5,1, 3,6,4,5,9,1,7,8,2,
      4,3,8,9,5,7,2,1,6, 2,5,6,1,8,4,9,7,3, 1,7,9,3,2,6,8,4,5,
      8,4,5,2,1,9,3,6,7, 9,1,3,7,6,8,5,2,4, 6,2,7,4,3,5,1,9,8]
   ],
 ],
 hard: [
   [
     [8,0,0,0,0,0,0,0,0, 0,0,3,6,0,0,0,0,0, 0,7,0,0,9,0,2,0,0,
      0,5,0,0,0,7,0,0,0, 0,0,0,0,4,5,7,0,0, 0,0,0,1,0,0,0,3,0,
      0,0,1,0,0,0,0,6,8, 0,0,8,5,0,0,0,1,0, 0,9,0,0,0,0,4,0,0],
     [8,1,2,7,5,3,6,4,9, 9,4,3,6,8,2,1,7,5, 6,7,5,4,9,1,2,8,3,
      1,5,4,2,3,7,8,9,6, 3,6,9,8,4,5,7,2,1, 2,8,7,1,6,9,5,3,4,
      5,2,1,9,7,4,3,6,8, 4,3,8,5,2,6,9,1,7, 7,9,6,3,1,8,4,5,2]
   ],
   [
     [0,0,0,0,0,0,0,0,0, 0,0,0,0,0,3,0,8,5, 0,0,1,0,2,0,0,0,0,
      0,0,0,5,0,7,0,0,0, 0,0,4,0,0,0,1,0,0, 0,9,0,0,0,0,0,0,0,
      5,0,0,0,0,0,0,7,3, 0,0,2,0,1,0,0,0,0, 0,0,0,0,4,0,0,0,9],
     [9,8,7,6,5,4,3,2,1, 2,4,6,1,7,3,9,8,5, 3,5,1,9,2,8,7,4,6,
      1,2,8,5,3,7,6,9,4, 6,3,4,8,9,2,1,5,7, 7,9,5,4,6,1,8,3,2,
      5,1,9,2,8,6,4,7,3, 4,7,2,3,1,9,5,6,8, 8,6,3,7,4,5,2,1,9]
   ],
 ]
}

function getPuzzle(difficulty: Difficulty): { puzzle: number[], solution: number[] } {
 const list = PUZZLES[difficulty]
 const [puzzle, solution] = list[Math.floor(Math.random() * list.length)]
 return { puzzle: [...puzzle], solution: [...solution] }
}


function isValidSudoku(grid: number[]): boolean {
  if (grid.includes(0)) return false
  for (let r = 0; r < 9; r++) {
    const row = grid.slice(r*9, r*9+9)
    if (new Set(row).size !== 9) return false
  }
  for (let col = 0; col < 9; col++) {
    const column = [0,1,2,3,4,5,6,7,8].map(r => grid[r*9+col])
    if (new Set(column).size !== 9) return false
  }
  for (let br = 0; br < 3; br++) for (let bc = 0; bc < 3; bc++) {
    const box: number[] = []
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) box.push(grid[(br*3+r)*9+(bc*3+c)])
    if (new Set(box).size !== 9) return false
  }
  return true
}

export default function SudokuClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [difficulty, setDifficulty] = useState<Difficulty>('easy')
 const [grid, setGrid] = useState<number[]>(Array(81).fill(0))
 const [solution, setSolution] = useState<number[]>(Array(81).fill(0))
 const [initial, setInitial] = useState<boolean[]>(Array(81).fill(false))
 const [selected, setSelected] = useState<number|null>(null)
 const [errors, setErrors] = useState<Set<number>>(new Set())
 const [timeMs, setTimeMs] = useState(0)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])
 const startRef = useRef(0)
 const timerRef = useRef<any>(null)

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('sudoku_scores').select('player_name, time_ms').order('time_ms', { ascending: true }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
   const sorted = Object.entries(best).sort((a,b) => (a[1] as number)-(b[1] as number))
   setTop5(sorted.slice(0,5).map(([name,t]) => ({name, score:fmt(t as number)})))
   const stored = typeof window !== 'undefined' ? localStorage.getItem('memgenius_profile') : null
    const pName = stored ? JSON.parse(stored).name : null
    if (pName && best[pName] !== undefined) setMyBest(best[pName])
 }, [profile?.name])

 useState(() => { loadData() })

 function fmt(ms: number) {
   const s = Math.floor(ms/1000)
   const m = Math.floor(s/60)
   return m > 0 ? m+'m '+(s%60)+'s' : s+'s'
 }

 useEffect(() => {
   if (phase !== 'playing') { clearInterval(timerRef.current); return }
   timerRef.current = setInterval(() => setTimeMs(Date.now() - startRef.current), 1000)
   return () => clearInterval(timerRef.current)
 }, [phase])

 const startGame = () => {
   const { puzzle, solution: sol } = getPuzzle(difficulty)
   const init = puzzle.map(v => v !== 0)
   setGrid([...puzzle])
   setSolution(sol)
   setInitial(init)
   setSelected(null)
   setErrors(new Set())
   setTimeMs(0)
   startRef.current = Date.now()
   setPhase('playing')
   window.dispatchEvent(new Event('gameStart'))
 }

 const handleCell = (idx: number) => {
   if (initial[idx]) return
   setSelected(idx)
 }

 const handleNumber = useCallback(async (num: number) => {
   if (selected === null || initial[selected]) return
   const newGrid = [...grid]
   newGrid[selected] = num
   setGrid(newGrid)
   const newErrors = new Set(errors)
   if (num !== 0 && num !== solution[selected]) newErrors.add(selected)
   else newErrors.delete(selected)
   setErrors(newErrors)

   if (isValidSudoku(newGrid)) {
     clearInterval(timerRef.current)
     const elapsed = Date.now() - startRef.current
     setTimeMs(elapsed)
     setPhase('result')
     window.dispatchEvent(new Event('gameResult'))
     const { count } = await supabase.from('sudoku_scores').select('player_name', { count: 'exact', head: true }).lt('time_ms', elapsed)
     setWorldRank((count ?? 0) + 1)
     if (profile?.name) await supabase.from('sudoku_scores').insert({ player_name: profile.name, time_ms: elapsed, difficulty })
     supabase.rpc('update_streak', { p_player_name: profile.name })   }
 }, [selected, initial, grid, solution, errors, profile?.name, difficulty])

 useEffect(() => {
   const onKey = (e: KeyboardEvent) => {
     if (phase !== 'playing') return
     const n = parseInt(e.key)
     if (n >= 1 && n <= 9) handleNumber(n)
     if (e.key === 'Backspace' || e.key === '0') handleNumber(0)
   }
   window.addEventListener('keydown', onKey)
   return () => window.removeEventListener('keydown', onKey)
 }, [handleNumber, phase])

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', padding:'16px 16px 100px' }}>
     <GameRulesScreen icon="sudoku.png" title="Sudoku" subtitle="Fill the grid. No mistakes allowed." worldRecord={worldRecord} myBest={myBest !== null ? fmt(myBest) : null} top5={top5} onPlay={startGame}>
       <div style={{ marginBottom:16 }}>
         <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Difficulty</div>
         <div style={{ display:'flex', gap:8 }}>
           {(['easy','medium','hard'] as Difficulty[]).map(d => (
             <button key={d} onClick={() => setDifficulty(d)}
               style={{ flex:1, padding:'12px', borderRadius:12, border:'none', background: difficulty === d ? GREEN : '#252525', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', textTransform:'capitalize', boxShadow: difficulty === d ? '0 4px 0 #1B5E20' : 'none' }}>
               {d}
             </button>
           ))}
         </div>
       </div>
     </GameRulesScreen>
   </main>
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={fmt(timeMs)}
     resultColor={timeMs < 120000 ? '#00C853' : timeMs < 300000 ? GOLD : '#D32F2F'}
     background={timeMs < 120000 ? '#0D3320' : timeMs < 300000 ? '#2D1A00' : '#1A0000'}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   >
     <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'capitalize' }}>{difficulty}</div>
   </GameResultScreen>
 )

 const BOX_SIZE = Math.floor((Math.min(390, typeof window !== 'undefined' ? window.innerWidth : 390) - 32) / 9)

 return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 20px', flexShrink:0 }}>
       <div style={{ fontSize:18, fontWeight:900, color:GOLD }}>{fmt(timeMs)}</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase' }}>{difficulty}</div>
        <div style={{ width:40 }} />
     </div>

     {/* Grid */}
     <div style={{ display:'flex', justifyContent:'center', padding:'0 16px', flexShrink:0 }}>
       <div style={{ display:'grid', gridTemplateColumns:'repeat(9,1fr)', gap:0, background:'#000', padding:2, borderRadius:4, width:'100%', maxWidth:380, boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
         {grid.map((val, idx) => {
           const row = Math.floor(idx/9)
           const col = idx%9
           const isSelected = selected === idx
           const isInit = initial[idx]

           return (
             <div key={idx} onClick={() => handleCell(idx)}
               style={{
                 aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center',
                 fontSize: BOX_SIZE > 36 ? 18 : 15, fontWeight: isInit ? 900 : 700,
                 cursor: isInit ? 'default' : 'pointer',
                background: isSelected ? '#dbeafe' : '#fff',
                color: isInit ? '#111' : '#1d4ed8',
                 borderRight: (col+1)%3===0 && col!==8 ? '2px solid #666' : '1px solid #333',
                 borderBottom: (row+1)%3===0 && row!==8 ? '2px solid #666' : '1px solid #333',
               }}>
               {val || ''}
             </div>
           )
         })}
       </div>
     </div>

     {/* Number pad */}
     <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'12px 16px 80px', gap:8 }}>
       <div style={{ display:'flex', gap:6 }}>
         {[1,2,3,4,5,6,7,8,9].map(n => (
           <button key={n} onClick={() => handleNumber(n)}
             style={{ flex:1, aspectRatio:'1', borderRadius:10, border:'none', background:'#333', color:'#fff', fontSize:18, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
             {n}
           </button>
         ))}
       </div>
       <button onClick={() => handleNumber(0)}
         style={{ width:'100%', padding:'12px', borderRadius:10, border:'none', background:'#D32F2F', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 4px 0 #B71C1C' }}>
         Erase
       </button>
     </div>
   </main>
 )
}
