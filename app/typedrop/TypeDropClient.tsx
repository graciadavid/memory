'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

type Phase = 'rules' | 'playing' | 'over'

const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const KEYBOARD = [
 ['Q','W','E','R','T','Y','U','I','O','P'],
 ['A','S','D','F','G','H','J','K','L'],
 ['Z','X','C','V','B','N','M','⌫'],
]

const WORDS_BY_LEVEL = [
 ['CAT','DOG','SUN','RUN','FLY','SKY','BOX','TOP','MAP','CUP','ARM','EAR','EGG','FAN','GUM','HAT','ICE','JAM','KEY','LAW'],
 ['FIRE','JUMP','LOVE','FAST','STAR','BLUE','RAIN','DARK','COOL','BIRD','BOLD','BURN','CALM','DARE','EARN','FACE','GAME','HAND','KEEN','LAMP'],
 ['BRAIN','SPEED','LIGHT','CLOUD','TIGER','FLASH','STONE','RIVER','NIGHT','SMILE','ANGLE','BRAVE','CHESS','DRIVE','EAGLE','FLAME','GRACE','HEART','KNIFE','LAYER'],
 ['ROCKET','PLANET','BRIDGE','SILVER','DRAGON','WINTER','SPRING','CASTLE','GARDEN','MONKEY','ANCHOR','CIRCLE','DANGER','ESCAPE','FLOWER','GLOBAL','HUNTER','JUNGLE','MIRROR','PALACE'],
 ['DIAMOND','THUNDER','RAINBOW','DOLPHIN','HORIZON','CRYSTAL','VOLCANO','WARRIOR','PHANTOM','ECLIPSE','BALANCE','CAPTAIN','FANTASY','GLACIER','HISTORY','IMAGINE','JOURNEY','KINGDOM','MYSTERY','TRIUMPH'],
]

function getWord(score: number) {
 const tier = Math.min(Math.floor(score / 5), 4)
 const pool = WORDS_BY_LEVEL[tier]
 return pool[Math.floor(Math.random() * pool.length)]
}

function getDuration(score: number) {
 return Math.max(2000, 8000 - score * 150)
}

export default function TypeDropClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [score, setScore] = useState(0)
 const [word, setWord] = useState('')
 const [typed, setTyped] = useState('')
 const [posY, setPosY] = useState(0)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])

 const animRef = useRef<any>(null)
 const startRef = useRef(0)
 const scoreRef = useRef(0)
 const wordRef = useRef('')
 const typedRef = useRef('')
 const profileRef = useRef<any>(null)

 useEffect(() => { profileRef.current = profile }, [profile])

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('typedrop_scores')
     .select('player_name, score').order('score', { ascending: false }).limit(200)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.score > best[s.player_name]) best[s.player_name] = s.score })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,s]) => ({name, score:`${s} words`})))
   const pName = profileRef.current?.name || JSON.parse(localStorage.getItem('memgenius_profile') || '{}').name
    if (pName && best[pName] !== undefined) setMyBest(best[pName])
 }, [profile?.name])

 useEffect(() => { loadData() }, [loadData])

 const spawnWord = useCallback((currentScore: number) => {
   const w = getWord(currentScore)
   const duration = getDuration(currentScore)
   wordRef.current = w
   typedRef.current = ''
   setWord(w)
   setTyped('')
   setPosY(0)
   startRef.current = Date.now()

   const animate = () => {
     const elapsed = Date.now() - startRef.current
     const progress = Math.min(elapsed / duration, 1)
     setPosY(progress * 100)
     if (progress >= 1) {
       const finalScore = scoreRef.current
       localStorage.setItem('typedrop_score', String(finalScore))
       setPhase('over')
       window.dispatchEvent(new Event('gameResult'))
       return
     }
     animRef.current = requestAnimationFrame(animate)
   }
   animRef.current = requestAnimationFrame(animate)
 }, [])

 useEffect(() => {
   if (phase !== 'over') return
   const s = parseInt(localStorage.getItem('typedrop_score') || '0')
   localStorage.removeItem('typedrop_score')
   supabase.from('typedrop_scores').select('*', { count: 'exact', head: true }).gt('score', s)
     .then(({ count }: any) => setWorldRank((count || 0) + 1))
   if (profileRef.current?.name && s > 0) {
     supabase.from('typedrop_scores').insert({ player_name: profileRef.current?.name, score: s }).then(() => loadData())
   }
   loadTop5()
 }, [phase, profile?.name])

 const loadTop5 = () => {
   supabase.from('typedrop_scores').select('player_name, score').order('score', { ascending: false }).limit(200)
     .then(({ data }: any) => {
       if (!data) return
       const best: Record<string,number> = {}
       data.forEach((s:any) => { if (!best[s.player_name] || s.score > best[s.player_name]) best[s.player_name] = s.score })
       const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
       setTop5(sorted.slice(0,5).map(([name,s]) => ({name, score:`${s} words`})))
     })
 }

 const startGame = () => {
   if (animRef.current) cancelAnimationFrame(animRef.current)
   scoreRef.current = 0
   setScore(0)
   setWorldRank(null)
   setPhase('playing')
   window.dispatchEvent(new Event('gameStart'))
   spawnWord(0)
 }

 const handleKey = useCallback((key: string) => {
   if (key === '⌫') {
     const newTyped = typedRef.current.slice(0, -1)
     typedRef.current = newTyped
     setTyped(newTyped)
     return
   }
   const newTyped = typedRef.current + key
   typedRef.current = newTyped
   setTyped(newTyped)
   if (newTyped === wordRef.current) {
     cancelAnimationFrame(animRef.current)
     const newScore = scoreRef.current + 1
     scoreRef.current = newScore
     setScore(newScore)
     spawnWord(newScore)
   }
 }, [spawnWord])

 useEffect(() => { return () => { if (animRef.current) cancelAnimationFrame(animRef.current) } }, [])

 const letterColors = word.split('').map((letter, i) => {
   if (i < typed.length) return typed[i] === letter ? '#69F0AE' : '#FF5252'
   return 'rgba(255,255,255,0.9)'
 })

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen
     icon="type.png"
     title="TypeDrop"
     subtitle="Type the word before it falls"
     worldRecord={worldRecord}
     myBest={myBest !== null ? `${myBest} words` : null}
     top5={top5}
     onPlay={startGame}
   />
 )

 if (phase === 'over') return (
   <GameResultScreen
     result={`${score}`}
     resultColor={score >= 20 ? '#00C853' : score >= 10 ? GOLD : '#D32F2F'}
     background={score >= 20 ? '#0D3320' : score >= 10 ? '#2D1A00' : '#1A0000'}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   >
     <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>words typed · last word: {word}</div>
   </GameResultScreen>
 )

 return (
   <main style={{ height:'calc(100dvh - 56px)', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 20px' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>SCORE</div>
       <div style={{ fontSize:24, fontWeight:900, color:GOLD }}>{score}</div>
     </div>

     <div style={{ flex:1, position:'relative', overflow:'hidden', background:'rgba(0,0,0,0.2)', margin:'0 8px', borderRadius:12 }}>
       <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:'rgba(255,82,82,0.6)' }} />
       <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', top:`${posY}%`, display:'flex', gap:3, whiteSpace:'nowrap' }}>
         {word.split('').map((letter, i) => (
           <span key={i} style={{ fontSize:38, fontWeight:900, color:letterColors[i], textShadow: posY > 75 ? '0 0 20px rgba(255,82,82,0.9)' : 'none', transition:'color 0.08s' }}>{letter}</span>
         ))}
       </div>
       <div style={{ position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)', fontSize:16, fontWeight:800, color:'rgba(255,255,255,0.3)', whiteSpace:'nowrap' }}>
         {typed || '...'}
       </div>
     </div>

     <div style={{ background:'#252525', padding:'6px 4px 8px' }}>
       {KEYBOARD.map((row, i) => (
         <div key={i} style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:4 }}>
           {row.map(k => (
             <button key={k} onPointerDown={(e) => { e.preventDefault(); handleKey(k) }}
               style={{ height:42, minWidth: k === '⌫' ? 48 : 32, borderRadius:8, border:'none', background:'rgba(255,255,255,0.12)', color:'#fff', fontSize: k.length > 1 ? 13 : 17, fontWeight:900, cursor:'pointer', fontFamily:'inherit', padding:'0 4px', userSelect:'none' }}>
               {k}
             </button>
           ))}
         </div>
       ))}
     </div>
   </main>
 )
}
