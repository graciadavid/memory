import Link from 'next/link'

export const metadata = {
  title: 'Agility Day Brain Training | Free Daily Workout | MemGenius',
  description: 'Train your brain\'s reaction time, temporal precision and motor coordination with MemGenius Agility Day. Free daily brain workout with Stop, F1 Reaction and Pendulum exercises.',
}

const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const COLOR = '#FF6F00'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const EXERCISES = [
  {
    name: 'Stop',
    icon: `${BASE}/precision.png`,
    reps: '×3',
    href: '/precision/stopwatch',
    desc: 'Stop the timer at exactly 5 seconds without counting. This exercise trains your brain\'s internal clock — the basal ganglia circuit responsible for temporal processing. Studies show that timing tasks improve interval perception and are directly linked to better impulse control and attention.',
  },
  {
    name: 'F1 Reaction',
    icon: `${BASE}/f1.png`,
    reps: '×3',
    href: '/precision/formula1',
    desc: 'React to a visual stimulus as fast as possible. The average human reaction time is 250ms. Formula 1 drivers react in around 200ms. This exercise trains the corticospinal pathway — the neural route from visual cortex to motor response — making it faster and more reliable with practice.',
  },
  {
    name: 'Pendulum',
    icon: `${BASE}/pendulum.png`,
    reps: '×3',
    href: '/precision/pendulum',
    desc: 'Stop the pendulum at the exact center. This combines visual tracking, timing and motor precision. It activates the cerebellum — the brain region that fine-tunes movement and timing — and improves hand-eye coordination and spatial processing.',
  },
]

const FAQS = [
  {
    q: 'How long does Agility Day take?',
    a: 'Around 5 to 8 minutes. Each exercise takes under 2 minutes and you do 3 repetitions of each. The workout is designed to fit into any schedule.',
  },
  {
    q: 'How quickly will I see improvement?',
    a: 'Most people notice measurable improvement in reaction time within 5 to 7 days of daily practice. The brain\'s agility circuits respond quickly to targeted training.',
  },
  {
    q: 'Is Agility Day scientifically backed?',
    a: 'Yes. The exercises are based on established cognitive neuroscience research. Stop and Pendulum train the basal ganglia\'s timing circuits. F1 Reaction trains the corticospinal pathway. Both have extensive peer-reviewed research behind them.',
  },
  {
    q: 'Do I need to do Agility Day every day?',
    a: 'No. In the MemGenius Brain Gym, Agility Day appears on days 1 and 5 of the weekly plan. The other days focus on Memory, Knowledge and Logic — giving your agility circuits time to consolidate the training.',
  },
  {
    q: 'Who benefits most from agility training?',
    a: 'Everyone, but especially people over 40. Reaction time naturally slows with age starting in the mid-twenties. Regular agility training has been shown to slow this decline and in many cases reverse it.',
  },
]

export default function AgilityDayPage() {
  return (
    <main style={{ background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 100 }}>

      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, ${COLOR}, ${COLOR}BB)`, padding: '48px 24px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Brain Gym · Day 1 & 5</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Agility Day</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', margin: '0 0 24px', lineHeight: 1.6 }}>Train your brain's reaction time and temporal precision in under 10 minutes.</p>
        <Link href="/my-plan" style={{ textDecoration: 'none', display: 'inline-block', background: '#fff', color: COLOR, padding: '14px 28px', borderRadius: 14, fontWeight: 900, fontSize: 16, boxShadow: '0 6px 0 rgba(0,0,0,0.15)' }}>
          Start my plan · Always free
        </Link>
      </div>

      <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* What is */}
        <section>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 12 }}>What is Agility Day?</h2>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8, marginBottom: 12 }}>Agility Day is the first workout in the MemGenius Brain Gym weekly plan. It focuses on the cognitive functions that govern how fast and how accurately your brain processes time and reacts to stimuli.</p>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8, marginBottom: 12 }}>Reaction time, temporal precision and motor coordination are among the most trainable cognitive abilities. Research published in Frontiers in Human Neuroscience shows that regular timing tasks produce measurable improvements in neural processing speed within two to three weeks of consistent practice.</p>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8 }}>Unlike memory or knowledge training, agility training shows rapid results. Most people notice improvement in their reaction time within the first week of daily practice.</p>
        </section>

        {/* Exercises */}
        <section>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 16 }}>Today's exercises</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {EXERCISES.map((ex, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', border: '1px solid #4A2C0A08' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <img src={ex.icon} alt={ex.name} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: BROWN }}>{ex.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: COLOR }}>{ex.reps} repetitions</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: `${BROWN}80`, lineHeight: 1.7, margin: 0 }}>{ex.desc}</p>
                <Link href={ex.href} style={{ textDecoration: 'none', display: 'inline-block', marginTop: 10, background: `${COLOR}15`, color: COLOR, padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 900 }}>
                  Try {ex.name} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 12 }}>Cognitive benefits</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { title: 'Faster reaction time', desc: 'Repeated timing tasks strengthen the neural pathways from stimulus to response, reducing reaction time by up to 20% in 30 days.' },
              { title: 'Better impulse control', desc: 'Temporal precision training activates the prefrontal cortex\'s inhibitory circuits, improving your ability to pause before reacting.' },
              { title: 'Improved attention', desc: 'Agility exercises require sustained focus on a single stimulus, training the attentional networks that govern concentration.' },
              { title: 'Slower cognitive aging', desc: 'Reaction time is one of the first cognitive abilities to decline with age. Regular agility training has been shown to slow and partially reverse this decline.' },
            ].map((b, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', border: '1px solid #4A2C0A08' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: BROWN, marginBottom: 4 }}>{b.title}</div>
                <p style={{ fontSize: 13, color: `${BROWN}70`, lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 16 }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '16px 18px', border: '1px solid #4A2C0A08' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: BROWN, marginBottom: 6 }}>{faq.q}</div>
                <p style={{ fontSize: 13, color: `${BROWN}70`, lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: `linear-gradient(135deg, ${COLOR}, ${COLOR}BB)`, borderRadius: 20, padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Ready to train your brain?</div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20, lineHeight: 1.6 }}>Join thousands of people training their brain daily with MemGenius. Free forever.</p>
          <Link href="/my-plan" style={{ textDecoration: 'none', display: 'block', background: '#fff', color: COLOR, padding: '16px', borderRadius: 14, fontWeight: 900, fontSize: 16 }}>
            Start my plan · Always free
          </Link>
        </section>

      </div>
    </main>
  )
}
