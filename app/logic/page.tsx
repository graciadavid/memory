import CategoryRelated from '@/components/CategoryRelated'
import Link from 'next/link'
import RelatedGames from '@/components/RelatedGames'

const COLOR = '#E65100'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export const metadata = {
  title: 'Logic Games — Strategy, Reasoning & Problem Solving | MemGenius',
  description: 'Train your logical reasoning with 5 free logic games: Sudoku, Mastermind, 2048, Wordly and Blackjack. World rankings. No login required.',
}

const GAMES = [
  { label: 'Sudoku', icon: `${BASE}/sudoku.png`, href: '/sudoku', desc: 'Fill the grid with logic' },
  { label: 'Mastermind', icon: `${BASE}/mastermind.png`, href: '/mastermind', desc: 'Crack the color code' },
  { label: '2048', icon: `${BASE}/2048.png`, href: '/2048', desc: 'Merge tiles to reach 2048' },
  { label: 'Wordly', icon: `${BASE}/wordly.png`, href: '/wordly', desc: 'Guess the hidden word' },
  { label: 'Blackjack', icon: `${BASE}/blackjack.png`, href: '/blackjack', desc: 'Grow your stack, cash out at your peak' },
  { label: 'Tetris', icon: `${BASE}/tetris.png`, href: '/tetris', desc: 'Stack blocks, clear lines, beat the world' },
]

export default function LogicPage() {
  return (
    <>
      <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>
        <div style={{ fontSize:11, fontWeight:800, color:COLOR, letterSpacing:3, textTransform:'uppercase', marginBottom:4 }}>Category</div>
        <div style={{ fontSize:32, fontWeight:900, color:'#fff', marginBottom:8 }}>Logic</div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.35)', fontWeight:700, marginBottom:32 }}>Challenge your reasoning and strategy</div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {GAMES.map(g => (
            <Link key={g.label} href={g.href} style={{ textDecoration:'none' }}>
              <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, border:'1px solid rgba(255,255,255,0.08)' }}>
                <img src={g.icon} style={{ width:52, height:52, objectFit:'contain', flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:17, fontWeight:900, color:'#fff', marginBottom:4 }}>{g.label}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{g.desc}</div>
                </div>
                <div style={{ fontSize:18, color:'rgba(255,255,255,0.2)' }}>→</div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Logic train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>Logic games train the prefrontal cortex — the brain's centre of executive function, planning, reasoning and decision-making. Unlike memory or reaction time, logical reasoning requires you to hold a problem in mind, generate hypotheses, test them systematically and update your strategy based on feedback. This is the cognitive skill most associated with intelligence, academic performance and professional success.</p>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Sudoku — constraint-based deduction
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Sudoku is the purest form of logical deduction available as a game. Each puzzle has exactly one solution reachable through pure logic — no guessing required. You must identify which numbers are forced by the constraints of rows, columns and 3×3 boxes, progressively narrowing the solution space until the grid is complete.</p>
            <p>Research shows that regular Sudoku practice improves working memory, concentration and the ability to track multiple constraints simultaneously. These skills transfer directly to programming, mathematics, legal reasoning and any field requiring systematic problem-solving.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Mastermind — hypothesis testing and elimination
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Mastermind is a game of scientific reasoning. Each guess is an experiment, and each response gives you partial information about the hidden code. The optimal player uses each response to maximally eliminate possibilities, converging on the answer in the minimum number of guesses.</p>
            <p>This is exactly the reasoning process used in scientific hypothesis testing, medical diagnosis and debugging code. The skill of extracting maximum information from limited feedback is one of the most valuable cognitive tools in any analytical profession.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            2048 — spatial planning and combinatorial thinking
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>2048 requires you to think several moves ahead, managing a dynamic spatial environment where each action changes the constraints for all future moves. The challenge is not reacting to the current state but anticipating how the board will evolve across multiple turns.</p>
            <p>This forward-planning ability — sometimes called lookahead reasoning — is the cognitive skill that distinguishes strong chess players from weak ones. Regular 2048 practice develops the habit of thinking ahead before acting, which improves decision quality in any domain involving sequential choices.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Wordly — linguistic pattern recognition
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Wordly is a word-guessing game where each guess reveals information about the hidden word — which letters are correct, which are present but misplaced, and which are absent entirely. The optimal strategy combines linguistic knowledge with logical elimination, using each response to maximally narrow the word space.</p>
            <p>Wordly uniquely bridges language and logic. Strong players combine a rich vocabulary with systematic reasoning — knowing which letters are most common in five-letter words and how to use that frequency information to eliminate possibilities efficiently.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Tetris — spatial reasoning and planning
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Tetris is one of the most studied games in cognitive science. It requires continuous spatial reasoning — rotating and placing falling pieces to clear lines — while planning several moves ahead under time pressure. The game demands simultaneous management of working memory, spatial visualization and executive function.</p>
           <p style={{ marginBottom: 10 }}>Research has shown that Tetris players develop measurably thicker cortical regions associated with critical thinking, reasoning and language and processing. Regular Tetris play has also been linked to reduced intrusive thoughts and PTSD symptoms, suggesting that the spatial engagement it requires actively displaces other cognitive processing.</p>
           <p>The competitive scoring system rewards both speed and efficiency. Clearing multiple lines simultaneously multiplies your score — rewarding players who plan ahead rather than reacting purely to the current piece. This forward-planning habit transfers directly to strategic thinking in other domains.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Blackjack — probabilistic decision-making
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Blackjack requires decisions under uncertainty — you never know the dealer's hidden card. The mathematically correct play in every situation is determined by basic strategy, a set of rules derived from probability theory. Following basic strategy consistently requires suppressing emotional impulses (the fear of busting, the excitement of a good hand) in favour of rational calculation.</p>
            <p>The cash-out mechanic adds a second layer of strategic thinking: knowing when to stop. This mirrors real-world decisions about risk and reward — when to exit a position, when to lock in a gain, when the expected value of continuing is negative. It is one of the most practically valuable cognitive skills trained by any game on MemGenius.</p>
          </div>
        </details>
      </div>
      <CategoryRelated current="Logic" />
    </>
  )
}
