import PokeClient from './PokeClient'
import RelatedGames from '@/components/RelatedGames'

export const metadata = {
  title: 'Poke Memory — Remember the Bowl Ingredients | MemGenius',
  description: 'Memorize the ingredients in a poke bowl before they disappear. Free online visual memory game with world ranking. No login required.',
}

export default function PokePage() {
  return (
    <>
      <PokeClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>Can you remember what was in the bowl?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Poke is a visual memory game inspired by the Hawaiian poke bowl. A bowl of ingredients appears on screen for a few seconds. Study them carefully. Then they disappear and you must identify which ingredients were in the bowl from a grid of all possible options. Each correct level adds more ingredients to remember.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>The game starts with 4 ingredients and grows with every level. One wrong selection ends the game. Your score is the highest level you reached before your first mistake.</p>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            How to play
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>A poke bowl appears showing a set of ingredients. You have 8 seconds to memorize them. When the timer runs out the bowl disappears and you see a grid of all 9 possible ingredients. Tap every ingredient that was in the bowl. Tap one that was not and the game ends immediately.</p>
            <p style={{ marginBottom: 10 }}>Each level adds one more ingredient to the bowl. Level 1 has 4 ingredients. Level 6 has 9 — the maximum, meaning every ingredient was in the bowl. Your score is saved automatically to the world ranking when you complete each level.</p>
            <p>No login required. If you have a profile your score is saved automatically. If not, you can create one after the game ends.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            What Poke trains in your brain
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Poke trains visual working memory — the ability to hold a set of visual objects in mind over a brief delay and recognize them accurately when they reappear in a different context. This is distinct from sequential memory (remembering things in order) — Poke requires set memory, where you must retain a collection of items without caring about their order.</p>
            <p style={{ marginBottom: 10 }}>Visual object memory is one of the most practically useful forms of working memory. It is what you use when you remember what you put in a bag before closing it, what items are on a shelf before turning away, or what was on a table before the lights went out. These everyday applications make Poke one of the most transferable memory games on MemGenius.</p>
            <p style={{ marginBottom: 10 }}>The capacity of visual working memory is typically around 3 to 4 objects for most adults — significantly less than verbal working memory. This is why Poke becomes genuinely challenging from level 4 onwards, when the number of ingredients to remember exceeds the natural capacity of visual working memory and forces the use of encoding strategies.</p>
            <p>Regular training on visual set memory tasks has been shown to improve performance on real-world tasks requiring object recognition and recall. Artists, chefs, designers and anyone who works with visual materials in their professional life report noticeable improvements in their ability to remember visual details after consistent practice with games like Poke.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            The poke bowl — origin and culture
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Poke — pronounced poh-KAY — is a traditional Hawaiian dish of diced raw fish seasoned with soy sauce, sesame oil, onions and other ingredients. The word poke means to slice or cut crosswise in Hawaiian, referring to the way the fish is prepared. It has been a staple of Hawaiian cuisine for centuries, originally made with reef fish, sea salt and seaweed by native Hawaiians.</p>
            <p style={{ marginBottom: 10 }}>The modern poke bowl emerged in the 1970s when Japanese influences introduced soy sauce, sesame oil and rice to the traditional preparation. The rice bowl format transformed poke from a standalone snack into a complete meal. By the 2010s, poke bowls had spread from Hawaii to the mainland United States and then globally, becoming one of the defining food trends of the decade.</p>
            <p style={{ marginBottom: 10 }}>The appeal of poke bowls lies in their customizability. A typical poke bowl allows diners to choose a base (rice, salad or mixed), a protein (salmon, tuna, tofu), and a wide range of toppings including avocado, edamame, mango, cucumber, carrot and various sauces. The nine ingredients in MemGenius Poke — avocado, rice, tuna, onion, edamame, mango, cucumber, salmon and carrot — are all classic components of a modern poke bowl.</p>
            <p>Poke bowls are now sold in thousands of dedicated restaurants worldwide from London to Tokyo to São Paulo. Their success reflects a broader shift toward customizable, fresh, visually appealing meals — a trend that has reshaped fast-casual dining globally over the past decade.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Tips to improve your score
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Name the ingredients out loud or in your head as you memorize them. Verbal labeling — saying "avocado, salmon, mango, edamame" — engages your phonological loop in addition to your visual memory, giving you two independent memory systems working on the same information. This dual encoding dramatically improves retention.</p>
            <p style={{ marginBottom: 10 }}>Group the ingredients into a mental story or image. Instead of remembering four separate items, create a single vivid scene — "the salmon is swimming in mango juice next to a giant edamame" — that combines all the ingredients into one memorable image. This elaborative encoding technique is used by memory champions and is far more effective than simple repetition.</p>
            <p style={{ marginBottom: 10 }}>Focus on what is absent rather than what is present. At higher levels when most ingredients are in the bowl, it is easier to remember the 1 or 2 items that are missing than the 7 or 8 that are present. Scan quickly to identify the missing ingredients during the memorization phase and remember to avoid those when selecting.</p>
            <p>Use the spatial layout of the bowl display as a memory aid. Notice where each ingredient appears in the bowl — top left, center, bottom right — and use these positions as additional retrieval cues. Spatial context is a powerful memory anchor, and associating each ingredient with its position adds a third encoding channel beyond visual and verbal.</p>
          </div>
        </details>

        <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Poke vs other memory games
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Poke differs from Simon Says and Digits in a fundamental way. Simon and Digits require sequential memory — remembering items in a specific order. Poke requires set memory — remembering which items were present regardless of order. These are distinct memory systems. You can have excellent sequential memory and poor set memory, or vice versa.</p>
            <p style={{ marginBottom: 10 }}>Compared to N-Back, Poke is less cognitively demanding per item but covers a larger number of items simultaneously. N-Back requires continuous updating of a single-item buffer. Poke requires holding a set of 4 to 9 items intact over a fixed delay without updating. Both are valuable but they train different aspects of visual working memory.</p>
            <p>Among all the Memory games on MemGenius, Poke is the most thematically engaging — the food context makes the ingredients inherently more memorable than abstract colors or digits, and the game has a natural narrative arc as the bowl gets fuller with each level. This combination of cognitive challenge and thematic richness makes Poke one of the most enjoyable memory games on the platform.</p>
          </div>
        </details>

        <RelatedGames category="memory" current="Poke" />
      </div>
    </>
  )
}
