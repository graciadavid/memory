import LetterRainClient from './LetterRainClient'
import RelatedGames from '@/components/RelatedGames'

export const metadata = {
 title: 'Letter Rain — Count the Falling Letters | MemGenius',
 description: 'Letters rain down from the sky. Count how many times the target letter appears. Train your selective attention and focus. World ranking. No login required.',
}

export default function LetterRainPage() {
 return (
   <>
     <LetterRainClient />
     <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
       <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Letter Rain train?</h2>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Letter Rain trains selective attention — the brain's ability to focus on a specific target while filtering out irrelevant information. As letters fall across the screen, your brain must constantly scan, identify and count only the ones that match the target, ignoring everything else. This is one of the most fundamental and trainable cognitive skills.</p>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>Research shows that selective attention training improves performance in reading, driving, sports and any task that requires sustained focus in a noisy environment. The letter format makes it particularly demanding because similar-looking letters create visual interference that forces the brain to work harder.</p>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           How to play
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>A target letter appears at the top of the screen in green. Letters then rain down from above — most are random, but some match your target. Count silently how many target letters fall. When the round ends, type your count. Get it right and you advance to the next letter. The game goes from A to Z — how far can you reach?</p>
           <p>The target letters are highlighted in green so you can identify them instantly. The challenge is not identification but counting — tracking a running total in your head while new letters keep falling demands sustained working memory alongside selective attention.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           The science of selective attention
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Selective attention is controlled by a network of brain regions including the prefrontal cortex, parietal cortex and anterior cingulate cortex. This network acts as a filter, amplifying neural signals from attended stimuli and suppressing those from distractors. When you focus on the letter A while ignoring everything else, you are actively engaging this filtering system.</p>
           <p style={{ marginBottom: 10 }}>The famous "gorilla experiment" demonstrated how selective attention works — people so focused on counting basketball passes missed a gorilla walking through the scene entirely. Letter Rain exploits this same mechanism, making you focus so intensely on the target letter that distractors effectively become invisible.</p>
           <p>Training selective attention has been shown to improve ADHD symptoms, reading speed, and performance in any task requiring sustained focus. Athletes use similar training to track specific players in chaotic game situations. Air traffic controllers develop exceptional selective attention through years of practice with exactly this type of task.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Tips to improve your count
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>The most effective strategy is to use a rhythmic sub-vocal count — whisper or think the number each time you spot the target letter. Avoid trying to keep a visual image of the count; instead, let the number increment automatically with each hit, like a mental odometer.</p>
           <p style={{ marginBottom: 10 }}>Scan the screen systematically rather than randomly. Many people find that scanning in a Z-pattern from top-left to bottom-right catches more targets than unfocused watching. As letters speed up at higher levels, narrow your gaze to the center of the screen where density is highest.</p>
           <p>Do not stress about distractors. The more you try to suppress them, the more cognitive resources you waste. Instead, train yourself to be completely indifferent to non-target letters — they simply do not exist. This passive filtering is far more efficient than active suppression.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Why letters get harder as you advance
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Letter Rain progresses through the alphabet deliberately. Early letters like A and B are visually distinct and rarely confused. As you advance into letters like M, N, V, W and similar pairs, visual similarity between the target and distractors increases dramatically. Your brain must work harder to distinguish them under time pressure.</p>
           <p>Later levels also increase the number and speed of falling letters, compounding the difficulty. Reaching letter Z means you have demonstrated exceptional selective attention across the full range of visual letter discrimination — a genuinely impressive cognitive feat that very few players achieve.</p>
         </div>
       </details>

       <RelatedGames category="agility" current="Letter Rain" />
     </div>
   </>
 )
}
