import MastermindClient from './MastermindClient'

export const metadata = {
  title: 'Mastermind — Color Code Logic Game | MemGenius',
  description: 'Crack the color code in 7 attempts. Free online Mastermind game with world ranking. Train your deductive reasoning and logical thinking. No login required.',
}

export default function MastermindPage() {
  return (
    <>
      <MastermindClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Mastermind train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Mastermind trains deductive reasoning — the ability to draw logical conclusions from incomplete information. Each guess provides feedback that constrains the solution space. The optimal player uses this feedback systematically to eliminate possibilities and converge on the correct answer. This is exactly the cognitive process used in scientific reasoning, medical diagnosis and strategic planning.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Deductive reasoning is a component of fluid intelligence — the ability to solve novel problems without relying on prior knowledge. It is one of the cognitive abilities most sensitive to aging and most responsive to training. Regular practice with deductive reasoning tasks has been shown to improve performance on general problem-solving assessments.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>A secret code of 5 colors is generated from a palette of 5 options. You have 7 attempts to crack it. After each guess, colored borders indicate how close you are — green means correct position, pink means correct color in wrong position, no border means the color is not in the code. Colors in the correct position are automatically carried forward to your next guess.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>The mathematics of Mastermind</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Mastermind has attracted serious mathematical attention since its invention in 1970. In 1977, Donald Knuth proved that the classic six-color, four-position version can always be solved in five or fewer guesses using an optimal strategy. The MemGenius version uses five colors and five positions, creating a larger solution space that rewards more sophisticated deductive strategies.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>The fastest Mastermind players think several moves ahead, selecting guesses that maximize information gain regardless of the answer. This strategic depth makes Mastermind one of the richest brain training games available — deceptively simple to learn but genuinely demanding to master.</p>
      </div>
    </>
  )
}
