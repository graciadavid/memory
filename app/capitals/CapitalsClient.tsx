'use client'
import { useState, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import AuthModal from '@/components/AuthModal'
import { supabase } from '@/lib/supabase'
import { updateStreak } from '@/lib/streak'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const COUNTRIES: {name:string, capital:string, code:string}[] = [
  {name:'Afghanistan',capital:'Kabul',code:'af'},{name:'Albania',capital:'Tirana',code:'al'},
  {name:'Algeria',capital:'Algiers',code:'dz'},{name:'Argentina',capital:'Buenos Aires',code:'ar'},
  {name:'Armenia',capital:'Yerevan',code:'am'},{name:'Australia',capital:'Canberra',code:'au'},
  {name:'Austria',capital:'Vienna',code:'at'},{name:'Azerbaijan',capital:'Baku',code:'az'},
  {name:'Bahrain',capital:'Manama',code:'bh'},{name:'Bangladesh',capital:'Dhaka',code:'bd'},
  {name:'Belarus',capital:'Minsk',code:'by'},{name:'Belgium',capital:'Brussels',code:'be'},
  {name:'Bolivia',capital:'Sucre',code:'bo'},{name:'Bosnia',capital:'Sarajevo',code:'ba'},
  {name:'Brazil',capital:'Brasília',code:'br'},{name:'Bulgaria',capital:'Sofia',code:'bg'},
  {name:'Cambodia',capital:'Phnom Penh',code:'kh'},{name:'Cameroon',capital:'Yaoundé',code:'cm'},
  {name:'Canada',capital:'Ottawa',code:'ca'},{name:'Chile',capital:'Santiago',code:'cl'},
  {name:'China',capital:'Beijing',code:'cn'},{name:'Colombia',capital:'Bogotá',code:'co'},
  {name:'Croatia',capital:'Zagreb',code:'hr'},{name:'Cuba',capital:'Havana',code:'cu'},
  {name:'Czech Republic',capital:'Prague',code:'cz'},{name:'Denmark',capital:'Copenhagen',code:'dk'},
  {name:'Dominican Republic',capital:'Santo Domingo',code:'do'},{name:'Ecuador',capital:'Quito',code:'ec'},
  {name:'Egypt',capital:'Cairo',code:'eg'},{name:'Estonia',capital:'Tallinn',code:'ee'},
  {name:'Ethiopia',capital:'Addis Ababa',code:'et'},{name:'Finland',capital:'Helsinki',code:'fi'},
  {name:'France',capital:'Paris',code:'fr'},{name:'Georgia',capital:'Tbilisi',code:'ge'},
  {name:'Germany',capital:'Berlin',code:'de'},{name:'Ghana',capital:'Accra',code:'gh'},
  {name:'Greece',capital:'Athens',code:'gr'},{name:'Guatemala',capital:'Guatemala City',code:'gt'},
  {name:'Hungary',capital:'Budapest',code:'hu'},{name:'Iceland',capital:'Reykjavik',code:'is'},
  {name:'India',capital:'New Delhi',code:'in'},{name:'Indonesia',capital:'Jakarta',code:'id'},
  {name:'Iran',capital:'Tehran',code:'ir'},{name:'Iraq',capital:'Baghdad',code:'iq'},
  {name:'Ireland',capital:'Dublin',code:'ie'},{name:'Israel',capital:'Jerusalem',code:'il'},
  {name:'Italy',capital:'Rome',code:'it'},{name:'Jamaica',capital:'Kingston',code:'jm'},
  {name:'Japan',capital:'Tokyo',code:'jp'},{name:'Jordan',capital:'Amman',code:'jo'},
  {name:'Kazakhstan',capital:'Astana',code:'kz'},{name:'Kenya',capital:'Nairobi',code:'ke'},
  {name:'Kosovo',capital:'Pristina',code:'xk'},{name:'Kuwait',capital:'Kuwait City',code:'kw'},
  {name:'Latvia',capital:'Riga',code:'lv'},{name:'Lebanon',capital:'Beirut',code:'lb'},
  {name:'Libya',capital:'Tripoli',code:'ly'},{name:'Lithuania',capital:'Vilnius',code:'lt'},
  {name:'Luxembourg',capital:'Luxembourg City',code:'lu'},{name:'Malaysia',capital:'Kuala Lumpur',code:'my'},
  {name:'Malta',capital:'Valletta',code:'mt'},{name:'Mexico',capital:'Mexico City',code:'mx'},
  {name:'Moldova',capital:'Chișinău',code:'md'},{name:'Mongolia',capital:'Ulaanbaatar',code:'mn'},
  {name:'Montenegro',capital:'Podgorica',code:'me'},{name:'Morocco',capital:'Rabat',code:'ma'},
  {name:'Mozambique',capital:'Maputo',code:'mz'},{name:'Myanmar',capital:'Naypyidaw',code:'mm'},
  {name:'Nepal',capital:'Kathmandu',code:'np'},{name:'Netherlands',capital:'Amsterdam',code:'nl'},
  {name:'New Zealand',capital:'Wellington',code:'nz'},{name:'Nicaragua',capital:'Managua',code:'ni'},
  {name:'Nigeria',capital:'Abuja',code:'ng'},{name:'North Korea',capital:'Pyongyang',code:'kp'},
  {name:'North Macedonia',capital:'Skopje',code:'mk'},{name:'Norway',capital:'Oslo',code:'no'},
  {name:'Oman',capital:'Muscat',code:'om'},{name:'Pakistan',capital:'Islamabad',code:'pk'},
  {name:'Panama',capital:'Panama City',code:'pa'},{name:'Paraguay',capital:'Asunción',code:'py'},
  {name:'Peru',capital:'Lima',code:'pe'},{name:'Philippines',capital:'Manila',code:'ph'},
  {name:'Poland',capital:'Warsaw',code:'pl'},{name:'Portugal',capital:'Lisbon',code:'pt'},
  {name:'Qatar',capital:'Doha',code:'qa'},{name:'Romania',capital:'Bucharest',code:'ro'},
  {name:'Russia',capital:'Moscow',code:'ru'},{name:'Saudi Arabia',capital:'Riyadh',code:'sa'},
  {name:'Senegal',capital:'Dakar',code:'sn'},{name:'Serbia',capital:'Belgrade',code:'rs'},
  {name:'Singapore',capital:'Singapore',code:'sg'},{name:'Slovakia',capital:'Bratislava',code:'sk'},
  {name:'Slovenia',capital:'Ljubljana',code:'si'},{name:'Somalia',capital:'Mogadishu',code:'so'},
  {name:'South Africa',capital:'Pretoria',code:'za'},{name:'South Korea',capital:'Seoul',code:'kr'},
  {name:'Spain',capital:'Madrid',code:'es'},{name:'Sri Lanka',capital:'Sri Jayawardenepura Kotte',code:'lk'},
  {name:'Sudan',capital:'Khartoum',code:'sd'},{name:'Sweden',capital:'Stockholm',code:'se'},
  {name:'Switzerland',capital:'Bern',code:'ch'},{name:'Syria',capital:'Damascus',code:'sy'},
  {name:'Taiwan',capital:'Taipei',code:'tw'},{name:'Tanzania',capital:'Dodoma',code:'tz'},
  {name:'Thailand',capital:'Bangkok',code:'th'},{name:'Tunisia',capital:'Tunis',code:'tn'},
  {name:'Turkey',capital:'Ankara',code:'tr'},{name:'Uganda',capital:'Kampala',code:'ug'},
  {name:'Ukraine',capital:'Kyiv',code:'ua'},{name:'UAE',capital:'Abu Dhabi',code:'ae'},
  {name:'United Kingdom',capital:'London',code:'gb'},{name:'United States',capital:'Washington D.C.',code:'us'},
  {name:'Uruguay',capital:'Montevideo',code:'uy'},{name:'Uzbekistan',capital:'Tashkent',code:'uz'},
  {name:'Venezuela',capital:'Caracas',code:'ve'},{name:'Vietnam',capital:'Hanoi',code:'vn'},
  {name:'Yemen',capital:'Sanaa',code:'ye'},{name:'Zambia',capital:'Lusaka',code:'zm'},
  {name:'Zimbabwe',capital:'Harare',code:'zw'},
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function getOptions(correct: string, all: {capital:string}[]): string[] {
  const others = shuffle(all.filter(c => c.capital !== correct)).slice(0, 3).map(c => c.capital)
  return shuffle([correct, ...others])
}

type Phase = 'rules' | 'playing' | 'result'

export default function CapitalsClient() {
  const { profile, createProfile } = usePlayer()
 const [champGame, setChampGame] = useState<string|null>(null)
 useEffect(() => {
   supabase.from('championship_weeks').select('game').eq('active', true).single()
     .then(({data}:any) => { if (data?.game) setChampGame(data.game) })
 }, [])
  const [phase, setPhase] = useState<Phase>('rules')
  const [current, setCurrent] = useState<{name:string,capital:string,code:string}|null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string|null>(null)
  const [correct, setCorrect] = useState<boolean|null>(null)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [worldRecord, setWorldRecord] = useState<{level:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,level:number}[]>([])
  const [saveName, setSaveName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [usedIndices, setUsedIndices] = useState<number[]>([])

  useEffect(() => {
    if (profile?.name) setSaveName(profile.name)
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('capitals_scores').select('player_name,level').order('level', { ascending: false }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
    const sorted = Object.entries(best).map(([n,l]) => ({name:n, level:l as number})).sort((a,b) => b.level-a.level)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({level:sorted[0].level, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
  }

  const nextQuestion = (currentScore: number, used: number[]) => {
    const available = COUNTRIES.map((_,i) => i).filter(i => !used.includes(i))
    const pool = available.length > 0 ? available : COUNTRIES.map((_,i) => i)
    const idx = pool[Math.floor(Math.random() * pool.length)]
    const country = COUNTRIES[idx]
    setCurrent(country)
    setOptions(getOptions(country.capital, COUNTRIES))
    setSelected(null)
    setCorrect(null)
    setUsedIndices(prev => [...prev, idx])
  }

  const startGame = () => {
    setScore(0)
    setUsedIndices([])
    setSaved(false)
    setWorldRank(null)
    setPhase('playing')
    nextQuestion(0, [])
  }

  const handleAnswer = async (option: string) => {
    if (selected) return
    setSelected(option)
    const isCorrect = option === current?.capital
    setCorrect(isCorrect)

    if (isCorrect) {
      const newScore = score + 1
      setScore(newScore)
      setTimeout(() => nextQuestion(newScore, usedIndices), 800)
    } else {
      // Game over
      setTimeout(async () => {
        setPhase('result')
        if (profile?.name && score > 0) {
          await supabase.from('capitals_scores').insert({player_name:profile.name, level:score})
          const {count} = await supabase.from('capitals_scores').select('*',{count:'exact',head:true}).gt('level',score)
          setWorldRank((count??0)+1)
          if (myBest===null || score>myBest) setMyBest(score)
          await updateStreak(profile.name)
        } else if (score === 0) {
          setPhase('result')
        }
      }, 1200)
    }
  }

  const saveScore = async () => {
    if (!saveName.trim() || pin.join('').length!==4) return
    setSaving(true); setSaveError('')
    const pinHash = btoa(pin.join(''))
    const {data:existing} = await supabase.from('profiles').select('password_hash').eq('player_name',saveName.trim()).maybeSingle()
    if (existing) {
      if (existing.password_hash !== pinHash) { setSaveError('Wrong PIN'); setSaving(false); return }
    } else {
      await supabase.from('profiles').insert({player_name:saveName.trim(), password_hash:pinHash})
    }
    await supabase.from('capitals_scores').insert({player_name:saveName.trim(), level:score})
    const {count} = await supabase.from('capitals_scores').select('*',{count:'exact',head:true}).gt('level',score)
    setWorldRank((count??0)+1)
    setSaving(false); setSaved(true)
    createProfile(saveName.trim())
    setTimeout(() => window.location.reload(), 1500)
  }

  const reset = () => { setPhase('rules'); setSaved(false); loadData() }

  // Rules screen
  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <img src={`${BASE}/capitals.png`} style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Capitals</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Name the capital city</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${worldRecord.level}` : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest ?? '—'}</div>
        </div>
      </div>

      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.level} correct</div>
          </div>
        ))}
      </div>

      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080', marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  // Playing screen
  if (phase === 'playing' && current) return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'16px 20px 80px', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <button onClick={reset} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{score}</div>
        <div style={{ width:50 }} />
      </div>

      {/* Country */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:32 }}>
        <img
          src={`https://flagcdn.com/w320/${current.code}.png`}
          style={{ width:160, height:100, objectFit:'cover', borderRadius:12, marginBottom:16, boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}
        />
        <div style={{ fontSize:26, fontWeight:900, color:'#fff' }}>{current.name}</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:4 }}>What is the capital?</div>
      </div>

      {/* Options */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {options.map(opt => {
          const isSelected = selected === opt
          const isCorrectOpt = opt === current.capital
          let bg = 'rgba(255,255,255,0.06)'
          let border = '1px solid rgba(255,255,255,0.08)'
          let color = '#fff'
          if (selected) {
            if (isCorrectOpt) { bg = 'rgba(46,125,50,0.4)'; border = '1px solid #4CAF50'; color = '#69F0AE' }
            else if (isSelected) { bg = 'rgba(198,40,40,0.4)'; border = '1px solid #EF5350'; color = '#FF5252' }
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)} style={{
              width:'100%', padding:'18px', borderRadius:16, border,
              background: bg, color, fontSize:16, fontWeight:800,
              fontFamily:'inherit', cursor: selected ? 'default' : 'pointer',
              transition:'all 0.2s', textAlign:'left',
            }}>{opt}</button>
          )
        })}
      </div>
    </main>
  )

  // Result screen
  const bgResult = '#1A0000'
  return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px' }}>
      <div style={{ background:bgResult, borderRadius:24, padding:'28px', width:'100%', border:'1px solid rgba(255,255,255,0.08)', textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🌍</div>
        <div style={{ fontSize:22, fontWeight:900, color:'#FF5252', marginBottom:4 }}>Game Over</div>
        <div style={{ fontSize:42, fontWeight:900, color:'#fff', marginBottom:4 }}>{score}</div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:16 }}>capitals correct</div>
        {current && <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:16 }}>The capital of <strong style={{color:'#fff'}}>{current.name}</strong> is <strong style={{color:GOLD}}>{current.capital}</strong></div>}
        {worldRank && <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:16 }}>#{worldRank} in the world</div>}

        {!profile?.name && !saved && score > 0 && (
          <AuthModal onSuccess={async (playerName) => {
            await supabase.from('capitals_scores').insert({player_name: playerName, level: score})
            setSaved(true)
          }} title="Save your result" subtitle="Free · No email needed" />
        )}
        {saved && <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:10, padding:'8px', marginBottom:16 }}><div style={{ fontSize:13, fontWeight:900, color:'#69F0AE' }}>✓ Saved!</div></div>}

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={reset} style={{ flex:1, padding:'14px', borderRadius:14, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
          <button onClick={startGame} style={{ flex:2, padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E2080' }}>Play again →</button>
        </div>
      </div>
    </main>
  )
}
