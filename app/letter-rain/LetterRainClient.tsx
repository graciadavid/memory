'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

type Phase = 'rules' | 'falling' | 'answer' | 'result'

const GREEN = '#2E7D32'
const GOLD = '#C8960C'
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

interface FallingLetter {
  id: number
  char: string
  x: number
  y: number
  speed: number
}

export default function LetterRainClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [levelIdx, setLevelIdx] = useState(0)
  const [letters, setLetters] = useState<FallingLetter[]>([])
  const [correctCount, setCorrectCount] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState(10)
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)

  const idRef = useRef(0)
  const intervalRef = useRef<any>(null)
  const timerRef = useRef<any>(null)
  const animRef = useRef<any>(null)
  const correctRef = useRef(0)
  const levelIdxRef = useRef(0)

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('letter_rain_scores')
      .select('player_name, level').order('level', { ascending: false }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
    const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
    setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:`Level ${l}`})))
    const stored = typeof window !== 'undefined' ? localStorage.getItem('memgenius_profile') : null
    const pName = stored ? JSON.parse(stored).name : null
    if (pName && best[pName] !== undefined) setMyBest(best[pName])
  }, [profile?.name])

  useEffect(() => { loadData() }, [loadData])

  const endGame = useCallback(async () => {
    clearInterval(intervalRef.current)
    clearInterval(timerRef.current)
    cancelAnimationFrame(animRef.current)
    const finalLevel = levelIdxRef.current
    setPhase('result')
    window.dispatchEvent(new Event('gameResult'))

    const { count } = await supabase.from('letter_rain_scores')
      .select('player_name', { count: 'exact', head: true }).gt('level', finalLevel)
    setWorldRank((count ?? 0) + 1)

    if (profile?.name && finalLevel > 0) {
      { await supabase.from('letter_rain_scores').insert({ player_name: profile.name, level: finalLevel }); supabase.rpc("update_streak", { p_player_name: profile.name }) }
  }, [profile?.name])

  const startLevel = useCallback((idx: number) => {
    levelIdxRef.current = idx
    correctRef.current = 0
    setCorrectCount(0)
    setLetters([])
    setUserAnswer('')
    setFeedback(null)
    setTimeLeft(10)

    const target = LETTERS[idx % 26]
    setPhase('falling')

    // Spawn letters
    const spawnInterval = Math.max(150, 500 - (levelIdxRef.current % 26) * 14)
    const letterSpeed = 0.4 + (Math.floor(levelIdxRef.current / 26) * 0.3)
    intervalRef.current = setInterval(() => {
      const isTarget = Math.random() < 0.35
      const char = isTarget ? target : LETTERS.replace(target, '')[Math.floor(Math.random() * 25)]
      if (isTarget) {
        correctRef.current++
        setCorrectCount(c => c + 1)
      }
      setLetters(prev => [...prev, {
        id: idRef.current++,
        char,
        x: Math.random() * 80 + 10,
        y: 0,
        speed: letterSpeed + Math.random() * 0.3,
      }])
    }, spawnInterval)

    // Timer
    const baseDuration = 10 + Math.floor(levelIdxRef.current / 26) * 3
    let t = baseDuration
    timerRef.current = setInterval(() => {
      t--
      setTimeLeft(t)
      if (t <= 0) {
        clearInterval(timerRef.current)
        clearInterval(intervalRef.current)
        cancelAnimationFrame(animRef.current)
        setLetters([])
        setPhase('answer')
      }
    }, 1000)

    // Animate
    const animate = () => {
      setLetters(prev => prev.map(l => ({ ...l, y: l.y + l.speed })).filter(l => l.y < 110))
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
  }, [])

  const startGame = () => {
    setLevelIdx(0)
    levelIdxRef.current = 0
    startLevel(0)
    window.dispatchEvent(new Event('gameStart'))
  }

  const handleSubmit = () => {
    const answer = parseInt(userAnswer)
    if (answer === correctRef.current) {
      setFeedback('correct')
      setTimeout(() => {
        const next = levelIdxRef.current + 1
        if (next >= 26) { endGame(); return }
        setLevelIdx(next)
        startLevel(next)
      }, 800)
    } else {
      setFeedback('wrong')
      setTimeout(() => endGame(), 1000)
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
      clearInterval(timerRef.current)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  const target = LETTERS[levelIdx % 26]
  const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

  if (phase === 'rules') return (
    <GameRulesScreen
      icon="rain.png"
      title="Letter Rain"
      subtitle="Count the target letter as it falls"
      worldRecord={worldRecord}
      myBest={myBest !== null ? `Level ${myBest}` : null}
      top5={top5}
      onPlay={startGame}
    />
  )

  if (phase === 'result') return (
    <GameResultScreen
      result={`Level ${levelIdx}`}
      resultColor={levelIdx >= 10 ? '#00C853' : levelIdx >= 5 ? GOLD : '#D32F2F'}
      background={levelIdx >= 10 ? '#0D3320' : levelIdx >= 5 ? '#2D1A00' : '#1A0000'}
      worldRank={worldRank}
      hasProfile={!!profile?.name}
      onBack={() => { setPhase('rules'); loadData() }}
      onPlayAgain={startGame}
    />
  )

  if (phase === 'answer') return (
    <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, padding:24, paddingBottom:80 }}>
      <div style={{ fontSize:16, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>How many <span style={{ color:GOLD, fontSize:32, fontWeight:900 }}>{target}</span> did you count?</div>
      <input
        type="number"
        value={userAnswer}
        onChange={e => setUserAnswer(e.target.value)}
        autoFocus
        style={{ width:120, height:80, textAlign:'center', fontSize:40, fontWeight:900, borderRadius:16, border:`2px solid ${feedback === 'wrong' ? '#D32F2F' : feedback === 'correct' ? '#00C853' : 'rgba(255,255,255,0.2)'}`, background:'#252525', color:'#fff', outline:'none', fontFamily:'inherit' }}
      />
      {feedback === 'correct' && <div style={{ fontSize:20, fontWeight:900, color:'#00C853' }}>✓ Correct!</div>}
      {feedback === 'wrong' && <div style={{ fontSize:20, fontWeight:900, color:'#D32F2F' }}>✗ Wrong! It was {correctRef.current}</div>}
      {!feedback && (
        <button onClick={handleSubmit} style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:18, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20' }}>
          Submit →
        </button>
      )}
    </main>
  )

  return (
    <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden', paddingBottom:80 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px' }}>
        <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>Level {levelIdx + 1}</div>
        <div style={{ fontSize:48, fontWeight:900, color:GOLD }}>{target}</div>
        <div style={{ fontSize:22, fontWeight:900, color: timeLeft <= 3 ? '#D32F2F' : 'rgba(255,255,255,0.5)' }}>{timeLeft}s</div>
      </div>

      <div style={{ flex:1, position:'relative', overflow:'hidden', background:'rgba(0,0,0,0.2)', margin:'0 8px', borderRadius:12 }}>
        {letters.map(l => (
          <div key={l.id} style={{
            position:'absolute',
            left:`${l.x}%`,
            top:`${l.y}%`,
            fontSize:28,
            fontWeight:900,
            color: l.char === target ? '#69F0AE' : 'rgba(255,255,255,0.35)',
            transform:'translateX(-50%)',
          }}>{l.char}</div>
        ))}
      </div>
    </main>
  )
}
