'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

type Phase = 'rules' | 'countdown' | 'running' | 'result'

function fmt(ms: number) {
 return (ms / 1000).toFixed(3) + 's'
}

export default function StopClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [countdown, setCountdown] = useState(3)
 const [elapsed, setElapsed] = useState(0)
 const [difference, setDifference] = useState(0)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])
 const [saved, setSaved] = useState(false)
 const [champGame, setChampGame] = useState<string|null>(null)
 const [champRanking, setChampRanking] = useState<any[]>([])

 const startRef = useRef(0)
 const animRef = useRef(0)

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('precision_scores')
     .select('player_name, difference_ms').is('game_type', null)
     .order('difference_ms', { ascending: true }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
   const sorted = Object.entries(best).sort((a,b) => (a[1] as number)-(b[1] as number))
   setTop5(sorted.slice(0,5).map(([name,ms]) => ({name,ms})))
   if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])

   // Championship
   supabase.from('championship_weeks').select('game, sunday_date').eq('active', true).single()
     .then(({ data: cw }: any) => {
       if (!cw) return
       setChampGame(cw.game)
       if (cw.game !== 'stop') return
       const start = cw.sunday_date + 'T00:00:00Z'
       const end = cw.sunday_date + 'T23:59:59Z'
       supabase.from('precision_scores').select('player_name, difference_ms')
         .is('game_type', null).gte('created_at', start).lte('created_at', end)
         .then(({ data: scores }: any) => {
           if (!scores) return
           const b: Record<string,number> = {}
           scores.forEach((s:any) => { if (!b[s.player_name] || s.difference_ms < b[s.player_name]) b[s.player_name] = s.difference_ms })
           setChampRanking(Object.entries(b).sort((a,b) => (a[1] as number)-(b[1] as number)).slice(0,5).map(([name,ms]) => ({name,ms})))
         })
     })
 }, [profile?.name])

 useEffect(() => { loadData() }, [loadData])

 const startCountdown = () => {
   setPhase('countdown')
   setCountdown(3)
   let c = 3
   const t = setInterval(() => {
     c--
     setCountdown(c)
     if (c === 0) {
       clearInterval(t)
       startRef.current = Date.now()
       setPhase('running')
       const tick = () => {
         setElapsed(Date.now() - startRef.current)
         animRef.current = requestAnimationFrame(tick)
       }
       animRef.current = requestAnimationFrame(tick)
     }
   }, 1000)
 }

 const stopGame = useCallback(async () => {
   if (phase !== 'running') return
   cancelAnimationFrame(animRef.current)
   const diff = (Date.now() - startRef.current) - 5000
   setDifference(diff)
   setPhase('result')
   window.dispatchEvent(new Event('gameResult'))

   const absDiff = Math.abs(diff)
   const { count: rankCount } = await supabase.from('precision_scores')
     .select('*', { count: 'exact', head: true }).is('game_type', null).lt('difference_ms', absDiff)
   setWorldRank((rankCount ?? 0) + 1)

   if (profile?.name) {
     await supabase.from('precision_scores').insert({ player_name: profile.name, difference_ms: absDiff, game_type: null })
     setSaved(true)
     if (myBest === null || absDiff < myBest) setMyBest(absDiff)
   }
 }, [phase, profile?.name, myBest])

 useEffect(() => {
   return () => cancelAnimationFrame(animRef.current)
 }, [])

 const resultColor = Math.abs(difference) < 100 ? '#00C853' : Math.abs(difference) < 500 ? GOLD : '#D32F2F'
 const bgResult = Math.abs(difference) < 100 ? '#0D3320' : Math.abs(difference) < 500 ? '#2D1A00' : '#1A0000'

 if (phase === 'rules') return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'16px 16px 100px', overflowY:'auto' }}>
     <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
       <img src={`${BASE}/precision.png`} style={{ width:52, height:52, objectFit:'contain' }} />
       <div>
         <div style={{ fontSize:26, fontWeight:900, color:'#fff' }}>Stop</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Stop at exactly 5.000s</div>
       </div>
     </div>

     <div style={{ display:'flex', gap:10, marginBottom:16 }}>
       <div style={{ flex:1, background:'#252525', borderRadius:14, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
         <div style={{ fontSize:20, fontWeight:900, color:GOLD }}>{top5[0] ? `${top5[0].ms}ms` : '—'}</div>
         {top5[0] && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{top5[0].name}</div>}
       </div>
       <div style={{ flex:1, background:'#252525', borderRadius:14, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
         <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>{myBest !== null ? `${myBest}ms` : '—'}</div>
       </div>
     </div>

     <div style={{ background:'#252525', borderRadius:14, padding:'14px', marginBottom:16 }}>
       <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Top Players</div>
       {top5.map((p,i) => (
         <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
           <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
           <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
           <div style={{ fontSize:13, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.ms}ms</div>
         </div>
       ))}
     </div>

     {champGame === 'stop' && champRanking.length > 0 && (
       <div style={{ background:'#252525', borderRadius:14, padding:'14px', marginBottom:16, border:`1px solid ${GOLD}30` }}>
         <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>🏆 Championship Today</div>
         {champRanking.map((r,i) => (
           <div key={r.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
             <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>#{i+1}</div>
             <div style={{ flex:1, fontSize:13, fontWeight:800, color:'#fff' }}>{r.name}</div>
             <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{r.ms}ms</div>
           </div>
         ))}
       </div>
     )}

     <button onClick={startCountdown} style={{ width:'100%', padding:'20px', borderRadius:16, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 6px 0 #1B5E20', marginTop:'auto' }}>
       Play →
     </button>
   </main>
 )

 if (phase === 'countdown') return (
   <main style={{ height:'100dvh', background:'#1A1A1A', display:'flex', alignItems:'center', justifyContent:'center' }}>
     <div style={{ fontSize:160, fontWeight:900, color:'#fff' }}>{countdown}</div>
   </main>
 )

 if (phase === 'running') return (
   <main onClick={stopGame} style={{ height:'100dvh', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', gap:8, paddingBottom:80 }}>
     <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.25)', letterSpacing:3, textTransform:'uppercase' }}>Target</div>
     <div style={{ fontSize:80, fontWeight:900, color:'#00C853', fontVariantNumeric:'tabular-nums', letterSpacing:-2 }}>5.00</div>
     <div style={{ width:60, height:2, background:'rgba(255,255,255,0.1)', margin:'8px 0' }} />
     <div style={{ fontSize:80, fontWeight:900, color:'#fff', fontVariantNumeric:'tabular-nums', letterSpacing:-2 }}>{fmt(elapsed)}</div>
     <button onClick={stopGame} style={{ marginTop:32, width:160, height:160, borderRadius:'50%', border:'none', background:GREEN, color:'#fff', fontSize:26, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 10px 0 #1B5E20' }}>
       STOP
     </button>
     <div style={{ fontSize:13, color:'rgba(255,255,255,0.15)', fontWeight:700, marginTop:8 }}>or tap anywhere</div>
   </main>
 )

 return (
   <main style={{ minHeight:'100dvh', background:bgResult, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20 }}>
     <div style={{ textAlign:'center' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Difference from 5.000s</div>
       <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2 }}>
         {difference > 0 ? '+' : ''}{fmt(difference)}
       </div>
       {worldRank && <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:8 }}>#{worldRank} in the world</div>}
     </div>

     {saved && (
       <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:16, padding:'16px 20px', textAlign:'center' }}>
         <div style={{ fontSize:16, fontWeight:900, color:'#69F0AE' }}>✓ Score saved!</div>
         <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:4 }}>#{worldRank} in the world</div>
       </div>
     )}

     {!profile?.name && (
       <a href="/register" style={{ textDecoration:'none', display:'block', width:'100%' }}>
         <div style={{ background:'#D32F2F', borderRadius:16, padding:'16px', textAlign:'center' }}>
           <div style={{ fontSize:15, fontWeight:900, color:'#fff' }}>💾 Save your result</div>
           <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', fontWeight:700, marginTop:2 }}>Create your free profile →</div>
         </div>
       </a>
     )}

     <div style={{ display:'flex', gap:10, width:'100%' }}>
       <button onClick={() => { setPhase('rules'); setSaved(false); loadData() }} style={{ flex:1, padding:'16px', borderRadius:14, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
       <button onClick={() => { setSaved(false); startCountdown() }} style={{ flex:2, padding:'16px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E2080' }}>Play again →</button>
     </div>
   </main>
 )
}
