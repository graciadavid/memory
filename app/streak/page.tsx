import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const LEVELS = [
  {
    min: 1, max: 4, img: 'seed.png', color: '#2E7D32',
    title: 'Days 1–4 · Warming Up',
    science: 'Your brain is beginning to adapt. Each session activates neural pathways related to memory and attention. Consistency matters more than intensity at this stage.',
    benefits: ['Increased focus during sessions', 'First habit signals forming', 'Baseline cognitive engagement'],
  },
  {
    min: 5, max: 9, img: 'streak.png', color: '#E65100',
    title: 'Days 5–9 · Habit Forming',
    science: 'Research shows it takes an average of 5–7 days of consistent practice before a routine starts to feel automatic. Your working memory — the mental workspace you use to hold and manipulate information — begins to show early improvements.',
    benefits: ['Working memory starts improving', 'Habit loop beginning to form', 'Reduced mental effort to start playing'],
  },
  {
    min: 10, max: 29, img: 'ray.png', color: '#F57F17',
    title: 'Days 10–29 · Reaction & Speed',
    science: 'At 10 days of daily cognitive training, studies observe measurable improvements in processing speed and reaction time. Your brain becomes faster at recognizing patterns and making decisions under time pressure.',
    benefits: ['Faster reaction times', 'Improved pattern recognition', 'Better performance under pressure'],
  },
  {
    min: 30, max: 49, img: 'brain-logo.webp', color: '#1565C0',
    title: 'Days 30–49 · Memory Gains',
    science: 'One month of daily brain training produces statistically significant improvements in short-term and working memory. This is the threshold where casual players become serious ones — and where real cognitive change happens.',
    benefits: ['Measurable short-term memory gains', 'Better retention of new information', 'Improved multitasking ability'],
  },
  {
    min: 50, max: 99, img: 'nav-trophy.webp', color: '#6A1B9A',
    title: 'Days 50–99 · Top 5%',
    science: 'Fewer than 5% of MemGenius players reach 50 consecutive days. At this level, cognitive improvements extend beyond the game — users report better focus at work, faster reading, and improved recall in daily life.',
    benefits: ['Elite consistency — top 5% of players', 'Cognitive benefits extending to daily life', 'Significantly improved long-term memory'],
  },
  {
    min: 100, max: 9999, img: 'target.png', color: '#B71C1C',
    title: 'Days 100+ · Cognitive Athlete',
    science: '100 days of daily practice places you in the category of cognitive athletes. Longitudinal studies on spaced cognitive training show that 100+ day practitioners maintain sharper memory and faster processing well into later life.',
    benefits: ['Cognitive athlete level', 'Long-term neuroprotective effects', 'Lifelong memory and focus advantages'],
  },
]

function StreakDots({ current, color }: { current: number, color: string }) {
  const SEGMENTS = [
    { min: 1,  max: 4,   steps: 4,  base: 0 },
    { min: 5,  max: 9,   steps: 5,  base: 5 },
    { min: 10, max: 29,  steps: 20, base: 10 },
    { min: 30, max: 49,  steps: 20, base: 30 },
    { min: 50, max: 99,  steps: 50, base: 50 },
    { min: 100, max: 9999, steps: 1, base: 100 },
  ]

  const seg = SEGMENTS.find(s => current >= s.min && current <= s.max)
  if (!seg) return null

  const progress = current - seg.base
  const stepsPerDot = seg.steps / 5
  const filledDots = seg.min === 100 ? 5 : Math.min(5, Math.floor(progress / stepsPerDot) + (progress % stepsPerDot > 0 ? 1 : 0))
  const daysToNext = seg.max === 9999 ? 0 : seg.max - current + 1

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
        {[0,1,2,3,4].map(i => {
          const dotProgress = Math.min(1, Math.max(0, (progress - i * stepsPerDot) / stepsPerDot))
          const filled = progress >= (i + 1) * stepsPerDot || seg.min === 100
          const partial = !filled && dotProgress > 0
          return (
            <div key={i} style={{
              width: 20, height: 20, borderRadius: 10,
              background: filled ? color : 'transparent',
              border: `2px solid ${filled || partial ? color : `${color}40`}`,
              transition: 'all 0.3s ease',
              boxShadow: filled ? `0 2px 8px ${color}40` : 'none',
            }} />
          )
        })}
      </div>
      {daysToNext > 0 && (
        <div style={{ fontSize: 11, fontWeight: 700, color: `${color}70`, textAlign: 'center' }}>
          {daysToNext} day{daysToNext !== 1 ? 's' : ''} to next milestone
        </div>
      )}
      {daysToNext === 0 && (
        <div style={{ fontSize: 11, fontWeight: 700, color, textAlign: 'center' }}>
          🎯 Maximum level reached
        </div>
      )}
    </div>
  )
}

export default function StreakPage() {
  return (
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, #FFF8E1 0%, ${CREAM} 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      paddingBottom: 100,
    }}>
      <div style={{ padding: '24px 20px 0' }}>
        <Link href="/profile" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: `1px solid ${BROWN}15`, borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 800, color: `${BROWN}60`, marginBottom: 20 }}>
            ← Back
          </div>
        </Link>

        <div style={{ fontSize: 26, fontWeight: 900, color: BROWN, marginBottom: 4 }}>Daily Streak</div>
        <div style={{ fontSize: 14, color: `${BROWN}60`, lineHeight: 1.7, marginBottom: 32 }}>
          Playing every day is the most powerful thing you can do for your brain. Here is what science says happens at each milestone.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {LEVELS.map((level, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 20, padding: '20px',
              boxShadow: `0 2px 12px ${BROWN}08`,
              borderLeft: `4px solid ${level.color}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <img src={`${BASE}/${level.img}`} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                <div style={{ fontSize: 15, fontWeight: 900, color: level.color }}>{level.title}</div>
              </div>
              <p style={{ fontSize: 13, color: `${BROWN}80`, lineHeight: 1.7, marginBottom: 12 }}>
                {level.science}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {level.benefits.map((b, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: level.color, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: `${BROWN}70` }}>{b}</div>
                  </div>
                ))}
              </div>
              <StreakDots current={level.min} color={level.color} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
