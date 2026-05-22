'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const PURPLE = '#6A1B9A'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const COLORS = ['#E53935', '#1E88E5', '#43A047', '#FDD835', '#FB8C00']
const CODE_LENGTH = 4
const MAX_ATTEMPTS = 8

function generateCode(): number[] {
  return Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * COLORS.length))
}

function getFeedback(guess: number[], code: number[]): { correct: number, misplaced: number } {
  const codeUsed = Array(CODE_LENGTH).fill(false)
  const guessUsed = Array(CODE_LENGTH).fill(false)
  let correct = 0, misplaced = 0
  guess.forEach((g, i) => { if (g === code[i]) { correct++; codeUsed[i] = true; guessUsed[i] = true } })
  guess.forEach((g, i) => {
    if (guessUsed[i]) return
    const j = code.findIndex((c, ci) => !codeUsed[ci] && c === g)
    if (j !== -1) { misplaced++; codeUsed[j] = true }
  })
  return { correct, misplaced }
}

type Phase = 'rules' | 'playing' | 'result'

export default function MastermindClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [code, setCode] = useState<number[]>([])
  const [guesses, setGuesses] = useState<{colors: number[], feedback: {correct:number,misplaced:number}}[]>([])
  const [current, setCurrent] = useState<number[]>([])
  const [selected, setSelected] = useState<number>(0)
  const [won, setWon] = useState(false)
  const [worldRecord, setWorldRecord] = useState<{attempts:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,attempts:number}[]>([])
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (profile?.name) setName(profile.name)
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('mastermind_scores').select('player_name,attempts').order('attempts', { ascending: true }).limit(500)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.attempts < best[s.player_name]) best[s.player_name] = s.attempts })
    const sorted = Object.entries(best).map(([n,a]) => ({name:n, attempts:a as number})).sort((a,b) => a.attempts-b.attempts)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({attempts:sorted[0].attempts, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
  }

  const startGame = () => {
    setCode(generateCode())
    setGuesses([])
    setCurrent([])
    setSelected(0)
    setWon(false)
    setPhase('playing')
  }

  const addColor = (colorIdx: number) => {
    if (current.length < CODE_LENGTH) {
      setCurrent(prev => [...prev, colorIdx])
    }
  }

  const removeColor = () => {
    setCurrent(prev => prev.slice(0, -1))
  }

  const submitGuess = useCallback(async () => {
    if (current.length !== CODE_LENGTH) return
    const feedback = getFeedback(current, code)
    const newGuesses = [...guesses, { colors: current, feedback }]
    setGuesses(newGuesses)
    setCurrent([])

    if (feedback.correct === CODE_LENGTH) {
      setWon(true)
      setPhase('result')
      if (profile?.name) {
        const attempts = newGuesses.length
        await supabase.from('mastermind_scores').insert({player_name:profile.name, attempts})
        const {count} = await supabase.from('mastermind_scores').select('*',{count:'exact',head:true}).lt('attempts',attempts)
        setWorldRank((count??0)+1)
        if (myBest===null || attempts<myBest) setMyBest(attempts)
      }
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setWon(false)
      setPhase('result')
    }
  }, [current, code, guesses, profile?.name, myBest])

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
    const attempts = guesses.length
    await supabase.from('mastermind_scores').insert({player_name:name.trim(), attempts})
    const {count} = await supabase.from('mastermind_scores').select('*',{count:'exact',head:true}).lt('attempts',attempts)
    setWorldRank((count??0)+1)
    setSaving(false)
    setSaved(true)
    localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
    setTimeout(() => window.location.reload(), 1500)
  }

  const reset = () => { setPhase('rules'); setSaved(false); loadData() }

  const resultColor = won ? '#00C853' : '#D32F2F'
  const bgResult = won ? '#0D3320' : '#1A0000'

  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
        <img src={`${BASE}/mastermind.png`} style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Mastermind</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Crack the {CODE_LENGTH}-color code in {MAX_ATTEMPTS} tries</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:'14px', marginBottom:20 }}>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>
          🟢 Right color, right position<br/>
          🟡 Right color, wrong position<br/>
          ⚫ Wrong color
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
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? `${myBest} tries` : '—'}</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.attempts} tries</div>
          </div>
        ))}
      </div>
      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:PURPLE, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${PURPLE}80`, marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  if (phase === 'playing') {
    const BALL = 52

    const getSlotFeedback = (g: {colors: number[], feedback: {correct:number,misplaced:number}}, slotIdx: number) => {
      const codeUsed = Array(CODE_LENGTH).fill(false)
      const guessUsed = Array(CODE_LENGTH).fill(false)
      const correct_slots: boolean[] = Array(CODE_LENGTH).fill(false)
      const misplaced_slots: boolean[] = Array(CODE_LENGTH).fill(false)
      g.colors.forEach((v, i) => { if (v === code[i]) { correct_slots[i] = true; codeUsed[i] = true; guessUsed[i] = true } })
      g.colors.forEach((v, i) => {
        if (guessUsed[i]) return
        const j = code.findIndex((c, ci) => !codeUsed[ci] && c === v)
        if (j !== -1) { misplaced_slots[i] = true; codeUsed[j] = true }
      })
      if (correct_slots[slotIdx]) return 'correct'
      if (misplaced_slots[slotIdx]) return 'misplaced'
      return 'wrong'
    }

    return (
      <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'12px 20px', overflow:'hidden' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', textAlign:'center', marginBottom:12, letterSpacing:2, textTransform:'uppercase' }}>
          {guesses.length + 1} / {MAX_ATTEMPTS}
        </div>

        {/* Previous guesses */}
        <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:8, marginBottom:10 }}>
          {guesses.map((g, ri) => {
            const hasMisplaced = g.colors.some((_, ci) => getSlotFeedback(g, ci) === 'misplaced')
            return (
              <div key={ri} style={{ display:'flex', gap:8, justifyContent:'center', animation: hasMisplaced ? 'blink 0.4s ease 2' : 'none' }}>
                {g.colors.map((c, ci) => {
                  const fb = getSlotFeedback(g, ci)
                  return (
                    <div key={ci} style={{
                      width:BALL, height:BALL, borderRadius:'50%',
                      background: fb === 'wrong' ? '#333' : COLORS[c],
                      boxShadow: fb === 'correct' ? `0 0 0 3px #69F0AE` : fb === 'misplaced' ? `0 0 0 3px #fff` : 'none',
                    }} />
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Current row */}
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:14 }}>
          {Array.from({length: CODE_LENGTH}).map((_, i) => (
            <div key={i} style={{ width:BALL, height:BALL, borderRadius:'50%', background: current[i]!==undefined ? COLORS[current[i]] : 'rgba(255,255,255,0.08)', border:'2px solid rgba(255,255,255,0.1)', transition:'background 0.1s' }} />
          ))}
        </div>

        {/* Color palette */}
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:14 }}>
          {COLORS.map((c, i) => (
            <button key={i} onClick={() => { setSelected(i); addColor(i) }} style={{ width:BALL, height:BALL, borderRadius:'50%', border:'none', background:c, cursor:'pointer', boxShadow: selected===i ? `0 0 0 3px #fff, 0 0 16px ${c}` : 'none', transform: selected===i ? 'scale(1.1)' : 'scale(1)', transition:'all 0.1s' }} />
          ))}
        </div>

        <button onClick={submitGuess} disabled={current.length !== CODE_LENGTH} style={{ width:'100%', padding:'16px', borderRadius:16, border:'none', background:GREEN, color:'#fff', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor: current.length===CODE_LENGTH?'pointer':'default', boxShadow:'0 6px 0 #1B5E2080', opacity: current.length !== CODE_LENGTH ? 0.4 : 1, marginBottom:70 }}>
          Submit →
        </button>

        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      </main>
    )
  }


  return (
    <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:32, fontWeight:900, color:resultColor, marginBottom:8 }}>{won ? '🎉 Solved!' : '💀 Game Over'}</div>
        {won && <div style={{ fontSize:18, color:'rgba(255,255,255,0.6)', fontWeight:700 }}>{guesses.length} tries</div>}
        {!won && (
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:12 }}>
            {code.map((c, i) => <div key={i} style={{ width:44, height:44, borderRadius:12, background:COLORS[c] }} />)}
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
      {saved && (
        <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:16, padding:'16px 20px', textAlign:'center' }}>
          <div style={{ fontSize:16, fontWeight:900, color:'#69F0AE' }}>✓ Score saved!</div>
        </div>
      )}
      <div style={{ display:'flex', gap:10, width:'100%' }}>
        <button onClick={reset} style={{ flex:1, padding:'16px', borderRadius:16, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
        <button onClick={()=>{setSaved(false);startGame()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:PURPLE, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${PURPLE}80` }}>Play again →</button>
      </div>
    </main>
  )
}
