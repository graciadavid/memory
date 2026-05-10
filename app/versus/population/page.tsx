'use client'
import { useState, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import CreateGroupBanner from '@/components/CreateGroupBanner'
import { track } from '@vercel/analytics'
import { updateStreak } from '@/lib/streak'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const COLOR = '#C62828'
const FLAG_CDN = 'https://flagcdn.com/w320'

const COUNTRIES = [
  { name: 'China', code: 'cn', population: 1412000000 },
  { name: 'India', code: 'in', population: 1408000000 },
  { name: 'USA', code: 'us', population: 335000000 },
  { name: 'Indonesia', code: 'id', population: 277000000 },
  { name: 'Pakistan', code: 'pk', population: 231000000 },
  { name: 'Brazil', code: 'br', population: 215000000 },
  { name: 'Nigeria', code: 'ng', population: 218000000 },
  { name: 'Bangladesh', code: 'bd', population: 170000000 },
  { name: 'Russia', code: 'ru', population: 144000000 },
  { name: 'Ethiopia', code: 'et', population: 123000000 },
  { name: 'Mexico', code: 'mx', population: 128000000 },
  { name: 'Japan', code: 'jp', population: 125000000 },
  { name: 'Philippines', code: 'ph', population: 115000000 },
  { name: 'Egypt', code: 'eg', population: 104000000 },
  { name: 'Vietnam', code: 'vn', population: 97000000 },
  { name: 'Iran', code: 'ir', population: 87000000 },
  { name: 'Turkey', code: 'tr', population: 85000000 },
  { name: 'Germany', code: 'de', population: 84000000 },
  { name: 'Thailand', code: 'th', population: 71000000 },
  { name: 'UK', code: 'gb', population: 67000000 },
  { name: 'France', code: 'fr', population: 68000000 },
  { name: 'Tanzania', code: 'tz', population: 65000000 },
  { name: 'South Africa', code: 'za', population: 60000000 },
  { name: 'Kenya', code: 'ke', population: 54000000 },
  { name: 'South Korea', code: 'kr', population: 52000000 },
  { name: 'Colombia', code: 'co', population: 51000000 },
  { name: 'Spain', code: 'es', population: 47000000 },
  { name: 'Argentina', code: 'ar', population: 46000000 },
  { name: 'Algeria', code: 'dz', population: 45000000 },
  { name: 'Ukraine', code: 'ua', population: 43000000 },
  { name: 'Poland', code: 'pl', population: 38000000 },
  { name: 'Canada', code: 'ca', population: 38000000 },
  { name: 'Morocco', code: 'ma', population: 37000000 },
  { name: 'Saudi Arabia', code: 'sa', population: 35000000 },
  { name: 'Peru', code: 'pe', population: 33000000 },
  { name: 'Malaysia', code: 'my', population: 33000000 },
  { name: 'Venezuela', code: 've', population: 28000000 },
  { name: 'Australia', code: 'au', population: 26000000 },
  { name: 'Chile', code: 'cl', population: 19000000 },
  { name: 'Netherlands', code: 'nl', population: 17000000 },
  { name: 'Romania', code: 'ro', population: 19000000 },
  { name: 'Kazakhstan', code: 'kz', population: 19000000 },
  { name: 'Ecuador', code: 'ec', population: 18000000 },
  { name: 'Belgium', code: 'be', population: 11000000 },
  { name: 'Bolivia', code: 'bo', population: 12000000 },
  { name: 'Cuba', code: 'cu', population: 11000000 },
  { name: 'Greece', code: 'gr', population: 10000000 },
  { name: 'Portugal', code: 'pt', population: 10000000 },
  { name: 'Czech Republic', code: 'cz', population: 10000000 },
  { name: 'Sweden', code: 'se', population: 10000000 },
  { name: 'Hungary', code: 'hu', population: 10000000 },
  { name: 'Switzerland', code: 'ch', population: 8700000 },
  { name: 'Austria', code: 'at', population: 9100000 },
  { name: 'Israel', code: 'il', population: 9500000 },
  { name: 'Singapore', code: 'sg', population: 5900000 },
  { name: 'Norway', code: 'no', population: 5400000 },
  { name: 'New Zealand', code: 'nz', population: 5100000 },
  { name: 'Ireland', code: 'ie', population: 5100000 },
  { name: 'Denmark', code: 'dk', population: 5900000 },
  { name: 'Finland', code: 'fi', population: 5600000 },
  { name: 'Iceland', code: 'is', population: 376000 },
]

function fmt(n: number) {
  if (n >= 1000000000) return `${(n / 1000000000).toFixed(2)}B`
  if (n >= 100000000) return `${(n / 1000000).toFixed(0)}M`
  if (n >= 10000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`
  return `${(n / 1000).toFixed(0)}K`
}

let sharedCtx: AudioContext | null = null
function getAudioCtx() {
  if (!sharedCtx || sharedCtx.state === 'closed') sharedCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  if (sharedCtx.state === 'suspended') sharedCtx.resume()
  return sharedCtx
}
function playCorrect() {
  try {
    const ctx = getAudioCtx()
    const osc = ctx.createOscillator(); const gain = ctx.createGain()
    osc.type = 'sine'; osc.frequency.setValueAtTime(523, ctx.currentTime); osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.15, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.3)
  } catch(e) {}
}
function playWrong() {
  try {
    const ctx = getAudioCtx()
    const osc = ctx.createOscillator(); const gain = ctx.createGain()
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, ctx.currentTime); osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.15, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.4)
  } catch(e) {}
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function VersusPage() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<'idle' | 'playing' | 'result'>('idle')
  const [deck, setDeck] = useState<typeof COUNTRIES>([])
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState<typeof COUNTRIES>([])
  const [streak, setStreak] = useState(0)
  const [answered, setAnswered] = useState<boolean | null>(null)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [bestScore, setBestScore] = useState<number | null>(null)

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('higher_lower_scores')
      .select('level').eq('player_name', profile.name).eq('category', 'population')
      .order('level', { ascending: false }).limit(1)
      .then(({ data }) => { if (data?.[0]) setBestScore(data[0].level) })
  }, [profile?.name])

  const startGame = () => {
    try { getAudioCtx() } catch(e) {}
    const shuffled = shuffle(COUNTRIES)
    setDeck(shuffled)
    setRevealed([shuffled[0]])
    setCurrent(1)
    setStreak(0)
    setAnswered(null)
    setPhase('playing')
  }

  const answer = async (isHigher: boolean) => {
    if (answered !== null) return
    const prev = revealed[revealed.length - 1]
    const next = deck[current]
    const correct = isHigher ? next.population >= prev.population : next.population < prev.population
    setAnswered(correct)
    if (correct) playCorrect(); else playWrong()

    if (correct) {
      setTimeout(() => {
        setRevealed(r => [...r, next])
        setCurrent(c => c + 1)
        setStreak(s => s + 1)
        setAnswered(null)
      }, 1000)
    } else {
      setTimeout(async () => {
        const finalStreak = streak
        if (profile?.name && finalStreak > 0) {
          await supabase.from('higher_lower_scores').insert({ player_name: profile.name, level: finalStreak, category: 'population' })
        await updateStreak(profile.name)
        window.dispatchEvent(new Event('game_completed'))
          const { count } = await supabase.from('higher_lower_scores')
            .select('*', { count: 'exact', head: true })
            .eq('category', 'population').gt('level', finalStreak)
          setWorldRank((count ?? 0) + 1)
          if (bestScore === null || finalStreak > bestScore) setBestScore(finalStreak)
        }
        setPhase('result')
      }, 1200)
    }
  }

  const next = deck[current]

  return (
    <main style={{
      height: '100dvh',
      background: `radial-gradient(ellipse at 50% 0%, #FFEBEE 0%, ${CREAM} 50%)`,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px 0', gap: 12, flexShrink: 0 }}>
        <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/higuer.png" alt="" style={{ height: 52, objectFit: 'contain', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, color: COLOR, letterSpacing: -0.5 }}>Versus</div>

        </div>
        {phase === 'playing' && (
          <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: COLOR }}>{streak}</div>
            <div style={{ fontSize: 9, color: `${BROWN}40`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>streak</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', padding: '16px 16px 80px' }}>

        {phase === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ textAlign: 'center', color: `${BROWN}60`, fontSize: 15, fontWeight: 700, lineHeight: 1.6 }}>
              Is the next country's population<br />Higher or Lower than the previous?
            </div>
            {bestScore !== null && (
              <div style={{ background: `${COLOR}10`, borderRadius: 16, padding: '12px 24px', textAlign: 'center', border: `1px solid ${COLOR}20` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: COLOR, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Your best</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: BROWN }}>{bestScore} correct</div>
              </div>
            )}
            <button onClick={startGame} style={{
              width: '100%', padding: '20px', borderRadius: 20, border: 'none',
              background: COLOR, color: '#fff', fontSize: 20, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 8px 0 ${COLOR}60`,
            }}>Start</button>
          </div>
        )}

        {phase === 'playing' && next && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Last revealed */}
            {revealed.slice(-2).map((c, i, arr) => (
              <div key={c.code} style={{
                background: '#fff', borderRadius: 16, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: `0 2px 8px ${BROWN}08`,
                border: `1px solid ${i === arr.length - 1 ? COLOR + '50' : BROWN + '08'}`,
                opacity: i < arr.length - 1 ? 0.45 : 1,
              }}>
                <img src={`${FLAG_CDN}/${c.code}.png`} alt="" style={{ width: 56, height: 38, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                <div style={{ flex: 1, fontWeight: 900, color: BROWN, fontSize: 17 }}>{c.name}</div>
                <div style={{ fontWeight: 900, color: COLOR, fontSize: 16 }}>{fmt(c.population)}</div>
              </div>
            ))}

            {/* Topic label */}
            <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 900, color: BROWN, letterSpacing: -0.5 }}>Population</div>

            {/* Next — hidden */}
            <div style={{
              background: answered === false ? '#FFEBEE' : answered === true ? '#E8F5E9' : `${COLOR}08`,
              borderRadius: 16, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              border: `2px solid ${answered === false ? '#B71C1C50' : answered === true ? '#2E7D3250' : COLOR + '40'}`,
            }}>
              <img src={`${FLAG_CDN}/${next.code}.png`} alt="" style={{ width: 56, height: 38, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
              <div style={{ flex: 1, fontWeight: 900, color: BROWN, fontSize: 17 }}>{next.name}</div>
              <div style={{ fontWeight: 900, fontSize: 16, color: answered !== null ? (answered ? '#2E7D32' : '#B71C1C') : `${BROWN}20` }}>
                {answered !== null ? fmt(next.population) : '???'}
              </div>
            </div>

            {/* Buttons */}
            {answered === null ? (
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => answer(true)} style={{
                  flex: 1, padding: '18px', borderRadius: 16, border: 'none',
                  background: '#2E7D32', color: '#fff', fontSize: 18, fontWeight: 900,
                  fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #1B5E2060',
                }}>↑ Higher</button>
                <button onClick={() => answer(false)} style={{
                  flex: 1, padding: '18px', borderRadius: 16, border: 'none',
                  background: COLOR, color: '#fff', fontSize: 18, fontWeight: 900,
                  fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${COLOR}60`,
                }}>↓ Lower</button>
              </div>
            ) : (
              <div style={{ fontSize: 20, fontWeight: 900, color: answered ? '#2E7D32' : '#B71C1C', textAlign: 'center', padding: '8px' }}>
                {answered ? '✓ Correct!' : '✗ Wrong!'}
              </div>
            )}
          </div>
        )}

        {phase === 'result' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: '100%', background: '#fff', borderRadius: 24, padding: '24px', boxShadow: `0 8px 32px ${BROWN}15`, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Your score</div>
              <div style={{ fontSize: 80, fontWeight: 900, color: BROWN, letterSpacing: -3 }}>{streak}</div>
              <div style={{ fontSize: 14, color: `${BROWN}50`, marginBottom: 12 }}>correct in a row</div>
              {worldRank && (
                <div style={{ fontSize: 14, color: `${BROWN}60`, fontWeight: 700 }}>
                  World Ranking: <span style={{ color: GOLD, fontWeight: 900 }}>#{worldRank}</span>
                </div>
              )}
            </div>
            <button onClick={() => {
              const url = `${window.location.origin}/challenge?game=versus-population&score=${streak}&by=${encodeURIComponent(profile?.name || 'Someone')}`
              const text = `⚔️ ${profile?.name} got ${streak} correct in Versus on MemGenius! Can you beat them? ${url}`
              track('challenge_shared'); window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
            }} style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: '#25D366', color: '#fff', fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #128C7E60',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}><span style={{ fontSize: 20 }}>📲</span> Send to WhatsApp</button>
            <button onClick={startGame} style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: COLOR, color: '#fff', fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${COLOR}60`,
            }>Play again</button>

            <CreateGroupBanner playerName={profile?.name || ''} />
          </div>
        )}
      </div>
    </main>
  )
}
