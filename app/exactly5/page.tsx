'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const GREEN = '#2E7D32'
const RED = '#D32F2F'
const GOLD = '#FFD700'

export default function Exactly5Page() {
  const [name, setName] = useState('')
  const [phase, setPhase] = useState<'intro'|'running'|'result'>('intro')
  const [elapsed, setElapsed] = useState(0)
  const [stopped, setStopped] = useState(0)
  const [diff, setDiff] = useState(0)
  const [myBests, setMyBests] = useState<number[]>([])
  const [lastTimes, setLastTimes] = useState<{name:string, diff:number}[]>([])
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const startRef = useRef(0)
  const rafRef = useRef(0)

  const loadLastTimes = async () => {
    const { data } = await supabase
      .from('precision_scores')
      .select('player_name, difference_ms')
      .eq('game_type', 'exactly5')
      .order('created_at', { ascending: false })
      .limit(30)
    if (data) setLastTimes(data.map((d: any) => ({ name: d.player_name || 'anon', diff: d.difference_ms })))
  }

  useEffect(() => {
    const stored = localStorage.getItem('exactly5_name')
    if (stored) setName(stored)
    loadLastTimes()
    const interval = setInterval(loadLastTimes, 5000)
    return () => clearInterval(interval)
  }, [])

  const startTimer = () => {
    if (!name.trim()) return
    localStorage.setItem('exactly5_name', name.trim())
    startRef.current = Date.now()
    setElapsed(0)
    setPhase('running')
    const tick = () => {
      setElapsed(Date.now() - startRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const stopTimer = () => {
    if (phase !== 'running') return
    cancelAnimationFrame(rafRef.current)
    const ms = Date.now() - startRef.current
    const absDiff = Math.abs(ms - 5000)
    setStopped(ms)
    setDiff(absDiff)
    setMyBests(prev => [...prev, absDiff].sort((a,b) => a-b).slice(0,5))
    setPhase('result')
    supabase.from('precision_scores').insert({ player_name: name.trim(), difference_ms: absDiff, game_type: 'exactly5' }).then(({error}:any) => { if(error) console.error('insert error:', error) })
   supabase.from('precision_scores').select('player_name', { count: 'exact', head: true }).eq('game_type', 'exactly5').lt('difference_ms', absDiff)
     .then(({ count }: any) => setWorldRank((count || 0) + 1))
   setTimeout(loadLastTimes, 500)
   setTimeout(() => setShowPopup(true), 300)
  }

  const reset = () => { setPhase('intro'); setElapsed(0) }

  return (
    <div style={{ minHeight:'100dvh', background:'#0a0a0a', fontFamily:'var(--font-nunito), sans-serif', color:'#fff', maxWidth:430, margin:'0 auto', padding:'16px 16px 80px' }}>

      {/* Title */}
      <div style={{ textAlign:'center', marginBottom:16 }}>
        <div style={{ fontSize:32, fontWeight:900, letterSpacing:-1, marginBottom:12 }}>
          <span style={{ color:'#fff' }}>Exactly</span><span style={{ color:GREEN }}>5</span><span style={{ color:'#fff' }}>.com</span>
        </div>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:4, textTransform:'uppercase', marginBottom:6 }}>Can you stop at</div>
        <div style={{ fontSize:72, fontWeight:900, color:GREEN, lineHeight:1, letterSpacing:-2 }}>5.000</div>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>seconds</div>
      </div>

      {/* Name input — only intro */}
      {phase === 'intro' && (
        <div style={{ marginBottom:12 }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && startTimer()}
            placeholder="Your name"
            maxLength={20}
            style={{ width:'200px', padding:'12px', borderRadius:10, margin:'0 auto', display:'block', border: name.trim() ? `2px solid ${GREEN}` : '2px solid rgba(255,255,255,0.1)', background:'#1a1a1a', color:'#fff', fontSize:15, fontWeight:800, fontFamily:'inherit', outline:'none', boxSizing:'border-box', textAlign:'center', transition:'border 0.2s' }}
          />
        </div>
      )}

      {/* Timer */}
      <div style={{ textAlign:'center', marginBottom:12 }}>
        <div style={{ fontSize:72, fontWeight:900, lineHeight:1, fontVariantNumeric:'tabular-nums', letterSpacing:-2,
          color: phase === 'running'
            ? (elapsed > 4500 && elapsed < 5500 ? GOLD : '#fff')
            : phase === 'result'
            ? (diff < 100 ? GREEN : diff < 300 ? GOLD : RED)
            : '#fff'
        }}>
          {phase === 'running' ? (elapsed/1000).toFixed(3) : phase === 'result' ? (stopped/1000).toFixed(3) : '0.000'}
        </div>
      </div>

      {/* Progress bar */}
      {phase === 'running' && (
        <div style={{ background:'#1a1a1a', borderRadius:8, height:6, marginBottom:16, overflow:'hidden' }}>
          <div style={{ height:'100%', borderRadius:8, background: elapsed < 5000 ? GREEN : RED, width:`${Math.min((elapsed/8000)*100,100)}%` }} />
        </div>
      )}

      {/* Result */}
      {phase === 'result' && (
        <div style={{ textAlign:'center', marginBottom:12 }}>
          <div style={{ fontSize:16, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>
            Off by <span style={{ color:'#fff', fontWeight:900 }}>{diff}ms</span>
          </div>
        </div>
      )}

      {/* START */}
      {phase === 'intro' && (
        <button onClick={startTimer} disabled={!name.trim()}
          style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background: name.trim() ? GREEN : '#222', color: name.trim() ? '#fff' : 'rgba(255,255,255,0.2)', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor: name.trim() ? 'pointer' : 'not-allowed', boxShadow: name.trim() ? '0 5px 0 #1B5E20' : 'none', marginBottom:16, letterSpacing:2, transition:'all 0.2s' }}>
          START
        </button>
      )}

      {/* STOP */}
      {phase === 'running' && (
        <button onClick={stopTimer}
          style={{ width:'100%', padding:'24px', borderRadius:14, border:'none', background:RED, color:'#fff', fontSize:26, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 6px 0 #B71C1C', marginBottom:16, letterSpacing:4 }}>
          STOP
        </button>
      )}

      {/* TRY AGAIN */}
      {phase === 'result' && (
        <button onClick={reset}
          style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:18, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20', marginBottom:16, letterSpacing:2 }}>
          TRY AGAIN
        </button>
      )}

     <a href="https://memgenius.com/brain-age-test" style={{ textDecoration:"none", display:"block", marginBottom:12 }}>
       <div style={{ background:"linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)", borderRadius:14, padding:"16px", textAlign:"center", boxShadow:"0 4px 0 rgba(100,70,0,0.5)" }}>
         <div style={{ fontSize:15, fontWeight:900, color:"#000", letterSpacing:0.5 }}>🧠 What is your Brain Age?</div>
       </div>
     </a>

     {/* Your best */}
      {myBests.length > 0 && (
        <div style={{ background:'#1a1a1a', borderRadius:12, padding:'12px 16px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase' }}>Your Best</div>
          <div style={{ fontSize:18, fontWeight:900, color:GOLD }}>{myBests[0]}ms</div>
        </div>
      )}

      {/* Two columns */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <div style={{ background:'#1a1a1a', borderRadius:12, padding:'12px' }}>
          <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Last Games</div>
          {lastTimes.slice(0,10).map((t, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'4px 0', borderBottom: i < 9 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.6)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:60 }}>{t.name}</div>
              <div style={{ fontSize:13, fontWeight:900, color: t.diff < 100 ? GREEN : t.diff < 300 ? GOLD : 'rgba(255,255,255,0.3)' }}>{t.diff} <span style={{ fontSize:10, fontWeight:700 }}>ms</span></div>
            </div>
          ))}
        </div>
        <div style={{ background:'#1a1a1a', borderRadius:12, padding:'12px' }}>
          <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Best Times</div>
          {[...lastTimes].sort((a,b) => a.diff - b.diff).slice(0,10).map((t, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'4px 0', borderBottom: i < 9 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.6)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:60 }}>{t.name}</div>
              <div style={{ fontSize:13, fontWeight:900, color: i===0 ? GOLD : t.diff < 100 ? GREEN : 'rgba(255,255,255,0.3)' }}>{t.diff} <span style={{ fontSize:10, fontWeight:700 }}>ms</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Result Popup */}
     {showPopup && (
       <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:'var(--font-nunito), sans-serif' }}>
         <div style={{ background:'#111', borderRadius:24, padding:'28px 24px', width:'100%', maxWidth:360, border:'1px solid rgba(255,255,255,0.1)', textAlign:'center' }}>
           <div style={{ fontSize:48, fontWeight:900, color: diff < 100 ? '#2E7D32' : diff < 300 ? GOLD : '#D32F2F', marginBottom:4 }}>{diff}ms</div>
           <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:16 }}>off from 5 seconds</div>
           {worldRank && (
             <div style={{ background:'rgba(200,150,12,0.15)', borderRadius:14, padding:'12px', marginBottom:20, border:'1px solid rgba(200,150,12,0.2)' }}>
               <div style={{ fontSize:28, fontWeight:900, color:GOLD }}>#{worldRank} in the world</div>
               <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>on Exactly5</div>
             </div>
           )}
           <a href="https://memgenius.com/brain-age-test" style={{ textDecoration:'none', display:'block', marginBottom:10 }}>
             <div style={{ background:'#2E7D32', borderRadius:14, padding:'16px', color:'#fff', fontSize:15, fontWeight:900, boxShadow:'0 5px 0 #1B5E20' }}>
               🧠 Discover your Brain Age
             </div>
           </a>
           <button onClick={() => { setShowPopup(false); setPhase('intro') }}
             style={{ width:'100%', padding:'14px', borderRadius:14, border:'1px solid rgba(255,255,255,0.15)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:14, fontWeight:800, fontFamily:'inherit', cursor:'pointer' }}>
             Keep playing Exactly5
           </button>
         </div>
       </div>
     )}

     <div style={{ textAlign:'center', marginTop:20, fontSize:11, color:'rgba(255,255,255,0.15)', fontWeight:700 }}>
        a <a href="https://memgenius.com" style={{ color:'rgba(255,255,255,0.2)', textDecoration:'none' }}>MemGenius</a> game
      </div>

    </div>
  )
}
