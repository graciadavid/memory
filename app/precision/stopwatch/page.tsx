import RelatedGames from '@/components/RelatedGames'
import StopClient from './StopClient'

export const metadata = {
  title: 'Stop — Precision Timing Game | MemGenius',
  description: 'Stop the timer at exactly 5 seconds. Free online precision timing game with world ranking. Train your internal clock and time perception. No login required.',
}

export default function StopPage() {
  return (
    <>
      <StopClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Stop train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Stop trains temporal precision — your brain's internal clock and its ability to measure the passage of time without external reference. This cognitive function is located primarily in the basal ganglia and cerebellum, and it underlies a surprisingly wide range of everyday abilities including rhythm, coordination, attention and impulse control.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>People with better time perception perform better on tasks requiring sustained attention, make fewer impulsive decisions and show better performance in sports requiring precise timing. Formula 1 drivers, professional musicians and elite athletes all demonstrate measurably superior temporal precision compared to the general population.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Press Start. A timer begins counting. Press Stop when you think exactly 5 seconds have passed. Your score is measured in milliseconds of deviation from 5.000 seconds. The closer you are to zero, the higher your rank on the world leaderboard. No counting allowed — you must rely purely on your internal sense of time.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Can you train your internal clock?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Yes. Time perception is one of the most trainable cognitive abilities. Studies show that regular practice with timing tasks produces measurable improvements in temporal accuracy within two to three weeks. The improvement transfers partially to other timing tasks, suggesting genuine plasticity in the neural circuits responsible for time perception.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>Top players on the MemGenius Stop ranking consistently stop within 10-20 milliseconds of the 5-second target. That level of precision is achievable with daily practice. The world record holders are not superhuman — they simply trained their internal clock until it became reliable.</p>
      <RelatedGames category='agility' current='Stop' />
      </div>
    </>
  )
}
