import RelatedGames from '@/components/RelatedGames'
import WordlyClient from './WordlyClient'

export const metadata = {
  title: 'Wordly — Daily Word Game | MemGenius',
  description: 'Guess the 5-letter word of the day in 6 tries. Free online word game with world ranking. Train your verbal reasoning and language processing. No login required.',
}

export default function WordlyPage() {
  return (
    <>
      <WordlyClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Wordly train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Wordly trains verbal reasoning and language processing — the ability to use knowledge of words, spelling patterns and letter frequencies to solve a deductive puzzle. Each guess reveals information about which letters are in the word and where they belong, requiring the player to combine linguistic knowledge with logical elimination.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Language processing is one of the most complex cognitive functions, engaging the left hemisphere extensively including Broca's area for language production and Wernicke's area for language comprehension. Regular engagement with word-based reasoning tasks maintains the neural pathways responsible for verbal fluency, vocabulary retrieval and reading speed.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>A new 5-letter word is chosen every day. You have 6 attempts to guess it. After each guess, the letters change color — green means the letter is in the correct position, yellow means the letter is in the word but in the wrong position, grey means the letter is not in the word. Use the information from each guess to narrow down the possibilities. The daily format means everyone is solving the same word, enabling genuine global comparison.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Language and cognitive aging</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Verbal abilities are among the most resilient cognitive functions — they decline later and more slowly than most other abilities. However, word retrieval speed — the time it takes to access a word you know — begins declining in the forties and becomes a common source of frustration in later life. The tip-of-the-tongue phenomenon becomes more frequent with age.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>Daily engagement with Wordly exercises the word retrieval networks, maintaining the speed and fluency of lexical access. The competitive element — comparing your solving time against other players on the world ranking — adds a motivational dimension that sustains daily engagement far more effectively than practice for its own sake.</p>
      <RelatedGames category='logic' current='Wordly' />
      </div>
    </>
  )
}
