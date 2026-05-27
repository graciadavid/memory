import GamesClient from './GamesClient'
import MemoryGamesClient from './GamesClient'
import MemoryGamesClient from './GamesClient'
import CategoryRelated from '@/components/CategoryRelated'
import Link from 'next/link'

const COLOR = '#C62828'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export const metadata = {
 title: 'Memory Games — Train Your Brain Memory Daily | MemGenius',
 description: 'Train your memory with 5 free memory games: Memory, Digits, Simon Says, N-Back and Blink. World rankings. No login required.',
}

const GAMES = [
 { label: 'Memory', icon: `${BASE}/memory.png`, href: '/memory', desc: 'Match connected concepts' },
 { label: 'Digits', icon: `${BASE}/digits.png`, href: '/digits', desc: 'Remember sequences of numbers' },
 { label: 'Simon Says', icon: `${BASE}/sequence.png`, href: '/sequence', desc: 'Repeat the color pattern' },
 { label: 'N-Back', icon: `${BASE}/nback.png`, href: '/nback', desc: 'Working memory challenge' },
 { label: 'Blink', icon: `${BASE}/blink.png`, href: '/blink', desc: 'Remember the grid' },
 { label: 'Poke', icon: `${BASE}/salmon.png`, href: '/poke', desc: 'Remember the bowl ingredients' },
]

export default function MemoryHubPage() {
 return (
   <>
     <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>
       <div style={{ fontSize:11, fontWeight:800, color:COLOR, letterSpacing:3, textTransform:'uppercase', marginBottom:4 }}>Category</div>
       <div style={{ fontSize:32, fontWeight:900, color:'#fff', marginBottom:8 }}>Memory</div>
      <MemoryGamesClient />           <p>This semantic association task builds the neural connections that underlie general knowledge, reading comprehension and the ability to learn new information quickly. People with strong semantic networks learn faster because new information connects to existing knowledge rather than floating in isolation.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Digits — working memory and number span
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Digits tests your digit span — how many numbers you can hold in working memory and recall in the correct order. The average adult can hold 7 digits, but regular training can extend this significantly. Each level adds one more digit, progressively challenging the limits of your phonological loop.</p>
           <p>Digit span is one of the most widely used measures of working memory capacity in cognitive psychology research. It correlates strongly with IQ, academic performance and the ability to follow complex instructions. Improving your digit span has documented transfer effects to reading comprehension and mathematical reasoning.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Simon Says — visual sequence memory
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Simon Says presents a sequence of colored flashes that grows longer with each successful round. You must watch, remember and reproduce the exact sequence in order. This trains visual sequence memory — the ability to encode and reproduce ordered visual information.</p>
           <p>Visual sequence memory is used whenever you need to remember directions, reproduce a procedure from memory or recall the order of events. Musicians use it to memorise compositions, surgeons use it to sequence procedures, and athletes use it to execute complex movement patterns without conscious thought.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           N-Back — working memory updating
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>N-Back is the most scientifically studied memory training task in cognitive neuroscience. You must decide whether the current stimulus matches the one from N steps back in the sequence, constantly updating your mental buffer as new stimuli arrive. This directly trains working memory updating — the ability to hold information in mind while simultaneously processing new information.</p>
           <p>Multiple peer-reviewed studies have shown that N-Back training produces measurable improvements in fluid intelligence — the ability to solve novel problems — making it one of the few cognitive training tasks with documented transfer effects to untrained abilities. Regular N-Back practice is used by researchers, students and professionals seeking genuine cognitive enhancement.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Blink — spatial and visual memory
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Blink trains visuospatial working memory — the ability to hold and recall the position of objects in space. A grid of cells flashes briefly, and you must remember which cells were lit and reproduce the pattern from memory. As levels advance, more cells appear for shorter durations.</p>
           <p>Visuospatial memory is critical for navigation, mathematics, chess and any task involving mental rotation or spatial reasoning. It is one of the most trainable cognitive abilities and shows strong improvement with regular practice, particularly in the early stages of training when the brain is adapting most rapidly to the new challenge.</p>
         </div>
       </details>
     </div>
      <CategoryRelated current="Memory" />
   </>
 )
}
