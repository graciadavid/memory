'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import { revalidateRanking } from '@/app/actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const BROWN = '#4A2C0A'
const BLUE = '#1565C0'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const LOGO = `${BASE}/digits.webp`
const TROPHY = `${BASE}/nav-trophy.webp`
const BRAIN_GREEN = `${BASE}/brain-green.webp`
const BRAIN_RED = `${BASE}/brain-red.webp`

type Phase = 'intro' | 'show' | 'input' | 'result' | 'gameover'

function generateNumber(digits: number) {
  const min = Math.pow(10, digits - 1)
  const max = Math.pow(10, digits) - 1
  return Math.floor(Math.random() * (max - min + 1) + min).toString()
}

function playTone(freq: number, start: number, duration: number, gain: number, ctx: AudioContext, type: OscillatorType = 'sine') {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
  g.gain.setValueAtTime(0, ctx.currentTime + start)
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)
  osc.connect(g); g.connect(ctx.destination)
  osc.start(ctx.currentTime + start)
  osc.stop(ctx.currentTime + start + duration)
}

function playSuccess() {
  try {
    const ctx = new AudioContext()
    playTone(523, 0, 0.3, 0.2, ctx)
    playTone(659, 0.1, 0.3, 0.2, ctx)
    playTone(784, 0.2, 0.4, 0.25, ctx)
    playTone(1047, 0.3, 0.5, 0.2, ctx)
  } catch(e) {}
}

function playError() {
  try {
    const ctx = new AudioContext()
    playTone(330, 0, 0.2, 0.2, ctx)
    playTone(220, 0.15, 0.4, 0.25, ctx)
  } catch(e) {}
}

function playTick(progress: number) {
  try {
    const ctx = new AudioContext()
    const freq = 400 + (1 - progress) * 400
    playTone(freq, 0, 0.08, 0.05, ctx, 'sine')
  } catch(e) {}
}

function DigitsAutoNext({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const t = setTimeout(onNext, 1500)
    return () => clearTimeout(t)
  }, [])
  return <div style={{ fontSize: 13, color: '#2E7D32', fontWeight: 700, opacity: 0.6 }}>Next level in a moment...</div>
}

function AutoNextDigits({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const t = setTimeout(onNext, 1500)
    return () => clearTimeout(t)
  }, [])
  return <div style={{ fontSize: 13, color: '#2E7D32', fontWeight: 700, opacity: 0.6 }}>Next level in a moment...</div>
}

export default function DigitsPage() {
  const { profile } = usePlayer()
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [level, setLevel] = useState(1)
  const [current, setCurrent] = useState('')
  const [input, setInput] = useState('')
  const [countdown, setCountdown] = useState(4)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const totalTime = 4

  const startGame = () => { setLevel(1); showNumber(1) }

  const showNumber = (lvl: number) => {
    const num = generateNumber(lvl)
    setCurrent(num); setInput('')
    setCountdown(totalTime)
    setPhase('show')
  }

  useEffect(() => {
    if (phase !== 'show') return
    if (countdown <= 0) {
      setPhase('input')
      setTimeout(() => inputRef.current?.focus(), 100)
      return
    }
    playTick(countdown / totalTime)
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  const handleSubmit = async () => {
    if (input === current) {
      playSuccess()
      setPhase('result')
    } else {
      playError()
      if (profile?.name) {
        await supabase.from('number_scores').insert({ player_name: profile.name, level })
        revalidateRanking('digits')
        const { data } = await supabase.from('number_scores').select('player_name, level').order('level', { ascending: false }).limit(200)
        if (data) {
          const best: Record<string, number> = {}
          data.forEach(s => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
          const myBest = best[profile.name] || level
          setWorldRank(Object.values(best).filter(l => l > myBest).length + 1)
        }
      }
      setPhase('gameover')
    }
  }

  const share = async () => {
    const text = `🔢 I reached level ${level} in MemGenius Digits!\nCan you beat me? 👉 https://memgenius.com/digits`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  return (
    <>
      <style>{`
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main style={{
        height: '100dvh',
        background: `linear-gradient(180deg, #EEF4FF 0%, ${CREAM} 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'var(--font-nunito), sans-serif',
        maxWidth: 430, margin: '0 auto',
        overflow: 'hidden', paddingBottom: 80,
      }}>

        {/* Header — logo left + Digits right */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', width: '100%', gap: 12 }}>
          <img
            src={LOGO}
            alt="MemGenius"
            style={{
              height: 60, objectFit: 'contain',
              animation: 'floatLogo 3s ease-in-out infinite',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.1))',
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: BLUE, letterSpacing: -0.5, lineHeight: 1 }}>
              Digits
            </div>
            {phase === 'intro' && (
              <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>
                How far can you go?
              </div>
            )}
          </div>
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '0 20px', gap: 12, width: '100%',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 4 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 6 }}>Remember the number</div>
              <div style={{ fontSize: 13, color: `${BROWN}60`, lineHeight: 1.6 }}>
                A number appears briefly.<br />Memorize it, then type it back.<br />Each level adds one more digit.
              </div>
            </div>

            <button onClick={startGame} style={{
              padding: '18px', borderRadius: 20, border: 'none',
              background: BLUE, color: '#fff',
              fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: '0 8px 0 #0D47A160',
              width: '100%',
            }}>Start</button>

            <Link href="/digits/ranking" style={{ textDecoration: 'none', width: '100%' }}>
              <div style={{
                width: '100%', padding: '16px', borderRadius: 18,
                background: '#fff', border: `1.5px solid ${BLUE}20`,
                textAlign: 'center', cursor: 'pointer', boxSizing: 'border-box',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: `0 4px 12px ${BROWN}08`,
              }}>
                <img src={TROPHY} alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} />
                <span style={{ fontSize: 15, fontWeight: 800, color: BLUE }}>World Ranking</span>
              </div>
            </Link>

            <div style={{ fontSize: 11, fontWeight: 700, color: `${BROWN}30`, letterSpacing: 1, marginTop: 4 }}>
              Always free · No login required
            </div>
          </div>
        )}

        {/* SHOW */}
        {phase === 'show' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, width: '100%', padding: '0 24px' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase' }}>
              Level {level}
            </div>
            <div style={{
              fontSize: level <= 4 ? 72 : level <= 7 ? 52 : level <= 10 ? 38 : 28,
              fontWeight: 900, color: BLUE,
              fontFamily: 'var(--font-nunito), sans-serif',
              letterSpacing: 6, textAlign: 'center', lineHeight: 1.4,
              wordBreak: 'break-all',
            }}>
              {current}
            </div>
            {/* Progress bar — full green, empties left to right, turns red */}
            <div style={{ width: '100%', height: 10, background: '#F4433620', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${(countdown / totalTime) * 100}%`,
                background: countdown >= 3 ? '#4CAF50' : countdown >= 2 ? '#FF9800' : '#F44336',
                borderRadius: 8,
                transition: 'width 1s linear, background 0.5s ease',
              }} />
            </div>
          </div>
        )}

        {/* INPUT */}
        {phase === 'input' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 24px', width: '100%' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center' }}>
              Level {level} · What was the number?
            </div>
            <input
              ref={inputRef}
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && input && handleSubmit()}
              placeholder="Type the number"
              style={{
                width: '100%', padding: '18px 16px',
                borderRadius: 16, border: `2px solid ${BLUE}30`,
                background: '#fff', color: BROWN,
                fontSize: 28, fontWeight: 900,
                fontFamily: 'var(--font-nunito), sans-serif',
                textAlign: 'center', outline: 'none',
                boxSizing: 'border-box', letterSpacing: 4,
              }}
            />
            <button onClick={handleSubmit} disabled={!input} style={{
              padding: '16px', borderRadius: 16, border: 'none',
              background: input ? BLUE : '#e0e0e0',
              color: input ? '#fff' : '#aaa',
              fontSize: 16, fontWeight: 900, fontFamily: 'inherit',
              cursor: input ? 'pointer' : 'default',
              boxShadow: input ? '0 6px 0 #0D47A160' : 'none',
              width: '100%',
            }}>Submit</button>
          </div>
        )}

        {/* RESULT — correct */}
        {phase === 'result' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 24px', width: '100%' }}>
            <div style={{ fontSize: 14, color: `${BROWN}50`, fontWeight: 700 }}>Level {level}</div>
            <div style={{
              fontSize: level <= 6 ? 56 : 38,
              fontWeight: 900, color: BROWN,
              fontFamily: 'var(--font-nunito), sans-serif',
              letterSpacing: 4, textAlign: 'center', wordBreak: 'break-all',
            }}>{current}</div>
            <img loading="lazy" src={BRAIN_GREEN} alt="" style={{ width: 90, height: 90, objectFit: 'contain' }} />
            <div style={{ fontSize: 22, fontWeight: 900, color: '#2E7D32' }}>Correct!</div>
            <AutoNextDigits onNext={() => { const next = level + 1; setLevel(next); showNumber(next) }} />
          </div>
        )}

        {/* GAME OVER */}
        {phase === 'gameover' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 20px', width: '100%' }}>
            <div style={{
              background: CREAM, borderRadius: 24, padding: '24px 20px',
              width: '100%', boxSizing: 'border-box',
              boxShadow: `0 8px 32px ${BROWN}20`,
              border: `1px solid ${GOLD}30`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: `${BROWN}50`, textTransform: 'uppercase', marginBottom: 6 }}>Your Result</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: BROWN, marginBottom: 12 }}>Level {level}</div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1, background: '#E8F5E9', borderRadius: 12, padding: '10px 8px' }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: '#2E7D32', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Correct</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#2E7D32', fontFamily: 'var(--font-nunito), sans-serif', wordBreak: 'break-all' }}>{current}</div>
                </div>
                <div style={{ flex: 1, background: '#FFEBEE', borderRadius: 12, padding: '10px 8px' }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: '#B71C1C', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>You typed</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#B71C1C', fontFamily: 'var(--font-nunito), sans-serif', wordBreak: 'break-all' }}>{input}</div>
                </div>
              </div>

              {worldRank && (
                <div style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}20`, borderRadius: 12, padding: '10px' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>World Ranking</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: BLUE }}>#{worldRank}</div>
                </div>
              )}
            </div>

            <button onClick={() => {
              (window as any).gtag?.('event', 'challenge_shared', { game: 'digits' })
              const url = `${window.location.origin}/challenge?game=digits&score=${level}&by=${encodeURIComponent(profile?.name || 'Someone')}`
              const text = `🔢 ${profile?.name} remembered ${level} digits on MemGenius! Can you beat them? ${url}`
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
            }} style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: '#25D366',
              color: '#fff', fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: '0 6px 0 #128C7E60',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>{<span style={{ fontSize: 20 }}>📲</span>} Send to WhatsApp</button>

            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button onClick={startGame} style={{
                flex: 1, padding: '16px', borderRadius: 16, border: 'none',
                background: GOLD, color: '#fff', fontSize: 13, fontWeight: 800,
                fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${GOLD}50`,
              }}>Play again</button>
              <button onClick={() => router.push('/')} style={{
                flex: 1, padding: '16px', borderRadius: 16, border: 'none',
                background: '#4CAF50', color: '#fff', fontSize: 13, fontWeight: 800,
                fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #2E7D3260',
              }}>Home</button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
