'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

type Phase = 'rules' | 'playing' | 'result'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const COLORS = [
 { bg: '#D32F2F', glow: '#FF525260' },
 { bg: '#1565C0', glow: '#448AFF60' },
 { bg: '#2E7D32', glow: '#69F0AE60' },
 { bg: '#F57F17', glow: '#FFD74060' },
 { bg: '#6A1B9A', glow: '#CE93D860' },
 { bg: '#00838F', glow: '#80DEEA60' },
]

export default function NBackClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [n, setN] = useState(1)
 const [colorIdx, setColorIdx] = useState<number|null>(null)
 const [step, setStep] = useState<'showing'|'answering'>('showing')
 const [correct, setCorrect] = useState(0)
 const [wrong, setWrong] = useState(0)
 const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])

 const timerRef = useRef<any>(null)
 const seqRef = useRef<number[]>([])
 const nRef = useRef(1)
 const correctRef = useRef(0)
 const wrongRef = useRef(0)
 const answeredRef = useRef(false)

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('nback_scores').select('player_name, level').order('level', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:'N-'+l})))
   if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
 }, [profile?.name])

 useEffect(() => { loadData() }, [loadData])

 const endGame = useCallback(async () => {
   clearTimeout(timerRef.current)
   const finalLevel = nRef.current
   setPhase('result')
   window.dispatchEvent(new Event('gameResult'))
   const { count } = await supabase.from('nback_scores').select('player_name', { count: 'exact', head: true }).gt('level', finalLevel)
   setWorldRank((count ?? 0) + 1)
   if (profile?.name && finalLevel > 0) await supabase.from('nback_scores').insert({ player_name: profile.name, level: finalLevel })
 }, [profile?.name])

 const nextTurn = useCallback(() => {
   const newColor = Math.floor(Math.random() * COLORS.length)
   seqRef.current = [...seqRef.current, newColor]
   answeredRef.current = false
   setColorIdx(newColor)
   setStep('showing')
   setFeedback(null)

   // Show for 1 second then ask
   timerRef.current = setTimeout(() => {
     setColorIdx(null)
     const idx = seqRef.current.length - 1
     if (idx >= nRef.current) {
       setStep('answering')
     } else {
       // First N turns — no answer needed
       timerRef.current = setTimeout(nextTurn, 500)
     }
   }, 1000)
 }, [])

 const startGame = () => {
   seqRef.current = []
   correctRef.current = 0
   wrongRef.current = 0
   nRef.current = 1
   setN(1); setCorrect(0); setWrong(0); setFeedback(null)
   setStep('showing'); setColorIdx(null)
   setPhase('playing')
   window.dispatchEvent(new Event('gameStart'))
   nextTurn()
 }

 const handleAnswer = useCallback((userSaysMatch: boolean) => {
   if (step !== 'answering' || answeredRef.current) return
   answeredRef.current = true

   const idx = seqRef.current.length - 1
   const isMatch = seqRef.current[idx] === seqRef.current[idx - nRef.current]
   const isCorrect = userSaysMatch === isMatch

   if (isCorrect) {
     correctRef.current++
     setCorrect(correctRef.current)
     setFeedback('correct')
     if (correctRef.current % 5 === 0) {
       nRef.current = Math.min(nRef.current + 1, 8)
       setN(nRef.current)
       correctRef.current = 0
       setCorrect(0)
     }
     timerRef.current = setTimeout(nextTurn, 500)
   } else {
     wrongRef.current++
     setWrong(wrongRef.current)
     setFeedback('wrong')
     if (wrongRef.current >= 3) {
       timerRef.current = setTimeout(endGame, 800)
     } else {
       timerRef.current = setTimeout(nextTurn, 500)
     }
   }
 }, [step, nextTurn, endGame])

 useEffect(() => { return () => clearTimeout(timerRef.current) }, [])

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null
 const isAnswering = step === 'answering'

 if (phase === 'rules') return (
   <GameRulesScreen icon="nback.png" title="N-Back" subtitle="Does this match the color from N turns ago?" worldRecord={worldRecord} myBest={myBest !== null ? 'N-'+myBest : null} top5={top5} onPlay={startGame} />
 )

 if (phase === 'result') return (
   <GameResultScreen 
     result={'N-'+n} 
     resultColor={n >= 4 ? '#00C853' : n >= 2 ? GOLD : '#D32F2F'} 
     background={n >= 4 ? '#0D3320' : n >= 2 ? '#2D1A00' : '#1A0000'} 
     worldRank={worldRank} 
     hasProfile={!!profile?.name} 
     onBack={() => { setPhase('rules'); loadData() }} 
     onPlayAgain={startGame}
   >
     <div style={{ fontSize:16, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{correct} correct · {wrong} wrong</div>
   </GameResultScreen>
 )

 return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>

     {/* Header */}
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
       <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>N-{n}</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>N-BACK</div>
       <div style={{ display:'flex', gap:12, alignItems:'center' }}>
         <div style={{ fontSize:18, fontWeight:900, color:'#00C853' }}>✓{correct}</div>
         <div style={{ fontSize:18, fontWeight:900, color:'#D32F2F' }}>✗{wrong}</div>
       </div>
     </div>

     {/* Color square */}
     <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, padding:'0 24px' }}>
       <div style={{ 
         width:200, height:200, borderRadius:32, 
         background: colorIdx !== null ? COLORS[colorIdx].bg : '#252525', 
         transition:'all 0.2s', 
         boxShadow: colorIdx !== null ? '0 0 80px '+COLORS[colorIdx].glow : 'none' 
       }} />

       <div style={{ fontSize:16, fontWeight:700, color:'rgba(255,255,255,0.3)', height:24, textAlign:'center' }}>
         {colorIdx !== null && seqRef.current.length <= nRef.current ? 'Just watch...' : ''}
         {colorIdx !== null && seqRef.current.length > nRef.current ? 'Remember this...' : ''}
         {colorIdx === null && isAnswering ? 'Same as '+n+' turn'+(n>1?'s':'')+' ago?' : ''}
       </div>

       {feedback && (
         <div style={{ fontSize:28, fontWeight:900, color: feedback === 'correct' ? '#00C853' : '#D32F2F' }}>
           {feedback === 'correct' ? '✓ Correct!' : '✗ Wrong!'}
         </div>
       )}
     </div>

     {/* Buttons */}
     <div style={{ display:'flex', gap:12, padding:'16px 20px 80px', flexShrink:0 }}>
       <button onPointerDown={() => handleAnswer(false)} disabled={!isAnswering}
         style={{ flex:1, height:72, borderRadius:16, border:'none', background: isAnswering ? '#D32F2F' : '#252525', color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor: isAnswering ? 'pointer' : 'default', opacity: isAnswering ? 1 : 0.3, boxShadow: isAnswering ? '0 6px 0 #B71C1C' : 'none', transition:'all 0.2s' }}>
         No Match
       </button>
       <button onPointerDown={() => handleAnswer(true)} disabled={!isAnswering}
         style={{ flex:1, height:72, borderRadius:16, border:'none', background: isAnswering ? GREEN : '#252525', color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor: isAnswering ? 'pointer' : 'default', opacity: isAnswering ? 1 : 0.3, boxShadow: isAnswering ? '0 6px 0 #1B5E20' : 'none', transition:'all 0.2s' }}>
         Match ✓
       </button>
     </div>
   </main>
 )
}
