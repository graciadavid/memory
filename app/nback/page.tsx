import RelatedGames from '@/components/RelatedGames'
import NBackClient from './NBackClient'

export const metadata = {
  title: 'N-Back — Working Memory Game | MemGenius',
  description: 'Is it the same color as before? Free online N-Back working memory game with world ranking. The most scientifically validated brain training task. No login required.',
}

export default function NBackPage() {
  return (
    <>
      <NBackClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What is the N-Back task?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>The N-Back task is one of the most studied cognitive assessments in neuroscience. Originally developed in 1958 by Wayne Kirchner, it has been used in thousands of published studies on working memory, attention and fluid intelligence. The MemGenius version uses the 1-Back variant — you must decide whether the current stimulus matches the one that appeared immediately before it.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Working memory — the cognitive system that holds and manipulates information in real time — is the most predictive single measure of general intelligence and academic performance. It is also one of the first systems to show decline with aging, making it a critical target for cognitive training.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>A colored card appears for 2 seconds and then disappears. A new colored card appears. You must decide whether the new color is the same as the previous one. Tap Same or Different. Each correct answer extends your streak. One mistake ends the game. Your score is the number of consecutive correct answers.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Does N-Back training actually work?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>This is one of the most debated questions in cognitive science. A landmark 2008 study by Jaeggi and colleagues claimed that N-Back training produced significant gains in fluid intelligence. Subsequent research has been mixed, but a consistent finding is that N-Back training reliably improves performance on working memory tasks and attention control.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>The consensus today is that N-Back training is one of the most effective brain training paradigms available — far more evidence-backed than most commercial brain training products. Daily practice of 15-20 minutes produces measurable improvements in working memory capacity within four to six weeks.</p>
      <RelatedGames category='memory' current='N-Back' />
      </div>
    </>
  )
}
