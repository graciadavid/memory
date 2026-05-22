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
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>The game covers over 75 countries across all continents, from large and familiar shapes like Brazil or Australia to smaller and trickier outlines like Bangladesh or Paraguay. Each correct answer keeps your streak alive. One wrong answer ends the game.</p>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            How to play
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>A white silhouette of a country appears on screen. Four country names are shown below. Tap the correct one. Get it right and the next country appears immediately. Get it wrong and the game ends, showing your final score and your world ranking.</p>
            <p style={{ marginBottom: 10 }}>There is no time limit — take as long as you need. The challenge is pure knowledge. Your score is the number of countries you identified correctly in a row before your first mistake. The game tracks your personal best and shows you where you rank among all players worldwide.</p>
            <p>To save your score you only need a name and a four-digit PIN. No email, no password, no account. Your result is stored instantly and your ranking updates in real time as other players compete around the world.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Tips to improve your score
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Start by learning the shapes of the largest countries first. Russia, Canada, the United States, Brazil, Australia and China are easy to recognize because of their size and distinctive outlines. Once you know these confidently, move to medium-sized countries in Europe and South America.</p>
            <p style={{ marginBottom: 10 }}>Pay attention to coastlines rather than the overall shape. Countries with complex coastlines like Norway, Greece or the Philippines have very distinctive edges that are easy to identify once you know what to look for. Landlocked countries like Bolivia or Mongolia tend to have smoother, simpler outlines.</p>
            <p>Group countries by region in your mind. If you can tell that a shape looks African, you have already eliminated most options. Then narrow it down by size and proportion. This elimination strategy can dramatically improve your accuracy even when you are not completely certain of the answer.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Why geography knowledge matters
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Knowing world geography is more than a pub quiz skill. It builds spatial reasoning, improves your understanding of global news and politics, and gives you a mental framework for understanding where things happen in the world. Studies show that people with stronger geographical knowledge have better contextual understanding of international events.</p>
            <p style={{ marginBottom: 10 }}>Recognizing countries by shape specifically trains visual-spatial memory, a cognitive ability that is also used in navigation, architecture, engineering and design. It requires you to extract meaningful information from abstract visual data — a skill that transfers across many areas of life.</p>
            <p>Playing Countries daily is one of the most enjoyable ways to gradually build a complete mental map of the world. Most players find their score improves significantly after just one week of practice, and the sense of progress is one of the most satisfying aspects of the game.</p>
          </div>
        </details>

        <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Did you know?
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>There are 195 recognized countries in the world today, but their shapes are far from random. Most borders were drawn during the colonial era by European powers who had little knowledge of local geography, culture or ethnic boundaries. This is why many African countries have perfectly straight borders — they were drawn with a ruler on a map in Berlin in 1884.</p>
            <p style={{ marginBottom: 10 }}>Some countries have genuinely bizarre shapes. Chile is 4,300 kilometres long but averages only 177 kilometres wide, making it one of the most elongated countries on Earth. The Gambia is almost entirely surrounded by Senegal, forming a thin strip of land along the Gambia River. Italy is shaped like a boot, which even Italians use as a reference point in everyday conversation.</p>
            <p>The hardest countries to identify by shape are typically small island nations and landlocked African countries with simple rectangular borders. The easiest are usually large countries with distinctive coastlines or very unusual proportions that make them immediately recognizable even without any labels.</p>
          </div>
        </details>

        <RelatedGames category="knowledge" current="GeoShape" />
      </div>
    </>
  )
}
