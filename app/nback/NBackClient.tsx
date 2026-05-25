'use client'
import { useState, useEffect, useRef } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import AuthModal from '@/components/AuthModal'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const PURPLE = '#7B1FA2'

const COLORS = [
 { color: '#E53935' },
 { color: '#43A047' },
 { color: '#1E88E5' },
 { color: '#FDD835' },
 { color: '#FB8C00' },
]

type Phase = 'rules' | 'show_first' | 'show' | 'answer' | 'feedback' | 'result'

export default function NBackPage() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [prevColor, setPrevColor] = useState<number>(0)
 const [currColor, setCurrColor] = useState<number>(0)
 const [streak, setStreak] = useState(0)
 const [finalStreak, setFinalStreak] = useState(0)
 const [feedbackResult, setFeedbackResult] = useState<'correct'|'wrong'>('correct')
 const [worldRecord, setWorldRecord] = useState<{level:number,name:string}|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<{name:string,level:number}[]>([])
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [name, setName] = useState('')
 const [pin, setPin] = useState(['','','',''])
 const [saved, setSaved] = useState(false)
 const [saving, setSaving] = useState(false)
 const [saveError, setSaveError] = useState('')

 // Use refs to avoid stale closure issues
 const prevRef = useRef(0)
 const currRef = useRef(0)
 const streakRef = useRef(0)

 useEffect(() => {
   if (profile?.name) setName(profile.name)
   loadData()
 }, [profile?.name])

 const loadData = async () => {
   const { data } = await supabase.from('nback_scores').select('player_name,level').order('level', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).map(([n,l]) => ({name:n, level:l as number})).sort((a,b) => b.level-a.level)
   setTop5(sorted.slice(0,5))
   if (sorted[0]) setWorldRecord({level:sorted[0].level, name:sorted[0].name})
   if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
 }

 const randomColor = () => Math.floor(Math.random() * COLORS.length)

 const startGame = () => {
   streakRef.current = 0
   setStreak(0)
   // Show first color — no question yet
   const first = randomColor()
   prevRef.current = first
   setPrevColor(first)
   setCurrColor(first)
   setPhase('show_first')
   // After 1.5s show second color with question
   setTimeout(() => {
     const second = randomColor()
     currRef.current = second
     setCurrColor(second)
     setPhase('answer')
   }, 1500)
 }

 const handleAnswer = async (userSaysMatch: boolean) => {
   const prev = prevRef.current
   const curr = currRef.current
   const isMatch = prev === curr
   const correct = userSaysMatch === isMatch

   if (correct) {
     streakRef.current++
     setStreak(streakRef.current)
     setFeedbackResult('correct')
     setPhase('feedback')
     // Show next after brief feedback
     setTimeout(() => {
       prevRef.current = curr
       setPrevColor(curr)
       const next = randomColor()
       currRef.current = next
       setCurrColor(next)
       setPhase('answer')
     }, 800)
   } else {
     setFeedbackResult('wrong')
     setFinalStreak(streakRef.current)
     setPhase('feedback')
     setTimeout(async () => {
       const fl = streakRef.current
       setPhase('result')
       if (profile?.name && fl > 0) {
         await supabase.from('nback_scores').insert({player_name:profile.name, level:fl})
         const {count} = await supabase.from('nback_scores').select('*',{count:'exact',head:true}).gt('level',fl)
         setWorldRank((count??0)+1)
         if (myBest===null || fl>myBest) setMyBest(fl)
       }
     }, 1000)
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
   await supabase.from('nback_scores').insert({player_name:name.trim(), level:finalStreak})
   const {count} = await supabase.from('nback_scores').select('*',{count:'exact',head:true}).gt('level',finalStreak)
   setWorldRank((count??0)+1)
   setSaving(false)
   setSaved(true)
   localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
   setTimeout(() => window.location.reload(), 1500)
 }

 const reset = () => { setPhase('rules'); setSaved(false); loadData() }

 const resultColor = finalStreak >= 10 ? '#00C853' : finalStreak >= 5 ? '#FF6F00' : '#D32F2F'
 const bgResult = finalStreak >= 10 ? '#0D3320' : finalStreak >= 5 ? '#2D1A00' : '#1A0000'

 // RULES
 if (phase === 'rules') return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
     <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
       <div style={{ width:60, height:60, background:'rgba(255,255,255,0.06)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>🧠</div>
       <div>
         <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>N-Back</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Same color as the previous one?</div>
       </div>
     </div>
     <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:'16px', marginBottom:20 }}>
       <div style={{ fontSize:14, color:'rgba(255,255,255,0.6)', fontWeight:700, lineHeight:1.8 }}>
         A color appears. Then another.<br/>
         Press <span style={{ color:'#69F0AE', fontWeight:900 }}>Match</span> if it's the same as the previous.<br/>
         Press <span style={{ color:'#FF5252', fontWeight:900 }}>Different</span> if not.<br/>
         How many can you get right in a row?
       </div>
     </div>
     <div style={{ display:'flex', gap:10, marginBottom:20 }}>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
         <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${worldRecord.level}` : '—'}</div>
         {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
       </div>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
         <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? myBest : '—'}</div>
       </div>
     </div>
     <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
       <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
       {top5.map((p,i) => (
         <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
           <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
           <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
           <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.level} streak</div>
         </div>
       ))}
     </div>
     <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:PURPLE, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${PURPLE}80`, marginTop:'auto' }}>
       Play →
     </button>
   </main>
 )

 // SHOW FIRST COLOR
 if (phase === 'show_first') return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:32, padding:'24px' }}>
     <div style={{ fontSize:16, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase' }}>Memorize this color</div>
     <div style={{ width:180, height:180, borderRadius:40, background:COLORS[currColor].color, boxShadow:`0 0 60px ${COLORS[currColor].color}60` }} />
     <div style={{ fontSize:14, color:'rgba(255,255,255,0.2)', fontWeight:700 }}>Next color coming...</div>
   </main>
 )

 // ANSWER
 if (phase === 'answer' || phase === 'feedback') return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:28, padding:'24px' }}>
     
     <div style={{ fontSize:28, fontWeight:900, color:GOLD }}>{streak}</div>

     {/* Previous color — small above */}
     <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
       <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:2 }}>Previous</div>
       <div style={{ width:64, height:64, borderRadius:18, background:COLORS[prevColor].color, opacity:0.6 }} />
     </div>

     {/* Current color — big */}
     <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
       <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:2 }}>Now</div>
       <div style={{ width:160, height:160, borderRadius:36, background:COLORS[currColor].color, boxShadow:`0 0 50px ${COLORS[currColor].color}60` }} />
     </div>

     {phase === 'feedback' && (
       <div style={{ fontSize:36, fontWeight:900, color:feedbackResult==='correct'?'#69F0AE':'#FF5252' }}>
         {feedbackResult==='correct'?'✓ Correct!':'✗ Wrong!'}
       </div>
     )}

     {phase === 'answer' && (
       <div style={{ display:'flex', gap:12, width:'100%' }}>
         <button onClick={() => handleAnswer(true)} style={{ flex:1, padding:'22px', borderRadius:18, border:'2px solid rgba(105,240,174,0.4)', background:'rgba(105,240,174,0.12)', color:'#69F0AE', fontSize:18, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
           Match ✓
         </button>
         <button onClick={() => handleAnswer(false)} style={{ flex:1, padding:'22px', borderRadius:18, border:'2px solid rgba(255,82,82,0.4)', background:'rgba(255,82,82,0.12)', color:'#FF5252', fontSize:18, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
           Different ✗
         </button>
       </div>
     )}
   </main>
 )

 // RESULT
 return (
   <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
     <div style={{ textAlign:'center' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Streak</div>
       <div style={{ fontSize:96, fontWeight:900, color:resultColor, letterSpacing:-2 }}>{finalStreak}</div>
       {worldRank && <div style={{ fontSize:16, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:8 }}>#{worldRank} in the world</div>}
     </div>
     {!profile?.name && !saved && (
       <AuthModal onSuccess={async (playerName) => {
           await supabase.from('nback_scores').insert({player_name: playerName, level: finalStreak})
           setSaved(true)
         }} title="Save your result" subtitle="Free · No email needed" />
     )}
     {saved && <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:16, padding:'16px 20px', textAlign:'center' }}><div style={{ fontSize:16, fontWeight:900, color:'#69F0AE' }}>✓ Score saved!</div></div>}
     <div style={{ display:'flex', gap:10, width:'100%' }}>
       <button onClick={reset} style={{ flex:1, padding:'16px', borderRadius:16, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
       <button onClick={()=>{setSaved(false);startGame()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:PURPLE, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${PURPLE}80` }}>Play again →</button>
     </div>
   </main>
 )
}
