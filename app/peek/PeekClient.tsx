'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const REVEAL_DURATION_MS = 20000
const HINT_INTERVAL_MS = 3000

const ITEMS = [
  { emoji: '🍎', word: 'APPLE' }, { emoji: '🍌', word: 'BANANA' }, { emoji: '🥕', word: 'CARROT' },
  { emoji: '🍕', word: 'PIZZA' }, { emoji: '🍔', word: 'BURGER' }, { emoji: '🎂', word: 'CAKE' },
  { emoji: '🍩', word: 'DONUT' }, { emoji: '🍇', word: 'GRAPES' }, { emoji: '🍋', word: 'LEMON' },
  { emoji: '🍒', word: 'CHERRY' }, { emoji: '🎸', word: 'GUITAR' }, { emoji: '🎹', word: 'PIANO' },
  { emoji: '🥁', word: 'DRUM' }, { emoji: '🚀', word: 'ROCKET' }, { emoji: '🚂', word: 'TRAIN' },
  { emoji: '🚲', word: 'BICYCLE' }, { emoji: '📷', word: 'CAMERA' }, { emoji: '🕐', word: 'CLOCK' },
  { emoji: '🕯️', word: 'CANDLE' }, { emoji: '☂️', word: 'UMBRELLA' }, { emoji: '👓', word: 'GLASSES' },
  { emoji: '👑', word: 'CROWN' }, { emoji: '💎', word: 'DIAMOND' }, { emoji: '⚓', word: 'ANCHOR' },
  { emoji: '🧭', word: 'COMPASS' }, { emoji: '🌍', word: 'GLOBE' }, { emoji: '🤖', word: 'ROBOT' },
  { emoji: '👻', word: 'GHOST' }, { emoji: '🐍', word: 'SNAKE' }, { emoji: '🕷️', word: 'SPIDER' },
  { emoji: '🐳', word: 'WHALE' }, { emoji: '🐬', word: 'DOLPHIN' }, { emoji: '🐧', word: 'PENGUIN' },
  { emoji: '🐰', word: 'RABBIT' }, { emoji: '🐯', word: 'TIGER' }, { emoji: '🐘', word: 'ELEPHANT' },
  { emoji: '🐙', word: 'OCTOPUS' }, { emoji: '🦋', word: 'BUTTERFLY' }, { emoji: '🐉', word: 'DRAGON' },
  { emoji: '🌵', word: 'CACTUS' }, { emoji: '🍄', word: 'MUSHROOM' }, { emoji: '🌋', word: 'VOLCANO' },
  { emoji: '🌈', word: 'RAINBOW' }, { emoji: '⛄', word: 'SNOWMAN' }, { emoji: '🎃', word: 'PUMPKIN' },
  { emoji: '🏆', word: 'TROPHY' }, { emoji: '🏅', word: 'MEDAL' },
]

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','DEL'],
]

type Phase = 'rules' | 'playing' | 'result'

export default function PeekClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [item, setItem] = useState(ITEMS[0])
  const [guessLetters, setGuessLetters] = useState<string[]>([])
  const [hinted, setHinted] = useState<Set<number>>(new Set())
  const [elapsedMs, setElapsedMs] = useState(0)
  const [won, setWon] = useState(false)
  const [shake, setShake] = useState(false)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<any[]>([])

  const startTimeRef = useRef(0)
  const animRef = useRef(0)
  const hintTimerRef = useRef<any>(null)
  const phaseRef = useRef<Phase>('rules')
  const wonRef = useRef(false)

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('peek_scores').select('player_name, time_ms').order('time_ms', { ascending: true }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
    const sorted = Object.entries(best).sort((a,b) => (a[1] as number)-(b[1] as number))
    setTop5(sorted.slice(0,5).map(([name,ms]) => ({name, score:`${(ms as number/1000).toFixed(1)}s`})))
    const stored = typeof window !== 'undefined' ? localStorage.getItem('memgenius_profile') : null
    const pName = stored ? JSON.parse(stored).name : null
    if (pName && best[pName] !== undefined) setMyBest(best[pName])
  }, [profile?.name])

  useEffect(() => { loadData() }, [loadData])
  useEffect(() => { return () => { cancelAnimationFrame(animRef.current); clearInterval(hintTimerRef.current) } }, [])

  const finish = useCallback(async (didWin: boolean, finalMs: number) => {
    wonRef.current = didWin
    phaseRef.current = 'result'
    cancelAnimationFrame(animRef.current)
    clearInterval(hintTimerRef.current)
    setWon(didWin)
    setElapsedMs(finalMs)
    setPhase('result')
    window.dispatchEvent(new Event('gameResult'))
    if (didWin && profile?.name) {
      const { count } = await supabase.from('peek_scores').select('player_name', { count: 'exact', head: true }).lt('time_ms', finalMs)
      setWorldRank((count ?? 0) + 1)
      await supabase.from('peek_scores').insert({ player_name: profile.name, time_ms: finalMs })
      supabase.rpc('update_streak', { p_player_name: profile.name })
    }
  }, [profile?.name])

  const startGame = () => {
    const next = ITEMS[Math.floor(Math.random() * ITEMS.length)]
    setItem(next)
    setGuessLetters(Array(next.word.length).fill(''))
    setHinted(new Set())
    setWon(false)
    setShake(false)
    setWorldRank(null)
    wonRef.current = false
    phaseRef.current = 'playing'
    startTimeRef.current = Date.now()
    setElapsedMs(0)
    setPhase('playing')
    window.dispatchEvent(new Event('gameStart'))

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current
      setElapsedMs(elapsed)
      if (elapsed >= REVEAL_DURATION_MS) {
        finish(false, elapsed)
        return
      }
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)

    // setHinted's updater must stay a pure function of prevState (React Strict Mode
    // double-invokes it in dev) — writing into guessLetters here caused two different
    // random picks per tick, showing a letter that wasn't actually marked as hinted.
    hintTimerRef.current = setInterval(() => {
      setHinted(prev => {
        if (prev.size >= next.word.length - 1) return prev
        const hidden = Array.from({ length: next.word.length }, (_, i) => i).filter(i => !prev.has(i))
        const pick = hidden[Math.floor(Math.random() * hidden.length)]
        const nextSet = new Set(prev)
        nextSet.add(pick)
        return nextSet
      })
    }, HINT_INTERVAL_MS)
  }

  const handleKey = useCallback((key: string) => {
    if (phaseRef.current !== 'playing') return
    if (key === 'DEL' || key === 'BACKSPACE') {
      setGuessLetters(g => {
        const copy = [...g]
        for (let i = copy.length - 1; i >= 0; i--) {
          if (!hinted.has(i) && copy[i] !== '') { copy[i] = ''; break }
        }
        return copy
      })
      return
    }
    if (key === 'ENTER') {
      setGuessLetters(g => {
        if (g.some((l, i) => !hinted.has(i) && l === '')) return g
        const guess = item.word.split('').map((ch, i) => hinted.has(i) ? ch : g[i]).join('')
        if (guess === item.word) {
          finish(true, Date.now() - startTimeRef.current)
        } else {
          setShake(true)
          setTimeout(() => setShake(false), 400)
          setTimeout(() => setGuessLetters(prev => prev.map((l, i) => hinted.has(i) ? l : '')), 400)
        }
        return g
      })
      return
    }
    if (/^[A-Z]$/.test(key)) {
      setGuessLetters(g => {
        const idx = g.findIndex((l, i) => l === '' && !hinted.has(i))
        if (idx === -1) return g
        const copy = [...g]
        copy[idx] = key
        return copy
      })
    }
  }, [hinted, item, finish])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => handleKey(e.key.toUpperCase())
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleKey])

  const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null
  const revealProgress = Math.min(1, elapsedMs / REVEAL_DURATION_MS)
  const maxRadius = 150
  const radius = 12 + revealProgress * maxRadius

  if (phase === 'rules') return (
    <GameRulesScreen
      icon="peek.png"
      title="Peek"
      subtitle="Guess the word before the picture is fully revealed"
      worldRecord={worldRecord}
      myBest={myBest !== null ? `${(myBest/1000).toFixed(1)}s` : null}
      top5={top5}
      onPlay={startGame}
    />
  )

  if (phase === 'result') return (
    <GameResultScreen
      result={won ? `${(elapsedMs/1000).toFixed(1)}s` : "Time's up!"}
      resultColor={won ? (elapsedMs < 8000 ? '#00C853' : GOLD) : '#D32F2F'}
      background={won ? (elapsedMs < 8000 ? '#0D3320' : '#2D1A00') : '#1A0000'}
      worldRank={won ? worldRank : null}
      hasProfile={!!profile?.name}
      onBack={() => { setPhase('rules'); loadData() }}
      onPlayAgain={startGame}
    >
      {!won && <div style={{ fontSize:18, fontWeight:900, color:'rgba(255,255,255,0.6)', display:'flex', alignItems:'center', gap:10 }}>{item.emoji} {item.word}</div>}
    </GameResultScreen>
  )

  return (
    <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 20px', flexShrink:0 }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>PEEK</div>
        <div style={{ fontSize:14, fontWeight:800, color:'rgba(255,255,255,0.5)' }}>{(elapsedMs/1000).toFixed(1)}s</div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24 }}>
        <div style={{ position:'relative', width:220, height:220, borderRadius:20, background:'#252525', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:120 }}>{item.emoji}</div>
          <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 50% 50%, transparent 0px, transparent ${radius}px, #252525 ${radius+1}px)` }} />
        </div>

        <div style={{ display:'flex', gap:6, flexWrap:'wrap', justifyContent:'center', maxWidth:340, transform: shake ? 'translateX(0)' : undefined, animation: shake ? 'peek-shake 0.4s' : undefined }}>
          {guessLetters.map((l, i) => (
            <div key={i} style={{
              width:36, height:44, borderRadius:8,
              background: hinted.has(i) ? GREEN : '#252525',
              border: hinted.has(i) ? 'none' : '2px solid rgba(255,255,255,0.15)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, fontWeight:900, color:'#fff',
            }}>
              {hinted.has(i) ? item.word[i] : l}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'8px 8px 80px', flexShrink:0 }}>
        {KEYBOARD_ROWS.map((row, i) => (
          <div key={i} style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:4 }}>
            {row.map(k => (
              <button key={k} onPointerDown={() => handleKey(k)}
                style={{ height:44, minWidth: k.length > 1 ? 52 : 32, borderRadius:6, border:'none', background: k === 'ENTER' ? GREEN : '#3a3a3a', color:'#fff', fontSize: k.length > 1 ? 10 : 15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', padding:'0 3px', userSelect:'none', boxShadow: k === 'ENTER' ? '0 3px 0 #1B5E20' : 'none' }}>
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
      <style>{`@keyframes peek-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }`}</style>
    </main>
  )
}
