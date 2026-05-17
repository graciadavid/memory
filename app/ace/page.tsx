import AceClient from './AceClient'

export const metadata = {
  title: 'Ace — Tennis Timing Game | MemGenius',
  description: 'Hit the ball at the perfect moment. Free online tennis timing game with world ranking. Train your hand-eye coordination and motor precision. No login required.',
}

export default function AcePage() {
  return (
    <>
      <AceClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Ace train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Ace trains hand-eye coordination and interceptive timing — the ability to make contact with a moving object at precisely the right moment. A tennis ball travels across the screen in an arc and you must tap when it passes through a target circle. This requires accurate visual tracking, spatial prediction and precise motor timing.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>This cognitive-motor skill is the same one used in every racket sport, ball sport and any task requiring interception of a moving target. Professional tennis players can process the trajectory of a serve traveling at 200km/h and initiate their return in under 200 milliseconds — a feat that requires extraordinary interceptive timing built through years of deliberate practice.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>A tennis ball moves across the screen in an arc. A circular target marks the sweet spot. Press SERVE when the ball passes through the circle. A perfect hit scores 200 points, a good hit scores 100. Each successful hit increases the ball speed, making the next attempt harder. Five attempts per round — your score reflects how many you hit and how precisely.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Hand-eye coordination and brain health</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Hand-eye coordination involves a complex network of brain regions including the visual cortex, cerebellum, motor cortex and parietal lobe. Training this network through regular interceptive timing exercises produces improvements that transfer to real-world motor tasks and has been shown to slow age-related decline in motor precision.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>Studies of older adults who engage in regular eye-hand coordination training show significantly better performance on tests of fine motor control, balance and reaction time compared to sedentary peers of the same age. Ace provides exactly this type of training in a format that takes under two minutes per session.</p>
      </div>
    </>
  )
}
