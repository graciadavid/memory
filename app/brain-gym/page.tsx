import Link from 'next/link'

export const metadata = {
  title: 'Brain Gym | Free Daily Brain Training | MemGenius',
  description: 'Train your brain with MemGenius Brain Gym. 7-day program with daily workouts for agility, memory, knowledge and logic. Free forever.',
}

const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

const DAYS = [
  { name: 'Agility Day', day: '1 & 5', color: '#FF6F00', href: '/brain-gym/agility-day', desc: 'Reaction time, temporal precision and motor coordination.', exercises: ['Stop', 'F1 Reaction', 'Pendulum'] },
  { name: 'Memory Day', day: '2 & 6', color: '#E91E63', href: '/brain-gym/memory-day', desc: 'Working memory, short-term recall and sequential learning.', exercises: ['N-Back', 'Digits', 'Simon Says'] },
  { name: 'Knowledge Day', day: '3', color: '#1565C0', href: '/brain-gym/knowledge-day', desc: 'Spatial cognition, pattern recognition and world knowledge.', exercises: ['Flags', 'GeoShape', 'Higher or Lower'] },
  { name: 'Logic Day', day: '4', color: '#6A1B9A', href: '/brain-gym/logic-day', desc: 'Deductive reasoning, hypothesis testing and sustained focus.', exercises: ['Mastermind', 'Wordly', 'Sudoku'] },
  { name: 'Brain Age Test', day: '7', color: '#2E7D32', href: '/brain-test', desc: 'Measure your brain age and track your progress.', exercises: ['Full cognitive assessment'] },
]

export default function BrainGymPage() {
  return (
    <main style={{ background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 100 }}>

      <div style={{ background: 'linear-gradient(160deg, #0A0A1A, #0D1B2A)', padding: '48px 24px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>MemGenius</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Brain Gym</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '0 0 24px', lineHeight: 1.6 }}>7 days of daily brain training. Different area each day. Free forever.</p>
        <Link href="/my-plan" style={{ textDecoration: 'none', display: 'inline-block', background: '#2E7D32', color: '#fff', padding: '14px 28px', borderRadius: 14, fontWeight: 900, fontSize: 16, boxShadow: '0 6px 0 #1B5E2060' }}>
          Start my plan · Always free
        </Link>
      </div>

      <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        <section>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 12 }}>What is Brain Gym?</h2>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8, marginBottom: 12 }}>Brain Gym is MemGenius's structured 7-day cognitive training program. Like a physical gym program, it assigns specific exercises to specific days — ensuring your brain gets a complete workout across all cognitive domains within a single week.</p>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8, marginBottom: 12 }}>The program is designed around the principle of cognitive cross-training: different cognitive systems benefit from different types of exercise, and alternating between them allows each system to consolidate its gains while the others are being trained.</p>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8 }}>Each daily session takes between 5 and 20 minutes. The program ends with a Brain Age Test on day 7, giving you a measurable before-and-after comparison.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 16 }}>The weekly program</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DAYS.map((d, i) => (
              <Link key={i} href={d.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 18, padding: '16px 20px', border: '1px solid #4A2C0A08', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                    Day {d.day}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: BROWN, marginBottom: 2 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: `${BROWN}60`, marginBottom: 6 }}>{d.desc}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: d.color }}>{d.exercises.join(' · ')}</div>
                  </div>
                  <div style={{ fontSize: 16, color: `${BROWN}30` }}>→</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 12 }}>Why 7 days?</h2>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8, marginBottom: 12 }}>The 7-day structure is designed to give each cognitive system adequate training frequency and recovery time. Agility and memory each get two sessions per week. Knowledge and logic each get one. The week ends with a Brain Age Test to measure progress.</p>
          <p style={{ fontSize: 15, color: `${BROWN}99`, lineHeight: 1.8 }}>After completing the first week — the Brain Tour — you can start a new 7-day cycle. Over time, you build a training history that shows how your Brain Age evolves with consistent practice.</p>
        </section>

        <section style={{ background: 'linear-gradient(135deg, #0A0A1A, #0D1B2A)', borderRadius: 20, padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Start your Brain Gym today</div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 20, lineHeight: 1.6 }}>Free forever. No login required to try. Your brain age in 4 minutes.</p>
          <Link href="/brain-test" style={{ textDecoration: 'none', display: 'block', background: '#2E7D32', color: '#fff', padding: '16px', borderRadius: 14, fontWeight: 900, fontSize: 16, marginBottom: 10 }}>
            Discover your Brain Age →
          </Link>
          <Link href="/my-plan" style={{ textDecoration: 'none', display: 'block', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '14px', borderRadius: 14, fontWeight: 800, fontSize: 14 }}>
            Start my training plan
          </Link>
        </section>

      </div>
    </main>
  )
}
