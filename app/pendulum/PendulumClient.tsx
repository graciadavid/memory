'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

type Phase = 'rules' | 'playing' | 'result'

const GREEN = '#2E7D32'
const W = 320
const H = 320
const CX = W / 2
const CY = 20
const L = 260

export default function PendulumClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [diffDeg, setDiffDeg] = useState(0)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])

 const animRef = useRef(0)
 const startRef = useRef(Date.now())
 const canvasRef = useRef<HTMLCanvasElement>(null)
 const speedRef = useRef(1)

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('precision_scores')
     .select('player_name, difference_ms').eq('game_type', 'pendulum')
     .order('difference_ms', { ascending: true }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
   const sorted = Object.entries(best).sort((a,b) => (a[1] as number)-(b[1] as number))
   setTop5(sorted.slice(0,5).map(([name,ms]) => ({name, score:`${ms}°`})))
   const stored = typeof window !== 'undefined' ? localStorage.getItem('memgenius_profile') : null
    const pName = stored ? JSON.parse(stored).name : null
    if (pName && best[pName] !== undefined) setMyBest(best[pName])
 }, [profile?.name])

 useEffect(() => { loadData() }, [loadData])

 const getAngle = () => {
   const elapsed = (Date.now() - startRef.current) / 1000
   const amplitude = 70
   const period = Math.max(1.5, 3 - speedRef.current * 0.3)
   return amplitude * Math.sin((2 * Math.PI * elapsed) / period)
 }

 const draw = useCallback(() => {
   const canvas = canvasRef.current
   if (!canvas) return
   const ctx = canvas.getContext('2d')
   if (!ctx) return
   const angle = getAngle()
   const rad = (angle * Math.PI) / 180
   const bx = CX + L * Math.sin(rad)
   const by = CY + L * Math.cos(rad)

   ctx.clearRect(0, 0, W, H)

   // Center line
   ctx.strokeStyle = 'rgba(255,255,255,0.1)'
   ctx.lineWidth = 1
   ctx.setLineDash([4, 4])
   ctx.beginPath()
   ctx.moveTo(CX, CY)
   ctx.lineTo(CX, CY + L)
   ctx.stroke()
   ctx.setLineDash([])

   // Rod
   ctx.strokeStyle = 'rgba(255,255,255,0.5)'
   ctx.lineWidth = 2
   ctx.beginPath()
   ctx.moveTo(CX, CY)
   ctx.lineTo(bx, by)
   ctx.stroke()

   // Pivot
   ctx.beginPath()
   ctx.arc(CX, CY, 6, 0, Math.PI * 2)
   ctx.fillStyle = 'rgba(255,255,255,0.5)'
   ctx.fill()

   // Bob
   const inZone = Math.abs(angle) < 8
   ctx.beginPath()
   ctx.arc(bx, by, 22, 0, Math.PI * 2)
   ctx.fillStyle = inZone ? '#00C853' : '#2E7D32'
   ctx.fill()
   ctx.strokeStyle = inZone ? '#69F0AE' : 'rgba(255,255,255,0.3)'
   ctx.lineWidth = 2
   ctx.stroke()

   animRef.current = requestAnimationFrame(draw)
 }, [])

 const startGame = () => {
   startRef.current = Date.now()
   speedRef.current = 1
   setPhase('playing')
   window.dispatchEvent(new Event('gameStart'))
   animRef.current = requestAnimationFrame(draw)
 }

 const handleStop = useCallback(async () => {
   if (phase !== 'playing') return
   cancelAnimationFrame(animRef.current)
   const angle = getAngle()
   const diff = Math.abs(Math.round(angle))
   setDiffDeg(diff)
   setPhase('result')
   window.dispatchEvent(new Event('gameResult'))

   const { count } = await supabase.from('precision_scores')
     .select('player_name', { count: 'exact', head: true }).eq('game_type', 'pendulum').lt('difference_ms', diff)
   setWorldRank((count ?? 0) + 1)

   if (profile?.name) {
     await supabase.from('precision_scores').insert({ player_name: profile.name, difference_ms: diff, game_type: 'pendulum' })
   }
 }, [phase, profile?.name])

 useEffect(() => { return () => cancelAnimationFrame(animRef.current) }, [])

 const resultColor = diffDeg < 5 ? '#00C853' : diffDeg < 15 ? '#C8960C' : '#D32F2F'
 const bgResult = diffDeg < 5 ? '#0D3320' : diffDeg < 15 ? '#2D1A00' : '#1A0000'
 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen
     icon="pendulum.png"
     title="Pendulum"
     subtitle="Stop it at dead center"
     worldRecord={worldRecord}
     myBest={myBest !== null ? `${myBest}°` : null}
     top5={top5}
     onPlay={startGame}
   />
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={`${Math.round(Math.abs(getAngle ? 0 : 0))}°`}
     resultColor={resultColor}
     background={bgResult}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   />
 )

 return (
   <main onClick={handleStop} style={{ height:'100dvh', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', gap:16, paddingBottom:80, fontFamily:'var(--font-nunito),sans-serif' }}>
     <canvas ref={canvasRef} width={W} height={H} style={{ width:W, height:H }} />
     <button onClick={handleStop} style={{ padding:'16px 48px', borderRadius:16, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 6px 0 #1B5E20' }}>
       STOP
     </button>
     <div style={{ fontSize:13, color:'rgba(255,255,255,0.2)', fontWeight:700 }}>or tap anywhere</div>
   </main>
 )
}
