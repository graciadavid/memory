import Link from 'next/link'

const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const PURPLE = '#6A1B9A'

export const metadata = {
  title: 'Mastermind Game Online — Free, No Download | MemGenius',
  description: 'Play Mastermind online for free. Crack the color code in 7 attempts. World ranking, no login required. The classic deduction game with a competitive twist.',
}

export default function BlogPost() {
  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', color: BROWN }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>

        <Link href="/blog" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#4A2C0A50', marginBottom: 24 }}>Back to Blog</div>
        </Link>

        <div style={{ fontSize: 11, fontWeight: 800, color: PURPLE, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Logic Games · May 2026</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.15 }}>Mastermind Game Online — Free, No Download</h1>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>Mastermind is one of the most elegant logic games ever created. A hidden code of colors. A limited number of attempts. Feedback after each guess that tells you how close you are without revealing what is wrong. The result is a pure deduction puzzle that has captivated players since 1970 and remains one of the best brain training games available today.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>MemGenius offers a free online version of Mastermind that you can play instantly on your phone or computer. No download, no login, no cost. Your solving time goes straight to a world ranking.</p>

        <div style={{ background: PURPLE, borderRadius: 20, padding: '20px 24px', marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Play Mastermind now</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Free · No login · World ranking</div>
          <Link href="/mastermind" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-block', background: '#fff', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 900, color: PURPLE }}>Play now →</div>
          </Link>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 12px' }}>How to play Mastermind</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>The game generates a secret code — a sequence of five colors chosen from a palette of five options. Your goal is to identify the exact code within seven attempts.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>After each guess you receive feedback in the form of colored borders on your pegs. A green border means that color is in the correct position. A pink border means that color is in the code but in the wrong position. No border means that color does not appear in the code at all.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>The MemGenius version adds one mechanic that makes the game even more intuitive — colors that are in the correct position are automatically pre-filled in the next row. This lets you focus your attention on the positions that are still uncertain, dramatically speeding up your deduction process.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>The cognitive science behind Mastermind</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Mastermind is a sequential deduction problem. Each guess provides information that constrains the solution space. An optimal first guess eliminates the maximum number of possible codes regardless of the answer. Subsequent guesses use the accumulated information to narrow down the remaining possibilities until only one solution remains.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>This process engages the prefrontal cortex — the brain region responsible for planning, hypothesis testing and updating beliefs based on new evidence. It is the same cognitive system used in scientific reasoning, strategic planning and any task that requires forming and revising mental models.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>Research in cognitive psychology has shown that games requiring sequential deductive reasoning improve performance on tasks measuring fluid intelligence — the ability to solve novel problems without relying on prior knowledge. Mastermind is one of the clearest examples of a game that directly trains this cognitive system.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>Strategies to crack the code faster</h2>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '16px 0 8px' }}>Start with maximum information</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Your first guess should include as many different colors as possible. If you use the same color twice in your first guess and receive no green or pink feedback for that color, you learn nothing about it specifically — you only know that particular combination did not work. Spreading different colors across all five positions maximizes the information you receive from the first response.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '16px 0 8px' }}>Eliminate before placing</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>When you receive pink feedback — a color is present but in the wrong position — resist the temptation to immediately move it to another position. First, use subsequent guesses to confirm which positions are wrong. Moving a color to a position that is also wrong costs you an attempt without gaining information.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '16px 0 8px' }}>Use the pre-filled positions</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>The MemGenius version automatically locks correct positions in the next row. This is a significant advantage — it reduces the solution space immediately and lets you focus your deduction on the remaining positions. Never waste an attempt by moving a confirmed correct color.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '16px 0 8px' }}>Track what you know</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>Keep a mental or written record of which colors have been confirmed absent, which are present, and which positions have been eliminated for each color. The fastest Mastermind solvers maintain a complete picture of the constraint set at all times and never place a color in a position that prior feedback has already eliminated.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>The history of Mastermind</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Mastermind was invented by Mordecai Meirowitz, an Israeli telecommunications expert, in 1970. He could not interest major game companies in the concept, so it was published by a small British company called Invicta Plastics. It became one of the best-selling board games of the 1970s, eventually selling over 50 million units worldwide.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>The game attracted serious mathematical attention almost immediately. In 1977, Donald Knuth published a paper proving that the original six-color, four-position version could always be solved in five or fewer guesses using an optimal strategy. This made Mastermind one of the first games to be fully solved by algorithmic analysis, and it remains a popular subject in computer science and artificial intelligence research.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>Frequently asked questions</h2>
        {[
          { q: 'Is the Mastermind game on MemGenius free?', a: 'Yes, completely free. No login, no download, no subscription. Play directly in your browser on any device.' },
          { q: 'How many attempts do I get?', a: 'Seven attempts to crack the five-color code. Each attempt gives you feedback that narrows down the solution.' },
          { q: 'What does the green border mean?', a: 'A green border means that color is in the correct position in the secret code. That position is automatically pre-filled in your next row.' },
          { q: 'What does the pink border mean?', a: 'A pink border means that color appears in the secret code but in a different position than the one you chose.' },
          { q: 'How is the ranking calculated?', a: 'The ranking is based on solving time. The faster you crack the code, the higher your position on the world leaderboard.' },
          { q: 'Can I play Mastermind on mobile?', a: 'Yes. MemGenius is built mobile-first. Mastermind works perfectly on any smartphone browser with no installation required.' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 12, border: '1px solid #4A2C0A10' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: BROWN, marginBottom: 8 }}>{item.q}</div>
            <div style={{ fontSize: 14, color: '#4A2C0A70', lineHeight: 1.7 }}>{item.a}</div>
          </div>
        ))}

        <div style={{ background: `${PURPLE}10`, borderRadius: 20, padding: 28, textAlign: 'center', marginTop: 40, border: `1px solid ${PURPLE}20` }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px' }}>Can you crack the code?</h3>
          <p style={{ fontSize: 14, color: '#4A2C0A70', margin: '0 0 16px' }}>Free Mastermind online. No login. Your time goes straight to the world ranking.</p>
          <Link href="/mastermind" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-block', background: PURPLE, borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 900, color: '#fff' }}>Play Mastermind now</div>
          </Link>
        </div>

      </div>
    </main>
  )
}
