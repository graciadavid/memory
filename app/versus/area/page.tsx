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
  { name: 'Russia', code: 'ru', area: 17098242 },
  { name: 'Canada', code: 'ca', area: 9984670 },
  { name: 'USA', code: 'us', area: 9833517 },
  { name: 'China', code: 'cn', area: 9596960 },
  { name: 'Brazil', code: 'br', area: 8515767 },
  { name: 'Australia', code: 'au', area: 7692024 },
  { name: 'India', code: 'in', area: 3287263 },
  { name: 'Argentina', code: 'ar', area: 2780400 },
  { name: 'Kazakhstan', code: 'kz', area: 2724900 },
  { name: 'Algeria', code: 'dz', area: 2381741 },
  { name: 'DR Congo', code: 'cd', area: 2344858 },
  { name: 'Saudi Arabia', code: 'sa', area: 2149690 },
  { name: 'Mexico', code: 'mx', area: 1964375 },
  { name: 'Indonesia', code: 'id', area: 1904569 },
  { name: 'Sudan', code: 'sd', area: 1861484 },
  { name: 'Libya', code: 'ly', area: 1759540 },
  { name: 'Iran', code: 'ir', area: 1648195 },
  { name: 'Mongolia', code: 'mn', area: 1564116 },
  { name: 'Peru', code: 'pe', area: 1285216 },
  { name: 'Chad', code: 'td', area: 1284000 },
  { name: 'Niger', code: 'ne', area: 1267000 },
  { name: 'Angola', code: 'ao', area: 1246700 },
  { name: 'Mali', code: 'ml', area: 1240192 },
  { name: 'South Africa', code: 'za', area: 1219090 },
  { name: 'Colombia', code: 'co', area: 1141748 },
  { name: 'Ethiopia', code: 'et', area: 1104300 },
  { name: 'Bolivia', code: 'bo', area: 1098581 },
  { name: 'Mauritania', code: 'mr', area: 1030700 },
  { name: 'Egypt', code: 'eg', area: 1002450 },
  { name: 'Tanzania', code: 'tz', area: 945087 },
  { name: 'Nigeria', code: 'ng', area: 923768 },
  { name: 'Venezuela', code: 've', area: 916445 },
  { name: 'Pakistan', code: 'pk', area: 881913 },
  { name: 'Mozambique', code: 'mz', area: 801590 },
  { name: 'Turkey', code: 'tr', area: 783562 },
  { name: 'Chile', code: 'cl', area: 756102 },
  { name: 'Zambia', code: 'zm', area: 752618 },
  { name: 'Myanmar', code: 'mm', area: 676578 },
  { name: 'Afghanistan', code: 'af', area: 652230 },
  { name: 'Somalia', code: 'so', area: 637657 },
  { name: 'Ukraine', code: 'ua', area: 603550 },
  { name: 'Madagascar', code: 'mg', area: 587041 },
  { name: 'Kenya', code: 'ke', area: 580367 },
  { name: 'France', code: 'fr', area: 551695 },
  { name: 'Spain', code: 'es', area: 505990 },
  { name: 'Sweden', code: 'se', area: 450295 },
  { name: 'Morocco', code: 'ma', area: 446550 },
  { name: 'Cameroon', code: 'cm', area: 475442 },
  { name: 'Germany', code: 'de', area: 357114 },
  { name: 'Japan', code: 'jp', area: 377975 },
  { name: 'Norway', code: 'no', area: 323802 },
  { name: 'Finland', code: 'fi', area: 338145 },
  { name: 'Poland', code: 'pl', area: 312696 },
  { name: 'Italy', code: 'it', area: 301340 },
  { name: 'Philippines', code: 'ph', area: 300000 },
  { name: 'Ecuador', code: 'ec', area: 283561 },
  { name: 'UK', code: 'gb', area: 242495 },
  { name: 'Romania', code: 'ro', area: 238397 },
  { name: 'Ghana', code: 'gh', area: 238533 },
  { name: 'New Zealand', code: 'nz', area: 270467 },
  { name: 'Vietnam', code: 'vn', area: 331212 },
  { name: 'Malaysia', code: 'my', area: 329847 },
  { name: 'Greece', code: 'gr', area: 131957 },
  { name: 'South Korea', code: 'kr', area: 100210 },
  { name: 'Portugal', code: 'pt', area: 92212 },
  { name: 'Hungary', code: 'hu', area: 93028 },
  { name: 'Austria', code: 'at', area: 83871 },
  { name: 'Switzerland', code: 'ch', area: 41285 },
  { name: 'Netherlands', code: 'nl', area: 41543 },
  { name: 'Denmark', code: 'dk', area: 42924 },
  { name: 'Ireland', code: 'ie', area: 70273 },
  { name: 'Belgium', code: 'be', area: 30528 },
  { name: 'Israel', code: 'il', area: 20770 },
  { name: 'Iceland', code: 'is', area: 103000 },
  { name: 'Cuba', code: 'cu', area: 109884 },
  { name: 'Bangladesh', code: 'bd', area: 147570 },
  { name: 'Singapore', code: 'sg', area: 728 },
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
      .select('level').eq('player_name', profile.name).eq('category', 'area')
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
    const correct = isHigher ? next.area >= prev.area : next.area < prev.area
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
          await supabase.from('higher_lower_scores').insert({ player_name: profile.name, level: finalStreak, category: 'area' })
        await updateStreak(profile.name)
        window.dispatchEvent(new Event('game_completed'))
          const { count } = await supabase.from('higher_lower_scores')
            .select('*', { count: 'exact', head: true })
            .eq('category', 'area').gt('level', finalStreak)
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
              Is the next country's area<br />Higher or Lower than the previous?
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
                <div style={{ fontWeight: 900, color: COLOR, fontSize: 16 }}>{fmt(c.area)}</div>
              </div>
            ))}

            {/* Topic label */}
            <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 900, color: BROWN, letterSpacing: -0.5 }}>Area km²</div>

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
                {answered !== null ? fmt(next.area) : '???'}
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
              const url = `${window.location.origin}/challenge?game=versus-area&score=${streak}&by=${encodeURIComponent(profile?.name || 'Someone')}`
              const text = `⚔️ ${profile?.name} got ${streak} correct in Versus Area km² on MemGenius! Can you beat them? ${url}`
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
