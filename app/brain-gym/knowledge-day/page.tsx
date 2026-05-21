import Link from 'next/link'

export const metadata = {
  title: 'Knowledge Day Brain Training | Free Daily Workout | MemGenius',
  description: 'Train your spatial cognition and world knowledge with MemGenius Knowledge Day. Free daily brain workout with Flags, GeoShape and Higher or Lower exercises.',
}

const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const COLOR = '#1565C0'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const EXERCISES = [
  {
    name: 'Flags',
    icon: `${BASE}/flags.png`,
    reps: '×5',
    href: '/flags',
    desc: 'Identify country flags as fast as possible. Flag recognition trains visual pattern recognition and semantic memory — the long-term store of factual knowledge. It also activates the right hemisphere\'s spatial processing regions, which are responsible for recognizing and categorizing visual patterns.',
  },
  {
    name: 'GeoShape',
    icon: `${BASE}/mapamundi.png`,
    reps: '×3',
    href: '/geoshape',
    desc: 'Identify countries from their geographic shape. This exercise combines spatial reasoning with geographic knowledge, activating both the parietal cortex responsible for spatial processing and the hippocampus which stores geographic and contextual memory.',
  },
  {
    name: 'Higher or Lower',
    icon: `${BASE}/versus.png`,
    reps: '×5',
    href: '/versus',
    desc: 'Compare countries by population or area. This exercise trains numerical reasoning and semantic knowledge simultaneously. It activates the intraparietal sulcus — the brain region responsible for numerical processing — alongside the prefrontal cortex\'s decision-making circuits.',
  },
]

const FAQS = [
  {
    q: 'Why is geographic knowledge a cognitive workout?',
    a: 'Geographic knowledge activates multiple brain systems simultaneously — spatial processing, visual pattern recognition, semantic memory and numerical reasoning. This cross-system activation is one of the most effective forms of cognitive training.',
  },
  {
    q: 'What cognitive skills does Knowledge Day train?',
    a: 'Spatial reasoning, visual pattern recognition, semantic memory, numerical comparison and decision speed. Knowledge Day is the most cognitively diverse workout in the Brain Gym weekly plan.',
  },
  {
    q: 'Do I need to know geography to do Knowledge Day?',
    a: 'No. The exercises start at a level accessible to everyone and become progressively more challenging. You will naturally learn more geography as you train, which is an additional benefit.',
  },
  {
    q: 'How does knowledge training help my brain?',
    a: 'Building a rich semantic knowledge base creates more neural connections, which research associates with greater cognitive reserve — the brain\'s resilience against age-related decline and neurological conditions.',
  },
  {
    q: 'How does Knowledge Day fit in the weekly plan?',
    a: 'Knowledge Day appears on day 3 of the MemGenius weekly plan. It provides a cognitive contrast to the speed-focused Agility Day and the recall-focused Memory Day, giving your brain a complete weekly workout.',
  },
]

export default function KnowledgeDayPage() {
  return (
    <main style={{ background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 100 }}>

      <div style={{ background: `linear-gradient(160deg, ${COLOR}, ${COLOR}BB)`, padding: '48px 24px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Brain Gym · Day 3</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Knowledge Day</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', margin: '0 0 24px', lineHeight: 1.6 }}>Train your spatial cognition and world knowledge in under 10 minutes.</p>
        <Link href="/my-plan" style={{ textDecoration: 'none', display: 'inline-block', background: '#fff', color: COLOR, padding: '14px 28px', borderRadius: 14, fontWeight: 900, fontSize: 16, boxShadow: '0 6px 0 rgba(0,0,0,0.15)' }}>
          Start my plan · Always free
        </Link>
      </div>

      <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        <section>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 12 }}>What is Knowledge Day?</h2>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8, marginBottom: 12 }}>Knowledge Day is the most cognitively diverse workout in the Brain Gym weekly plan. It trains spatial reasoning, visual pattern recognition, semantic memory and numerical processing — all in a single session.</p>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8, marginBottom: 12 }}>Geographic knowledge is a particularly powerful form of cognitive training because it requires the simultaneous activation of multiple brain systems. When you identify a flag or recognize a country shape, you engage visual cortex, parietal spatial processing, hippocampal memory and prefrontal decision-making all at once.</p>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8 }}>Research on cognitive reserve — the brain's resilience against age-related decline — shows that people with richer semantic knowledge networks maintain sharper cognition later in life.</p>
        </section>

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

        <section>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 12 }}>Cognitive benefits</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { title: 'Stronger spatial reasoning', desc: 'Geographic shape recognition activates and strengthens the parietal cortex\'s spatial processing circuits, which underlie navigation, geometry and mechanical reasoning.' },
              { title: 'Richer semantic memory', desc: 'Building a large network of factual knowledge creates more neural connections, which research associates with greater cognitive reserve and resilience against decline.' },
              { title: 'Faster pattern recognition', desc: 'Flag training improves the visual system\'s ability to rapidly categorize complex visual patterns — a skill that transfers to face recognition, reading and visual search.' },
              { title: 'Better numerical intuition', desc: 'Comparing countries by population and area trains the brain\'s approximate number system, improving numerical reasoning and quantitative intuition.' },
            ].map((b, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', border: '1px solid #4A2C0A08' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: BROWN, marginBottom: 4 }}>{b.title}</div>
                <p style={{ fontSize: 13, color: `${BROWN}70`, lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

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

        <section style={{ background: `linear-gradient(135deg, ${COLOR}, ${COLOR}BB)`, borderRadius: 20, padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Ready to expand your brain?</div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20, lineHeight: 1.6 }}>Join thousands of people training their brain daily with MemGenius. Free forever.</p>
          <Link href="/my-plan" style={{ textDecoration: 'none', display: 'block', background: '#fff', color: COLOR, padding: '16px', borderRadius: 14, fontWeight: 900, fontSize: 16 }}>
            Start my plan · Always free
          </Link>
        </section>

      </div>
    </main>
  )
}
