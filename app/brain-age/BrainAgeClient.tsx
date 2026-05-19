'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const AREAS = {
  memory: {
    label: 'Memory',
    color: '#E91E63',
    icon: '🧠',
    desc: 'Working memory and short-term recall',
    games: [
      { label: 'N-Back', href: '/nback' },
      { label: 'Digits', href: '/digits' },
      { label: 'Simon Says', href: '/sequence' },
      { label: 'Memory', href: '/memory' },
      { label: 'N-Back', href: '/nback' },
      { label: 'Digits', href: '/digits' },
      { label: 'Simon Says', href: '/sequence' },
    ],
  },
  agility: {
    label: 'Agility',
    color: '#FF6F00',
    icon: '⚡',
    desc: 'Reaction time and motor precision',
    games: [
      { label: 'Stop', href: '/precision/stopwatch' },
      { label: 'F1 Reaction', href: '/precision/formula1' },
      { label: 'Pendulum', href: '/precision/pendulum' },
      { label: 'Ace', href: '/ace' },
      { label: 'Stop', href: '/precision/stopwatch' },
      { label: 'F1 Reaction', href: '/precision/formula1' },
      { label: 'Pendulum', href: '/precision/pendulum' },
    ],
  },
  knowledge: {
    label: 'Knowledge',
    color: '#1565C0',
    icon: '🌍',
    desc: 'Spatial cognition and world knowledge',
    games: [
      { label: 'Flags', href: '/flags' },
      { label: 'GeoShape', href: '/geoshape' },
      { label: 'Higher or Lower', href: '/versus' },
      { label: 'Flags', href: '/flags' },
      { label: 'GeoShape', href: '/geoshape' },
      { label: 'Higher or Lower', href: '/versus' },
      { label: 'Flags', href: '/flags' },
    ],
  },
  precision: {
    label: 'Precision',
    color: '#6A1B9A',
    icon: '🎯',
    desc: 'Logical thinking and deductive reasoning',
    games: [
      { label: 'Mastermind', href: '/mastermind' },
      { label: 'Sudoku', href: '/sudoku' },
      { label: 'Wordly', href: '/wordly' },
      { label: '2048', href: '/2048' },
      { label: 'Mastermind', href: '/mastermind' },
      { label: 'Sudoku', href: '/sudoku' },
      { label: 'Wordly', href: '/wordly' },
    ],
  },
}

function calcBrainAge(score: number) {
  return Math.min(65, Math.max(18, Math.round(65 - (score / 1000) * 47)))
}

function calcAreaScores(test: any) {
  const aceP = Math.min(150, (test.ace_score || 0) * 0.75)
  const nbP = Math.min(250, (test.nback_score || 0) * 50)
  const stopDiff = test.stop_score || 2000
  const stopP = Math.max(0, Math.round(200 - (stopDiff / 100) * 20))
  const geoP = Math.min(200, (test.geoshape_score || 0) * 40)
  const digP = Math.min(200, test.mastermind_score || 0)

  return {
    memory: Math.round(((nbP / 250) + (digP / 200)) / 2 * 100),
    agility: Math.round(((aceP / 150) + (stopP / 200)) / 2 * 100),
    knowledge: Math.round((geoP / 200) * 100),
    precision: Math.round((digP / 200) * 100),
  }
}

export default function BrainAgeClient() {
  const { profile } = usePlayer()
  const [tests, setTests] = useState<any[]>([])
  const [plan, setPlan] = useState<any | null>(null)
  const [percentiles, setPercentiles] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!profile?.name) return
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    setLoading(true)
    const [testsRes, planRes, allTestsRes] = await Promise.all([
      supabase.from('brain_test_scores').select('*').eq('player_name', profile!.name).order('created_at', { ascending: false }),
      supabase.from('brain_plans').select('*').eq('player_name', profile!.name).order('created_at', { ascending: false }).limit(1),
      supabase.from('brain_test_scores').select('score, ace_score, nback_score, stop_score, geoshape_score, mastermind_score'),
    ])

    if (testsRes.data) setTests(testsRes.data)
    if (planRes.data?.[0]) setPlan(planRes.data[0])

    // Calculate percentiles from all tests
    if (allTestsRes.data && testsRes.data?.[0]) {
      const latest = testsRes.data[0]
      const myScores = calcAreaScores(latest)
      const percs: Record<string, number> = {}

      for (const area of Object.keys(AREAS)) {
        const allAreaScores = allTestsRes.data.map((t: any) => {
          const s = calcAreaScores(t)
          return s[area as keyof typeof s]
        })
        const better = allAreaScores.filter((s: number) => s < myScores[area as keyof typeof myScores]).length
        percs[area] = Math.round((better / allAreaScores.length) * 100)
      }
      setPercentiles(percs)
    }
    setLoading(false)
  }

  const createPlan = async (weakArea: string) => {
    if (!profile?.name) return
    setCreating(true)
    const areaData = AREAS[weakArea as keyof typeof AREAS]
    const games = areaData.games.map((g: any) => g.href)
    const gameLabels = areaData.games.map((g: any) => g.label)

    await supabase.from('brain_plans').insert({
      player_name: profile.name,
      weak_area: weakArea,
      games,
      game_labels: gameLabels,
      completed_days: [],
      start_date: new Date().toISOString().split('T')[0],
    })
    await loadData()
    setCreating(false)
  }

  if (!profile?.name) {
    return (
      <main style={{ minHeight: '100dvh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: BROWN, marginBottom: 16 }}>Login required</div>
          <Link href="/" style={{ textDecoration: 'none', background: BROWN, color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 14 }}>Go to home</Link>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100dvh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <div style={{ fontSize: 16, color: `${BROWN}60`, fontWeight: 700 }}>Loading your brain profile...</div>
      </main>
    )
  }

  const latestTest = tests[0]
  if (!latestTest) {
    return (
      <main style={{ minHeight: '100dvh', background: CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-nunito), sans-serif', gap: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: BROWN }}>No Brain Age Test yet</div>
        <Link href="/brain-test" style={{ textDecoration: 'none', background: '#2E7D32', color: '#fff', padding: '16px 32px', borderRadius: 16, fontWeight: 900, fontSize: 16 }}>Take the test now</Link>
      </main>
    )
  }

  const brainAge = calcBrainAge(latestTest.score)
  const areaScores = calcAreaScores(latestTest)
  const weakArea = Object.entries(areaScores).sort((a, b) => a[1] - b[1])[0][0]
  const planActive = plan && plan.completed_days.length < 7
  const planComplete = plan && plan.completed_days.length >= 7
  const today = new Date().toISOString().split('T')[0]
  const planDay = plan ? Math.min(7, (new Date(today).getTime() - new Date(plan.start_date).getTime()) / 86400000 + 1) : 0

  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 100 }}>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg, #0A0A1A, #0D1B2A)', padding: '40px 24px 32px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Brain Profile · {profile.name}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 4 }}>
          <div style={{ fontSize: 80, fontWeight: 900, color: brainAge <= 35 ? '#00E676' : brainAge <= 45 ? '#FF9100' : '#FF5252', lineHeight: 1 }}>{brainAge}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.6)', paddingBottom: 10 }}>years old</div>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 20 }}>
          Last test: {new Date(latestTest.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <Link href="/brain-test" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>
            Retake test →
          </div>
        </Link>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* 4 Areas */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Cognitive Areas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(AREAS).map(([key, area]) => {
              const score = areaScores[key as keyof typeof areaScores]
              const pct = percentiles[key] ?? 50
              const isWeak = key === weakArea
              return (
                <div key={key} style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', border: isWeak ? `2px solid ${area.color}` : '1px solid #4A2C0A08', animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{area.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: BROWN }}>{area.label}</div>
                        <div style={{ fontSize: 11, color: `${BROWN}50`, fontWeight: 700 }}>{area.desc}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: area.color }}>Top {100 - pct}%</div>
                      {isWeak && <div style={{ fontSize: 10, fontWeight: 800, color: area.color, textTransform: 'uppercase', letterSpacing: 1 }}>Weakest</div>}
                    </div>
                  </div>
                  <div style={{ background: '#F5F5F5', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${score}%`, height: '100%', background: area.color, borderRadius: 8, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 7-day plan */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>7-Day Training Plan</div>

          {!plan && (
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px', border: '1px solid #4A2C0A08', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 8 }}>
                {AREAS[weakArea as keyof typeof AREAS].icon} Train your {AREAS[weakArea as keyof typeof AREAS].label}
              </div>
              <div style={{ fontSize: 13, color: `${BROWN}60`, marginBottom: 16 }}>
                Based on your results, your weakest area is <strong>{AREAS[weakArea as keyof typeof AREAS].label}</strong>. Create a 7-day plan to improve it.
              </div>
              <button onClick={() => createPlan(weakArea)} disabled={creating} style={{
                width: '100%', padding: '16px', borderRadius: 16, border: 'none',
                background: AREAS[weakArea as keyof typeof AREAS].color,
                color: '#fff', fontSize: 16, fontWeight: 900,
                fontFamily: 'inherit', cursor: 'pointer',
              }}>{creating ? 'Creating...' : 'Create my 7-day plan'}</button>
            </div>
          )}

          {planActive && (
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px', border: '1px solid #4A2C0A08' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: BROWN }}>
                    {AREAS[plan.weak_area as keyof typeof AREAS].icon} {AREAS[plan.weak_area as keyof typeof AREAS].label} Plan
                  </div>
                  <div style={{ fontSize: 12, color: `${BROWN}50`, fontWeight: 700 }}>Day {plan.completed_days.length} of 7 completed</div>
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: AREAS[plan.weak_area as keyof typeof AREAS].color }}>{plan.completed_days.length}/7</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plan.game_labels.map((label: string, i: number) => {
                  const completed = plan.completed_days.includes(i + 1)
                  const isToday = i + 1 === Math.ceil(planDay)
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: completed ? '#E8F5E9' : isToday ? `${AREAS[plan.weak_area as keyof typeof AREAS].color}10` : '#F5F5F5', border: isToday ? `1.5px solid ${AREAS[plan.weak_area as keyof typeof AREAS].color}40` : 'none' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: completed ? '#2E7D32' : isToday ? AREAS[plan.weak_area as keyof typeof AREAS].color : '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                        {completed ? '✓' : i + 1}
                      </div>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 800, color: completed ? '#2E7D32' : BROWN }}>Day {i + 1} — {label}</div>
                      {isToday && !completed && (
                        <a href={plan.games[i]} style={{ textDecoration: 'none', background: AREAS[plan.weak_area as keyof typeof AREAS].color, color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 900 }}>Play</a>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {planComplete && (
            <div style={{ background: '#E8F5E9', borderRadius: 20, padding: '20px', textAlign: 'center', border: '1px solid #2E7D3220' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#2E7D32', marginBottom: 8 }}>Plan complete!</div>
              <div style={{ fontSize: 13, color: '#2E7D3280', marginBottom: 16 }}>Retake the Brain Age Test to see if you improved.</div>
              <Link href="/brain-test" style={{ textDecoration: 'none', display: 'block', background: '#2E7D32', color: '#fff', padding: '14px', borderRadius: 14, fontWeight: 900, fontSize: 15 }}>Retake Brain Age Test</Link>
            </div>
          )}
        </div>

        {/* History chart */}
        {tests.length > 1 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Brain Age History</div>
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px', border: '1px solid #4A2C0A08' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80, justifyContent: 'center' }}>
                {tests.slice(0, 8).reverse().map((t, i) => {
                  const age = calcBrainAge(t.score)
                  const height = Math.round(((65 - age) / 47) * 80)
                  const color = age <= 35 ? '#00E676' : age <= 45 ? '#FF9100' : '#FF5252'
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: BROWN }}>{age}</div>
                      <div style={{ width: 28, height, background: color, borderRadius: '6px 6px 0 0', minHeight: 8 }} />
                      <div style={{ fontSize: 9, color: `${BROWN}40`, fontWeight: 700 }}>{new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
