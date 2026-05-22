'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const PURPLE = '#4A148C'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

type Phase = 'rules' | 'countdown' | 'running' | 'result'

export default function StopPage() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [countdown, setCountdown] = useState(3)
 const [elapsed, setElapsed] = useState(0)
 const [difference, setDifference] = useState(0)
 const [worldRank, setWorldRank] = useState<number | null>(null)
 const [name, setName] = useState('')
 const [pin, setPin] = useState(['', '', '', ''])
 const [saved, setSaved] = useState(false)
 const [saving, setSaving] = useState(false)
  const [worldRecord, setWorldRecord] = useState<{diff:number,name:string}|null>(null)
  const [top5, setTop5] = useState<{name:string,diff:number}[]>([])
 const startRef = useRef(0)
 const rafRef = useRef(0)

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
   const tick = () => { setElapsed(performance.now() - startRef.current); rafRef.current = requestAnimationFrame(tick) }
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
   }
 }, [phase, profile?.name])

 const saveScore = async () => {
   if (!name.trim() || pin.join('').length !== 4) return
   setSaving(true)
   await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: btoa(pin.join('')) })
   await supabase.from('precision_scores').insert({ player_name: name.trim(), difference_ms: Math.abs(difference), game_type: null })
   const { count } = await supabase.from('precision_scores').select('*', { count: 'exact', head: true }).is('game_type', null).lt('difference_ms', Math.abs(difference))
   setWorldRank((count ?? 0) + 1)
   setSaving(false)
   setSaved(true)
   setTimeout(() => window.location.reload(), 1500)
 }

 const fmt = (ms: number) => `${Math.floor(ms/1000)}.${String(Math.floor(ms%1000)).padStart(3,'0')}`
 const resultColor = Math.abs(difference) < 200 ? '#00C853' : Math.abs(difference) < 500 ? '#FF6F00' : '#D32F2F'
 const bgResult = Math.abs(difference) < 200 ? '#0D3320' : Math.abs(difference) < 500 ? '#2D1A00' : '#1A0000'

 if (phase === 'rules') return (
   <main style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', padding: '20px 24px 100px' }}>
     <a href="/" style={{ alignSelf: 'flex-start', textDecoration: 'none', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>← Home</a>
     
     {/* Header row */}
     <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
       <img src={`${BASE}/precision.png`} style={{ width: 56, height: 56, objectFit: 'contain' }} />
       <div>
         <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>Stop</div>
         <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Stop at exactly 5.000s</div>
       </div>
     </div>

     <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 700, lineHeight: 1.7, marginBottom: 32 }}>
       Press Play, start a timer and stop it at exactly <span style={{ color: '#00C853', fontWeight: 900 }}>5.000s</span>. The closer, the better.
     </div>

     <div style={{ marginTop: 'auto' }}>
       <button onClick={startCountdown} style={{ width: '100%', padding: '20px', borderRadius: 20, border: 'none', background: GREEN, color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #1B5E2080' }}>
         Play →
       </button>
     </div>
   </main>
 )

 if (phase === 'countdown') return (
   <main style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <div style={{ fontSize: 160, fontWeight: 900, color: '#fff' }}>{countdown}</div>
   </main>
 )

 if (phase === 'running') return (
   <main onClick={stopGame} style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', userSelect: 'none', gap: 8 }}>
     <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.25)', letterSpacing: 3, textTransform: 'uppercase' }}>Target</div>
     <div style={{ fontSize: 80, fontWeight: 900, color: '#00C853', fontVariantNumeric: 'tabular-nums', letterSpacing: -2 }}>5.00</div>
     <div style={{ width: 60, height: 2, background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
     <div style={{ fontSize: 80, fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums', letterSpacing: -2 }}>{fmt(elapsed)}</div>
     <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.15)', fontWeight: 700, marginTop: 24 }}>Tap anywhere to stop</div>
   </main>
 )

 return (
   <main style={{ height: '100dvh', background: bgResult, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px 100px', gap: 20, overflowY: 'auto' }}>
     <div style={{ textAlign: 'center' }}>
       <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Difference from 5.000s</div>
       <div style={{ fontSize: 80, fontWeight: 900, color: resultColor, letterSpacing: -2 }}>
         {difference > 0 ? '+' : ''}{(difference/1000).toFixed(3)}s
       </div>
       {worldRank && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 8 }}>#{worldRank} in the world</div>}
     </div>

     {!profile?.name && !saved && (
       <div style={{ width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '20px' }}>
         <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Save your score</div>
         <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 16 }}>Create your free account</div>
         <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 15, fontWeight: 800, fontFamily: 'inherit', outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
         <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
           {pin.map((d, i) => (
             <input key={i} id={`pin-${i}`} type="tel" maxLength={1} value={d}
               onChange={e => { const v = e.target.value.replace(/\D/,''); const p=[...pin]; p[i]=v; setPin(p); if(v && i<3) (document.getElementById(`pin-${i+1}`) as HTMLInputElement)?.focus() }}
               style={{ width: 44, height: 52, textAlign: 'center', fontSize: 24, fontWeight: 900, borderRadius: 12, border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'inherit', outline: 'none' }} />
           ))}
         </div>
         <button onClick={saveScore} disabled={!name.trim() || pin.join('').length !== 4 || saving} style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: name.trim() && pin.join('').length === 4 ? GREEN : 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>
           {saving ? 'Saving...' : 'Save →'}
         </button>
       </div>
     )}

     {saved && (
       <div style={{ background: 'rgba(46,125,50,0.3)', borderRadius: 16, padding: '14px 20px', textAlign: 'center' }}>
         <div style={{ fontSize: 15, fontWeight: 900, color: '#69F0AE' }}>✓ Score saved!</div>
         <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 4 }}>#{worldRank} in the world</div>
       </div>
     )}

     <div style={{ display: 'flex', gap: 10, width: '100%' }}>
       <button onClick={() => { setPhase('rules'); setSaved(false) }} style={{ flex: 1, padding: '16px', borderRadius: 16, border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>← Back</button>
       <button onClick={() => { setSaved(false); startCountdown() }} style={{ flex: 2, padding: '16px', borderRadius: 16, border: 'none', background: GREEN, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 5px 0 #1B5E2080' }}>Play again →</button>
     </div>
   </main>
 )
}
