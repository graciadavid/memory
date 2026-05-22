'use client'
import { useState, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const PURPLE = '#6A1B9A'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const COLORS = ['#E53935', '#1E88E5', '#43A047', '#FDD835', '#FB8C00']
const CODE_LENGTH = 5
const MAX_ATTEMPTS = 8
const BALL = 52

function generateCode(): number[] {
 return Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * COLORS.length))
}

function getPerSlotFeedback(guess: number[], code: number[]): ('correct'|'misplaced'|'wrong')[] {
 const result: ('correct'|'misplaced'|'wrong')[] = Array(CODE_LENGTH).fill('wrong')
 const codeUsed = Array(CODE_LENGTH).fill(false)
 const guessUsed = Array(CODE_LENGTH).fill(false)
 // First pass: correct
 guess.forEach((g, i) => {
   if (g === code[i]) { result[i] = 'correct'; codeUsed[i] = true; guessUsed[i] = true }
 })
 // Second pass: misplaced
 guess.forEach((g, i) => {
   if (guessUsed[i]) return
   const j = code.findIndex((c, ci) => !codeUsed[ci] && c === g)
   if (j !== -1) { result[i] = 'misplaced'; codeUsed[j] = true }
 })
 return result
}

type Phase = 'rules' | 'playing' | 'result'
type GuessRow = { colors: number[], feedback: ('correct'|'misplaced'|'wrong')[] }

export default function MastermindClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [code, setCode] = useState<number[]>([])
 const [guesses, setGuesses] = useState<GuessRow[]>([])
 const [current, setCurrent] = useState<(number|null)[]>(Array(CODE_LENGTH).fill(null))
 const [selected, setSelected] = useState<number>(0)
 const [won, setWon] = useState(false)
 const [blinking, setBlinking] = useState(false)
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
   const c = generateCode()
   setCode(c)
   setGuesses([])
   setCurrent(Array(CODE_LENGTH).fill(null))
   setSelected(0)
   setWon(false)
   setBlinking(false)
   setPhase('playing')
 }

 const addColor = (colorIdx: number) => {
   // Find first empty slot that isn't locked
   const lastGuess = guesses[guesses.length - 1]
   const lockedSlots = lastGuess ? lastGuess.feedback.map(f => f === 'correct') : Array(CODE_LENGTH).fill(false)
   setCurrent(prev => {
     const next = [...prev]
     const firstEmpty = next.findIndex((v, i) => v === null && !lockedSlots[i])
     if (firstEmpty === -1) return next
     next[firstEmpty] = colorIdx
     return next
   })
   setSelected(colorIdx)
 }

 const removeColor = () => {
   const lastGuess = guesses[guesses.length - 1]
   const lockedSlots = lastGuess ? lastGuess.feedback.map(f => f === 'correct') : Array(CODE_LENGTH).fill(false)
   setCurrent(prev => {
     const next = [...prev]
     // Find last filled non-locked slot
     for (let i = CODE_LENGTH - 1; i >= 0; i--) {
       if (next[i] !== null && !lockedSlots[i]) { next[i] = null; return next }
     }
     return next
   })
 }

 const submitGuess = async () => {
   if (current.some(v => v === null)) return
   const guess = current as number[]
   const feedback = getPerSlotFeedback(guess, code)
   const newGuess: GuessRow = { colors: guess, feedback }
   const newGuesses = [...guesses, newGuess]
   setGuesses(newGuesses)

   // Blink misplaced
   const hasMisplaced = feedback.some(f => f === 'misplaced')
   if (hasMisplaced) {
     setBlinking(true)
     setTimeout(() => setBlinking(false), 1200)
   }

   if (feedback.every(f => f === 'correct')) {
     setWon(true)
     setPhase('result')
     if (profile?.name) {
       await supabase.from('mastermind_scores').insert({player_name:profile.name, attempts:newGuesses.length})
       const {count} = await supabase.from('mastermind_scores').select('*',{count:'exact',head:true}).lt('attempts',newGuesses.length)
       setWorldRank((count??0)+1)
       if (myBest===null || newGuesses.length<myBest) setMyBest(newGuesses.length)
     }
     return
   }

   if (newGuesses.length >= MAX_ATTEMPTS) {
     setWon(false)
     setPhase('result')
     return
   }

   // Prepare next row — copy correct slots
   const nextRow: (number|null)[] = Array(CODE_LENGTH).fill(null)
   feedback.forEach((f, i) => { if (f === 'correct') nextRow[i] = guess[i] })
   setTimeout(() => setCurrent(nextRow), hasMisplaced ? 1300 : 300)
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
   await supabase.from('mastermind_scores').insert({player_name:name.trim(), attempts:guesses.length})
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

     <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:'16px', marginBottom:20 }}>
       <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:700, lineHeight:1.8 }}>
         Pick 5 colors and submit.<br/>
         <span style={{ color:'#69F0AE' }}>✓</span> Right color, right spot — auto-placed next row<br/>
         <span style={{ color:'#fff', fontStyle:'italic' }}>~ Blinks</span> — right color, wrong spot<br/>
         No reaction — wrong color
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
   const lastGuess = guesses[guesses.length - 1]
   const lockedSlots = lastGuess ? lastGuess.feedback.map(f => f === 'correct') : Array(CODE_LENGTH).fill(false)
   const allFilled = current.every(v => v !== null)

   return (
     <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'12px 20px', overflow:'hidden' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', textAlign:'center', marginBottom:12, letterSpacing:2, textTransform:'uppercase' }}>
         {guesses.length + 1} / {MAX_ATTEMPTS}
       </div>

       {/* Previous guesses */}
       <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:8, marginBottom:10 }}>
         {guesses.map((g, ri) => {
           const isLastRow = ri === guesses.length - 1
           return (
             <div key={ri} style={{ display:'flex', gap:8, justifyContent:'center' }}>
               {g.colors.map((c, ci) => {
                 const fb = g.feedback[ci]
                 const isMisplaced = fb === 'misplaced'
                 return (
                   <div key={ci} style={{
                     width:BALL, height:BALL, borderRadius:'50%',
                     background: COLORS[c],
                     boxShadow: fb === 'correct' ? `0 0 0 3px #69F0AE` : 'none',
                     display:'flex', alignItems:'center', justifyContent:'center',
                     animation: isLastRow && isMisplaced && blinking ? 'blink 0.6s ease infinite' : 'none',
                   }}>
                     {fb === 'correct' && <span style={{ fontSize:22, color:'#fff', fontWeight:900, textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>✓</span>}
                   </div>
                 )
               })}
             </div>
           )
         })}
       </div>

       {/* Current row */}
       <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:14 }}>
         {current.map((c, i) => (
           <div key={i} onClick={() => { if (!lockedSlots[i] && c !== null) { setCurrent(prev => { const n=[...prev]; n[i]=null; return n }) } }} style={{
             width:BALL, height:BALL, borderRadius:'50%',
             background: c !== null ? COLORS[c] : 'rgba(255,255,255,0.06)',
             border: lockedSlots[i] ? '3px solid #69F0AE' : '2px solid rgba(255,255,255,0.1)',
             display:'flex', alignItems:'center', justifyContent:'center',
             cursor: !lockedSlots[i] && c !== null ? 'pointer' : 'default',
             transition:'background 0.1s',
           }}>
             {lockedSlots[i] && <span style={{ fontSize:22, color:'#fff', fontWeight:900 }}>✓</span>}
           </div>
         ))}
       </div>

       {/* Color palette */}
       <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:14 }}>
         {COLORS.map((c, i) => (
           <button key={i} onClick={() => addColor(i)} style={{
             width:BALL, height:BALL, borderRadius:'50%', border:'none', background:c, cursor:'pointer',
             boxShadow: selected===i ? `0 0 0 3px #fff` : 'none',
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

       <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
     </main>
   )
 }

 const bgResult = won ? '#0D3320' : '#1A0000'
 return (
   <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
     <div style={{ textAlign:'center' }}>
       <div style={{ fontSize:32, fontWeight:900, color: won?'#69F0AE':'#FF5252', marginBottom:8 }}>{won ? '🎉 Solved!' : '💀 Game Over'}</div>
       {won && <div style={{ fontSize:18, color:'rgba(255,255,255,0.6)', fontWeight:700 }}>{guesses.length} tries</div>}
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
