import CapitalsClient from './CapitalsClient'
import RelatedGames from '@/components/RelatedGames'

export const metadata = {
 title: 'Capitals — World Capital Cities Quiz | MemGenius',
 description: 'How many world capitals do you know? See the flag and country name, pick the right capital city. Train your geography knowledge. World ranking. No login required.',
}

export default function CapitalsPage() {
 return (
   <>
     <CapitalsClient />
     <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
       <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Capitals train?</h2>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Capitals trains semantic memory and geographical knowledge — the part of your brain that stores factual information about the world. Recognising a flag, linking it to a country name and retrieving the correct capital city exercises three distinct memory systems simultaneously, building rich neural connections between visual, linguistic and geographical information.</p>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>Research shows that knowledge-based memory games improve general recall, strengthen long-term memory consolidation, and expand the associative networks that help us learn new information more quickly. The more you know, the easier it becomes to learn more.</p>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           How to play
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>A country flag and name appear on screen. Below, four capital cities are shown as options. Tap the correct capital. Get it right and the next country appears. One wrong answer ends the game. Your score is how many capitals you identify correctly in a row. The longer your streak, the higher your world ranking.</p>
           <p>Countries are selected randomly from a database of 150+ nations, so every game is different. Common capitals appear frequently to help you learn them, while rarer ones challenge even experienced geography enthusiasts.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           The science of geographical memory
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Geographical knowledge is stored in semantic memory — a long-term memory system that holds facts about the world independent of personal experience. Unlike episodic memory, which fades with time, well-consolidated semantic memories are remarkably stable and can last a lifetime.</p>
           <p>The hippocampus plays a central role in consolidating new geographical facts, while the prefrontal cortex helps retrieve them under time pressure. Regular practice with a quiz format has been shown to strengthen retrieval pathways — the more times you successfully recall a capital, the faster and more reliably you will recall it in the future.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Tips to improve your score
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Start with the continents you know best and use process of elimination on unfamiliar countries. Many capitals share names with their country or are well-known cities — these are easy points. For trickier nations, try to associate the capital with something memorable about the country.</p>
           <p>Playing daily builds genuine geographical knowledge over time. You will find that capitals you got wrong once become easy after seeing them a few times — this is the spacing effect in action, one of the most powerful learning mechanisms known to cognitive science.</p>
         </div>
       </details>

       <RelatedGames category="knowledge" current="Capitals" />
     </div>
   </>
 )
}
