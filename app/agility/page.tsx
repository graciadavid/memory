import CategoryRelated from '@/components/CategoryRelated'
import AgilityClient from './AgilityClient'

export const metadata = {
 title: 'Agility Games — Reaction Time & Precision | MemGenius',
 description: 'Test your reaction time, timing and precision with 5 free agility games. F1 reaction test, stopwatch precision, pendulum, ace and letter rain. World rankings. No login required.',
}

export default function AgilityPage() {
 return (
   <>
     <AgilityClient />
     <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
       <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>Train your reaction time and precision</h2>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Agility is the ability to perceive, decide and act quickly and accurately. It is one of the most trainable cognitive abilities — elite athletes, surgeons, pilots and gamers all develop exceptional reaction times and timing precision through deliberate practice. The four Agility games on MemGenius each isolate a different dimension of this skill.</p>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>The average human reaction time to a visual stimulus is around 250 milliseconds. Elite Formula 1 drivers react in under 200ms. With consistent daily practice, most people can measurably improve their reaction time within two to three weeks — and the world rankings on each game let you see exactly where you stand globally.</p>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Stop — internal clock precision
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Stop challenges you to tap a button at exactly 5.000 seconds without any visual aid after the timer starts. No countdown, no progress bar — just your internal sense of time. Your score is how close you get to the exact target, measured in milliseconds.</p>
           <p style={{ marginBottom: 10 }}>This game trains interval timing — the brain's ability to measure duration internally. This ability is controlled by the basal ganglia and cerebellum, and it underlies musical rhythm, athletic performance and even social timing in conversation. People with strong interval timing tend to be better musicians, dancers and athletes.</p>
           <p>Most people's first attempts land between 4.5 and 5.5 seconds. With practice, top players consistently hit within 50 milliseconds of the target — a level of precision that requires genuine calibration of your internal clock rather than counting or guessing.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           F1 Reaction — simple reaction time
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Five red lights illuminate one by one, just like the start of a Formula 1 race. When they go out, tap as fast as you can. Your reaction time is measured to the millisecond. React before the lights go out and it counts as a jump start — just like in real F1.</p>
           <p style={{ marginBottom: 10 }}>This is a pure simple reaction time test — the most studied measure in cognitive psychology. Simple reaction time reflects the speed of the entire perception-decision-action chain: how fast your eyes detect the stimulus, how fast your brain processes it, and how fast your motor system executes the response.</p>
           <p>The world record for human simple reaction time to a visual stimulus is around 100ms, achieved only by elite athletes under controlled conditions. Most people score between 180ms and 300ms. Anything under 200ms is exceptional. The random delay before lights out prevents anticipation, ensuring the score reflects true reaction speed rather than timing skill.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Pendulum — dynamic timing precision
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>A pendulum swings back and forth on screen. Your challenge is to tap at the exact moment it reaches the vertical position — the center of its arc. The closer to perfectly vertical your tap lands, the higher your score. This is harder than it sounds because you must predict the pendulum's position slightly ahead of time to compensate for your own reaction delay.</p>
           <p style={{ marginBottom: 10 }}>Pendulum trains anticipatory timing — the ability to synchronize an action with a moving target. This is the same cognitive skill used in hitting a baseball, returning a tennis serve, catching a ball or playing a musical instrument in time with other musicians. It requires your brain to build a predictive model of the pendulum's motion and fire the motor command slightly early.</p>
           <p>Unlike reaction time games where faster is always better, Pendulum rewards accuracy over speed. It is one of the most nuanced agility challenges on MemGenius and the one where deliberate practice produces the most dramatic improvement over time.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Ace — spatial precision
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Ace challenges you to tap a moving target at the precise moment it passes through the sweet spot. Miss the window and you score nothing. Hit the center perfectly and you score the maximum. It combines the reaction speed of F1 with the timing precision of Pendulum into a single challenge inspired by the serve in padel and tennis.</p>
           <p style={{ marginBottom: 10 }}>This game trains what sports scientists call coincidence anticipation timing — the ability to coordinate a motor action with the arrival of a moving object at a specific point in space and time. It is one of the most complex agility skills and the one most directly relevant to ball sports, racket sports and any activity requiring hand-eye coordination.</p>
           <p>Top players on Ace develop a remarkable consistency — hitting the sweet spot repeatedly under time pressure. This consistency is the hallmark of genuine motor skill learning rather than luck, and it is one of the most satisfying forms of improvement to experience firsthand.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Letter Rain — selective attention and counting
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Letter Rain challenges you to count how many times a target letter appears as letters fall from above. It trains selective attention — the ability to focus on a specific stimulus while filtering out irrelevant information under time pressure. The game progresses through the alphabet from A to Z, with each level bringing more letters falling faster.</p>
           <p style={{ marginBottom: 10 }}>Selective attention is one of the most practically valuable cognitive skills. Air traffic controllers, surgeons, competitive athletes and drivers all rely on the ability to focus on what matters while ignoring distractions. Research shows this skill responds strongly to training and transfers to real-world performance in high-demand environments.</p>
           <p>Letter Rain uniquely combines selective attention with working memory — you must maintain a running count while simultaneously scanning for the target letter. This dual-task demand makes it one of the most cognitively rich games on MemGenius.</p>
         </div>
       </details>
     </div>
      <CategoryRelated current="Agility" />
   </>
 )
}
