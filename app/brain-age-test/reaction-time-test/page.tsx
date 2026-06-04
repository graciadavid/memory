'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'
const GOLD = '#C8960C'

// Benchmarks by age group - reaction time in ms (lower is better)
const BENCHMARKS: Record<string, number[]> = {
  '18-25': [130,145,152,158,165,171,178,185,192,200,208,216,225,234,244,254,265,276,288,300,313,326,340,355,370,386,403,421,440,460,481,503,526,551,577,605,634,665,698,733,770,809,851,895,942,992,1045,1101,1160,1222],
  '26-35': [145,160,168,175,182,190,198,206,215,224,234,244,255,266,278,291,304,318,333,348,365,382,400,419,440,461,484,508,534,561,590,621,654,688,725,764,805,849,896,946,999,1056,1116,1180,1248,1320,1397,1479,1566,1659],
  '36-50': [160,178,187,196,205,215,225,236,247,259,272,285,299,314,330,346,364,382,402,423,445,468,493,519,547,577,608,641,677,714,754,796,841,889,940,994,1052,1113,1178,1247,1321,1400,1483,1572,1667,1768,1876,1991,2114,2245],
  '50+':   [180,200,210,221,232,244,256,269,283,298,313,330,347,365,385,405,427,450,474,500,527,556,587,619,654,690,729,770,814,860,909,961,1017,1076,1139,1206,1277,1353,1433,1519,1611,1709,1813,1924,2043,2170,2306,2452,2608,2776],
}

function getPercentile(ms: number, birthYear: number): number {
  const age = new Date().getFullYear() - birthYear
  const group = age <= 25 ? '18-25' : age <= 35 ? '26-35' : age <= 50 ? '36-50' : '50+'
  const bench = BENCHMARKS[group]
  const below = bench.filter(b => ms < b).length
  return Math.round((below / bench.length) * 100)
}

type Phase = 'intro' | 'waiting' | 'ready' | 'toosoon' | 'result'

export default function ReactionTimeTestPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [reactionMs, setReactionMs] = useState(0)
  const [percentile, setPercentile] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [best, setBest] = useState<number|null>(null)
  const startRef = useRef(0)
  const timerRef = useRef<any>(null)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const s = localStorage.getItem('braintest_session')
    if (s) setSession(JSON.parse(s))
  }, [])

  const startWaiting = () => {
    setPhase('waiting')
    const delay = 1500 + Math.random() * 3000
    timerRef.current = setTimeout(() => {
      startRef.current = Date.now()
      setPhase('ready')
    }, delay)
  }

  const handleTap = () => {
    if (phase === 'waiting') {
      clearTimeout(timerRef.current)
      setPhase('toosoon')
      return
    }
    if (phase === 'ready') {
      const ms = Date.now() - startRef.current
      setReactionMs(ms)
      const birthYear = session?.birthYear ? parseInt(session.birthYear) : 1990
      const pct = getPercentile(ms, birthYear)
      setPercentile(pct)
      if (!best || ms < best) setBest(ms)
      setAttempt(a => a + 1)
      setPhase('result')
      // Save to supabase
      const name = session?.name || JSON.parse(localStorage.getItem('memgenius_profile') || '{}').name
      if (name) {
        supabase.from('precision_scores').insert({ player_name: name, difference_ms: ms, game_type: 'formula1' })
        supabase.rpc('update_streak', { p_player_name: name })
      }
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

  const bgColor = phase === 'waiting' ? '#1A1A1A' : phase === 'ready' ? GREEN : phase === 'toosoon' ? '#D32F2F' : '#1A1A1A'

  return (
    <main onClick={['waiting','ready'].includes(phase) ? handleTap : undefined}
      style={{ minHeight:'100dvh', background:bgColor, padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto', transition:'background 0.2s', cursor: ['waiting','ready'].includes(phase) ? 'pointer' : 'default', userSelect:'none' }}>

      <a href="/brain-age-test" style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', textDecoration:'none', display:'block', marginBottom:20 }}>← Brain Age Test</a>

      <div style={{ fontSize:11, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>Step 1 of 4</div>
      <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:4 }}>Reaction Time Test</div>
      <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>How fast does your brain react?</div>

      {phase === 'intro' && (
        <>
          <div style={{ background:'#252525', borderRadius:16, padding:'20px', marginBottom:20, textAlign:'center' }}>
            <img src={`${BASE}/precision.png`} style={{ width:56, height:56, objectFit:'contain', marginBottom:12 }} />
            <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>
              Wait for the screen to turn green, then tap as fast as you can.
            </div>
          </div>
          {best && (
            <div style={{ background:'#252525', borderRadius:14, padding:'14px', marginBottom:16, textAlign:'center' }}>
              <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>BEST TIME</div>
              <div style={{ fontSize:28, fontWeight:900, color:GOLD }}>{best}ms</div>
              <div style={{ fontSize:13, fontWeight:700, color:GREEN }}>Top {percentile}%</div>
            </div>
          )}
          <button onClick={startWaiting}
            style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20', marginBottom:12 }}>
            {attempt === 0 ? 'Start Test →' : 'Try Again →'}
          </button>
          {attempt > 0 && (
            <button onClick={saveAndContinue}
              style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GOLD, color:'#000', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #8B6914' }}>
              Save & Continue →
            </button>
          )}
        </>
      )}

      {phase === 'waiting' && (
        <div style={{ textAlign:'center', paddingTop:60 }}>
          <div style={{ fontSize:20, fontWeight:900, color:'rgba(255,255,255,0.6)' }}>Wait for green...</div>
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.3)', marginTop:8 }}>Tap anywhere when ready</div>
        </div>
      )}

      {phase === 'ready' && (
        <div style={{ textAlign:'center', paddingTop:60 }}>
          <div style={{ fontSize:32, fontWeight:900, color:'#fff' }}>TAP NOW!</div>
        </div>
      )}

      {phase === 'toosoon' && (
        <div style={{ textAlign:'center', paddingTop:60 }}>
          <div style={{ fontSize:24, fontWeight:900, color:'#fff', marginBottom:8 }}>Too soon! 😅</div>
          <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:32 }}>Wait for the green screen</div>
          <button onClick={() => setPhase('intro')}
            style={{ padding:'16px 32px', borderRadius:14, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
            Try Again
          </button>
        </div>
      )}

      {phase === 'result' && (
        <div style={{ textAlign:'center' }}>
          <div style={{ width:140, height:140, borderRadius:'50%', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:124, height:124, borderRadius:'50%', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:1 }}>YOUR TIME</div>
              <div style={{ fontSize:36, fontWeight:900, color:GOLD, lineHeight:1 }}>{reactionMs}ms</div>
              <div style={{ fontSize:13, fontWeight:800, color:GREEN }}>Top {percentile}%</div>
            </div>
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:24 }}>
            {percentile <= 25 ? 'Elite reaction speed! 🚀' : percentile <= 50 ? 'Above average! 💪' : percentile <= 75 ? 'Room to improve 🧠' : 'Keep training! 🔥'}
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
        <summary style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', cursor:'pointer', listStyle:'none' }}>What is a Reaction Time Test? ▼</summary>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.7, marginTop:12 }}>
          A reaction time test measures how quickly your brain processes a stimulus and responds. The average human reaction time is 250ms. F1 drivers react in around 150ms. Reaction time naturally slows with age, but regular training can significantly improve it. This free online reaction time test gives you an accurate measurement in milliseconds and compares you to people your age worldwide.
        </div>
      </details>
    </main>
  )
}
