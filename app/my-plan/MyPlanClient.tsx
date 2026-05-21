'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const AREA_COLORS: Record<string, string> = {
 agility: '#FF6F00',
 memory: '#E91E63',
 knowledge: '#1565C0',
 logic: '#6A1B9A',
 brain_test: '#2E7D32',
}

const AREA_ICONS: Record<string, string> = {
 agility: '⚡',
 memory: '🧠',
 knowledge: '🌍',
 logic: '🎯',
 brain_test: '🧬',
}

const GAME_ICONS: Record<string, string> = {
 '/precision/stopwatch': `${BASE}/precision.png`,
 '/precision/formula1': `${BASE}/formula1.png`,
 '/precision/pendulum': `${BASE}/pendulum.png`,
 '/ace': `${BASE}/padel.png`,
 '/nback': `${BASE}/nback.png`,
 '/digits': `${BASE}/digits.webp`,
 '/sequence': `${BASE}/sequence.webp`,
 '/memory': `${BASE}/memory.webp`,
 '/flags': `${BASE}/flags.png`,
 '/geoshape': `${BASE}/mapamundi.png`,
 '/versus': `${BASE}/versus.png`,
 '/mastermind': `${BASE}/mastermind.png`,
 '/sudoku': `${BASE}/sudoku.png`,
 '/wordly': `${BASE}/wordly.png`,
 '/2048': `${BASE}/2048.png`,
 '/brain-test': `${BASE}/brain-logo.webp`,
}

export default function MyPlanClient() {
 const { profile } = usePlayer()
 const [wod, setWod] = useState<any | null>(null)
 const [completion, setCompletion] = useState<any | null>(null)
 const [loading, setLoading] = useState(true)
 const [userPlan, setUserPlan] = useState<any | null>(null)
 const [weekHistory, setWeekHistory] = useState<any[]>([])
 const [brainAge, setBrainAge] = useState<number | null>(null)
 const [wodDay, setWodDay] = useState(1)

 useEffect(() => {
   if (!profile?.name) { setLoading(false); return }
   loadData()
 }, [profile?.name])

 const loadData = async () => {
   setLoading(true)

   const [planRes, testRes] = await Promise.all([
     supabase.from('brain_plans').select('*').eq('player_name', profile!.name).order('created_at', { ascending: false }).limit(1),
     supabase.from('brain_test_scores').select('score').eq('player_name', profile!.name).order('created_at', { ascending: false }).limit(1),
   ])

   const plan = planRes.data?.[0]
   setUserPlan(plan)

   if (testRes.data?.[0]) {
     setBrainAge(Math.min(65, Math.max(18, Math.round(65 - (testRes.data[0].score / 1000) * 47))))
   }

   let day = 1
   if (plan) {
     const startDate = new Date(plan.start_date)
     const today = new Date()
     const diff = Math.floor((today.getTime() - startDate.getTime()) / 86400000)
     day = Math.min(7, Math.max(1, diff + 1))
     setWodDay(day)

     // Load week history
     const { data: histData } = await supabase
       .from('wod_completions')
       .select('*')
       .eq('player_name', profile!.name)
     setWeekHistory(histData || [])
   }

   const { data: wodData } = await supabase.from('wod').select('*').eq('day_number', day).limit(1)
   if (wodData?.[0]) setWod(wodData[0])

   const today = new Date().toISOString().split('T')[0]
   const { data: compData } = await supabase.from('wod_completions').select('*').eq('player_name', profile!.name).eq('date', today).limit(1)
   if (compData?.[0]) setCompletion(compData[0])

   setLoading(false)
 }

 const startPlan = async () => {
   if (!profile?.name) return
   await supabase.from('brain_plans').insert({
     player_name: profile.name,
     weak_area: 'agility',
     games: [],
     game_labels: [],
     completed_days: [],
     start_date: new Date().toISOString().split('T')[0],
   })
   await loadData()
 }

 if (loading) return (
   <main style={{ minHeight: '100dvh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-nunito), sans-serif' }}>
     <div style={{ fontSize: 16, color: `${BROWN}50`, fontWeight: 700 }}>Loading...</div>
   </main>
 )

 if (!profile?.name) return (
   <main style={{ minHeight: '100dvh', background: CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-nunito), sans-serif', gap: 16 }}>
     <Link href="/" style={{ textDecoration: 'none', background: BROWN, color: '#fff', padding: '14px 28px', borderRadius: 14, fontWeight: 900 }}>Go to home</Link>
   </main>
 )

 const completedExercises = completion?.completed_exercises || []
 const allDone = completion?.completed === true
 const areaColor = wod ? AREA_COLORS[wod.area] : '#2E7D32'
 const areaIcon = wod ? AREA_ICONS[wod.area] : '🧠'
 const totalEx = wod?.exercises?.length || 0
 const doneCount = completedExercises.length

 return (
   <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 100 }}>
     <style>{`
       @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
       @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
       @keyframes popIn { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
     `}</style>

     {/* Header */}
     <div style={{ background: `linear-gradient(160deg, ${areaColor}EE, ${areaColor}99)`, padding: '40px 24px 24px' }}>
       <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
         Brain Gym {userPlan ? `· Day ${wodDay} of 7` : ''}
       </div>
       <div style={{ fontSize: 30, fontWeight: 900, color: '#fff', marginBottom: 4 }}>
         {areaIcon} {wod?.name || 'My Plan'}
       </div>
       {brainAge && (
         <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>Brain Age: {brainAge}</div>
       )}

       {/* Progress bar */}
       {userPlan && totalEx > 0 && (
         <div style={{ marginTop: 16 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
             <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>Today's session</div>
             <div style={{ fontSize: 12, fontWeight: 900, color: '#fff' }}>{doneCount}/{totalEx}</div>
           </div>
           <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8, height: 10, overflow: 'hidden' }}>
             <div style={{ width: `${(doneCount / totalEx) * 100}%`, height: '100%', background: '#fff', borderRadius: 8, transition: 'width 0.5s ease' }} />
           </div>
         </div>
       )}
     </div>

     <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

       {/* No plan */}
       {!userPlan && (
         <div style={{ background: '#fff', borderRadius: 24, padding: '28px 24px', textAlign: 'center', boxShadow: '0 4px 20px #4A2C0A10' }}>
           <div style={{ fontSize: 48, marginBottom: 12 }}>🏋️</div>
           <div style={{ fontSize: 20, fontWeight: 900, color: BROWN, marginBottom: 8 }}>Start your Brain Gym</div>
           <div style={{ fontSize: 14, color: `${BROWN}60`, marginBottom: 24, lineHeight: 1.7 }}>
             7 days of daily training.<br />Each day a new workout.<br />Always free.
           </div>
           {!brainAge ? (
             <Link href="/brain-test" style={{ textDecoration: 'none', display: 'block', background: '#2E7D32', color: '#fff', padding: '16px', borderRadius: 16, fontWeight: 900, fontSize: 16 }}>
               Start with Brain Age Test →
             </Link>
           ) : (
             <button onClick={startPlan} style={{ width: '100%', padding: '18px', borderRadius: 16, border: 'none', background: '#2E7D32', color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 6px 0 #1B5E2060' }}>
               Start 7-day plan
             </button>
           )}
         </div>
       )}

       {/* Exercises */}
       {userPlan && wod && !allDone && wod.exercises.map((exercise: any, i: number) => {
         const done = completedExercises.includes(exercise.href)
         const isNext = !done && completedExercises.length === i
         const locked = !done && !isNext
         const icon = GAME_ICONS[exercise.href]

         return (
           <div key={i} style={{
             background: done ? '#F1F8F1' : isNext ? '#fff' : '#F8F8F8',
             borderRadius: 20,
             padding: '16px 20px',
             border: done ? '2px solid #4CAF5030' : isNext ? `2px solid ${areaColor}` : '2px solid transparent',
             opacity: locked ? 0.5 : 1,
             animation: 'fadeIn 0.3s ease',
             boxShadow: isNext ? `0 4px 20px ${areaColor}20` : '0 2px 8px #4A2C0A06',
           }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
               {/* Status circle */}
               <div style={{
                 width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                 background: done ? '#4CAF50' : isNext ? areaColor : '#E0E0E0',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontSize: done ? 22 : 18,
                 animation: isNext ? 'pulse 2s ease-in-out infinite' : 'none',
                 boxShadow: done ? '0 4px 0 #2E7D3260' : isNext ? `0 4px 0 ${areaColor}60` : 'none',
               }}>
                 {done ? '✓' : icon ? <img src={icon} style={{ width: 28, height: 28, objectFit: 'contain', filter: isNext ? 'brightness(0) invert(1)' : 'brightness(0) invert(0.5)' }} /> : i + 1}
               </div>

               {/* Info */}
               <div style={{ flex: 1 }}>
                 <div style={{ fontSize: 16, fontWeight: 900, color: done ? '#2E7D32' : BROWN }}>{exercise.game}</div>
                 <div style={{ fontSize: 12, color: `${BROWN}50`, fontWeight: 700, marginTop: 2 }}>
                   {exercise.description} · ×{exercise.reps}
                 </div>
               </div>

               {/* Action */}
               {done && (
                 <a href={exercise.href} style={{ textDecoration: 'none', background: '#4CAF5015', color: '#2E7D32', padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 900 }}>More</a>
               )}
               {isNext && (
                 <a href={exercise.href} style={{ textDecoration: 'none', background: areaColor, color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 900, boxShadow: `0 4px 0 ${areaColor}60` }}>Train →</a>
               )}
               {locked && (
                 <span style={{ fontSize: 18, opacity: 0.4 }}>🔒</span>
               )}
             </div>
           </div>
         )
       })}

       {/* All done */}
       {userPlan && allDone && (
         <div style={{ background: '#fff', borderRadius: 24, padding: '32px 24px', textAlign: 'center', border: `2px solid ${areaColor}20`, animation: 'popIn 0.5s ease', boxShadow: '0 4px 20px #4A2C0A10' }}>
           <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
           <div style={{ fontSize: 24, fontWeight: 900, color: areaColor, marginBottom: 8 }}>Great session!</div>
           <div style={{ fontSize: 14, color: `${BROWN}60`, lineHeight: 1.8, marginBottom: 24 }}>
             You completed Day {wodDay} of 7.<br />
             {wodDay < 7 ? `Come back tomorrow for Day ${wodDay + 1}.` : 'You completed the full week! 🏆'}
           </div>
           {wodDay < 7 ? (
             <Link href="/" style={{ textDecoration: 'none', display: 'block', background: BROWN, color: '#fff', padding: '14px', borderRadius: 14, fontWeight: 900, fontSize: 15 }}>
               Keep training today →
             </Link>
           ) : (
             <Link href="/brain-test" style={{ textDecoration: 'none', display: 'block', background: '#2E7D32', color: '#fff', padding: '14px', borderRadius: 14, fontWeight: 900, fontSize: 15 }}>
               Retake Brain Age Test →
             </Link>
           )}
         </div>
       )}

       {/* Week history */}
       {userPlan && (
         <div style={{ background: '#fff', borderRadius: 20, padding: '16px 20px', boxShadow: '0 2px 8px #4A2C0A06' }}>
           <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>This week</div>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             {Array.from({ length: 7 }, (_, i) => {
               const dayNum = i + 1
               const hist = weekHistory.find((h: any) => h.wod_day === dayNum)
               const isToday = dayNum === wodDay
               const done = hist?.completed
               const partial = hist && !done
               return (
                 <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                   <div style={{
                     width: 36, height: 36, borderRadius: '50%',
                     background: done ? '#4CAF50' : partial ? GOLD : isToday ? `${areaColor}20` : '#F0F0F0',
                     border: isToday ? `2px solid ${areaColor}` : '2px solid transparent',
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     fontSize: 14, fontWeight: 900,
                     color: done ? '#fff' : partial ? '#fff' : isToday ? areaColor : `${BROWN}30`,
                   }}>
                     {done ? '✓' : partial ? '~' : dayNum}
                   </div>
                   <div style={{ fontSize: 9, fontWeight: 800, color: isToday ? areaColor : `${BROWN}30`, textTransform: 'uppercase' }}>
                     {['M','T','W','T','F','S','S'][i]}
                   </div>
                 </div>
               )
             })}
           </div>
         </div>
       )}

       {/* No brain test CTA */}
       {!brainAge && (
         <div style={{ background: 'linear-gradient(135deg, #0A0A1A, #0D1B2A)', borderRadius: 20, padding: '20px', textAlign: 'center' }}>
           <div style={{ fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Discover your Brain Age</div>
           <Link href="/brain-test" style={{ textDecoration: 'none', display: 'inline-block', background: '#2E7D32', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 900, fontSize: 14 }}>
             Take the test →
           </Link>
         </div>
       )}

     </div>
   </main>
 )
}
