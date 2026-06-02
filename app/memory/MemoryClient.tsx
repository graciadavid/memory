'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GOLD = '#C8960C'
const GREEN = '#2E7D32'


// Preload all brain images
if (typeof window !== 'undefined') {
 ['brain-blue','brain-green','brain-light','brain-red','brain-white','brain-yellow'].forEach(name => {
   const img = new Image()
   img.src = BASE+'/'+name+'.png'
 })
}

const BRAINS = [
 'brain-blue.png',
 'brain-green.png',
 'brain-light.png',
 'brain-red.png',
 'brain-white.png',
 'brain-yellow.png',
]

interface Card {
 id: number
 image: string
 flipped: boolean
 matched: boolean
}

type Phase = 'rules' | 'playing' | 'result'

function shuffle<T>(arr: T[]): T[] {
 return [...arr].sort(() => Math.random() - 0.5)
}

function fmt(ms: number) {
 const s = Math.floor(ms / 1000)
 const m = Math.floor(s / 60)
 return m > 0 ? m+'m '+(s%60)+'s' : s+'s'
}

export default function MemoryClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [cards, setCards] = useState<Card[]>([])
 const [selected, setSelected] = useState<number[]>([])
 const [moves, setMoves] = useState(0)
 const [timeMs, setTimeMs] = useState(0)
 const [startTime, setStartTime] = useState(0)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])
 const [locked, setLocked] = useState(false)

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('scores').select('player_name, time_ms').order('time_ms', { ascending: true }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
   const sorted = Object.entries(best).sort((a,b) => (a[1] as number)-(b[1] as number))
   setTop5(sorted.slice(0,5).map(([name,t]) => ({name, score:fmt(t as number)})))
   if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
 }, [profile?.name])

 useEffect(() => { loadData() }, [loadData])

 const startGame = () => {
   const pairs = [...BRAINS, ...BRAINS]
   const shuffled = shuffle(pairs)
   setCards(shuffled.map((img, i) => ({ id: i, image: img, flipped: false, matched: false })))
   setSelected([])
   setMoves(0)
   setTimeMs(0)
   setLocked(false)
   setStartTime(Date.now())
   setPhase('playing')
   window.dispatchEvent(new Event('gameStart'))
 }

 useEffect(() => {
   if (phase !== 'playing') return
   const t = setInterval(() => setTimeMs(Date.now() - startTime), 100)
   return () => clearInterval(t)
 }, [phase, startTime])

 const handleCard = useCallback(async (idx: number) => {
   if (locked || cards[idx].flipped || cards[idx].matched) return
   const newCards = [...cards]
   newCards[idx] = { ...newCards[idx], flipped: true }
   setCards(newCards)

   const newSelected = [...selected, idx]
   setSelected(newSelected)

   if (newSelected.length === 2) {
     setMoves(m => m + 1)
     setLocked(true)
     const [a, b] = newSelected
     if (newCards[a].image === newCards[b].image) {
       newCards[a] = { ...newCards[a], matched: true }
       newCards[b] = { ...newCards[b], matched: true }
       setCards([...newCards])
       setSelected([])
       setLocked(false)
       if (newCards.every(c => c.matched)) {
         const elapsed = Date.now() - startTime
         setTimeMs(elapsed)
         setPhase('result')
         window.dispatchEvent(new Event('gameResult'))
         const { count } = await supabase.from('scores').select('player_name', { count: 'exact', head: true }).lt('time_ms', elapsed)
         setWorldRank((count ?? 0) + 1)
         if (profile?.name) { await supabase.from('scores').insert({ player_name: profile.name, time_ms: elapsed }); loadData() }
       }
     } else {
       setTimeout(() => {
         setCards(prev => prev.map((c, i) => newSelected.includes(i) ? { ...c, flipped: false } : c))
         setSelected([])
         setLocked(false)
       }, 900)
     }
   }
 }, [locked, cards, selected, startTime, profile?.name])

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen icon="brain-red.png" title="Memory" subtitle="Match all brain pairs as fast as possible" worldRecord={worldRecord} myBest={myBest !== null ? fmt(myBest) : null} top5={top5} onPlay={startGame} />
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={fmt(timeMs)}
     resultColor={timeMs < 20000 ? '#00C853' : timeMs < 45000 ? GOLD : '#D32F2F'}
     background={timeMs < 20000 ? '#0D3320' : timeMs < 45000 ? '#2D1A00' : '#1A0000'}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   >
     <div style={{ fontSize:16, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{moves} moves</div>
   </GameResultScreen>
 )

 return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
       <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{fmt(timeMs)}</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>MEMORY</div>
       <div style={{ fontSize:18, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>{moves} moves</div>
     </div>

     <div style={{ flex:1, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, padding:'8px 12px 80px', alignContent:'center' }}>
       {cards.map((card, idx) => (
         <div key={card.id} onClick={() => handleCard(idx)}
           style={{ aspectRatio:'1', borderRadius:12, cursor:'pointer', background: card.flipped || card.matched ? '#252525' : '#252525', border: card.matched ? '2px solid #2E7D32' : card.flipped ? '2px solid '+GOLD : '2px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
           {(card.flipped || card.matched) ? (
             <img src={`${BASE}/${card.image}`} style={{ width:'85%', height:'85%', objectFit:'contain', opacity: 1 }} />
           ) : (
             <div style={{ width:'60%', height:'60%', borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
           )}
         </div>
       ))}
     </div>
   </main>
 )
}
