'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const TENNIS = '#4CAF50'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const CANVAS_W = 390
const CANVAS_H = 320
const TARGET_X = CANVAS_W * 0.5
const TARGET_Y = CANVAS_H * 0.5
const TARGET_R = 42
const BALL_R = 14

type Phase = 'rules' | 'playing' | 'result'

function getBallPos(t: number) {
 const x = CANVAS_W * 0.05 + (CANVAS_W * 0.9) * t
 const startY = CANVAS_H * 0.88
 const y = startY - (startY - TARGET_Y) * Math.sin(t * Math.PI)
 return { x, y }
}

export default function AceClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [level, setLevel] = useState(0)
 const [worldRecord, setWorldRecord] = useState<{level:number,name:string}|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<{name:string,level:number}[]>([])
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [hitResult, setHitResult] = useState<'perfect'|'good'|'miss'|null>(null)
 const [name, setName] = useState('')
 const [pin, setPin] = useState(['','','',''])
 const [saved, setSaved] = useState(false)
 const [saving, setSaving] = useState(false)
 const [saveError, setSaveError] = useState('')
 const canvasRef = useRef<HTMLCanvasElement>(null)
 const animRef = useRef(0)
 const startTimeRef = useRef(0)
 const levelRef = useRef(1)
 const durationRef = useRef(2200)
 const didHitRef = useRef(false)

 useEffect(() => {
   if (profile?.name) setName(profile.name)
   loadData()
 }, [profile?.name])

 const loadData = async () => {
   const { data } = await supabase.from('ace_scores').select('player_name,level').order('level', { ascending: false }).limit(500)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).map(([n,l]) => ({name:n, level:l as number})).sort((a,b) => b.level-a.level)
   setTop5(sorted.slice(0,5))
   if (sorted[0]) setWorldRecord({level:sorted[0].level, name:sorted[0].name})
   if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
 }

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

   // Level label
   ctx.font = '800 13px sans-serif'
   ctx.fillStyle = 'rgba(255,255,255,0.3)'
   ctx.textAlign = 'center'
   ctx.fillText('LEVEL ' + String(levelRef.current), CANVAS_W / 2, 22)

   // Floor line
   ctx.strokeStyle = 'rgba(255,255,255,0.06)'
   ctx.lineWidth = 1
   ctx.beginPath()
   ctx.moveTo(0, CANVAS_H * 0.92)
   ctx.lineTo(CANVAS_W, CANVAS_H * 0.92)
   ctx.stroke()

   const dist = Math.sqrt((x - TARGET_X) ** 2 + (y - TARGET_Y) ** 2)
   const inTarget = dist < TARGET_R
   const tc = inTarget ? TENNIS : 'rgba(255,255,255,0.35)'

   // Crosshair lines
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

   // Outer ring
   ctx.beginPath()
   ctx.arc(TARGET_X, TARGET_Y, TARGET_R, 0, Math.PI * 2)
   ctx.fillStyle = inTarget ? 'rgba(76,175,80,0.18)' : 'rgba(255,255,255,0.04)'
   ctx.fill()
   ctx.strokeStyle = tc
   ctx.lineWidth = 2
   ctx.stroke()

   // Inner ring
   ctx.beginPath()
   ctx.arc(TARGET_X, TARGET_Y, TARGET_R * 0.45, 0, Math.PI * 2)
   ctx.strokeStyle = tc
   ctx.lineWidth = 1.5
   ctx.stroke()

   // Center dot
   ctx.beginPath()
   ctx.arc(TARGET_X, TARGET_Y, 4, 0, Math.PI * 2)
   ctx.fillStyle = tc
   ctx.fill()

   // Ball glow
   ctx.beginPath()
   ctx.arc(x, y, BALL_R + 6, 0, Math.PI * 2)
   ctx.fillStyle = 'rgba(200,255,0,0.12)'
   ctx.fill()

   // Ball
   ctx.beginPath()
   ctx.arc(x, y, BALL_R, 0, Math.PI * 2)
   ctx.fillStyle = '#C8FF00'
   ctx.fill()

   if (t < 1) {
     animRef.current = requestAnimationFrame(drawFrame)
   } else {
     if (!didHitRef.current) endGame(false)
   }
 }, [])

 const startLevel = useCallback(() => {
   didHitRef.current = false
   setHitResult(null)
   startTimeRef.current = Date.now()
   durationRef.current = Math.max(500, 2200 - (levelRef.current - 1) * 120)
   animRef.current = requestAnimationFrame(drawFrame)
 }, [drawFrame])

 const startGame = () => {
   levelRef.current = 1
   setLevel(1)
   setPhase('playing')
   setTimeout(() => startLevel(), 100)
 }

 const endGame = useCallback(async (hit: boolean) => {
   if (hit) return
   cancelAnimationFrame(animRef.current)
   const finalLevel = levelRef.current - 1
   setLevel(finalLevel)
   setPhase('result')
   if (profile?.name && finalLevel > 0) {
     await supabase.from('ace_scores').insert({player_name:profile.name, level:finalLevel})
     const {count} = await supabase.from('ace_scores').select('*',{count:'exact',head:true}).gt('level',finalLevel)
     setWorldRank((count??0)+1)
     if (myBest===null || finalLevel>myBest) setMyBest(finalLevel)
   }
 }, [profile?.name, myBest])

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
     endGame(false)
   }
 }, [phase, startLevel, endGame])

 const saveScore = async () => {
   if (!name.trim() || pin.join('').length!==4) return
   setSaving(true)
   setSaveError('')
   const pinHash = btoa(pin.join(''))
   const {data:existing} = await supabase.from('profiles').select('password_hash').eq('player_name',name.trim()).maybeSingle()
   if (existing) {
     if (existing.password_hash !== pinHash) { setSaveError('Wrong PIN for this name'); setSaving(false); return }
   } else {
     await supabase.from('profiles').insert({player_name:name.trim(), password_hash:pinHash})
   }
   await supabase.from('ace_scores').insert({player_name:name.trim(), level})
   const {count} = await supabase.from('ace_scores').select('*',{count:'exact',head:true}).gt('level',level)
   setWorldRank((count??0)+1)
   setSaving(false)
   setSaved(true)
   localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
   setTimeout(() => window.location.reload(), 1500)
 }

 const reset = () => {
   cancelAnimationFrame(animRef.current)
   setPhase('rules')
   setSaved(false)
   setHitResult(null)
   loadData()
 }

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
         <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? `${myBest} aces` : '—'}</div>
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
   <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
     <div style={{ textAlign:'center' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Aces in a row</div>
       <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2 }}>{level}</div>
       {worldRank && <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:8 }}>#{worldRank} in the world</div>}
     </div>
     {!profile?.name && !saved && (
       <div style={{ width:'100%', background:'rgba(0,0,0,0.3)', borderRadius:24, padding:'24px' }}>
         <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:4 }}>Save your score</div>
         <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:16 }}>New user? Create account. Returning? Enter your PIN.</div>
         <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.12)', color:'#fff', fontSize:15, fontWeight:800, fontFamily:'inherit', outline:'none', marginBottom:12, boxSizing:'border-box' }} />
         <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>PIN</div>
         <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:16 }}>
           {pin.map((d,i) => (
             <input key={i} id={`pin-${i}`} type="tel" maxLength={1} value={d}
               onChange={e=>{const v=e.target.value.replace(/\D/,'');const p=[...pin];p[i]=v;setPin(p);if(v&&i<3)(document.getElementById(`pin-${i+1}`) as HTMLInputElement)?.focus()}}
               style={{ width:48, height:56, textAlign:'center', fontSize:24, fontWeight:900, borderRadius:12, border:'2px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontFamily:'inherit', outline:'none' }} />
           ))}
         </div>
         {saveError && <div style={{ fontSize:12, color:'#FF5252', fontWeight:800, textAlign:'center', marginBottom:10 }}>{saveError}</div>}
         <button onClick={saveScore} disabled={!name.trim()||pin.join('').length!==4||saving} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:name.trim()&&pin.join('').length===4?GREEN:'rgba(255,255,255,0.15)', color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
           {saving?'Saving...':'Save →'}
         </button>
       </div>
     )}
     {saved && (
       <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:16, padding:'16px 20px', textAlign:'center' }}>
         <div style={{ fontSize:16, fontWeight:900, color:'#69F0AE' }}>✓ Score saved!</div>
         <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:4 }}>#{worldRank} in the world</div>
       </div>
     )}
     <div style={{ display:'flex', gap:10, width:'100%' }}>
       <button onClick={reset} style={{ flex:1, padding:'16px', borderRadius:16, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
       <button onClick={()=>{setSaved(false);startGame()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:TENNIS, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${TENNIS}80` }}>Play again →</button>
     </div>
   </main>
 )
}
