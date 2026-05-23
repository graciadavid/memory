'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const RED = '#E8002D'
const BLACK = '#1a1a1a'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

type Phase = 'rules' | 'lighting' | 'waiting' | 'go' | 'result' | 'jumpstart'

export default function F1Page() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [litCount, setLitCount] = useState(0)
 const [reactionMs, setReactionMs] = useState(0)
 const [worldRecord, setWorldRecord] = useState<{diff:number,name:string}|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<{name:string,diff:number}[]>([])
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [name, setName] = useState('')
 const [pin, setPin] = useState(['','','',''])
 const [saved, setSaved] = useState(false)
 const [saving, setSaving] = useState(false)
 const [saveError, setSaveError] = useState('')
 const goTimeRef = useRef(0)
 const timeoutRef = useRef<NodeJS.Timeout|null>(null)

 useEffect(() => {
   if (profile?.name) setName(profile.name)
   loadData()
 }, [profile?.name])

 const loadData = async () => {
   const {data:all} = await supabase.from('precision_scores').select('player_name,difference_ms').eq('game_type','formula1').order('difference_ms',{ascending:true}).limit(5000)
   if (!all) return
   const best:Record<string,number> = {}
   all.forEach((s:any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
   const sorted = Object.entries(best).map(([n,d]) => ({name:n, diff:d as number})).sort((a,b) => a.diff-b.diff)
   setTop5(sorted.slice(0,5))
   if (sorted[0]) setWorldRecord({diff:sorted[0].diff, name:sorted[0].name})
   if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
 }

 const startSequence = () => {
   setPhase('lighting')
   setLitCount(0)
   let count = 0
   const lightUp = () => {
     count++
     setLitCount(count)
     if (count < 5) {
       timeoutRef.current = setTimeout(lightUp, 800)
     } else {
       setPhase('waiting')
       const waitMs = 500 + Math.random() * 2500
       timeoutRef.current = setTimeout(() => { setPhase('go'); goTimeRef.current = Date.now() }, waitMs)
     }
   }
   timeoutRef.current = setTimeout(lightUp, 600)
 }

 const handlePress = useCallback(async () => {
   if (phase === 'lighting' || phase === 'waiting') {
     if (timeoutRef.current) clearTimeout(timeoutRef.current)
     setPhase('jumpstart')
     return
   }
   if (phase === 'go') {
     const reaction = Date.now() - goTimeRef.current
     setReactionMs(reaction)
     setPhase('result')
     if (profile?.name) {
       await supabase.from('precision_scores').insert({player_name:profile.name, difference_ms:reaction, game_type:'formula1'})
       const {count} = await supabase.from('precision_scores').select('*',{count:'exact',head:true}).eq('game_type','formula1').lt('difference_ms',reaction)
       setWorldRank((count??0)+1)
       if (myBest===null || reaction<myBest) setMyBest(reaction)
     }
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
   await supabase.from('precision_scores').insert({player_name:name.trim(), difference_ms:reactionMs, game_type:'formula1'})
   const {count} = await supabase.from('precision_scores').select('*',{count:'exact',head:true}).eq('game_type','formula1').lt('difference_ms',reactionMs)
   setWorldRank((count??0)+1)
   setSaving(false)
   setSaved(true)
   localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
   setTimeout(() => window.location.reload(), 1500)
 }

 const reset = () => {
   if (timeoutRef.current) clearTimeout(timeoutRef.current)
   setPhase('rules')
   setLitCount(0)
   setSaved(false)
   loadData()
 }

 const Semaphore = ({ lit }: { lit: boolean }) => (
   <div style={{ background: BLACK, borderRadius: 8, padding: '5px 4px', display: 'flex', flexDirection: 'column', gap: 4, border: '2px solid #333' }}>
     {[0,1,2].map(i => (
       <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: lit && i >= 1 ? RED : '#2a2a2a', boxShadow: lit && i >= 1 ? `0 0 10px ${RED}` : 'none', transition: 'all 0.15s' }} />
     ))}
   </div>
 )

 const resultColor = reactionMs < 200 ? '#00C853' : reactionMs < 300 ? '#FF6F00' : '#D32F2F'
 const bgResult = reactionMs < 200 ? '#0D3320' : reactionMs < 300 ? '#2D1A00' : '#1A0000'

 // RULES
 if (phase === 'rules') return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
     <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
       <img src={`${BASE}/f1.png`} style={{ width:60, height:60, objectFit:'contain' }} />
       <div>
         <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>F1 Reaction</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>React when the lights go out</div>
       </div>
     </div>
     <div style={{ display:'flex', gap:10, marginBottom:20 }}>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
         <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${worldRecord.diff}ms` : '—'}</div>
         {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
       </div>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
         <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? `${myBest}ms` : '—'}</div>
       </div>
     </div>
     <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
       <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
       {top5.map((p,i) => (
         <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
           <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
           <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
           <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.diff}ms</div>
         </div>
       ))}
     </div>
     <button onClick={startSequence} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:RED, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${RED}80`, marginTop:'auto' }}>
       Get Ready →
     </button>
   </main>
 )

 // JUMPSTART
 if (phase === 'jumpstart') return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, padding:'32px 24px' }}>
     <div style={{ fontSize:64 }}>🚩</div>
     <div style={{ fontSize:32, fontWeight:900, color:RED }}>Jump Start!</div>
     <div style={{ fontSize:15, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>You pressed too early</div>
     <button onClick={reset} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:RED, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${RED}80` }}>Try again →</button>
   </main>
 )

 // GAME
 if (phase === 'lighting' || phase === 'waiting' || phase === 'go') return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:60, padding:'40px 24px' }}>
     <div style={{ display:'flex', gap:6 }}>
       {[1,2,3,4,5].map(n => (
         <Semaphore key={n} lit={phase === 'waiting' ? true : phase === 'go' ? false : litCount >= n} />
       ))}
     </div>
     <button onClick={handlePress} style={{ width:'100%', padding:'24px', borderRadius:20, border:'none', background:phase==='go'?'#00C853':'rgba(255,255,255,0.08)', color:phase==='go'?'#fff':'rgba(255,255,255,0.3)', fontSize:22, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:phase==='go'?'0 8px 0 #00952080':'none', transition:'all 0.1s' }}>
       ACCELERATE
     </button>
   </main>
 )

 // RESULT
 return (
   <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
     <div style={{ textAlign:'center' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Reaction Time</div>
       <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2 }}>{reactionMs}ms</div>
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
       <button onClick={()=>{setSaved(false);startSequence()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:RED, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${RED}80` }}>Play again →</button>
     </div>
   </main>
 )
}
