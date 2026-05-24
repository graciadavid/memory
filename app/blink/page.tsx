import BlinkClient from './BlinkClient'
import RelatedGames from '@/components/RelatedGames'

export const metadata = {
 title: 'Blink — Spatial Memory Grid Game | MemGenius',
 description: 'A grid flashes for a split second. Remember which cells lit up and tap them back. Train your spatial memory. World ranking. No login required.',
}

export default function BlinkPage() {
 return (
   <>
     <BlinkClient />
     <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
       <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Blink train?</h2>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Blink trains visuospatial working memory — the ability to hold and manipulate visual and spatial information in your mind. When the grid flashes and disappears, your brain must encode the position of each lit cell and maintain that mental map long enough to reproduce it. This is one of the most fundamental and trainable cognitive abilities.</p>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>Visuospatial memory underpins navigation, mathematics, reading maps, playing chess and many professional skills. Research consistently shows it responds well to training — even a few weeks of regular practice produces measurable improvements in memory capacity and processing speed.</p>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           How to play
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>A 5×5 grid appears. Some cells light up briefly — then go dark. Your job is to tap exactly the cells that were lit. Get them all right and you advance to the next level with more cells to remember. One mistake ends the game.</p>
           <p>Level 1 shows 3 cells. Each level adds one more. The flash duration also shortens as you progress, giving your brain less time to encode the pattern.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Tips to improve
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Try to group the lit cells into clusters or shapes rather than remembering individual positions. The brain handles patterns much better than arbitrary lists. If three cells form an L-shape, remember the L — not three separate coordinates.</p>
           <p>Scan the grid systematically during the flash — top to bottom, left to right. This gives your brain a consistent encoding strategy that becomes faster with practice.</p>
         </div>
       </details>

       <RelatedGames category="memory" current="Blink" />
     </div>
   </>
 )
}
