'use client'
import { useState, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const COLOR = '#C62828'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const FLAG_CDN = 'https://flagcdn.com/w320'

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
  { name: 'DR Congo', code: 'cd', population: 100000000 },
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
  { name: 'Myanmar', code: 'mm', population: 54000000 },
  { name: 'Kenya', code: 'ke', population: 54000000 },
  { name: 'South Korea', code: 'kr', population: 52000000 },
  { name: 'Colombia', code: 'co', population: 51000000 },
  { name: 'Spain', code: 'es', population: 47000000 },
  { name: 'Uganda', code: 'ug', population: 47000000 },
  { name: 'Argentina', code: 'ar', population: 46000000 },
  { name: 'Algeria', code: 'dz', population: 45000000 },
  { name: 'Sudan', code: 'sd', population: 45000000 },
  { name: 'Iraq', code: 'iq', population: 41000000 },
  { name: 'Ukraine', code: 'ua', population: 43000000 },
  { name: 'Poland', code: 'pl', population: 38000000 },
  { name: 'Canada', code: 'ca', population: 38000000 },
  { name: 'Morocco', code: 'ma', population: 37000000 },
  { name: 'Saudi Arabia', code: 'sa', population: 35000000 },
  { name: 'Peru', code: 'pe', population: 33000000 },
  { name: 'Venezuela', code: 've', population: 28000000 },
  { name: 'Malaysia', code: 'my', population: 33000000 },
  { name: 'Ghana', code: 'gh', population: 32000000 },
  { name: 'Nepal', code: 'np', population: 30000000 },
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
  { name: 'Switzerland', code: 'ch', population: 8000000 },
  { name: 'Austria', code: 'at', population: 9000000 },
  { name: 'Israel', code: 'il', population: 9000000 },
  { name: 'Singapore', code: 'sg', population: 5000000 },
  { name: 'Norway', code: 'no', population: 5000000 },
  { name: 'New Zealand', code: 'nz', population: 5000000 },
  { name: 'Ireland', code: 'ie', population: 5000000 },
  { name: 'Denmark', code: 'dk', population: 5000000 },
  { name: 'Finland', code: 'fi', population: 5000000 },
  { name: 'Iceland', code: 'is', population: 376000 },
]

function fmt(n: number) {
  if (n >= 1000000000) {
    const v = n / 1000000000
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(2)}B`
  }
  if (n >= 1000000) {
    const v = n / 1000000
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`
  }
  return `${Math.round(n / 1000)}K`
}

function getPair(used: Set<number>) {
  const available = COUNTRIES.map((_, i) => i).filter(i => !used.has(i))
  if (available.length < 2) return null
  const shuffle = [...available].sort(() => Math.random() - 0.5)
  return { a: COUNTRIES[shuffle[0]], b: COUNTRIES[shuffle[1]], ai: shuffle[0], bi: shuffle[1] }
}

export default function VersusPage() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<'idle' | 'playing' | 'result'>('idle')
  const [streak, setStreak] = useState(0)
  const [pair, setPair] = useState<{ a: any, b: any, ai: number, bi: number } | null>(null)
  const [used, setUsed] = useState<Set<number>>(new Set())
  const [selected, setSelected] = useState<'a' | 'b' | null>(null)
  const [correct, setCorrect] = useState<boolean | null>(null)
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
    const newUsed = new Set<number>()
    const p = getPair(newUsed)
    if (!p) return
    setPair(p)
    setUsed(newUsed)
    setStreak(0)
    setSelected(null)
    setCorrect(null)
    setPhase('playing')
  }

  const answer = async (choice: 'a' | 'b') => {
    if (!pair || selected) return
    setSelected(choice)
    const isCorrect = choice === 'a'
      ? pair.a.population >= pair.b.population
      : pair.b.population >= pair.a.population
    setCorrect(isCorrect)
    if (isCorrect) playCorrect(); else playWrong()

    if (!isCorrect) {
      setTimeout(async () => {
        if (profile?.name && streak > 0) {
          await supabase.from('higher_lower_scores').insert({ player_name: profile.name, level: streak, category: 'population' })
          const { count } = await supabase.from('higher_lower_scores')
            .select('*', { count: 'exact', head: true })
            .eq('category', 'population').gt('level', streak)
          setWorldRank((count ?? 0) + 1)
          if (bestScore === null || streak > bestScore) setBestScore(streak)
        }
        setPhase('result')
      }, 1500)
    } else {
      setTimeout(() => {
        const newUsed = new Set(used)
        newUsed.add(pair.ai)
        newUsed.add(pair.bi)
        const next = getPair(newUsed)
        if (!next) { setPhase('result'); return }
        setUsed(newUsed)
        setPair(next)
        setStreak(s => s + 1)
        setSelected(null)
        setCorrect(null)
      }, 1000)
    }
  }

  return (
    <main style={{
      height: '100dvh',
      background: `radial-gradient(ellipse at 50% 0%, #FFEBEE 0%, ${CREAM} 50%)`,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', gap: 12 }}>
        <div style={{ fontSize: 48, flexShrink: 0 }}>⚔️</div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 900, color: COLOR, letterSpacing: -0.5 }}>Versus</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Which country has more people?</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', gap: 16 }}>

        {phase === 'idle' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Population</div>
              <div style={{ fontSize: 18, color: `${BROWN}70`, fontWeight: 700, lineHeight: 1.6 }}>Which country has a higher population?</div>
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
          </>
        )}

        {phase === 'playing' && pair && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase' }}>Streak</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: COLOR, lineHeight: 1 }}>{streak}</div>
            </div>

            <button onClick={() => answer('a')} disabled={!!selected} style={{
              width: '100%', borderRadius: 20,
              border: `3px solid ${selected === 'a' ? (correct ? '#2E7D32' : '#B71C1C') : selected ? `${BROWN}15` : COLOR}`,
              background: selected === 'a' ? (correct ? '#E8F5E9' : '#FFEBEE') : '#fff',
              padding: '16px', cursor: selected ? 'default' : 'pointer',
              boxShadow: `0 4px 16px ${BROWN}10`, transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={`${FLAG_CDN}/${pair.a.code}.png`} alt="" style={{ width: 64, height: 43, objectFit: 'cover', borderRadius: 6 }} />
                <div style={{ textAlign: 'left', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: BROWN }}>{pair.a.name}</div>
                  {selected && <div style={{ fontSize: 14, fontWeight: 800, color: COLOR }}>{fmt(pair.a.population)}</div>}
                </div>
              </div>
            </button>

            <div style={{ fontSize: 16, fontWeight: 900, color: COLOR }}>VS</div>

            <button onClick={() => answer('b')} disabled={!!selected} style={{
              width: '100%', borderRadius: 20,
              border: `3px solid ${selected === 'b' ? (correct ? '#2E7D32' : '#B71C1C') : selected ? `${BROWN}15` : COLOR}`,
              background: selected === 'b' ? (correct ? '#E8F5E9' : '#FFEBEE') : '#fff',
              padding: '16px', cursor: selected ? 'default' : 'pointer',
              boxShadow: `0 4px 16px ${BROWN}10`, transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={`${FLAG_CDN}/${pair.b.code}.png`} alt="" style={{ width: 64, height: 43, objectFit: 'cover', borderRadius: 6 }} />
                <div style={{ textAlign: 'left', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: BROWN }}>{pair.b.name}</div>
                  {selected && <div style={{ fontSize: 14, fontWeight: 800, color: COLOR }}>{fmt(pair.b.population)}</div>}
                </div>
              </div>
            </button>

            {selected && (
              <div style={{ fontSize: 16, fontWeight: 900, color: correct ? '#2E7D32' : '#B71C1C', textAlign: 'center' }}>
                {correct ? '✓ Correct!' : '✗ Wrong!'}
              </div>
            )}
          </>
        )}

        {phase === 'result' && (
          <>
            <div style={{ width: '100%', background: '#fff', borderRadius: 24, padding: '24px', boxShadow: `0 8px 32px ${BROWN}15`, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Your score</div>
              <div style={{ fontSize: 80, fontWeight: 900, color: BROWN, letterSpacing: -3 }}>{streak}</div>
              <div style={{ fontSize: 14, color: `${BROWN}50`, marginBottom: 16 }}>correct in a row</div>
              {worldRank && (
                <div style={{ fontSize: 14, color: `${BROWN}60`, fontWeight: 700 }}>
                  World Ranking: <span style={{ color: GOLD, fontWeight: 900 }}>#{worldRank}</span>
                </div>
              )}
            </div>

            <button onClick={() => {
              const url = `${window.location.origin}/challenge?game=versus&score=${streak}&by=${encodeURIComponent(profile?.name || 'Someone')}`
              const text = `🌍 ${profile?.name} got ${streak} correct in Higher or Lower on MemGenius! Can you beat them? ${url}`
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
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
            }}>Play again</button>
          </>
        )}
      </div>
    </main>
  )
}
