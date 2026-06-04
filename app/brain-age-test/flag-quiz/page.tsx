'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const COUNTRIES = [
  { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' }, { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' }, { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' }, { code: 'CN', name: 'China' },
  { code: 'BR', name: 'Brazil' }, { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' }, { code: 'MX', name: 'Mexico' },
  { code: 'IN', name: 'India' }, { code: 'RU', name: 'Russia' },
  { code: 'ZA', name: 'South Africa' }, { code: 'NG', name: 'Nigeria' },
  { code: 'AR', name: 'Argentina' }, { code: 'KR', name: 'South Korea' },
  { code: 'TR', name: 'Turkey' }, { code: 'PL', name: 'Poland' },
  { code: 'NL', name: 'Netherlands' }, { code: 'BE', name: 'Belgium' },
  { code: 'SE', name: 'Sweden' }, { code: 'NO', name: 'Norway' },
  { code: 'PT', name: 'Portugal' }, { code: 'GR', name: 'Greece' },
  { code: 'CH', name: 'Switzerland' }, { code: 'AT', name: 'Austria' },
  { code: 'PH', name: 'Philippines' }, { code: 'EG', name: 'Egypt' },
  { code: 'TH', name: 'Thailand' }, { code: 'VN', name: 'Vietnam' },
  { code: 'ID', name: 'Indonesia' }, { code: 'MY', name: 'Malaysia' },
  { code: 'PK', name: 'Pakistan' }, { code: 'BD', name: 'Bangladesh' },
  { code: 'UA', name: 'Ukraine' }, { code: 'RO', name: 'Romania' },
  { code: 'HU', name: 'Hungary' }, { code: 'CZ', name: 'Czech Republic' },
  { code: 'FI', name: 'Finland' }, { code: 'DK', name: 'Denmark' },
  { code: 'SK', name: 'Slovakia' }, { code: 'HR', name: 'Croatia' },
  { code: 'RS', name: 'Serbia' }, { code: 'BG', name: 'Bulgaria' },
  { code: 'IQ', name: 'Iraq' }, { code: 'IR', name: 'Iran' },
  { code: 'SA', name: 'Saudi Arabia' }, { code: 'AE', name: 'UAE' },
  { code: 'IL', name: 'Israel' }, { code: 'MA', name: 'Morocco' },
  { code: 'DZ', name: 'Algeria' }, { code: 'TN', name: 'Tunisia' },
  { code: 'KE', name: 'Kenya' }, { code: 'ET', name: 'Ethiopia' },
  { code: 'GH', name: 'Ghana' }, { code: 'TZ', name: 'Tanzania' },
  { code: 'CO', name: 'Colombia' }, { code: 'VE', name: 'Venezuela' },
  { code: 'PE', name: 'Peru' }, { code: 'CL', name: 'Chile' },
  { code: 'EC', name: 'Ecuador' }, { code: 'UY', name: 'Uruguay' },
  { code: 'NZ', name: 'New Zealand' }, { code: 'SG', name: 'Singapore' },
  { code: 'IE', name: 'Ireland' }, { code: 'IS', name: 'Iceland' },
  { code: 'LT', name: 'Lithuania' }, { code: 'LV', name: 'Latvia' },
  { code: 'EE', name: 'Estonia' }, { code: 'SI', name: 'Slovenia' },
  { code: 'AL', name: 'Albania' }, { code: 'BA', name: 'Bosnia' },
  { code: 'ME', name: 'Montenegro' }, { code: 'MD', name: 'Moldova' },
  { code: 'BY', name: 'Belarus' }, { code: 'GE', name: 'Georgia' },
  { code: 'AM', name: 'Armenia' }, { code: 'AZ', name: 'Azerbaijan' },
  { code: 'KZ', name: 'Kazakhstan' }, { code: 'UZ', name: 'Uzbekistan' },
  { code: 'AF', name: 'Afghanistan' }, { code: 'NP', name: 'Nepal' },
  { code: 'LK', name: 'Sri Lanka' }, { code: 'MM', name: 'Myanmar' },
  { code: 'KH', name: 'Cambodia' }, { code: 'LA', name: 'Laos' },
  { code: 'MN', name: 'Mongolia' }, { code: 'JO', name: 'Jordan' },
  { code: 'LB', name: 'Lebanon' }, { code: 'OM', name: 'Oman' },
  { code: 'QA', name: 'Qatar' }, { code: 'KW', name: 'Kuwait' },
  { code: 'BH', name: 'Bahrain' }, { code: 'LY', name: 'Libya' },
  { code: 'SD', name: 'Sudan' }, { code: 'CM', name: 'Cameroon' },
  { code: 'CI', name: 'Ivory Coast' }, { code: 'SN', name: 'Senegal' },
  { code: 'ML', name: 'Mali' }, { code: 'NE', name: 'Niger' },
  { code: 'TD', name: 'Chad' }, { code: 'MR', name: 'Mauritania' },
  { code: 'GN', name: 'Guinea' }, { code: 'BF', name: 'Burkina Faso' },
  { code: 'TG', name: 'Togo' }, { code: 'BJ', name: 'Benin' },
  { code: 'GA', name: 'Gabon' }, { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'DR Congo' }, { code: 'AO', name: 'Angola' },
  { code: 'ZM', name: 'Zambia' }, { code: 'ZW', name: 'Zimbabwe' },
  { code: 'BW', name: 'Botswana' }, { code: 'NA', name: 'Namibia' },
  { code: 'MZ', name: 'Mozambique' }, { code: 'MW', name: 'Malawi' },
  { code: 'MG', name: 'Madagascar' }, { code: 'UG', name: 'Uganda' },
  { code: 'RW', name: 'Rwanda' }, { code: 'BI', name: 'Burundi' },
  { code: 'GT', name: 'Guatemala' }, { code: 'HN', name: 'Honduras' },
  { code: 'SV', name: 'El Salvador' }, { code: 'NI', name: 'Nicaragua' },
  { code: 'CR', name: 'Costa Rica' }, { code: 'PA', name: 'Panama' },
  { code: 'BO', name: 'Bolivia' }, { code: 'PY', name: 'Paraguay' },
  { code: 'CU', name: 'Cuba' }, { code: 'DO', name: 'Dominican Republic' },
  { code: 'JM', name: 'Jamaica' }, { code: 'HT', name: 'Haiti' },
  { code: 'TT', name: 'Trinidad and Tobago' }, { code: 'FJ', name: 'Fiji' },
  { code: 'PG', name: 'Papua New Guinea' }, { code: 'MK', name: 'North Macedonia' },
  { code: 'LU', name: 'Luxembourg' }, { code: 'CY', name: 'Cyprus' },
  { code: 'MT', name: 'Malta' }, { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'TJ', name: 'Tajikistan' }, { code: 'TM', name: 'Turkmenistan' },
  { code: 'GQ', name: 'Equatorial Guinea' }, { code: 'SS', name: 'South Sudan' },
  { code: 'ER', name: 'Eritrea' }, { code: 'DJ', name: 'Djibouti' },
  { code: 'SO', name: 'Somalia' }, { code: 'YE', name: 'Yemen' },
  { code: 'SY', name: 'Syria' }, { code: 'KP', name: 'North Korea' },
  { code: 'TW', name: 'Taiwan' }, { code: 'HK', name: 'Hong Kong' },
  { code: 'GY', name: 'Guyana' }, { code: 'SR', name: 'Suriname' },
  { code: 'BB', name: 'Barbados' }, { code: 'BS', name: 'Bahamas' },
  { code: 'BZ', name: 'Belize' }, { code: 'GD', name: 'Grenada' },
  { code: 'LC', name: 'Saint Lucia' }, { code: 'VC', name: 'Saint Vincent' },
  { code: 'AG', name: 'Antigua and Barbuda' }, { code: 'KN', name: 'Saint Kitts' },
  { code: 'DM', name: 'Dominica' }, { code: 'TO', name: 'Tonga' },
  { code: 'WS', name: 'Samoa' }, { code: 'VU', name: 'Vanuatu' },
  { code: 'SB', name: 'Solomon Islands' }, { code: 'KI', name: 'Kiribati' },
  { code: 'TV', name: 'Tuvalu' }, { code: 'NR', name: 'Nauru' },
  { code: 'PW', name: 'Palau' }, { code: 'FM', name: 'Micronesia' },
  { code: 'MH', name: 'Marshall Islands' }, { code: 'CV', name: 'Cape Verde' },
  { code: 'ST', name: 'Sao Tome' }, { code: 'KM', name: 'Comoros' },
  { code: 'SC', name: 'Seychelles' }, { code: 'MU', name: 'Mauritius' },
  { code: 'MV', name: 'Maldives' }, { code: 'BT', name: 'Bhutan' },
  { code: 'TL', name: 'East Timor' }, { code: 'BN', name: 'Brunei' },
]

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

function getPercentile(level: number, birthYear: number): number {
  const map: Record<number, number> = { 0:5, 1:15, 2:22, 3:30, 4:38, 5:46, 6:54, 7:62, 8:69, 9:75, 10:80, 11:84, 12:87, 13:90, 14:92, 15:94, 16:95, 17:96, 18:97, 19:98, 20:99 }
  return map[Math.min(level, 20)] || 99
}

type Phase = 'intro' | 'playing' | 'result'

export default function FlagQuizPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [current, setCurrent] = useState<any>(null)
  const [options, setOptions] = useState<any[]>([])
  const [level, setLevel] = useState(0)
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)
  const [percentile, setPercentile] = useState(0)
  const [session, setSession] = useState<any>(null)
  const [queue, setQueue] = useState<any[]>([])

  useEffect(() => {
    const s = localStorage.getItem('braintest_session')
    if (s) setSession(JSON.parse(s))
  }, [])

  const nextQuestion = useCallback((q: any[], lvl: number) => {
    if (q.length === 0) return
    const [next, ...rest] = q
    const wrong = shuffle(COUNTRIES.filter(c => c.code !== next.code)).slice(0, 3)
    setOptions(shuffle([next, ...wrong]))
    setCurrent(next)
    setQueue(rest)
    setFeedback(null)
  }, [])

  const startGame = () => {
    const q = shuffle(COUNTRIES)
    setLevel(0)
    nextQuestion(q, 0)
    setPhase('playing')
  }

  const handleAnswer = (country: any) => {
    if (feedback) return
    if (country.code === current.code) {
      setFeedback('correct')
      const newLevel = level + 1
      setLevel(newLevel)
      setTimeout(() => nextQuestion(queue, newLevel), 600)
    } else {
      setFeedback('wrong')
      const birthYear = session?.birthYear ? parseInt(session.birthYear) : 1990
      const pct = getPercentile(level, birthYear)
      setPercentile(pct)
      setTimeout(() => {
        setPhase('result')
        const name = session?.name || JSON.parse(localStorage.getItem('memgenius_profile') || '{}').name
        if (name) {
          supabase.from('flag_scores').insert({ player_name: name, level })
          supabase.rpc('update_streak', { p_player_name: name })
        }
      }, 800)
    }
  }

  const saveAndContinue = () => {
    if (!session) return
    const updated = { ...session, results: { ...session.results, knowledge: percentile } }
    localStorage.setItem('braintest_session', JSON.stringify(updated))
    window.location.href = '/brain-age-test'
  }

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>
      <a href="/brain-age-test" style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', textDecoration:'none', display:'block', marginBottom:20 }}>← Brain Age Test</a>

      <div style={{ fontSize:11, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>Step 4 of 4</div>
      <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:4 }}>Knowledge Test</div>
      <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>How many flags can you identify?</div>

      {phase === 'intro' && (
        <>
          <div style={{ background:'#252525', borderRadius:16, padding:'20px', marginBottom:20, textAlign:'center' }}>
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:12 }}>
              {['us','gb','jp','br','ng','is'].map(c => (
                <img key={c} src={`https://flagcdn.com/w40/${c}.png`} style={{ width:36, height:'auto', borderRadius:4 }} />
              ))}
            </div>
            <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>
              Identify flags from around the world. One wrong answer ends the test. How many can you get in a row?
            </div>
          </div>
          <button onClick={startGame}
            style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20' }}>
            Start Test →
          </button>
        </>
      )}

      {phase === 'playing' && current && (
        <>
          <div style={{ textAlign:'center', marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Score: {level}</div>
            <img
              src={`https://flagcdn.com/w160/${current.code.toLowerCase()}.png`}
              style={{ width:160, height:'auto', borderRadius:8, border:'2px solid rgba(255,255,255,0.1)', marginBottom:8 }}
            />
            <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>Which country is this?</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {options.map(opt => {
              let bg = '#252525'
              let border = '2px solid rgba(255,255,255,0.08)'
              if (feedback && opt.code === current.code) { bg = GREEN; border = `2px solid ${GREEN}` }
              return (
                <button key={opt.code} onClick={() => handleAnswer(opt)}
                  style={{ padding:'14px', borderRadius:12, border, background:bg, color:'#fff', fontSize:13, fontWeight:800, fontFamily:'inherit', cursor:'pointer', transition:'all 0.2s' }}>
                  {opt.name}
                </button>
              )
            })}
          </div>
        </>
      )}

      {phase === 'result' && (
        <div style={{ textAlign:'center' }}>
          <div style={{ width:140, height:140, borderRadius:'50%', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:124, height:124, borderRadius:'50%', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:1 }}>SCORE</div>
              <div style={{ fontSize:48, fontWeight:900, color:GOLD, lineHeight:1 }}>{level}</div>
              <div style={{ fontSize:13, fontWeight:800, color:GREEN }}>Top {percentile}%</div>
            </div>
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:20 }}>
            {level >= 20 ? '🌍 Geography genius!' : level >= 12 ? '💪 Above average!' : level >= 6 ? '📈 Room to improve' : '🔥 Keep training!'}
          </div>
          <button onClick={startGame}
            style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:'#252525', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:10 }}>
            Try Again
          </button>
          <button onClick={saveAndContinue}
            style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:`linear-gradient(135deg, #8B6914, ${GOLD}, #FFD700)`, color:'#000', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #8B6914' }}>
            Save & Continue →
          </button>
        </div>
      )}

      <details style={{ marginTop:40 }}>
        <summary style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', cursor:'pointer', listStyle:'none' }}>What does this Knowledge Test measure? ▼</summary>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.7, marginTop:12 }}>
          This free flag quiz tests visual recognition memory and general knowledge across 180+ countries. Identifying flags requires both long-term memory and pattern recognition. Studies show that geography knowledge correlates with broader cognitive abilities including attention and processing speed. Your score is compared to people your age worldwide.
        </div>
      </details>
    </main>
  )
}
