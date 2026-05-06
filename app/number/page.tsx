'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const BROWN = '#4A2C0A'
const BLUE = '#1565C0'
const CREAM = '#FAF7F2'

type Phase = 'intro' | 'show' | 'input' | 'result' | 'gameover'

function generateNumber(digits: number) {
  const min = Math.pow(10, digits - 1)
  const max = Math.pow(10, digits) - 1
  return Math.floor(Math.random() * (max - min + 1) + min).toString()
}

export default function NumberPage() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('intro')
  const [level, setLevel] = useState(1)
  const [current, setCurrent] = useState('')
  const [input, setInput] = useState('')
  const [best, setBest] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [topScores, setTopScores] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchTop()
  }, [])

  const fetchTop = async () => {
    const { data } = await supabase
      .from('number_scores')
      .select('player_name, level')
      .order('level', { ascending: false })
      .limit(20)
    if (data) {
      const best: Record<string, number> = {}
      data.forEach(s => {
        if (!best[s.player_name] || s.level > best[s.player_name]) {
          best[s.player_name] = s.level
        }
      })
      const sorted = Object.entries(best)
        .map(([name, level]) => ({ name, level }))
        .sort((a, b) => b.level - a.level)
      setTopScores(sorted)
    }
  }

  const startGame = () => {
    setLevel(1)
    setBest(0)
    showNumber(1)
  }

  const showNumber = (lvl: number) => {
    const num = generateNumber(lvl)
    setCurrent(num)
    setInput('')
    setCountdown(lvl + 2)
    setPhase('show')
  }

  useEffect(() => {
    if (phase !== 'show') return
    if (countdown <= 0) {
      setPhase('input')
      setTimeout(() => inputRef.current?.focus(), 100)
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  const handleSubmit = async () => {
    if (input === current) {
      setBest(level)
      setPhase('result')
    } else {
      // Game over — save score
      if (profile?.name) {
        await supabase.from('number_scores').insert({
          player_name: profile.name,
          level: level,
        })
        fetchTop()
      }
      setPhase('gameover')
    }
  }

  const nextLevel = () => {
    const next = level + 1
    setLevel(next)
    showNumber(next)
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 20 }}>
          <div style={{ fontSize: 64 }}>🔢</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: BROWN, marginBottom: 8 }}>Remember the number</div>
            <div style={{ fontSize: 14, color: `${BROWN}60`, lineHeight: 1.6 }}>
              A number will appear on screen.<br />Memorize it, then type it back.<br />Each level adds one more digit.
            </div>
          </div>
          <button onClick={startGame} style={{
            padding: '16px 48px', borderRadius: 18, border: 'none',
            background: BLUE, color: '#fff',
            fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
            cursor: 'pointer', boxShadow: '0 6px 0 #0D47A160',
          }}>Start</button>

          {/* Top scores */}
          {topScores.length > 0 && (
            <div style={{ width: '100%', marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' }}>
                World Ranking
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {topScores.slice(0, 5).map((s, i) => (
                  <div key={s.name} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#fff', borderRadius: 12, padding: '10px 14px',
                    boxShadow: `0 2px 8px ${BROWN}08`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: i === 0 ? '#C8960C' : `${BROWN}30`, width: 20 }}>{i + 1}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>{s.name}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: BLUE }}>{fmt(s.level)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SHOW number */}
      {phase === 'show' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase' }}>
            Level {level} · {fmt(level)}
          </div>
          <div style={{
            fontSize: level <= 4 ? 72 : level <= 7 ? 56 : level <= 10 ? 42 : 32,
            fontWeight: 900, color: BLUE, fontFamily: 'monospace',
            letterSpacing: 8, textAlign: 'center', padding: '0 20px',
            lineHeight: 1.3,
          }}>
            {current}
          </div>
          <div style={{
            fontSize: 48, fontWeight: 900, color: `${BROWN}30`,
          }}>{countdown}</div>
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
              fontSize: 28, fontWeight: 900, fontFamily: 'monospace',
              textAlign: 'center', outline: 'none',
              boxSizing: 'border-box',
              letterSpacing: 4,
            }}
          />
          <button onClick={handleSubmit} disabled={!input} style={{
            padding: '14px 48px', borderRadius: 16, border: 'none',
            background: input ? BLUE : '#e0e0e0',
            color: input ? '#fff' : '#aaa',
            fontSize: 16, fontWeight: 900, fontFamily: 'inherit',
            cursor: input ? 'pointer' : 'default',
            boxShadow: input ? '0 6px 0 #0D47A160' : 'none',
          }}>Submit</button>
        </div>
      )}

      {/* RESULT — correct */}
      {phase === 'result' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 24px' }}>
          <div style={{ fontSize: 56 }}>✅</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#2E7D32', textAlign: 'center' }}>
            Correct!
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, color: BROWN, fontFamily: 'monospace', letterSpacing: 4 }}>
            {current}
          </div>
          <div style={{ fontSize: 14, color: `${BROWN}50`, fontWeight: 700 }}>
            Level {level} completed
          </div>
          <button onClick={nextLevel} style={{
            padding: '16px 48px', borderRadius: 18, border: 'none',
            background: BLUE, color: '#fff',
            fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
            cursor: 'pointer', boxShadow: '0 6px 0 #0D47A160',
          }}>Next Level →</button>
        </div>
      )}

      {/* GAME OVER */}
      {phase === 'gameover' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 24px', width: '100%' }}>
          <div style={{ fontSize: 56 }}>❌</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#B71C1C', textAlign: 'center' }}>
            Wrong!
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: `${BROWN}50`, fontWeight: 700, marginBottom: 4 }}>The number was</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#2E7D32', fontFamily: 'monospace', letterSpacing: 4 }}>{current}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: `${BROWN}50`, fontWeight: 700, marginBottom: 4 }}>You typed</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#B71C1C', fontFamily: 'monospace', letterSpacing: 4 }}>{input}</div>
          </div>
          <div style={{
            background: `${BLUE}15`, border: `1px solid ${BLUE}30`,
            borderRadius: 14, padding: '14px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Your best</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: BLUE }}>{fmt(level)}</div>
          </div>
          <button onClick={startGame} style={{
            padding: '14px 48px', borderRadius: 16, border: 'none',
            background: BLUE, color: '#fff',
            fontSize: 16, fontWeight: 900, fontFamily: 'inherit',
            cursor: 'pointer', boxShadow: '0 6px 0 #0D47A160',
          }}>Try again</button>
        </div>
      )}

    </main>
  )
}
