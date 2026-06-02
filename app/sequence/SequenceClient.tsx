'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

type Phase = 'rules' | 'show' | 'input' | 'result'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

const COLORS = [
 { id: 0, color: '#D32F2F', light: '#FF5252' },
 { id: 1, color: '#1565C0', light: '#448AFF' },
 { id: 2, color: '#2E7D32', light: '#69F0AE' },
 { id: 3, color: '#F57F17', light: '#FFD740' },
]

export default function SequenceClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [sequence, setSequence] = useState<number[]>([])
 const [userInput, setUserInput] = useState<number[]>([])
 const [activeColor, setActiveColor] = useState<number|null>(null)
 const [level, setLevel] = useState(1)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])
 const [status, setStatus] = useState('')

 const timerRef = useRef<any>(null)
 const levelRef = useRef(1)

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('sequence_scores').select('player_name, level').order('level', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:'Level '+l})))
   const stored = typeof window !== 'undefined' ? localStorage.getItem('memgenius_profile') : null
    const pName = stored ? JSON.parse(stored).name : null
    if (pName && best[pName] !== undefined) setMyBest(best[pName])
 }, [profile?.name])

 useEffect(() => { loadData() }, [loadData])

 const showSequence = useCallback((seq: number[]) => {
   setPhase('show')
   setStatus('Watch...')
   setActiveColor(null)
   let i = 0
   const speed = Math.max(300, 800 - seq.length * 30)
   const next = () => {
     if (i < seq.length) {
       setActiveColor(seq[i])
       timerRef.current = setTimeout(() => {
         setActiveColor(null)
         timerRef.current = setTimeout(() => { i++; next() }, 200)
       }, speed)
     } else {
       setPhase('input')
       setUserInput([])
       setStatus('Your turn')
     }
   }
   timerRef.current = setTimeout(next, 600)
 }, [])

 const startGame = () => {
   levelRef.current = 1
   setLevel(1)
   const seq = [Math.floor(Math.random() * 4)]
   setSequence(seq)
   showSequence(seq)
   window.dispatchEvent(new Event('gameStart'))
 }

 const handlePress = useCallback(async (colorId: number) => {
   if (phase !== 'input') return
   setActiveColor(colorId)
   setTimeout(() => setActiveColor(null), 150)

   const newInput = [...userInput, colorId]
   setUserInput(newInput)
   const idx = newInput.length - 1

   if (newInput[idx] !== sequence[idx]) {
     const finalLevel = levelRef.current - 1
     setPhase('result')
     window.dispatchEvent(new Event('gameResult'))
     const { count } = await supabase.from('sequence_scores').select('player_name', { count: 'exact', head: true }).gt('level', finalLevel)
     setWorldRank((count ?? 0) + 1)
     if (profile?.name && finalLevel > 0) await supabase.from('sequence_scores').insert({ player_name: profile.name, level: finalLevel })
     return
   }

   if (newInput.length === sequence.length) {
     const nextLevel = levelRef.current + 1
     levelRef.current = nextLevel
     setLevel(nextLevel)
     const newSeq = [...sequence, Math.floor(Math.random() * 4)]
     setSequence(newSeq)
     setStatus('Correct!')
     timerRef.current = setTimeout(() => showSequence(newSeq), 800)
   }
 }, [phase, userInput, sequence, showSequence, profile?.name])

 useEffect(() => { return () => clearTimeout(timerRef.current) }, [])

 const finalLevel = level - 1
 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return <GameRulesScreen icon="sequence.png" title="Simon Says" subtitle="Repeat the color pattern" worldRecord={worldRecord} myBest={myBest !== null ? 'Level '+myBest : null} top5={top5} onPlay={startGame} />

 if (phase === 'result') return (
   <GameResultScreen result={'Level '+finalLevel} resultColor={finalLevel >= 15 ? '#00C853' : finalLevel >= 8 ? GOLD : '#D32F2F'} background={finalLevel >= 15 ? '#0D3320' : finalLevel >= 8 ? '#2D1A00' : '#1A0000'} worldRank={worldRank} hasProfile={!!profile?.name} onBack={() => { setPhase('rules'); loadData() }} onPlayAgain={startGame} />
 )

 return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden', paddingBottom:80 }}>
     
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
       <div style={{ fontSize:16, fontWeight:900, color:'rgba(255,255,255,0.4)' }}>Level {level}</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>SIMON SAYS</div>
       <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>{status}</div>
     </div>

     <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, width:280 }}>
         {COLORS.map(c => (
           <button key={c.id} onPointerDown={() => handlePress(c.id)} disabled={phase === 'show'}
             style={{ height:120, borderRadius:20, border:'none', cursor: phase === 'input' ? 'pointer' : 'default', background: activeColor === c.id ? c.light : c.color, boxShadow: activeColor === c.id ? '0 0 30px '+c.light : 'none', transition:'all 0.15s' }} />
         ))}
       </div>
     </div>

     <div style={{ padding:'12px 20px', textAlign:'center', flexShrink:0 }}>
       <div style={{ fontSize:13, color:'rgba(255,255,255,0.2)', fontWeight:700 }}>
         {phase === 'input' ? userInput.length+' / '+sequence.length : ''}
       </div>
     </div>
   </main>
 )
}
