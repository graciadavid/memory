import NBackClient from './NBackClient'
import RelatedGames from '@/components/RelatedGames'

export const metadata = {
 title: 'N-Back — Working Memory Training Game | MemGenius',
 description: 'Is the color the same as the previous one? Free online N-Back working memory game with world ranking. Train your cognitive flexibility and attention. No login required.',
}

export default function NBackPage() {
 return (
   <>
     <NBackClient />
     <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
       <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>Is it the same color as before?</h2>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>N-Back is a working memory game where a color appears on screen and you must decide whether it matches the color shown immediately before it. Match or Different — simple in concept, surprisingly demanding in practice. Each correct answer extends your streak. One mistake ends the game.</p>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>N-Back is one of the most studied cognitive training tasks in neuroscience. Research suggests it is one of the few brain training activities that produces genuine improvements in fluid intelligence — the ability to reason and solve novel problems — rather than just improving performance on the specific task practiced.</p>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           How to play
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>A colored circle appears on screen. Study it carefully. Then a second color appears. Your question: is this new color the same as the previous one? Tap Match if yes, Different if no. If you are correct, the current color becomes the new previous color and a new color appears. If you are wrong, the game ends and shows your streak.</p>
           <p style={{ marginBottom: 10 }}>The challenge is that you must continuously update your memory — the previous color changes with every correct answer. You cannot rely on remembering a fixed item. You must hold the most recent color in mind while simultaneously evaluating the new one and deciding whether they match.</p>
           <p>Save your score with a name and PIN to track your personal best and see your global ranking. The world leaderboard shows the longest streaks achieved by players worldwide.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           The science behind N-Back
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>The N-Back task was originally developed by Wayne Kirchner in 1958 as a laboratory measure of working memory. The name refers to the number of steps back in a sequence you must compare against the current item. In a 1-Back task — the version on MemGenius — you compare each item with the one immediately preceding it. In a 2-Back task, you compare with the item two steps back, and so on.</p>
           <p style={{ marginBottom: 10 }}>N-Back gained enormous scientific attention after a landmark 2008 study by Susanne Jaeggi and colleagues published in the Proceedings of the National Academy of Sciences. The study reported that training on a dual N-Back task — tracking both visual position and auditory sounds simultaneously — produced significant improvements in fluid intelligence, as measured by standard IQ test components.</p>
           <p style={{ marginBottom: 10 }}>This was remarkable because fluid intelligence had long been considered largely fixed and untrainable. The Jaeggi findings sparked a wave of follow-up research and commercial brain training products. While subsequent studies produced mixed results — with some finding transfer effects and others not — N-Back remains the most scientifically credible cognitive training task for working memory improvement.</p>
           <p>The neural basis of N-Back performance has been studied extensively using fMRI. The task activates the dorsolateral prefrontal cortex, the parietal lobe and the anterior cingulate cortex — a network associated with working memory, cognitive control and attention. Trained individuals show more efficient activation of this network, accomplishing the same cognitive work with less neural effort.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Working memory and fluid intelligence
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Working memory is the cognitive system that temporarily holds and manipulates information during mental tasks. It is what you use when you do mental arithmetic, follow a complex argument, hold a phone number in mind while dialing, or keep track of the thread of a conversation. Working memory capacity is one of the strongest predictors of academic and professional performance across virtually every domain.</p>
           <p style={{ marginBottom: 10 }}>Fluid intelligence — the ability to reason logically and solve novel problems without relying on previously learned knowledge — is closely linked to working memory capacity. People with larger working memory can hold more intermediate results in mind while solving a problem, consider more alternatives simultaneously and resist distraction more effectively. This is why working memory training has attracted so much interest as a route to improving general cognitive ability.</p>
           <p style={{ marginBottom: 10 }}>The relationship between N-Back training and fluid intelligence improvement remains debated in the scientific literature. A 2014 meta-analysis found modest but significant transfer effects from N-Back training to measures of fluid intelligence. A 2019 meta-analysis found larger effects for studies using active control groups. The current scientific consensus is cautiously optimistic — N-Back training probably produces some genuine improvements in fluid intelligence, though the effect size and durability vary.</p>
           <p>What is not debated is that N-Back directly trains the updating function of working memory — the ability to continuously revise the contents of working memory as new information arrives. This updating function is highly relevant to everyday cognitive demands and is specifically impaired in conditions such as ADHD, depression and age-related cognitive decline.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Tips to improve your score
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Name the color explicitly as it appears. Saying the color name to yourself — even silently — engages your verbal working memory system and gives you a second encoding channel beyond the visual one. When the next color appears, you have both a visual memory and a verbal label to compare against. This dual encoding significantly reduces error rates.</p>
           <p style={{ marginBottom: 10 }}>Do not overthink. The most common mistake for beginners is second-guessing a correct initial judgment. Your first impression of whether the colors match is usually correct. Hesitation and deliberate reasoning introduce doubt that leads to errors. Trust your immediate visual judgment and act on it quickly rather than deliberating.</p>
           <p style={{ marginBottom: 10 }}>Stay focused between rounds. The brief moment between colors is when attention tends to wander — and wandering attention during the transition causes you to encode the new color poorly. Keep your eyes on the screen and your attention on the task during the entire inter-stimulus interval, not just when the new color appears.</p>
           <p>Play in short, focused sessions rather than long fatigued ones. N-Back performance degrades significantly with mental fatigue. Ten focused minutes will produce better scores and better training effects than thirty distracted minutes. Stop playing when you notice your concentration slipping — continuing in a fatigued state produces poor performance and may reinforce bad cognitive habits rather than good ones.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           N-Back vs other memory games
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>N-Back differs fundamentally from Simon Says and Digits in what it demands from memory. Simon Says and Digits require you to hold a fixed, growing sequence in mind and recall it in order — this trains sequential working memory and long-term sequence encoding. N-Back requires continuous updating of a single item in memory — always replacing the old with the new. This trains the updating function of working memory specifically.</p>
           <p style={{ marginBottom: 10 }}>The updating function is arguably more important for everyday cognition than sequential recall. Most real-world tasks require you to continuously integrate new information with existing knowledge — following a conversation, tracking multiple variables in a problem, monitoring a changing situation. N-Back trains exactly this continuous update process in its purest form.</p>
           <p style={{ marginBottom: 10 }}>N-Back is also the most cognitively demanding game per session on MemGenius relative to its duration. A 10-minute N-Back session is significantly more mentally taxing than 10 minutes of Simon Says or Digits, because N-Back requires constant active engagement with no pause or rest between items. This intensity is part of what makes it effective as a training tool.</p>
           <p>Among all the games on MemGenius, N-Back has the strongest scientific evidence base for producing genuine improvements in cognitive ability beyond the specific task. If you are looking for brain training with the best research support, N-Back is the place to start — and the world ranking system gives you a meaningful measure of your progress over time.</p>
         </div>
       </details>

       <RelatedGames category="memory" current="N-Back" />
     </div>
   </>
 )
}
