'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GREEN = '#2E7D32'

type Phase = 'rules' | 'countdown' | 'running' | 'result'

function fmt(ms: number) {
  return (ms / 1000).toFixed(3) + 's'
}

export default function StopClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [countdown, setCountdown] = useState(3)
  const [elapsed, setElapsed] = useState(0)
  const [difference, setDifference] = useState(0)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<any[]>([])

  const startRef = useRef(0)
  const animRef = useRef(0)

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('precision_scores')
      .select('player_name, difference_ms').is('game_type', null)
      .order('difference_ms', { ascending: true }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
    const sorted = Object.entries(best).sort((a,b) => (a[1] as number)-(b[1] as number))
    setTop5(sorted.slice(0,5).map(([name,ms]) => ({name, score:`${ms}ms`})))
    const pName = profileRef.current?.name || JSON.parse(localStorage.getItem('memgenius_profile') || '{}').name
    if (pName && best[pName] !== undefined) setMyBest(best[pName])
  }, [profile?.name])

  useEffect(() => { loadData() }, [loadData])

  const startCountdown = () => {
    setPhase('countdown')
    setCountdown(3)
    let c = 3
    const t = setInterval(() => {
      c--
      setCountdown(c)
      if (c === 0) {
        clearInterval(t)
        startRef.current = Date.now()
        setPhase('running')
        const tick = () => {
          setElapsed(Date.now() - startRef.current)
          animRef.current = requestAnimationFrame(tick)
        }
        animRef.current = requestAnimationFrame(tick)
      }
    }, 1000)
  }

  const stopGame = useCallback(async () => {
    if (phase !== 'running') return
    cancelAnimationFrame(animRef.current)
    const diff = (Date.now() - startRef.current) - 5000
    setDifference(diff)
    setPhase('result')
    window.dispatchEvent(new Event('gameResult'))

    const absDiff = Math.abs(diff)
    const { count: rankCount } = await supabase.from('precision_scores')
      .select('player_name', { count: 'exact', head: true }).is('game_type', null).lt('difference_ms', absDiff)
    setWorldRank((rankCount ?? 0) + 1)

    if (profile?.name) {
      await supabase.from('precision_scores').insert({ player_name: profile.name, difference_ms: absDiff, game_type: null })
      if (myBest === null || absDiff < myBest) setMyBest(absDiff)
    }
  }, [phase, profile?.name, myBest])

  useEffect(() => { return () => cancelAnimationFrame(animRef.current) }, [])

  const absDiff = Math.abs(difference)
  const resultColor = absDiff < 100 ? '#00C853' : absDiff < 500 ? '#C8960C' : '#D32F2F'
  const bgResult = absDiff < 100 ? '#0D3320' : absDiff < 500 ? '#2D1A00' : '#1A0000'

  const worldRecord = top5[0] ? { value: `${top5[0].score}`, name: top5[0].name } : null

  if (phase === 'rules') return (
    <GameRulesScreen
      icon="precision.png"
      title="Stop"
      subtitle="Stop at exactly 5.000s"
      worldRecord={worldRecord}
      myBest={myBest !== null ? `${myBest}ms` : null}
      top5={top5}
      onPlay={startCountdown}
    />
  )

  if (phase === 'countdown') return (
    <main style={{ height:'100dvh', background:'#1A1A1A', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontSize:160, fontWeight:900, color:'#fff' }}>{countdown}</div>
    </main>
  )

  if (phase === 'running') return (
    <main onClick={stopGame} style={{ height:'100dvh', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', gap:8, paddingBottom:80 }}>
      <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.25)', letterSpacing:3, textTransform:'uppercase' }}>Target</div>
      <div style={{ fontSize:80, fontWeight:900, color:'#00C853', fontVariantNumeric:'tabular-nums', letterSpacing:-2 }}>5.00</div>
      <div style={{ width:60, height:2, background:'rgba(255,255,255,0.1)', margin:'8px 0' }} />
      <div style={{ fontSize:80, fontWeight:900, color:'#fff', fontVariantNumeric:'tabular-nums', letterSpacing:-2 }}>{fmt(elapsed)}</div>
      <button onClick={stopGame} style={{ marginTop:32, width:160, height:160, borderRadius:'50%', border:'none', background:GREEN, color:'#fff', fontSize:26, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 10px 0 #1B5E20' }}>
        STOP
      </button>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.15)', fontWeight:700, marginTop:8 }}>or tap anywhere</div>
    </main>
  )

  return (
    <GameResultScreen
      result={`${difference > 0 ? '+' : ''}${fmt(difference)}`}
      resultColor={resultColor}
      background={bgResult}
      worldRank={worldRank}
      hasProfile={!!profile?.name}
      onBack={() => { setPhase('rules'); loadData() }}
      onPlayAgain={startCountdown}
    />
  )
}
