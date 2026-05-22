'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const ORANGE = '#E65100'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const TILE_COLORS: Record<number, { bg: string, color: string }> = {
  0:    { bg: 'rgba(255,255,255,0.05)', color: 'transparent' },
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
type Phase = 'rules' | 'playing' | 'gameover'

const emptyBoard = (): Board => Array(4).fill(null).map(() => Array(4).fill(0))

const addRandom = (board: Board): Board => {
  const empty: [number,number][] = []
  board.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]) }))
  if (!empty.length) return board
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  const next = board.map(row => [...row])
  next[r][c] = Math.random() < 0.9 ? 2 : 4
  return next
}

const initBoard = (): Board => addRandom(addRandom(emptyBoard()))

function slideRow(row: number[]): { row: number[], score: number } {
  const filtered = row.filter(v => v)
  let score = 0
  const merged: number[] = []
  let i = 0
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i+1]) {
      merged.push(filtered[i] * 2)
      score += filtered[i] * 2
      i += 2
    } else {
      merged.push(filtered[i])
      i++
    }
  }
  while (merged.length < 4) merged.push(0)
  return { row: merged, score }
}

function move(board: Board, dir: 'left'|'right'|'up'|'down'): { board: Board, score: number, moved: boolean } {
  let totalScore = 0
  let moved = false
  let b = board.map(r => [...r])

  const transpose = (m: Board) => m[0].map((_, i) => m.map(r => r[i]))
  const reverseRows = (m: Board) => m.map(r => [...r].reverse())

  if (dir === 'right') b = reverseRows(b)
  if (dir === 'up') b = transpose(b)
  if (dir === 'down') b = transpose(reverseRows(b))

  b = b.map(row => {
    const { row: newRow, score } = slideRow(row)
    if (newRow.join() !== row.join()) moved = true
    totalScore += score
    return newRow
  })

  if (dir === 'right') b = reverseRows(b)
  if (dir === 'up') b = transpose(b)
  if (dir === 'down') b = reverseRows(transpose(b))

  return { board: b, score: totalScore, moved }
}

function hasMovesLeft(board: Board): boolean {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (!board[r][c]) return true
    if (c < 3 && board[r][c] === board[r][c+1]) return true
    if (r < 3 && board[r][c] === board[r+1][c]) return true
  }
  return false
}

export default function Game2048Client() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [board, setBoard] = useState<Board>(emptyBoard())
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [worldRecord, setWorldRecord] = useState<{score:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,score:number}[]>([])
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [touchStart, setTouchStart] = useState<{x:number,y:number}|null>(null)

  useEffect(() => {
    if (phase === 'playing') {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [phase])

  useEffect(() => {
    if (profile?.name) setName(profile.name)
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('game2048_scores').select('player_name,score').order('score', { ascending: false }).limit(500)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.score > best[s.player_name]) best[s.player_name] = s.score })
    const sorted = Object.entries(best).map(([n,s]) => ({name:n, score:s as number})).sort((a,b) => b.score-a.score)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({score:sorted[0].score, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
  }

  const startGame = () => {
    setBoard(initBoard())
    setScore(0)
    setPhase('playing')
  }

  const handleMove = useCallback(async (dir: 'left'|'right'|'up'|'down') => {
    if (phase !== 'playing') return
    setBoard(prev => {
      const { board: newBoard, score: addScore, moved } = move(prev, dir)
      if (!moved) return prev
      const withRandom = addRandom(newBoard)
      setScore(s => {
        const next = s + addScore
        setBest(b => Math.max(b, next))
        return next
      })
      if (!hasMovesLeft(withRandom)) {
        setPhase('gameover')
        setScore(s => {
          if (profile?.name) {
            supabase.from('game2048_scores').insert({player_name:profile.name, score:s}).then(() => {
              supabase.from('game2048_scores').select('*',{count:'exact',head:true}).gt('score',s).then(({count}) => setWorldRank((count??0)+1))
            })
          }
          return s
        })
      }
      return withRandom
    })
  }, [phase, profile?.name])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string,'left'|'right'|'up'|'down'> = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' }
      if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleMove])

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
    await supabase.from('game2048_scores').insert({player_name:name.trim(), score})
    const {count} = await supabase.from('game2048_scores').select('*',{count:'exact',head:true}).gt('score',score)
    setWorldRank((count??0)+1)
    setSaving(false)
    setSaved(true)
    localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
    setTimeout(() => window.location.reload(), 1500)
  }

  const reset = () => { setPhase('rules'); setSaved(false); loadData() }

  const tileSize = 'calc((min(100vw, 430px) - 40px - 12px) / 4)'

  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <img src={`${BASE}/2048.png`} style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>2048</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Merge tiles to reach 2048</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? worldRecord.score.toLocaleString() : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest ? myBest.toLocaleString() : '—'}</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.score.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:ORANGE, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${ORANGE}80`, marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  return (
    <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'12px 20px', overflow:'hidden' }}
      onTouchStart={e => { e.preventDefault(); setTouchStart({x:e.touches[0].clientX, y:e.touches[0].clientY}) }}
      onTouchEnd={e => { e.preventDefault();
        if (!touchStart) return
        const dx = e.changedTouches[0].clientX - touchStart.x
        const dy = e.changedTouches[0].clientY - touchStart.y
        if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? 'right' : 'left')
        else handleMove(dy > 0 ? 'down' : 'up')
        setTouchStart(null)
      }}
    >
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <button onClick={reset} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:12, padding:'8px 14px', textAlign:'center' }}>
            <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase' }}>Score</div>
            <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>{score.toLocaleString()}</div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:12, padding:'8px 14px', textAlign:'center' }}>
            <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase' }}>Best</div>
            <div style={{ fontSize:20, fontWeight:900, color:GOLD }}>{best.toLocaleString()}</div>
          </div>
        </div>
        <button onClick={startGame} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'#fff', fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'inherit', padding:'8px 12px', borderRadius:10 }}>New</button>
      </div>

      {/* Board */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, background:'rgba(255,255,255,0.06)', padding:8, borderRadius:16 }}>
        {board.map((row, r) => row.map((val, c) => {
          const tile = TILE_COLORS[val] || { bg:'#6A1B9A', color:'#fff' }
          return (
            <div key={`${r}-${c}`} style={{
              aspectRatio:'1', borderRadius:10, background:tile.bg,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: val >= 1024 ? 18 : val >= 128 ? 22 : 26,
              fontWeight:900, color:tile.color, transition:'all 0.1s',
            }}>
              {val || ''}
            </div>
          )
        }))}
      </div>

      {/* Arrow buttons for mobile */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:16, maxWidth:200, margin:'16px auto 0' }}>
        <div />
        <button onClick={() => handleMove('up')} style={{ aspectRatio:'1', borderRadius:12, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:22, cursor:'pointer' }}>↑</button>
        <div />
        <button onClick={() => handleMove('left')} style={{ aspectRatio:'1', borderRadius:12, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:22, cursor:'pointer' }}>←</button>
        <button onClick={() => handleMove('down')} style={{ aspectRatio:'1', borderRadius:12, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:22, cursor:'pointer' }}>↓</button>
        <button onClick={() => handleMove('right')} style={{ aspectRatio:'1', borderRadius:12, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:22, cursor:'pointer' }}>→</button>
      </div>

      {/* Game over overlay */}
      {phase === 'gameover' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, zIndex:100 }}>
          <div style={{ background:'#1a1a1a', borderRadius:24, padding:28, width:'100%', maxWidth:380, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:4 }}>Game Over</div>
              <div style={{ fontSize:42, fontWeight:900, color:GOLD }}>{score.toLocaleString()}</div>
              {worldRank && <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>#{worldRank} in the world</div>}
            </div>
            {!profile?.name && !saved && (
              <div>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{ width:'100%', padding:'10px', borderRadius:10, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:800, fontFamily:'inherit', outline:'none', marginBottom:10, boxSizing:'border-box' }} />
                <div style={{ display:'flex', gap:6, justifyContent:'center', marginBottom:10 }}>
                  {pin.map((d,i) => (
                    <input key={i} id={`pin2048-${i}`} type="tel" maxLength={1} value={d}
                      onChange={e=>{const v=e.target.value.replace(/\D/,'');const p=[...pin];p[i]=v;setPin(p);if(v&&i<3)(document.getElementById(`pin2048-${i+1}`) as HTMLInputElement)?.focus()}}
                      style={{ width:44, height:52, textAlign:'center', fontSize:22, fontWeight:900, borderRadius:10, border:'2px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontFamily:'inherit', outline:'none' }} />
                  ))}
                </div>
                {saveError && <div style={{ fontSize:12, color:'#FF5252', fontWeight:800, textAlign:'center', marginBottom:8 }}>{saveError}</div>}
                <button onClick={saveScore} disabled={!name.trim()||pin.join('').length!==4||saving} style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', background:name.trim()&&pin.join('').length===4?GREEN:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:8 }}>
                  {saving?'Saving...':'Save →'}
                </button>
              </div>
            )}
            {saved && <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:12, padding:'12px', textAlign:'center' }}><div style={{ fontSize:15, fontWeight:900, color:'#69F0AE' }}>✓ Saved! #{worldRank}</div></div>}
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={reset} style={{ flex:1, padding:'14px', borderRadius:14, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
              <button onClick={startGame} style={{ flex:2, padding:'14px', borderRadius:14, border:'none', background:ORANGE, color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${ORANGE}80` }}>Play again →</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
