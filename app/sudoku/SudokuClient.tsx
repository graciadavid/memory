'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const PURPLE = '#4A148C'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

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
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

type Phase = 'rules' | 'playing' | 'result'
type Difficulty = 'easy' | 'medium' | 'hard'

export default function SudokuClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [board, setBoard] = useState<number[][]>([])
  const [solution, setSolution] = useState<number[][]>([])
  const [fixed, setFixed] = useState<boolean[][]>([])
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<[number,number]|null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [bestScore, setBestScore] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,time_ms:number}[]>([])
  const [worldRecord, setWorldRecord] = useState<{time_ms:number,name:string}|null>(null)
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const timerRef = useRef<NodeJS.Timeout|null>(null)

  useEffect(() => {
    if (profile?.name) setName(profile.name)
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('sudoku_scores').select('player_name,time_ms').order('time_ms', { ascending: true }).limit(500)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
    const sorted = Object.entries(best).map(([n,t]) => ({name:n, time_ms:t as number})).sort((a,b) => a.time_ms-b.time_ms)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({time_ms:sorted[0].time_ms, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setBestScore(best[profile.name])
  }

  const startGame = (diff: Difficulty) => {
    const { puzzle, solution } = generateSudoku(diff)
    setBoard(puzzle.map(r => [...r]))
    setSolution(solution)
    setFixed(puzzle.map(r => r.map(v => v !== 0)))
    setErrors(new Set())
    setSelected(null)
    setElapsed(0)
    setDifficulty(diff)
    const now = Date.now()
    setStartTime(now)
    setPhase('playing')
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setElapsed(Date.now() - now), 1000)
  }

  const handleCell = (r: number, c: number) => {
    if (fixed[r]?.[c]) return
    setSelected([r, c])
  }

  const handleNumber = useCallback((n: number) => {
    if (!selected) return
    const [r, c] = selected
    if (fixed[r]?.[c]) return
    const newBoard = board.map(row => [...row])
    newBoard[r][c] = n
    setBoard(newBoard)
    const newErrors = new Set(errors)
    if (n !== 0 && n !== solution[r][c]) newErrors.add(`${r}-${c}`)
    else newErrors.delete(`${r}-${c}`)
    setErrors(newErrors)
    // Check win
    const complete = newBoard.every((row, ri) => row.every((val, ci) => val === solution[ri][ci]))
    if (complete) {
      if (timerRef.current) clearInterval(timerRef.current)
      const finalMs = Date.now() - startTime
      setElapsed(finalMs)
      setPhase('result')
      if (profile?.name) {
        supabase.from('sudoku_scores').insert({player_name:profile.name, time_ms:finalMs}).then(() => {
          supabase.from('sudoku_scores').select('*',{count:'exact',head:true}).lt('time_ms',finalMs).then(({count}) => setWorldRank((count??0)+1))
        })
      }
    }
  }, [selected, fixed, board, solution, errors, startTime, profile?.name])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') handleNumber(parseInt(e.key))
      if (e.key === 'Backspace' || e.key === 'Delete') handleNumber(0)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleNumber])

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const saveScore = async () => {
    if (!name.trim() || pin.join('').length!==4) return
    setSaving(true)
    setSaveError('')
    const pinHash = btoa(pin.join(''))
    const {data:existing} = await supabase.from('profiles').select('password_hash').eq('player_name',name.trim()).maybeSingle()
    if (existing) {
      if (existing.password_hash !== pinHash) { setSaveError('Wrong PIN'); setSaving(false); return }
    } else {
      await supabase.from('profiles').insert({player_name:name.trim(), password_hash:pinHash})
    }
    await supabase.from('sudoku_scores').insert({player_name:name.trim(), time_ms:elapsed})
    const {count} = await supabase.from('sudoku_scores').select('*',{count:'exact',head:true}).lt('time_ms',elapsed)
    setWorldRank((count??0)+1)
    setSaving(false)
    setSaved(true)
    localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
    setTimeout(() => window.location.reload(), 1500)
  }

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('rules')
    setSaved(false)
    loadData()
  }

  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <img src={`${BASE}/sudoku.png`} style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Sudoku</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Fill the grid as fast as you can</div>
        </div>
      </div>

      {/* Difficulty selector */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Choose difficulty</div>
        <div style={{ display:'flex', gap:10 }}>
          {(['easy','medium','hard'] as Difficulty[]).map(d => (
            <button key={d} onClick={() => setDifficulty(d)} style={{ flex:1, padding:'14px', borderRadius:16, border:`2px solid ${difficulty===d ? GOLD : 'rgba(255,255,255,0.1)'}`, background: difficulty===d ? 'rgba(200,150,12,0.15)' : 'rgba(255,255,255,0.04)', color: difficulty===d ? GOLD : 'rgba(255,255,255,0.5)', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', textTransform:'capitalize' }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? fmt(worldRecord.time_ms) : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{bestScore ? fmt(bestScore) : '—'}</div>
        </div>
      </div>

      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{fmt(p.time_ms)}</div>
          </div>
        ))}
      </div>

      <button onClick={() => startGame(difficulty)} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:PURPLE, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${PURPLE}80`, marginTop:'auto' }}>
        Play {difficulty} →
      </button>
    </main>
  )

  if (phase === 'playing' || phase === 'result') return (
    <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'12px 12px 0', overflow:'hidden' }}>

      {/* Timer */}
      <div style={{ textAlign:'center', marginBottom:8 }}>
        <div style={{ fontSize:36, fontWeight:900, color: phase==='result'?GOLD:'#fff', fontVariantNumeric:'tabular-nums' }}>{fmt(elapsed)}</div>
        {bestScore && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>Best: {fmt(bestScore)}</div>}
      </div>

      {/* Board */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(9, 1fr)', gap:2, background:'rgba(255,255,255,0.1)', padding:2, borderRadius:12, marginBottom:10 }}>
        {board.map((row, r) => row.map((val, c) => {
          const isSelected = selected?.[0] === r && selected?.[1] === c
          const isFixed = fixed[r]?.[c]
          const isError = errors.has(`${r}-${c}`)
          const isHighlight = selected && (selected[0] === r || selected[1] === c || (Math.floor(selected[0]/3) === Math.floor(r/3) && Math.floor(selected[1]/3) === Math.floor(c/3)))
          const borderR = (c + 1) % 3 === 0 && c !== 8
          const borderB = (r + 1) % 3 === 0 && r !== 8
          return (
            <div key={`${r}-${c}`} onClick={() => handleCell(r, c)} style={{
              aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center',
              background: isSelected ? 'rgba(74,20,140,0.6)' : isError ? 'rgba(211,47,47,0.3)' : isHighlight ? 'rgba(255,255,255,0.06)' : '#111',
              fontSize:16, fontWeight: isFixed ? 900 : 700,
              color: isError ? '#FF5252' : isFixed ? '#fff' : GOLD,
              cursor: isFixed ? 'default' : 'pointer',
              borderRight: borderR ? '2px solid rgba(255,255,255,0.2)' : undefined,
              borderBottom: borderB ? '2px solid rgba(255,255,255,0.2)' : undefined,
              borderRadius:3, transition:'background 0.1s',
            }}>
              {val !== 0 ? val : ''}
            </div>
          )
        }))}
      </div>

      {/* Number pad */}
      {phase === 'playing' && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(9, 1fr)', gap:4, marginBottom:8 }}>
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <button key={n} onClick={() => handleNumber(n)} style={{ aspectRatio:'1', borderRadius:10, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:18, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>{n}</button>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:8 }}>
            <button onClick={() => handleNumber(0)} style={{ flex:1, padding:'10px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)', fontSize:14, fontWeight:800, fontFamily:'inherit', cursor:'pointer' }}>Erase</button>
            <button onClick={reset} style={{ flex:1, padding:'10px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)', fontSize:14, fontWeight:800, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
          </div>
        </>
      )}

      {/* Result */}
      {phase === 'result' && (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:'16px', paddingBottom:100 }}>
          <div style={{ fontSize:48, fontWeight:900, color:GOLD }}>{fmt(elapsed)}</div>
          {worldRank && <div style={{ fontSize:18, fontWeight:900, color:'rgba(255,255,255,0.5)' }}>#{worldRank} in the world</div>}

          {!profile?.name && !saved && (
            <div style={{ width:'100%', background:'rgba(0,0,0,0.3)', borderRadius:24, padding:'20px' }}>
              <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:12 }}>Save your score</div>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{ width:'100%', padding:'10px', borderRadius:10, border:'none', background:'rgba(255,255,255,0.12)', color:'#fff', fontSize:14, fontWeight:800, fontFamily:'inherit', outline:'none', marginBottom:10, boxSizing:'border-box' }} />
              <div style={{ display:'flex', gap:6, justifyContent:'center', marginBottom:12 }}>
                {pin.map((d,i) => (
                  <input key={i} id={`pin-${i}`} type="tel" maxLength={1} value={d}
                    onChange={e=>{const v=e.target.value.replace(/\D/,'');const p=[...pin];p[i]=v;setPin(p);if(v&&i<3)(document.getElementById(`pin-${i+1}`) as HTMLInputElement)?.focus()}}
                    style={{ width:44, height:52, textAlign:'center', fontSize:22, fontWeight:900, borderRadius:10, border:'2px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontFamily:'inherit', outline:'none' }} />
                ))}
              </div>
              {saveError && <div style={{ fontSize:12, color:'#FF5252', fontWeight:800, textAlign:'center', marginBottom:8 }}>{saveError}</div>}
              <button onClick={saveScore} disabled={!name.trim()||pin.join('').length!==4||saving} style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', background:name.trim()&&pin.join('').length===4?GREEN:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
                {saving?'Saving...':'Save →'}
              </button>
            </div>
          )}
          {saved && <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:16, padding:'14px 20px', textAlign:'center' }}><div style={{ fontSize:16, fontWeight:900, color:'#69F0AE' }}>✓ Saved! #{worldRank}</div></div>}
          <div style={{ display:'flex', gap:10, width:'100%' }}>
            <button onClick={reset} style={{ flex:1, padding:'14px', borderRadius:14, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
            <button onClick={() => startGame(difficulty)} style={{ flex:2, padding:'14px', borderRadius:14, border:'none', background:PURPLE, color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${PURPLE}80` }}>Play again →</button>
          </div>
        </div>
      )}
    </main>
  )

  return null
}
