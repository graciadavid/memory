'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'
const GOLD = '#C8960C'

function getPercentile(diffMs: number, birthYear: number): number {
  const age = new Date().getFullYear() - birthYear
  // Lower diff is better - benchmarks are absolute difference from 5000ms
  const base = age <= 25 ? 150 : age <= 35 ? 200 : age <= 50 ? 280 : 380
  const worst = base * 8
  const pct = Math.max(0, Math.min(100, Math.round((1 - (diffMs - base * 0.2) / worst) * 100)))
  return pct
}

type Phase = 'intro' | 'running' | 'result'

export default function ReactionTimeTestPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [elapsed, setElapsed] = useState(0)
  const [stopped, setStopped] = useState(0)
  const [diff, setDiff] = useState(0)
  const [percentile, setPercentile] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [best, setBest] = useState<number|null>(null)
  const startRef = useRef(0)
  const rafRef = useRef(0)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const s = localStorage.getItem('braintest_session')
    if (s) setSession(JSON.parse(s))
  }, [])

  const startTimer = () => {
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
    const birthYear = session?.birthYear ? parseInt(session.birthYear) : 1990
    const pct = getPercentile(absDiff, birthYear)
    setPercentile(pct)
    if (!best || absDiff < best) setBest(absDiff)
    setAttempt(a => a + 1)
    setPhase('result')
    const name = session?.name || JSON.parse(localStorage.getItem('memgenius_profile') || '{}').name
    if (name) {
      supabase.from('precision_scores').insert({ player_name: name, difference_ms: absDiff, game_type: null })
      supabase.rpc('update_streak', { p_player_name: name })
    }
  }

  const saveAndContinue = () => {
    if (!session) return
    const birthYear = parseInt(session.birthYear)
    const pct = best ? getPercentile(best, birthYear) : percentile
    const updated = { ...session, results: { ...session.results, agility: pct } }
    localStorage.setItem('braintest_session', JSON.stringify(updated))
    window.location.href = '/brain-age-test'
  }

  const displayTime = (phase === 'running' ? elapsed : stopped) / 1000

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>
      <a href="/brain-age-test" style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', textDecoration:'none', display:'block', marginBottom:20 }}>← Brain Age Test</a>

      <div style={{ fontSize:11, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>Step 1 of 4</div>
      <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:4 }}>Reaction Time Test</div>
      <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>Stop the timer at exactly 5 seconds</div>

      {phase === 'intro' && (
        <>
          <div style={{ background:'#252525', borderRadius:16, padding:'20px', marginBottom:20, textAlign:'center' }}>
            <div style={{ fontSize:64, fontWeight:900, color:'rgba(255,255,255,0.15)', marginBottom:8 }}>5.000</div>
            <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>
              Press Start, then tap Stop when you think exactly 5 seconds have passed. No counting allowed!
            </div>
          </div>
          {best !== null && (
            <div style={{ background:'#252525', borderRadius:14, padding:'14px', marginBottom:16, textAlign:'center' }}>
              <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>BEST RESULT</div>
              <div style={{ fontSize:28, fontWeight:900, color:GOLD }}>{best}ms off</div>
              <div style={{ fontSize:13, fontWeight:700, color:GREEN }}>Top {percentile}%</div>
            </div>
          )}
          <button onClick={startTimer}
            style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20', marginBottom:10 }}>
            {attempt === 0 ? 'Start →' : 'Try Again →'}
          </button>
          {attempt > 0 && (
            <button onClick={saveAndContinue}
              style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GOLD, color:'#000', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #8B6914' }}>
              Save & Continue →
            </button>
          )}
        </>
      )}

      {phase === 'running' && (
        <div style={{ textAlign:'center' }} onClick={stopTimer}>
          <div style={{ fontSize:72, fontWeight:900, color: elapsed > 4500 && elapsed < 5500 ? GOLD : '#fff', lineHeight:1, marginBottom:8, fontVariantNumeric:'tabular-nums' }}>
            {displayTime.toFixed(3)}
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:32 }}>Tap to stop at 5.000</div>
          <div style={{ width:'100%', background:'#252525', borderRadius:8, height:8, overflow:'hidden' }}>
            <div style={{ height:'100%', background: elapsed < 5000 ? GREEN : '#D32F2F', borderRadius:8, width:`${Math.min((elapsed/8000)*100, 100)}%`, transition:'width 0.05s' }} />
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div style={{ textAlign:'center' }}>
          <div style={{ width:140, height:140, borderRadius:'50%', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:124, height:124, borderRadius:'50%', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:1 }}>OFF BY</div>
              <div style={{ fontSize:32, fontWeight:900, color:GOLD, lineHeight:1 }}>{diff}ms</div>
              <div style={{ fontSize:13, fontWeight:800, color:GREEN }}>Top {percentile}%</div>
            </div>
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>
            You stopped at {(stopped/1000).toFixed(3)}s
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:24 }}>
            {diff < 50 ? '🎯 Incredible precision!' : diff < 150 ? '⚡ Great timing!' : diff < 300 ? '💪 Good attempt!' : '🔥 Keep training!'}
          </div>
          <button onClick={() => setPhase('intro')}
            style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:'#252525', color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:10 }}>
            Try Again
          </button>
          <button onClick={saveAndContinue}
            style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GOLD, color:'#000', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #8B6914' }}>
            Save & Continue →
          </button>
        </div>
      )}

      <details style={{ marginTop:40 }}>
        <summary style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', cursor:'pointer', listStyle:'none' }}>What does this test measure? ▼</summary>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.7, marginTop:12 }}>
          This reaction time test measures your brain's internal clock — the ability to perceive time precisely without counting. Elite athletes and F1 drivers score under 100ms off. The average person scores around 250ms. Time perception is closely linked to reaction speed, focus and cognitive control. Regular practice can dramatically improve your timing precision.
        </div>
      </details>
    </main>
  )
}
