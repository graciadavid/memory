'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const MAX = 10
const CODE_LEN = 4

const COLORS = [
  { id: 0, hex: '#E53935' },
  { id: 1, hex: '#1E88E5' },
  { id: 2, hex: '#43A047' },
  { id: 3, hex: '#FDD835' },
  { id: 4, hex: '#FB8C00' },
  { id: 5, hex: '#8E24AA' },
  { id: 6, hex: '#00ACC1' },
  { id: 7, hex: '#F06292' },
]

function generateCode() {
  return Array.from({ length: CODE_LEN }, () => Math.floor(Math.random() * COLORS.length))
}

function getFeedback(guess: number[], code: number[]) {
  let black = 0, white = 0
  const codeUsed = [...code]
  const guessUsed = [...guess]
  for (let i = 0; i < CODE_LEN; i++) {
    if (guess[i] === code[i]) { black++; codeUsed[i] = -1; guessUsed[i] = -1 }
  }
  for (let i = 0; i < CODE_LEN; i++) {
    if (guessUsed[i] === -1) continue
    const j = codeUsed.indexOf(guessUsed[i])
    if (j !== -1) { white++; codeUsed[j] = -1 }
  }
  return { black, white }
}

type Row = { guess: number[], black: number, white: number }
type Phase = 'idle' | 'playing' | 'won' | 'lost'

export default function MastermindClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('idle')
  const [code, setCode] = useState<number[]>([])
  const [rows, setRows] = useState<Row[]>([])
  const [current, setCurrent] = useState<(number|null)[]>([null,null,null,null])
  const [selected, setSelected] = useState<number>(0)
  const [saved, setSaved] = useState(false)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [top5, setTop5] = useState<any[]>([])
  const [worldRecord, setWorldRecord] = useState<any>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [startTime, setStartTime] = useState(0)

  useEffect(() => {
    supabase.from('mastermind_scores').select('player_name, attempts, time_ms').order('attempts', { ascending: true }).limit(500)
      .then(({ data }) => {
        if (!data) return
        const best: Record<string, { attempts: number, time_ms: number }> = {}
        data.forEach((s: any) => {
          if (!best[s.player_name] || s.attempts < best[s.player_name].attempts) best[s.player_name] = { attempts: s.attempts, time_ms: s.time_ms }
        })
        const sorted = Object.entries(best).sort((a, b) => a[1].attempts - b[1].attempts).slice(0, 5)
        setTop5(sorted.map(([name, v]) => ({ name, ...v })))
        if (sorted.length > 0) setWorldRecord({ name: sorted[0][0], ...sorted[0][1] })
        if (profile?.name && best[profile.name]) setMyBest(best[profile.name].attempts)
      })
  }, [profile])

  useEffect(() => {
    if (phase !== 'playing') return
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 500)
    return () => clearInterval(t)
  }, [phase, startTime])

  const startGame = () => {
    setCode(generateCode())
    setRows([])
    setCurrent([null,null,null,null])
    setSelected(0)
    setSaved(false)
    setWorldRank(null)
    setElapsed(0)
    setStartTime(Date.now())
    setPhase('playing')
    window.dispatchEvent(new Event('gameStart'))
  }

  const pickColor = (colorId: number) => {
    const next = [...current]
    next[selected] = colorId
    setCurrent(next)
    const nextEmpty = next.findIndex((v, i) => i > selected && v === null)
    if (nextEmpty !== -1) setSelected(nextEmpty)
    else {
      const firstEmpty = next.findIndex(v => v === null)
      if (firstEmpty !== -1) setSelected(firstEmpty)
    }
  }

  const submit = () => {
    if (current.some(v => v === null)) return
    const guess = current as number[]
    const { black, white } = getFeedback(guess, code)
    const newRows = [...rows, { guess, black, white }]
    setRows(newRows)
    setCurrent([null,null,null,null])
    setSelected(0)
    if (black === CODE_LEN) {
      setPhase('won')
      window.dispatchEvent(new Event('gameResult'))
      supabase.from('mastermind_scores').select('*', { count: 'exact', head: true }).lt('attempts', newRows.length)
        .then(({ count }) => setWorldRank((count || 0) + 1))
    } else if (newRows.length >= MAX) {
      setPhase('lost')
      window.dispatchEvent(new Event('gameResult'))
    }
  }

  const fmtTime = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  if (phase === 'idle') return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
        <div style={{ fontSize:48 }}>🎯</div>
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Mastermind</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Crack the 4-color code in 10 tries</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:'14px', marginBottom:20 }}>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:700, lineHeight:2 }}>
          Pick 4 colors and submit.<br/>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><span style={{ width:14, height:14, borderRadius:'50%', background:'#fff', display:'inline-block' }} /> Right color, right spot</span><br/>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><span style={{ width:14, height:14, borderRadius:'50%', background:'rgba(255,255,255,0.35)', border:'1px solid #fff', display:'inline-block' }} /> Right color, wrong spot</span>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${worldRecord.attempts} tries` : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest !== null ? `${myBest} tries` : '—'}</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p, i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.attempts} tries</div>
          </div>
        ))}
      </div>
      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080', marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  const won = phase === 'won'
  const lost = phase === 'lost'

  return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'16px 20px 100px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>ATTEMPT</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{rows.length} / {MAX}</div>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>TIME</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{fmtTime(elapsed)}</div>
        </div>
        <button onClick={() => setPhase('idle')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.3)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>← Menu</button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
        {Array.from({ length: MAX }, (_, i) => {
          const row = rows[i]
          const isCurrent = i === rows.length && phase === 'playing'
          return (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ display:'flex', gap:6, flex:1 }}>
                {Array.from({ length: CODE_LEN }, (_, j) => {
                  const color = row ? COLORS[row.guess[j]] : isCurrent ? (current[j] !== null ? COLORS[current[j]!] : null) : null
                  const isActive = isCurrent && j === selected
                  return (
                    <div key={j} onClick={() => isCurrent && setSelected(j)}
                      style={{ width:52, height:44, borderRadius:12, background: color ? color.hex : 'rgba(255,255,255,0.06)', border: isActive ? '3px solid #fff' : '2px solid rgba(255,255,255,0.1)', cursor: isCurrent ? 'pointer' : 'default', boxSizing:'border-box' }} />
                  )
                })}
              </div>
              <div style={{ display:'flex', gap:4, width:88 }}>
                {Array.from({ length: CODE_LEN }, (_, j) => {
                  const isBlack = row && j < row.black
                  const isWhite = row && j >= row.black && j < row.black + row.white
                  return (
                    <div key={j} style={{ width:16, height:16, borderRadius:'50%', background: isBlack ? '#fff' : isWhite ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', flexShrink:0 }} />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {phase === 'playing' && (
        <>
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:12, flexWrap:'wrap' }}>
            {COLORS.map(col => (
              <button key={col.id} onClick={() => pickColor(col.id)}
                style={{ width:48, height:48, borderRadius:12, border: selected !== null && current[selected] === col.id ? '3px solid #fff' : '2px solid rgba(255,255,255,0.2)', background:col.hex, cursor:'pointer' }} />
            ))}
          </div>
          <button onClick={submit} disabled={current.some(v => v === null)}
            style={{ width:'100%', padding:'16px', borderRadius:16, border:'none', background: current.some(v => v === null) ? 'rgba(255,255,255,0.08)' : GREEN, color:'#fff', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor: current.some(v => v === null) ? 'default' : 'pointer', boxShadow: current.some(v => v === null) ? 'none' : '0 6px 0 #1B5E2080' }}>
            Submit →
          </button>
        </>
      )}

      {(won || lost) && (
        <div style={{ background:'rgba(0,0,0,0.4)', borderRadius:24, padding:'24px', textAlign:'center', border:'1px solid rgba(255,255,255,0.08)', marginTop:8 }}>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:4 }}>{won ? '🎉 Solved!' : '💀 Game Over'}</div>
          {won && <div style={{ fontSize:40, fontWeight:900, color:GOLD, marginBottom:4 }}>{rows.length} tries</div>}
          {won && worldRank && <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>#{worldRank} in the world</div>}
          {lost && (
            <div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>The code was:</div>
              <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:16 }}>
                {code.map((c, i) => <div key={i} style={{ width:40, height:40, borderRadius:10, background:COLORS[c].hex }} />)}
              </div>
            </div>
          )}
          {won && profile?.name && !saved && (
            <button onClick={async () => {
              await supabase.from('mastermind_scores').insert({ player_name: profile.name, attempts: rows.length, time_ms: elapsed * 1000 })
              setSaved(true)
            }} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:12 }}>
              Save Score
            </button>
          )}
          {saved && <div style={{ fontSize:13, color:'#69F0AE', fontWeight:800, marginBottom:12 }}>✓ Saved!</div>}
          <button onClick={startGame} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Play Again →</button>
        </div>
      )}
    </main>
  )
}
