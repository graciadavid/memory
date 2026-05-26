import RelatedGames from '@/components/RelatedGames'
import DigitsClient from './DigitsClient'

export const metadata = {
  title: 'Digits — Number Memory Game | MemGenius',
  description: 'How many digits can you remember in a row? Free online digit span memory game with world ranking. Train your short-term memory and working memory. No login required.',
}

export default function DigitsPage() {
  return (
    <>
      <DigitsClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>How many digits can you remember?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Digits is a working memory game where a sequence of numbers appears on screen briefly and you must recall them in exact order. The sequence starts short and grows by one digit each round. One mistake ends the game. Your score is the longest sequence you remembered correctly.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>The average adult can hold 7 digits in short-term memory, give or take two. This capacity — known as digit span — peaks in the mid-twenties and declines gradually with age. Where do you rank against the world?</p>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            How to play
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>A sequence of digits appears on screen for 2.5 seconds. Study them carefully. When they disappear, type them in the correct order using the numeric keypad. Get it right and the next sequence is one digit longer. Make one mistake and the game ends, showing your score and world ranking.</p>
            <p style={{ marginBottom: 10 }}>The game starts at 3 digits and grows incrementally. Most players plateau between 7 and 9 digits — the natural range of working memory capacity for adults. Reaching 12 or more requires deliberate memorization strategies rather than passive observation.</p>
            <p>Save your score with a name and PIN to track your personal best and appear on the world leaderboard.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            The science of digit span
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Digit span is one of the oldest and most studied measures in cognitive psychology. It was first systematically measured by Joseph Jacobs in 1887, who found that the average adult could recall approximately 7 digits — a finding replicated thousands of times since. In 1956, George Miller published his famous paper "The Magical Number Seven, Plus or Minus Two," establishing the capacity of short-term memory as 7 ± 2 chunks of information.</p>
            <p style={{ marginBottom: 10 }}>Digit span is a subtest of the Wechsler Adult Intelligence Scale, one of the most widely used IQ tests in clinical and research psychology. It measures the capacity of the phonological loop — a component of working memory that temporarily stores verbal and numerical information through subvocal rehearsal. People unconsciously "say" numbers to themselves while memorizing them, cycling through the sequence repeatedly to keep it active in memory.</p>
            <p style={{ marginBottom: 10 }}>Digit span correlates significantly with performance in mathematics, reading comprehension and general academic achievement. It is also one of the first cognitive abilities to show measurable decline in neurodegenerative conditions such as Alzheimer's disease, making it a valuable screening measure in neuropsychological assessment. A sudden drop in digit span performance is a recognized early warning sign of cognitive decline.</p>
            <p>Interestingly, digit span varies across languages. Chinese speakers consistently show higher digit spans than English speakers — around 9 digits versus 7. Researchers believe this is because Chinese number words are shorter (taking less time to subvocally rehearse), allowing more digits to be cycled through the phonological loop in the same time window. This cross-linguistic difference provides strong evidence that phonological loop capacity is genuinely measured by the digit span task.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Why working memory matters
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Working memory is the cognitive system that temporarily holds and manipulates information during mental tasks. It is what you use when you do mental arithmetic, follow a complex argument, hold a phone number in mind while dialing, or track the thread of a long sentence. Working memory capacity is one of the strongest predictors of academic and professional performance across virtually every domain.</p>
            <p style={{ marginBottom: 10 }}>The phonological loop — the component of working memory that digit span measures — is specifically responsible for verbal and numerical information. Every time you remember a PIN, recall a phone number, follow a spoken instruction with multiple steps, or keep a running total in your head, you are using the phonological loop. Strengthening it through regular digit span practice produces real improvements in these everyday tasks.</p>
            <p style={{ marginBottom: 10 }}>Working memory capacity declines with age, but the rate of decline is highly variable and strongly influenced by lifestyle factors. Regular cognitive exercise, physical fitness, adequate sleep and low chronic stress are all associated with slower working memory decline. Digital span training specifically has been shown in multiple studies to produce modest but measurable improvements in working memory capacity that transfer to untrained tasks.</p>
            <p>Children's digit spans increase throughout childhood — from about 2 digits at age 2 to 7 digits by age 15 — tracking the development of the prefrontal cortex and phonological loop. This developmental trajectory makes digit span one of the most sensitive measures of cognitive maturation and one of the earliest indicators of developmental differences in learning ability.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Tips to improve your score
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Use chunking to dramatically extend your span. Instead of memorizing individual digits, group them into meaningful chunks of 2 or 3. The sequence 7 4 2 9 1 8 3 becomes 742 — 918 — 3, three chunks instead of seven individual items. Chunking is the most powerful technique for extending digit span and is used by every memory champion who has ever set a world record.</p>
            <p style={{ marginBottom: 10 }}>Rehearse subvocally as the digits appear. Say the numbers quietly to yourself — even just mouthing them — as each digit appears on screen. This engages the phonological loop actively rather than passively and significantly improves retention. Extend the rehearsal by repeating the entire sequence to yourself immediately after the display disappears, before you start typing.</p>
            <p style={{ marginBottom: 10 }}>Create rhythm and melody. Digit sequences are easier to remember when they have a rhythmic structure, similar to how phone numbers are said in groups with natural pauses. If you notice a sequence has a repeating pattern or sounds like a familiar number — a year, a familiar phone number fragment — exploit that association immediately.</p>
            <p>Practice consistently rather than intensively. Working memory training produces the most durable improvements through regular short sessions rather than occasional long ones. Ten minutes of daily Digits practice will improve your span more reliably over a month than an hour of practice once a week. Consistency is the single most important factor in long-term improvement.</p>
          </div>
        </details>

        <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Digits vs other memory games
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Digits and Simon Says both train sequential working memory but through different channels. Digits uses the phonological loop — the verbal-numerical memory system — while Simon Says uses visuospatial working memory through color and position. These are distinct subsystems of working memory that are only weakly correlated. Training both provides broader working memory benefits than training either alone.</p>
            <p style={{ marginBottom: 10 }}>Compared to N-Back, Digits trains a fundamentally different aspect of working memory. N-Back trains the updating function — continuously replacing old information with new. Digits trains the storage and retrieval function — holding a fixed sequence intact over a brief delay. Both are important components of working memory and complement each other well as a training pair.</p>
            <p>Digits is the most directly clinically relevant game on MemGenius because digit span is an actual component of standard IQ and neuropsychological tests. Your score on Digits is directly comparable to the digit span subtest of the WAIS — the world's most widely used adult intelligence test. A score of 7 or above is average for adults. A score of 10 or above places you in the top 10% of the population on this measure.</p>
          </div>
        </details>

        <RelatedGames category="memory" current="Digits" />
      </div>
    </>
  )
}
