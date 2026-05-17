import FlagsClient from './FlagsClient'

export const metadata = {
  title: 'Flags — Geography Memory Game | MemGenius',
  description: 'How many country flags can you identify in a row? Free online geography game with world ranking. Train your visual memory and world knowledge. No login required.',
}

export default function FlagsPage() {
  return (
    <>
      <FlagsClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Flags train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Flags trains visual recognition memory and crystallized intelligence — the accumulated knowledge stored in long-term memory through education and experience. Recognizing country flags requires the brain to match a visual pattern against a stored representation, engaging the fusiform gyrus and temporal lobe regions specialized for visual object recognition.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Unlike fluid intelligence, which declines with age, crystallized intelligence grows through learning and experience. Flags rewards people who have accumulated geographic knowledge and provides a motivating context for building more. Each flag you learn becomes a permanent addition to your long-term memory store.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>A country flag appears on screen. Four country names are shown as options. Tap the correct country name. Each correct answer advances to the next flag. One mistake ends the game. Your score is the number of consecutive correct answers. The game includes flags from over 130 countries across all continents.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Why geography knowledge matters</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Geographic literacy is associated with better performance in history, economics and current events comprehension. Studies show that students with strong geographic knowledge demonstrate better spatial reasoning and are more likely to engage with global news and international issues. In an increasingly interconnected world, knowing where countries are and what they look like is a fundamental form of cultural literacy.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>Most adults can correctly identify fewer than 30 country flags. With daily practice on Flags, that number can reach 100 or more within a few weeks — a genuine expansion of your knowledge base that stays with you permanently.</p>
      </div>
    </>
  )
}
