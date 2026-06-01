'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

type Phase = 'rules' | 'playing' | 'result'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const COLORS = ['#D32F2F','#1565C0','#2E7D32','#F57F17','#6A1B9A','#00838F']

export default function NBackClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [n, setN] = useState(2)
  const [current, setCurrent] = useState<number|null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<any[]>([])
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)
  const [waiting, setWaiting] = useState(false)

  const timerRef = useRef<any>(null)
  const seqRef = useRef<number[]>([])
  const scoreRef = useRef(0)
  const streakRef = useRef(0)
  const nRef = useRef(2)

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('nback_scores').select('player_name, level').order('level', { ascending: false }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
    const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
    setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:'N-'+l})))
    if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
  }, [profile?.name])

  useEffect(() => { loadData() }, [loadData])

  const endGame = useCallback(async () => {
    clearTimeout(timerRef.current)
    const finalLevel = nRef.current
    setPhase('result')
    window.dispatchEvent(new Event('gameResult'))
    const { count } = await supabase.from('nback_scores').select('player_name', { count: 'exact', head: true }).gt('level', finalLevel)
    setWorldRank((count ?? 0) + 1)
    if (profile?.name && finalLevel > 0) await supabase.from('nback_scores').insert({ player_name: profile.name, level: finalLevel })
  }, [profile?.name])

  const showNext = useCallback(() => {
    const newColor = Math.floor(Math.random() * COLORS.length)
    seqRef.current = [...seqRef.current, newColor]
    setCurrent(newColor)
    setWaiting(false)
    setFeedback(null)
    timerRef.current = setTimeout(() => { setCurrent(null); setWaiting(true) }, 800)
  }, [])

  const startGame = () => {
    seqRef.current = []
    scoreRef.current = 0
    streakRef.current = 0
    nRef.current = 2
    setN(2); setScore(0); setStreak(0); setFeedback(null)
    setPhase('playing')
    window.dispatchEvent(new Event('gameStart'))
    showNext()
  }

  const handleMatch = useCallback((userSaysMatch: boolean) => {
    if (!waiting) return
    const idx = seqRef.current.length - 1
    if (idx < nRef.current) { showNext(); return }
    const actualMatch = seqRef.current[idx] === seqRef.current[idx - nRef.current]
    const correct = userSaysMatch === actualMatch
    if (correct) {
      scoreRef.current++; streakRef.current++
      setScore(scoreRef.current); setStreak(streakRef.current)
      setFeedback('correct')
      if (streakRef.current >= 3) {
        nRef.current = Math.min(nRef.current + 1, 6)
        setN(nRef.current); streakRef.current = 0; setStreak(0)
      }
      timerRef.current = setTimeout(showNext, 500)
    } else {
      streakRef.current = 0; setStreak(0); setFeedback('wrong')
      if (scoreRef.current < 3) { timerRef.current = setTimeout(endGame, 800) }
      else { timerRef.current = setTimeout(showNext, 500) }
    }
  }, [waiting, showNext, endGame])

  useEffect(() => { return () => clearTimeout(timerRef.current) }, [])

  const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

  if (phase === 'rules') return <GameRulesScreen icon="nback.png" title="N-Back" subtitle="Does this match the one from N rounds ago?" worldRecord={worldRecord} myBest={myBest !== null ? 'N-'+myBest : null} top5={top5} onPlay={startGame} />

  if (phase === 'result') return (
    <GameResultScreen result={'N-'+n} resultColor={n >= 4 ? '#00C853' : n >= 3 ? GOLD : '#D32F2F'} background={n >= 4 ? '#0D3320' : n >= 3 ? '#2D1A00' : '#1A0000'} worldRank={worldRank} hasProfile={!!profile?.name} onBack={() => { setPhase('rules'); loadData() }} onPlayAgain={startGame}>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Score: {score} correct</div>
    </GameResultScreen>
  )

  return (
    <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, paddingBottom:80 }}>
      <div style={{ display:'flex', gap:16 }}>
        <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>N-{n}</div>
        <div style={{ fontSize:13, fontWeight:800, color:GOLD }}>Score: {score}</div>
      </div>
      <div style={{ width:160, height:160, borderRadius:24, background: current !== null ? COLORS[current] : '#252525', transition:'background 0.15s', boxShadow: current !== null ? '0 0 40px rgba(255,255,255,0.2)' : 'none' }} />
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>
        {current !== null ? 'Watch...' : waiting ? 'Does this match '+n+' steps ago?' : ''}
      </div>
      {feedback && <div style={{ fontSize:24, fontWeight:900, color: feedback === 'correct' ? '#00C853' : '#D32F2F' }}>{feedback === 'correct' ? '✓' : '✗'}</div>}
      <div style={{ display:'flex', gap:12 }}>
        <button onPointerDown={() => handleMatch(false)} disabled={!waiting} style={{ width:130, height:56, borderRadius:16, border:'none', background: waiting ? '#D32F2F' : '#252525', color:'#fff', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor: waiting ? 'pointer' : 'default', opacity: waiting ? 1 : 0.4 }}>No Match</button>
        <button onPointerDown={() => handleMatch(true)} disabled={!waiting} style={{ width:130, height:56, borderRadius:16, border:'none', background: waiting ? GREEN : '#252525', color:'#fff', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor: waiting ? 'pointer' : 'default', opacity: waiting ? 1 : 0.4 }}>Match ✓</button>
      </div>
    </main>
  )
}
