'use client'
import { useState, useEffect } from 'react'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const BUCKET = 'storage'

function imgUrl(filename: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface Pair {
  id: string
  card_a_img: string
  card_a_label: string
  card_b_img: string
  card_b_label: string
  fun_fact: string
}

interface Card {
  uid: string
  pairId: string
  img: string
  label: string
  side: 'a' | 'b'
}

export default function GameBoard({ pack }: { pack: any }) {
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [wrong, setWrong] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [ms, setMs] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [lastFact, setLastFact] = useState('')

  const buildCards = () => {
    const built: Card[] = []
    pack.pairs.forEach((p: Pair) => {
      built.push({ uid: `${p.id}-a`, pairId: p.id, img: imgUrl(p.card_a_img), label: p.card_a_label, side: 'a' })
      built.push({ uid: `${p.id}-b`, pairId: p.id, img: imgUrl(p.card_b_img), label: p.card_b_label, side: 'b' })
    })
    return shuffle(built)
  }

  useEffect(() => { setCards(buildCards()) }, [])

  useEffect(() => {
    let t: NodeJS.Timeout
    if (running && !done) t = setInterval(() => setMs(m => m + 10), 10)
    return () => clearInterval(t)
  }, [running, done])

  useEffect(() => {
    if (matched.length > 0 && matched.length === pack.pairs.length) {
      setDone(true)
      setRunning(false)
    }
  }, [matched])

  useEffect(() => {
    if (flipped.length !== 2) return
    const [a, b] = flipped.map(uid => cards.find(c => c.uid === uid)!)
    setMoves(m => m + 1)
    if (a.pairId === b.pairId && a.side !== b.side) {
      const fact = pack.pairs.find((p: Pair) => p.id === a.pairId)?.fun_fact || ''
      setLastFact(fact)
      setTimeout(() => { setMatched(m => [...m, a.pairId]); setFlipped([]) }, 500)
    } else {
      setWrong(flipped)
      setTimeout(() => { setFlipped([]); setWrong([]) }, 800)
    }
  }, [flipped])

  const flip = (uid: string) => {
    if (flipped.length === 2) return
    if (flipped.includes(uid)) return
    const card = cards.find(c => c.uid === uid)!
    if (matched.includes(card.pairId)) return
    if (!running) setRunning(true)
    setFlipped(f => [...f, uid])
  }

  const reset = () => {
    setCards(buildCards())
    setFlipped([]); setMatched([]); setWrong([])
    setMoves(0); setMs(0); setRunning(false); setDone(false)
  }

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = ms % 1000
    return `${String(s).padStart(2, '0')}:${String(m).padStart(3, '0')}`
  }

  return (
    <main className="min-h-screen bg-[#0c0c14] flex flex-col items-center font-nunito max-w-[430px] mx-auto overflow-hidden">

      {/* Header */}
      <div className="w-full flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF4D6D] to-[#ff8c00] flex items-center justify-center text-base">🧠</div>
          <div>
            <div className="text-base font-black text-white leading-none">Pair<span className="text-[#FF4D6D]">IQ</span></div>
            <div className="text-[9px] font-bold text-gray-600 tracking-widest uppercase">{pack.title}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-black text-gray-600 tracking-widest uppercase">moves</div>
          <div className="text-xl font-black text-white font-mono">{String(moves).padStart(2, '0')}</div>
        </div>
      </div>

      {/* Timer */}
      <div className="w-full px-4 pb-1">
        <div className={`text-3xl font-bold font-mono tracking-tight transition-colors duration-300 ${running ? 'text-[#FF4D6D]' : 'text-gray-800'}`}>
          {fmt(ms)}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full px-4 pb-2">
        <div className="h-1 bg-[#161622] rounded-full overflow-hidden mb-1.5">
          <div className="h-full bg-gradient-to-r from-[#FF4D6D] to-[#ff8c00] rounded-full transition-all duration-500"
            style={{ width: `${(matched.length / pack.pairs.length) * 100}%` }} />
        </div>
        <div className="flex justify-between">
          {pack.pairs.map((_: any, i: number) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${matched.length > i ? 'bg-[#FF4D6D]' : 'bg-[#1a1a28] border border-[#222]'}`} />
          ))}
        </div>
      </div>

      {/* Grid 3x4 — 12 cards */}
      <div className="grid grid-cols-3 gap-1.5 px-3 w-full">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.uid) || matched.includes(card.pairId)
          const isWrong = wrong.includes(card.uid)
          const isMatched = matched.includes(card.pairId)

          return (
            <div key={card.uid} onClick={() => flip(card.uid)}
              className="cursor-pointer"
              style={{ perspective: '600px', aspectRatio: '3/4' }}>
              <div style={{
                width: '100%', height: '100%', position: 'relative',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: isWrong ? 'transform 0.15s' : 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
                borderRadius: '12px',
              }}>

                {/* Back — color sólido */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '12px',
                  backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                  background: 'linear-gradient(145deg, #FF4D6D, #ff8c00)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ fontSize: 22, opacity: 0.3 }}>🧠</div>
                </div>

                {/* Front */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '12px',
                  backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: isMatched
                    ? 'linear-gradient(145deg,#0d5c2e,#0f7a3a)'
                    : card.side === 'a'
                    ? 'linear-gradient(145deg,#1a1a35,#22224a)'
                    : 'linear-gradient(145deg,#1f1520,#2a1a2e)',
                  filter: isWrong ? 'brightness(0.5)' : 'none',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '6px 4px', gap: '4px',
                }}>
                  {/* imagen sin borde */}
                  <img
                    src={card.img}
                    alt={card.label}
                    style={{ width: '85%', objectFit: 'contain', maxHeight: '65%' }}
                  />
                  <div style={{
                    fontSize: card.label.length > 12 ? 10 : 11,
                    fontWeight: 900,
                    color: isMatched ? '#7dffb3' : 'white',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}>
                    {card.label}
                  </div>
                  {isMatched && <div style={{ fontSize: 12 }}>✅</div>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Done overlay */}
      {done && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-5">
          <div className="bg-[#0f0f1c] border-2 border-[#FF4D6D] rounded-3xl p-7 w-full max-w-sm text-center"
            style={{ boxShadow: '0 20px 60px rgba(255,77,109,0.25)' }}>
            <div className="text-5xl mb-2">🎉</div>
            <div className="text-xs font-black tracking-widest text-[#FF4D6D] uppercase mb-1">Completed!</div>
            <div className="text-5xl font-bold text-white font-mono tracking-tight mb-1">{fmt(ms)}</div>
            <div className="text-sm text-gray-600 mb-4">{moves} moves · {pack.pairs.length} pairs</div>

            <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 rounded-2xl p-3 mb-3">
              <div className="text-xl font-black text-[#FF4D6D]">🏆 #234 World</div>
              <div className="text-xs text-gray-600 mt-1">Top 8% globally · {pack.title}</div>
            </div>

            {lastFact && (
              <div className="bg-[#111120] border border-[#1e1e35] rounded-2xl p-3 mb-4 text-left">
                <div className="text-[9px] font-black tracking-widest text-[#6060ff] uppercase mb-1">💡 Did you know?</div>
                <div className="text-xs text-gray-400 leading-relaxed">{lastFact}</div>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={reset}
                className="flex-1 py-3 rounded-2xl bg-[#1a1a2e] text-gray-500 font-black text-sm">
                ↩️ Again
              </button>
              <button className="flex-1 py-3 rounded-2xl font-black text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#FF4D6D,#ff8c00)' }}>
                🔗 Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
