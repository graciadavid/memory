'use client'
import { useState, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

const COLORS = ['#D32F2F','#1565C0','#2E7D32','#F57F17','#6A1B9A','#00838F']
const COLOR_NAMES = ['Red','Blue','Green','Yellow','Purple','Teal']
const MAX_ATTEMPTS = 6
const CODE_LENGTH = 4

function generateCode(): number[] {
  return Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * COLORS.length))
}

function evaluate(guess: number[], code: number[]): { black: number, white: number } {
  let black = 0, white = 0
  const codeCopy = [...code]
  const guessCopy = [...guess]
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessCopy[i] === codeCopy[i]) { black++; codeCopy[i] = -1; guessCopy[i] = -2 }
  }
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessCopy[i] === -2) continue
    const j = codeCopy.indexOf(guessCopy[i])
    if (j !== -1) { white++; codeCopy[j] = -1 }
  }
  return { black, white }
}

type Phase = 'rules' | 'playing' | 'result'

interface Attempt { guess: number[], black: number, white: number }

export default function MastermindClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [code, setCode] = useState<number[]>([])
  const [current, setCurrent] = useState<number[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [won, setWon] = useState(false)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<any[]>([])

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('mastermind_scores').select('player_name, attempts').order('attempts', { ascending: true }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.attempts < best[s.player_name]) best[s.player_name] = s.attempts })
    const sorted = Object.entries(best).sort((a,b) => (a[1] as number)-(b[1] as number))
    setTop5(sorted.slice(0,5).map(([name,a]) => ({name, score:a+' tries'})))
    if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
  }, [profile?.name])

  useState(() => { loadData() })

  const startGame = () => {
    setCode(generateCode())
    setCurrent([])
    setAttempts([])
    setWon(false)
    setPhase('playing')
    window.dispatchEvent(new Event('gameStart'))
  }

  const addColor = (colorIdx: number) => {
    if (current.length < CODE_LENGTH) setCurrent([...current, colorIdx])
  }

  const removeColor = () => setCurrent(current.slice(0, -1))

  const submitGuess = useCallback(async () => {
    if (current.length !== CODE_LENGTH) return
    const result = evaluate(current, code)
    const newAttempts = [...attempts, { guess: current, ...result }]
    setAttempts(newAttempts)
    setCurrent([])

    if (result.black === CODE_LENGTH) {
      setWon(true)
      setPhase('result')
      window.dispatchEvent(new Event('gameResult'))
      const tries = newAttempts.length
      const { count } = await supabase.from('mastermind_scores').select('player_name', { count: 'exact', head: true }).lt('attempts', tries)
      setWorldRank((count ?? 0) + 1)
      if (profile?.name) await supabase.from('mastermind_scores').insert({ player_name: profile.name, attempts: tries })
    } else if (newAttempts.length >= MAX_ATTEMPTS) {
      setWon(false)
      setPhase('result')
      window.dispatchEvent(new Event('gameResult'))
    }
  }, [current, code, attempts, profile?.name])

  const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null
  const tries = attempts.length

  if (phase === 'rules') return (
    <GameRulesScreen icon="mastermind.png" title="Mastermind" subtitle={"Crack the "+CODE_LENGTH+"-color code in "+MAX_ATTEMPTS+" tries"} worldRecord={worldRecord} myBest={myBest !== null ? myBest+' tries' : null} top5={top5} onPlay={startGame} />
  )

  if (phase === 'result') return (
    <GameResultScreen
      result={won ? tries+' tries' : 'Failed'}
      resultColor={won ? (tries <= 4 ? '#00C853' : tries <= 7 ? GOLD : '#fff') : '#D32F2F'}
      background={won ? (tries <= 4 ? '#0D3320' : '#2D1A00') : '#1A0000'}
      worldRank={won ? worldRank : null}
      hasProfile={!!profile?.name}
      onBack={() => { setPhase('rules'); loadData() }}
      onPlayAgain={startGame}
    >
      {!won && (
        <div style={{ display:'flex', gap:8, width:216 }}>
          {code.map((c,i) => <div key={i} style={{ width:32, height:32, borderRadius:'50%', background:COLORS[c] }} />)}
        </div>
      )}
    </GameResultScreen>
  )

  return (
    <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
        <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{tries}/{MAX_ATTEMPTS}</div>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>MASTERMIND</div>
        <div style={{ width:40 }} />
      </div>

      {/* Attempts history */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 16px', display:'flex', flexDirection:'column', alignItems:'center' }}>
        {attempts.map((att, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
            <div style={{ display:'flex', gap:6 }}>
              {att.guess.map((c,j) => (
                <div key={j} style={{ width:44, height:44, borderRadius:10, background:COLORS[c], border:'2px solid rgba(255,255,255,0.15)' }} />
              ))}
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {Array.from({ length: CODE_LENGTH }).map((_,j) => {
                const isBlack = j < att.black
                const isWhite = j >= att.black && j < att.black + att.white
                return <div key={j} style={{ width:16, height:16, borderRadius:'50%', background: isBlack ? '#fff' : isWhite ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.3)' }} />
              })}
            </div>
          </div>
        ))}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
          <div style={{ display:'flex', gap:6 }}>
            {Array.from({ length: CODE_LENGTH }).map((_, i) => (
              <div key={i} style={{ width:44, height:44, borderRadius:10, background: current[i] !== undefined ? COLORS[current[i]] : '#2a2a2a', border:'2px solid rgba(255,255,255,0.15)' }} />
            ))}
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {Array.from({ length: CODE_LENGTH }).map((_,j) => (
              <div key={j} style={{ width:16, height:16, borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Color picker */}
      <div style={{ padding:'12px 16px 90px', flexShrink:0 }}>
        <div style={{ display:'flex', gap:8, justifyContent:'space-between', marginBottom:12 }}>
          {COLORS.map((color, i) => (
            <button key={i} onClick={() => addColor(i)} style={{ width:44, height:44, borderRadius:10, border:'none', background:color, cursor:'pointer', boxShadow:'0 3px 6px rgba(0,0,0,0.3)', flexShrink:0 }} />
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={removeColor} style={{ flex:1, padding:'12px', borderRadius:12, border:'none', background:'#D32F2F', color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 4px 0 #B71C1C' }}>Erase</button>
          <button onClick={submitGuess} disabled={current.length !== CODE_LENGTH}
            style={{ flex:2, padding:'12px', borderRadius:12, border:'none', background: current.length === CODE_LENGTH ? GREEN : '#252525', color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor: current.length === CODE_LENGTH ? 'pointer' : 'default', opacity: current.length === CODE_LENGTH ? 1 : 0.5, boxShadow: current.length === CODE_LENGTH ? '0 4px 0 #1B5E20' : 'none' }}>
            Submit →
          </button>
        </div>
      </div>
    </main>
  )
}
