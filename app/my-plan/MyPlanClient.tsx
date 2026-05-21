'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import { getWodProgress } from '@/lib/wod'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const AREA_COLORS: Record<string, string> = {
  agility: '#FF6F00', memory: '#E91E63', knowledge: '#1565C0',
  logic: '#6A1B9A', brain_test: '#2E7D32',
}

const AREA_NAMES: Record<string, string> = {
  agility: 'Agility', memory: 'Memory', knowledge: 'Knowledge',
  logic: 'Logic', brain_test: 'Brain Age Test',
}

const GAME_ICONS: Record<string, string> = {
  '/precision/stopwatch': `${BASE}/precision.png`,
  '/precision/formula1': `${BASE}/f1.png`,
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
  const [loading, setLoading] = useState(true)
  const [userPlan, setUserPlan] = useState<any | null>(null)
  const [wodDay, setWodDay] = useState(1)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [weekHistory, setWeekHistory] = useState<any[]>([])
  const [brainAge, setBrainAge] = useState<number | null>(null)
  const [allWods, setAllWods] = useState<any[]>([])
  const [countdown, setCountdown] = useState('')

  const loadData = useCallback(async () => {
    if (!profile?.name) { setLoading(false); return }
    setLoading(true)

    const [planRes, testRes, allWodsRes] = await Promise.all([
      supabase.from('brain_plans').select('*').eq('player_name', profile.name).order('created_at', { ascending: false }).limit(1),
      supabase.from('brain_test_scores').select('score').eq('player_name', profile.name).order('created_at', { ascending: false }).limit(1),
      supabase.from('wod').select('*').order('day_number', { ascending: true }),
    ])

    const plan = planRes.data?.[0]
    setUserPlan(plan)
    setAllWods(allWodsRes.data || [])

    if (testRes.data?.[0]) {
      setBrainAge(Math.min(65, Math.max(18, Math.round(65 - (testRes.data[0].score / 1000) * 47))))
    }

    let day = 1
    if (plan) {
      const diff = Math.floor((new Date().getTime() - new Date(plan.start_date).getTime()) / 86400000)
      day = Math.min(7, Math.max(1, diff + 1))
      setWodDay(day)

      const { data: histData } = await supabase.from('wod_completions').select('*').eq('player_name', profile.name)
      setWeekHistory(histData || [])
    }

    const { data: wodData } = await supabase.from('wod').select('*').eq('day_number', day).limit(1)
    const todayWod = wodData?.[0]
    setWod(todayWod)

    if (todayWod && plan) {
      const prog = await getWodProgress(profile.name, todayWod.exercises)
      setProgress(prog)
    }

    setLoading(false)
  }, [profile?.name])

  useEffect(() => { loadData() }, [loadData])

  // Countdown to next WOD
 useEffect(() => {
   const timer = setInterval(() => {
     const now = new Date()
     const midnight = new Date()
     midnight.setHours(24, 0, 0, 0)
     const diff = midnight.getTime() - now.getTime()
     const h = Math.floor(diff / 3600000)
     const m = Math.floor((diff % 3600000) / 60000)
     const s = Math.floor((diff % 60000) / 1000)
     setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
   }, 1000)
   return () => clearInterval(timer)
 }, [])

 // Refresh when user comes back to tab
  useEffect(() => {
    const handleFocus = () => loadData()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [loadData])

  const startPlan = async () => {
    if (!profile?.name) return
    await supabase.from('brain_plans').insert({
      player_name: profile.name, weak_area: 'agility',
      games: [], game_labels: [], completed_days: [],
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

  const areaColor = wod ? AREA_COLORS[wod.area] : '#2E7D32'
  const exercises = wod?.exercises || []

  // Calculate progress per exercise
  const exProgress = exercises.map((ex: any) => ({
    ...ex,
    done: Math.min(progress[ex.href] || 0, ex.reps),
    complete: (progress[ex.href] || 0) >= ex.reps,
  }))

  const totalReps = exProgress.reduce((sum: number, ex: any) => sum + ex.reps, 0)
  const doneReps = exProgress.reduce((sum: number, ex: any) => sum + ex.done, 0)
  const allDone = exProgress.length > 0 && exProgress.every((ex: any) => ex.complete)
  const nextEx = exProgress.find((ex: any) => !ex.complete)

  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 100 }}>
      <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }`}</style>

      {/* Header */}
            <div style={{ background: `linear-gradient(160deg, ${areaColor}, ${areaColor}BB)`, padding: '32px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
       <div style={{ flex: 1, textAlign: 'center' }}>
         <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
           Brain Gym{userPlan ? ` · Day ${wodDay} of 7` : ''}
         </div>
         <div style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>
           {wod?.name || 'My Plan'}
         </div>
       </div>
       <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/memgeniuslogofull.png" alt="MemGenius" style={{ height: 70, objectFit: 'contain', opacity: 0.9, flexShrink: 0 }} />
     </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 4 }}>
          {wod?.name || 'My Plan'}
        </div>



      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* No plan */}
        {!userPlan && (
          <div style={{ background: '#fff', borderRadius: 24, padding: '28px 24px', textAlign: 'center', boxShadow: '0 4px 20px #4A2C0A10' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: BROWN, marginBottom: 8 }}>Start your Brain Gym</div>
            <div style={{ fontSize: 14, color: `${BROWN}60`, marginBottom: 24, lineHeight: 1.7 }}>7 days of daily training. Each day a new workout.</div>
            {!brainAge ? (
              <Link href="/brain-test" style={{ textDecoration: 'none', display: 'block', background: '#2E7D32', color: '#fff', padding: '16px', borderRadius: 16, fontWeight: 900, fontSize: 16 }}>
                Start with Brain Age Test →
              </Link>
            ) : (
              <button onClick={startPlan} style={{ width: '100%', padding: '18px', borderRadius: 16, border: 'none', background: '#2E7D32', color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>
                Start 7-day plan
              </button>
            )}
          </div>
        )}

        {/* Week overview */}
        {userPlan && (
          <div style={{ background: 'linear-gradient(135deg, #0D1B4B, #1565C0)', borderRadius: 20, padding: '16px 20px', boxShadow: '0 4px 20px #0D1B4B40' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Your 7-day plan</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {allWods.map((w: any) => {
                const hist = weekHistory.find((h: any) => h.wod_day === w.day_number)
                const isToday = w.day_number === wodDay
                const isPast = w.day_number < wodDay
                const isFuture = w.day_number > wodDay
                const done = hist?.completed
                const partial = hist && !done
                const color = AREA_COLORS[w.area]
                return (
                  <div key={w.day_number} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: '100%', aspectRatio: '1', borderRadius: 12,
                      background: done ? '#4CAF50' : partial ? `${color}60` : isToday ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                      border: isToday ? '2px solid #FFD600' : '2px solid transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 900,
                      color: done ? '#fff' : isToday ? '#fff' : 'rgba(255,255,255,0.3)',
                    }}>
                      {done ? '✓' : partial ? '~' : w.day_number}
                    </div>
                    <div style={{ fontSize: 8, fontWeight: 800, color: isToday ? '#FFD600' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', textAlign: 'center' }}>
                      {AREA_NAMES[w.area]?.slice(0, 3)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

       {/* Countdown when session complete */}
       {userPlan && allDone && (
         <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: '12px 20px', textAlign: 'center', border: '1px solid #4A2C0A08' }}>
           <div style={{ fontSize: 10, fontWeight: 800, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Next workout in</div>
           <div style={{ fontSize: 32, fontWeight: 900, color: '#0D1B4B', letterSpacing: 2 }}>{countdown}</div>
         </div>
       )}

       {/* Exercises */}
        {userPlan && exercises.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 24, padding: '20px', boxShadow: '0 4px 20px #4A2C0A08' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}40`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Today's workout</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {exProgress.map((ex: any, i: number) => {
                const isNext = ex === nextEx
                const icon = GAME_ICONS[ex.href]
                return (
                  <div key={i} style={{ opacity: (!ex.complete && !isNext) ? 0.4 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      {icon && <img src={icon} style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 900, color: ex.complete ? '#2E7D32' : BROWN }}>{ex.game}</div>
                        <div style={{ fontSize: 11, color: `${BROWN}50`, fontWeight: 700 }}>{ex.description}</div>
                      </div>
                      {ex.complete && (
                        <div style={{ fontSize: 12, fontWeight: 900, color: '#2E7D32', background: '#E8F5E9', padding: '4px 10px', borderRadius: 8 }}>Done ✓</div>
                      )}
                      {isNext && (
                        <a href={ex.href} style={{ textDecoration: 'none', background: areaColor, color: '#fff', padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 900, boxShadow: `0 4px 0 ${areaColor}60`, animation: 'pulse 2s ease-in-out infinite' }}>
                          Go →
                        </a>
                      )}
                    </div>
                    {/* Reps dots */}
                    <div style={{ display: 'flex', gap: 6, paddingLeft: 44 }}>
                      {Array.from({ length: ex.reps }, (_, j) => (
                        <div key={j} style={{
                          width: 10, height: 10, borderRadius: '50%',
                          background: j < ex.done ? '#4CAF50' : '#E0E0E0',
                          transition: 'background 0.3s',
                        }} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

             {allDone && (
             <div style={{ marginTop: 16, textAlign: 'center' }}>
               <Link href="/" style={{ textDecoration: 'none', display: 'block', background: '#0D1B4B', color: '#fff', padding: '14px', borderRadius: 14, fontWeight: 900, fontSize: 15 }}>Keep training →</Link>
             </div>
           )}
          </div>
        )}




        {/* No brain test - only show if no plan */}
        {!brainAge && !userPlan && (
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
