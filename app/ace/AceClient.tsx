'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

type Phase = 'rules' | 'playing' | 'result'

const GREEN = '#2E7D32'
const TENNIS = '#4CAF50'
const GOLD = '#C8960C'
const W = 390
const H = 300
const TX = W * 0.5
const TY = H * 0.5
const TR = 42
const BR = 14

function getBallPos(t: number) {
 const x = W * 0.05 + W * 0.9 * t
 const startY = H * 0.88
 const y = startY - (startY - TY) * Math.sin(t * Math.PI)
 return { x, y }
}

export default function AceClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [level, setLevel] = useState(0)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])
 const [hitResult, setHitResult] = useState<'perfect'|'good'|'miss'|null>(null)

 const canvasRef = useRef<HTMLCanvasElement>(null)
 const animRef = useRef(0)
 const startRef = useRef(0)
 const levelRef = useRef(1)
 const durRef = useRef(2200)
 const didHitRef = useRef(false)

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('ace_scores')
     .select('player_name, level').order('level', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:`${l} aces`})))
   const pName = profileRef.current?.name || JSON.parse(localStorage.getItem('memgenius_profile') || '{}').name
    if (pName && best[pName] !== undefined) setMyBest(best[pName])
 }, [profile?.name])

 useEffect(() => { loadData() }, [loadData])

 const drawFrame = useCallback(() => {
   const canvas = canvasRef.current
   if (!canvas) return
   const ctx = canvas.getContext('2d')
   if (!ctx) return
   const elapsed = Date.now() - startRef.current
   const t = Math.min(elapsed / durRef.current, 1)
   const { x, y } = getBallPos(t)

   ctx.clearRect(0, 0, W, H)
   ctx.fillStyle = '#1A1A1A'
   ctx.fillRect(0, 0, W, H)

   ctx.font = '800 13px sans-serif'
   ctx.fillStyle = 'rgba(255,255,255,0.3)'
   ctx.textAlign = 'center'
   ctx.fillText('LEVEL ' + levelRef.current, W/2, 22)

   const dist = Math.sqrt((x-TX)**2 + (y-TY)**2)
   const inTarget = dist < TR
   const tc = inTarget ? TENNIS : 'rgba(255,255,255,0.35)'

   ctx.strokeStyle = tc; ctx.lineWidth = 1
   ctx.beginPath(); ctx.moveTo(TX-TR-14, TY); ctx.lineTo(TX+TR+14, TY); ctx.stroke()
   ctx.beginPath(); ctx.moveTo(TX, TY-TR-14); ctx.lineTo(TX, TY+TR+14); ctx.stroke()

   ctx.beginPath(); ctx.arc(TX, TY, TR, 0, Math.PI*2)
   ctx.fillStyle = inTarget ? 'rgba(76,175,80,0.18)' : 'rgba(255,255,255,0.04)'; ctx.fill()
   ctx.strokeStyle = tc; ctx.lineWidth = 2; ctx.stroke()

   ctx.beginPath(); ctx.arc(TX, TY, TR*0.45, 0, Math.PI*2)
   ctx.strokeStyle = tc; ctx.lineWidth = 1.5; ctx.stroke()

   ctx.beginPath(); ctx.arc(TX, TY, 4, 0, Math.PI*2)
   ctx.fillStyle = tc; ctx.fill()

   ctx.beginPath(); ctx.arc(x, y, BR+6, 0, Math.PI*2)
   ctx.fillStyle = 'rgba(200,255,0,0.12)'; ctx.fill()
   ctx.beginPath(); ctx.arc(x, y, BR, 0, Math.PI*2)
   ctx.fillStyle = '#C8FF00'; ctx.fill()

   if (t < 1) { animRef.current = requestAnimationFrame(drawFrame) }
   else { if (!didHitRef.current) endGame() }
 }, [])

 const startLevel = useCallback(() => {
   didHitRef.current = false
   setHitResult(null)
   startRef.current = Date.now()
   durRef.current = Math.max(500, 2200 - (levelRef.current-1) * 120)
   animRef.current = requestAnimationFrame(drawFrame)
 }, [drawFrame])

 const endGame = useCallback(async () => {
   cancelAnimationFrame(animRef.current)
   const finalLevel = levelRef.current - 1
   setLevel(finalLevel)
   setPhase('result')
   window.dispatchEvent(new Event('gameResult'))

   const { count } = await supabase.from('ace_scores')
     .select('player_name', { count: 'exact', head: true }).gt('level', finalLevel)
   setWorldRank((count ?? 0) + 1)

   if (profile?.name && finalLevel > 0) {
     await supabase.from('ace_scores').insert({ player_name: profile.name, level: finalLevel })
   }
 }, [profile?.name])

 const startGame = () => {
   levelRef.current = 1
   setLevel(1)
   setPhase('playing')
   window.dispatchEvent(new Event('gameStart'))
   setTimeout(() => startLevel(), 100)
 }

 const handleTap = useCallback(() => {
   if (phase !== 'playing') return
   const elapsed = Date.now() - startRef.current
   const t = elapsed / durRef.current
   const { x, y } = getBallPos(t)
   const dist = Math.sqrt((x-TX)**2 + (y-TY)**2)
   if (dist < TR) {
     didHitRef.current = true
     cancelAnimationFrame(animRef.current)
     setHitResult(dist < TR*0.45 ? 'perfect' : 'good')
     levelRef.current += 1
     setLevel(l => l+1)
     setTimeout(() => startLevel(), 600)
   } else {
     didHitRef.current = true
     setHitResult('miss')
     endGame()
   }
 }, [phase, startLevel, endGame])

 useEffect(() => { return () => cancelAnimationFrame(animRef.current) }, [])

 const resultColor = level >= 10 ? '#00C853' : level >= 5 ? '#C8960C' : '#D32F2F'
 const bgResult = level >= 10 ? '#0D3320' : level >= 5 ? '#2D1A00' : '#1A0000'
 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen
     icon="padel.png"
     title="Ace"
     subtitle="Tap when the ball hits the sweet spot"
     worldRecord={worldRecord}
     myBest={myBest !== null ? `${myBest} aces` : null}
     top5={top5}
     onPlay={startGame}
   />
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={`${level}`}
     resultColor={resultColor}
     background={bgResult}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   >
     <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>aces in a row</div>
   </GameResultScreen>
 )

 return (
   <main onClick={handleTap} style={{ height:'100dvh', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', gap:12, paddingBottom:80 }}>
     <canvas ref={canvasRef} width={W} height={H} style={{ width:'100%', maxWidth:W, touchAction:'none' }} />
     {hitResult && (
       <div style={{ fontSize:28, fontWeight:900, color: hitResult==='perfect'?GOLD:hitResult==='good'?TENNIS:'#D32F2F', fontFamily:'var(--font-nunito),sans-serif' }}>
         {hitResult==='perfect'?'Perfect!':hitResult==='good'?'Good!':'Miss!'}
       </div>
     )}
     <div style={{ fontSize:13, color:'rgba(255,255,255,0.15)', fontWeight:700, fontFamily:'var(--font-nunito),sans-serif' }}>Tap anywhere</div>
   </main>
 )
}
