'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const BLUE = '#1565C0'

type Phase = 'rules' | 'show' | 'input' | 'result'

function generateDigits(length: number): number[] {
 return Array.from({ length }, () => Math.floor(Math.random() * 10))
}

export default function DigitsClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [level, setLevel] = useState(3)
 const [digits, setDigits] = useState<number[]>([])
 const [input, setInput] = useState<number[]>([])
 const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
 const [finalLevel, setFinalLevel] = useState(0)
 const [worldRecord, setWorldRecord] = useState<{level:number,name:string}|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<{name:string,level:number}[]>([])
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
   const { data } = await supabase.from('number_scores').select('player_name,level').order('level', { ascending: false }).limit(500)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).map(([n,l]) => ({name:n, level:l as number})).sort((a,b) => b.level-a.level)
   setTop5(sorted.slice(0,5))
   if (sorted[0]) setWorldRecord({level:sorted[0].level, name:sorted[0].name})
   if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
 }

 const startGame = () => {
   setLevel(3)
   setInput([])
   setFeedback(null)
   showLevel(3)
 }

 const showLevel = (l: number) => {
   const d = generateDigits(l)
   setDigits(d)
   setInput([])
   setFeedback(null)
   setPhase('show')
   setTimeout(() => setPhase('input'), l * 700 + 500)
 }

 const handleDigit = useCallback((d: number) => {
   if (phase !== 'input') return
   const newInput = [...input, d]
   setInput(newInput)
   if (newInput.length === digits.length) {
     const correct = newInput.every((v, i) => v === digits[i])
     setFeedback(correct ? 'correct' : 'wrong')
     if (correct) {
       const nextLevel = level + 1
       setLevel(nextLevel)
       setTimeout(() => showLevel(nextLevel), 800)
     } else {
       setFinalLevel(level - 1)
       setTimeout(async () => {
         const fl = level - 1
         setPhase('result')
         if (profile?.name && fl > 0) {
           await supabase.from('number_scores').insert({player_name:profile.name, level:fl})
           const {count} = await supabase.from('number_scores').select('*',{count:'exact',head:true}).gt('level',fl)
           setWorldRank((count??0)+1)
           if (myBest===null || fl>myBest) setMyBest(fl)
         }
       }, 1000)
     }
   }
 }, [phase, input, digits, level, profile?.name, myBest])

 const saveScore = async () => {
   if (!name.trim() || pin.join('').length!==4) return
   setSaving(true)
   setSaveError('')
   const pinHash = btoa(pin.join(''))
   const {data:existing} = await supabase.from('profiles').select('password_hash').eq('player_name',name.trim()).maybeSingle()
   if (existing) {
     if (existing.password_hash !== pinHash) { setSaveError('Wrong PIN for this name'); setSaving(false); return }
   } else {
     await supabase.from('profiles').insert({player_name:name.trim(), password_hash:pinHash})
   }
   await supabase.from('number_scores').insert({player_name:name.trim(), level:finalLevel})
   const {count} = await supabase.from('number_scores').select('*',{count:'exact',head:true}).gt('level',finalLevel)
   setWorldRank((count??0)+1)
   setSaving(false)
   setSaved(true)
   localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
   setTimeout(() => window.location.reload(), 1500)
 }

 const reset = () => { setPhase('rules'); setSaved(false); loadData() }

 const resultColor = finalLevel >= 8 ? '#00C853' : finalLevel >= 5 ? '#FF6F00' : '#D32F2F'
 const bgResult = finalLevel >= 8 ? '#0D3320' : finalLevel >= 5 ? '#2D1A00' : '#1A0000'

 if (phase === 'rules') return (
   <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
     <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
       <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/digits.png" style={{ width:60, height:60, objectFit:'contain' }} />
       <div>
         <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Digits</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Memorize and repeat the sequence</div>
       </div>
     </div>
     <div style={{ display:'flex', gap:10, marginBottom:20 }}>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
         <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${worldRecord.level} digits` : '—'}</div>
         {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
       </div>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
         <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? `${myBest} digits` : '—'}</div>
       </div>
     </div>
     <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
       <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
       {top5.map((p,i) => (
         <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
           <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
           <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
           <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.level} digits</div>
         </div>
       ))}
     </div>
     <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:BLUE, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${BLUE}80`, marginTop:'auto' }}>
       Play →
     </button>
   </main>
 )

 if (phase === 'show') return (
   <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24 }}>
     <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase' }}>Level {level} — Memorize</div>
     <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
       {digits.map((d, i) => (
         <div key={i} style={{ width:64, height:80, background:'rgba(255,255,255,0.08)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, fontWeight:900, color:'#fff', border:'1px solid rgba(255,255,255,0.1)' }}>
           {d}
         </div>
       ))}
     </div>
   </main>
 )

 if (phase === 'input') return (
   <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px', gap:16 }}>
     <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase', textAlign:'center' }}>Level {level} — Type the sequence</div>
     
     {/* Input display */}
     <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center', minHeight:80, alignItems:'center' }}>
       {Array.from({length: digits.length}).map((_, i) => (
         <div key={i} style={{ width:52, height:64, background: input[i]!==undefined ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:900, color: feedback==='wrong' ? '#FF5252' : feedback==='correct' ? '#69F0AE' : '#fff', border:`1px solid ${feedback==='wrong'?'rgba(255,82,82,0.4)':feedback==='correct'?'rgba(105,240,174,0.4)':'rgba(255,255,255,0.08)'}` }}>
           {input[i]!==undefined ? input[i] : ''}
         </div>
       ))}
     </div>

     {/* Numpad */}
     <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginTop:'auto' }}>
       {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((d, i) => (
         <button key={i} onClick={() => {
           if (d === '⌫') { setInput(prev => prev.slice(0,-1)); return }
           if (d === '') return
           handleDigit(Number(d))
         }} style={{ padding:'20px', borderRadius:16, border:'none', background: d===''?'transparent':'rgba(255,255,255,0.08)', color:'#fff', fontSize:24, fontWeight:900, fontFamily:'inherit', cursor: d===''?'default':'pointer', border:'1px solid rgba(255,255,255,0.06)' }}>
           {d}
         </button>
       ))}
     </div>
   </main>
 )

 return (
   <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
     <div style={{ textAlign:'center' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Best level reached</div>
       <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2 }}>{finalLevel}</div>
       <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:4 }}>digits</div>
       {worldRank && <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:8 }}>#{worldRank} in the world</div>}
     </div>

     {!profile?.name && !saved && (
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
         <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:4 }}>#{worldRank} in the world</div>
       </div>
     )}

     <div style={{ display:'flex', gap:10, width:'100%' }}>
       <button onClick={reset} style={{ flex:1, padding:'16px', borderRadius:16, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
       <button onClick={()=>{setSaved(false);startGame()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:BLUE, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${BLUE}80` }}>Play again →</button>
     </div>
   </main>
 )
}
