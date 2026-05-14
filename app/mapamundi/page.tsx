'use client'
import { useState, useEffect, useRef } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BLUE = '#1565C0'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

// 180 countries with their ISO codes for flag display
const COUNTRIES = [
  { name: 'France', code: 'FR' }, { name: 'Germany', code: 'DE' }, { name: 'Spain', code: 'ES' },
  { name: 'Italy', code: 'IT' }, { name: 'United Kingdom', code: 'GB' }, { name: 'Portugal', code: 'PT' },
  { name: 'Netherlands', code: 'NL' }, { name: 'Belgium', code: 'BE' }, { name: 'Switzerland', code: 'CH' },
  { name: 'Austria', code: 'AT' }, { name: 'Poland', code: 'PL' }, { name: 'Sweden', code: 'SE' },
  { name: 'Norway', code: 'NO' }, { name: 'Denmark', code: 'DK' }, { name: 'Finland', code: 'FI' },
  { name: 'Greece', code: 'GR' }, { name: 'Turkey', code: 'TR' }, { name: 'Ukraine', code: 'UA' },
  { name: 'Romania', code: 'RO' }, { name: 'Hungary', code: 'HU' }, { name: 'Czech Republic', code: 'CZ' },
  { name: 'Slovakia', code: 'SK' }, { name: 'Croatia', code: 'HR' }, { name: 'Serbia', code: 'RS' },
  { name: 'Bulgaria', code: 'BG' }, { name: 'Slovenia', code: 'SI' }, { name: 'Lithuania', code: 'LT' },
  { name: 'Latvia', code: 'LV' }, { name: 'Estonia', code: 'EE' }, { name: 'Ireland', code: 'IE' },
  { name: 'Iceland', code: 'IS' }, { name: 'Luxembourg', code: 'LU' }, { name: 'Malta', code: 'MT' },
  { name: 'Cyprus', code: 'CY' }, { name: 'Albania', code: 'AL' }, { name: 'Bosnia', code: 'BA' },
  { name: 'Moldova', code: 'MD' }, { name: 'Belarus', code: 'BY' }, { name: 'Russia', code: 'RU' },
  { name: 'USA', code: 'US' }, { name: 'Canada', code: 'CA' }, { name: 'Mexico', code: 'MX' },
  { name: 'Brazil', code: 'BR' }, { name: 'Argentina', code: 'AR' }, { name: 'Colombia', code: 'CO' },
  { name: 'Chile', code: 'CL' }, { name: 'Peru', code: 'PE' }, { name: 'Venezuela', code: 'VE' },
  { name: 'Ecuador', code: 'EC' }, { name: 'Bolivia', code: 'BO' }, { name: 'Paraguay', code: 'PY' },
  { name: 'Uruguay', code: 'UY' }, { name: 'Guyana', code: 'GY' }, { name: 'Suriname', code: 'SR' },
  { name: 'Cuba', code: 'CU' }, { name: 'Dominican Republic', code: 'DO' }, { name: 'Haiti', code: 'HT' },
  { name: 'Guatemala', code: 'GT' }, { name: 'Honduras', code: 'HN' }, { name: 'El Salvador', code: 'SV' },
  { name: 'Nicaragua', code: 'NI' }, { name: 'Costa Rica', code: 'CR' }, { name: 'Panama', code: 'PA' },
  { name: 'Jamaica', code: 'JM' }, { name: 'Trinidad', code: 'TT' }, { name: 'Bahamas', code: 'BS' },
  { name: 'China', code: 'CN' }, { name: 'Japan', code: 'JP' }, { name: 'South Korea', code: 'KR' },
  { name: 'North Korea', code: 'KP' }, { name: 'India', code: 'IN' }, { name: 'Pakistan', code: 'PK' },
  { name: 'Bangladesh', code: 'BD' }, { name: 'Indonesia', code: 'ID' }, { name: 'Philippines', code: 'PH' },
  { name: 'Vietnam', code: 'VN' }, { name: 'Thailand', code: 'TH' }, { name: 'Myanmar', code: 'MM' },
  { name: 'Malaysia', code: 'MY' }, { name: 'Cambodia', code: 'KH' }, { name: 'Laos', code: 'LA' },
  { name: 'Singapore', code: 'SG' }, { name: 'Sri Lanka', code: 'LK' }, { name: 'Nepal', code: 'NP' },
  { name: 'Afghanistan', code: 'AF' }, { name: 'Iran', code: 'IR' }, { name: 'Iraq', code: 'IQ' },
  { name: 'Saudi Arabia', code: 'SA' }, { name: 'UAE', code: 'AE' }, { name: 'Israel', code: 'IL' },
  { name: 'Jordan', code: 'JO' }, { name: 'Syria', code: 'SY' }, { name: 'Lebanon', code: 'LB' },
  { name: 'Yemen', code: 'YE' }, { name: 'Oman', code: 'OM' }, { name: 'Kuwait', code: 'KW' },
  { name: 'Qatar', code: 'QA' }, { name: 'Bahrain', code: 'BH' }, { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Uzbekistan', code: 'UZ' }, { name: 'Turkmenistan', code: 'TM' }, { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Georgia', code: 'GE' }, { name: 'Armenia', code: 'AM' }, { name: 'Mongolia', code: 'MN' },
  { name: 'Taiwan', code: 'TW' }, { name: 'Egypt', code: 'EG' }, { name: 'Nigeria', code: 'NG' },
  { name: 'South Africa', code: 'ZA' }, { name: 'Kenya', code: 'KE' }, { name: 'Ethiopia', code: 'ET' },
  { name: 'Tanzania', code: 'TZ' }, { name: 'Ghana', code: 'GH' }, { name: 'Morocco', code: 'MA' },
  { name: 'Algeria', code: 'DZ' }, { name: 'Tunisia', code: 'TN' }, { name: 'Libya', code: 'LY' },
  { name: 'Sudan', code: 'SD' }, { name: 'Angola', code: 'AO' }, { name: 'Mozambique', code: 'MZ' },
  { name: 'Madagascar', code: 'MG' }, { name: 'Cameroon', code: 'CM' }, { name: 'Ivory Coast', code: 'CI' },
  { name: 'Niger', code: 'NE' }, { name: 'Mali', code: 'ML' }, { name: 'Burkina Faso', code: 'BF' },
  { name: 'Senegal', code: 'SN' }, { name: 'Guinea', code: 'GN' }, { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' }, { name: 'Uganda', code: 'UG' }, { name: 'Rwanda', code: 'RW' },
  { name: 'Somalia', code: 'SO' }, { name: 'DR Congo', code: 'CD' }, { name: 'Gabon', code: 'GA' },
  { name: 'Namibia', code: 'NA' }, { name: 'Botswana', code: 'BW' }, { name: 'Malawi', code: 'MW' },
  { name: 'Australia', code: 'AU' }, { name: 'New Zealand', code: 'NZ' }, { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Fiji', code: 'FJ' }, { name: 'Maldives', code: 'MV' }, { name: 'Afghanistan', code: 'AF' },
  { name: 'Kyrgyzstan', code: 'KG' }, { name: 'Tajikistan', code: 'TJ' }, { name: 'Myanmar', code: 'MM' },
]

// Remove duplicates
const UNIQUE_COUNTRIES = COUNTRIES.filter((c, i, arr) => arr.findIndex(x => x.code === c.code) === i)

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)

const getFlagUrl = (code: string) => `https://flagcdn.com/w160/${code.toLowerCase()}.png`

const getWrongOptions = (correct: { name: string, code: string }, all: typeof COUNTRIES) => {
  const others = all.filter(c => c.code !== correct.code)
  const shuffled = shuffle(others).slice(0, 3)
  return shuffle([correct, ...shuffled])
}

export default function MapamundiPage() {
  const { profile } = usePlayer()
  const [countries] = useState(() => shuffle(UNIQUE_COUNTRIES))
  const [index, setIndex] = useState(0)
  const [options, setOptions] = useState<typeof COUNTRIES>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [phase, setPhase] = useState<'playing' | 'result'>('playing')
  const [level, setLevel] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [bestLevel, setBestLevel] = useState<number | null>(null)

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('shape_scores').select('level').eq('player_name', profile.name).order('level', { ascending: false }).limit(1)
      .then(({ data }) => { if (data?.[0]) setBestLevel(data[0].level) })
  }, [profile?.name])

  useEffect(() => {
    if (countries[index]) {
      setOptions(getWrongOptions(countries[index], UNIQUE_COUNTRIES))
      setSelected(null)
    }
  }, [index, countries])

  const handleAnswer = async (code: string) => {
    if (selected) return
    setSelected(code)
    const correct = countries[index].code === code

    if (correct) {
      setTimeout(() => {
        setLevel(l => l + 1)
        setIndex(i => i + 1)
      }, 800)
    } else {
      // Game over
      const finalLevel = level
      setTimeout(async () => {
        setPhase('result')
        if (profile?.name) {
          await supabase.from('shape_scores').insert({ player_name: profile.name, level: finalLevel })
          const { data } = await supabase.from('shape_scores').select('player_name, level').order('level', { ascending: false }).limit(500)
          if (data) {
            const best: Record<string, number> = {}
            data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
            setWorldRank(Object.values(best).filter(l => l > finalLevel).length + 1)
            if (!bestLevel || finalLevel > bestLevel) setBestLevel(finalLevel)
          }
        }
      }, 800)
    }
  }

  const current = countries[index]

  return (
    <main style={{ minHeight: '100dvh', background: `linear-gradient(180deg, #E3F2FD 0%, ${CREAM} 40%)`, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '0 0 100px', color: BROWN }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', gap: 12 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: BLUE, letterSpacing: -0.5 }}>Mapamundi</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Guess the country from its flag</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: BLUE }}>{level}</div>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: `1px solid ${BROWN}15`, borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 800, color: `${BROWN}60` }}>← Home</div>
          </Link>
        </div>
      </div>

      {bestLevel !== null && (
        <div style={{ margin: '12px 20px 0', background: `${BLUE}10`, borderRadius: 14, padding: '10px 16px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, textTransform: 'uppercase' }}>Your best</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: BLUE }}>{bestLevel} countries</div>
        </div>
      )}

      {phase === 'playing' && current && (
        <div style={{ padding: '24px 20px 0' }}>
          {/* Flag */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <img
              src={getFlagUrl(current.code)}
              alt="?"
              style={{ width: 280, height: 180, objectFit: 'contain', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
            />
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {options.map(opt => {
              const isSelected = selected === opt.code
              const isCorrect = opt.code === current.code
              const bg = !selected ? '#fff'
                : isCorrect ? '#E8F5E9'
                : isSelected ? '#FFEBEE'
                : '#fff'
              const border = !selected ? `1px solid ${BROWN}10`
                : isCorrect ? '2px solid #2E7D32'
                : isSelected ? '2px solid #C62828'
                : `1px solid ${BROWN}10`

              return (
                <button key={opt.code} onClick={() => handleAnswer(opt.code)} style={{
                  padding: '16px 20px', borderRadius: 16, border,
                  background: bg, color: BROWN,
                  fontSize: 16, fontWeight: 900, fontFamily: 'inherit',
                  cursor: selected ? 'default' : 'pointer',
                  textAlign: 'left',
                  boxShadow: !selected ? '0 2px 0 #4A2C0A10' : 'none',
                  transition: 'all 0.2s',
                }}>{opt.name}</button>
              )
            })}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div style={{ padding: '40px 20px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 72, fontWeight: 900, color: BLUE, lineHeight: 1 }}>{level}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: `${BROWN}60`, marginTop: 8 }}>countries correct</div>
          {worldRank && <div style={{ fontSize: 24, fontWeight: 900, color: GOLD, marginTop: 12 }}>#{worldRank} World</div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button onClick={() => {
              const text = `I identified ${level} countries in a row on MemGenius Mapamundi! Can you beat me? memgenius.com/mapamundi`
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
            }} style={{ flex: 2, padding: '16px', borderRadius: 16, border: 'none', background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>Share</button>
            <button onClick={() => window.location.reload()} style={{ flex: 1, padding: '14px', borderRadius: 14, border: 'none', background: GOLD, color: '#fff', fontSize: 13, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>Play again</button>
          </div>
        </div>
      )}
    </main>
  )
}
