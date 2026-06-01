'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

type Phase = 'rules' | 'show' | 'input' | 'result'

function getCells(level: number) {
 if (level <= 3) return { cols: 3, rows: 3, count: level + 1 }
 if (level <= 6) return { cols: 4, rows: 4, count: level + 1 }
 return { cols: 5, rows: 5, count: level + 1 }
}

function shuffle<T>(arr: T[]): T[] {
 return [...arr].sort(() => Math.random() - 0.5)
}

export default function BlinkClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [level, setLevel] = useState(1)
 const [target, setTarget] = useState<number[]>([])
 const [selected, setSelected] = useState<number[]>([])
 const [showTime, setShowTime] = useState(3)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])
 const { cols, rows, count } = getCells(level)
 const total = cols * rows

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('blink_scores').select('player_name, level').order('level', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:'Level '+l})))
   if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
 }, [profile?.name])

 useEffect(() => { loadData() }, [loadData])

 const startLevel = useCallback((lvl: number) => {
   const { cols, rows, count } = getCells(lvl)
   const total = cols * rows
   const indices = shuffle(Array.from({ length: total }, (_, i) => i)).slice(0, count)
   setTarget(indices)
   setSelected([])
   setLevel(lvl)
   const t = Math.max(1, 4 - Math.floor(lvl / 3))
   setShowTime(t)
   setPhase('show')

   let remaining = t
   const timer = setInterval(() => {
     remaining--
     setShowTime(remaining)
     if (remaining <= 0) {
       clearInterval(timer)
       setPhase('input')
     }
   }, 1000)
 }, [])

 const startGame = () => {
   startLevel(1)
   window.dispatchEvent(new Event('gameStart'))
 }

 const toggleCell = (idx: number) => {
   if (phase !== 'input') return
   setSelected(prev => prev.includes(idx) ? prev.filter(x => x !== idx) : [...prev, idx])
 }

 const handleSubmit = useCallback(async () => {
   const correct = target.every(i => selected.includes(i)) && selected.length === target.length
   if (correct) {
     startLevel(level + 1)
   } else {
     setPhase('result')
     window.dispatchEvent(new Event('gameResult'))
     const { count } = await supabase.from('blink_scores').select('player_name', { count: 'exact', head: true }).gt('level', level - 1)
     setWorldRank((count ?? 0) + 1)
     if (profile?.name && level > 1) await supabase.from('blink_scores').insert({ player_name: profile.name, level: level - 1 })
   }
 }, [target, selected, level, startLevel, profile?.name])

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen icon="blink.png" title="Blink" subtitle="Remember which cells lit up" worldRecord={worldRecord} myBest={myBest !== null ? 'Level '+myBest : null} top5={top5} onPlay={startGame} />
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={'Level '+(level-1)}
     resultColor={(level-1) >= 8 ? '#00C853' : (level-1) >= 4 ? GOLD : '#D32F2F'}
     background={(level-1) >= 8 ? '#0D3320' : (level-1) >= 4 ? '#2D1A00' : '#1A0000'}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   />
 )

 return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
       <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>Level {level}</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>BLINK</div>
       <div style={{ fontSize:22, fontWeight:900, color: phase === 'show' && showTime <= 1 ? '#D32F2F' : 'rgba(255,255,255,0.5)' }}>
         {phase === 'show' ? showTime+'s' : selected.length+'/'+count}
       </div>
     </div>

     <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 16px 80px', gap:16 }}>
       <div style={{ display:'grid', gap:8, gridTemplateColumns:'repeat('+cols+',1fr)', maxWidth: cols <= 3 ? 260 : cols <= 4 ? 320 : '100%', width:'100%', maxWidth:'100%' }}>
         {Array.from({ length: total }, (_, idx) => {
           const isTarget = target.includes(idx)
           const isSelected = selected.includes(idx)
           const showHighlight = phase === 'show' && isTarget
           const showSelected = phase === 'input' && isSelected
           const showCorrect = phase === 'input' && isTarget && isSelected
           return (
             <div key={idx} onClick={() => toggleCell(idx)}
               style={{ aspectRatio:'1', borderRadius:10, cursor: phase === 'input' ? 'pointer' : 'default', background: showHighlight ? '#C8960C' : showCorrect ? '#2E7D32' : showSelected ? 'rgba(46,125,50,0.4)' : '#252525', border: showHighlight ? '2px solid #FFD740' : showSelected ? '2px solid #2E7D32' : '2px solid rgba(255,255,255,0.06)', transition:'all 0.15s', boxShadow: showHighlight ? '0 0 16px #C8960C80' : 'none' }} />
           )
         })}
       </div>

       {phase === 'input' && (
         <button onClick={handleSubmit} style={{ width:'100%', maxWidth:370, padding:'16px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20' }}>
           Submit →
         </button>
       )}
     </div>
   </main>
 )
}
