export const metadata = {
  title: 'How to Win at Mastermind — MemGenius',
  description: 'The logic behind Mastermind and the strategies to crack the code every time.',
}
export default function Page() {
  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      <div style={{ maxWidth:430, margin:'0 auto' }}>
        <a href="/blog" style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, textDecoration:'none', display:'block', marginBottom:16 }}>← Blog</a>
        <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Logic Games</div>
        <h1 style={{ fontSize:26, fontWeight:900, color:'#fff', marginBottom:8, lineHeight:1.2 }}>How to Win at Mastermind</h1>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700, marginBottom:24 }}>June 2026 · 4 min read</div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.8, display:'flex', flexDirection:'column', gap:16 }}>
          <p>Mastermind is a code-breaking game that looks simple but conceals remarkable depth. Two players — one who sets a secret code, one who tries to crack it — engage in a structured logical dialogue. Every guess returns information. Every piece of information eliminates possibilities. The goal is to crack the code in as few guesses as possible.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>Understanding the feedback</h2>
          <p>Mastermind feedback comes in two forms: black pegs (right colour, right position) and white pegs (right colour, wrong position). Every guess must be interpreted in light of this feedback to systematically narrow the solution space.</p>
          <p>A common beginner mistake is to focus only on what the feedback confirms rather than what it eliminates. A response of zero black and zero white pegs tells you that none of the colours in your guess appear anywhere in the code — this eliminates a large portion of the possibility space in a single guess.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>The optimal opening strategy</h2>
          <p>Information theory provides the optimal opening guess for standard six-colour Mastermind: a guess containing two pairs of identical colours, such as AABB. This guess is not optimal because it is likely to be correct — it almost certainly is not — but because it provides maximum information regardless of the feedback it receives.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>Minimax strategy</h2>
          <p>The minimax strategy, developed by mathematician Donald Knuth, guarantees solving any Mastermind code in five guesses or fewer. The strategy works by always choosing the guess that minimises the maximum number of remaining possibilities across all possible feedback responses. While calculating this mentally is challenging, understanding the principle improves your guessing intuition significantly.</p>
          <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', marginTop:8 }}>What Mastermind trains</h2>
          <p>Mastermind is one of the most cognitively demanding casual games. It requires working memory to track previous guesses and their feedback, logical reasoning to generate consistent hypotheses, and inhibitory control to suppress guesses that feel right but contradict the evidence. Regular Mastermind practice measurably improves all three abilities.</p>
        </div>
        <a href="/mastermind" style={{ textDecoration:'none', display:'block', marginTop:32, background:'#2E7D32', borderRadius:16, padding:'16px', textAlign:'center', fontSize:16, fontWeight:900, color:'#fff' }}>Play Mastermind →</a>
      </div>
    </main>
  )
}
