'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const BROWN = '#4A2C0A'
const BLUE = '#1565C0'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

type Phase = 'intro' | 'show' | 'input' | 'result' | 'gameover'

function generateNumber(digits: number) {
  const min = Math.pow(10, digits - 1)
  const max = Math.pow(10, digits) - 1
  return Math.floor(Math.random() * (max - min + 1) + min).toString()
}

export default function NumberPage() {
  const { profile } = usePlayer()
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [level, setLevel] = useState(1)
  const [current, setCurrent] = useState('')
  const [input, setInput] = useState('')
  const [countdown, setCountdown] = useState(3)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [topScores, setTopScores] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchTop() }, [])

  const fetchTop = async () => {
    const { data } = await supabase
      .from('number_scores')
      .select('player_name, level')
      .order('level', { ascending: false })
      .limit(200)
    if (data) {
      const best: Record<string, number> = {}
      data.forEach(s => {
        if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level
      })
      setTopScores(Object.entries(best).map(([name, level]) => ({ name, level })).sort((a, b) => b.level - a.level))
    }
  }

  const startGame = () => { setLevel(1); showNumber(1) }

  const showNumber = (lvl: number) => {
    const num = generateNumber(lvl)
    setCurrent(num); setInput('')
    setCountdown(Math.max(3, lvl + 1))
    setPhase('show')
  }

  useEffect(() => {
    if (phase !== 'show') return
    if (countdown <= 0) { setPhase('input'); setTimeout(() => inputRef.current?.focus(), 100); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  const handleSubmit = async () => {
    if (input === current) {
      setPhase('result')
    } else {
      if (profile?.name) {
        await supabase.from('number_scores').insert({ player_name: profile.name, level })
        // Calculate rank
        const { data } = await supabase.from('number_scores').select('player_name, level').order('level', { ascending: false }).limit(200)
        if (data) {
          const best: Record<string, number> = {}
          data.forEach(s => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
          const sorted = Object.values(best).sort((a, b) => b - a)
          const myBest = best[profile.name] || level
          setWorldRank(sorted.filter(l => l > myBest).length + 1)
        }
        fetchTop()
      }
      setPhase('gameover')
    }
  }

  const share = async () => {
    const text = `🔢 I reached level ${level} in NumGenius!\nCan you beat me? 👉 https://memgenius.com/number`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  const fmt = (n: number) => n === 1 ? '1 digit' : `${n} digits`

  return (
    <main style={{
      height: '100dvh',
      background: `linear-gradient(180deg, #EEF4FF 0%, ${CREAM} 100%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      overflow: 'hidden', paddingBottom: 80,
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '28px 20px 0' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: BLUE, letterSpacing: -1 }}>
          Num<span style={{ color: BROWN }}>Genius</span>
        </div>
        <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 4 }}>
          How many digits can you remember?
        </div>
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 14, width: '100%' }}>
          <div style={{ fontSize: 64 }}>🔢</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: BROWN, marginBottom: 8 }}>Remember the number</div>
            <div style={{ fontSize: 13, color: `${BROWN}60`, lineHeight: 1.6 }}>
              A number will appear briefly.<br />Memorize it, then type it back.<br />Each level adds one more digit.
            </div>
          </div>

          <button onClick={startGame} style={{
            padding: '16px 48px', borderRadius: 18, border: 'none',
            background: BLUE, color: '#fff',
            fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
            cursor: 'pointer', boxShadow: '0 6px 0 #0D47A160',
            width: '100%',
          }}>Start</button>

          <Link href="/number/ranking" style={{ textDecoration: 'none', width: '100%' }}>
            <div style={{
              width: '100%', padding: '14px', borderRadius: 16,
              background: '#fff', border: `1.5px solid ${BLUE}20`,
              textAlign: 'center', cursor: 'pointer', boxSizing: 'border-box',
            }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: BLUE }}>🏆 World Ranking</span>
            </div>
          </Link>


        </div>
      )}

      {/* SHOW */}
      {phase === 'show' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase' }}>
            Level {level} · {fmt(level)}
          </div>
          <div style={{
            fontSize: level <= 4 ? 72 : level <= 7 ? 52 : level <= 10 ? 38 : 28,
            fontWeight: 900, color: BLUE, fontFamily: 'monospace',
            letterSpacing: 8, textAlign: 'center', padding: '0 20px', lineHeight: 1.4,
          }}>
            {current}
          </div>
          <div style={{ width: '80%', marginTop: 16 }}>
            <div style={{ height: 8, background: `${BLUE}15`, borderRadius: 8, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(countdown / Math.max(3, level + 1)) * 100}%`,
                background: BLUE,
                borderRadius: 8,
                transition: 'width 0.9s linear',
              }} />
            </div>
          </div>
        </div>
      )}

      {/* INPUT */}
      {phase === 'input' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 24px', width: '100%' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase' }}>
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
              fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-nunito), sans-serif',
              textAlign: 'center', outline: 'none', boxSizing: 'border-box', letterSpacing: 2,
            }}
          />
          <button onClick={handleSubmit} disabled={!input} style={{
            padding: '14px 48px', borderRadius: 16, border: 'none',
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 24px', width: '100%' }}>
          <div style={{ fontSize: 48 }}>✅</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#2E7D32' }}>Correct!</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: BROWN, fontFamily: 'monospace', letterSpacing: 4 }}>{current}</div>
          <div style={{ fontSize: 14, color: `${BROWN}50`, fontWeight: 700 }}>Level {level} · {fmt(level)}</div>
          <button onClick={() => { setLevel(l => l + 1); showNumber(level + 1) }} style={{
            padding: '16px', borderRadius: 18, border: 'none',
            background: BLUE, color: '#fff', fontSize: 18, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 6px 0 #0D47A160', width: '100%',
          }}>Next Level →</button>
        </div>
      )}

      {/* GAME OVER */}
      {phase === 'gameover' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 20px', width: '100%' }}>

          {/* Result card */}
          <div style={{
            background: CREAM, borderRadius: 24, padding: '24px 20px',
            width: '100%', boxSizing: 'border-box',
            boxShadow: `0 8px 32px ${BROWN}20`,
            border: `1px solid ${GOLD}30`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: `${BROWN}50`, textTransform: 'uppercase', marginBottom: 8 }}>
              Your Result
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: BROWN, marginBottom: 4 }}>
              Level {level}
            </div>
            <div style={{ fontSize: 14, color: `${BROWN}50`, fontWeight: 700, marginBottom: 16 }}>
              {fmt(level)}
            </div>

            {/* Correct vs wrong */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, background: '#E8F5E9', borderRadius: 12, padding: '10px 8px' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#2E7D32', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Correct</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#2E7D32', fontFamily: 'monospace', letterSpacing: 2, wordBreak: 'break-all' }}>{current}</div>
              </div>
              <div style={{ flex: 1, background: '#FFEBEE', borderRadius: 12, padding: '10px 8px' }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#B71C1C', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>You typed</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#B71C1C', fontFamily: 'monospace', letterSpacing: 2, wordBreak: 'break-all' }}>{input}</div>
              </div>
            </div>

            {/* World rank */}
            {worldRank && (
              <div style={{
                background: `${BLUE}10`, border: `1px solid ${BLUE}20`,
                borderRadius: 12, padding: '10px', marginBottom: 12,
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>World Ranking</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: BLUE }}>#{worldRank}</div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <button onClick={share} style={{
            width: '100%', padding: '13px', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #1877F2, #0a5dc2)',
            color: '#fff', fontSize: 14, fontWeight: 800,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 6px 0 #0a4a9960',
          }}>Share my result ↑</button>

          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button onClick={startGame} style={{
              flex: 1, padding: '13px', borderRadius: 14, border: 'none',
              background: GOLD, color: '#fff', fontSize: 13, fontWeight: 800,
              fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: `0 6px 0 ${GOLD}50`,
            }}>Play again</button>
            <button onClick={() => router.push('/')} style={{
              flex: 1, padding: '13px', borderRadius: 14, border: 'none',
              background: '#4CAF50', color: '#fff', fontSize: 13, fontWeight: 800,
              fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: '0 6px 0 #2E7D3260',
            }}>Home</button>
          </div>
        </div>
      )}
    </main>
  )
}
