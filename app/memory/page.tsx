import HomeClient from '@/components/HomeClient'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Memory — Card Matching Brain Game | MemGenius',
  description: 'Match pairs of connected concepts in the free MemGenius Memory game. Easy, Medium and Hard difficulty. World ranking. Train your semantic memory daily. No login required.',
}

export const revalidate = 0

async function getRandomPack(difficulty: number) {
  const { data } = await supabase
    .from('packs')
    .select('slug')
    .eq('difficulty', difficulty)
  if (!data || data.length === 0) return null
  return data[Math.floor(Math.random() * data.length)].slug
}

export default async function MemoryPage() {
  try {
    const [easy, medium, hard] = await Promise.all([
      getRandomPack(1),
      getRandomPack(2),
      getRandomPack(3),
    ])
    return (
      <>
        <HomeClient easy={easy} medium={medium} hard={hard} />
        <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>Match connected concepts and train your brain</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>MemGenius Memory is a card matching game with a twist — instead of matching identical images, you match conceptually related pairs. A monument and its country. An instrument and its genre. A food and its origin. This semantic association challenge is far more cognitively demanding than traditional memory games and trains a fundamentally more useful cognitive skill.</p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>Choose Easy, Medium or Hard difficulty. Flip pairs of cards to find all the matches as fast as possible. Your time is submitted to a world ranking. A new pack of cards is available every day across hundreds of categories.</p>

          <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
            <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              How to play
              <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
            </summary>
            <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
              <p style={{ marginBottom: 10 }}>Cards are laid face down on a grid. Tap any card to flip it and reveal its content. Then tap a second card. If the two cards are conceptually related — they form a valid pair — both stay face up and you score the match. If they are not related, both cards flip back face down and you must remember their positions for future turns.</p>
              <p style={{ marginBottom: 10 }}>Clear the entire board as fast as possible. Your time starts when the game begins and stops when the last pair is matched. The faster you complete the board, the higher your ranking. Easy difficulty uses fewer pairs on a smaller grid. Hard difficulty uses more pairs and more challenging category combinations.</p>
              <p>Save your score with a name and PIN to appear on the world leaderboard. Rankings are tracked separately by difficulty level so you can compare with players of the same skill level worldwide.</p>
            </div>
          </details>

          <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
            <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              What Memory trains in your brain
              <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
            </summary>
            <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
              <p style={{ marginBottom: 10 }}>MemGenius Memory trains semantic memory — the part of long-term memory that stores knowledge about the world and the relationships between concepts. Semantic memory is distinct from episodic memory (personal experiences) and procedural memory (skills). It is the foundation of general knowledge, language comprehension and the ability to understand analogies and metaphors.</p>
              <p style={{ marginBottom: 10 }}>The semantic association task engages the hippocampus, prefrontal cortex and temporal lobe simultaneously. Each time you successfully match a pair — connecting a concept with its related counterpart — you strengthen the neural pathway linking those two concepts. Over hundreds of sessions, this builds a richer, more densely connected semantic network that makes it easier to learn and remember new information across all domains.</p>
              <p style={{ marginBottom: 10 }}>The spatial memory component — remembering where each card is on the grid — engages the hippocampus and parahippocampal cortex, the same regions used for navigating physical spaces. This dual demand on semantic and spatial memory makes MemGenius Memory significantly more cognitively demanding than either pure knowledge games or pure spatial memory games.</p>
              <p>Semantic memory is one of the most resilient forms of memory — it declines later and more slowly than episodic memory. However, the speed of semantic retrieval begins declining subtly in the forties. Daily practice with semantic association tasks maintains this retrieval speed and expands your knowledge network in a way that transfers directly to reading comprehension, conversation and learning new subjects.</p>
            </div>
          </details>

          <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
            <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              The science of memory and association
              <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
            </summary>
            <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
              <p style={{ marginBottom: 10 }}>Memory is not stored in isolated locations in the brain — it is distributed across networks of neurons that fire together when a memory is formed or recalled. The strength of a memory is determined by the density of the connections in its network. This is why association is so powerful for memory — connecting a new piece of information to something you already know creates multiple pathways to retrieve it, making it far more durable than an isolated fact.</p>
              <p style={{ marginBottom: 10 }}>The method of loci — also known as the memory palace — is the oldest and most powerful memory technique known, used by ancient Greek and Roman orators to memorize hours of speech. It works by associating information with specific locations in a familiar imaginary space, leveraging the brain's exceptional spatial memory to encode non-spatial information. Modern memory champions use this technique to memorize thousands of random digits, hundreds of playing cards and entire decks in minutes.</p>
              <p style={{ marginBottom: 10 }}>Semantic association works on a similar principle. By linking new information to an existing concept — connecting a composer with their nationality, an animal with its continent, a food with its culture — you create a retrieval pathway through your existing knowledge network. This is why general knowledge and new learning are mutually reinforcing: the more you know, the easier it is to learn more.</p>
              <p>The hippocampus plays a central role in forming new associative memories. Damage to the hippocampus — as occurs in Alzheimer's disease — typically impairs the ability to form new associations while leaving older, well-established memories intact. This is why Alzheimer's patients often remember their childhood clearly but cannot form new memories. Keeping the hippocampus active through regular associative learning is one of the most evidence-based strategies for maintaining memory health with age.</p>
            </div>
          </details>

          <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
            <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Tips to improve your time
              <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
            </summary>
            <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
              <p style={{ marginBottom: 10 }}>Study all the cards before you start flipping. When the game begins, take a moment to scan the face-down grid and mentally note the positions of any cards you have already seen. The first few flips are exploratory — use them to build a spatial map of the board rather than hoping to match immediately. Players who build a complete mental map early consistently outperform those who flip randomly.</p>
              <p style={{ marginBottom: 10 }}>Use the knowledge you already have. When you flip a card and recognize the concept, immediately think about what its pair might be. If you see the Eiffel Tower, you know the pair is France. If you see a guitar, think about which music genre is on the board. Your semantic knowledge shortcuts the matching process by letting you predict pairs rather than discover them blindly.</p>
              <p style={{ marginBottom: 10 }}>Prioritize flipping cards in areas of the grid where you remember seeing potential pairs. After a few turns you will have a rough mental map of card positions. When you flip a card and know its pair is somewhere you have already seen, go straight there rather than exploring new territory. Efficient use of your spatial memory is the key differentiator between good and great times.</p>
              <p>Play the same difficulty level consistently for a period before moving up. Familiarity with the category types and the kinds of pairs used at each difficulty level significantly reduces the time you spend thinking about whether two cards match. Once you are consistently in the top 20% of times at your current difficulty, move up to the next level.</p>
            </div>
          </details>

          <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
            <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Memory vs other brain training games
              <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
            </summary>
            <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
              <p style={{ marginBottom: 10 }}>MemGenius Memory differs from Simon Says and Digits in a fundamental way. Simon and Digits train working memory — the ability to hold information in mind for seconds and reproduce it immediately. MemGenius Memory trains long-term semantic memory — the ability to recognize and retrieve conceptual relationships stored in your permanent knowledge base. These are entirely different memory systems that benefit from different types of training.</p>
              <p style={{ marginBottom: 10 }}>Compared to knowledge games like Flags and Countries, Memory adds a spatial dimension. You must not only know the semantic relationships between concepts but also remember where each card is on the grid. This dual demand makes Memory significantly more cognitively demanding than pure knowledge games, even when the semantic content is familiar.</p>
              <p style={{ marginBottom: 10 }}>Memory is also the most variable game on MemGenius from session to session. Each pack uses different categories and different pairs, so no two games are identical. This variability prevents the automatization that reduces cognitive demand in games with fixed content — every session requires genuine engagement with new associative challenges.</p>
              <p>Among all the games on MemGenius, Memory has the broadest knowledge scope. Categories span geography, history, science, music, food, sport, art, literature and everyday culture. Regular play builds a wide and varied knowledge network rather than deep expertise in a single domain — which is arguably more valuable for everyday cognitive performance and general learning ability.</p>
            </div>
          </details>
        </div>
      </>
    )
  } catch(e) {
    return <HomeClient easy={null} medium={null} hard={null} />
  }
}
