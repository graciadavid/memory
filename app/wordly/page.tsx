import RelatedGames from '@/components/RelatedGames'
import WordlyClient from './WordlyClient'

export const metadata = {
  title: 'Wordly — Guess the 5-Letter Word | MemGenius',
  description: 'Guess the hidden 5-letter word in 6 tries. Free online Wordle-style game with world ranking. Train your verbal reasoning and vocabulary. No login required.',
}

export default function WordlyPage() {
  return (
    <>
      <WordlyClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>Guess the hidden word in 6 tries</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Wordly is a word deduction game. A secret 5-letter word is hidden. You have 6 attempts to find it. After each guess the letters change color — green means correct letter in the correct position, yellow means correct letter in the wrong position, grey means the letter is not in the word at all. Use each result to narrow down the possibilities.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>Wordly combines vocabulary knowledge with logical deduction. The best players approach it like a code-breaking puzzle — choosing opening words that maximize information, eliminating letters efficiently and converging on the answer in as few guesses as possible.</p>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            How to play
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Type any valid 5-letter word and submit it as your first guess. The letters will reveal their status — green for correct position, yellow for wrong position, grey for not in the word. Use this information to make a better second guess. Repeat until you find the word or exhaust your 6 attempts.</p>
            <p style={{ marginBottom: 10 }}>Every letter you guess gives you information. Grey letters eliminate an entire letter from consideration. Yellow letters confirm the letter is in the word and rule out one position. Green letters lock in both the letter and its position. A well-chosen second guess can often narrow the solution to just a handful of possibilities.</p>
            <p>Save your score with a name and PIN to appear on the world leaderboard. Your score reflects the number of attempts it took — fewer is better. Solving in 2 guesses is exceptional. Reaching 6 without finding the word counts as a failed attempt.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            The Wordle phenomenon
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Wordle was created by Josh Wardle, a software engineer, as a gift for his partner who loved word games. He released it publicly in October 2021 with no advertising and no monetization. Within three months it had grown from 90 daily players to 300,000. By January 2022, over 2 million people were playing daily. The New York Times purchased it for an undisclosed sum reported to be in the low seven figures.</p>
            <p style={{ marginBottom: 10 }}>The game's viral spread was driven largely by its shareable results grid — the colored square emojis that players posted on social media without spoiling the answer. This mechanic turned every player into an organic promoter. The grid communicated both the challenge and the player's performance in a single glance, making it irresistible to share and discuss.</p>
            <p style={{ marginBottom: 10 }}>Wordle's success sparked hundreds of variants — Quordle (four words simultaneously), Nerdle (equations), Worldle (countries by shape), Heardle (songs), and dozens more. It demonstrated that simple, elegant daily puzzle games with social sharing mechanics could achieve massive organic growth without paid acquisition — one of the most important lessons in casual game design of the 2020s.</p>
            <p>The original Wordle mechanics trace back much further. The television game show Lingo, which used almost identical rules, has been broadcast in various countries since 1987. The underlying concept of deducing a secret word through colored feedback was well established long before Wordle — but Wardle's clean design, daily cadence and sharing mechanic combined these elements into something that resonated globally.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            What Wordly trains in your brain
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Wordly trains verbal reasoning and deductive logic simultaneously. The verbal component requires you to access your mental lexicon rapidly — retrieving words that match the emerging constraints. The logical component requires you to track eliminated letters, confirmed positions and possible placements across multiple guesses simultaneously.</p>
            <p style={{ marginBottom: 10 }}>Language processing is one of the most complex cognitive functions, engaging the left hemisphere extensively including Broca's area for language production and Wernicke's area for comprehension. Regular engagement with word-based reasoning tasks maintains the neural pathways responsible for verbal fluency, vocabulary retrieval and reading speed — abilities that begin declining subtly in the forties.</p>
            <p style={{ marginBottom: 10 }}>The deductive component of Wordly overlaps significantly with Mastermind — both require you to use feedback from previous attempts to constrain the solution space logically. Players who approach Wordly strategically — choosing opening words that maximize letter coverage, tracking eliminated letters explicitly — perform significantly better than those who guess intuitively.</p>
            <p>Word retrieval speed — the time it takes to access a word you know — is one of the first verbal abilities to show age-related decline. The tip-of-the-tongue phenomenon becomes more frequent after 40. Daily engagement with Wordly exercises these retrieval networks, maintaining access speed and fluency in a way that passive reading alone does not.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            The mathematics of word guessing
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Information theory provides a powerful framework for optimal Wordly play. Each guess should maximize the expected information gained — measured in bits — regardless of what the feedback turns out to be. A guess that could produce many different feedback patterns is more informative than one that produces similar feedback for most possible answers.</p>
            <p style={{ marginBottom: 10 }}>In 2022, researchers at MIT and elsewhere published analyses showing the mathematically optimal opening words for Wordle. Words like CRANE, SLATE, RAISE and STARE consistently top these analyses because they cover the most common letters in the most informative positions. The best opening word reduces the average solution to under 2 remaining guesses after the feedback is revealed.</p>
            <p style={{ marginBottom: 10 }}>The total number of possible 5-letter words in English is around 12,000, but the number of common words used as answers in well-designed Wordle variants is typically 2,000 to 3,000. This much smaller answer set means that a well-chosen opening word combined with one good follow-up guess can often narrow the possibilities to just 5 to 10 words — making a 3-guess solution highly likely for a strategic player.</p>
            <p>Grant Sanderson, the mathematician behind the 3Blue1Brown YouTube channel, published a viral video analyzing Wordle through information theory in January 2022. His analysis showed that the optimal strategy guarantees solving any Wordle puzzle in at most 5 guesses and typically solves in 3.4 guesses on average — very close to the practical experience of skilled human players.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Tips to improve your score
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Choose a strong opening word that covers the most common letters. The letters E, A, R, I, O, T, N, S, L and C account for over 60% of all letters in common English words. A first guess that includes as many of these as possible — such as CRANE, SLATE or RAISE — gives you the maximum information from your very first attempt.</p>
            <p style={{ marginBottom: 10 }}>Never reuse grey letters. Once a letter is confirmed absent, eliminate it completely from all future guesses. This sounds obvious but under time pressure players frequently reuse eliminated letters — wasting an entire guess on a word that cannot possibly be the answer. Track your grey letters explicitly if needed.</p>
            <p style={{ marginBottom: 10 }}>Use yellow letters aggressively. A yellow letter confirms the letter is in the word but not in that position. Move it to a different position in your next guess and combine it with new letters to maximize information. A guess that places all your yellow letters in new positions while also testing new grey/green candidates is far more efficient than a guess that ignores your yellow information.</p>
            <p>Think about letter patterns rather than specific words. Instead of trying to think of words, think about what letter combinations are possible given your constraints. If you know the word contains A, R and E but not in positions 1, 3 and 4, mentally filter your vocabulary by those constraints before committing to a specific word. This systematic approach is faster and more accurate than purely intuitive word recall.</p>
          </div>
        </details>

        <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Wordly vs other logic games
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Among the Logic games on MemGenius, Wordly is the only one that requires genuine linguistic knowledge as well as logical reasoning. Sudoku, Mastermind and 2048 are all language-independent — they work identically in any language and require no vocabulary. Wordly adds the linguistic dimension, making it a unique test of the intersection between verbal and logical intelligence.</p>
            <p style={{ marginBottom: 10 }}>Compared to Mastermind, Wordly has an additional constraint that makes it harder in some ways and easier in others. Harder because your guesses must be real words — you cannot test arbitrary letter combinations as you can in Mastermind. Easier because your vocabulary knowledge gives you information that pure logic cannot — you know which letter combinations commonly appear in English and which do not.</p>
            <p>Wordly is also the most socially engaging game on MemGenius because of the shared puzzle format. When everyone solves the same word, the results become a shared experience — you can compare strategies, discuss why certain words were harder than others, and bond over the collective challenge. This social dimension is a large part of what made the original Wordle a global phenomenon and continues to drive engagement with word games worldwide.</p>
          </div>
        </details>

        <RelatedGames category="logic" current="Wordly" />
      </div>
    </>
  )
}
