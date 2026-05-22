'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const PURPLE = '#4A148C'
const GREEN = '#2E7D32'
const CREAM = '#FAF7F2'

type Phase = 'rules' | 'countdown' | 'running' | 'result' | 'save'

export default function StopPage() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [countdown, setCountdown] = useState(3)
 const [elapsed, setElapsed] = useState(0)
 const [difference, setDifference] = useState(0)
 const [worldRecord, setWorldRecord] = useState<{ diff: number, name: string } | null>(null)
 const [myBest, setMyBest] = useState<number | null>(null)
 const [worldRank, setWorldRank] = useState<number | null>(null)
 const [top5, setTop5] = useState<{ name: string, diff: number }[]>([])
 const [name, setName] = useState('')
 const [pin, setPin] = useState(['', '', '', ''])
 const [saving, setSaving] = useState(false)
 const [saved, setSaved] = useState(false)
 const startRef = useRef(0)
 const rafRef = useRef(0)
 const diffRef = useRef(0)

 useEffect(() => {
   loadData()
   if (profile?.name) setName(profile.name)
 }, [profile?.name])

 const loadData = async () => {
   const { data: wr } = await supabase.from('precision_scores').select('player_name, difference_ms')
     .is('game_type', null).order('difference_ms', { ascending: true }).limit(1)
   if (wr?.[0]) setWorldRecord({ diff: wr[0].difference_ms, name: wr[0].player_name })

   const { data: all } = await supabase.from('precision_scores').select('player_name, difference_ms')
     .is('game_type', null).order('difference_ms', { ascending: true }).limit(200)
   if (all) {
     const best: Record<string, number> = {}
     all.forEach((s: any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
     setTop5(Object.entries(best).map(([n, d]) => ({ name: n, diff: d })).sort((a, b) => a.diff - b.diff).slice(0, 5))
   }

   if (profile?.name) {
     const { data: mb } = await supabase.from('precision_scores').select('difference_ms')
       .is('game_type', null).eq('player_name', profile.name).order('difference_ms', { ascending: true }).limit(1)
     if (mb?.[0]) setMyBest(mb[0].difference_ms)
   }
 }

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
   diffRef.current = diff
   setDifference(diff)
   setPhase('result')

   if (profile?.name) {
     await supabase.from('precision_scores').insert({ player_name: profile.name, difference_ms: Math.abs(diff), game_type: null })
     const { count } = await supabase.from('precision_scores').select('*', { count: 'exact', head: true }).is('game_type', null).lt('difference_ms', Math.abs(diff))
     setWorldRank((count ?? 0) + 1)
     if (myBest === null || Math.abs(diff) < myBest) setMyBest(Math.abs(diff))
   }
 }, [phase, profile?.name, myBest])

 const saveScore = async () => {
   if (!name.trim() || pin.join('').length !== 4) return
   setSaving(true)
   const pinHash = btoa(pin.join(''))
   await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: pinHash })
   await supabase.from('precision_scores').insert({ player_name: name.trim(), difference_ms: Math.abs(diffRef.current), game_type: null })
   const { count } = await supabase.from('precision_scores').select('*', { count: 'exact', head: true }).is('game_type', null).lt('difference_ms', Math.abs(diffRef.current))
   setWorldRank((count ?? 0) + 1)
   setMyBest(Math.abs(diffRef.current))
   setSaving(false)
   setSaved(true)
   await loadData()
 }

 const fmt = (ms: number) => `${Math.floor(ms/1000)}.${String(Math.floor(ms%1000)).padStart(3,'0')}`
 const resultColor = Math.abs(difference) < 200 ? '#00C853' : Math.abs(difference) < 500 ? '#FF6F00' : '#D32F2F'
 const bgResult = Math.abs(difference) < 200 ? '#0D3320' : Math.abs(difference) < 500 ? '#2D1A00' : '#1A0000'

 // RULES
 if (phase === 'rules') return (
   <main style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 24 }}>
     <a href="/" style={{ position: 'absolute', top: 20, left: 20, textDecoration: 'none', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.5)' }}>← Home</a>
     <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/precision.png" style={{ width: 100, height: 100, objectFit: 'contain' }} />
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

     {/* Top 5 */}
     <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '14px' }}>
       <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Top Players</div>
       {top5.map((p, i) => (
         <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
           <div style={{ fontSize: 12, fontWeight: 900, color: i === 0 ? GOLD : 'rgba(255,255,255,0.3)', width: 16 }}>{i+1}</div>
           <div style={{ flex: 1, fontSize: 13, fontWeight: 800, color: '#fff' }}>{p.name}</div>
           <div style={{ fontSize: 13, fontWeight: 900, color: i === 0 ? GOLD : 'rgba(255,255,255,0.6)' }}>{(p.diff/1000).toFixed(3)}s</div>
         </div>
       ))}
     </div>

     <button onClick={startCountdown} style={{ width: '100%', padding: '20px', borderRadius: 20, border: 'none', background: GREEN, color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #1B5E2080' }}>
       Play →
     </button>
   </main>
 )

 // COUNTDOWN
 if (phase === 'countdown') return (
   <main style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <div style={{ fontSize: 160, fontWeight: 900, color: '#fff' }}>{countdown}</div>
   </main>
 )

 // RUNNING
 if (phase === 'running') return (
   <main onClick={stopGame} style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', userSelect: 'none', gap: 8 }}>
     <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.25)', letterSpacing: 3, textTransform: 'uppercase' }}>Target</div>
     <div style={{ fontSize: 80, fontWeight: 900, color: '#00C853', fontVariantNumeric: 'tabular-nums', letterSpacing: -2 }}>5.00</div>
     <div style={{ width: 60, height: 2, background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
     <div style={{ fontSize: 80, fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums', letterSpacing: -2 }}>{fmt(elapsed)}</div>
     <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.15)', fontWeight: 700, marginTop: 24 }}>Tap anywhere to stop</div>
   </main>
 )

 // RESULT
 return (
   <main style={{ height: '100dvh', background: bgResult, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 20, overflow: 'auto' }}>
     
     {/* Result */}
     <div style={{ textAlign: 'center' }}>
       <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Difference from 5.000s</div>
       <div style={{ fontSize: 80, fontWeight: 900, color: resultColor, letterSpacing: -2 }}>
         {difference > 0 ? '+' : ''}{(difference/1000).toFixed(3)}s
       </div>
       {worldRank && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 8 }}>#{worldRank} in the world</div>}
     </div>

     {/* Save score — only if not logged in */}
     {!profile?.name && !saved && (
       <div style={{ width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '20px' }}>
         <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Save your score</div>
         <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginBottom: 16 }}>Create your free account</div>
         <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 15, fontWeight: 800, fontFamily: 'inherit', outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
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
         <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 4 }}>#{worldRank} in the world</div>
       </div>
     )}

     <div style={{ display: 'flex', gap: 10, width: '100%' }}>
       <button onClick={() => setPhase('rules')} style={{ flex: 1, padding: '16px', borderRadius: 16, border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>← Back</button>
       <button onClick={startCountdown} style={{ flex: 2, padding: '16px', borderRadius: 16, border: 'none', background: GREEN, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 5px 0 #1B5E2080' }}>Play again →</button>
     </div>
   </main>
 )
}
