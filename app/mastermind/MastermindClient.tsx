'use client'
import { useState, useEffect, useRef } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const PURPLE = '#6A1B9A'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const COLORS = ['#E53935', '#1E88E5', '#43A047', '#FDD835', '#FB8C00']
const CODE_LENGTH = 5
const MAX_ATTEMPTS = 8
const BALL = 48

function fmtTime(ms: number) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`
}

function generateCode(): number[] {
  return Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * COLORS.length))
}

function getPerSlotFeedback(guess: number[], code: number[]): ('correct'|'misplaced'|'wrong')[] {
  const result: ('correct'|'misplaced'|'wrong')[] = Array(CODE_LENGTH).fill('wrong')
  const codeUsed = Array(CODE_LENGTH).fill(false)
  const guessUsed = Array(CODE_LENGTH).fill(false)
  guess.forEach((g, i) => {
    if (g === code[i]) { result[i] = 'correct'; codeUsed[i] = true; guessUsed[i] = true }
  })
  guess.forEach((g, i) => {
    if (guessUsed[i]) return
    const j = code.findIndex((c, ci) => !codeUsed[ci] && c === g)
    if (j !== -1) { result[i] = 'misplaced'; codeUsed[j] = true }
  })
  return result
}

type Phase = 'rules' | 'playing' | 'result'
type SlotFeedback = 'correct'|'misplaced'|'wrong'
type GuessRow = { colors: number[], feedback: SlotFeedback[] }

export default function MastermindClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [code, setCode] = useState<number[]>([])
  const [guesses, setGuesses] = useState<GuessRow[]>([])
  const [current, setCurrent] = useState<(number|null)[]>(Array(CODE_LENGTH).fill(null))
  const [lockedSlots, setLockedSlots] = useState<boolean[]>(Array(CODE_LENGTH).fill(false))
  const [selected, setSelected] = useState<number>(0)
  const [won, setWon] = useState(false)
  const [worldRecord, setWorldRecord] = useState<{attempts:number,time_ms:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,attempts:number,time_ms:number}[]>([])
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<NodeJS.Timeout|null>(null)

  useEffect(() => {
    if (profile?.name) setName(profile.name)
    loadData()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('mastermind_scores').select('player_name,attempts,time_ms').order('attempts', { ascending: true }).order('time_ms', { ascending: true }).limit(500)
    if (!data) return
    const best: Record<string,{attempts:number,time_ms:number}> = {}
    data.forEach((s:any) => {
      const existing = best[s.player_name]
      if (!existing || s.attempts < existing.attempts || (s.attempts === existing.attempts && s.time_ms < existing.time_ms))
        best[s.player_name] = {attempts:s.attempts, time_ms:s.time_ms}
    })
    const sorted = Object.entries(best).map(([n,v]) => ({name:n, attempts:v.attempts, time_ms:v.time_ms})).sort((a,b) => a.attempts !== b.attempts ? a.attempts-b.attempts : a.time_ms-b.time_ms)
    setTop5(sorted.slice(0,5) as any)
    if (sorted[0]) setWorldRecord({attempts:sorted[0].attempts, time_ms:sorted[0].time_ms, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
  }

  const startGame = () => {
    const c = generateCode()
    setCode(c)
    setGuesses([])
    setCurrent(Array(CODE_LENGTH).fill(null))
    setLockedSlots(Array(CODE_LENGTH).fill(false))
    setSelected(0)
    setWon(false)
    setElapsed(0)
    const t = Date.now()
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setElapsed(Date.now() - t), 100)
    setPhase('playing')
  }

  const addColor = (colorIdx: number) => {
    setCurrent(prev => {
      const next = [...prev]
      const firstEmpty = next.findIndex((v, i) => v === null && !lockedSlots[i])
      if (firstEmpty === -1) return next
      next[firstEmpty] = colorIdx
      return next
    })
    setSelected(colorIdx)
  }

  const removeColor = (slotIdx: number) => {
    if (lockedSlots[slotIdx]) return
    setCurrent(prev => { const n = [...prev]; n[slotIdx] = null; return n })
  }

  const submitGuess = async () => {
    if (current.some((v, i) => v === null && !lockedSlots[i])) return
    // Fill locked slots into current
    const guess = current.map((v, i) => v!) as number[]
    const feedback = getPerSlotFeedback(guess, code)
    const newGuess: GuessRow = { colors: guess, feedback }
    const newGuesses = [...guesses, newGuess]
    setGuesses(newGuesses)

    if (feedback.every(f => f === 'correct')) {
      setWon(true)
      setPhase('result')
      if (profile?.name) {
        await supabase.from('mastermind_scores').insert({player_name:profile.name, attempts:newGuesses.length, time_ms:elapsed})
        const {count} = await supabase.from('mastermind_scores').select('*',{count:'exact',head:true}).lt('attempts',newGuesses.length)
        setWorldRank((count??0)+1)
      }
      return
    }

    if (newGuesses.length >= MAX_ATTEMPTS) {
      setWon(false)
      setPhase('result')
      return
    }

    // Prepare next row
    // Correct slots get auto-placed and locked
    const nextRow: (number|null)[] = Array(CODE_LENGTH).fill(null)
    const nextLocked: boolean[] = Array(CODE_LENGTH).fill(false)
    feedback.forEach((f, i) => {
      if (f === 'correct') {
        nextRow[i] = guess[i]
        nextLocked[i] = true
      }
    })

    setTimeout(() => {
      setCurrent(nextRow)
      setLockedSlots(nextLocked)
    }, 300)
  }

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
    await supabase.from('mastermind_scores').insert({player_name:name.trim(), attempts:guesses.length, time_ms:elapsed})
    const {count} = await supabase.from('mastermind_scores').select('*',{count:'exact',head:true}).lt('attempts',guesses.length)
    setWorldRank((count??0)+1)
    setSaving(false)
    setSaved(true)
    localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
    setTimeout(() => window.location.reload(), 1500)
  }

  const reset = () => { setPhase('rules'); setSaved(false); loadData() }

  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
        <img src={`${BASE}/mastermind.png`} style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Mastermind</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Crack the 5-color code</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:'14px 16px', marginBottom:20 }}>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:700, lineHeight:1.8 }}>
          Pick 5 colors and submit.<br/>
          <span style={{ color:'#69F0AE', fontWeight:900 }}>✓ Auto-placed next row</span> — right color, right spot<br/>
          <span style={{ color:'#fff', fontWeight:900 }}>? Stays in row</span> — right color, wrong spot<br/>
          <span style={{ color:'rgba(255,255,255,0.4)', fontWeight:900 }}>No mark</span> — wrong color
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${worldRecord.attempts} tries` : '—'}</div>
          {worldRecord && worldRecord.time_ms > 0 && <div style={{ fontSize:11, color:'rgba(200,150,12,0.7)', fontWeight:700 }}>{fmtTime(worldRecord.time_ms)}</div>}
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? `${myBest} tries` : '—'}</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.attempts} tries</div>
              {p.time_ms > 0 && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>{fmtTime(p.time_ms)}</div>}
            </div>
          </div>
        ))}
      </div>
      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:PURPLE, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${PURPLE}80`, marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  if (phase === 'playing') {
    const allFilled = current.every((v, i) => v !== null || lockedSlots[i])

    return (
      <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'12px 20px', overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase' }}>{guesses.length + 1} / {MAX_ATTEMPTS}</div>
          <div style={{ fontSize:18, fontWeight:900, color:GOLD, fontVariantNumeric:'tabular-nums' }}>{fmtTime(elapsed)}</div>
        </div>

        {/* Previous guesses */}
        <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, marginBottom:10 }}>
          {guesses.map((g, ri) => (
            <div key={ri} style={{ display:'flex', gap:8, justifyContent:'center' }}>
              {g.colors.map((c, ci) => {
                const fb = g.feedback[ci]
                return (
                  <div key={ci} style={{ position:'relative', width:BALL, height:BALL }}>
                    <div style={{
                      width:BALL, height:BALL, borderRadius:'50%',
                      background: COLORS[c],
                      boxShadow: fb === 'correct' ? '0 0 0 3px #69F0AE' : 'none',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      {fb === 'correct' && <span style={{ fontSize:20, color:'#fff', fontWeight:900 }}>✓</span>}
                      {fb === 'misplaced' && <span style={{ fontSize:18, color:'#fff', fontWeight:900 }}>?</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Current row */}
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:12 }}>
          {current.map((c, i) => (
            <div key={i} onClick={() => { if (!lockedSlots[i] && c !== null) removeColor(i) }} style={{
              width:BALL, height:BALL, borderRadius:'50%',
              background: c !== null ? COLORS[c] : 'rgba(255,255,255,0.06)',
              border: lockedSlots[i] ? '3px solid #69F0AE' : '2px solid rgba(255,255,255,0.1)',
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor: !lockedSlots[i] && c !== null ? 'pointer' : 'default',
              transition:'background 0.1s',
            }}>
              {lockedSlots[i] && <span style={{ fontSize:20, color:'#fff', fontWeight:900 }}>✓</span>}
            </div>
          ))}
        </div>

        {/* Color palette */}
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:12 }}>
          {COLORS.map((c, i) => (
            <button key={i} onClick={() => addColor(i)} style={{
              width:BALL, height:BALL, borderRadius:'50%', border:'none', background:c, cursor:'pointer',
              boxShadow: selected===i ? '0 0 0 3px #fff' : 'none',
              transform: selected===i ? 'scale(1.1)' : 'scale(1)',
              transition:'all 0.1s',
            }} />
          ))}
        </div>

        <button onClick={submitGuess} disabled={!allFilled} style={{
          width:'100%', padding:'16px', borderRadius:16, border:'none',
          background: GREEN, color:'#fff', fontSize:16, fontWeight:900,
          fontFamily:'inherit', cursor: allFilled?'pointer':'default',
          boxShadow:'0 6px 0 #1B5E2080', opacity: allFilled ? 1 : 0.35,
          marginBottom:70,
        }}>
          Submit →
        </button>
      </main>
    )
  }

  const bgResult = won ? '#0D3320' : '#1A0000'
  return (
    <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:32, fontWeight:900, color: won?'#69F0AE':'#FF5252', marginBottom:8 }}>{won ? '🎉 Solved!' : '💀 Game Over'}</div>
        {won && <div style={{ fontSize:18, color:'rgba(255,255,255,0.6)', fontWeight:700 }}>{guesses.length} tries · {fmtTime(elapsed)}</div>}
        {!won && (
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:12 }}>
            {code.map((c, i) => <div key={i} style={{ width:BALL, height:BALL, borderRadius:'50%', background:COLORS[c] }} />)}
          </div>
        )}
        {worldRank && won && <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:8 }}>#{worldRank} in the world</div>}
      </div>
      {!profile?.name && !saved && won && (
        <div style={{ width:'100%', background:'rgba(0,0,0,0.3)', borderRadius:24, padding:'24px' }}>
          <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:4 }}>Save your score</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:16 }}>New user? Create account. Returning? Enter your PIN.</div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.12)', color:'#fff', fontSize:15, fontWeight:800, fontFamily:'inherit', outline:'none', marginBottom:12, boxSizing:'border-box' }} />
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>PIN</div>
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:16 }}>
            {pin.map((d,i) => (
              <input key={i} id={`pin-${i}`} type="tel" maxLength={1} value={d}
                onChange={e=>{const v=e.target.value.replace(/\D/,'');const p=[...pin];p[i]=v;setPin(p);if(v&&i<3)(document.getElementById(`pin-${i+1}`) as HTMLInputElement)?.focus()}}
                style={{ width:48, height:56, textAlign:'center', fontSize:24, fontWeight:900, borderRadius:12, border:'2px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontFamily:'inherit', outline:'none' }} />
            ))}
          </div>
          {saveError && <div style={{ fontSize:12, color:'#FF5252', fontWeight:800, textAlign:'center', marginBottom:10 }}>{saveError}</div>}
          <button onClick={saveScore} disabled={!name.trim()||pin.join('').length!==4||saving} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:name.trim()&&pin.join('').length===4?GREEN:'rgba(255,255,255,0.15)', color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
            {saving?'Saving...':'Save →'}
          </button>
        </div>
      )}
      {saved && <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:16, padding:'16px 20px', textAlign:'center' }}><div style={{ fontSize:16, fontWeight:900, color:'#69F0AE' }}>✓ Score saved!</div></div>}
      <div style={{ display:'flex', gap:10, width:'100%' }}>
        <button onClick={reset} style={{ flex:1, padding:'16px', borderRadius:16, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
        <button onClick={()=>{setSaved(false);startGame()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:PURPLE, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${PURPLE}80` }}>Play again →</button>
      </div>
    </main>
  )
}
