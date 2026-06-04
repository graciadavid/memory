'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const GREEN = '#2E7D32'
const RED = '#D32F2F'

export default function Exactly5Page() {
 const [name, setName] = useState('')
 const [phase, setPhase] = useState<'intro'|'running'|'result'>('intro')
 const [elapsed, setElapsed] = useState(0)
 const [stopped, setStopped] = useState(0)
 const [diff, setDiff] = useState(0)
 const [myBests, setMyBests] = useState<number[]>([])
 const [lastTimes, setLastTimes] = useState<{name:string, diff:number, stopped:number}[]>([])
 const startRef = useRef(0)
 const rafRef = useRef(0)

 useEffect(() => {
   const stored = localStorage.getItem('exactly5_name')
   if (stored) setName(stored)
   loadLastTimes()
 }, [])

 const loadLastTimes = async () => {
   const { data } = await supabase
     .from('precision_scores')
     .select('player_name, difference_ms, created_at')
     .eq('game_type', 'exactly5')
     .order('created_at', { ascending: false })
     .limit(20)
   if (data) setLastTimes(data.map((d: any) => ({ name: d.player_name || 'anon', diff: d.difference_ms, stopped: 5000 + d.difference_ms })))
 }

 const startTimer = () => {
   if (!name.trim()) return
   localStorage.setItem('exactly5_name', name.trim())
   startRef.current = Date.now()
   setElapsed(0)
   setPhase('running')
   const tick = () => {
     setElapsed(Date.now() - startRef.current)
     rafRef.current = requestAnimationFrame(tick)
   }
   rafRef.current = requestAnimationFrame(tick)
 }

 const stopTimer = () => {
   if (phase !== 'running') return
   cancelAnimationFrame(rafRef.current)
   const ms = Date.now() - startRef.current
   const absDiff = Math.abs(ms - 5000)
   setStopped(ms)
   setDiff(absDiff)
   setMyBests(prev => [...prev, absDiff].sort((a,b) => a-b).slice(0,5))
   setPhase('result')
   supabase.from('precision_scores').insert({ player_name: name.trim(), difference_ms: absDiff, game_type: 'exactly5' })
   loadLastTimes()
 }

 const reset = () => {
   setPhase('intro')
   setElapsed(0)
 }

 return (
   <main style={{ minHeight:'100dvh', background:'#0a0a0a', fontFamily:'var(--font-nunito), sans-serif', color:'#fff', maxWidth:430, margin:'0 auto', padding:'24px 16px 40px' }}>

     {/* Header */}
     <div style={{ textAlign:'center', marginBottom:32 }}>
       <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:4, textTransform:'uppercase', marginBottom:8 }}>Can you stop at</div>
       <div style={{ fontSize:72, fontWeight:900, color:'#fff', lineHeight:1, letterSpacing:-2 }}>5.000</div>
       <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>seconds</div>
     </div>

     {/* Name input — only on intro */}
     {phase === 'intro' && (
       <div style={{ marginBottom:20 }}>
         <input
           value={name}
           onChange={e => setName(e.target.value)}
           onKeyDown={e => e.key === 'Enter' && startTimer()}
           placeholder="Your name"
           maxLength={20}
           style={{ width:'100%', padding:'16px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#1a1a1a', color:'#fff', fontSize:18, fontWeight:800, fontFamily:'inherit', outline:'none', boxSizing:'border-box', textAlign:'center' }}
         />
       </div>
     )}

     {/* Timer display */}
     <div style={{ textAlign:'center', marginBottom:24 }}>
       <div style={{ fontSize:80, fontWeight:900, color: phase === 'running' && elapsed > 4500 && elapsed < 5500 ? '#FFD700' : phase === 'result' ? (diff < 100 ? GREEN : diff < 300 ? '#FFD700' : RED) : 'rgba(255,255,255,0.15)', lineHeight:1, fontVariantNumeric:'tabular-nums', letterSpacing:-2, transition:'color 0.1s' }}>
         {phase === 'running'
           ? (elapsed/1000).toFixed(3)
           : phase === 'result'
           ? (stopped/1000).toFixed(3)
           : '0.000'}
       </div>
     </div>

     {/* Progress bar */}
     {phase === 'running' && (
       <div style={{ background:'#1a1a1a', borderRadius:8, height:8, marginBottom:24, overflow:'hidden' }}>
         <div style={{ height:'100%', borderRadius:8, background: elapsed < 5000 ? GREEN : RED, width:`${Math.min((elapsed/8000)*100,100)}%`, transition:'width 0.05s' }} />
       </div>
     )}

     {/* Result */}
     {phase === 'result' && (
       <div style={{ textAlign:'center', marginBottom:24 }}>
         <div style={{ fontSize:32, fontWeight:900, color: diff < 100 ? GREEN : diff < 300 ? '#FFD700' : RED, marginBottom:4 }}>
           {diff < 10 ? 'PERFECT!' : diff < 50 ? 'INCREDIBLE!' : diff < 100 ? 'AMAZING!' : diff < 200 ? 'GREAT!' : diff < 500 ? 'GOOD' : 'TRY AGAIN'}
         </div>
         <div style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>
           Off by <span style={{ color:'#fff', fontWeight:900 }}>{diff}ms</span>
         </div>
       </div>
     )}

     {/* START button */}
     {phase === 'intro' && (
       <button onClick={startTimer} disabled={!name.trim()}
         style={{ width:'100%', padding:'22px', borderRadius:16, border:'none', background: name.trim() ? GREEN : '#1a1a1a', color:'#fff', fontSize:22, fontWeight:900, fontFamily:'inherit', cursor: name.trim() ? 'pointer' : 'not-allowed', boxShadow: name.trim() ? '0 6px 0 #1B5E20' : 'none', marginBottom:8, letterSpacing:2 }}>
         START
       </button>
     )}

     {/* STOP button */}
     {phase === 'running' && (
       <button onClick={stopTimer}
         style={{ width:'100%', padding:'28px', borderRadius:16, border:'none', background:RED, color:'#fff', fontSize:28, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #B71C1C', letterSpacing:4 }}>
         STOP
       </button>
     )}

     {/* Try again */}
     {phase === 'result' && (
       <button onClick={reset}
         style={{ width:'100%', padding:'22px', borderRadius:16, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 6px 0 #1B5E20', marginBottom:24, letterSpacing:2 }}>
         TRY AGAIN
       </button>
     )}

     {/* Your best */}
     {myBests.length > 0 && (
       <div style={{ background:'#1a1a1a', borderRadius:14, padding:'14px 16px', marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
         <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase' }}>Your Best</div>
         <div style={{ fontSize:20, fontWeight:900, color:'#FFD700' }}>{myBests[0]}ms off</div>
       </div>
     )}

     {/* Two columns */}
     <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
       <div style={{ background:'#1a1a1a', borderRadius:14, padding:'14px' }}>
         <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Last Games</div>
         {lastTimes.slice(0,10).map((t, i) => (
           <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0', borderBottom: i < 9 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
             <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.6)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:60 }}>{t.name}</div>
             <div style={{ fontSize:12, fontWeight:900, color: t.diff < 100 ? GREEN : t.diff < 300 ? '#FFD700' : 'rgba(255,255,255,0.4)' }}>{t.diff}ms</div>
           </div>
         ))}
       </div>
       <div style={{ background:'#1a1a1a', borderRadius:14, padding:'14px' }}>
         <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Best Times</div>
         {[...lastTimes].sort((a,b) => a.diff - b.diff).slice(0,10).map((t, i) => (
           <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0', borderBottom: i < 9 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
             <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.6)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:60 }}>{t.name}</div>
             <div style={{ fontSize:12, fontWeight:900, color: i===0 ? '#FFD700' : t.diff < 100 ? GREEN : 'rgba(255,255,255,0.4)' }}>{t.diff}ms</div>
           </div>
         ))}
       </div>
     </div>

     {/* Footer */}
     <div style={{ textAlign:'center', marginTop:24, fontSize:12, color:'rgba(255,255,255,0.2)', fontWeight:700 }}>
       exactly5.com · a <a href="https://memgenius.com" style={{ color:'rgba(255,255,255,0.3)', textDecoration:'none' }}>MemGenius</a> game
     </div>

   </main>
 )
}
