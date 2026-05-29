'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const KEYBOARD = [
 ['Q','W','E','R','T','Y','U','I','O','P'],
 ['A','S','D','F','G','H','J','K','L'],
 ['⌫','Z','X','C','V','B','N','M','↵'],
]

const WORDS_BY_LEVEL = [
  ['CAT','DOG','SUN','RUN','FLY','SKY','BOX','TOP','MAP','CUP','ARM','EAR','EGG','FAN','GUM','HAT','ICE','JAM','KEY','LAW','MIX','NET','OAK','PAN','RAG','SAP','TAR','URN','VAN','WAX'],
  ['FIRE','JUMP','LOVE','FAST','STAR','BLUE','RAIN','DARK','COOL','BIRD','BOLD','BURN','CALM','DARE','EARN','FACE','GAME','HAND','IRIS','JEST','KEEN','LAMP','MIND','NOON','OPEN','PIPE','QUIT','RICE','SAFE','TAIL'],
  ['BRAIN','SPEED','LIGHT','CLOUD','TIGER','FLASH','STONE','RIVER','NIGHT','SMILE','ANGLE','BRAVE','CHESS','DRIVE','EAGLE','FLAME','GRACE','HEART','IMAGE','JUDGE','KNIFE','LAYER','MUSIC','NERVE','ORBIT','PLACE','QUIET','RIDER','SLOPE','TRACE'],
  ['ROCKET','PLANET','BRIDGE','SILVER','DRAGON','WINTER','SPRING','CASTLE','GARDEN','MONKEY','ANCHOR','BETTER','CIRCLE','DANGER','ESCAPE','FLOWER','GLOBAL','HUNTER','INSECT','JUNGLE','KITTEN','LOCKET','MIRROR','NATURE','OFFICE','PALACE','QUARTZ','RIDDLE','STREAM','TRAVEL'],
  ['DIAMOND','THUNDER','RAINBOW','DOLPHIN','HORIZON','CRYSTAL','VOLCANO','WARRIOR','PHANTOM','ECLIPSE','BALANCE','CAPTAIN','DEFENSE','ELEGANT','FANTASY','GLACIER','HISTORY','IMAGINE','JOURNEY','KINGDOM','LANTERN','MYSTERY','NETWORK','OPINION','PATTERN','QUANTUM','RETREAT','SILENCE','TRIUMPH','UNIVERSE'],
]

function getWord(score: number) {
 const tier = Math.min(Math.floor(score / 5), 4)
 const pool = WORDS_BY_LEVEL[tier]
 return pool[Math.floor(Math.random() * pool.length)]
}

function getDuration(score: number) {
 return Math.max(2000, 8000 - score * 150)
}

type Phase = 'idle' | 'playing' | 'over'

export default function TypeDropClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('idle')
 const [score, setScore] = useState(0)
 const [word, setWord] = useState('')
 const [typed, setTyped] = useState('')
 const [posY, setPosY] = useState(0)
 const [saved, setSaved] = useState(false)
 const [top5, setTop5] = useState<any[]>([])
 const [worldRecord, setWorldRecord] = useState<any>(null)
 const animRef = useRef<any>(null)
 const startRef = useRef<number>(0)
 const scoreRef = useRef(0)
 const wordRef = useRef('')
 const typedRef = useRef('')
 const durationRef = useRef(8000)

 useEffect(() => {
   supabase.from('typedrop_scores').select('player_name, score').order('score', { ascending: false }).limit(200)
     .then(({ data }) => {
       if (!data) return
       const best: Record<string, number> = {}
       data.forEach((s: any) => { if (!best[s.player_name] || s.score > best[s.player_name]) best[s.player_name] = s.score })
       const sorted = Object.entries(best).sort((a, b) => b[1] - a[1]).slice(0, 5)
       setTop5(sorted.map(([name, score]) => ({ name, score })))
       if (sorted.length > 0) setWorldRecord({ name: sorted[0][0], score: sorted[0][1] })
     })
 }, [])

 const spawnWord = useCallback((currentScore: number) => {
   const w = getWord(currentScore)
   const duration = getDuration(currentScore)
   wordRef.current = w
   typedRef.current = ''
   durationRef.current = duration
   setWord(w)
   setTyped('')
   setPosY(0)
   startRef.current = Date.now()

   const animate = () => {
     const elapsed = Date.now() - startRef.current
     const progress = Math.min(elapsed / duration, 1)
     setPosY(progress * 100)
     if (progress >= 1) {
       setPhase('over')
       window.dispatchEvent(new Event('gameResult'))
      if (profile?.name) {
        supabase.from('typedrop_scores').insert({ player_name: profile.name, score: scoreRef.current })
        setSaved(true)
      }
       return
     }
     animRef.current = requestAnimationFrame(animate)
   }
   animRef.current = requestAnimationFrame(animate)
 }, [])

 const startGame = () => {
   if (animRef.current) cancelAnimationFrame(animRef.current)
   scoreRef.current = 0
   setScore(0)
   setSaved(false)
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
   if (key === '↵') return
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

 useEffect(() => {
   return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
 }, [])

 const letterColors = word.split('').map((letter, i) => {
   if (i < typed.length) return typed[i] === letter ? '#69F0AE' : '#FF5252'
   return 'rgba(255,255,255,0.9)'
 })

 const danger = posY > 75

 // IDLE
 if (phase === 'idle') return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px', display:'flex', flexDirection:'column' }}>
     <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
       <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/type.png" style={{ width:60, height:60, objectFit:'contain' }} />
       <div>
         <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>TypeDrop</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Type the word before it falls</div>
       </div>
     </div>

     <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:'14px', marginBottom:20 }}>
       <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:700, lineHeight:1.8 }}>
         A word falls from the top.<br/>
         Type it before it hits the bottom.<br/>
         <span style={{ color:GREEN, fontWeight:900 }}>Each word gets faster.</span>
       </div>
     </div>

     <div style={{ display:'flex', gap:10, marginBottom:20 }}>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
         <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? worldRecord.score : '—'}</div>
         {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
       </div>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
         <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{profile?.name && top5.find(t => t.name === profile.name) ? top5.find(t => t.name === profile.name)!.score : '—'}</div>
       </div>
     </div>

     <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
       <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
       {top5.map((p, i) => (
         <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
           <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
           <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
           <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.score}</div>
         </div>
       ))}
     </div>

     <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080',  }}>
       Play →
     </button>
   </main>
 )

 // GAME OVER
 if (phase === 'over') return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px', textAlign:'center' }}>
     <div style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:4 }}>Game Over</div>
     <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>The word was <span style={{ color:'#fff', fontWeight:900 }}>{word}</span></div>
     <div style={{ fontSize:64, fontWeight:900, color:GOLD, marginBottom:24 }}>{score}</div>

     {profile?.name && !saved && (
       <button onClick={async () => {
         await supabase.from('typedrop_scores').insert({ player_name: profile.name, score })
         setSaved(true)
       }} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:12 }}>
         Save Score
       </button>
     )}
     {saved && <div style={{ fontSize:13, color:'#69F0AE', fontWeight:800, marginBottom:12 }}>✓ Saved!</div>}

     <div style={{ display:'flex', gap:10 }}>
       <a href="/agility" style={{ flex:1, textDecoration:'none', display:'block', padding:'14px', borderRadius:14, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', fontSize:14, fontWeight:900, textAlign:'center' }}>← Agility</a>
       <button onClick={startGame} style={{ flex:2, padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Play Again →</button>
     </div>
   </main>
 )

 // PLAYING
 return (
   <main style={{ height:'calc(100dvh - 100px)', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', overflow:'hidden', touchAction:'none' }}>

     {/* Score */}
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 20px' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>SCORE</div>
       <div style={{ fontSize:24, fontWeight:900, color:GOLD }}>{score}</div>
     </div>

     {/* Fall area */}
     <div style={{ flex:1, position:'relative', overflow:'hidden', background:'rgba(0,0,0,0.2)', borderRadius:'12px 12px 0 0', margin:'0 8px', flexShrink:0 }}>
       {/* Danger line */}
       <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:'rgba(255,82,82,0.6)' }} />

       {/* Falling word */}
       <div style={{
         position:'absolute',
         left:'50%',
         transform:'translateX(-50%)',
         top:`${posY}%`,
         display:'flex',
         gap:3,
         whiteSpace:'nowrap',
       }}>
         {word.split('').map((letter, i) => (
           <span key={i} style={{
             fontSize: 38,
             fontWeight: 900,
             color: letterColors[i],
             textShadow: danger ? '0 0 20px rgba(255,82,82,0.9)' : 'none',
             transition:'color 0.08s',
           }}>{letter}</span>
         ))}
       </div>

       {/* Typed so far */}
       <div style={{ position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)', fontSize:16, fontWeight:800, color:'rgba(255,255,255,0.3)', whiteSpace:'nowrap' }}>
         {typed || '...'}
       </div>
     </div>

     {/* Keyboard */}
     <div style={{ background:'#2a2a2c', padding:'8px 4px 80px', marginTop:'auto' }}>
       {KEYBOARD.map((row, i) => (
         <div key={i} style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:4 }}>
           {row.map(k => (
             <button key={k} onPointerDown={(e) => { e.preventDefault(); handleKey(k) }}
               style={{
                 height: 44,
                 minWidth: k === '⌫' || k === '↵' ? 48 : 32,
                 borderRadius: 8,
                 border: 'none',
                 background: 'rgba(255,255,255,0.12)',
                 color: '#fff',
                 fontSize: k.length > 1 ? 13 : 17,
                 fontWeight: 900,
                 cursor: 'pointer',
                 fontFamily: 'inherit',
                 padding: '0 4px',
                 userSelect: 'none',
               }}>
               {k}
             </button>
           ))}
         </div>
       ))}
     </div>
   </main>
 )
}
