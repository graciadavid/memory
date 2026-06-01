'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

type Phase = 'rules' | 'playing' | 'result'

const GREEN = '#2E7D32'
const GOLD = '#C8960C'
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

interface FallingLetter {
 id: number
 char: string
 x: number
 y: number
 speed: number
 isTarget: boolean
}

export default function LetterRainClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [target, setTarget] = useState('A')
 const [letters, setLetters] = useState<FallingLetter[]>([])
 const [userCount, setUserCount] = useState(0)
 const [correctCount, setCorrectCount] = useState(0)
 const [level, setLevel] = useState(1)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])
 const [timeLeft, setTimeLeft] = useState(30)
 const [wrong, setWrong] = useState(false)

 const idRef = useRef(0)
 const intervalRef = useRef<any>(null)
 const timerRef = useRef<any>(null)
 const animRef = useRef<any>(null)
 const levelRef = useRef(1)

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('letter_rain_scores')
     .select('player_name, level').order('level', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:`Level ${l}`})))
   if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
 }, [profile?.name])

 useEffect(() => { loadData() }, [loadData])

 const endGame = useCallback(async (finalLevel: number) => {
   clearInterval(intervalRef.current)
   clearInterval(timerRef.current)
   cancelAnimationFrame(animRef.current)
   setPhase('result')
   window.dispatchEvent(new Event('gameResult'))

   const { count } = await supabase.from('letter_rain_scores')
     .select('player_name', { count: 'exact', head: true }).gt('level', finalLevel)
   setWorldRank((count ?? 0) + 1)

   if (profile?.name) {
     await supabase.from('letter_rain_scores').insert({ player_name: profile.name, level: finalLevel })
   }
 }, [profile?.name])

 const startGame = () => {
   levelRef.current = 1
   setLevel(1)
   setLetters([])
   setUserCount(0)
   setTimeLeft(30)
   setWrong(false)
   const t = LETTERS[Math.floor(Math.random() * 26)]
   setTarget(t)
   setPhase('playing')
   window.dispatchEvent(new Event('gameStart'))

   let correct = 0
   // Spawn letters
   intervalRef.current = setInterval(() => {
     const isTarget = Math.random() < 0.3
     const char = isTarget ? t : LETTERS.replace(t, '')[Math.floor(Math.random() * 25)]
     if (isTarget) correct++
     setCorrectCount(correct)
     setLetters(prev => [...prev, {
       id: idRef.current++,
       char,
       x: Math.random() * 80 + 10,
       y: 0,
       speed: 0.5 + Math.random() * 0.5,
       isTarget,
     }])
   }, 600)

   // Timer
   let t2 = 30
   timerRef.current = setInterval(() => {
     t2--
     setTimeLeft(t2)
     if (t2 <= 0) {
       clearInterval(timerRef.current)
       clearInterval(intervalRef.current)
       endGame(levelRef.current)
     }
   }, 1000)

   // Animate
   const animate = () => {
     setLetters(prev => prev
       .map(l => ({ ...l, y: l.y + l.speed }))
       .filter(l => l.y < 110)
     )
     animRef.current = requestAnimationFrame(animate)
   }
   animRef.current = requestAnimationFrame(animate)
 }

 const handleSubmit = () => {
   if (userCount === correctCount) {
     levelRef.current += 1
     setLevel(l => l + 1)
     setUserCount(0)
     setCorrectCount(0)
     setWrong(false)
     const newTarget = LETTERS[Math.floor(Math.random() * 26)]
     setTarget(newTarget)
   } else {
     setWrong(true)
     setTimeout(() => setWrong(false), 500)
   }
 }

 useEffect(() => {
   return () => {
     clearInterval(intervalRef.current)
     clearInterval(timerRef.current)
     cancelAnimationFrame(animRef.current)
   }
 }, [])

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen
     icon="rain.png"
     title="Letter Rain"
     subtitle="Count the target letter as it falls"
     worldRecord={worldRecord}
     myBest={myBest !== null ? `Level ${myBest}` : null}
     top5={top5}
     onPlay={startGame}
   />
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={`Level ${level}`}
     resultColor={level >= 5 ? '#00C853' : level >= 3 ? GOLD : '#D32F2F'}
     background={level >= 5 ? '#0D3320' : level >= 3 ? '#2D1A00' : '#1A0000'}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   />
 )

 return (
   <main style={{ height:'100dvh', background:'#1A1A1A', display:'flex', flexDirection:'column', fontFamily:'var(--font-nunito),sans-serif', overflow:'hidden', paddingBottom:80 }}>
     
     {/* Header */}
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>LEVEL {level}</div>
       <div style={{ fontSize:32, fontWeight:900, color:GOLD }}>{target}</div>
       <div style={{ fontSize:14, fontWeight:800, color: timeLeft < 10 ? '#D32F2F' : 'rgba(255,255,255,0.5)' }}>{timeLeft}s</div>
     </div>

     {/* Fall area */}
     <div style={{ flex:1, position:'relative', overflow:'hidden', background:'rgba(0,0,0,0.2)', margin:'0 8px', borderRadius:12 }}>
       {letters.map(l => (
         <div key={l.id} style={{
           position:'absolute',
           left:`${l.x}%`,
           top:`${l.y}%`,
           fontSize:24,
           fontWeight:900,
           color: l.isTarget ? '#69F0AE' : 'rgba(255,255,255,0.4)',
           transform:'translateX(-50%)',
         }}>{l.char}</div>
       ))}
     </div>

     {/* Counter */}
     <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'center', gap:20 }}>
       <button onClick={() => setUserCount(c => Math.max(0, c-1))} style={{ width:48, height:48, borderRadius:12, border:'none', background:'#252525', color:'#fff', fontSize:24, fontWeight:900, cursor:'pointer' }}>−</button>
       <div style={{ fontSize:40, fontWeight:900, color: wrong ? '#D32F2F' : '#fff', minWidth:60, textAlign:'center' }}>{userCount}</div>
       <button onClick={() => setUserCount(c => c+1)} style={{ width:48, height:48, borderRadius:12, border:'none', background:'#252525', color:'#fff', fontSize:24, fontWeight:900, cursor:'pointer' }}>+</button>
     </div>

     <div style={{ padding:'0 20px 12px' }}>
       <button onClick={handleSubmit} style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 4px 0 #1B5E20' }}>
         Submit →
       </button>
     </div>
   </main>
 )
}
