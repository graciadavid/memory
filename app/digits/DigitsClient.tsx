'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

type Phase = 'rules' | 'show' | 'input' | 'feedback' | 'result'
const GOLD = '#C8960C'
const GREEN = '#2E7D32'

export default function DigitsClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [level, setLevel] = useState(1)
  const [sequence, setSequence] = useState<number[]>([])
  const [input, setInput] = useState<number[]>([])
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState(3)
  const timerRef = useRef<any>(null)
  const levelRef = useRef(1)

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('number_scores').select('player_name, level').order('level', { ascending: false }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
    const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
    setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score: l+' digits'})))
    if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
  }, [profile?.name])

  useEffect(() => { loadData() }, [loadData])

  const startLevel = useCallback((lvl: number) => {
    levelRef.current = lvl
    setLevel(lvl)
    setInput([])
    setFeedback(null)
    const seq = Array.from({ length: lvl }, () => Math.floor(Math.random() * 10))
    setSequence(seq)
    setPhase('show')
    const showTime = Math.max(2, lvl)
    setTimeLeft(showTime)
    let t = showTime
    timerRef.current = setInterval(() => {
      t--
      setTimeLeft(t)
      if (t <= 0) {
        clearInterval(timerRef.current)
        setPhase('input')
        setInput([])
      }
    }, 1000)
  }, [])

  const startGame = () => {
    levelRef.current = 1
    startLevel(1)
    window.dispatchEvent(new Event('gameStart'))
  }

  const handleInput = useCallback(async (digit: number | '⌫') => {
    if (phase !== 'input') return
    if (digit === '⌫') { setInput(p => p.slice(0,-1)); return }
    const newInput = [...input, digit]
    setInput(newInput)
    if (newInput.length === sequence.length) {
      const correct = newInput.every((d, i) => d === sequence[i])
      setFeedback(correct ? 'correct' : 'wrong')
      setPhase('feedback')
      if (correct) {
        timerRef.current = setTimeout(() => startLevel(levelRef.current + 1), 800)
      } else {
        const finalLevel = levelRef.current - 1
        timerRef.current = setTimeout(async () => {
          setPhase('result')
          window.dispatchEvent(new Event('gameResult'))
          const { count } = await supabase.from('number_scores').select('player_name', { count: 'exact', head: true }).gt('level', finalLevel)
          setWorldRank((count ?? 0) + 1)
          if (profile?.name && finalLevel > 0) await supabase.from('number_scores').insert({ player_name: profile.name, level: finalLevel })
        }, 1000)
      }
    }
  }, [phase, input, sequence, startLevel, profile?.name])

  useEffect(() => { return () => clearTimeout(timerRef.current) }, [])

  const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null
  const finalLevel = level - 1

  if (phase === 'rules') return <GameRulesScreen icon="digits.png" title="Digits" subtitle="Memorize the number and repeat it" worldRecord={worldRecord} myBest={myBest !== null ? myBest+' digits' : null} top5={top5} onPlay={startGame} />

  if (phase === 'result') return (
    <GameResultScreen result={String(finalLevel)} resultColor={finalLevel >= 10 ? '#00C853' : finalLevel >= 7 ? GOLD : '#D32F2F'} background={finalLevel >= 10 ? '#0D3320' : finalLevel >= 7 ? '#2D1A00' : '#1A0000'} worldRank={worldRank} hasProfile={!!profile?.name} onBack={() => { setPhase('rules'); loadData() }} onPlayAgain={startGame}>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>digits remembered</div>
    </GameResultScreen>
  )

  return (
    <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:32, paddingBottom:80 }}>
      <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>LEVEL {level}</div>

      {phase === 'show' && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
          <div style={{ fontSize: level <= 4 ? 72 : level <= 7 ? 56 : 40, fontWeight:900, color:'#fff', letterSpacing:8, fontVariantNumeric:'tabular-nums' }}>
            {sequence.join(' ')}
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:GOLD }}>{timeLeft}s</div>
        </div>
      )}

      {(phase === 'input' || phase === 'feedback') && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20, width:'100%', padding:'0 24px' }}>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
            {sequence.map((_, i) => (
              <div key={i} style={{ width:44, height:52, borderRadius:10, background:'#252525', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:900, color: feedback === 'correct' ? '#00C853' : feedback === 'wrong' && input[i] !== undefined && input[i] !== sequence[i] ? '#D32F2F' : '#fff', border:'2px solid '+(feedback === 'correct' ? '#00C853' : feedback === 'wrong' && input[i] !== undefined && input[i] !== sequence[i] ? '#D32F2F' : 'rgba(255,255,255,0.1)') }}>
                {input[i] !== undefined ? input[i] : ''}
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, width:240 }}>
            {[1,2,3,4,5,6,7,8,9,'⌫',0,null].map((d, i) => (
              <button key={i} onClick={() => { if (d === null) return; handleInput(d as any) }} disabled={d === null}
                style={{ height:60, borderRadius:14, border:'none', background: d === null ? 'transparent' : '#252525', color:'#fff', fontSize:24, fontWeight:900, fontFamily:'inherit', cursor: d === null ? 'default' : 'pointer', opacity: d === null ? 0 : 1 }}>
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
