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
    <main style={{
      height: '100dvh',
      background: '#0c0c14',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 430,
      margin: '0 auto',
      overflow: 'hidden',
      fontFamily: 'var(--font-nunito), sans-serif',
    }}>

      {/* Header — ultra compacto */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 10,
            background: 'linear-gradient(135deg,#FF4D6D,#ff8c00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>🧠</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: 'white', lineHeight: 1 }}>
              Pair<span style={{ color: '#FF4D6D' }}>IQ</span>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#444', letterSpacing: 2, textTransform: 'uppercase' }}>
              {pack.title}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#444', letterSpacing: 2, textTransform: 'uppercase' }}>moves</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'white', fontFamily: 'monospace' }}>{String(moves).padStart(2, '0')}</div>
        </div>
      </div>

      {/* Timer */}
      <div style={{ padding: '0 14px 4px' }}>
        <div style={{
          fontSize: 28, fontWeight: 700, fontFamily: 'monospace',
          color: running ? '#FF4D6D' : '#222',
          transition: 'color 0.3s',
          letterSpacing: -1,
        }}>{fmt(ms)}</div>
      </div>

      {/* Progress */}
      <div style={{ padding: '0 14px 6px' }}>
        <div style={{ height: 3, background: '#161622', borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{
            height: '100%',
            width: `${(matched.length / pack.pairs.length) * 100}%`,
            background: 'linear-gradient(90deg,#FF4D6D,#ff8c00)',
            borderRadius: 3,
            transition: 'width 0.5s',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {pack.pairs.map((_: any, i: number) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: matched.length > i ? '#FF4D6D' : '#1a1a28',
              border: matched.length > i ? 'none' : '1px solid #222',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* Grid — ocupa el espacio restante */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 6,
        padding: '0 10px',
        flex: 1,
        minHeight: 0,
      }}>
        {cards.map(card => {
          const isFlipped = flipped.includes(card.uid) || matched.includes(card.pairId)
          const isWrong = wrong.includes(card.uid)
          const isMatched = matched.includes(card.pairId)

          return (
            <div key={card.uid} onClick={() => flip(card.uid)}
              style={{ perspective: 600, cursor: 'pointer' }}>
              <div style={{
                width: '100%', height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: isWrong ? 'transform 0.15s' : 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
                borderRadius: 12,
              }}>

                {/* Back */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 12,
                  backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                  background: 'linear-gradient(145deg,#FF4D6D,#ff8c00)',
                }} />

                {/* Front */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 12,
                  backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  overflow: 'hidden',
                  filter: isWrong ? 'brightness(0.4)' : 'none',
                  outline: isMatched ? '2px solid #1aaa55' : 'none',
                  transition: 'outline 0.3s',
                }}>
                  <img
                    src={card.img}
                    alt={card.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {/* label overlay bottom */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                    padding: '12px 4px 4px',
                    fontSize: card.label.length > 12 ? 9 : 10,
                    fontWeight: 900,
                    color: isMatched ? '#7dffb3' : 'white',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}>
                    {card.label}
                  </div>
                </div>

              </div>
            </div>
          )
        })}
      </div>

      <div style={{ height: 6 }} />

      {/* Done overlay */}
      {done && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 20,
        }}>
          <div style={{
            background: '#0f0f1c',
            border: '2px solid #FF4D6D',
            borderRadius: 28, padding: '28px 22px',
            width: '100%', maxWidth: 340,
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(255,77,109,0.25)',
          }}>
            <div style={{ fontSize: 44, marginBottom: 6 }}>🎉</div>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: '#FF4D6D', textTransform: 'uppercase', marginBottom: 4 }}>Completed!</div>
            <div style={{ fontSize: 42, fontWeight: 700, color: 'white', fontFamily: 'monospace', letterSpacing: -2, marginBottom: 4 }}>{fmt(ms)}</div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>{moves} moves · {pack.pairs.length} pairs</div>

            <div style={{
              background: 'rgba(255,77,109,0.08)',
              border: '1px solid rgba(255,77,109,0.2)',
              borderRadius: 14, padding: '12px 14px', marginBottom: 12,
            }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#FF4D6D' }}>🏆 #234 World</div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>Top 8% globally · {pack.title}</div>
            </div>

            {lastFact && (
              <div style={{
                background: '#111120', border: '1px solid #1e1e35',
                borderRadius: 14, padding: '12px 14px', marginBottom: 16, textAlign: 'left',
              }}>
                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, color: '#6060ff', textTransform: 'uppercase', marginBottom: 6 }}>💡 Did you know?</div>
                <div style={{ fontSize: 12, color: '#aaa', lineHeight: 1.6 }}>{lastFact}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={reset} style={{
                flex: 1, padding: '12px 8px', borderRadius: 14, border: 'none',
                background: '#1a1a2e', color: '#666', fontSize: 13, fontWeight: 800,
                fontFamily: 'inherit', cursor: 'pointer',
              }}>↩️ Again</button>
              <button style={{
                flex: 1, padding: '12px 8px', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg,#FF4D6D,#ff8c00)',
                color: 'white', fontSize: 13, fontWeight: 800,
                fontFamily: 'inherit', cursor: 'pointer',
              }}>🔗 Challenge</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
