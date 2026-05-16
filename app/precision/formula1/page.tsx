'use client'
import { useState, useRef, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { updateStreak } from '@/lib/streak'

const BROWN = '#4A2C0A'




const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const RED = '#E8002D'
const BLACK = '#1a1a1a'

export default function Formula1Page() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<'idle' | 'lighting' | 'waiting' | 'go' | 'result' | 'jumpstart'>('idle')
  const [litCount, setLitCount] = useState(0)
  const [reactionMs, setReactionMs] = useState(0)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [worldRecord, setWorldRecord] = useState<{ diff: number, name: string } | null>(null)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const goTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const getAudioCtx = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume()
    return audioCtxRef.current
  }

  const playLight = () => {
    try {
      const ctx = getAudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } catch(e) {}
  }

  useEffect(() => {
    supabase.from('precision_scores')
      .select('player_name, difference_ms')
      .eq('game_type', 'formula1')
      .order('difference_ms', { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setWorldRecord({ diff: data[0].difference_ms, name: data[0].player_name })
      })
  }, [])

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('precision_scores')
      .select('difference_ms')
      .eq('player_name', profile.name)
      .eq('game_type', 'formula1')
      .order('difference_ms', { ascending: true })
      .limit(1)
      .then(({ data }) => { if (data?.[0]) setBestScore(data[0].difference_ms) })
  }, [profile?.name])

  const startSequence = () => {
    try { getAudioCtx() } catch(e) {}
    setPhase('lighting')
    setLitCount(0)

    // Light up 5 lights one by one
    let count = 0
    const lightUp = () => {
      count++
      setLitCount(count)
      playLight()
      playLight()
      if (count < 5) {
        timeoutRef.current = setTimeout(lightUp, 1000)
      } else {
        // All lit — wait random 0.5-3s then go
        const waitMs = 500 + Math.random() * 2500
        timeoutRef.current = setTimeout(() => {
          setPhase('go')
          goTimeRef.current = Date.now()
        }, waitMs)
        setPhase('waiting')
      }
    }
    timeoutRef.current = setTimeout(lightUp, 800)
  }

  const handlePress = async () => {
    if (phase === 'lighting' || phase === 'waiting') {
      // Jump start!
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setPhase('jumpstart')
      return
    }

    if (phase === 'go') {
      const reaction = Date.now() - goTimeRef.current
      setReactionMs(reaction)
      setPhase('result')

      if (profile?.name) {
        await supabase.from('precision_scores').insert({
          player_name: profile.name,
          difference_ms: reaction,
          game_type: 'formula1',
        })
        await updateStreak(profile.name)
        window.dispatchEvent(new Event('game_completed'))

        const { count } = await supabase
          .from('precision_scores')
          .select('*', { count: 'exact', head: true })
          .eq('game_type', 'formula1')
          .lt('difference_ms', reaction)
        setWorldRank((count ?? 0) + 1)
        if (bestScore === null || reaction < bestScore) setBestScore(reaction)
      }
    }
  }

  const reset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setPhase('idle')
    setLitCount(0)
    setReactionMs(0)
    setWorldRank(null)
  }

  // Semaphore component
  const Semaphore = ({ lit }: { lit: boolean }) => (
    <div style={{
      background: BLACK,
      borderRadius: 12,
      padding: '8px 6px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      border: '2px solid #333',
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: lit && i >= 1 ? RED : '#2a2a2a',
          boxShadow: lit && i >= 1 ? `0 0 16px ${RED}` : 'none',
          transition: 'all 0.15s',
        }} />
      ))}
    </div>
  )

  return (
    <>
    <main style={{
      height: '100dvh',
      background: phase === 'go' ? '#0a0a0a' : `radial-gradient(ellipse at 50% 0%, #fff5f5 0%, ${CREAM} 50%)`,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      transition: 'background 0.3s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', gap: 12 }}>
        <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/f1.png" alt="" style={{ height: 52, objectFit: 'contain', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: phase === 'go' ? '#fff' : RED, letterSpacing: -0.5 }}>F1 Reaction</div>
          <div style={{ fontSize: 11, color: phase === 'go' ? 'rgba(255,255,255,0.5)' : `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>React when the lights go out</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 28 }}>

        {/* Semaphores */}
        {(phase === 'idle' || phase === 'lighting' || phase === 'waiting' || phase === 'go') && (
          <>
          <div style={{ fontSize: 13, fontWeight: 900, color: phase === 'go' ? 'rgba(255,255,255,0.7)' : `${BROWN}60`, letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center' }}>Reaction Time</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <Semaphore key={n} lit={phase === 'waiting' ? true : litCount >= n} />
            ))}
          </div>
          </>
        )}

        {phase === 'idle' && (
          <>
            <div style={{ textAlign: 'center', color: `${BROWN}60`, fontSize: 14, fontWeight: 700, lineHeight: 1.6 }}>
              Wait for the lights to go out,<br />then react as fast as possible!
            </div>
            {bestScore !== null && (
              <div style={{ background: `${RED}10`, borderRadius: 16, padding: '12px 24px', textAlign: 'center', border: `1px solid ${RED}20` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: RED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Your best</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: BROWN }}>{bestScore}ms</div>
              </div>
            )}
            <button onClick={startSequence} style={{
              width: '100%', padding: '20px', borderRadius: 20, border: 'none',
              background: RED, color: '#fff', fontSize: 20, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 8px 0 ${RED}60`,
            }}>Get Ready</button>
          </>
        )}

        {phase === 'lighting' && (
          <div style={{ fontSize: 16, fontWeight: 700, color: `${BROWN}60`, textAlign: 'center' }}>
            Lights coming on...
          </div>
        )}

        {phase === 'waiting' && (
          <div style={{ fontSize: 18, fontWeight: 900, color: RED, textAlign: 'center', letterSpacing: 1 }}>
            WAIT...
          </div>
        )}

        {phase === 'go' && (
          <>
            <div style={{ fontSize: 64, fontWeight: 900, color: '#fff', letterSpacing: 2, animation: 'pulse 0.5s ease-in-out infinite' }}>
              GO!
            </div>
            <button onClick={handlePress} style={{
              width: '100%', padding: '32px', borderRadius: 24, border: 'none',
              background: '#00C853', color: '#fff', fontSize: 28, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: '0 10px 0 #00952060',
            }}>ACCELERATE</button>
          </>
        )}

        {phase === 'jumpstart' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
            <div style={{ fontSize: 64 }}>🚩</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: RED, textAlign: 'center' }}>JUMP START!</div>
            <div style={{ fontSize: 14, color: `${BROWN}60`, fontWeight: 700 }}>You pressed too early</div>
            <button onClick={reset} style={{
              width: '100%', padding: '18px', borderRadius: 18, border: 'none',
              background: RED, color: '#fff', fontSize: 18, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${RED}60`,
            }}>Try again</button>
          </div>
        )}

        {phase === 'result' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
            <div style={{ width: '100%', background: '#fff', borderRadius: 24, padding: '24px', boxShadow: `0 8px 32px ${BROWN}15`, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Reaction time</div>
              <div style={{ fontSize: 64, fontWeight: 900, color: reactionMs < 200 ? '#00C853' : reactionMs < 300 ? GOLD : RED, letterSpacing: -2 }}>
                {reactionMs}ms
              </div>
              <div style={{ fontSize: 13, color: `${BROWN}50`, marginBottom: 12 }}>
                {reactionMs < 150 ? '🏆 Incredible!' : reactionMs < 200 ? '🔥 Elite!' : reactionMs < 250 ? '⚡ Fast!' : reactionMs < 350 ? '👍 Good' : '💪 Keep training'}
              </div>
              {worldRank && (
                <div style={{ fontSize: 14, color: `${BROWN}60`, fontWeight: 700 }}>
                  World Ranking: <span style={{ color: GOLD, fontWeight: 900 }}>#{worldRank}</span>
                </div>
              )}
            </div>

            <button onClick={() => {
              const url = `${window.location.origin}/challenge?game=formula1&score=${reactionMs}&by=${encodeURIComponent(profile?.name || 'Someone')}`
              const text = `🏎️ ${profile?.name} reacted in ${reactionMs}ms on MemGenius F1! Can you beat them? ${url}`
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
            }} style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: '#25D366', color: '#fff', fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #128C7E60',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}><span style={{ fontSize: 20 }}>📲</span> Send to WhatsApp</button>

            <button onClick={reset} style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: RED, color: '#fff', fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${RED}60`,
            }}>Play again</button>
          </div>
        )}

        {/* Tap anywhere when GO */}
        {(phase === 'lighting' || phase === 'waiting') && (
          <button onClick={handlePress} style={{
            position: 'fixed', inset: 0, background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 10,
          }} />
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:0.8; transform:scale(1.05) } }`}</style>
    </main>

    {/* SEO Content */}
    <section style={{
      maxWidth: 430, margin: '0 auto',
      padding: '48px 24px 120px',
      fontFamily: 'var(--font-nunito), sans-serif',
      background: '#FAF7F2',
    }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>
        F1 Reaction — F1 Reaction Time Test
      </h2>
      <p style={{ fontSize: 14, color: '#4A2C0A99', lineHeight: 1.8, marginBottom: 24 }}>
        F1 Reaction simulates the most iconic moment in motorsport — the starting lights. Five red lights illuminate one by one, just like a real Formula 1 race start. When they go out, hit the accelerator as fast as you can. Your reaction time is measured in milliseconds. How close to an F1 driver can you get?
      </p>
      <p style={{ fontSize: 14, color: '#4A2C0A99', lineHeight: 1.8, marginBottom: 32 }}>
        Professional F1 drivers react in around 200ms. The average human reaction time is 250ms. With practice, you can train your nervous system to respond faster. F1 Reaction is one of the most addictive games on MemGenius precisely because every millisecond counts and improvement is always visible.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { q: 'How does F1 Reaction work?', a: 'Five red lights appear one by one like a real F1 start. When all lights go out, tap the screen as fast as possible. Your reaction time in milliseconds is your score.' },
          { q: 'What is a good reaction time?', a: 'Under 200ms is exceptional — that is F1 driver territory. Under 250ms is very good. The average human reaction time is around 250-300ms. Anything under 150ms may be flagged as a false start.' },
          { q: 'Can reaction time be improved with practice?', a: 'Yes. Regular reaction time training has been shown to produce measurable improvements. Your nervous system adapts and the signal between eye and hand becomes faster with repetition.' },
          { q: 'Is F1 Reaction free?', a: 'Completely free with no login required. Your fastest reaction time is saved to the world ranking automatically.' },
          { q: 'Does it work on mobile?', a: 'Yes, F1 Reaction is fully optimized for mobile. Tap anywhere on screen when the lights go out.' },
        ].map((item, i) => (
          <details key={i} style={{
            background: '#fff', borderRadius: 14,
            border: '1px solid #4A2C0A15',
            padding: '14px 18px',
          }}>
            <summary style={{
              fontSize: 14, fontWeight: 800, color: '#4A2C0A',
              cursor: 'pointer', listStyle: 'none',
            }}>
              {item.q}
            </summary>
            <p style={{ fontSize: 13, color: '#4A2C0A80', lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>

    </>
  )
}
