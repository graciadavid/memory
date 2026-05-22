'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const PURPLE = '#7B1FA2'

const COLORS = [
 { id: 0, color: '#E53935', label: 'Red' },
 { id: 1, color: '#43A047', label: 'Green' },
 { id: 2, color: '#1E88E5', label: 'Blue' },
 { id: 3, color: '#FDD835', label: 'Yellow' },
 { id: 4, color: '#FB8C00', label: 'Orange' },
 { id: 5, color: '#E91E63', label: 'Pink' },
]

type Phase = 'rules' | 'playing' | 'result'

export default function NBackPage() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [nLevel, setNLevel] = useState(1) // N-back level
 const [sequence, setSequence] = useState<number[]>([])
 const [currentIdx, setCurrentIdx] = useState(0)
 const [activeColor, setActiveColor] = useState<number | null>(null)
 const [score, setScore] = useState(0)
 const [errors, setErrors] = useState(0)
 const [showFeedback, setShowFeedback] = useState<'correct'|'wrong'|null>(null)
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
 const timerRef = useRef<NodeJS.Timeout|null>(null)
 const seqRef = useRef<number[]>([])
 const idxRef = useRef(0)
 const scoreRef = useRef(0)
 const errorsRef = useRef(0)
 const waitingRef = useRef(false)
 const nRef = useRef(1)

 useEffect(() => {
   if (profile?.name) setName(profile.name)
   loadData()
   return () => { if (timerRef.current) clearTimeout(timerRef.current) }
 }, [profile?.name])

 const loadData = async () => {
   const { data } = await supabase.from('nback_scores').select('player_name,level').order('level', { ascending: false }).limit(500)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).map(([n,l]) => ({name:n, level:l as number})).sort((a,b) => b.level-a.level)
   setTop5(sorted.slice(0,5))
   if (sorted[0]) setWorldRecord({level:sorted[0].level, name:sorted[0].name})
   if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
 }

 const showNext = useCallback(() => {
   const idx = idxRef.current
   const seq = seqRef.current
   if (idx >= seq.length) {
     // End of round — increase N if doing well
     endGame(scoreRef.current, errorsRef.current)
     return
   }
   setCurrentIdx(idx)
   setActiveColor(seq[idx])
   waitingRef.current = true
   setShowFeedback(null)

   timerRef.current = setTimeout(() => {
     setActiveColor(null)
     waitingRef.current = false
     idxRef.current = idx + 1
     timerRef.current = setTimeout(showNext, 600)
   }, 800)
 }, [])

 const startGame = (n: number = 1) => {
   const seq = Array.from({length: 20 + n * 5}, () => Math.floor(Math.random() * (3 + n)))
   seqRef.current = seq
   idxRef.current = 0
   scoreRef.current = 0
   errorsRef.current = 0
   nRef.current = n
   setSequence(seq)
   setCurrentIdx(0)
   setScore(0)
   setErrors(0)
   setNLevel(n)
   setShowFeedback(null)
   setPhase('playing')
   timerRef.current = setTimeout(showNext, 800)
 }

 const handleMatch = useCallback(() => {
   if (!waitingRef.current) return
   const idx = idxRef.current
   const seq = seqRef.current
   const n = nRef.current
   const isMatch = idx >= n && seq[idx] === seq[idx - n]
   if (isMatch) {
     scoreRef.current++
     setScore(s => s + 1)
     setShowFeedback('correct')
   } else {
     errorsRef.current++
     setErrors(e => e + 1)
     setShowFeedback('wrong')
   }
 }, [])

 const endGame = async (s: number, e: number) => {
   if (timerRef.current) clearTimeout(timerRef.current)
   const fl = nRef.current
   setFinalLevel(fl)
   setPhase('result')
   if (profile?.name) {
     await supabase.from('nback_scores').insert({player_name:profile.name, level:fl})
     const {count} = await supabase.from('nback_scores').select('*',{count:'exact',head:true}).gt('level',fl)
     setWorldRank((count??0)+1)
     if (myBest===null || fl>myBest) setMyBest(fl)
   }
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
   await supabase.from('nback_scores').insert({player_name:name.trim(), level:finalLevel})
   const {count} = await supabase.from('nback_scores').select('*',{count:'exact',head:true}).gt('level',finalLevel)
   setWorldRank((count??0)+1)
   setSaving(false)
   setSaved(true)
   localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
   setTimeout(() => window.location.reload(), 1500)
 }

 const reset = () => {
   if (timerRef.current) clearTimeout(timerRef.current)
   setPhase('rules')
   setSaved(false)
   loadData()
 }

 const resultColor = finalLevel >= 3 ? '#00C853' : finalLevel >= 2 ? '#FF6F00' : '#D32F2F'
 const bgResult = finalLevel >= 3 ? '#0D3320' : finalLevel >= 2 ? '#2D1A00' : '#1A0000'

 if (phase === 'rules') return (
   <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
     <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
       <div style={{ width:60, height:60, background:'rgba(255,255,255,0.06)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>🧠</div>
       <div>
         <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>N-Back</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Does this color match N steps ago?</div>
       </div>
     </div>
     <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:'14px', marginBottom:20 }}>
       <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.6 }}>
         Colors appear one by one. Press <span style={{ color:'#69F0AE', fontWeight:900 }}>Match</span> when the current color is the same as the one shown <span style={{ color:GOLD, fontWeight:900 }}>N steps ago</span>.
       </div>
     </div>
     <div style={{ display:'flex', gap:10, marginBottom:20 }}>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
         <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${worldRecord.level}-Back` : '—'}</div>
         {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
       </div>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
         <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? `${myBest}-Back` : '—'}</div>
       </div>
     </div>
     <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
       <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
       {top5.map((p,i) => (
         <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
           <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
           <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
           <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.level}-Back</div>
         </div>
       ))}
     </div>
     <button onClick={() => startGame(1)} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:PURPLE, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${PURPLE}80`, marginTop:'auto' }}>
       Start 1-Back →
     </button>
   </main>
 )

 if (phase === 'playing') return (
   <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, padding:'24px' }}>
     <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase' }}>
       {nLevel}-Back · {currentIdx + 1}/{seqRef.current.length}
     </div>
     <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:700 }}>
       ✓ {score} · ✗ {errors}
     </div>

     {/* Color display */}
     <div style={{ width:160, height:160, borderRadius:32, background: activeColor !== null ? COLORS[activeColor]?.color : 'rgba(255,255,255,0.06)', transition:'background 0.1s', boxShadow: activeColor !== null ? `0 0 40px ${COLORS[activeColor]?.color}80` : 'none' }} />

     {showFeedback && (
       <div style={{ fontSize:24, fontWeight:900, color: showFeedback==='correct'?'#69F0AE':'#FF5252' }}>
         {showFeedback==='correct'?'✓ Match!':'✗ Not a match'}
       </div>
     )}

     {/* Match button */}
     <button onClick={handleMatch} style={{ width:'100%', padding:'22px', borderRadius:20, border:'none', background:'rgba(105,240,174,0.15)', color:'#69F0AE', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', outline:'2px solid rgba(105,240,174,0.3)' }}>
       Match ✓
     </button>
     <div style={{ fontSize:12, color:'rgba(255,255,255,0.2)', fontWeight:700 }}>Tap only when it matches {nLevel} step{nLevel>1?'s':''} ago</div>
   </main>
 )

 return (
   <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
     <div style={{ textAlign:'center' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>N-Back Level</div>
       <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2 }}>{finalLevel}</div>
       <div style={{ fontSize:16, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:4 }}>{score} correct · {errors} errors</div>
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
       </div>
     )}
     <div style={{ display:'flex', gap:10, width:'100%' }}>
       <button onClick={reset} style={{ flex:1, padding:'16px', borderRadius:16, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
       <button onClick={()=>{setSaved(false);startGame(1)}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:PURPLE, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${PURPLE}80` }}>Play again →</button>
     </div>
   </main>
 )
}
