import RelatedGames from '@/components/RelatedGames'
import PendulumClient from './PendulumClient'

export const metadata = {
  title: 'Pendulum — Precision Timing Game | MemGenius',
  description: 'Stop the pendulum at the center. Free online precision timing game with world ranking. Train your motor timing and spatial attention. No login required.',
}

export default function PendulumPage() {
  return (
    <>
      <PendulumClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Pendulum train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Pendulum trains motor timing and spatial attention — the ability to intercept a moving object at a precise point in space and time. This cognitive-motor skill is fundamental to sports, music and any task requiring coordination between visual tracking and motor response.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Unlike simple reaction time, which measures how fast you respond to a sudden stimulus, Pendulum measures anticipatory timing — predicting where a moving object will be and preparing your response in advance. This is a more complex and cognitively demanding skill that engages the cerebellum, basal ganglia and parietal cortex simultaneously.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>A pendulum swings back and forth on screen. Press Stop at the exact moment the pendulum reaches the center of its arc. Your score is measured in milliseconds of deviation from the perfect center position. The closer to zero, the higher your world ranking. The pendulum maintains a consistent rhythm — learning to anticipate it is key to improving your score.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Anticipatory timing in everyday life</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Anticipatory timing is one of the most underappreciated cognitive skills. It underlies the ability to catch a ball, merge onto a motorway, play a musical instrument in time with others, and execute precise movements in sport. Elite athletes demonstrate measurably superior anticipatory timing compared to recreational athletes, and this advantage is largely trainable.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>Daily practice with Pendulum builds the neural circuits responsible for temporal prediction and motor preparation. Improvements typically become measurable within two to three weeks of consistent daily practice.</p>
      <RelatedGames category='agility' current='Pendulum' />
      </div>
    </>
  )
}
