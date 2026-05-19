'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import CreateGroupBanner from '@/components/CreateGroupBanner'
import { track } from '@vercel/analytics'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const PURPLE = '#6A1B9A'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const TROPHY = `${BASE}/nav-trophy.webp`
const LOGO = `${BASE}/nback.png`

const COLORS = [
  { name: 'Red', bg: '#E53935', shadow: '#B71C1C' },
  { name: 'Blue', bg: '#1E88E5', shadow: '#1565C0' },
  { name: 'Green', bg: '#43A047', shadow: '#2E7D32' },
  { name: 'Yellow', bg: '#FDD835', shadow: '#F9A825' },
  { name: 'Orange', bg: '#FB8C00', shadow: '#E65100' },
  { name: 'Purple', bg: '#8E24AA', shadow: '#6A1B9A' },
]

type Phase = 'intro' | 'first' | 'show' | 'answer' | 'feedback' | 'gameover'

function playSound(freq: number, duration: number, correct: boolean) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + duration)
  } catch(e) {}
}

export default function NBackClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('intro')
  const [level, setLevel] = useState(0)
  const [current, setCurrent] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const [showCard, setShowCard] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [topScores, setTopScores] = useState<{ name: string, level: number }[]>([])
  const [bestLevel, setBestLevel] = useState<number | null>(null)
  const levelRef = useRef(0)
  const previousRef = useRef<number | null>(null)
  const currentRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { fetchTop() }, [])

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('nback_scores').select('level').eq('player_name', profile.name)
      .order('level', { ascending: false }).limit(1)
      .then(({ data }) => { if (data?.[0]) setBestLevel(data[0].level) })
  }, [profile?.name])

  const fetchTop = async () => {
    const { data } = await supabase.from('nback_scores').select('player_name, level')
      .order('level', { ascending: false }).limit(200)
    if (data) {
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
      setTopScores(Object.entries(best).map(([name, level]) => ({ name, level })).sort((a, b) => b.level - a.level))
    }
  }

  const showNextCard = useCallback((prev: number | null) => {
    const next = Math.floor(Math.random() * COLORS.length)
    currentRef.current = next
    previousRef.current = prev
    setCurrent(next)
    setPrevious(prev)
    setShowCard(true)
    setFeedback(null)

    timerRef.current = setTimeout(() => {
      setShowCard(false)
      setPhase('answer')
    }, 2000)
  }, [])

  const startGame = useCallback(() => {
    levelRef.current = 0
    setLevel(0)
    setFeedback(null)
    setWorldRank(null)

    // Show first card - no answer needed
    const first = Math.floor(Math.random() * COLORS.length)
    currentRef.current = first
    previousRef.current = null
    setCurrent(first)
    setShowCard(true)
    setPhase('first')

    timerRef.current = setTimeout(() => {
      setShowCard(false)
      // Show second card
      setTimeout(() => {
        const second = Math.floor(Math.random() * COLORS.length)
        previousRef.current = first
        currentRef.current = second
        setCurrent(second)
        setPrevious(first)
        setShowCard(true)
        setPhase('show')
        timerRef.current = setTimeout(() => {
          setShowCard(false)
          setPhase('answer')
        }, 2000)
      }, 500)
    }, 2000)
  }, [])

  const handleAnswer = useCallback(async (same: boolean) => {
    if (phase !== 'answer') return
    if (timerRef.current) clearTimeout(timerRef.current)

    const isSame = currentRef.current === previousRef.current
    const correct = same === isSame

    if (correct) {
      playSound(660, 0.15, true)
      setFeedback('correct')
      const newLevel = levelRef.current + 1
      levelRef.current = newLevel
      setLevel(newLevel)

      timerRef.current = setTimeout(() => {
        setFeedback(null)
        showNextCard(currentRef.current)
        setPhase('show')
      }, 400)
    } else {
      playSound(220, 0.3, false)
      setFeedback('wrong')
      const finalLevel = levelRef.current

      timerRef.current = setTimeout(async () => {
        setPhase('gameover')
        if (profile?.name) {
          await supabase.from('nback_scores').insert({ player_name: profile.name, level: finalLevel })
                window.dispatchEvent(new Event('game_completed'))
          const { data } = await supabase.from('nback_scores').select('player_name, level')
            .order('level', { ascending: false }).limit(200)
          if (data) {
            const best: Record<string, number> = {}
            data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
            const myBest = best[profile.name] || finalLevel
            setWorldRank(Object.values(best).filter(l => l > myBest).length + 1)
            if (!bestLevel || finalLevel > bestLevel) setBestLevel(finalLevel)
            fetchTop()
          }
        }
      }, 600)
    }
  }, [phase, profile?.name, bestLevel, showNextCard])

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const currentColor = COLORS[current]

  return (
    <main style={{ minHeight: '100dvh', background: `linear-gradient(180deg, #EDE7F6 0%, ${CREAM} 100%)`, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 80 }}>
      <style>{`@keyframes floatLogo { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} } @keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} } @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', gap: 12 }}>
        <img src={LOGO} alt="N-Back" style={{ height: 52, objectFit: 'contain', animation: 'floatLogo 3s ease-in-out infinite', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 26, fontWeight: 900, color: PURPLE, letterSpacing: -0.5 }}>N-Back</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Is it the same color as before?</div>
        </div>
        {(phase === 'first' || phase === 'show' || phase === 'answer' || phase === 'feedback') && (
          <div style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 900, color: PURPLE }}>{level}</div>
        )}
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 8 }}>Is it the same color as before?</div>
            <div style={{ fontSize: 13, color: `${BROWN}60`, lineHeight: 1.7 }}>
              A color appears for 2 seconds.<br />
              Then disappears.<br />
              Was it the same as the previous one?<br />
              Each correct answer adds to your streak.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {COLORS.map((c, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: 8, background: c.bg, boxShadow: `0 4px 0 ${c.shadow}` }} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid #4A2C0A10' }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Your best</div>
              {bestLevel !== null ? (
                <div style={{ fontSize: 32, fontWeight: 900, color: PURPLE }}>{bestLevel}</div>
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

          <button onClick={startGame} style={{
            width: '100%', padding: '18px', borderRadius: 20, border: 'none',
            background: PURPLE, color: '#fff', fontSize: 18, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #4A148C60',
          }}>Play</button>

          <Link href="/nback/ranking" style={{ textDecoration: 'none', width: '100%' }}>
            <div style={{ width: '100%', padding: '14px', borderRadius: 16, background: '#fff', border: `1.5px solid ${BROWN}20`, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxSizing: 'border-box' }}>
              <img src={TROPHY} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
              <span style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>World Ranking</span>
            </div>
          </Link>
        </div>
      )}

      {/* FIRST CARD - no answer */}
      {phase === 'first' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70dvh', gap: 24, padding: '24px' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 1 }}>Remember this color</div>
          {showCard && (
            <div style={{ width: 260, height: 260, borderRadius: 32, background: currentColor.bg, boxShadow: `0 12px 0 ${currentColor.shadow}`, animation: 'fadeIn 0.2s ease' }} />
          )}
        </div>
      )}

      {/* SHOW + ANSWER */}
      {(phase === 'show' || phase === 'answer') && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70dvh', gap: 24, padding: '24px' }}>

          {showCard ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 1 }}>Same as before?</div>
              <div style={{ width: 260, height: 260, borderRadius: 32, background: currentColor.bg, boxShadow: `0 12px 0 ${currentColor.shadow}`, animation: 'fadeIn 0.2s ease' }} />
            </>
          ) : (
            <>
              {feedback && (
                <div style={{ fontSize: 32, fontWeight: 900, color: feedback === 'correct' ? '#2E7D32' : '#C62828', animation: 'popIn 0.3s ease' }}>
                  {feedback === 'correct' ? '✓' : '✗'}
                </div>
              )}
              {phase === 'answer' && !feedback && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', animation: 'fadeIn 0.2s ease' }}>
                  <button onClick={() => handleAnswer(true)} style={{
                    width: '100%', padding: '28px', borderRadius: 20, border: 'none',
                    background: '#43A047', color: '#fff', fontSize: 22, fontWeight: 900,
                    fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #2E7D3260',
                  }}>Same color</button>
                  <button onClick={() => handleAnswer(false)} style={{
                    width: '100%', padding: '28px', borderRadius: 20, border: 'none',
                    background: '#E53935', color: '#fff', fontSize: 22, fontWeight: 900,
                    fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 0 #B71C1C60',
                  }}>Different color</button>
                </div>
              )}
            </>
          )}
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
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: `${BROWN}50`, textTransform: 'uppercase', marginBottom: 6 }}>Your Result</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: PURPLE, lineHeight: 1 }}>{level}</div>
            <div style={{ fontSize: 13, color: `${BROWN}50`, fontWeight: 700, marginBottom: 16 }}>correct in a row</div>
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
              const url = `${window.location.origin}/challenge?game=nback&score=${level}&by=${encodeURIComponent(profile?.name || 'Someone')}`
              const text = `🧠 ${profile?.name} got ${level} correct in N-Back on MemGenius! Can you beat them? ${url}`
              track('challenge_shared')
              if (navigator.share) { navigator.share({ title: 'MemGenius', text, url }) } else { window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank') }
            }} style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: '#25D366', color: '#fff', fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #128C7E60',
            }}>Share</button>
            <button onClick={startGame} style={{
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
