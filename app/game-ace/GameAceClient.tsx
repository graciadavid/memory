'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { useGameResult } from '@/lib/useGameResult'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const TENNIS = '#4CAF50'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const CANVAS_W = 390
const CANVAS_H = 320
const TARGET_X = CANVAS_W * 0.5
const TARGET_Y = CANVAS_H * 0.5
const TARGET_R = 42
const BALL_R = 14

type Phase = 'rules' | 'playing' | 'over'

function getBallPos(t: number) {
  const x = CANVAS_W * 0.05 + (CANVAS_W * 0.9) * t
  const startY = CANVAS_H * 0.88
  const y = startY - (startY - TARGET_Y) * Math.sin(t * Math.PI)
  return { x, y }
}

export default function GameAceClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [level, setLevel] = useState(0)
  const [top5, setTop5] = useState<{name:string,level:number}[]>([])
  const [worldRecord, setWorldRecord] = useState<{name:string,level:number}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [hitResult, setHitResult] = useState<'perfect'|'good'|'miss'|null>(null)

  const { saved, worldRank } = useGameResult({
    table: 'ace_scores',
    scoreField: 'level',
    score: level,
    phase,
    higherIsBetter: true,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)
  const startTimeRef = useRef(0)
  const levelRef = useRef(1)
  const durationRef = useRef(2200)
  const didHitRef = useRef(false)

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('ace_scores').select('player_name,level').order('level', { ascending: false }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
    const sorted = Object.entries(best).map(([n,l]) => ({name:n, level:l as number})).sort((a,b) => b.level-a.level)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({name:sorted[0].name, level:sorted[0].level})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
  }, [profile?.name])

  useEffect(() => { loadData() }, [loadData])

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const elapsed = Date.now() - startTimeRef.current
    const t = Math.min(elapsed / durationRef.current, 1)
    const { x, y } = getBallPos(t)

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.fillStyle = '#1C1C1E'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    ctx.font = '800 13px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.textAlign = 'center'
    ctx.fillText('LEVEL ' + String(levelRef.current), CANVAS_W / 2, 22)

    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, CANVAS_H * 0.92)
    ctx.lineTo(CANVAS_W, CANVAS_H * 0.92)
    ctx.stroke()

    const dist = Math.sqrt((x - TARGET_X) ** 2 + (y - TARGET_Y) ** 2)
    const inTarget = dist < TARGET_R
    const tc = inTarget ? TENNIS : 'rgba(255,255,255,0.35)'

    ctx.strokeStyle = tc
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(TARGET_X - TARGET_R - 14, TARGET_Y)
    ctx.lineTo(TARGET_X + TARGET_R + 14, TARGET_Y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(TARGET_X, TARGET_Y - TARGET_R - 14)
    ctx.lineTo(TARGET_X, TARGET_Y + TARGET_R + 14)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(TARGET_X, TARGET_Y, TARGET_R, 0, Math.PI * 2)
    ctx.fillStyle = inTarget ? 'rgba(76,175,80,0.18)' : 'rgba(255,255,255,0.04)'
    ctx.fill()
    ctx.strokeStyle = tc
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(TARGET_X, TARGET_Y, TARGET_R * 0.45, 0, Math.PI * 2)
    ctx.strokeStyle = tc
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(TARGET_X, TARGET_Y, 4, 0, Math.PI * 2)
    ctx.fillStyle = tc
    ctx.fill()

    ctx.beginPath()
    ctx.arc(x, y, BALL_R + 6, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(200,255,0,0.12)'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(x, y, BALL_R, 0, Math.PI * 2)
    ctx.fillStyle = '#C8FF00'
    ctx.fill()

    if (t < 1) {
      animRef.current = requestAnimationFrame(drawFrame)
    } else {
      if (!didHitRef.current) endGame()
    }
  }, [])

  const startLevel = useCallback(() => {
    didHitRef.current = false
    setHitResult(null)
    startTimeRef.current = Date.now()
    durationRef.current = Math.max(500, 2200 - (levelRef.current - 1) * 120)
    animRef.current = requestAnimationFrame(drawFrame)
  }, [drawFrame])

  const endGame = useCallback(() => {
    cancelAnimationFrame(animRef.current)
    const finalLevel = levelRef.current - 1
    setLevel(finalLevel)
    setPhase('over')
    window.dispatchEvent(new Event('gameResult'))
  }, [])

  const startGame = () => {
    levelRef.current = 1
    setLevel(1)
    setPhase('playing')
    window.dispatchEvent(new Event('gameStart'))
    setTimeout(() => startLevel(), 100)
  }

  const handleTap = useCallback(() => {
    if (phase !== 'playing') return
    const elapsed = Date.now() - startTimeRef.current
    const t = elapsed / durationRef.current
    const { x, y } = getBallPos(t)
    const dist = Math.sqrt((x - TARGET_X) ** 2 + (y - TARGET_Y) ** 2)
    if (dist < TARGET_R) {
      didHitRef.current = true
      cancelAnimationFrame(animRef.current)
      const isPerfect = dist < TARGET_R * 0.45
      setHitResult(isPerfect ? 'perfect' : 'good')
      levelRef.current += 1
      setLevel(l => l + 1)
      setTimeout(() => startLevel(), 600)
    } else {
      didHitRef.current = true
      setHitResult('miss')
      endGame()
    }
  }, [phase, startLevel, endGame])

  const resultColor = level >= 10 ? '#00C853' : level >= 5 ? '#FF6F00' : '#D32F2F'
  const bgResult = level >= 10 ? '#0D3320' : level >= 5 ? '#2D1A00' : '#1A0000'

  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <img src={`${BASE}/padel.png`} style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Ace</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Tap when the ball hits the sweet spot</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${worldRecord.level} aces` : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest !== null ? `${myBest} aces` : '—'}</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.level} aces</div>
          </div>
        ))}
      </div>
      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:TENNIS, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${TENNIS}80`, marginTop:'auto' }}>
        Start →
      </button>
    </main>
  )

  if (phase === 'playing') return (
    <main onClick={handleTap} style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', gap:12 }}>
      <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{ width:'100%', maxWidth:CANVAS_W, touchAction:'none' }} />
      {hitResult && (
        <div style={{ fontSize:28, fontWeight:900, color:hitResult==='perfect'?GOLD:hitResult==='good'?TENNIS:'#D32F2F' }}>
          {hitResult==='perfect'?'Perfect!':hitResult==='good'?'Good!':'Miss!'}
        </div>
      )}
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.15)', fontWeight:700 }}>Tap anywhere</div>
    </main>
  )

  return (
    <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Aces in a row</div>
        <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2 }}>{level}</div>
        {worldRank && <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:8 }}>#{worldRank} in the world</div>}
      </div>
      {saved && (
        <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:16, padding:'16px 20px', textAlign:'center' }}>
          <div style={{ fontSize:16, fontWeight:900, color:'#69F0AE' }}>✓ Score saved!</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:4 }}>#{worldRank} in the world</div>
        </div>
      )}
      <div style={{ display:'flex', gap:10, width:'100%' }}>
        <a href="/agility" style={{ flex:1, padding:'16px', borderRadius:16, background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, textAlign:'center', textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center' }}>← Back</a>
        <button onClick={startGame} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:TENNIS, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${TENNIS}80` }}>Play again →</button>
      </div>
    </main>
  )
}
