'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import CreateGroupBanner from '@/components/CreateGroupBanner'
import { track } from '@vercel/analytics'
import { updateStreak } from '@/lib/streak'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const BLUE = '#1565C0'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const LOGO = `${BASE}/digits.webp`
const TROPHY = `${BASE}/nav-trophy.webp`

type Phase = 'intro' | 'show' | 'input' | 'result' | 'gameover'

function generateDigits(count: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 10))
}

function playSound(freq1: number, freq2: number, duration: number, vol: number) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq1, ctx.currentTime)
    osc.frequency.setValueAtTime(freq2, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + duration)
  } catch(e) {}
}

export default function DigitsPage() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('intro')
  const [level, setLevel] = useState(3)
  const [sequence, setSequence] = useState<number[]>([])
  const [input, setInput] = useState<number[]>([])
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [topScores, setTopScores] = useState<{ name: string, level: number }[]>([])
  const [bestLevel, setBestLevel] = useState<number | null>(null)
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { fetchTop() }, [])

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('number_scores').select('level').eq('player_name', profile.name)
      .order('level', { ascending: false }).limit(1)
      .then(({ data }) => { if (data?.[0]) setBestLevel(data[0].level) })
  }, [profile?.name])

  const fetchTop = async () => {
    const { data } = await supabase.from('number_scores').select('player_name, level')
      .order('level', { ascending: false }).limit(200)
    if (data) {
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
      setTopScores(Object.entries(best).map(([name, level]) => ({ name, level })).sort((a, b) => b.level - a.level))
    }
  }

  const startGame = (lvl: number) => {
    const seq = generateDigits(lvl)
    setSequence(seq)
    setInput([])
    setLevel(lvl)
    setPhase('show')
    if (showTimer.current) clearTimeout(showTimer.current)
    showTimer.current = setTimeout(() => setPhase('input'), 2500)
  }

  const handleDigit = (n: number) => {
    if (phase !== 'input') return
    const next = [...input, n]
    setInput(next)
    if (next.length === level) {
      const correct = next.every((d, i) => d === sequence[i])
      if (correct) {
        playSound(660, 880, 0.3, 0.2)
        setPhase('result')
        setTimeout(() => startGame(level + 1), 1200)
      } else {
        playSound(220, 150, 0.4, 0.2)
        setPhase('gameover')
        saveScore(level - 1)
      }
    }
  }

  const handleDelete = () => {
    if (phase !== 'input') return
    setInput(prev => prev.slice(0, -1))
  }

  const saveScore = async (finalLevel: number) => {
    if (!profile?.name || finalLevel < 1) return
    await supabase.from('number_scores').insert({ player_name: profile.name, level: finalLevel })
    await updateStreak(profile.name)
    window.dispatchEvent(new Event('game_completed'))
    const { data } = await supabase.from('number_scores').select('player_name, level')
      .order('level', { ascending: false }).limit(200)
    if (data) {
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
      const myBest = best[profile.name] || finalLevel
      setWorldRank(Object.values(best).filter(l => l > myBest).length + 1)
      if (!bestLevel || finalLevel > bestLevel) setBestLevel(finalLevel)
      setTopScores(Object.entries(best).map(([name, level]) => ({ name, level })).sort((a, b) => b.level - a.level))
    }
  }

  useEffect(() => {
    return () => { if (showTimer.current) clearTimeout(showTimer.current) }
  }, [])

  return (
    <main style={{ minHeight: '100dvh', background: `linear-gradient(180deg, #E3F2FD 0%, ${CREAM} 100%)`, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 80 }}>
      <style>{`@keyframes floatLogo { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} } @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', gap: 12 }}>
        <img src={LOGO} alt="Digits" style={{ height: 52, objectFit: 'contain', animation: 'floatLogo 3s ease-in-out infinite', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 26, fontWeight: 900, color: BLUE, letterSpacing: -0.5 }}>Digits</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>How many digits can you remember?</div>
        </div>
        {(phase === 'show' || phase === 'input' || phase === 'result') && (
          <div style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 900, color: BLUE }}>{level}</div>
        )}
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 8 }}>Memorize the digits, then type them in order</div>
            <div style={{ fontSize: 13, color: `${BROWN}60`, lineHeight: 1.7 }}>
              You have 2.5 seconds to memorize.<br />
              Each correct round adds one digit.<br />
              One mistake and it's over.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #4A2C0A10' }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Your best</div>
              {bestLevel ? (
                <div style={{ fontSize: 32, fontWeight: 900, color: BLUE }}>{bestLevel}</div>
              ) : (
                <div style={{ fontSize: 14, color: '#4A2C0A30', fontWeight: 700 }}>—</div>
              )}
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #4A2C0A10' }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>World record</div>
              {topScores[0] ? (
                <>
                  <div style={{ fontSize: 32, fontWeight: 900, color: GOLD }}>{topScores[0].level}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#4A2C0A60', marginTop: 4 }}>{topScores[0].name}</div>
                </>
              ) : (
                <div style={{ fontSize: 14, color: '#4A2C0A30', fontWeight: 700 }}>—</div>
              )}
            </div>
          </div>

          <button onClick={() => startGame(3)} style={{
            width: '100%', padding: '18px', borderRadius: 20, border: 'none',
            background: BLUE, color: '#fff', fontSize: 18, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 8px 0 ${BLUE}60`,
          }}>Play</button>

          <Link href="/digits/ranking" style={{ textDecoration: 'none', width: '100%' }}>
            <div style={{ width: '100%', padding: '14px', borderRadius: 16, background: '#fff', border: `1.5px solid ${BROWN}20`, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxSizing: 'border-box' }}>
              <img src={TROPHY} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
              <span style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>World Ranking</span>
            </div>
          </Link>
        </div>
      )}

      {/* SHOW */}
      {phase === 'show' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase' }}>Memorize</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {sequence.map((d, i) => (
              <div key={i} style={{
                width: 52, height: 64, borderRadius: 14,
                background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 900, color: '#fff',
                boxShadow: `0 6px 0 ${BLUE}60`,
                animation: 'popIn 0.3s ease',
                animationDelay: `${i * 0.05}s`,
              }}>{d}</div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: `${BROWN}40`, fontWeight: 700 }}>Disappears in 2.5s...</div>
        </div>
      )}

      {/* INPUT */}
      {phase === 'input' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', gap: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase' }}>Type them in order</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {sequence.map((_, i) => (
              <div key={i} style={{
                width: 48, height: 60, borderRadius: 12,
                background: input[i] !== undefined ? BLUE : '#E3F2FD',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 900,
                color: input[i] !== undefined ? '#fff' : `${BROWN}20`,
                border: `2px solid ${input[i] !== undefined ? BLUE : '#90CAF9'}`,
              }}>{input[i] !== undefined ? input[i] : ''}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%', maxWidth: 300, marginTop: 8 }}>
            {[1,2,3,4,5,6,7,8,9,'⌫',0,''].map((n, i) => (
              n === '' ? <div key={i} /> :
              n === '⌫' ? (
                <button key={i} onClick={handleDelete} style={{ padding: '18px', borderRadius: 14, border: 'none', background: '#fff', fontSize: 20, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 3px 0 #4A2C0A10' }}>⌫</button>
              ) : (
                <button key={i} onClick={() => handleDigit(n as number)} style={{ padding: '18px', borderRadius: 14, border: 'none', background: '#fff', fontSize: 22, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 3px 0 #4A2C0A10', color: BROWN }}>{n}</button>
              )
            ))}
          </div>
        </div>
      )}

      {/* RESULT - correct */}
      {phase === 'result' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: 16 }}>
          <div style={{ fontSize: 48, }}>✓</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#2E7D32' }}>Correct!</div>
          <div style={{ fontSize: 16, color: `${BROWN}50`, fontWeight: 700 }}>Get ready for {level + 1} digits...</div>
        </div>
      )}

      {/* GAMEOVER */}
      {phase === 'gameover' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 20px' }}>
          <div style={{
            background: CREAM, borderRadius: 24, padding: '24px 20px', width: '100%',
            boxSizing: 'border-box', boxShadow: `0 8px 32px ${BROWN}20`,
            border: `1px solid ${GOLD}30`, textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: `${BROWN}50`, textTransform: 'uppercase', marginBottom: 6 }}>Game Over</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: BLUE, lineHeight: 1 }}>{level - 1}</div>
            <div style={{ fontSize: 13, color: `${BROWN}50`, fontWeight: 700, marginBottom: 8 }}>digits remembered</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: `${BROWN}60`, marginBottom: 16 }}>
              The sequence was: <span style={{ color: BLUE }}>{sequence.join(' ')}</span>
            </div>
            {worldRank && (
              <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}20`, borderRadius: 12, padding: '10px' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>World Ranking</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>#{worldRank}</div>
              </div>
            )}
          </div>

          <CreateGroupBanner playerName={profile?.name || ''} />

          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button onClick={() => {
              const url = `${window.location.origin}/challenge?game=digits&score=${level - 1}&by=${encodeURIComponent(profile?.name || 'Someone')}`
              const text = `🔢 ${profile?.name} remembered ${level - 1} digits in a row on MemGenius! Can you beat them? ${url}`
              track('challenge_shared')
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
            }} style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: '#25D366', color: '#fff', fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #128C7E60',
            }}>Send to WhatsApp</button>
            <button onClick={() => startGame(3)} style={{
              flex: 1, padding: '16px', borderRadius: 16, border: 'none',
              background: GOLD, color: '#fff', fontSize: 13, fontWeight: 800,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${GOLD}50`,
            }}>Play again</button>
          </div>
        </div>
      )}
    </main>
  )
}
