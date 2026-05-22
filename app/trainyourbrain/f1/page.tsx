'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const RED = '#E8002D'
const GREEN = '#2E7D32'
const BLACK = '#1a1a1a'

type Phase = 'rules' | 'lighting' | 'waiting' | 'go' | 'result' | 'jumpstart'

export default function F1Page() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [litCount, setLitCount] = useState(0)
 const [reactionMs, setReactionMs] = useState(0)
 const [worldRecord, setWorldRecord] = useState<{ diff: number, name: string } | null>(null)
 const [myBest, setMyBest] = useState<number | null>(null)
 const [worldRank, setWorldRank] = useState<number | null>(null)
 const [pendulumUnlocked, setPendulumUnlocked] = useState(false)
 const [justUnlocked, setJustUnlocked] = useState(false)
 const goTimeRef = useRef(0)
 const timeoutRef = useRef<NodeJS.Timeout | null>(null)

 useEffect(() => {
   supabase.from('precision_scores').select('player_name, difference_ms')
     .eq('game_type', 'formula1').order('difference_ms', { ascending: true }).limit(1)
     .then(({ data }) => { if (data?.[0]) setWorldRecord({ diff: data[0].difference_ms, name: data[0].player_name }) })
   if (!profile?.name) return
   supabase.from('precision_scores').select('difference_ms')
     .eq('game_type', 'formula1').eq('player_name', profile.name)
     .order('difference_ms', { ascending: true }).limit(1)
     .then(({ data }) => { if (data?.[0]) setMyBest(data[0].difference_ms) })
   supabase.from('precision_scores').select('difference_ms')
     .eq('game_type', 'formula1').eq('player_name', profile.name)
     .lt('difference_ms', 300).limit(1)
     .then(({ data }) => setPendulumUnlocked(!!(data && data.length > 0)))
 }, [profile?.name])

 const startSequence = () => {
   setPhase('lighting')
   setLitCount(0)
   let count = 0
   const lightUp = () => {
     count++
     setLitCount(count)
     if (count < 5) {
       timeoutRef.current = setTimeout(lightUp, 800)
     } else {
       setPhase('waiting')
       const waitMs = 500 + Math.random() * 2500
       timeoutRef.current = setTimeout(() => {
         setPhase('go')
         goTimeRef.current = Date.now()
       }, waitMs)
     }
   }
   timeoutRef.current = setTimeout(lightUp, 600)
 }

 const handlePress = useCallback(async () => {
   if (phase === 'lighting' || phase === 'waiting') {
     if (timeoutRef.current) clearTimeout(timeoutRef.current)
     setPhase('jumpstart')
     return
   }
   if (phase === 'go') {
     const reaction = Date.now() - goTimeRef.current
     setReactionMs(reaction)
     setPhase('result')
     if (profile?.name) {
       await supabase.from('precision_scores').insert({ player_name: profile.name, difference_ms: reaction, game_type: 'formula1' })
       const { count } = await supabase.from('precision_scores').select('*', { count: 'exact', head: true }).eq('game_type', 'formula1').lt('difference_ms', reaction)
       setWorldRank((count ?? 0) + 1)
       if (!pendulumUnlocked && reaction < 300) { setPendulumUnlocked(true); setJustUnlocked(true) }
       if (myBest === null || reaction < myBest) setMyBest(reaction)
     }
   }
 }, [phase, profile?.name, myBest, pendulumUnlocked])

 const reset = () => {
   if (timeoutRef.current) clearTimeout(timeoutRef.current)
   setPhase('rules')
   setLitCount(0)
   setJustUnlocked(false)
 }

 const Semaphore = ({ lit }: { lit: boolean }) => (
   <div style={{ background: BLACK, borderRadius: 8, padding: '5px 4px', display: 'flex', flexDirection: 'column', gap: 4, border: '2px solid #333' }}>
     {[0,1,2].map(i => (
       <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: lit && i >= 1 ? RED : '#2a2a2a', boxShadow: lit && i >= 1 ? `0 0 10px ${RED}` : 'none', transition: 'all 0.15s' }} />
     ))}
   </div>
 )

 const resultColor = reactionMs < 200 ? '#00C853' : reactionMs < 300 ? '#FF6F00' : '#D32F2F'
 const bgResult = reactionMs < 200 ? '#0D3320' : reactionMs < 300 ? '#2D1A00' : '#1A0000'

 // RULES
 if (phase === 'rules') return (
   <main style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 32 }}>
     <a href="/trainyourbrain" style={{ position: 'absolute', top: 20, right: 20, textDecoration: 'none', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.5)' }}>✕</a>
     <img src="/icons/f1.png" style={{ width: 120, height: 120, objectFit: 'contain' }} />
     <div style={{ textAlign: 'center' }}>
       <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 8 }}>F1 Reaction</div>
       <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>React when the lights go out</div>
     </div>
     <div style={{ display: 'flex', gap: 12, width: '100%' }}>
       <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px', textAlign: 'center' }}>
         <div style={{ fontSize: 9, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>World Record</div>
         <div style={{ fontSize: 20, fontWeight: 900, color: GOLD }}>{worldRecord ? `${worldRecord.diff}ms` : '—'}</div>
         {worldRecord && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginTop: 2 }}>{worldRecord.name}</div>}
       </div>
       <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px', textAlign: 'center' }}>
         <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Your Best</div>
         <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{myBest !== null ? `${myBest}ms` : '—'}</div>
       </div>
     </div>
     <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
       <div style={{ fontSize: 24 }}>🔑</div>
       <div>
         <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 2 }}>Unlock Pendulum</div>
         <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>React in less than 300ms</div>
       </div>
     </div>
     <button onClick={startSequence} style={{ width: '100%', padding: '20px', borderRadius: 20, border: 'none', background: RED, color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 8px 0 ${RED}80` }}>
       Get Ready →
     </button>
   </main>
 )

 // JUMPSTART
 if (phase === 'jumpstart') return (
   <main style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '32px 24px' }}>
     <div style={{ fontSize: 64, fontWeight: 900, color: RED }}>🚩</div>
     <div style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>Jump Start!</div>
     <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>You pressed too early</div>
     <button onClick={reset} style={{ width: '100%', padding: '20px', borderRadius: 20, border: 'none', background: RED, color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 8px 0 ${RED}80` }}>Try again →</button>
   </main>
 )

 // GAME (lighting, waiting, go)
 if (phase === 'lighting' || phase === 'waiting' || phase === 'go') return (
   <main style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '32px 24px' }}>
     <div style={{ display: 'flex', gap: 6 }}>
       {[1,2,3,4,5].map(n => (
         <Semaphore key={n} lit={phase === 'waiting' ? true : phase === 'go' ? false : litCount >= n} />
       ))}
     </div>
     <div style={{ flex: 1 }} />
     <button onClick={handlePress} style={{ width: '100%', padding: '24px', borderRadius: 20, border: 'none', background: phase === 'go' ? '#00C853' : 'rgba(255,255,255,0.1)', color: phase === 'go' ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 22, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: phase === 'go' ? '0 8px 0 #00952080' : 'none', transition: 'all 0.1s' }}>
       ACCELERATE
     </button>
   </main>
 )

 // RESULT
 return (
   <main style={{ height: '100dvh', background: bgResult, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 24 }}>
     <div style={{ textAlign: 'center' }}>
       <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Reaction Time</div>
       <div style={{ fontSize: 80, fontWeight: 900, color: resultColor, letterSpacing: -2 }}>{reactionMs}ms</div>
       {worldRank && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 8 }}>#{worldRank} in the world</div>}
     </div>

     <div style={{ width: '100%', background: pendulumUnlocked ? 'linear-gradient(135deg, #1B5E20, #2E7D32)' : 'linear-gradient(135deg, #7f0000, #B71C1C)', borderRadius: 20, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
       <img src="/icons/pendulum.png" style={{ width: 48, height: 48, objectFit: 'contain', opacity: pendulumUnlocked ? 1 : 0.4, filter: pendulumUnlocked ? 'none' : 'grayscale(60%)' }} />
       <div style={{ flex: 1 }}>
         <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>Pendulum</div>
         <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
           {justUnlocked ? 'Just unlocked!' : pendulumUnlocked ? 'Unlocked' : 'React < 300ms to unlock'}
         </div>
       </div>
       {pendulumUnlocked ? (
         <a href="/trainyourbrain/pendulum" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.25)', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 900, color: '#fff' }}>Play →</a>
       ) : (
         <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px', fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>300ms</div>
       )}
     </div>

     <div style={{ display: 'flex', gap: 10, width: '100%' }}>
       <button onClick={reset} style={{ flex: 1, padding: '16px', borderRadius: 16, border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>← Back</button>
       <button onClick={() => { setJustUnlocked(false); startSequence() }} style={{ flex: 2, padding: '16px', borderRadius: 16, border: 'none', background: RED, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 5px 0 ${RED}80` }}>Play again →</button>
     </div>
   </main>
 )
}
