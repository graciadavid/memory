'use client'
import { useState, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

const COUNTRIES = [
 { name: 'China', code: 'cn', population: 1412000000, area: 9597000 },
 { name: 'India', code: 'in', population: 1380000000, area: 3287000 },
 { name: 'USA', code: 'us', population: 331000000, area: 9834000 },
 { name: 'Indonesia', code: 'id', population: 273000000, area: 1905000 },
 { name: 'Pakistan', code: 'pk', population: 220000000, area: 796000 },
 { name: 'Brazil', code: 'br', population: 214000000, area: 8516000 },
 { name: 'Nigeria', code: 'ng', population: 211000000, area: 924000 },
 { name: 'Bangladesh', code: 'bd', population: 166000000, area: 148000 },
 { name: 'Russia', code: 'ru', population: 144000000, area: 17098000 },
 { name: 'Ethiopia', code: 'et', population: 117000000, area: 1104000 },
 { name: 'Mexico', code: 'mx', population: 128000000, area: 1964000 },
 { name: 'Japan', code: 'jp', population: 125000000, area: 378000 },
 { name: 'Philippines', code: 'ph', population: 111000000, area: 300000 },
 { name: 'Egypt', code: 'eg', population: 102000000, area: 1002000 },
 { name: 'DR Congo', code: 'cd', population: 89000000, area: 2345000 },
 { name: 'Iran', code: 'ir', population: 84000000, area: 1649000 },
 { name: 'Turkey', code: 'tr', population: 84000000, area: 785000 },
 { name: 'Germany', code: 'de', population: 83000000, area: 357000 },
 { name: 'Thailand', code: 'th', population: 70000000, area: 513000 },
 { name: 'UK', code: 'gb', population: 67000000, area: 243000 },
 { name: 'France', code: 'fr', population: 67000000, area: 552000 },
 { name: 'Tanzania', code: 'tz', population: 63000000, area: 945000 },
 { name: 'South Africa', code: 'za', population: 60000000, area: 1220000 },
 { name: 'Myanmar', code: 'mm', population: 54000000, area: 677000 },
 { name: 'South Korea', code: 'kr', population: 52000000, area: 100000 },
 { name: 'Colombia', code: 'co', population: 51000000, area: 1142000 },
 { name: 'Kenya', code: 'ke', population: 54000000, area: 580000 },
 { name: 'Spain', code: 'es', population: 47000000, area: 506000 },
 { name: 'Ukraine', code: 'ua', population: 44000000, area: 604000 },
 { name: 'Algeria', code: 'dz', population: 44000000, area: 2382000 },
 { name: 'Argentina', code: 'ar', population: 45000000, area: 2780000 },
 { name: 'Sudan', code: 'sd', population: 43000000, area: 1886000 },
 { name: 'Canada', code: 'ca', population: 38000000, area: 9985000 },
 { name: 'Poland', code: 'pl', population: 38000000, area: 313000 },
 { name: 'Morocco', code: 'ma', population: 37000000, area: 447000 },
 { name: 'Saudi Arabia', code: 'sa', population: 35000000, area: 2150000 },
 { name: 'Peru', code: 'pe', population: 33000000, area: 1285000 },
 { name: 'Angola', code: 'ao', population: 32000000, area: 1247000 },
 { name: 'Venezuela', code: 've', population: 28000000, area: 912000 },
 { name: 'Malaysia', code: 'my', population: 32000000, area: 330000 },
 { name: 'Ghana', code: 'gh', population: 32000000, area: 239000 },
 { name: 'Australia', code: 'au', population: 26000000, area: 7692000 },
 { name: 'Cameroon', code: 'cm', population: 27000000, area: 475000 },
 { name: 'Romania', code: 'ro', population: 19000000, area: 238000 },
 { name: 'Chile', code: 'cl', population: 19000000, area: 756000 },
 { name: 'Netherlands', code: 'nl', population: 17000000, area: 42000 },
 { name: 'Ecuador', code: 'ec', population: 17000000, area: 284000 },
 { name: 'Kazakhstan', code: 'kz', population: 19000000, area: 2725000 },
 { name: 'Bolivia', code: 'bo', population: 12000000, area: 1099000 },
 { name: 'Belgium', code: 'be', population: 11000000, area: 31000 },
 { name: 'Sweden', code: 'se', population: 10000000, area: 450000 },
 { name: 'Portugal', code: 'pt', population: 10000000, area: 92000 },
 { name: 'Greece', code: 'gr', population: 11000000, area: 132000 },
 { name: 'Libya', code: 'ly', population: 7000000, area: 1760000 },
 { name: 'Israel', code: 'il', population: 9000000, area: 21000 },
 { name: 'Switzerland', code: 'ch', population: 9000000, area: 41000 },
 { name: 'Austria', code: 'at', population: 9000000, area: 84000 },
 { name: 'New Zealand', code: 'nz', population: 5000000, area: 268000 },
 { name: 'Norway', code: 'no', population: 5000000, area: 385000 },
 { name: 'Finland', code: 'fi', population: 5000000, area: 338000 },
 { name: 'Mongolia', code: 'mn', population: 3000000, area: 1564000 },
 { name: 'Namibia', code: 'na', population: 3000000, area: 824000 },
 { name: 'Iceland', code: 'is', population: 400000, area: 103000 },
 { name: 'Luxembourg', code: 'lu', population: 600000, area: 3000 },
 { name: 'Malta', code: 'mt', population: 500000, area: 316 },
 { name: 'Greenland', code: 'gl', population: 56000, area: 2166000 },
 { name: 'Qatar', code: 'qa', population: 3000000, area: 12000 },
 { name: 'Singapore', code: 'sg', population: 6000000, area: 728 },
 { name: 'Kuwait', code: 'kw', population: 4000000, area: 18000 },
 { name: 'Uruguay', code: 'uy', population: 3000000, area: 176000 },
 { name: 'Paraguay', code: 'py', population: 7000000, area: 407000 },
 { name: 'Costa Rica', code: 'cr', population: 5000000, area: 51000 },
 { name: 'Panama', code: 'pa', population: 4000000, area: 75000 },
 { name: 'Ireland', code: 'ie', population: 5000000, area: 70000 },
 { name: 'Croatia', code: 'hr', population: 4000000, area: 57000 },
 { name: 'Georgia', code: 'ge', population: 4000000, area: 70000 },
]

type Phase = 'rules' | 'playing' | 'result'

interface Props { category: 'population' | 'area' }

function shuffle<T>(arr: T[]): T[] {
 return [...arr].sort(() => Math.random() - 0.5)
}

function formatValue(n: number, cat: string): string {
 if (cat === 'population') {
   if (n >= 1000000000) return (n/1000000000).toFixed(1)+'B'
   if (n >= 1000000) return Math.round(n/1000000)+'M'
   return Math.round(n/1000)+'K'
 } else {
   if (n >= 1000000) return (n/1000000).toFixed(1)+'M km²'
   return Math.round(n/1000)+'K km²'
 }
}

export default function HigherOrLowerClient({ category }: Props) {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [level, setLevel] = useState(0)
 const [countryA, setCountryA] = useState<typeof COUNTRIES[0]|null>(null)
 const [countryB, setCountryB] = useState<typeof COUNTRIES[0]|null>(null)
 const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)
 const [revealed, setRevealed] = useState(false)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])

 const table = 'higher_lower_scores'
 const label = category === 'population' ? 'Population' : 'Area'
 const icon = category === 'population' ? 'population.png' : 'population.png'

 const loadData = useCallback(async () => {
   const { data } = await supabase.from(table).select('player_name, level').eq('category', category).order('level', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:l+' correct'})))
   if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
 }, [profile?.name, category])

 useState(() => { loadData() })

 const nextQuestion = useCallback((pool: typeof COUNTRIES, lvl: number) => {
   const shuffled = shuffle(pool)
   setCountryA(shuffled[0])
   setCountryB(shuffled[1])
   setFeedback(null)
   setRevealed(false)
 }, [])

 const startGame = () => {
   setLevel(0)
   setPhase('playing')
   setFeedback(null)
   setRevealed(false)
   window.dispatchEvent(new Event('gameStart'))
   nextQuestion(COUNTRIES, 0)
 }

 const endGame = useCallback(async (finalLevel: number) => {
   setPhase('result')
   window.dispatchEvent(new Event('gameResult'))
   const { count } = await supabase.from(table).select('player_name', { count: 'exact', head: true }).eq('category', category).gt('level', finalLevel)
   setWorldRank((count ?? 0) + 1)
   if (profile?.name && finalLevel > 0) await supabase.from(table).insert({ player_name: profile.name, level: finalLevel, category })
 }, [profile?.name, category])

 const handleAnswer = useCallback((choice: 'A' | 'B') => {
   if (feedback || !countryA || !countryB) return
   const valA = category === 'population' ? countryA.population : countryA.area
   const valB = category === 'population' ? countryB.population : countryB.area
   const correctChoice = valA >= valB ? 'A' : 'B'
   const isCorrect = choice === correctChoice
   setRevealed(true)
   setFeedback(isCorrect ? 'correct' : 'wrong')
   if (isCorrect) {
     const newLevel = level + 1
     setLevel(newLevel)
     setTimeout(() => nextQuestion(COUNTRIES, newLevel), 1200)
   } else {
     setTimeout(() => endGame(level), 1200)
   }
 }, [feedback, countryA, countryB, category, level, nextQuestion, endGame])

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen
     icon={icon}
     title={'Higher or Lower'}
     subtitle={category === 'population' ? 'Which country has more people?' : 'Which country has more area?'}
     worldRecord={worldRecord}
     myBest={myBest !== null ? myBest+' correct' : null}
     top5={top5}
     onPlay={startGame}
   />
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={level+' correct'}
     resultColor={level >= 20 ? '#00C853' : level >= 10 ? GOLD : '#D32F2F'}
     background={level >= 20 ? '#0D3320' : level >= 10 ? '#2D1A00' : '#1A0000'}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   />
 )

 const valA = countryA ? (category === 'population' ? countryA.population : countryA.area) : 0
 const valB = countryB ? (category === 'population' ? countryB.population : countryB.area) : 0

 return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
       <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{level}</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>{label.toUpperCase()}</div>
       <div style={{ width:40 }} />
     </div>

     <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12, padding:'8px 16px 80px' }}>
       {[{ country: countryA, val: valA, choice: 'A' as const }, { country: countryB, val: valB, choice: 'B' as const }].map(({ country, val, choice }) => (
         <button key={choice} onClick={() => handleAnswer(choice)}
           style={{ flex:1, borderRadius:20, border:'none', cursor: feedback ? 'default' : 'pointer', fontFamily:'inherit',
             background: feedback === 'correct' && (choice === (valA >= valB ? 'A' : 'B')) ? '#2E7D32' :
                        feedback === 'wrong' && (choice === (valA >= valB ? 'B' : 'A')) ? '#2E7D32' :
                        feedback && choice !== (valA >= valB ? 'A' : 'B') && feedback === 'wrong' ? '#D32F2F' : '#252525',
             display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, padding:20,
             boxShadow: !feedback ? '0 4px 0 rgba(0,0,0,0.3)' : 'none', transition:'all 0.3s'
           }}>
           {country && (
             <>
               <img src={'https://flagcdn.com/w160/'+country.code+'.png'} style={{ width:120, height:'auto', borderRadius:6, boxShadow:'0 2px 8px rgba(0,0,0,0.4)' }} />
               <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>{country.name}</div>
               {revealed && <div style={{ fontSize:18, fontWeight:800, color:GOLD }}>{formatValue(val, category)}</div>}
               {!revealed && <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.3)' }}>Tap to choose</div>}
             </>
           )}
         </button>
       ))}
     </div>
   </main>
 )
}
