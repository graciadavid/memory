import CountriesClient from './CountriesClient'
import RelatedGames from '@/components/RelatedGames'

export const metadata = {
  title: 'Countries by Shape — Geography Quiz | MemGenius',
  description: 'Can you identify countries by their shape? Free online geography quiz with world ranking. Test your knowledge of world geography. No login required.',
}

export default function CountriesPage() {
  return (
    <>
      <CountriesClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>Can you identify countries by shape?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Countries is a geography quiz that shows you the silhouette of a country and asks you to identify it from four options. No borders, no labels — just the raw outline. It sounds simple, but even geography enthusiasts are surprised by how many countries they struggle to recognize out of context.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>The game covers over 75 countries across all continents, from large and familiar shapes like Brazil or Australia to smaller and trickier outlines like Bangladesh or Paraguay. Each correct answer keeps your streak alive. One wrong answer ends the game.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>A white silhouette of a country appears on screen. Four country names are shown below. Tap the correct one. Get it right and the next country appears immediately. Get it wrong and the game ends, showing your final score and your world ranking.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>There is no time limit — take as long as you need. The challenge is pure knowledge. Your score is the number of countries you identified correctly in a row before your first mistake.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Why geography knowledge matters</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Knowing world geography is more than a pub quiz skill. It builds spatial reasoning, improves your understanding of global news and politics, and gives you a mental framework for understanding where things happen in the world. Studies show that people with stronger geographical knowledge have better contextual understanding of international events.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>Playing Countries daily is a fun way to gradually build a complete mental map of the world. Most players find their score improves significantly after just a week of practice.</p>

        <RelatedGames category="knowledge" current="GeoShape" />
      </div>
    </>
  )
}
