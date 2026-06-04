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
]

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

function getPercentile(level: number, birthYear: number): number {
 const age = new Date().getFullYear() - birthYear
 const median = age <= 25 ? 8 : age <= 35 ? 6 : age <= 50 ? 5 : 4
 const map: Record<number, number> = { 1:20, 2:30, 3:40, 4:50, 5:60, 6:68, 7:75, 8:81, 9:86, 10:90, 11:93, 12:95, 13:97, 14:98, 15:99 }
 return map[Math.min(level, 15)] || 10
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
     <div style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:4 }}>Knowledge Test</div>
     <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>How many flags can you identify?</div>

     {phase === 'intro' && (
       <>
         <div style={{ background:'#252525', borderRadius:16, padding:'20px', marginBottom:20, textAlign:'center' }}>
           <div style={{ fontSize:48, marginBottom:12 }}>🏳️🌍🏴</div>
           <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>
             Identify flags from around the world. One wrong answer and the test ends. How many can you get in a row?
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
         <div style={{ textAlign:'center', marginBottom:20 }}>
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
             if (feedback && opt.code === current.code) bg = GREEN
             else if (feedback === 'wrong' && opt.code !== current.code) bg = '#252525'
             return (
               <button key={opt.code} onClick={() => handleAnswer(opt)}
                 style={{ padding:'16px', borderRadius:12, border:'2px solid rgba(255,255,255,0.08)', background:bg, color:'#fff', fontSize:14, fontWeight:800, fontFamily:'inherit', cursor:'pointer', transition:'all 0.2s' }}>
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
         <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:24 }}>
           {level >= 15 ? '🌍 Geography genius!' : level >= 10 ? '💪 Above average!' : level >= 5 ? '📈 Room to improve' : '🔥 Keep training!'}
         </div>
         <button onClick={startGame}
           style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:'#252525', color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:10 }}>
           Try Again
         </button>
         <button onClick={saveAndContinue}
           style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GOLD, color:'#000', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #8B6914' }}>
           Save & Continue →
         </button>
       </div>
     )}

     <details style={{ marginTop:40 }}>
       <summary style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', cursor:'pointer', listStyle:'none' }}>What does this Flag Quiz measure? ▼</summary>
       <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.7, marginTop:12 }}>
         This free flag quiz tests visual recognition memory and general knowledge. Identifying flags requires both long-term memory and pattern recognition skills. Studies show that geography knowledge correlates with broader cognitive abilities including attention and processing speed. This test includes flags from 30 countries and compares your score to people your age worldwide.
       </div>
     </details>
   </main>
 )
}
