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
  const [level, setLevel] = useState(3)
  const [sequence, setSequence] = useState<number[]>([])
  const [input, setInput] = useState<number[]>([])
  const [showing, setShowing] = useState<number|null>(null)
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<any[]>([])
  const timerRef = useRef<any>(null)
  const levelRef = useRef(3)

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('number_scores').select('player_name, level').order('level', { ascending: false }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
    const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
    setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:`${l} digits`})))
    if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
  }, [profile?.name])

  useEffect(() => { loadData() }, [loadData])

  const showSequence = useCallback((seq: number[]) => {
    let i = 0
    const show = () => {
      if (i < seq.length) {
        setShowing(seq[i])
        i++
        timerRef.current = setTimeout(() => { setShowing(null); timerRef.current = setTimeout(show, 300) }, 700)
      } else {
        setPhase('input')
        setInput([])
      }
    }
    timerRef.current = setTimeout(show, 500)
  }, [])

  const startLevel = useCallback((lvl: number) => {
    levelRef.current = lvl
    setLevel(lvl)
    setInput([])
    setFeedback(null)
    const seq = Array.from({ length: lvl }, () => Math.floor(Math.random() * 10))
    setSequence(seq)
    setPhase('show')
    showSequence(seq)
  }, [showSequence])

  const startGame = () => {
    levelRef.current = 3
    startLevel(3)
    window.dispatchEvent(new Event('gameStart'))
  }

  const handleInput = useCallback(async (digit: number) => {
    if (phase !== 'input') return
    const newInput = [...input, digit]
    setInput(newInput)
    if (newInput.length === sequence.length) {
      const correct = newInput.every((d, i) => d === sequence[i])
      setFeedback(correct ? 'correct' : 'wrong')
      setPhase('feedback')
      if (correct) {
        setTimeout(() => startLevel(levelRef.current + 1), 800)
      } else {
        const finalLevel = levelRef.current - 1
        setTimeout(async () => {
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

  if (phase === 'rules') return <GameRulesScreen icon="digits.png" title="Digits" subtitle="Remember the sequence of numbers" worldRecord={worldRecord} myBest={myBest !== null ? `${myBest} digits` : null} top5={top5} onPlay={startGame} />

  if (phase === 'result') return (
    <GameResultScreen result={`${finalLevel}`} resultColor={finalLevel >= 10 ? '#00C853' : finalLevel >= 7 ? GOLD : '#D32F2F'} background={finalLevel >= 10 ? '#0D3320' : finalLevel >= 7 ? '#2D1A00' : '#1A0000'} worldRank={worldRank} hasProfile={!!profile?.name} onBack={() => { setPhase('rules'); loadData() }} onPlayAgain={startGame}>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>digits remembered</div>
    </GameResultScreen>
  )

  return (
    <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:32, paddingBottom:80 }}>
      <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>LEVEL {level}</div>
      {phase === 'show' && (
        <div style={{ width:160, height:160, borderRadius:24, background:'#252525', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontSize:80, fontWeight:900, color:'#fff' }}>{showing ?? ''}</div>
        </div>
      )}
      {(phase === 'input' || phase === 'feedback') && (
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', maxWidth:280 }}>
          {sequence.map((_, i) => (
            <div key={i} style={{ width:48, height:56, borderRadius:12, background:'#252525', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:900, color: feedback === 'correct' ? '#00C853' : feedback === 'wrong' && input[i] !== undefined && input[i] !== sequence[i] ? '#D32F2F' : '#fff', border:`2px solid ${feedback === 'correct' ? '#00C853' : feedback === 'wrong' && input[i] !== undefined && input[i] !== sequence[i] ? '#D32F2F' : 'rgba(255,255,255,0.1)'}` }}>
              {input[i] !== undefined ? input[i] : ''}
            </div>
          ))}
        </div>
      )}
      {phase === 'input' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, width:240 }}>
          {[1,2,3,4,5,6,7,8,9,null,0,'⌫'].map((d, i) => (
            <button key={i} onClick={() => { if (d === null) return; if (d === '⌫') { setInput(p => p.slice(0,-1)); return } handleInput(d as number) }} disabled={d === null}
              style={{ height:60, borderRadius:14, border:'none', background: d === null ? 'transparent' : '#252525', color:'#fff', fontSize:24, fontWeight:900, fontFamily:'inherit', cursor: d === null ? 'default' : 'pointer', opacity: d === null ? 0 : 1 }}>
              {d}
            </button>
          ))}
        </div>
      )}
    </main>
  )
}
