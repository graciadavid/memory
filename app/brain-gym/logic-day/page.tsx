import Link from 'next/link'

export const metadata = {
  title: 'Logic Day Brain Training | Free Daily Workout | MemGenius',
  description: 'Train your logical thinking and deductive reasoning with MemGenius Logic Day. Free daily brain workout with Mastermind, Wordly and Sudoku exercises.',
}

const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const COLOR = '#6A1B9A'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const EXERCISES = [
  {
    name: 'Mastermind',
    icon: `${BASE}/mastermind.png`,
    reps: '×1',
    href: '/mastermind',
    desc: 'Crack the hidden color code using logical deduction. Each guess gives you feedback that you must use to systematically eliminate possibilities. Mastermind trains hypothesis testing, logical inference and working memory — the same cognitive skills used in scientific reasoning and strategic planning.',
  },
  {
    name: 'Wordly',
    icon: `${BASE}/wordly.png`,
    reps: '×1',
    href: '/wordly',
    desc: 'Guess the hidden word in six attempts using letter-by-letter feedback. Wordly trains semantic search — your brain\'s ability to systematically navigate its lexical knowledge — alongside logical deduction and hypothesis elimination. Research shows that word-finding exercises strengthen the left hemisphere\'s language networks.',
  },
  {
    name: 'Sudoku',
    icon: `${BASE}/sudoku.png`,
    reps: '×1',
    href: '/sudoku',
    desc: 'Complete the number grid using pure logical deduction. Sudoku requires holding multiple constraints in working memory simultaneously while systematically eliminating possibilities. It is one of the most comprehensive single-task exercises for training logical reasoning and sustained concentration.',
  },
]

const FAQS = [
  {
    q: 'What cognitive skills does Logic Day train?',
    a: 'Deductive reasoning, hypothesis testing, systematic elimination, working memory under load, sustained concentration and strategic planning. Logic Day is the most cognitively demanding workout in the Brain Gym weekly plan.',
  },
  {
    q: 'Is Sudoku really good for your brain?',
    a: 'Yes. Sudoku requires the simultaneous management of multiple logical constraints, which is cognitively demanding in a way that few other tasks match. Studies have associated regular Sudoku practice with better working memory performance and slower cognitive aging.',
  },
  {
    q: 'How long does Logic Day take?',
    a: 'Between 10 and 20 minutes depending on your speed. Logic Day is the longest workout in the weekly plan because each exercise requires sustained engagement rather than rapid repetition.',
  },
  {
    q: 'Is Logic Day harder than the other workouts?',
    a: 'It is more cognitively demanding but not harder in the sense of requiring special skills. All exercises start accessible and become progressively challenging. The difficulty is in sustaining logical focus rather than in speed or recall.',
  },
  {
    q: 'How does Logic Day fit in the weekly plan?',
    a: 'Logic Day appears on day 4 — the midpoint of the week — providing a contrast to the speed and recall exercises of the first half of the plan. It gives your agility and memory circuits a relative rest while training your reasoning systems.',
  },
]

export default function LogicDayPage() {
  return (
    <main style={{ background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 100 }}>

      <div style={{ background: `linear-gradient(160deg, ${COLOR}, ${COLOR}BB)`, padding: '48px 24px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Brain Gym · Day 4</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Logic Day</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', margin: '0 0 24px', lineHeight: 1.6 }}>Train your logical thinking and deductive reasoning in under 20 minutes.</p>
        <Link href="/my-plan" style={{ textDecoration: 'none', display: 'inline-block', background: '#fff', color: COLOR, padding: '14px 28px', borderRadius: 14, fontWeight: 900, fontSize: 16, boxShadow: '0 6px 0 rgba(0,0,0,0.15)' }}>
          Start my plan · Always free
        </Link>
      </div>

      <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        <section>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 12 }}>What is Logic Day?</h2>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8, marginBottom: 12 }}>Logic Day is the most cognitively demanding workout in the Brain Gym weekly plan. It targets the prefrontal cortex circuits responsible for systematic reasoning, hypothesis testing and sustained logical focus.</p>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8, marginBottom: 12 }}>Unlike agility and memory training, which improve through rapid repetition, logic training improves through depth of engagement. Each Logic Day exercise requires sustained attention and systematic thinking — the kind of focused reasoning that most people rarely exercise in daily life.</p>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8 }}>Research on cognitive aging shows that people who regularly engage in logical problem-solving maintain sharper reasoning abilities well into their seventies and beyond.</p>
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
                    <div style={{ fontSize: 12, fontWeight: 800, color: COLOR }}>{ex.reps} repetition</div>
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
              { title: 'Sharper deductive reasoning', desc: 'Systematic problem-solving exercises strengthen the prefrontal cortex\'s logical inference circuits, improving your ability to reason from evidence to conclusions.' },
              { title: 'Better hypothesis testing', desc: 'Mastermind and Sudoku require forming and testing hypotheses — the cognitive skill at the heart of scientific thinking, medical diagnosis and strategic planning.' },
              { title: 'Improved sustained concentration', desc: 'Logic exercises require maintaining focus on a complex problem for 5 to 15 minutes without distraction — training the attentional networks responsible for deep work.' },
              { title: 'Greater cognitive reserve', desc: 'Regular engagement with demanding logical problems has been associated with greater cognitive reserve — the brain\'s resilience against age-related decline and neurological conditions.' },
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
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Ready to sharpen your logic?</div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20, lineHeight: 1.6 }}>Join thousands of people training their brain daily with MemGenius. Free forever.</p>
          <Link href="/my-plan" style={{ textDecoration: 'none', display: 'block', background: '#fff', color: COLOR, padding: '16px', borderRadius: 14, fontWeight: 900, fontSize: 16 }}>
            Start my plan · Always free
          </Link>
        </section>

      </div>
    </main>
  )
}
