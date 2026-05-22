'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const PURPLE = '#4A148C'
const GREEN = '#2E7D32'

type Phase = 'rules' | 'countdown' | 'running' | 'result'

export default function StopPage() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [countdown, setCountdown] = useState(3)
 const [elapsed, setElapsed] = useState(0)
 const [difference, setDifference] = useState(0)
 const [worldRecord, setWorldRecord] = useState<{ diff: number, name: string } | null>(null)
 const [myBest, setMyBest] = useState<number | null>(null)
 const [worldRank, setWorldRank] = useState<number | null>(null)
 const [f1Unlocked, setF1Unlocked] = useState(false)
 const [justUnlocked, setJustUnlocked] = useState(false)
 const startRef = useRef(0)
 const rafRef = useRef(0)

 useEffect(() => {
   supabase.from('precision_scores').select('player_name, difference_ms')
     .is('game_type', null).order('difference_ms', { ascending: true }).limit(1)
     .then(({ data }) => { if (data?.[0]) setWorldRecord({ diff: data[0].difference_ms, name: data[0].player_name }) })
   if (!profile?.name) return
   supabase.from('precision_scores').select('difference_ms')
     .is('game_type', null).eq('player_name', profile.name)
     .order('difference_ms', { ascending: true }).limit(1)
     .then(({ data }) => { if (data?.[0]) setMyBest(data[0].difference_ms) })
   supabase.from('precision_scores').select('difference_ms')
     .is('game_type', null).eq('player_name', profile.name)
     .lt('difference_ms', 250).limit(1)
     .then(({ data }) => setF1Unlocked(!!(data && data.length > 0)))
 }, [profile?.name])

 const startCountdown = () => {
   setPhase('countdown')
   setCountdown(3)
   let c = 3
   const t = setInterval(() => {
     c--
     if (c === 0) { clearInterval(t); startGame() }
     else setCountdown(c)
   }, 1000)
 }

 const startGame = () => {
   startRef.current = performance.now()
   setElapsed(0)
   setPhase('running')
   const tick = () => {
     setElapsed(performance.now() - startRef.current)
     rafRef.current = requestAnimationFrame(tick)
   }
   rafRef.current = requestAnimationFrame(tick)
 }

 const stopGame = useCallback(async () => {
   if (phase !== 'running') return
   cancelAnimationFrame(rafRef.current)
   const total = performance.now() - startRef.current
   const diff = Math.round(total - 5000)
   setDifference(diff)
   setPhase('result')
   if (profile?.name) {
     await supabase.from('precision_scores').insert({ player_name: profile.name, difference_ms: Math.abs(diff), game_type: null })
     const { count } = await supabase.from('precision_scores').select('*', { count: 'exact', head: true }).is('game_type', null).lt('difference_ms', Math.abs(diff))
     setWorldRank((count ?? 0) + 1)
     if (!f1Unlocked && Math.abs(diff) < 250) { setF1Unlocked(true); setJustUnlocked(true) }
     if (myBest === null || Math.abs(diff) < myBest) setMyBest(Math.abs(diff))
   }
 }, [phase, profile?.name, myBest, f1Unlocked])

 const fmt = (ms: number) => {
   const s = Math.floor(ms / 1000)
   const d = Math.floor((ms % 1000) / 10)
   return `${s}.${String(d).padStart(2, '0')}`
 }

 const resultColor = Math.abs(difference) < 200 ? '#00C853' : Math.abs(difference) < 250 ? '#FF6F00' : '#D32F2F'

 // RULES
 if (phase === 'rules') return (
   <main style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 32 }}>
     <a href="/trainyourbrain" style={{ position: 'absolute', top: 20, right: 20, textDecoration: 'none', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.5)' }}>✕</a>
     <img src="/icons/precision.png" style={{ width: 120, height: 120, objectFit: 'contain' }} />
     <div style={{ textAlign: 'center' }}>
       <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Stop</div>
       <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>Stop the timer at exactly 5.000s</div>
     </div>
     <div style={{ display: 'flex', gap: 12, width: '100%' }}>
       <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px', textAlign: 'center' }}>
         <div style={{ fontSize: 9, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>World Record</div>
         <div style={{ fontSize: 20, fontWeight: 900, color: GOLD }}>{worldRecord ? `${(worldRecord.diff/1000).toFixed(3)}s` : '—'}</div>
         {worldRecord && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginTop: 2 }}>{worldRecord.name}</div>}
       </div>
       <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px', textAlign: 'center' }}>
         <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Your Best</div>
         <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{myBest !== null ? `${(myBest/1000).toFixed(3)}s` : '—'}</div>
       </div>
     </div>
     <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ fontSize: 24 }}>🔑</div><div><div style={{ fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 2 }}>Unlock F1 Reaction</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>Stop within ±0.250s from 5.00s</div></div></div>
     <button onClick={startCountdown} style={{ width: '100%', padding: '20px', borderRadius: 20, border: 'none', background: GREEN, color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #1B5E2080' }}>
       Play →
     </button>
   </main>
 )

 // COUNTDOWN
 if (phase === 'countdown') return (
   <main onClick={undefined} style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <div style={{ fontSize: 160, fontWeight: 900, color: '#fff', animation: 'pulse 0.8s ease-in-out infinite' }}>{countdown}</div>
     <style>{`@keyframes pulse { 0%,100% { transform: scale(1); opacity:1 } 50% { transform: scale(1.1); opacity:0.8 } }`}</style>
   </main>
 )

 // RUNNING
 if (phase === 'running') return (
   <main onClick={stopGame} style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', userSelect: 'none' }}>
     <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Target</div>
     <div style={{ fontSize: 72, fontWeight: 900, color: '#00C853', fontVariantNumeric: 'tabular-nums', letterSpacing: -2, marginBottom: 8 }}>5.00</div><div style={{ fontSize: 72, fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums', letterSpacing: -2 }}>{fmt(elapsed)}</div>
     <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', fontWeight: 700, marginTop: 32 }}>Tap anywhere to stop</div>
   </main>
 )

 // RESULT
 const bgColor = Math.abs(difference) < 200 ? '#0D3320' : Math.abs(difference) < 250 ? '#2D1A00' : '#1A0000'
 return (
   <main style={{ height: '100dvh', background: bgColor, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 24 }}>
     <div style={{ textAlign: 'center' }}>
       <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Difference from 5.000s</div>
       <div style={{ fontSize: 80, fontWeight: 900, color: resultColor, letterSpacing: -2 }}>
         {difference > 0 ? '+' : ''}{(difference/1000).toFixed(3)}s
       </div>
       {worldRank && (
         <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 8 }}>
           #{worldRank} in the world
         </div>
       )}
     </div>

     {/* F1 card */}
     <div style={{ width: '100%', background: f1Unlocked ? 'linear-gradient(135deg, #1B5E20, #2E7D32)' : 'linear-gradient(135deg, #7f0000, #B71C1C)', borderRadius: 20, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
       <img src="/icons/f1.png" style={{ width: 48, height: 48, objectFit: 'contain', opacity: f1Unlocked ? 1 : 0.4, filter: f1Unlocked ? 'none' : 'grayscale(60%)' }} />
       <div style={{ flex: 1 }}>
         <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>F1 Reaction</div>
         <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
           {f1Unlocked ? 'Unlocked' : 'Unlock at 0.250s'}
         </div>
       </div>
       {f1Unlocked ? (
         <a href="/trainyourbrain/f1" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 900, color: '#fff' }}>Play →</a>
       ) : (
         <div style={{ fontSize: 20 }}>🔒</div>
       )}
     </div>

     <div style={{ display: 'flex', gap: 10, width: '100%' }}>
       <button onClick={() => { setPhase('rules'); setJustUnlocked(false) }} style={{ flex: 1, padding: '16px', borderRadius: 16, border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>← Back</button>
       <button onClick={() => { setJustUnlocked(false); startCountdown() }} style={{ flex: 2, padding: '16px', borderRadius: 16, border: 'none', background: GREEN, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 5px 0 #1B5E2080' }}>Play again →</button>
     </div>
   </main>
 )
}
