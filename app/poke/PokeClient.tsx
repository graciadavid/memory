'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GOLD = '#C8960C'
const GREEN = '#2E7D32'


if (typeof window !== 'undefined') {
  ['aguacate','arroz','atun','cebolla','edamame','mango','pepino','salmon','zanahoria'].forEach(name => {
    const img = new Image()
    img.src = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/'+name+'.png'
  })
}

const INGREDIENTS = [
 { id: 'aguacate', label: 'Aguacate', icon: 'aguacate.png' },
 { id: 'arroz', label: 'Arroz', icon: 'arroz.png' },
 { id: 'atun', label: 'Atun', icon: 'atun.png' },
 { id: 'cebolla', label: 'Cebolla', icon: 'cebolla.png' },
 { id: 'edamame', label: 'Edamame', icon: 'edamame.png' },
 { id: 'mango', label: 'Mango', icon: 'mango.png' },
 { id: 'pepino', label: 'Pepino', icon: 'pepino.png' },
 { id: 'salmon', label: 'Salmon', icon: 'salmon.png' },
 { id: 'zanahoria', label: 'Zanahoria', icon: 'zanahoria.png' },
]

type Phase = 'rules' | 'show' | 'input' | 'result'

function shuffle<T>(arr: T[]): T[] {
 return [...arr].sort(() => Math.random() - 0.5)
}

export default function PokeClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [level, setLevel] = useState(1)
 const [bowl, setBowl] = useState<string[]>([])
 const [selected, setSelected] = useState<string[]>([])
 const [timeLeft, setTimeLeft] = useState(3)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('poke_scores').select('player_name, level').order('level', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:'Level '+l})))
   if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
 }, [profile?.name])

 useEffect(() => { loadData() }, [loadData])

 const startLevel = useCallback((lvl: number) => {
   const count = Math.min(3 + lvl, 9)
   const ingredients = shuffle(INGREDIENTS).slice(0, count).map(i => i.id)
   setBowl(ingredients)
   setSelected([])
   setLevel(lvl)
   setTimeLeft(3)
   setPhase('show')

   let t = 3
   const timer = setInterval(() => {
     t--
     setTimeLeft(t)
     if (t <= 0) {
       clearInterval(timer)
       setPhase('input')
     }
   }, 1000)
 }, [])

 const startGame = () => {
   startLevel(1)
   window.dispatchEvent(new Event('gameStart'))
 }

 const toggleIngredient = (id: string) => {
   setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
 }

 const handleSubmit = useCallback(async () => {
   const correct = bowl.every(i => selected.includes(i)) && selected.every(i => bowl.includes(i))
   if (correct) {
     startLevel(level + 1)
   } else {
     setPhase('result')
     window.dispatchEvent(new Event('gameResult'))
     const { count } = await supabase.from('poke_scores').select('player_name', { count: 'exact', head: true }).gt('level', level - 1)
     setWorldRank((count ?? 0) + 1)
     if (profile?.name && level > 1) await supabase.from('poke_scores').insert({ player_name: profile.name, level: level - 1 })
   }
 }, [bowl, selected, level, startLevel, profile?.name])

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen icon="salmon.png" title="Poke" subtitle="Remember the bowl ingredients" worldRecord={worldRecord} myBest={myBest !== null ? 'Level '+myBest : null} top5={top5} onPlay={startGame} />
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={'Level '+(level-1)}
     resultColor={(level-1) >= 6 ? '#00C853' : (level-1) >= 3 ? GOLD : '#D32F2F'}
     background={(level-1) >= 6 ? '#0D3320' : (level-1) >= 3 ? '#2D1A00' : '#1A0000'}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   />
 )

 if (phase === 'show') return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
       <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>Level {level}</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>POKE</div>
       <div style={{ fontSize:22, fontWeight:900, color: timeLeft <= 1 ? '#D32F2F' : 'rgba(255,255,255,0.5)' }}>{timeLeft}s</div>
     </div>

     <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:'0 24px 80px' }}>
       <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Remember these ingredients:</div>
       <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}>
         {bowl.map(id => {
           const ing = INGREDIENTS.find(i => i.id === id)!
           return (
             <div key={id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
               <img src={`${BASE}/${ing.icon}`} style={{ width:64, height:64, objectFit:'contain' }} />
               <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.6)' }}>{ing.label}</div>
             </div>
           )
         })}
       </div>
     </div>
   </main>
 )

 return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
       <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>Level {level}</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>POKE</div>
       <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>{selected.length} selected</div>
     </div>

     <div style={{ flex:1, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, padding:'8px 16px', overflowY:'auto' }}>
       {INGREDIENTS.map(ing => {
         const isSelected = selected.includes(ing.id)
         return (
           <div key={ing.id} onClick={() => toggleIngredient(ing.id)}
             style={{ background: isSelected ? 'rgba(46,125,50,0.3)' : '#252525', borderRadius:14, padding:'12px 8px', display:'flex', flexDirection:'column', alignItems:'center', gap:6, cursor:'pointer', border: isSelected ? '2px solid #2E7D32' : '2px solid transparent', transition:'all 0.15s' }}>
             <img src={`${BASE}/${ing.icon}`} style={{ width:48, height:48, objectFit:'contain' }} />
             <div style={{ fontSize:11, fontWeight:700, color: isSelected ? '#69F0AE' : 'rgba(255,255,255,0.5)' }}>{ing.label}</div>
           </div>
         )
       })}
     </div>

     <div style={{ padding:'12px 16px 80px', flexShrink:0 }}>
       <button onClick={handleSubmit} style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20' }}>
         Submit →
       </button>
     </div>
   </main>
 )
}
