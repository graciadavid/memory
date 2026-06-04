'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const BRAINS = ['brain-blue.png','brain-green.png','brain-light.png','brain-red.png','brain-white.png','brain-yellow.png']

if (typeof window !== 'undefined') {
  BRAINS.forEach(name => { const img = new Image(); img.src = BASE+'/'+name })
}

interface Card { id: number; image: string; flipped: boolean; matched: boolean }

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }
function fmt(ms: number) { const s = Math.floor(ms/1000); const m = Math.floor(s/60); return m > 0 ? m+'m '+(s%60)+'s' : s+'s' }

function getPercentile(timeMs: number, birthYear: number): number {
  const age = new Date().getFullYear() - birthYear
  const median = age <= 25 ? 28000 : age <= 35 ? 35000 : age <= 50 ? 44000 : 56000
  const pct = Math.max(0, Math.min(100, Math.round((1 - (timeMs - median * 0.3) / (median * 1.4)) * 100)))
  return pct
}

type Phase = 'intro' | 'playing' | 'result'

export default function MemoryTestPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [startTime, setStartTime] = useState(0)
  const [timeMs, setTimeMs] = useState(0)
  const [percentile, setPercentile] = useState(0)
  const [session, setSession] = useState<any>(null)
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    const s = localStorage.getItem('braintest_session')
    if (s) setSession(JSON.parse(s))
  }, [])

  const startGame = () => {
    const images = shuffle(BRAINS).slice(0, 6)
    const deck = shuffle([...images, ...images]).map((image, id) => ({ id, image, flipped: false, matched: false }))
    setCards(deck)
    setFlipped([])
    setMoves(0)
    setStartTime(Date.now())
    setPhase('playing')
  }

  const handleFlip = useCallback((id: number) => {
    if (phase !== 'playing') return
    const card = cards.find(c => c.id === id)
    if (!card || card.flipped || card.matched) return
    if (flipped.length === 2) return

    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c)
    const newFlipped = [...flipped, id]
    setCards(newCards)
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [a, b] = newFlipped.map(fid => newCards.find(c => c.id === fid)!)
      if (a.image === b.image) {
        const matched = newCards.map(c => newFlipped.includes(c.id) ? { ...c, matched: true } : c)
        setCards(matched)
        setFlipped([])
        if (matched.every(c => c.matched)) {
          const ms = Date.now() - startTime
          setTimeMs(ms)
          const birthYear = session?.birthYear ? parseInt(session.birthYear) : 1990
          const pct = getPercentile(ms, birthYear)
          setPercentile(pct)
          setPhase('result')
          const name = session?.name || JSON.parse(localStorage.getItem('memgenius_profile') || '{}').name
          if (name) {
            supabase.from('scores').insert({ player_name: name, time_ms: ms })
            supabase.rpc('update_streak', { p_player_name: name })
          }
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, flipped: false } : c))
          setFlipped([])
        }, 800)
      }
    }
  }, [phase, cards, flipped, startTime, session])

  const saveAndContinue = () => {
    if (!session) return
    const updated = { ...session, results: { ...session.results, memory: percentile } }
    localStorage.setItem('braintest_session', JSON.stringify(updated))
    window.location.href = '/brain-age-test'
  }

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>
      <a href="/brain-age-test" style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', textDecoration:'none', display:'block', marginBottom:20 }}>← Brain Age Test</a>

      <div style={{ fontSize:11, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>Step 2 of 4</div>
      <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:4 }}>Memory Test</div>
      <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>Match all pairs as fast as you can</div>

      {phase === 'intro' && (
        <>
          <div style={{ background:'#252525', borderRadius:16, padding:'20px', marginBottom:20, textAlign:'center' }}>
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:12 }}>
              {BRAINS.slice(0,3).map(b => <img key={b} src={`${BASE}/${b}`} style={{ width:40, height:40, objectFit:'contain' }} />)}
            </div>
            <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>
              12 cards face down. Flip pairs of matching brain images as fast as possible.
            </div>
          </div>
          <button onClick={startGame}
            style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20' }}>
            Start Test →
          </button>
        </>
      )}

      {phase === 'playing' && (
        <>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>Moves: {moves}</div>
            <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>{cards.filter(c=>c.matched).length/2}/{cards.length/2} pairs</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {cards.map(card => (
              <div key={card.id} onClick={() => handleFlip(card.id)}
                style={{ aspectRatio:'1', borderRadius:12, background: card.flipped || card.matched ? '#252525' : '#333', border: card.matched ? `2px solid ${GREEN}` : '2px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.15s' }}>
                {(card.flipped || card.matched) && <img src={`${BASE}/${card.image}`} style={{ width:'70%', height:'70%', objectFit:'contain' }} />}
              </div>
            ))}
          </div>
        </>
      )}

      {phase === 'result' && (
        <div style={{ textAlign:'center' }}>
          <div style={{ width:140, height:140, borderRadius:'50%', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:124, height:124, borderRadius:'50%', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:1 }}>YOUR TIME</div>
              <div style={{ fontSize:28, fontWeight:900, color:GOLD, lineHeight:1 }}>{fmt(timeMs)}</div>
              <div style={{ fontSize:13, fontWeight:800, color:GREEN }}>Top {percentile}%</div>
            </div>
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:24 }}>
            {percentile <= 25 ? '🧠 Exceptional memory!' : percentile <= 50 ? '💪 Above average!' : percentile <= 75 ? '📈 Room to improve' : '🔥 Keep training!'}
          </div>
          <button onClick={startGame}
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
        <summary style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', cursor:'pointer', listStyle:'none' }}>What does this Memory Test measure? ▼</summary>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.7, marginTop:12 }}>
          This free online memory test measures working memory and visual recall — your brain's ability to hold and process information in the short term. Working memory is one of the strongest predictors of intelligence and learning ability. Research shows it peaks in the mid-20s and can be trained with regular practice. This test uses a card-matching format to measure how quickly and accurately you retain visual information.
        </div>
      </details>
    </main>
  )
}
