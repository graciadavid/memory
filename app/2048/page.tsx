import Game2048Client from './Game2048Client'

export const metadata = {
  title: '2048 — Number Logic Game | MemGenius',
  description: 'Combine tiles to reach 2048. Free online 2048 game with world ranking. Train your planning, spatial reasoning and logical thinking. No login required.',
}

export default function Game2048Page() {
  return (
    <>
      <Game2048Client />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does 2048 train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>2048 trains planning, spatial reasoning and working memory simultaneously. Every move requires you to anticipate the consequences of sliding tiles, maintain a mental model of the board state and plan several moves ahead. This combination of forward planning and spatial tracking engages the prefrontal cortex, parietal lobe and hippocampus in an integrated cognitive workout.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>The game also trains inhibitory control — the ability to resist making the obvious move in favor of a strategically superior one. Expert 2048 players learn to avoid corner traps and maintain tile organization through deliberate restraint, a skill that transfers to real-world decision-making contexts.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Swipe in any direction to slide all tiles on the 4x4 grid. When two tiles with the same number collide, they merge into one tile with their combined value. A new tile appears after every move. The goal is to create a tile with the value 2048 — or go as high as possible. On MemGenius, your highest tile and solving time are both recorded, with ranking ordered by highest tile first and time as tiebreaker.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>The cognitive depth of 2048</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>2048 was created by Gabriele Cirulli in 2014 and became one of the most played browser games in history within weeks of its release. Its appeal lies in the perfect balance between accessibility and depth — the rules take thirty seconds to learn but mastery requires genuine strategic thinking and pattern recognition that develops over hundreds of sessions.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>Research on puzzle games similar to 2048 shows consistent improvements in spatial working memory and planning ability with regular play. The competitive ranking system on MemGenius adds a social dimension — seeing your tile rank against players worldwide provides the motivational context that sustains long-term engagement and accelerates skill development.</p>
      </div>
    </>
  )
}
