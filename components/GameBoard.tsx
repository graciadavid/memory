'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import ResultOverlay from './ResultOverlay'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const BUCKET = 'storage'
const EAGLE = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/eagle.png`

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'

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

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const colors = [GOLD, BROWN, '#FF4D6D', '#ff8c00', '#FFD700', '#00e676']
    const particles = Array.from({ length: 150 }, (_, i) => ({
      id: i, x: Math.random() * canvas.width, y: -20,
      vx: (Math.random() - 0.5) * 5, vy: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 9 + 4, rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
    }))
    let frame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.rotation += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5)
        ctx.restore()
      })
      if (particles.some(p => p.y < canvas.height + 20)) frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200 }} />
}

export default function GameBoard({ pack }: { pack: any }) {
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [wrong, setWrong] = useState<string[]>([])
  const [ms, setMs] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [lastFact, setLastFact] = useState('')
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)
  const msRef = useRef<number>(0)

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
    if (running && !done) {
      startRef.current = Date.now() - msRef.current
      const tick = () => {
        const now = Date.now() - startRef.current
        msRef.current = now
        setMs(now)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(rafRef.current)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [running, done])

  useEffect(() => {
    if (matched.length > 0 && matched.length === pack.pairs.length) {
      setDone(true)
      setRunning(false)
      playChimes()
      // fetch rank in background — don't block result screen
      supabase
        .from('scores')
        .select('*', { count: 'exact', head: true })
        .eq('pack_id', pack.id)
        .lt('time_ms', msRef.current)
        .then(({ count }) => setWorldRank((count ?? 0) + 1))
    }
  }, [matched])

  useEffect(() => {
    if (flipped.length !== 2) return
    const [a, b] = flipped.map(uid => cards.find(c => c.uid === uid)!)
    if (!a || !b) return
    if (a.pairId === b.pairId && a.side !== b.side) {
      const fact = pack.pairs.find((p: Pair) => p.id === a.pairId)?.fun_fact || ''
      setLastFact(fact)
      playMatch()
      setTimeout(() => { setMatched(m => [...m, a.pairId]); setFlipped([]) }, 500)
    } else {
      setWrong(flipped)
      playWrong()
      setTimeout(() => { setFlipped([]); setWrong([]) }, 800)
    }
  }, [flipped])

  const playTone = (freq: number, start: number, duration: number, gain: number, ctx: AudioContext) => {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
    g.gain.setValueAtTime(0, ctx.currentTime + start)
    g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)
    osc.connect(g); g.connect(ctx.destination)
    osc.start(ctx.currentTime + start)
    osc.stop(ctx.currentTime + start + duration)
  }

  const playMatch = () => {
    try { const ctx = new AudioContext(); playTone(880, 0, 0.3, 0.3, ctx); playTone(1100, 0.1, 0.3, 0.2, ctx) } catch(e) {}
  }
  const playWrong = () => {
    try { const ctx = new AudioContext(); playTone(220, 0, 0.3, 0.2, ctx) } catch(e) {}
  }
  const playChimes = () => {
    try {
      const ctx = new AudioContext()
      const notes = [523, 659, 784, 1047, 1319, 1047, 784, 1319, 1047]
      notes.forEach((freq, i) => playTone(freq, i * 0.15, 0.6, 0.25, ctx))
    } catch(e) {}
  }

  const flip = (uid: string) => {
    if (flipped.length === 2) return
    if (flipped.includes(uid)) return
    const card = cards.find(c => c.uid === uid)!
    if (matched.includes(card.pairId)) return
    if (!running) setRunning(true)
    setFlipped(f => [...f, uid])
  }

  const reset = () => {
    cancelAnimationFrame(rafRef.current)
    msRef.current = 0
    setCards(buildCards())
    setFlipped([]); setMatched([]); setWrong([])
    setMs(0); setRunning(false); setDone(false)
    setWorldRank(null); setLastFact('')
  }

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  return (
    <main style={{
      height: '100dvh',
      background: 'linear-gradient(180deg, #FAF7F2 0%, #F0EBE1 100%)',
      display: 'flex', flexDirection: 'column',
      maxWidth: 430, margin: '0 auto',
      overflow: 'hidden', fontFamily: 'var(--font-nunito), sans-serif',
      touchAction: 'none',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px 6px',
      }}>
        <div style={{ fontSize: 16, fontWeight: 900 }}>
          <span style={{ color: GOLD }}>Mem</span>
          <span style={{ color: BROWN }}>Genius</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, letterSpacing: 1 }}>
          {pack.title}
        </div>
      </div>

      {/* Timer */}
      <div style={{ textAlign: 'center', padding: '2px 0 6px' }}>
        <div style={{
          fontSize: 28, fontWeight: 700, fontFamily: 'monospace',
          color: running ? BROWN : `${BROWN}20`,
          transition: 'color 0.3s', letterSpacing: 2,
        }}>{fmt(ms)}</div>
      </div>

      {/* Progress */}
      <div style={{ padding: '0 14px 8px' }}>
        <div style={{ height: 3, background: `${BROWN}12`, borderRadius: 3, overflow: 'hidden', marginBottom: 5 }}>
          <div style={{
            height: '100%',
            width: `${(matched.length / pack.pairs.length) * 100}%`,
            background: `linear-gradient(90deg, ${GOLD}, ${BROWN})`,
            borderRadius: 3, transition: 'width 0.5s',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {pack.pairs.map((_: any, i: number) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: matched.length > i ? GOLD : `${BROWN}15`,
              transition: 'all 0.3s',
              boxShadow: matched.length > i ? `0 0 6px ${GOLD}` : 'none',
            }} />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 7, padding: '0 10px', flex: 1, minHeight: 0,
      }}>
        {cards.map(card => {
          const isFlipped = flipped.includes(card.uid) || matched.includes(card.pairId)
          const isMatched = matched.includes(card.pairId)
          const isWrong = wrong.includes(card.uid)

          return (
            <div key={card.uid} onClick={() => flip(card.uid)}
              style={{ perspective: 600, cursor: 'pointer' }}>
              <div style={{
                width: '100%', height: '100%', position: 'relative',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
                borderRadius: 14,
              }}>

                {/* Back — gold background, dark eagle */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 14,
                  backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                  background: `linear-gradient(145deg, ${GOLD}, #A07008)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 12px ${GOLD}40`,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 2, borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }} />
                  <img
                    src={EAGLE}
                    alt=""
                    style={{
                      width: '90%', height: '90%',
                      objectFit: 'contain',
                      filter: 'brightness(0.3) sepia(1) saturate(0)',
                      mixBlendMode: 'multiply',
                    }}
                  />
                </div>

                {/* Front */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 14,
                  backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)', overflow: 'hidden',
                  background: '#fff',
                  boxShadow: isMatched
                    ? `0 4px 12px ${GOLD}60, inset 0 0 0 2.5px ${GOLD}`
                    : `0 3px 10px ${BROWN}15`,
                  filter: isWrong ? 'brightness(0.8)' : 'none',
                  transition: 'box-shadow 0.3s, filter 0.2s',
                }}>
                  <img
                    src={card.img} alt={card.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>

              </div>
            </div>
          )
        })}
      </div>

      <div style={{ height: 6 }} />

      {done && <Confetti />}
      {done && (
        <ResultOverlay
          ms={ms}
          pack={pack}
          worldRank={worldRank}
          lastFact={lastFact}
          onReset={reset}
        />
      )}
    </main>
  )
}
