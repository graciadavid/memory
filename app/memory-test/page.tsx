import { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export const metadata: Metadata = {
 title: 'Memory Test — Free Online | MemGenius',
 description: 'Test your memory for free online. 6 different memory tests measuring working memory, recall and pattern recognition. World rankings. No login required.',
 keywords: ['memory test', 'online memory test', 'free memory test', 'working memory test', 'short term memory test'],
}

export default function MemoryTestPage() {
 return (
   <main style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 100px', fontFamily: 'var(--font-nunito), sans-serif', background: '#fff', minHeight: '100dvh' }}>

     <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>Memory Test</h1>
     <p style={{ fontSize: 16, lineHeight: 1.8, color: '#555', marginBottom: 32 }}>How good is your memory really? Most people overestimate it. The human brain can hold about 7 items in working memory at once. Some people manage 4. A few exceptional ones reach 12. Find out where you stand with these six free memory tests.</p>

     <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E', marginBottom: 16 }}>6 Free Memory Tests</h2>

     <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>

       <Link href="/digits" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '20px 24px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 16 }}>
         <img src={`${BASE}/digits.png`} style={{ width: 52, height: 52, objectFit: 'contain', flexShrink: 0 }} />
         <div>
           <div style={{ fontSize: 18, fontWeight: 900, color: '#1C1C1E', marginBottom: 4 }}>Digits</div>
           <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>A sequence of numbers appears and disappears. How many can you remember in the right order? This is the classic digit span test used in psychology research for a hundred years. Most people max out at 7.</div>
           <div style={{ marginTop: 8, fontSize: 13, fontWeight: 800, color: '#2E7D32' }}>Play free →</div>
         </div>
       </Link>

       <Link href="/sequence" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '20px 24px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 16 }}>
         <img src={`${BASE}/sequence.png`} style={{ width: 52, height: 52, objectFit: 'contain', flexShrink: 0 }} />
         <div>
           <div style={{ fontSize: 18, fontWeight: 900, color: '#1C1C1E', marginBottom: 4 }}>Simon Says</div>
           <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>A sequence of colors flashes. Repeat it back. Each round adds one more. It is simple in concept and brutal in practice. Your brain has to hold a growing sequence while simultaneously watching the next one.</div>
           <div style={{ marginTop: 8, fontSize: 13, fontWeight: 800, color: '#2E7D32' }}>Play free →</div>
         </div>
       </Link>

       <Link href="/nback" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '20px 24px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 16 }}>
         <img src={`${BASE}/nback.png`} style={{ width: 52, height: 52, objectFit: 'contain', flexShrink: 0 }} />
         <div>
           <div style={{ fontSize: 18, fontWeight: 900, color: '#1C1C1E', marginBottom: 4 }}>N-Back</div>
           <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>Does this color match the one from two rounds ago? N-Back is one of the most researched working memory tasks in neuroscience. Studies have linked regular N-Back training to improvements in fluid intelligence.</div>
           <div style={{ marginTop: 8, fontSize: 13, fontWeight: 800, color: '#2E7D32' }}>Play free →</div>
         </div>
       </Link>

       <Link href="/blink" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '20px 24px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 16 }}>
         <img src={`${BASE}/blink.png`} style={{ width: 52, height: 52, objectFit: 'contain', flexShrink: 0 }} />
         <div>
           <div style={{ fontSize: 18, fontWeight: 900, color: '#1C1C1E', marginBottom: 4 }}>Blink</div>
           <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>A grid of cells lights up briefly. Remember which ones and tap them back. Spatial memory under time pressure. The grid gets bigger as you progress. Most people fail at level 4. Some reach level 10.</div>
           <div style={{ marginTop: 8, fontSize: 13, fontWeight: 800, color: '#2E7D32' }}>Play free →</div>
         </div>
       </Link>

       <Link href="/memory" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '20px 24px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 16 }}>
         <img src={`${BASE}/memory.png`} style={{ width: 52, height: 52, objectFit: 'contain', flexShrink: 0 }} />
         <div>
           <div style={{ fontSize: 18, fontWeight: 900, color: '#1C1C1E', marginBottom: 4 }}>Memory</div>
           <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>Match connected concepts against the clock. Tests associative memory, the ability to link related ideas and retrieve them quickly. The same type of memory you use to remember names and faces.</div>
           <div style={{ marginTop: 8, fontSize: 13, fontWeight: 800, color: '#2E7D32' }}>Play free →</div>
         </div>
       </Link>

       <Link href="/poke" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '20px 24px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 16 }}>
         <img src={`${BASE}/salmon.png`} style={{ width: 52, height: 52, objectFit: 'contain', flexShrink: 0 }} />
         <div>
           <div style={{ fontSize: 18, fontWeight: 900, color: '#1C1C1E', marginBottom: 4 }}>Poke</div>
           <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>A poke bowl appears with ingredients for 3 seconds, then disappears. Select exactly which ingredients were in it. Visual object memory at its purest. You would be surprised how much you miss.</div>
           <div style={{ marginTop: 8, fontSize: 13, fontWeight: 800, color: '#2E7D32' }}>Play free →</div>
         </div>
       </Link>

     </div>

     <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>Why does memory matter?</h2>
     <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 16 }}>Working memory is the mental workspace where your brain holds and manipulates information in the moment. It is not about how much you can store long term. It is about how much you can work with right now. Better working memory means faster learning, better decision making and sharper focus under pressure.</p>
     <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 32 }}>The good news is that working memory capacity is not fixed. It responds to training. The people in our top rankings did not start there. They practiced until their scores stopped surprising them.</p>

     <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>How to improve your memory</h2>
     <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 16 }}>Short daily sessions outperform long occasional ones. Ten minutes every day beats ninety minutes once a week. The brain needs repetition spread over time to consolidate new capacity, not intensity in a single session.</p>
     <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 40 }}>Sleep is the most underrated memory tool. During deep sleep your brain replays the day and consolidates what it learned. Poor sleep does not just make you tired. It actively erases what you tried to learn.</p>

     <div style={{ background: '#1C1C1E', borderRadius: 20, padding: '28px 24px', textAlign: 'center' }}>
       <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Test your memory now</div>
       <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Free. No login. World rankings.</div>
       <Link href="/digits" style={{ textDecoration: 'none', display: 'inline-block', background: '#2E7D32', borderRadius: 14, padding: '14px 32px', fontSize: 16, fontWeight: 900, color: '#fff' }}>
         Start the test →
       </Link>
     </div>

   </main>
 )
}
