import RelatedGames from '@/components/RelatedGames'
import SudokuClient from './SudokuClient'

export const metadata = {
  title: 'Sudoku — Logic Puzzle Game | MemGenius',
  description: 'Solve Sudoku puzzles as fast as possible. Free online Sudoku with world ranking. Easy, Medium and Hard difficulty. Train your logical reasoning and concentration. No login required.',
}

export default function SudokuPage() {
  return (
    <>
      <SudokuClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Sudoku train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Sudoku trains logical reasoning, concentration and working memory simultaneously. Solving a puzzle requires holding multiple constraints in mind, applying systematic elimination techniques and recognizing patterns across rows, columns and boxes. This multi-system cognitive engagement makes Sudoku one of the most comprehensive brain training activities available.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>A large study of over 19,000 adults aged 50 and above found that people who regularly solve number puzzles have working memory scores equivalent to someone ten years younger. The effect was dose-dependent — daily players showed significantly greater benefits than weekly players, and the gains persisted even after controlling for education and general health.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Fill a 9x9 grid so that every row, every column and every 3x3 box contains the digits 1 through 9 exactly once. Some digits are provided as starting clues — the fewer the clues, the harder the puzzle. On MemGenius, your solving time is recorded and submitted to a world ranking. Choose Easy, Medium or Hard difficulty depending on your skill level.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Sudoku and cognitive aging</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Sudoku is one of the most evidence-backed brain training activities for adults over 50. Its combination of logical constraint satisfaction, pattern recognition and sustained concentration engages cognitive systems that are particularly vulnerable to age-related decline. The structured nature of Sudoku — unlike many games, there is always a logical path to the solution — means that improvement is directly measurable and motivating.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>The competitive element on MemGenius — a live world ranking showing your solving time against players worldwide — adds a dimension that transforms Sudoku from a solitary activity into a global competition. This social motivation significantly increases engagement and the frequency of daily practice, amplifying the cognitive benefits.</p>
      <RelatedGames category='logic' current='Sudoku' />
      </div>
    </>
  )
}
