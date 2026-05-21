import Link from 'next/link'

export const metadata = {
  title: 'Memory Day Brain Training | Free Daily Workout | MemGenius',
  description: 'Train your working memory and short-term recall with MemGenius Memory Day. Free daily brain workout with N-Back, Digits and Simon Says exercises.',
}

const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const COLOR = '#E91E63'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const EXERCISES = [
  {
    name: 'N-Back',
    icon: `${BASE}/nback.png`,
    reps: '×2',
    href: '/nback',
    desc: 'Remember whether the current stimulus matches the one from N steps back. The N-Back task is one of the most studied cognitive exercises in neuroscience with over 5,000 published papers. It directly trains working memory capacity — the mental workspace that holds and manipulates information in real time.',
  },
  {
    name: 'Digits',
    icon: `${BASE}/digits.webp`,
    reps: '×3',
    href: '/digits',
    desc: 'Memorize and recall increasingly long sequences of digits. Digit span is the classic measure of short-term memory capacity. Training it improves your ability to hold information in mind while processing other tasks — essential for reading comprehension, mental arithmetic and decision making.',
  },
  {
    name: 'Simon Says',
    icon: `${BASE}/sequence.webp`,
    reps: '×3',
    href: '/sequence',
    desc: 'Repeat color sequences of increasing length. Sequential memory training strengthens the hippocampal circuits responsible for encoding new information. Research shows it improves both immediate recall and the transfer of information from short-term to long-term memory.',
  },
]

const FAQS = [
  {
    q: 'What is working memory and why does it matter?',
    a: 'Working memory is your brain\'s mental workspace — the system that holds and manipulates information in the moment. It underlies reading comprehension, mental arithmetic, decision making and virtually every complex cognitive task. Low working memory capacity is one of the strongest predictors of academic and professional performance.',
  },
  {
    q: 'Does N-Back training actually improve intelligence?',
    a: 'The research is mixed but compelling. Several studies, including a landmark 2008 paper by Jaeggi et al., showed that N-Back training transferred to improvements in fluid intelligence. More recent meta-analyses suggest the effect is real but modest. The most consistent finding is improvement in working memory capacity itself.',
  },
  {
    q: 'How many days until I notice improvement?',
    a: 'Most people notice subjective improvement in 7 to 14 days. Objective measurable improvement — higher scores on the N-Back task or longer digit spans — typically appears within 2 to 3 weeks of daily practice.',
  },
  {
    q: 'Is Memory Day suitable for older adults?',
    a: 'Especially so. Working memory is one of the cognitive functions most affected by aging. Regular memory training has been shown to slow age-related decline and in many cases produce genuine improvements in recall ability in adults over 60.',
  },
  {
    q: 'How does Memory Day fit into the weekly Brain Gym plan?',
    a: 'Memory Day appears on days 2 and 6 of the MemGenius weekly plan, giving your memory circuits two dedicated training sessions per week with adequate recovery time between them.',
  },
]

export default function MemoryDayPage() {
  return (
    <main style={{ background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 100 }}>

      <div style={{ background: `linear-gradient(160deg, ${COLOR}, ${COLOR}BB)`, padding: '48px 24px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Brain Gym · Day 2 & 6</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Memory Day</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', margin: '0 0 24px', lineHeight: 1.6 }}>Train your working memory and short-term recall in under 10 minutes.</p>
        <Link href="/my-plan" style={{ textDecoration: 'none', display: 'inline-block', background: '#fff', color: COLOR, padding: '14px 28px', borderRadius: 14, fontWeight: 900, fontSize: 16, boxShadow: '0 6px 0 rgba(0,0,0,0.15)' }}>
          Start my plan · Always free
        </Link>
      </div>

      <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        <section>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 12 }}>What is Memory Day?</h2>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8, marginBottom: 12 }}>Memory Day targets the cognitive systems responsible for holding and manipulating information in real time. Working memory — the brain's mental scratchpad — is one of the strongest predictors of academic performance, professional effectiveness and overall cognitive health.</p>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8, marginBottom: 12 }}>Unlike long-term memory, which stores information over days and years, working memory operates in the moment. It is what allows you to follow a conversation, do mental arithmetic, read a paragraph and understand it, or hold a phone number in mind long enough to dial it.</p>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8 }}>Memory Day combines three exercises that target different aspects of short-term and working memory, giving your brain a complete memory workout in under 10 minutes.</p>
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
              { title: 'Expanded working memory capacity', desc: 'Regular N-Back and digit span training has been shown to increase the number of items your working memory can hold simultaneously.' },
              { title: 'Better focus and concentration', desc: 'Working memory training strengthens the prefrontal cortex circuits that filter distractions and maintain task focus.' },
              { title: 'Improved learning ability', desc: 'A larger working memory capacity means your brain can process and encode more information per unit of time, accelerating learning.' },
              { title: 'Slower memory decline', desc: 'Working memory is among the first cognitive functions to decline with age. Regular training has been shown to slow this process significantly.' },
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
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Ready to train your memory?</div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20, lineHeight: 1.6 }}>Join thousands of people training their brain daily with MemGenius. Free forever.</p>
          <Link href="/my-plan" style={{ textDecoration: 'none', display: 'block', background: '#fff', color: COLOR, padding: '16px', borderRadius: 14, fontWeight: 900, fontSize: 16 }}>
            Start my plan · Always free
          </Link>
        </section>

      </div>
    </main>
  )
}
