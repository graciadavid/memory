'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { completeWodExercise } from '@/lib/wod'
import { completePlanDay } from '@/lib/plan'
import { track } from '@vercel/analytics'
import { usePlayer } from '@/lib/usePlayer'
import { revalidateRanking } from '@/app/actions'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const GREEN = '#2E7D32'
const RED = '#B71C1C'
const BLUE = '#1565C0'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const LOGO = `${BASE}/mapamundi.png`
const TROPHY = `${BASE}/nav-trophy.webp`

let sharedCtx: AudioContext | null = null
function getAudioCtx() {
  if (!sharedCtx || sharedCtx.state === 'closed') sharedCtx = new AudioContext()
  if (sharedCtx.state === 'suspended') sharedCtx.resume()
  return sharedCtx
}
function playTone(freq1: number, freq2: number, duration: number, type: OscillatorType, vol: number) {
  try {
    const ctx = getAudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq1, ctx.currentTime)
    osc.frequency.setValueAtTime(freq2, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + duration)
  } catch(e) {}
}
function playCorrect() { playTone(523, 659, 0.3, 'sine', 0.25) }
function playWrong() { playTone(200, 150, 0.4, 'sawtooth', 0.2) }

const COUNTRIES = [
  { code: 'FR', name: 'France' }, { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' }, { code: 'IT', name: 'Italy' },
  { code: 'PT', name: 'Portugal' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' }, { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' }, { code: 'BR', name: 'Brazil' },
  { code: 'AR', name: 'Argentina' }, { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' }, { code: 'PE', name: 'Peru' },
  { code: 'JP', name: 'Japan' }, { code: 'CN', name: 'China' },
  { code: 'KR', name: 'South Korea' }, { code: 'IN', name: 'India' },
  { code: 'AU', name: 'Australia' }, { code: 'NZ', name: 'New Zealand' },
  { code: 'ZA', name: 'South Africa' }, { code: 'EG', name: 'Egypt' },
  { code: 'NG', name: 'Nigeria' }, { code: 'KE', name: 'Kenya' },
  { code: 'MA', name: 'Morocco' }, { code: 'RU', name: 'Russia' },
  { code: 'TR', name: 'Turkey' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'TH', name: 'Thailand' }, { code: 'ID', name: 'Indonesia' },
  { code: 'PH', name: 'Philippines' }, { code: 'PK', name: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh' }, { code: 'VN', name: 'Vietnam' },
  { code: 'NL', name: 'Netherlands' }, { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' }, { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' }, { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' }, { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' }, { code: 'CZ', name: 'Czech Republic' },
  { code: 'RO', name: 'Romania' }, { code: 'HU', name: 'Hungary' },
  { code: 'GR', name: 'Greece' }, { code: 'UA', name: 'Ukraine' },
  { code: 'IL', name: 'Israel' }, { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' }, { code: 'IE', name: 'Ireland' },
  { code: 'IS', name: 'Iceland' }, { code: 'SK', name: 'Slovakia' },
  { code: 'HR', name: 'Croatia' }, { code: 'RS', name: 'Serbia' },
  { code: 'BG', name: 'Bulgaria' }, { code: 'LT', name: 'Lithuania' },
  { code: 'LV', name: 'Latvia' }, { code: 'EE', name: 'Estonia' },
  { code: 'SI', name: 'Slovenia' }, { code: 'BA', name: 'Bosnia' },
  { code: 'AL', name: 'Albania' }, { code: 'MD', name: 'Moldova' },
  { code: 'BY', name: 'Belarus' }, { code: 'GE', name: 'Georgia' },
  { code: 'AM', name: 'Armenia' }, { code: 'AZ', name: 'Azerbaijan' },
  { code: 'KZ', name: 'Kazakhstan' }, { code: 'UZ', name: 'Uzbekistan' },
  { code: 'MN', name: 'Mongolia' }, { code: 'NP', name: 'Nepal' },
  { code: 'LK', name: 'Sri Lanka' }, { code: 'MM', name: 'Myanmar' },
  { code: 'KH', name: 'Cambodia' }, { code: 'TZ', name: 'Tanzania' },
  { code: 'ET', name: 'Ethiopia' }, { code: 'GH', name: 'Ghana' },
  { code: 'CM', name: 'Cameroon' }, { code: 'SN', name: 'Senegal' },
  { code: 'UG', name: 'Uganda' }, { code: 'DZ', name: 'Algeria' },
  { code: 'TN', name: 'Tunisia' }, { code: 'SD', name: 'Sudan' },
  { code: 'AO', name: 'Angola' }, { code: 'MZ', name: 'Mozambique' },
  { code: 'ZW', name: 'Zimbabwe' }, { code: 'IQ', name: 'Iraq' },
  { code: 'IR', name: 'Iran' }, { code: 'JO', name: 'Jordan' },
  { code: 'SY', name: 'Syria' }, { code: 'YE', name: 'Yemen' },
  { code: 'OM', name: 'Oman' }, { code: 'VE', name: 'Venezuela' },
  { code: 'EC', name: 'Ecuador' }, { code: 'BO', name: 'Bolivia' },
  { code: 'PY', name: 'Paraguay' }, { code: 'UY', name: 'Uruguay' },
  { code: 'CR', name: 'Costa Rica' }, { code: 'PA', name: 'Panama' },
  { code: 'GT', name: 'Guatemala' }, { code: 'HN', name: 'Honduras' },
  { code: 'CU', name: 'Cuba' }, { code: 'DO', name: 'Dominican Republic' },
  { code: 'AF', name: 'Afghanistan' }, { code: 'LY', name: 'Libya' },
  { code: 'NA', name: 'Namibia' }, { code: 'BW', name: 'Botswana' },
]

type Phase = 'intro' | 'playing' | 'gameover'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getOptions(correct: typeof COUNTRIES[0]) {
  const others = shuffle(COUNTRIES.filter(c => c.code !== correct.code)).slice(0, 3)
  return shuffle([correct, ...others])
}

function CountryShape({ code }: { code: string }) {
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    setSvg(null)
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      .then(r => r.json())
      .then(data => {
        const maps = data?.[0]?.maps?.openStreetMaps
        // Use country-level SVG from a reliable source
      })
      .catch(() => {})

    // Use simplemaps or similar for SVG shapes
    // We'll use a CSS-based placeholder with the country code
  }, [code])

  // Use flagcdn for shape approximation - actually use a dedicated shape API
  return (
    <div style={{
      width: '100%', height: 240,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F5F5F5', borderRadius: 20,
    }}>
      <img
        src={`https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${code.toLowerCase()}/512.png`}
        alt="country shape"
        style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', filter: 'brightness(0)' }}
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = `https://flagcdn.com/w320/${code.toLowerCase()}.png`
          target.style.filter = 'none'
        }}
      />
    </div>
  )
}

export default function GeoShapeClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('intro')
  const [level, setLevel] = useState(0)
  const [current, setCurrent] = useState<typeof COUNTRIES[0] | null>(null)
  const [options, setOptions] = useState<typeof COUNTRIES[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [topScores, setTopScores] = useState<{ name: string, level: number }[]>([])

  useEffect(() => { fetchTop() }, [])

  const fetchTop = async () => {
    const { data } = await supabase.from('shape_scores').select('player_name, level').order('level', { ascending: false }).limit(5000)
    if (data) {
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
      setTopScores(Object.entries(best).map(([name, level]) => ({ name, level })).sort((a, b) => b.level - a.level))
    }
  }

  const nextQuestion = (lvl: number) => {
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
    setCurrent(country)
    setOptions(getOptions(country) as any)
    setSelected(null)
  }

  const startGame = () => {
    try { getAudioCtx() } catch(e) {}
    setLevel(0)
    setPhase('playing')
    nextQuestion(0)
  }

  const handleAnswer = async (code: string) => {
    if (selected) return
    setSelected(code)
    const correct = code === current?.code
    const newLevel = correct ? level + 1 : level

    if (!correct) {
      playWrong()
      setTimeout(async () => {
        if (profile?.name) {
          await supabase.from('shape_scores').insert({ player_name: profile.name, level })
                window.dispatchEvent(new Event('game_completed'))
      completeWodExercise(profile?.name || '', '/geoshape')
      completePlanDay(profile?.name || profile?.name || '', '/geoshape')
          const { data } = await supabase.from('shape_scores').select('player_name, level').order('level', { ascending: false }).limit(5000)
          if (data) {
            const best: Record<string, number> = {}
            data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
            const myBest = best[profile.name] || level
            setWorldRank(Object.values(best).filter(l => l > myBest).length + 1)
          }
          fetchTop()
        }
        setPhase('gameover')
      }, 400)
    } else {
      playCorrect()
      setLevel(newLevel)
      setTimeout(() => nextQuestion(newLevel), 1000)
    }
  }

  return (
    <>
      <style>{`
        @keyframes floatLogo { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-6px) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      <main style={{
        height: '100dvh', background: `linear-gradient(180deg, #E3F2FD 0%, ${CREAM} 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto',
        overflow: 'auto', paddingBottom: 80,
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', width: '100%', gap: 12 }}>
          <img src={LOGO} alt="GeoShape" style={{ height: 56, objectFit: 'contain', animation: 'floatLogo 3s ease-in-out infinite', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: BLUE, letterSpacing: -0.5, lineHeight: 1 }}>GeoShape</div>
            {phase === 'intro' && <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Guess the country from its shape</div>}
          </div>
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 14, width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 6 }}>Guess the country shape</div>
              <div style={{ fontSize: 13, color: `${BROWN}60`, lineHeight: 1.6 }}>
                A country silhouette appears on screen.<br />Choose the correct country name.<br />How many can you get in a row?
              </div>
            </div>

            <button onClick={startGame} style={{
              padding: '18px', borderRadius: 20, border: 'none',
              background: BLUE, color: '#fff',
              fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: `0 8px 0 ${BLUE}60`, width: '100%',
            }}>Start</button>

            <Link href="/geoshape/ranking" style={{ textDecoration: 'none', width: '100%' }}>
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
        {phase === 'playing' && current && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, width: '100%', padding: '0 20px' }}>

            <div style={{ fontSize: 13, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase' }}>
              Streak: {level}
            </div>

            {/* Country shape */}
            <CountryShape code={current.code} />

            {/* Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
              {(options as any[]).map((opt: any) => {
                const isSelected = selected === opt.code
                const isCorrect = opt.code === current.code
                let bg = '#fff'
                let border = `1.5px solid ${BROWN}15`
                let color = BROWN
                if (selected) {
                  if (isCorrect) { bg = '#E8F5E9'; border = `2px solid ${GREEN}`; color = GREEN }
                  else if (isSelected) { bg = '#FFEBEE'; border = `2px solid ${RED}`; color = RED }
                }
                return (
                  <button key={opt.code} onClick={() => handleAnswer(opt.code)} style={{
                    padding: '14px 8px', borderRadius: 14, border, background: bg, color,
                    fontSize: 14, fontWeight: 800, fontFamily: 'inherit',
                    cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s',
                    boxShadow: `0 3px 8px ${BROWN}08`,
                  }}>{opt.name}</button>
                )
              })}
            </div>
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
              <div style={{ fontSize: 36, fontWeight: 900, color: BROWN, marginBottom: 4 }}>{level} countries</div>
              <div style={{ fontSize: 13, color: `${BROWN}50`, fontWeight: 700, marginBottom: 12 }}>in a row</div>

              {current && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: `${BROWN}50`, fontWeight: 700, marginBottom: 6 }}>The country was:</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: BROWN }}>{current.name}</div>
                </div>
              )}

              {worldRank && (
                <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}20`, borderRadius: 12, padding: '10px' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>World Ranking</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>#{worldRank}</div>
                </div>
              )}
            </div>


            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button onClick={() => {
                const url = `${window.location.origin}/challenge?game=geoshape&score=${level}&by=${encodeURIComponent(profile?.name || 'Someone')}`
                const text = `🗺️ ${profile?.name} identified ${level} country shapes in a row on MemGenius! Can you beat them? ${url}`
                track('challenge_shared')
                if (navigator.share) { navigator.share({ title: 'MemGenius', text, url }) } else { window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank') }
              }} style={{
                width: '100%', padding: '16px', borderRadius: 16, border: 'none',
                background: '#25D366', color: '#fff', fontSize: 16, fontWeight: 900,
                fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #128C7E60',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}><span style={{ fontSize: 20 }}>📲</span> Send to WhatsApp</button>
              <button onClick={startGame} style={{
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
