'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const LOGO = `${BASE}/logomemgenius.png`
const TROPHY = `${BASE}/nav-trophy.png`
const BRAIN_GREEN = `${BASE}/brain-green.png`
const BRAIN_RED = `${BASE}/brain-red.png`

const COLORS = [
  { id: 0, color: '#F44336', light: '#FF8A80', note: 261 }, // C - Red
  { id: 1, color: '#2196F3', light: '#82B1FF', note: 329 }, // E - Blue
  { id: 2, color: '#4CAF50', light: '#B9F6CA', note: 392 }, // G - Green
  { id: 3, color: '#FFEB3B', light: '#FFFF8D', note: 523 }, // C - Yellow
]

type Phase = 'intro' | 'showing' | 'input' | 'result' | 'gameover'

function playNote(freq: number, duration = 0.3) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch(e) {}
}

function playError() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, ctx.currentTime)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  } catch(e) {}
}

function playSuccess() {
  try {
    const ctx = new AudioContext()
    ;[523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1)
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.1 + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.1)
      osc.stop(ctx.currentTime + i * 0.1 + 0.3)
    })
  } catch(e) {}
}

export default function SequencePage() {
  const { profile } = usePlayer()
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState<number[]>([])
  const [activeBtn, setActiveBtn] = useState<number | null>(null)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [topScores, setTopScores] = useState<{ name: string, level: number }[]>([])
  const level = sequence.length

  useEffect(() => { fetchTop() }, [])

  const fetchTop = async () => {
    const { data } = await supabase
      .from('sequence_scores')
      .select('player_name, level')
      .order('level', { ascending: false })
      .limit(200)
    if (data) {
      const best: Record<string, number> = {}
      data.forEach(s => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
      setTopScores(Object.entries(best).map(([name, level]) => ({ name, level })).sort((a, b) => b.level - a.level))
    }
  }

  const startGame = () => {
    const first = Math.floor(Math.random() * 4)
    setSequence([first])
    setUserInput([])
    setPhase('showing')
  }

  const flashButton = (id: number, duration = 400) => {
    return new Promise<void>(resolve => {
      setActiveBtn(id)
      playNote(COLORS[id].note, duration / 1000)
      setTimeout(() => { setActiveBtn(null); resolve() }, duration)
    })
  }

  const showSequence = async (seq: number[]) => {
    setPhase('showing')
    await new Promise(r => setTimeout(r, 600))
    for (const id of seq) {
      await flashButton(id, 500)
      await new Promise(r => setTimeout(r, 200))
    }
    setUserInput([])
    setPhase('input')
  }

  useEffect(() => {
    if (phase === 'showing' && sequence.length > 0) {
      showSequence(sequence)
    }
  }, [sequence])

  const handlePress = async (id: number) => {
    if (phase !== 'input') return
    await flashButton(id, 300)

    const newInput = [...userInput, id]
    setUserInput(newInput)

    const pos = newInput.length - 1
    if (newInput[pos] !== sequence[pos]) {
      // Wrong
      playError()
      if (profile?.name) {
        await supabase.from('sequence_scores').insert({ player_name: profile.name, level: sequence.length })
        const { data } = await supabase.from('sequence_scores').select('player_name, level').order('level', { ascending: false }).limit(200)
        if (data) {
          const best: Record<string, number> = {}
          data.forEach(s => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
          const myBest = best[profile.name] || sequence.length
          setWorldRank(Object.values(best).filter(l => l > myBest).length + 1)
        }
        fetchTop()
      }
      setPhase('gameover')
      return
    }

    if (newInput.length === sequence.length) {
      // Correct full sequence
      playSuccess()
      setPhase('result')
    }
  }

  const nextLevel = () => {
    const next = [...sequence, Math.floor(Math.random() * 4)]
    setSequence(next)
    setUserInput([])
  }

  const share = async () => {
    const text = `🎵 I reached level ${level} in MemGenius Sequence!\nCan you beat me? 👉 https://memgenius.com/sequence`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  const Grid = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', padding: '0 24px' }}>
      {COLORS.map(c => (
        <button
          key={c.id}
          onPointerDown={() => handlePress(c.id)}
          style={{
            height: 140, borderRadius: 24, border: 'none',
            background: activeBtn === c.id ? c.light : c.color,
            cursor: phase === 'input' ? 'pointer' : 'default',
            transform: activeBtn === c.id ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.1s',
            boxShadow: activeBtn === c.id
              ? `0 2px 0 ${c.color}80, inset 0 0 30px rgba(255,255,255,0.4)`
              : `0 6px 0 ${c.color}60`,
            opacity: phase === 'showing' ? (activeBtn === c.id ? 1 : 0.6) : 1,
          }}
        />
      ))}
    </div>
  )

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
        background: `linear-gradient(180deg, #FFF8EE 0%, ${CREAM} 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'var(--font-nunito), sans-serif',
        maxWidth: 430, margin: '0 auto',
        overflow: 'hidden', paddingBottom: 80,
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', width: '100%', gap: 12 }}>
          <img src={LOGO} alt="MemGenius" style={{ height: 56, objectFit: 'contain', animation: 'floatLogo 3s ease-in-out infinite', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.1))', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: BROWN, letterSpacing: -0.5, lineHeight: 1 }}>Sequence</div>
            {phase === 'intro' && <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Repeat the pattern</div>}
          </div>
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 14, width: '100%', animation: 'fadeUp 0.5s ease both' }}>
            <div style={{ textAlign: 'center', marginBottom: 4 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 6 }}>Watch the pattern</div>
              <div style={{ fontSize: 13, color: `${BROWN}60`, lineHeight: 1.6 }}>
                Buttons will light up in a sequence.<br />Repeat it in the same order.<br />Each level adds one more step.
              </div>
            </div>

            {/* Preview grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
              {COLORS.map(c => (
                <div key={c.id} style={{ height: 80, borderRadius: 20, background: c.color, boxShadow: `0 4px 0 ${c.color}60`, opacity: 0.7 }} />
              ))}
            </div>

            <button onClick={startGame} style={{
              padding: '18px', borderRadius: 20, border: 'none',
              background: BROWN, color: '#fff',
              fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: `0 8px 0 ${BROWN}60`,
              width: '100%',
            }}>Start</button>

            <Link href="/sequence/ranking" style={{ textDecoration: 'none', width: '100%' }}>
              <div style={{
                width: '100%', padding: '14px', borderRadius: 16,
                background: '#fff', border: `1.5px solid ${BROWN}20`,
                textAlign: 'center', cursor: 'pointer', boxSizing: 'border-box',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <img src={TROPHY} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>World Ranking</span>
              </div>
            </Link>

            {topScores.slice(0, 3).map((s, i) => (
              <div key={s.name} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#fff', borderRadius: 12, padding: '10px 14px',
                boxShadow: `0 2px 8px ${BROWN}08`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: i === 0 ? GOLD : `${BROWN}30`, width: 20 }}>{i + 1}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>{s.name}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 900, color: BROWN }}>Level {s.level}</div>
              </div>
            ))}
          </div>
        )}

        {/* SHOWING / INPUT */}
        {(phase === 'showing' || phase === 'input') && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase' }}>
                Level {level}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: phase === 'showing' ? GOLD : '#2E7D32', marginTop: 4 }}>
                {phase === 'showing' ? 'Watch...' : `Your turn · ${userInput.length}/${sequence.length}`}
              </div>
            </div>
            <Grid />
          </div>
        )}

        {/* RESULT — correct sequence */}
        {phase === 'result' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 24px', width: '100%' }}>
            <img src={BRAIN_GREEN} alt="" style={{ width: 90, height: 90, objectFit: 'contain' }} />
            <div style={{ fontSize: 22, fontWeight: 900, color: '#2E7D32' }}>Correct!</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: BROWN }}>Level {level}</div>
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              {sequence.map((id, i) => (
                <div key={i} style={{ flex: 1, height: 12, borderRadius: 6, background: COLORS[id].color, boxShadow: `0 2px 0 ${COLORS[id].color}60` }} />
              ))}
            </div>
            <button onClick={nextLevel} style={{
              padding: '16px', borderRadius: 18, border: 'none',
              background: BROWN, color: '#fff', fontSize: 18, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: `0 8px 0 ${BROWN}60`, width: '100%',
            }}>Next Level →</button>
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
              <img src={BRAIN_RED} alt="" style={{ width: 70, height: 70, objectFit: 'contain', marginBottom: 8 }} />
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: `${BROWN}50`, textTransform: 'uppercase', marginBottom: 6 }}>Your Result</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: BROWN, marginBottom: 8 }}>Level {level}</div>

              {/* Sequence visualization */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16, justifyContent: 'center' }}>
                {sequence.map((id, i) => (
                  <div key={i} style={{ width: 24, height: 24, borderRadius: 6, background: COLORS[id].color }} />
                ))}
              </div>

              {worldRank && (
                <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}20`, borderRadius: 12, padding: '10px', marginBottom: 4 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>World Ranking</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>#{worldRank}</div>
                </div>
              )}
            </div>

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
                fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${GOLD}50`,
              }}>Play again</button>
              <button onClick={() => router.push('/')} style={{
                flex: 1, padding: '13px', borderRadius: 14, border: 'none',
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
