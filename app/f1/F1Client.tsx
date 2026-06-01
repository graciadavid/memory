'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

type Phase = 'rules' | 'sequence' | 'ready' | 'result' | 'toosoon'

const GREEN = '#2E7D32'

export default function F1Client() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [lightsOn, setLightsOn] = useState(0)
 const [reactionMs, setReactionMs] = useState(0)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])

 const startRef = useRef(0)
 const timerRef = useRef<any>(null)

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('precision_scores')
     .select('player_name, difference_ms').eq('game_type', 'formula1')
     .order('difference_ms', { ascending: true }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
   const sorted = Object.entries(best).sort((a,b) => (a[1] as number)-(b[1] as number))
   setTop5(sorted.slice(0,5).map(([name,ms]) => ({name, score:`${ms}ms`})))
   if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
 }, [profile?.name])

 useEffect(() => { loadData() }, [loadData])
 useEffect(() => { return () => clearTimeout(timerRef.current) }, [])

 const startGame = () => {
   setLightsOn(0)
   setPhase('sequence')
   let count = 0
   const interval = setInterval(() => {
     count++
     setLightsOn(count)
     if (count === 5) {
       clearInterval(interval)
       const delay = 500 + Math.random() * 2500
       timerRef.current = setTimeout(() => {
         setLightsOn(0)
         startRef.current = Date.now()
         setPhase('ready')
       }, delay)
     }
   }, 800)
 }

 const handleAccelerate = useCallback(async () => {
   if (phase === 'sequence') {
     clearTimeout(timerRef.current)
     setPhase('toosoon')
     return
   }
   if (phase !== 'ready') return
   const reaction = Date.now() - startRef.current
   setReactionMs(reaction)
   setPhase('result')
   window.dispatchEvent(new Event('gameResult'))

   const { count } = await supabase.from('precision_scores')
     .select('player_name', { count: 'exact', head: true }).eq('game_type', 'formula1').lt('difference_ms', reaction)
   setWorldRank((count ?? 0) + 1)

   if (profile?.name) {
     await supabase.from('precision_scores').insert({ player_name: profile.name, difference_ms: reaction, game_type: 'formula1' })
   }
 }, [phase, profile?.name])

 const resultColor = reactionMs < 200 ? '#00C853' : reactionMs < 300 ? '#C8960C' : '#D32F2F'
 const bgResult = reactionMs < 200 ? '#0D3320' : reactionMs < 300 ? '#2D1A00' : '#1A0000'
 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen
     icon="f1.png"
     title="F1 Reaction"
     subtitle="React the moment the lights go out"
     worldRecord={worldRecord}
     myBest={myBest !== null ? `${myBest}ms` : null}
     top5={top5}
     onPlay={startGame}
   />
 )

 if (phase === 'toosoon') return (
   <main style={{ height:'100dvh', background:'#1A0000', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, paddingBottom:80, fontFamily:'var(--font-nunito),sans-serif' }}>
     <div style={{ display:'flex', gap:12 }}>
       {[0,1,2,3,4].map(i => (
         <div key={i} style={{ width:44, height:44, borderRadius:'50%', background:'#D32F2F', boxShadow:'0 0 20px rgba(211,47,47,0.6)' }} />
       ))}
     </div>
     <div style={{ fontSize:36, fontWeight:900, color:'#D32F2F' }}>Too soon!</div>
     <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Wait for the lights to go out</div>
     <button onClick={startGame} style={{ padding:'16px 32px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Try again →</button>
   </main>
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={`${reactionMs}ms`}
     resultColor={resultColor}
     background={bgResult}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   />
 )

 return (
   <main style={{ height:'100dvh', background:'#111', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:32, paddingBottom:80, fontFamily:'var(--font-nunito),sans-serif' }}>
     <div style={{ display:'flex', gap:16 }}>
       {[1,2,3,4,5].map(i => {
         const isOn = i <= lightsOn
         return (
           <div key={i} style={{
             width:52, height:52, borderRadius:'50%',
             background: isOn ? '#D32F2F' : '#1a1a1a',
             border:'3px solid #333',
             boxShadow: isOn ? '0 0 24px rgba(211,47,47,0.9)' : 'none',
             transition:'all 0.15s',
           }} />
         )
       })}
     </div>
     <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.3)' }}>
       {phase === 'sequence' ? 'Wait...' : 'TAP NOW!'}
     </div>
     <button onPointerDown={handleAccelerate} style={{
       width:200, height:200, borderRadius:'50%', border:'none',
       background: phase === 'ready' ? GREEN : '#252525',
       color:'#fff', fontSize:22, fontWeight:900,
       fontFamily:'inherit', cursor:'pointer',
       boxShadow: phase === 'ready' ? '0 10px 0 #1B5E20' : '0 6px 0 #111',
       transition:'all 0.15s', userSelect:'none',
     }}>
       ACCELERATE
     </button>
   </main>
 )
}
