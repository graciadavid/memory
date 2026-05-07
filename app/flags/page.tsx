'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const GREEN = '#2E7D32'
const RED = '#B71C1C'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const LOGO = `${BASE}/flags.png`
const TROPHY = `${BASE}/nav-trophy.png`
const BRAIN_GREEN = `${BASE}/brain-green.png`
const BRAIN_RED = `${BASE}/brain-red.png`
const FLAG_CDN = 'https://flagcdn.com/w320'

const COUNTRIES = [
  { code: 'fr', name: 'France' }, { code: 'de', name: 'Germany' },
  { code: 'es', name: 'Spain' }, { code: 'it', name: 'Italy' },
  { code: 'pt', name: 'Portugal' }, { code: 'gb', name: 'United Kingdom' },
  { code: 'us', name: 'United States' }, { code: 'ca', name: 'Canada' },
  { code: 'mx', name: 'Mexico' }, { code: 'br', name: 'Brazil' },
  { code: 'ar', name: 'Argentina' }, { code: 'cl', name: 'Chile' },
  { code: 'co', name: 'Colombia' }, { code: 'pe', name: 'Peru' },
  { code: 'jp', name: 'Japan' }, { code: 'cn', name: 'China' },
  { code: 'kr', name: 'South Korea' }, { code: 'in', name: 'India' },
  { code: 'au', name: 'Australia' }, { code: 'nz', name: 'New Zealand' },
  { code: 'za', name: 'South Africa' }, { code: 'eg', name: 'Egypt' },
  { code: 'ng', name: 'Nigeria' }, { code: 'ke', name: 'Kenya' },
  { code: 'ma', name: 'Morocco' }, { code: 'ru', name: 'Russia' },
  { code: 'tr', name: 'Turkey' }, { code: 'sa', name: 'Saudi Arabia' },
  { code: 'ae', name: 'UAE' }, { code: 'th', name: 'Thailand' },
  { code: 'id', name: 'Indonesia' }, { code: 'ph', name: 'Philippines' },
  { code: 'pk', name: 'Pakistan' }, { code: 'bd', name: 'Bangladesh' },
  { code: 'vn', name: 'Vietnam' }, { code: 'nl', name: 'Netherlands' },
  { code: 'be', name: 'Belgium' }, { code: 'ch', name: 'Switzerland' },
  { code: 'at', name: 'Austria' }, { code: 'se', name: 'Sweden' },
  { code: 'no', name: 'Norway' }, { code: 'dk', name: 'Denmark' },
  { code: 'fi', name: 'Finland' }, { code: 'pl', name: 'Poland' },
  { code: 'cz', name: 'Czech Republic' }, { code: 'ro', name: 'Romania' },
  { code: 'hu', name: 'Hungary' }, { code: 'gr', name: 'Greece' },
  { code: 'ua', name: 'Ukraine' }, { code: 'il', name: 'Israel' },
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

export default function FlagsPage() {
  const { profile } = usePlayer()
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [level, setLevel] = useState(0)
  const [current, setCurrent] = useState<typeof COUNTRIES[0] | null>(null)
  const [options, setOptions] = useState<typeof COUNTRIES[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [topScores, setTopScores] = useState<{ name: string, level: number }[]>([])
  const [progress, setProgress] = useState(100)
  const [imgLoaded, setImgLoaded] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => { fetchTop() }, [])

  const fetchTop = async () => {
    const { data } = await supabase.from('flag_scores').select('player_name, level').order('level', { ascending: false }).limit(200)
    if (data) {
      const best: Record<string, number> = {}
      data.forEach(s => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
      setTopScores(Object.entries(best).map(([name, level]) => ({ name, level })).sort((a, b) => b.level - a.level))
    }
  }

  const nextQuestion = (lvl: number) => {
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
    setCurrent(country)
    setOptions(getOptions(country) as any)
    setSelected(null)
    setImgLoaded(false)
    setProgress(100)
  }

  const startGame = () => {
    setLevel(0)
    setPhase('playing')
    nextQuestion(0)
  }

  const handleAnswer = async (code: string) => {
    if (selected) return
    setSelected(code)
    if (timerRef.current) clearTimeout(timerRef.current)

    const correct = code === current?.code
    const newLevel = correct ? level + 1 : level

    if (!correct) {
      setTimeout(async () => {
        if (profile?.name) {
          await supabase.from('flag_scores').insert({ player_name: profile.name, level })
          const { data } = await supabase.from('flag_scores').select('player_name, level').order('level', { ascending: false }).limit(200)
          if (data) {
            const best: Record<string, number> = {}
            data.forEach(s => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
            const myBest = best[profile.name] || level
            setWorldRank(Object.values(best).filter(l => l > myBest).length + 1)
          }
          fetchTop()
        }
        setPhase('gameover')
      }, 1200)
    } else {
      setLevel(newLevel)
      setTimeout(() => nextQuestion(newLevel), 1000)
    }
  }

  const share = async () => {
    const text = `🚩 I got ${level} flags right in a row on MemGenius!\nCan you beat me? 👉 https://memgenius.com/flags`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

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
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
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
          <img src={LOGO} alt="Flags" style={{ height: 56, objectFit: 'contain', animation: 'floatLogo 3s ease-in-out infinite', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: BROWN, letterSpacing: -0.5, lineHeight: 1 }}>Flags</div>
            {phase === 'intro' && <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>How many can you get right?</div>}
          </div>
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 14, width: '100%', animation: 'fadeUp 0.5s ease both' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 6 }}>Guess the flag</div>
              <div style={{ fontSize: 13, color: `${BROWN}60`, lineHeight: 1.6 }}>
                A flag appears on screen.<br />Choose the correct country.<br />How many can you get in a row?
              </div>
            </div>

            {/* Preview flags */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {['fr', 'jp', 'br', 'de'].map(code => (
                <img key={code} src={`${FLAG_CDN}/${code}.png`} alt={code} style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 8, boxShadow: `0 4px 12px ${BROWN}20` }} />
              ))}
            </div>

            <button onClick={startGame} style={{
              padding: '18px', borderRadius: 20, border: 'none',
              background: BROWN, color: '#fff',
              fontSize: 18, fontWeight: 900, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: `0 8px 0 ${BROWN}60`,
              width: '100%',
            }}>Start</button>

            <Link href="/flags/ranking" style={{ textDecoration: 'none', width: '100%' }}>
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

            {/* Flag */}
            <div style={{
              width: '100%', borderRadius: 20,
              overflow: 'hidden',
              boxShadow: `0 8px 32px ${BROWN}25`,
              background: '#eee',
              aspectRatio: '3/2',
              position: 'relative',
            }}>
              <img
                key={current.code}
                src={`${FLAG_CDN}/${current.code}.png`}
                alt="flag"
                onLoad={() => setImgLoaded(true)}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  opacity: imgLoaded ? 1 : 0,
                  transition: 'opacity 0.2s',
                }}
              />
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: 6, background: `${BROWN}15`, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: GOLD, borderRadius: 4,
                transition: 'width 0.3s linear',
              }} />
            </div>

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
                    padding: '14px 8px', borderRadius: 14, border,
                    background: bg, color,
                    fontSize: 14, fontWeight: 800,
                    fontFamily: 'inherit', cursor: selected ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: `0 3px 8px ${BROWN}08`,
                    transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                  }}>
                    {opt.name}
                  </button>
                )
              })}
            </div>
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
              <img loading="lazy" src={BRAIN_RED} alt="" style={{ width: 70, height: 70, objectFit: 'contain', marginBottom: 8 }} />
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: `${BROWN}50`, textTransform: 'uppercase', marginBottom: 6 }}>Your Result</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: BROWN, marginBottom: 4 }}>{level} flags</div>
              <div style={{ fontSize: 13, color: `${BROWN}50`, fontWeight: 700, marginBottom: 12 }}>in a row</div>

              {current && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: `${BROWN}50`, fontWeight: 700, marginBottom: 6 }}>The flag was:</div>
                  <img src={`${FLAG_CDN}/${current.code}.png`} alt={current.name} style={{ width: 80, height: 54, objectFit: 'cover', borderRadius: 8, boxShadow: `0 4px 12px ${BROWN}20` }} />
                  <div style={{ fontSize: 14, fontWeight: 900, color: BROWN, marginTop: 6 }}>{current.name}</div>
                </div>
              )}

              {worldRank && (
                <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}20`, borderRadius: 12, padding: '10px' }}>
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
