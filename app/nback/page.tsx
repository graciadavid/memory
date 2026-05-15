'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import CreateGroupBanner from '@/components/CreateGroupBanner'
import { track } from '@vercel/analytics'
import { updateStreak } from '@/lib/streak'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const TROPHY = `${BASE}/nav-trophy.webp`

const COLORS = [
  { name: 'Red', bg: '#E53935', shadow: '#B71C1C' },
  { name: 'Blue', bg: '#1E88E5', shadow: '#1565C0' },
  { name: 'Green', bg: '#43A047', shadow: '#2E7D32' },
  { name: 'Yellow', bg: '#FDD835', shadow: '#F9A825' },
  { name: 'Orange', bg: '#FB8C00', shadow: '#E65100' },
  { name: 'Purple', bg: '#8E24AA', shadow: '#6A1B9A' },
]

type Phase = 'intro' | 'show' | 'answer' | 'feedback' | 'gameover'

let sharedCtx: AudioContext | null = null
function getAudioCtx() {
  if (!sharedCtx || sharedCtx.state === 'closed') sharedCtx = new AudioContext()
  if (sharedCtx.state === 'suspended') sharedCtx.resume()
  return sharedCtx
}
function playTone(freq: number, duration: number, type: OscillatorType, vol: number) {
  try {
    const ctx = getAudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + duration)
  } catch(e) {}
}
function playCorrect() { playTone(660, 0.15, 'sine', 0.2) }
function playWrong() { playTone(220, 0.3, 'sawtooth', 0.15) }

export default function NBackPage() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('intro')
  const [level, setLevel] = useState(0)
  const [current, setCurrent] = useState<number>(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [topScores, setTopScores] = useState<{ name: string, level: number }[]>([])
  const [bestLevel, setBestLevel] = useState<number | null>(null)
  const [showCard, setShowCard] = useState(false)
  const [isFirstCard, setIsFirstCard] = useState(true)
  const levelRef = useRef(0)
  const previousRef = useRef<number | null>(null)
  const phaseRef = useRef<Phase>('intro')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { fetchTop() }, [])

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('nback_scores').select('level').eq('player_name', profile.name).order('level', { ascending: false }).limit(1)
      .then(({ data }) => { if (data?.[0]) setBestLevel(data[0].level) })
  }, [profile?.name])

  const fetchTop = async () => {
    const { data } = await supabase.from('nback_scores').select('player_name, level').order('level', { ascending: false }).limit(200)
    if (data) {
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
      setTopScores(Object.entries(best).map(([name, level]) => ({ name, level })).sort((a, b) => b.level - a.level))
    }
  }

  const showDuration = useCallback((lvl: number) => Math.max(600, 1500 - lvl * 40), [])

  const nextCard = useCallback((lvl: number, prev: number | null) => {
    const next = Math.floor(Math.random() * COLORS.length)
    setCurrent(next)
    setPrevious(prev)
    previousRef.current = prev
    phaseRef.current = 'show'
    setPhase('show')
    setShowCard(true)
    setFeedback(null)

    timerRef.current = setTimeout(() => {
      setShowCard(false)
      phaseRef.current = 'answer'
      setPhase('answer')
    }, showDuration(lvl))

    return next
  }, [showDuration])

  const startGame = useCallback(() => {
    try { getAudioCtx() } catch(e) {}
    if (timerRef.current) clearTimeout(timerRef.current)
    levelRef.current = 0
    phaseRef.current = 'intro'
    setLevel(0)
    setFeedback(null)
    setWorldRank(null)

    // First card — just show, no answer needed
    const first = Math.floor(Math.random() * COLORS.length)
    setCurrent(first)
    setPrevious(null)
    previousRef.current = null
    setShowCard(true)
    phaseRef.current = 'show'
    setPhase('show')

    timerRef.current = setTimeout(() => {
      setShowCard(false)
      setIsFirstCard(false)
      // Show second card immediately
      const second = Math.floor(Math.random() * COLORS.length)
      setCurrent(second)
      previousRef.current = first
      setPrevious(first)
      setShowCard(true)
      phaseRef.current = 'show'
      setPhase('show')
      timerRef.current = setTimeout(() => {
        setShowCard(false)
        phaseRef.current = 'answer'
        setPhase('answer')
      }, showDuration(0))
    }, showDuration(0))

    return first
  }, [showDuration])

  const handleStart = () => {
    setIsFirstCard(true)
    startGame()
  }

  const handleAnswer = useCallback(async (same: boolean) => {
    if (phaseRef.current !== 'answer') return
    if (timerRef.current) clearTimeout(timerRef.current)
    phaseRef.current = 'feedback'

    const isSame = current === previousRef.current
    const correct = same === isSame

    if (correct) {
      playCorrect()
      setFeedback('correct')
      const newLevel = levelRef.current + 1
      levelRef.current = newLevel
      setLevel(newLevel)

      timerRef.current = setTimeout(() => {
        const next = nextCard(newLevel, current)
      }, 500)
    } else {
      playWrong()
      setFeedback('wrong')
      const finalLevel = levelRef.current

      timerRef.current = setTimeout(async () => {
        phaseRef.current = 'gameover'
        setPhase('gameover')

        if (profile?.name) {
          await supabase.from('nback_scores').insert({ player_name: profile.name, level: finalLevel })
          await updateStreak(profile.name)
          window.dispatchEvent(new Event('game_completed'))
          const { data } = await supabase.from('nback_scores').select('player_name, level').order('level', { ascending: false }).limit(200)
          if (data) {
            const best: Record<string, number> = {}
            data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
            const myBest = best[profile.name] || finalLevel
            setWorldRank(Object.values(best).filter(l => l > myBest).length + 1)
            if (!bestLevel || finalLevel > bestLevel) setBestLevel(finalLevel)
          }
          fetchTop()
        }
      }, 600)
    }
  }, [current, profile?.name, bestLevel, nextCard])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const currentColor = COLORS[current]

  return (
    <>
      <style>{`
        @keyframes floatLogo { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <main style={{
        height: '100dvh', background: `linear-gradient(180deg, #EDE7F6 0%, ${CREAM} 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', width: '100%', gap: 12 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#6A1B9A', letterSpacing: -0.5, lineHeight: 1 }}>N-Back</div>
            <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Is this the same color as before?</div>
          </div>
          {(phase === 'show' || phase === 'answer' || phase === 'feedback') && (
            <div style={{ marginLeft: 'auto', fontSize: 28, fontWeight: 900, color: '#6A1B9A' }}>{level}</div>
          )}
          <Link href="/" style={{ textDecoration: 'none', marginLeft: phase === 'intro' ? 'auto' : 0 }}>
            <div style={{ background: '#fff', border: `1px solid ${BROWN}15`, borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 800, color: `${BROWN}60` }}>← Home</div>
          </Link>
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 16, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 8 }}>Is the color the same as the one before?</div>
              <div style={{ fontSize: 13, color: `${BROWN}60`, lineHeight: 1.7 }}>
                A color card appears and disappears.<br />
                You must remember the <strong>previous</strong> color<br />
                and decide if the new one is the same.<br /><br />
                Sounds easy. It isn't.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {COLORS.map((c, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: 8, background: c.bg, boxShadow: `0 4px 0 ${c.shadow}` }} />
              ))}
            </div>

            {bestLevel !== null && (
              <div style={{ background: '#EDE7F6', borderRadius: 14, padding: '10px 20px', display: 'flex', gap: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, textTransform: 'uppercase' }}>Your best</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#6A1B9A' }}>{bestLevel}</div>
                </div>
                {topScores[0] && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, textTransform: 'uppercase' }}>World record</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: GOLD }}>{topScores[0].level}</div>
                  </div>
                )}
              </div>
            )}

            <button onClick={handleStart} style={{
              padding: '18px', borderRadius: 20, border: 'none',
              background: '#6A1B9A', color: '#fff',
              fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: '0 8px 0 #4A148C60', width: '100%',
            }}>Play</button>

            <Link href="/nback/ranking" style={{ textDecoration: 'none', width: '100%' }}>
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
          </div>
        )}

        {/* PLAYING */}
        {(phase === 'show' || phase === 'answer' || phase === 'feedback') && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, width: '100%', padding: '0 24px' }}>

            {/* Card */}
            <div style={{
              width: 240, height: 240, borderRadius: 32,
              background: showCard ? currentColor.bg : '#E0E0E0',
              boxShadow: showCard ? `0 12px 0 ${currentColor.shadow}` : '0 6px 0 #BDBDBD',
              transition: 'background 0.2s, box-shadow 0.2s',
              animation: showCard ? 'fadeIn 0.2s ease' : undefined,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {!showCard && (
                <div style={{ fontSize: 13, fontWeight: 800, color: `${BROWN}30`, textAlign: 'center' }}>
                  Same or<br />Different?
                </div>
              )}
            </div>

            {/* Feedback */}
            {feedback && (
              <div style={{
                fontSize: 20, fontWeight: 900,
                color: feedback === 'correct' ? '#2E7D32' : '#C62828',
                animation: 'fadeIn 0.2s ease',
              }}>
                {feedback === 'correct' ? '✓ Correct' : '✗ Wrong'}
              </div>
            )}

            {/* Buttons */}
            {phase === 'answer' && (
              <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <button onClick={() => handleAnswer(false)} style={{
                  flex: 1, padding: '20px', borderRadius: 20, border: 'none',
                  background: '#E53935', color: '#fff',
                  fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
                  cursor: 'pointer', boxShadow: '0 6px 0 #B71C1C60',
                }}>Different</button>
                <button onClick={() => handleAnswer(true)} style={{
                  flex: 1, padding: '20px', borderRadius: 20, border: 'none',
                  background: '#43A047', color: '#fff',
                  fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
                  cursor: 'pointer', boxShadow: '0 6px 0 #2E7D3260',
                }}>Same</button>
              </div>
            )}

            {(phase === 'show' || phase === 'feedback') && (
              <div style={{ display: 'flex', gap: 12, width: '100%', opacity: 0.3 }}>
                <div style={{ flex: 1, padding: '20px', borderRadius: 20, background: '#E53935', textAlign: 'center', fontSize: 18, fontWeight: 900, color: '#fff' }}>Different</div>
                <div style={{ flex: 1, padding: '20px', borderRadius: 20, background: '#43A047', textAlign: 'center', fontSize: 18, fontWeight: 900, color: '#fff' }}>Same</div>
              </div>
            )}
          </div>
        )}

        {/* GAME OVER */}
        {phase === 'gameover' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 20px', width: '100%' }}>
            <div style={{
              background: CREAM, borderRadius: 24, padding: '24px 20px', width: '100%',
              boxSizing: 'border-box', boxShadow: `0 8px 32px ${BROWN}20`,
              border: `1px solid ${GOLD}30`, textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: `${BROWN}50`, textTransform: 'uppercase', marginBottom: 6 }}>Your Result</div>
              <div style={{ fontSize: 72, fontWeight: 900, color: '#6A1B9A', lineHeight: 1 }}>{level}</div>
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
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
              }} style={{
                width: '100%', padding: '16px', borderRadius: 16, border: 'none',
                background: '#25D366', color: '#fff', fontSize: 16, fontWeight: 900,
                fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #128C7E60',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}><span style={{ fontSize: 20 }}>📲</span> Send to WhatsApp</button>
              <button onClick={handleStart} style={{
                flex: 1, padding: '16px', borderRadius: 16, border: 'none',
                background: GOLD, color: '#fff', fontSize: 13, fontWeight: 800,
                fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${GOLD}50`,
              }}>Play again</button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
