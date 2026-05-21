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

export default function MyPlanClient() {
  const { profile } = usePlayer()
  const [wod, setWod] = useState<any | null>(null)
  const [completion, setCompletion] = useState<any | null>(null)
  const [brainAge, setBrainAge] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [userPlan, setUserPlan] = useState<any | null>(null)

  useEffect(() => {
    if (!profile?.name) { setLoading(false); return }
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    setLoading(true)

    // Get user plan start date
    const { data: planData } = await supabase
      .from('brain_plans')
      .select('*')
      .eq('player_name', profile!.name)
      .order('created_at', { ascending: false })
      .limit(1)

    const plan = planData?.[0]
    setUserPlan(plan)

    // Calculate which WOD day the user is on
    let wodDay = 1
    if (plan) {
      const startDate = new Date(plan.start_date)
      const today = new Date()
      const diff = Math.floor((today.getTime() - startDate.getTime()) / 86400000)
      wodDay = Math.min(7, Math.max(1, diff + 1))
    }

    // Get WOD for today
    const { data: wodData } = await supabase
      .from('wod')
      .select('*')
      .eq('day_number', wodDay)
      .limit(1)

    if (wodData?.[0]) setWod(wodData[0])

    // Get today's completion
    const today = new Date().toISOString().split('T')[0]
    const { data: compData } = await supabase
      .from('wod_completions')
      .select('*')
      .eq('player_name', profile!.name)
      .eq('date', today)
      .limit(1)

    if (compData?.[0]) setCompletion(compData[0])

    // Get brain age
    const { data: testData } = await supabase
      .from('brain_test_scores')
      .select('score')
      .eq('player_name', profile!.name)
      .order('created_at', { ascending: false })
      .limit(1)

    if (testData?.[0]) {
      const age = Math.min(65, Math.max(18, Math.round(65 - (testData[0].score / 1000) * 47)))
      setBrainAge(age)
    }

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

  const completeExercise = async (gameHref: string) => {
    if (!profile?.name || !wod) return
    const today = new Date().toISOString().split('T')[0]
    const currentCompleted = completion?.completed_exercises || []
    if (currentCompleted.includes(gameHref)) return

    const newCompleted = [...currentCompleted, gameHref]
    const allDone = wod.exercises.every((e: any) => newCompleted.includes(e.href))

    if (completion) {
      await supabase.from('wod_completions').update({
        completed_exercises: newCompleted,
        completed: allDone,
      }).eq('id', completion.id)
    } else {
      await supabase.from('wod_completions').insert({
        player_name: profile.name,
        wod_day: wod.day_number,
        completed_exercises: newCompleted,
        completed: allDone,
        date: today,
      })
    }
    await loadData()
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100dvh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <div style={{ fontSize: 16, color: `${BROWN}50`, fontWeight: 700 }}>Loading your plan...</div>
      </main>
    )
  }

  if (!profile?.name) {
    return (
      <main style={{ minHeight: '100dvh', background: CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-nunito), sans-serif', gap: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: BROWN }}>Create your profile first</div>
        <Link href="/" style={{ textDecoration: 'none', background: BROWN, color: '#fff', padding: '14px 28px', borderRadius: 14, fontWeight: 900 }}>Go to home</Link>
      </main>
    )
  }

  const completedExercises = completion?.completed_exercises || []
  const allDone = wod && completion?.completed
  const areaColor = wod ? AREA_COLORS[wod.area] : BROWN
  const areaIcon = wod ? AREA_ICONS[wod.area] : '🧠'

  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 100 }}>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} } @keyframes popIn { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }`}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${areaColor}, ${areaColor}CC)`, padding: '40px 24px 28px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>
          {wod ? `Day ${wod.day_number} of 7` : 'Brain Gym'}
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 4 }}>
          {areaIcon} {wod?.name || 'My Plan'}
        </div>
        {brainAge && (
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
            Brain Age: {brainAge} · {completedExercises.length}/{wod?.exercises?.length || 0} done today
          </div>
        )}
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* No plan yet */}
        {!userPlan && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px', textAlign: 'center', border: '1px solid #4A2C0A08' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏋️</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: BROWN, marginBottom: 8 }}>Start your Brain Gym</div>
            <div style={{ fontSize: 14, color: `${BROWN}60`, marginBottom: 20, lineHeight: 1.7 }}>
              7 days of daily brain training.<br />Each day a different workout.<br />Always free.
            </div>
            {!brainAge ? (
              <Link href="/brain-test" style={{ textDecoration: 'none', display: 'block', background: '#2E7D32', color: '#fff', padding: '16px', borderRadius: 16, fontWeight: 900, fontSize: 16 }}>
                Start with Brain Age Test
              </Link>
            ) : (
              <button onClick={startPlan} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: areaColor, color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>
                Start 7-day plan
              </button>
            )}
          </div>
        )}

        {/* WOD exercises */}
        {userPlan && wod && !allDone && (
          <>
            <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase' }}>Today's workout</div>

            {/* Progress bar */}
            <div style={{ background: '#E0E0E0', borderRadius: 8, height: 8, overflow: 'hidden' }}>
              <div style={{ width: `${(completedExercises.length / wod.exercises.length) * 100}%`, height: '100%', background: areaColor, borderRadius: 8, transition: 'width 0.5s ease' }} />
            </div>

            {wod.exercises.map((exercise: any, i: number) => {
              const done = completedExercises.includes(exercise.href)
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 18, padding: '16px 20px', border: done ? `2px solid ${areaColor}30` : '1px solid #4A2C0A08', animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: done ? areaColor : '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, transition: 'background 0.3s' }}>
                      {done ? '✓' : i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: done ? areaColor : BROWN }}>{exercise.game}</div>
                      <div style={{ fontSize: 12, color: `${BROWN}50`, fontWeight: 700 }}>{exercise.description} · ×{exercise.reps}</div>
                    </div>
                    {!done && (
                      <a href={exercise.href} onClick={() => setTimeout(() => completeExercise(exercise.href), 2000)} style={{ textDecoration: 'none', background: areaColor, color: '#fff', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 900 }}>
                        Train
                      </a>
                    )}
                    {done && (
                      <a href={exercise.href} style={{ textDecoration: 'none', background: `${areaColor}20`, color: areaColor, padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 900 }}>
                        More
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* All done today */}
        {allDone && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px', textAlign: 'center', border: `2px solid ${areaColor}20`, animation: 'popIn 0.5s ease' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: areaColor, marginBottom: 8 }}>Great session today!</div>
            <div style={{ fontSize: 14, color: `${BROWN}60`, lineHeight: 1.7, marginBottom: 20 }}>
              You trained your brain.<br />Come back tomorrow for Day {Math.min(7, (wod?.day_number || 0) + 1)}.
            </div>
            <Link href="/" style={{ textDecoration: 'none', display: 'block', background: BROWN, color: '#fff', padding: '14px', borderRadius: 14, fontWeight: 900, fontSize: 15, marginBottom: 10 }}>
              Keep training →
            </Link>
          </div>
        )}

        {/* Brain Age Test CTA if no test */}
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
