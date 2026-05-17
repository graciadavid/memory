import F1Client from './F1Client'

export const metadata = {
  title: 'F1 Reaction — Reaction Time Game | MemGenius',
  description: 'React when the Formula 1 lights go out. Free online reaction time game with world ranking. Test and train your reaction speed. No login required.',
}

export default function F1Page() {
  return (
    <>
      <F1Client />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does F1 Reaction train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>F1 Reaction trains simple reaction time — the speed of your response to a visual stimulus. This is the most basic measure of neural processing speed, reflecting how quickly your brain detects a signal, processes it and sends a motor command to your hand. Formula 1 drivers react in approximately 150 milliseconds. The average person takes 200-250 milliseconds.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Reaction time peaks in the early twenties and declines measurably from the late twenties onward, with acceleration after fifty. However, unlike many cognitive abilities, reaction time responds well to training and can be maintained at near-peak levels through regular practice well into middle age.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Five red lights illuminate one by one, just like the start of a Formula 1 race. When all five lights go out, tap the screen as fast as possible. Your reaction time is measured in milliseconds. The faster your response, the higher your position on the world ranking. False starts — tapping before the lights go out — count as a penalty.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Reaction time and cognitive health</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Reaction time is one of the strongest predictors of overall cognitive health. A large study of over 5,000 adults found that slower reaction time at age 50 predicted faster cognitive decline over the following decade. This makes reaction time training not just a performance measure but a meaningful indicator of brain health.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>Daily practice with F1 Reaction improves the speed of your visuomotor loop — the circuit connecting your eyes, brain and hands. This improvement transfers to real-world tasks including driving, sports and any activity requiring rapid response to visual cues.</p>
      </div>
    </>
  )
}
