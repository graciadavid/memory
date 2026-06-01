'use client'
import { useState, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

const COUNTRIES = [
 { name: 'Spain', code: 'es' }, { name: 'France', code: 'fr' }, { name: 'Germany', code: 'de' },
 { name: 'Italy', code: 'it' }, { name: 'Portugal', code: 'pt' }, { name: 'United Kingdom', code: 'gb' },
 { name: 'Netherlands', code: 'nl' }, { name: 'Belgium', code: 'be' }, { name: 'Switzerland', code: 'ch' },
 { name: 'Austria', code: 'at' }, { name: 'Sweden', code: 'se' }, { name: 'Norway', code: 'no' },
 { name: 'Denmark', code: 'dk' }, { name: 'Finland', code: 'fi' }, { name: 'Poland', code: 'pl' },
 { name: 'Czech Republic', code: 'cz' }, { name: 'Hungary', code: 'hu' }, { name: 'Romania', code: 'ro' },
 { name: 'Greece', code: 'gr' }, { name: 'Turkey', code: 'tr' }, { name: 'Ukraine', code: 'ua' },
 { name: 'Russia', code: 'ru' }, { name: 'USA', code: 'us' }, { name: 'Canada', code: 'ca' },
 { name: 'Mexico', code: 'mx' }, { name: 'Brazil', code: 'br' }, { name: 'Argentina', code: 'ar' },
 { name: 'Colombia', code: 'co' }, { name: 'Chile', code: 'cl' }, { name: 'Peru', code: 'pe' },
 { name: 'Japan', code: 'jp' }, { name: 'China', code: 'cn' }, { name: 'South Korea', code: 'kr' },
 { name: 'India', code: 'in' }, { name: 'Indonesia', code: 'id' }, { name: 'Thailand', code: 'th' },
 { name: 'Vietnam', code: 'vn' }, { name: 'Philippines', code: 'ph' }, { name: 'Malaysia', code: 'my' },
 { name: 'Pakistan', code: 'pk' }, { name: 'Saudi Arabia', code: 'sa' }, { name: 'Iran', code: 'ir' },
 { name: 'Egypt', code: 'eg' }, { name: 'Nigeria', code: 'ng' }, { name: 'South Africa', code: 'za' },
 { name: 'Kenya', code: 'ke' }, { name: 'Morocco', code: 'ma' }, { name: 'Algeria', code: 'dz' },
 { name: 'Australia', code: 'au' }, { name: 'New Zealand', code: 'nz' }, { name: 'Ireland', code: 'ie' },
 { name: 'Iceland', code: 'is' }, { name: 'Cuba', code: 'cu' }, { name: 'Bolivia', code: 'bo' },
 { name: 'Venezuela', code: 've' }, { name: 'Ecuador', code: 'ec' }, { name: 'Uruguay', code: 'uy' },
 { name: 'Paraguay', code: 'py' }, { name: 'Mongolia', code: 'mn' }, { name: 'Kazakhstan', code: 'kz' },
 { name: 'Libya', code: 'ly' }, { name: 'Sudan', code: 'sd' }, { name: 'Angola', code: 'ao' },
 { name: 'Mozambique', code: 'mz' }, { name: 'Tanzania', code: 'tz' }, { name: 'Ethiopia', code: 'et' },
 { name: 'Zambia', code: 'zm' }, { name: 'Zimbabwe', code: 'zw' }, { name: 'Ghana', code: 'gh' },
 { name: 'Cameroon', code: 'cm' }, { name: 'Senegal', code: 'sn' }, { name: 'Myanmar', code: 'mm' },
 { name: 'Cambodia', code: 'kh' }, { name: 'Nepal', code: 'np' }, { name: 'Sri Lanka', code: 'lk' },
 { name: 'Iraq', code: 'iq' }, { name: 'Jordan', code: 'jo' }, { name: 'Georgia', code: 'ge' },
]

function shuffle<T>(arr: T[]): T[] {
 return [...arr].sort(() => Math.random() - 0.5)
}

function getOptions(correct: typeof COUNTRIES[0], all: typeof COUNTRIES) {
 const others = shuffle(all.filter(c => c.code !== correct.code)).slice(0, 3)
 return shuffle([correct, ...others])
}

type Phase = 'rules' | 'playing' | 'result'

export default function CountriesClient() {
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
   const { data } = await supabase.from('shape_scores').select('player_name, level').order('level', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:l+' countries'})))
   if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
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
   const { count } = await supabase.from('shape_scores').select('player_name', { count: 'exact', head: true }).gt('level', finalLevel)
   setWorldRank((count ?? 0) + 1)
   if (profile?.name && finalLevel > 0) await supabase.from('shape_scores').insert({ player_name: profile.name, level: finalLevel })
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
   if (country.code === current?.code) {
     setFeedback('correct')
     const newLevel = level + 1
     setLevel(newLevel)
     setTimeout(() => nextQuestion(pool, newLevel), 700)
   } else {
     setFeedback(country.code)
     setTimeout(() => endGame(level), 1000)
   }
 }, [feedback, current, level, pool, nextQuestion, endGame])

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen icon="mapamundi.png" title="Countries" subtitle="Identify the country by its shape" worldRecord={worldRecord} myBest={myBest !== null ? myBest+' countries' : null} top5={top5} onPlay={startGame} />
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={level+' countries'}
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
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>COUNTRIES</div>
       <div style={{ width:40 }} />
     </div>

     <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:'0 24px 80px' }}>
       {current && (
         <div style={{ width:220, height:180, display:'flex', alignItems:'center', justifyContent:'center', background:'#252525', borderRadius:16, padding:16 }}>
           <img
             src={'https://raw.githubusercontent.com/djaiss/mapsicon/master/all/'+current.code+'/vector.svg'}
             style={{ width:'100%', height:'100%', objectFit:'contain', filter:'invert(1)' }}
           />
         </div>
       )}

       <div style={{ display:'flex', flexDirection:'column', gap:10, width:'100%' }}>
         {options.map(opt => {
           const isCorrect = opt.code === current?.code
           const isWrong = feedback === opt.code
           const showCorrect = feedback && isCorrect
           return (
             <button key={opt.code} onClick={() => handleAnswer(opt)}
               style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', fontFamily:'inherit', fontSize:16, fontWeight:800, cursor:'pointer', transition:'all 0.2s',
                 background: showCorrect ? GREEN : isWrong ? '#D32F2F' : '#252525',
                 color: showCorrect || isWrong ? '#fff' : 'rgba(255,255,255,0.8)',
                 boxShadow: showCorrect ? '0 4px 0 #1B5E20' : 'none',
               }}>
               {opt.name}
             </button>
           )
         })}
       </div>
     </div>
   </main>
 )
}
