import SequenceClient from './SequenceClient'

export const metadata = {
  title: 'Simon Says — Pattern Memory Game | MemGenius',
  description: 'Repeat the color pattern in Simon Says. Free online memory game with world ranking. Train your sequential memory and attention. No login required.',
}

export default function SequencePage() {
  return (
    <>
      <SequenceClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Simon Says train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Simon Says trains sequential memory — the ability to remember and reproduce a series of items in the exact order they appeared. This is distinct from simple recall because it requires both memory and attention to sequence, engaging the hippocampus and the prefrontal cortex simultaneously.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Sequential memory is used every time you follow a multi-step process, learn a dance routine, play a musical instrument or reproduce a spoken sentence. It is one of the core cognitive abilities that distinguishes expert performers from novices in almost every domain.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>A sequence of colored buttons lights up one at a time. Watch carefully. When the sequence ends, repeat it by tapping the buttons in the same order. Each correct round adds one more step to the sequence. One mistake ends the game. Your score is the longest sequence you reproduced correctly.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Why Simon Says is more than a children's game</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>The original Simon electronic game was used in cognitive research in the 1980s to study working memory and attention. Studies consistently show that children who perform well on Simon-type tasks also perform well on academic measures of reading and mathematics. Adults who train with sequence memory games show improvements in attention control and the ability to suppress distracting information.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>Children beat adults at this game on average. That should concern you — and motivate you to practice daily.</p>
      </div>
    </>
  )
}
