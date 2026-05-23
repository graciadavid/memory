'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const BLUE = '#1565C0'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

type Phase = 'rules' | 'playing' | 'result'

export default function PendulumPage() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [angle, setAngle] = useState(0)
 const [targetAngle, setTargetAngle] = useState(0)
 const [resultDeg, setResultDeg] = useState(0)
 const [worldRecord, setWorldRecord] = useState<{diff:number,name:string}|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<{name:string,diff:number}[]>([])
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [name, setName] = useState('')
 const [pin, setPin] = useState(['','','',''])
 const [saved, setSaved] = useState(false)
 const [saving, setSaving] = useState(false)
 const [saveError, setSaveError] = useState('')
 const animRef = useRef(0)
 const startTimeRef = useRef(0)
 const periodRef = useRef(3000) // pendulum period in ms

 useEffect(() => {
   if (profile?.name) setName(profile.name)
   loadData()
 }, [profile?.name])

 const loadData = async () => {
   const {data:all} = await supabase.from('precision_scores').select('player_name,difference_ms').eq('game_type','pendulum').order('difference_ms',{ascending:true}).limit(5000)
   if (!all) return
   const best:Record<string,number> = {}
   all.forEach((s:any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
   const sorted = Object.entries(best).map(([n,d]) => ({name:n, diff:d as number})).sort((a,b) => a.diff-b.diff)
   setTop5(sorted.slice(0,5))
   if (sorted[0]) setWorldRecord({diff:sorted[0].diff, name:sorted[0].name})
   if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
 }

 const startGame = () => {
   const target = Math.random() > 0.5 ? 90 : -90 // swing to left or right
   setTargetAngle(target)
   startTimeRef.current = performance.now()
   periodRef.current = 2000 + Math.random() * 1000
   setPhase('playing')
   const animate = () => {
     const elapsed = performance.now() - startTimeRef.current
     const a = Math.sin((elapsed / periodRef.current) * Math.PI * 2) * 80
     setAngle(a)
     animRef.current = requestAnimationFrame(animate)
   }
   animRef.current = requestAnimationFrame(animate)
 }

 const handleTap = useCallback(async () => {
   if (phase !== 'playing') return
   cancelAnimationFrame(animRef.current)
   const elapsed = performance.now() - startTimeRef.current
   const currentAngle = Math.sin((elapsed / periodRef.current) * Math.PI * 2) * 80
   const diff = Math.round(Math.abs(currentAngle) * 10) // in tenths of degree
   setResultDeg(diff)
   setPhase('result')
   if (profile?.name) {
     await supabase.from('precision_scores').insert({player_name:profile.name, difference_ms:diff, game_type:'pendulum'})
     const {count} = await supabase.from('precision_scores').select('*',{count:'exact',head:true}).eq('game_type','pendulum').lt('difference_ms',diff)
     setWorldRank((count??0)+1)
     if (myBest===null || diff<myBest) setMyBest(diff)
   }
 }, [phase, profile?.name, myBest])

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
   await supabase.from('precision_scores').insert({player_name:name.trim(), difference_ms:resultDeg, game_type:'pendulum'})
   const {count} = await supabase.from('precision_scores').select('*',{count:'exact',head:true}).eq('game_type','pendulum').lt('difference_ms',resultDeg)
   setWorldRank((count??0)+1)
   setSaving(false)
   setSaved(true)
   localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
   setTimeout(() => window.location.reload(), 1500)
 }

 const reset = () => {
   cancelAnimationFrame(animRef.current)
   setPhase('rules')
   setSaved(false)
   loadData()
 }

 const absDiff = resultDeg / 10
 const resultColor = absDiff < 5 ? '#00C853' : absDiff < 15 ? '#FF6F00' : '#D32F2F'
 const bgResult = absDiff < 5 ? '#0D3320' : absDiff < 15 ? '#2D1A00' : '#1A0000'

 // RULES
 if (phase === 'rules') return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
     <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
       <img src={`${BASE}/pendulum.png`} style={{ width:60, height:60, objectFit:'contain' }} />
       <div>
         <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Pendulum</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Tap when the pendulum is vertical</div>
       </div>
     </div>
     <div style={{ display:'flex', gap:10, marginBottom:20 }}>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
         <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${(worldRecord.diff/10).toFixed(1)}°` : '—'}</div>
         {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
       </div>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
         <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? `${(myBest/10).toFixed(1)}°` : '—'}</div>
       </div>
     </div>
     <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
       <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
       {top5.map((p,i) => (
         <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
           <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
           <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
           <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{(p.diff/10).toFixed(1)}°</div>
         </div>
       ))}
     </div>
     <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:BLUE, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${BLUE}80`, marginTop:'auto' }}>
       Play →
     </button>
   </main>
 )

 // PLAYING
 if (phase === 'playing') return (
   <main onClick={handleTap} style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', gap:24 }}>
     <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.25)', letterSpacing:3, textTransform:'uppercase' }}>Tap when vertical</div>
     <div style={{ position:'relative', width:240, height:220, display:'flex', alignItems:'flex-start', justifyContent:'center' }}>
       <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:1, height:190, background:'rgba(255,255,255,0.2)' }} />
       <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.35)' }}>0°</div>
       <div style={{ position:'absolute', top:0, left:'50%', width:3, height:160, background:'rgba(255,255,255,0.7)', transformOrigin:'top center', transform:`translateX(-50%) rotate(${angle}deg)`, transition:'none' }}>
         <div style={{ position:'absolute', bottom:-22, left:'50%', transform:'translateX(-50%)', width:44, height:44, borderRadius:'50%', background:BLUE, boxShadow:`0 0 20px ${BLUE}` }} />
       </div>
       <div style={{ position:'absolute', top:-6, left:'50%', width:14, height:14, borderRadius:'50%', background:'rgba(255,255,255,0.7)', transform:'translateX(-50%)' }} />
     </div>
     <div style={{ fontSize:13, color:'rgba(255,255,255,0.15)', fontWeight:700 }}>Tap anywhere</div>
   </main>
 )

 // RESULT
 return (
   <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
     <div style={{ textAlign:'center' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Angle from vertical</div>
       <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2 }}>{(resultDeg/10).toFixed(1)}°</div>
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
       <button onClick={()=>{setSaved(false);startGame()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:BLUE, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${BLUE}80` }}>Play again →</button>
     </div>
   </main>
 )
}
