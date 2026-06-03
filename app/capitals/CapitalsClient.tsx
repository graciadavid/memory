'use client'
import { useState, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

const COUNTRIES = [
 { name: 'Spain', capital: 'Madrid', code: 'es' },
 { name: 'France', capital: 'Paris', code: 'fr' },
 { name: 'Germany', capital: 'Berlin', code: 'de' },
 { name: 'Italy', capital: 'Rome', code: 'it' },
 { name: 'Portugal', capital: 'Lisbon', code: 'pt' },
 { name: 'United Kingdom', capital: 'London', code: 'gb' },
 { name: 'Netherlands', capital: 'Amsterdam', code: 'nl' },
 { name: 'Belgium', capital: 'Brussels', code: 'be' },
 { name: 'Switzerland', capital: 'Bern', code: 'ch' },
 { name: 'Austria', capital: 'Vienna', code: 'at' },
 { name: 'Sweden', capital: 'Stockholm', code: 'se' },
 { name: 'Norway', capital: 'Oslo', code: 'no' },
 { name: 'Denmark', capital: 'Copenhagen', code: 'dk' },
 { name: 'Finland', capital: 'Helsinki', code: 'fi' },
 { name: 'Poland', capital: 'Warsaw', code: 'pl' },
 { name: 'Czech Republic', capital: 'Prague', code: 'cz' },
 { name: 'Hungary', capital: 'Budapest', code: 'hu' },
 { name: 'Romania', capital: 'Bucharest', code: 'ro' },
 { name: 'Greece', capital: 'Athens', code: 'gr' },
 { name: 'Turkey', capital: 'Ankara', code: 'tr' },
 { name: 'Ukraine', capital: 'Kyiv', code: 'ua' },
 { name: 'Russia', capital: 'Moscow', code: 'ru' },
 { name: 'USA', capital: 'Washington D.C.', code: 'us' },
 { name: 'Canada', capital: 'Ottawa', code: 'ca' },
 { name: 'Mexico', capital: 'Mexico City', code: 'mx' },
 { name: 'Brazil', capital: 'Brasilia', code: 'br' },
 { name: 'Argentina', capital: 'Buenos Aires', code: 'ar' },
 { name: 'Colombia', capital: 'Bogota', code: 'co' },
 { name: 'Chile', capital: 'Santiago', code: 'cl' },
 { name: 'Peru', capital: 'Lima', code: 'pe' },
 { name: 'Venezuela', capital: 'Caracas', code: 've' },
 { name: 'Ecuador', capital: 'Quito', code: 'ec' },
 { name: 'Bolivia', capital: 'Sucre', code: 'bo' },
 { name: 'Uruguay', capital: 'Montevideo', code: 'uy' },
 { name: 'Paraguay', capital: 'Asuncion', code: 'py' },
 { name: 'Cuba', capital: 'Havana', code: 'cu' },
 { name: 'Japan', capital: 'Tokyo', code: 'jp' },
 { name: 'China', capital: 'Beijing', code: 'cn' },
 { name: 'South Korea', capital: 'Seoul', code: 'kr' },
 { name: 'India', capital: 'New Delhi', code: 'in' },
 { name: 'Indonesia', capital: 'Jakarta', code: 'id' },
 { name: 'Thailand', capital: 'Bangkok', code: 'th' },
 { name: 'Vietnam', capital: 'Hanoi', code: 'vn' },
 { name: 'Philippines', capital: 'Manila', code: 'ph' },
 { name: 'Malaysia', capital: 'Kuala Lumpur', code: 'my' },
 { name: 'Singapore', capital: 'Singapore', code: 'sg' },
 { name: 'Pakistan', capital: 'Islamabad', code: 'pk' },
 { name: 'Bangladesh', capital: 'Dhaka', code: 'bd' },
 { name: 'Saudi Arabia', capital: 'Riyadh', code: 'sa' },
 { name: 'UAE', capital: 'Abu Dhabi', code: 'ae' },
 { name: 'Israel', capital: 'Jerusalem', code: 'il' },
 { name: 'Iran', capital: 'Tehran', code: 'ir' },
 { name: 'Egypt', capital: 'Cairo', code: 'eg' },
 { name: 'Nigeria', capital: 'Abuja', code: 'ng' },
 { name: 'South Africa', capital: 'Pretoria', code: 'za' },
 { name: 'Kenya', capital: 'Nairobi', code: 'ke' },
 { name: 'Ethiopia', capital: 'Addis Ababa', code: 'et' },
 { name: 'Ghana', capital: 'Accra', code: 'gh' },
 { name: 'Morocco', capital: 'Rabat', code: 'ma' },
 { name: 'Algeria', capital: 'Algiers', code: 'dz' },
 { name: 'Australia', capital: 'Canberra', code: 'au' },
 { name: 'New Zealand', capital: 'Wellington', code: 'nz' },
 { name: 'Ireland', capital: 'Dublin', code: 'ie' },
 { name: 'Croatia', capital: 'Zagreb', code: 'hr' },
 { name: 'Serbia', capital: 'Belgrade', code: 'rs' },
 { name: 'Slovakia', capital: 'Bratislava', code: 'sk' },
 { name: 'Bulgaria', capital: 'Sofia', code: 'bg' },
 { name: 'Iceland', capital: 'Reykjavik', code: 'is' },
 { name: 'Jordan', capital: 'Amman', code: 'jo' },
 { name: 'Lebanon', capital: 'Beirut', code: 'lb' },
 { name: 'Kuwait', capital: 'Kuwait City', code: 'kw' },
 { name: 'Qatar', capital: 'Doha', code: 'qa' },
 { name: 'Nepal', capital: 'Kathmandu', code: 'np' },
 { name: 'Sri Lanka', capital: 'Colombo', code: 'lk' },
 { name: 'Myanmar', capital: 'Naypyidaw', code: 'mm' },
 { name: 'Cambodia', capital: 'Phnom Penh', code: 'kh' },
 { name: 'Mongolia', capital: 'Ulaanbaatar', code: 'mn' },
 { name: 'Kazakhstan', capital: 'Astana', code: 'kz' },
 { name: 'Georgia', capital: 'Tbilisi', code: 'ge' },
 { name: 'Armenia', capital: 'Yerevan', code: 'am' },
 { name: 'Tanzania', capital: 'Dodoma', code: 'tz' },
 { name: 'Uganda', capital: 'Kampala', code: 'ug' },
 { name: 'Senegal', capital: 'Dakar', code: 'sn' },
 { name: 'Guatemala', capital: 'Guatemala City', code: 'gt' },
 { name: 'Costa Rica', capital: 'San Jose', code: 'cr' },
 { name: 'Panama', capital: 'Panama City', code: 'pa' },
 { name: 'Dominican Republic', capital: 'Santo Domingo', code: 'do' },
 { name: 'Jamaica', capital: 'Kingston', code: 'jm' },
 { name: 'Albania', capital: 'Tirana', code: 'al' },
 { name: 'Slovenia', capital: 'Ljubljana', code: 'si' },
 { name: 'Lithuania', capital: 'Vilnius', code: 'lt' },
 { name: 'Latvia', capital: 'Riga', code: 'lv' },
 { name: 'Estonia', capital: 'Tallinn', code: 'ee' },
 { name: 'Luxembourg', capital: 'Luxembourg City', code: 'lu' },
 { name: 'Malta', capital: 'Valletta', code: 'mt' },
 { name: 'Cyprus', capital: 'Nicosia', code: 'cy' },
 { name: 'Moldova', capital: 'Chisinau', code: 'md' },
 { name: 'Belarus', capital: 'Minsk', code: 'by' },
 { name: 'Taiwan', capital: 'Taipei', code: 'tw' },
 { name: 'Laos', capital: 'Vientiane', code: 'la' },
]

function shuffle<T>(arr: T[]): T[] {
 return [...arr].sort(() => Math.random() - 0.5)
}

function getOptions(correct: typeof COUNTRIES[0], all: typeof COUNTRIES) {
 const others = shuffle(all.filter(c => c.code !== correct.code)).slice(0, 3)
 return shuffle([correct, ...others])
}

type Phase = 'rules' | 'playing' | 'result'

export default function CapitalsClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [level, setLevel] = useState(0)
 const [current, setCurrent] = useState<typeof COUNTRIES[0]|null>(null)
 const [options, setOptions] = useState<typeof COUNTRIES>([])
 const [feedback, setFeedback] = useState<string|null>(null)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])
 const [pool, setPool] = useState<typeof COUNTRIES>([])

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('capitals_scores').select('player_name, level').order('level', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:l+' capitals'})))
   const stored = typeof window !== 'undefined' ? localStorage.getItem('memgenius_profile') : null
    const pName = stored ? JSON.parse(stored).name : null
    if (pName && best[pName] !== undefined) setMyBest(best[pName])
 }, [profile?.name])

 useState(() => { loadData() })

 const nextQuestion = useCallback((currentPool: typeof COUNTRIES, currentLevel: number) => {
   if (currentPool.length === 0) { endGame(currentLevel); return }
   const idx = Math.floor(Math.random() * currentPool.length)
   const country = currentPool[idx]
   const newPool = currentPool.filter((_, i) => i !== idx)
   setPool(newPool)
   setCurrent(country)
   setOptions(getOptions(country, COUNTRIES))
   setFeedback(null)
 }, [])

 const endGame = useCallback(async (finalLevel: number) => {
   setPhase('result')
   window.dispatchEvent(new Event('gameResult'))
   const { count } = await supabase.from('capitals_scores').select('player_name', { count: 'exact', head: true }).gt('level', finalLevel)
   setWorldRank((count ?? 0) + 1)
   if (profile?.name && finalLevel > 0) { await supabase.from("capitals_scores").insert({ player_name: profile.name, level: finalLevel }); supabase.rpc("update_streak", { p_player_name: profile.name }) }
  }, [profile?.name])

 const startGame = () => {
   const shuffled = shuffle(COUNTRIES)
   setLevel(0)
   setPhase('playing')
   setFeedback(null)
   window.dispatchEvent(new Event('gameStart'))
   nextQuestion(shuffled, 0)
   setPool(shuffled)
 }

 const handleAnswer = useCallback((country: typeof COUNTRIES[0]) => {
   if (feedback) return
   if (country.capital === current?.capital) {
     setFeedback('correct')
     const newLevel = level + 1
     setLevel(newLevel)
     setTimeout(() => nextQuestion(pool, newLevel), 600)
   } else {
     setFeedback(country.code)
     setTimeout(() => endGame(level), 1000)
   }
 }, [feedback, current, level, pool, nextQuestion, endGame])

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen icon="capitals.png" title="Capitals" subtitle="What is the capital of this country?" worldRecord={worldRecord} myBest={myBest !== null ? myBest+' capitals' : null} top5={top5} onPlay={startGame} />
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={level+' capitals'}
     resultColor={level >= 30 ? '#00C853' : level >= 15 ? GOLD : '#D32F2F'}
     background={level >= 30 ? '#0D3320' : level >= 15 ? '#2D1A00' : '#1A0000'}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   />
 )

 return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
       <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{level}</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>CAPITALS</div>
       <div style={{ width:40 }} />
     </div>

     <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, padding:'0 24px 80px' }}>
       {current && (
         <div style={{ textAlign:'center' }}>
           <img src={'https://flagcdn.com/w160/'+current.code+'.png'} style={{ width:120, height:'auto', borderRadius:6, marginBottom:12, boxShadow:'0 4px 16px rgba(0,0,0,0.4)' }} />
           <div style={{ fontSize:24, fontWeight:900, color:'#fff' }}>{current.name}</div>
         </div>
       )}

       <div style={{ display:'flex', flexDirection:'column', gap:10, width:'100%' }}>
         {options.map(opt => {
           const isCorrect = opt.capital === current?.capital
           const isWrong = feedback === opt.code
           const showCorrect = feedback && isCorrect
           return (
             <button key={opt.code} onClick={() => handleAnswer(opt)}
               style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', fontFamily:'inherit', fontSize:16, fontWeight:800, cursor:'pointer', transition:'all 0.2s',
                 background: showCorrect ? GREEN : isWrong ? '#D32F2F' : '#252525',
                 color: showCorrect || isWrong ? '#fff' : 'rgba(255,255,255,0.8)',
                 boxShadow: showCorrect ? '0 4px 0 #1B5E20' : 'none',
               }}>
               {opt.capital}
             </button>
           )
         })}
       </div>
     </div>
   </main>
 )
}
