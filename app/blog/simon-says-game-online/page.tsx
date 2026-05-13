import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const GREEN = '#2E7D32'
const PURPLE = '#6A1B9A'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export const metadata = {
  title: 'Simon Says Game Online — Free, No Download | MemGenius',
  description: 'Play Simon Says online for free. No download, no login. The classic color pattern memory game with a world ranking. How far can you go?',
}

export default function BlogPost() {
  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', color: BROWN }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>

        <Link href="/blog" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#4A2C0A50', marginBottom: 24 }}>Back to Blog</div>
        </Link>

        <div style={{ fontSize: 11, fontWeight: 800, color: PURPLE, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Memory Games · May 2026</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.15 }}>Simon Says Game Online — Free, No Download</h1>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>Simon Says is one of the most iconic memory games ever created. A sequence of colored buttons lights up. You watch. Then you repeat it — in the exact same order. Each round adds one more step. One wrong tap and it is over. Simple to understand, genuinely difficult to master, and more cognitively demanding than it looks.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>MemGenius offers a free online version of Simon Says that you can play instantly on your phone or desktop — no download, no account, no cost. Your score goes straight to a world ranking so you can see exactly where you stand against players everywhere.</p>

        <div style={{ background: PURPLE, borderRadius: 20, padding: '20px 24px', marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Play Simon Says now</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Free · No login · World ranking</div>
          <Link href="/sequence" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-block', background: '#fff', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 900, color: PURPLE }}>Play now →</div>
          </Link>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 12px' }}>How to play Simon Says online</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 8 }}>The rules are exactly what you remember from the original game. Four colored buttons appear on screen. The game lights them up in a random sequence — starting with one button, then two, then three, growing by one each round.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 8 }}>After each sequence plays, you tap the buttons in the same order. Get it right and the sequence grows. Miss a single button — wrong button, wrong order, or too slow — and the game ends. Your score is the number of levels you completed before failing.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>The world record on MemGenius grows as more players join. Can you reach the top of the leaderboard?</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>The cognitive science behind Simon Says</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Simon Says looks like a simple children's game. It is not. It is a precise test of visuospatial working memory — the cognitive system responsible for holding and manipulating visual and spatial information in your mind.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>When you watch the sequence, your brain encodes each button's color and position as a separate memory chunk, then strings them together in order. This is exactly the same process used when remembering a phone number, following step-by-step instructions, or reading a map. The difficulty of Simon Says scales with working memory capacity — which is why some people get stuck at level 7 while others reach level 15.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>The game also trains sequential pattern recognition — the ability to detect and remember ordered relationships between elements. This skill is critical in music, programming, mathematics and language learning. Pianists, chess players and software engineers tend to perform above average on Simon Says for exactly this reason.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>Research in cognitive psychology has shown that working memory capacity is one of the strongest predictors of general fluid intelligence, academic achievement and professional performance. It is also one of the most trainable cognitive systems — which is why daily Simon Says practice produces measurable improvements.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>Tips to improve your Simon Says score</h2>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '16px 0 8px' }}>1. Chunk the sequence</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Instead of trying to remember each button individually, group them into pairs or triplets. If the sequence is red-blue-green-red, remember it as red-blue then green-red rather than four separate items. Chunking is one of the most powerful memory techniques known to cognitive science — it is why phone numbers are formatted with dashes.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '16px 0 8px' }}>2. Verbalize the sequence</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Say the colors out loud or silently as you watch. Converting visual information into verbal labels engages a second memory system — the phonological loop — giving you two independent traces of the same information. Players who verbalize consistently outperform those who watch silently, especially at higher levels where sequences exceed 8-10 items.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '16px 0 8px' }}>3. Create a rhythm</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Many experienced Simon Says players tap along with the sequence as it plays, even before it is their turn. This rhythm encoding uses procedural memory — the same system that lets you type without looking at the keyboard or play music from muscle memory. The sequence becomes a pattern you feel rather than a list you memorize.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '16px 0 8px' }}>4. Play daily</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>Working memory improves with consistent practice, not occasional sessions. Players who play Simon Says daily for two weeks consistently report reaching levels that previously felt impossible. The brain adapts to the demand — but only if the demand is repeated regularly.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>Simon Says in the classroom</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Teachers increasingly use Simon Says as a cognitive warm-up at the start of class. Five minutes of Simon Says before a lesson measurably increases student attention and reduces the time needed to settle the class. The competitive element — who reached the highest level — creates engagement without requiring lesson content.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>MemGenius makes this easy. A teacher creates a class group, shares one link, and within 60 seconds the entire class is competing on the same leaderboard. No app download, no parental consent forms, no IT setup. Students can play on any smartphone.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>Simon Says is particularly effective as a warm-up for subjects that require sequential thinking — music, mathematics, programming and foreign language. The cognitive activation carries over into the lesson that follows.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>The history of Simon Says</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>The electronic Simon game was invented by Ralph Baer and Howard Morrison and released by Milton Bradley in 1978. It became one of the best-selling toys of its era, selling over 100 million units worldwide. The game was inspired by Atari's Touch Me arcade game, itself derived from the traditional children's game Simon Says.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>The original device had four colored buttons — red, blue, green and yellow — each associated with a distinct musical tone. Players had to replicate growing sequences of lights and sounds. The combination of visual and auditory cues made the game more accessible and more memorable than purely visual versions.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>Today, Simon Says is recognized not just as a toy but as a legitimate cognitive assessment tool. Researchers use Simon-type tasks to measure working memory capacity, attention control and processing speed in clinical and academic settings. The game that sold 100 million units turns out to have been measuring something real all along.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>Frequently asked questions</h2>
        {[
          { q: 'Is the Simon Says game on MemGenius free?', a: 'Yes, completely free. No login, no download, no subscription. Play directly in your browser on any device.' },
          { q: 'What is a good Simon Says score?', a: 'The average player reaches level 7-9 before making a mistake. Reaching level 12 puts you in the top 20% of players. Level 15 or above is exceptional. The world record on MemGenius grows as more players join.' },
          { q: 'Does Simon Says actually improve memory?', a: 'Yes. Regular Simon Says practice measurably improves visuospatial working memory capacity, which transfers to real-world tasks involving sequential information, instructions and learning new skills.' },
          { q: 'Can I play Simon Says on mobile?', a: 'Yes. MemGenius is built mobile-first. The Simon Says game works perfectly on any smartphone browser with no installation required.' },
          { q: 'Is Simon Says good for kids?', a: 'Simon Says is excellent for children from around age 6 upward. It trains working memory during a critical developmental window and is genuinely engaging for young players. The difficulty scales naturally — younger children can celebrate reaching level 5 while older students compete for level 15.' },
          { q: 'How is MemGenius Simon Says different from the original game?', a: 'The core mechanic is identical — watch the sequence, repeat it, grow the sequence. MemGenius adds a world ranking so you can compare your score globally, a streak system to motivate daily play, and group competitions so friends or classmates can compete against each other.' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 12, border: '1px solid #4A2C0A10' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: BROWN, marginBottom: 8 }}>{item.q}</div>
            <div style={{ fontSize: 14, color: '#4A2C0A70', lineHeight: 1.7 }}>{item.a}</div>
          </div>
        ))}

        <div style={{ background: `${PURPLE}15`, borderRadius: 20, padding: 28, textAlign: 'center', marginTop: 40, border: `1px solid ${PURPLE}30` }}>
          <img src={BASE + '/logomemgenius.webp'} alt="MemGenius" style={{ height: 48, objectFit: 'contain', marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px' }}>Ready to beat the world ranking?</h3>
          <p style={{ fontSize: 14, color: '#4A2C0A70', margin: '0 0 16px' }}>Free Simon Says online. No login. Your score goes straight to the world leaderboard.</p>
          <Link href="/sequence" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-block', background: PURPLE, borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 900, color: '#fff' }}>Play Simon Says now</div>
          </Link>
        </div>

      </div>
    </main>
  )
}
