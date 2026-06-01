'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GOLD = '#C8960C'
const GREEN = '#2E7D32'

const BRAIN_IMAGES = [
  'brain-blue.png',
  'brain-green.png',
  'brain-light.png',
  'brain-red.png',
  'brain-white.png',
  'brain-yellow.png',
]

interface Card {
  id: number
  image: string
  flipped: boolean
  matched: boolean
}

type Phase = 'rules' | 'playing' | 'result'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function MemoryClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [cards, setCards] = useState<Card[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [timeMs, setTimeMs] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<any[]>([])
  const [locked, setLocked] = useState(false)

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('scores').select('player_name, time_ms').order('time_ms', { ascending: true }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
    const sorted = Object.entries(best).sort((a,b) => (a[1] as number)-(b[1] as number))
    setTop5(sorted.slice(0,5).map(([name,t]) => ({name, score: fmt(t as number)})))
    if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
  }, [profile?.name])

  useEffect(() => { loadData() }, [loadData])

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? m+'m '+sec+'s' : s+'s'
  }

  const startGame = () => {
    const pairs = [...BRAIN_IMAGES, ...BRAIN_IMAGES]
    const shuffled = shuffle(pairs)
    setCards(shuffled.map((img, i) => ({ id: i, image: img, flipped: false, matched: false })))
    setSelected([])
    setMoves(0)
    setTimeMs(0)
    setLocked(false)
    setStartTime(Date.now())
    setPhase('playing')
    window.dispatchEvent(new Event('gameStart'))
  }

  useEffect(() => {
    if (phase !== 'playing') return
    const t = setInterval(() => setTimeMs(Date.now() - startTime), 100)
    return () => clearInterval(t)
  }, [phase, startTime])

  const handleCard = useCallback(async (idx: number) => {
    if (locked || cards[idx].flipped || cards[idx].matched) return
    const newCards = [...cards]
    newCards[idx].flipped = true
    setCards(newCards)

    const newSelected = [...selected, idx]
    setSelected(newSelected)

    if (newSelected.length === 2) {
      setMoves(m => m + 1)
      setLocked(true)
      const [a, b] = newSelected
      if (cards[a].image === newCards[b].image) {
        newCards[a].matched = true
        newCards[b].matched = true
        setCards([...newCards])
        setSelected([])
        setLocked(false)

        if (newCards.every(c => c.matched)) {
          const elapsed = Date.now() - startTime
          setTimeMs(elapsed)
          setPhase('result')
          window.dispatchEvent(new Event('gameResult'))
          const { count } = await supabase.from('scores').select('player_name', { count: 'exact', head: true }).lt('time_ms', elapsed)
          setWorldRank((count ?? 0) + 1)
          if (profile?.name) await supabase.from('scores').insert({ player_name: profile.name, time_ms: elapsed })
        }
      } else {
        setTimeout(() => {
          newCards[a].flipped = false
          newCards[b].flipped = false
          setCards([...newCards])
          setSelected([])
          setLocked(false)
        }, 900)
      }
    }
  }, [locked, cards, selected, startTime, profile?.name])

  const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

  if (phase === 'rules') return (
    <GameRulesScreen icon="memory.png" title="Memory" subtitle="Match all pairs as fast as possible" worldRecord={worldRecord} myBest={myBest !== null ? fmt(myBest) : null} top5={top5} onPlay={startGame} />
  )

  if (phase === 'result') return (
    <GameResultScreen
      result={fmt(timeMs)}
      resultColor={timeMs < 30000 ? '#00C853' : timeMs < 60000 ? GOLD : '#D32F2F'}
      background={timeMs < 30000 ? '#0D3320' : timeMs < 60000 ? '#2D1A00' : '#1A0000'}
      worldRank={worldRank}
      hasProfile={!!profile?.name}
      onBack={() => { setPhase('rules'); loadData() }}
      onPlayAgain={startGame}
    >
      <div style={{ fontSize:16, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{moves} moves</div>
    </GameResultScreen>
  )

  return (
    <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
        <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{fmt(timeMs)}</div>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>MEMORY</div>
        <div style={{ fontSize:18, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>{moves} moves</div>
      </div>

      <div style={{ flex:1, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, padding:'0 16px 80px', alignContent:'center' }}>
        {cards.map((card, idx) => (
          <div key={card.id} onClick={() => handleCard(idx)}
            style={{ aspectRatio:'1', borderRadius:14, cursor:'pointer', transition:'all 0.3s', transform: card.flipped || card.matched ? 'rotateY(0deg)' : 'rotateY(180deg)', position:'relative' }}>
            <div style={{ width:'100%', height:'100%', borderRadius:14, background: card.flipped || card.matched ? 'transparent' : '#252525', border: card.matched ? '2px solid #00C853' : '2px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
              {(card.flipped || card.matched) ? (
                <img src={`${BASE}/${card.image}`} style={{ width:'90%', height:'90%', objectFit:'contain', opacity: card.matched ? 0.7 : 1 }} />
              ) : (
                <img src={`${BASE}/brain-logo.webp`} style={{ width:'60%', height:'60%', objectFit:'contain', opacity:0.2 }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
