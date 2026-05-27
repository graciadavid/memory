'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { updateStreak } from '@/lib/streak'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
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
 { code: 'za', name: 'South Africa' }, { code: 'ng', name: 'Nigeria' },
 { code: 'eg', name: 'Egypt' }, { code: 'ma', name: 'Morocco' },
 { code: 'ke', name: 'Kenya' }, { code: 'gh', name: 'Ghana' },
 { code: 'se', name: 'Sweden' }, { code: 'no', name: 'Norway' },
 { code: 'dk', name: 'Denmark' }, { code: 'fi', name: 'Finland' },
 { code: 'nl', name: 'Netherlands' }, { code: 'be', name: 'Belgium' },
 { code: 'ch', name: 'Switzerland' }, { code: 'at', name: 'Austria' },
 { code: 'pl', name: 'Poland' }, { code: 'cz', name: 'Czech Republic' },
 { code: 'hu', name: 'Hungary' }, { code: 'ro', name: 'Romania' },
 { code: 'gr', name: 'Greece' }, { code: 'tr', name: 'Turkey' },
 { code: 'ru', name: 'Russia' }, { code: 'ua', name: 'Ukraine' },
 { code: 'th', name: 'Thailand' }, { code: 'vn', name: 'Vietnam' },
 { code: 'id', name: 'Indonesia' }, { code: 'ph', name: 'Philippines' },
 { code: 'my', name: 'Malaysia' }, { code: 'sg', name: 'Singapore' },
 { code: 'pk', name: 'Pakistan' }, { code: 'bd', name: 'Bangladesh' },
 { code: 'ir', name: 'Iran' }, { code: 'iq', name: 'Iraq' },
 { code: 'sa', name: 'Saudi Arabia' }, { code: 'ae', name: 'UAE' },
 { code: 'il', name: 'Israel' }, { code: 'jo', name: 'Jordan' },
 { code: 'tz', name: 'Tanzania' }, { code: 'et', name: 'Ethiopia' },
 { code: 'ug', name: 'Uganda' }, { code: 'zm', name: 'Zambia' },
 { code: 'zw', name: 'Zimbabwe' }, { code: 'ao', name: 'Angola' },
 { code: 'cm', name: 'Cameroon' }, { code: 'ci', name: 'Ivory Coast' },
 { code: 'sn', name: 'Senegal' }, { code: 'ml', name: 'Mali' },
 { code: 'bf', name: 'Burkina Faso' }, { code: 'ne', name: 'Niger' },
 { code: 'td', name: 'Chad' }, { code: 'sd', name: 'Sudan' },
 { code: 'dz', name: 'Algeria' }, { code: 'tn', name: 'Tunisia' },
 { code: 'ly', name: 'Libya' }, { code: 'mz', name: 'Mozambique' },
 { code: 'mg', name: 'Madagascar' }, { code: 'na', name: 'Namibia' },
 { code: 'bw', name: 'Botswana' }, { code: 'rw', name: 'Rwanda' },
 { code: 've', name: 'Venezuela' }, { code: 'ec', name: 'Ecuador' },
 { code: 'bo', name: 'Bolivia' }, { code: 'py', name: 'Paraguay' },
 { code: 'uy', name: 'Uruguay' }, { code: 'gt', name: 'Guatemala' },
 { code: 'cu', name: 'Cuba' }, { code: 'do', name: 'Dominican Republic' },
 { code: 'hn', name: 'Honduras' }, { code: 'ni', name: 'Nicaragua' },
 { code: 'cr', name: 'Costa Rica' }, { code: 'pa', name: 'Panama' },
 { code: 'jm', name: 'Jamaica' }, { code: 'ht', name: 'Haiti' },
 { code: 'ie', name: 'Ireland' }, { code: 'is', name: 'Iceland' },
 { code: 'lu', name: 'Luxembourg' }, { code: 'mt', name: 'Malta' },
 { code: 'cy', name: 'Cyprus' }, { code: 'hr', name: 'Croatia' },
 { code: 'si', name: 'Slovenia' }, { code: 'sk', name: 'Slovakia' },
 { code: 'bg', name: 'Bulgaria' }, { code: 'rs', name: 'Serbia' },
 { code: 'ba', name: 'Bosnia' }, { code: 'mk', name: 'North Macedonia' },
 { code: 'al', name: 'Albania' }, { code: 'me', name: 'Montenegro' },
 { code: 'md', name: 'Moldova' }, { code: 'by', name: 'Belarus' },
 { code: 'lt', name: 'Lithuania' }, { code: 'lv', name: 'Latvia' },
 { code: 'ee', name: 'Estonia' }, { code: 'ge', name: 'Georgia' },
 { code: 'am', name: 'Armenia' }, { code: 'az', name: 'Azerbaijan' },
 { code: 'kz', name: 'Kazakhstan' }, { code: 'uz', name: 'Uzbekistan' },
 { code: 'mn', name: 'Mongolia' }, { code: 'np', name: 'Nepal' },
 { code: 'lk', name: 'Sri Lanka' }, { code: 'mm', name: 'Myanmar' },
 { code: 'kh', name: 'Cambodia' }, { code: 'la', name: 'Laos' },
 { code: 'tw', name: 'Taiwan' }, { code: 'hk', name: 'Hong Kong' },
 { code: 'af', name: 'Afghanistan' }, { code: 'sy', name: 'Syria' },
 { code: 'ye', name: 'Yemen' }, { code: 'om', name: 'Oman' },
 { code: 'kw', name: 'Kuwait' }, { code: 'bh', name: 'Bahrain' },
 { code: 'qa', name: 'Qatar' }, { code: 'lb', name: 'Lebanon' },
 { code: 'ps', name: 'Palestine' }, { code: 'cy', name: 'Cyprus' },
 { code: 'fj', name: 'Fiji' }, { code: 'pg', name: 'Papua New Guinea' },
 { code: 'sb', name: 'Solomon Islands' }, { code: 'vu', name: 'Vanuatu' },
 { code: 'ws', name: 'Samoa' }, { code: 'to', name: 'Tonga' },
 { code: 'mv', name: 'Maldives' }, { code: 'bt', name: 'Bhutan' },
 { code: 'tl', name: 'Timor-Leste' }, { code: 'bn', name: 'Brunei' },
 { code: 'mw', name: 'Malawi' }, { code: 'bi', name: 'Burundi' },
 { code: 'ss', name: 'South Sudan' }, { code: 'so', name: 'Somalia' },
 { code: 'er', name: 'Eritrea' }, { code: 'dj', name: 'Djibouti' },
 { code: 'gn', name: 'Guinea' }, { code: 'gw', name: 'Guinea-Bissau' },
 { code: 'sl', name: 'Sierra Leone' }, { code: 'lr', name: 'Liberia' },
 { code: 'tg', name: 'Togo' }, { code: 'bj', name: 'Benin' },
 { code: 'ga', name: 'Gabon' }, { code: 'cg', name: 'Congo' },
 { code: 'cd', name: 'DR Congo' }, { code: 'cf', name: 'Central African Republic' },
 { code: 'gq', name: 'Equatorial Guinea' }, { code: 'st', name: 'São Tomé' },
 { code: 'cv', name: 'Cape Verde' }, { code: 'km', name: 'Comoros' },
 { code: 'sc', name: 'Seychelles' }, { code: 'mu', name: 'Mauritius' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type Phase = 'rules' | 'playing' | 'result'

export default function FlagsClient() {
  const { profile, createProfile } = usePlayer()
 const [champGame, setChampGame] = useState<string|null>(null)
 useEffect(() => {
   supabase.from('championship_weeks').select('game').eq('active', true).single()
     .then(({data}:any) => { if (data?.game) setChampGame(data.game) })
 }, [])
  const [phase, setPhase] = useState<Phase>('rules')
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<{ code: string, name: string } | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [lastAnswer, setLastAnswer] = useState('')
  const [worldRecord, setWorldRecord] = useState<{score:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,score:number}[]>([])
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const usedRef = useState<Set<string>>(() => new Set())[0]

  useEffect(() => {
    if (profile?.name) setName(profile.name)
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('flag_scores').select('player_name,level').order('level', { ascending: false }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
    const sorted = Object.entries(best).map(([n,s]) => ({name:n, score:s as number})).sort((a,b) => b.score-a.score)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({score:sorted[0].score, name:sorted[0].name})
    if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
  }

  const nextQuestion = useCallback(() => {
    setFeedback(null)
    setImgLoaded(false)
    const available = COUNTRIES.filter(c => !usedRef.has(c.code))
    const pool = available.length >= 4 ? available : COUNTRIES
    const shuffled = shuffle(pool)
    const correct = shuffled[0]
    usedRef.add(correct.code)
    const wrong = shuffle(COUNTRIES.filter(c => c.code !== correct.code)).slice(0, 3).map(c => c.name)
    setQuestion(correct)
    setOptions(shuffle([correct.name, ...wrong]))
  }, [usedRef])

  const startGame = () => {
    usedRef.clear()
    setScore(0)
    setPhase('playing')
    window.dispatchEvent(new CustomEvent('gameStart'))
    setTimeout(() => nextQuestion(), 50)
  }

  const handleAnswer = useCallback((answer: string) => {
    if (feedback || !question) return
    setLastAnswer(answer)
    const correct = answer === question.name
    setFeedback(correct ? 'correct' : 'wrong')
    if (correct) {
      setScore(s => s + 1)
      setTimeout(() => nextQuestion(), 700)
    } else {
      setTimeout(async () => {
        const finalScore = score
        setPhase('result')
    window.dispatchEvent(new CustomEvent('gameResult'))
        if (profile?.name) {
          await supabase.from('flag_scores').insert({player_name:profile.name, level:finalScore})
          const {count} = await supabase.from('flag_scores').select('*',{count:'exact',head:true}).gt('level',finalScore)
          setWorldRank((count??0)+1)
          if (myBest===null || finalScore>myBest) setMyBest(finalScore)
          await updateStreak(profile.name)
        }
      }, 1000)
    }
  }, [feedback, question, score, profile?.name, myBest, nextQuestion])

  const saveScore = async () => {
    if (!name.trim() || pin.join('').length!==4) return
    setSaving(true)
    setSaveError('')
    const pinHash = btoa(pin.join(''))
    const {data:existing} = await supabase.from('profiles').select('password_hash').eq('player_name',name.trim()).maybeSingle()
    if (existing) {
      if (existing.password_hash !== pinHash) { setSaveError('Wrong PIN for this name'); setSaving(false); return }
    } else {
      await supabase.from('profiles').insert({player_name:name.trim(), password_hash:pinHash})
    }
    await supabase.from('flag_levels').insert({player_name:name.trim(), score})
    const {count} = await supabase.from('flag_levels').select('*',{count:'exact',head:true}).gt('score',score)
    setWorldRank((count??0)+1)
    setSaving(false)
    setSaved(true)
    createProfile(name.trim())
    setTimeout(() => window.location.reload(), 1500)
  }

  const reset = () => {
    setPhase('rules')
    setSaved(false)
    setFeedback(null)
    loadData()
  }

  const resultColor = score >= 20 ? '#00C853' : score >= 10 ? '#FF6F00' : '#D32F2F'
  const bgResult = score >= 20 ? '#0D3320' : score >= 10 ? '#2D1A00' : '#1A0000'

  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <img src='https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/flags.png' style={{ width:56, height:56, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Flags</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Identify flags from around the world</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${worldRecord.score}` : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? myBest : '—'}</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.score} flags</div>
          </div>
        ))}
      </div>
      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080', marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  if (phase === 'playing') return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 20px 100px', overflowY:'auto' }}>
      <div style={{ fontSize:13, fontWeight:900, color:GOLD, marginBottom:20, textAlign:'center' }}>
        {score} correct
      </div>

      {question && (
        <>
          <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:20, padding:'20px', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'center', minHeight:160 }}>
            {!imgLoaded && <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>Loading...</div>}
            <img
              key={question.code}
              src={`${FLAG_CDN}/${question.code}.png`}
              alt=""
              onLoad={() => setImgLoaded(true)}
              style={{ maxWidth:'100%', maxHeight:140, objectFit:'contain', borderRadius:8, display:imgLoaded?'block':'none', boxShadow:'0 0 0 2px rgba(255,255,255,0.15), 0 4px 20px rgba(0,0,0,0.4)' }}
            />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {options.map(opt => {
              let bg = 'rgba(255,255,255,0.06)'
              let color = '#fff'
              if (feedback) {
                if (opt === question.name) { bg = 'rgba(76,175,80,0.3)'; color = '#69F0AE' }
                else if (opt === lastAnswer && feedback === 'wrong') { bg = 'rgba(211,47,47,0.3)'; color = '#FF5252' }
              }
              return (
                <button key={opt} onClick={() => handleAnswer(opt)} style={{ width:'100%', padding:'16px', borderRadius:16, border:`1px solid ${feedback && opt===question.name ? 'rgba(76,175,80,0.5)' : 'rgba(255,255,255,0.08)'}`, background:bg, color, fontSize:15, fontWeight:800, fontFamily:'inherit', cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}>
                  {opt}
                </button>
              )
            })}
          </div>
        </>
      )}
    </main>
  )

  return (
    <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Flags in a row</div>
        <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2 }}>{score}</div>
        {worldRank && <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:8 }}>#{worldRank} in the world</div>}
      </div>


      {/* Championship Banner */}
     {champGame === 'flags' && (
       <a href="/championship" style={{ textDecoration:'none', display:'block', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', borderRadius:16, padding:'14px 18px', marginBottom:12, boxShadow:'0 4px 0 rgba(100,70,0,0.5)' }}>
         <div style={{ display:'flex', alignItems:'center', gap:10 }}>
           <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/winner.png" style={{ width:36, height:36, objectFit:'contain' }} />
           <div>
             <div style={{ fontSize:10, fontWeight:800, color:'rgba(0,0,0,0.5)', letterSpacing:2, textTransform:'uppercase' }}>Sunday Championship</div>
             <div style={{ fontSize:14, fontWeight:900, color:'#000' }}>This game is featured this Sunday →</div>
           </div>
         </div>
       </a>
     )}
      {saved && (
        <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:16, padding:'16px 20px', textAlign:'center' }}>
          <div style={{ fontSize:16, fontWeight:900, color:'#69F0AE' }}>✓ Score saved!</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:4 }}>#{worldRank} in the world</div>
        </div>
      )}

      <div style={{ display:'flex', gap:10, width:'100%' }}>
        <button onClick={reset} style={{ flex:1, padding:'16px', borderRadius:16, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
        <button onClick={()=>{setSaved(false);startGame()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E2080' }}>Play again →</button>
      </div>
    </main>
  )
}
