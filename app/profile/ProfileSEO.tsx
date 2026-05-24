import CategoryRelated from '@/components/CategoryRelated'
export default function ProfileSEO() {
 return (
   <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>

     <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Your Brain Profile — What Does It Mean?</h2>
     <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>Your MemGenius profile is more than a collection of scores. It is a real-time map of your cognitive strengths and weaknesses across four fundamental areas of brain performance: Memory, Agility, Knowledge and Logic. Every time you play, your profile updates. Every time a new player joins, your percentile ranking updates too. Your Brain Score — the number at the top of your profile — is a live composite of where you stand globally across every game you have played.</p>
     <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>This is not a brain age test that assigns an arbitrary number. It is a genuine percentile ranking based on real data from real players worldwide. When it says Top 5%, it means exactly that — fewer than 5% of all players who have ever played that game on MemGenius have a better score than you.</p>

     <details style={{ marginBottom: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         What is a brain age test — and why percentiles are better
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>
         <p style={{ marginBottom: 10 }}>Most brain age tests assign a single number — "your brain is 34 years old" — based on arbitrary formulas with no scientific grounding. The number feels meaningful but it is not. It does not tell you what you are good at, what needs work, or how you compare to other people your age.</p>
         <p style={{ marginBottom: 10 }}>MemGenius takes a different approach. Instead of a brain age, you get a percentile ranking in each cognitive category. Top 10% in Agility means your reaction times and precision place you among the fastest 10% of all players. Top 25% in Knowledge means your geography and general knowledge is better than three quarters of the people who have played.</p>
         <p>This is more honest and more useful than a brain age score. It tells you exactly where you are strong and exactly where you can improve — and it updates in real time as you play and as the global player base grows.</p>
       </div>
     </details>

     <details style={{ marginBottom: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         Memory — what your score reveals
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>
         <p style={{ marginBottom: 10 }}>Your Memory score is calculated from five games: Memory (semantic pair matching), Digits (number sequence recall), Simon Says (visual sequence replication), N-Back (working memory updating) and Blink (spatial grid memory). Together these measure the full spectrum of human memory — from short-term visual storage to semantic long-term recall.</p>
         <p style={{ marginBottom: 10 }}>A high Memory score indicates strong hippocampal function and well-developed working memory capacity. Working memory — the ability to hold and manipulate information in mind over short periods — is one of the strongest predictors of general intelligence, academic performance and professional success.</p>
         <p>Memory performance peaks in the mid-twenties and declines gradually with age, but this decline is much slower in people who engage in regular memory training. Research consistently shows that deliberate memory exercise maintains capacity and retrieval speed well into later life.</p>
       </div>
     </details>

     <details style={{ marginBottom: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         Agility — reaction time and mental precision
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>
         <p style={{ marginBottom: 10 }}>Agility covers five games: Stop (interval timing precision), F1 Reaction (visual reaction time), Pendulum (synchronisation accuracy), Ace (spatial precision) and Letter Rain (selective attention under pressure). This category measures the speed and accuracy of your nervous system — how quickly and precisely you can respond to what your brain detects.</p>
         <p style={{ marginBottom: 10 }}>Reaction time is often used as a proxy for overall brain processing speed. Studies have found that faster reaction times correlate with higher IQ scores, better driving performance and lower risk of accidents. The basal ganglia, cerebellum and primary motor cortex are the key structures involved.</p>
         <p>Unlike many cognitive abilities, reaction time is highly trainable. Elite athletes, surgeons and fighter pilots all demonstrate reaction times significantly faster than average — and research shows this advantage comes from years of deliberate practice, not purely from genetics.</p>
       </div>
     </details>

     <details style={{ marginBottom: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         Knowledge — the breadth of what you know
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>
         <p style={{ marginBottom: 10 }}>Knowledge is measured across five games: Flags (visual recognition of world flags), Higher or Lower Population (global demographic reasoning), Higher or Lower Area (geographical size estimation), Countries (shape recognition) and Capitals (capital city recall). These games test the breadth and accessibility of your stored world knowledge.</p>
         <p style={{ marginBottom: 10 }}>Semantic memory — the long-term store of factual knowledge — is one of the most resilient forms of human memory. It declines later and more slowly than episodic memory, and well-consolidated knowledge can be retained into extreme old age. However, the speed of retrieval — how quickly you can access what you know — does decline with age and benefits significantly from regular practice.</p>
         <p>A strong Knowledge score indicates a broad, well-organised semantic network. People with extensive general knowledge tend to learn new information more quickly because they have more existing connections to attach new facts to — a phenomenon known as the Matthew effect in cognitive science.</p>
       </div>
     </details>

     <details style={{ marginBottom: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         Logic — reasoning and strategic thinking
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>
         <p style={{ marginBottom: 10 }}>Logic is evaluated through five games: Sudoku (constraint-based deduction), Mastermind (hypothesis testing and elimination), 2048 (spatial planning and combinatorial thinking), Wordly (linguistic pattern recognition) and Blackjack (probabilistic decision-making under uncertainty). Together they measure your capacity for structured reasoning, strategic planning and systematic problem-solving.</p>
         <p style={{ marginBottom: 10 }}>Logical reasoning engages the prefrontal cortex — the most recently evolved and uniquely human part of the brain. It is the seat of executive function: planning, inhibition, working memory integration and abstract thought. The prefrontal cortex takes the longest to mature (fully developed only around age 25) and is among the first regions to show age-related decline.</p>
         <p>The good news is that logical reasoning is highly responsive to training. Chess players, mathematicians and programmers consistently show enhanced prefrontal function compared to non-practitioners, and the gains transfer to other domains of reasoning and decision-making.</p>
       </div>
     </details>

     <details style={{ marginBottom: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         Why daily training matters — the science of neuroplasticity
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>
         <p style={{ marginBottom: 10 }}>The brain is not fixed. Neuroplasticity — the capacity of the brain to reorganise itself by forming new neural connections — continues throughout life. Every time you practise a cognitive skill, you strengthen the synaptic connections involved. Every time you rest, the brain consolidates those connections. The result is genuine, measurable improvement in the trained ability.</p>
         <p style={{ marginBottom: 10 }}>But neuroplasticity requires consistency. A single training session produces temporary improvements that fade within days without reinforcement. Daily practice, by contrast, drives structural changes — increased grey matter density in relevant regions, thicker myelin sheaths around key neural pathways, stronger and faster connections between brain areas. These changes accumulate over weeks and months.</p>
         <p style={{ marginBottom: 10 }}>This is why the streak system matters. Your streak represents days of consecutive training — each day adding to a growing foundation of structural brain change. At 10 days, you are forming new habits. At 30 days, measurable structural changes begin. At 90 days, neuroscientists consider the changes permanent.</p>
         <p>The optimal training session is 10-20 minutes of focused, varied cognitive challenge. MemGenius is designed to deliver exactly this — enough games to cover all four cognitive categories in a short daily session, with world rankings to maintain motivation and clear progress metrics to show that the training is working.</p>
       </div>
     </details>

     <details style={{ marginBottom: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         How to improve your Brain Score
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>
         <p style={{ marginBottom: 10 }}>Your Brain Score reflects the average of all your category percentiles. The fastest way to improve it is to identify your weakest category and focus there. If you are Top 5% in Agility but unranked in Logic, a few sessions of Sudoku and Mastermind will move your overall score more than additional Stop practice.</p>
         <p style={{ marginBottom: 10 }}>Within each category, the games with the highest player populations give you the most meaningful percentile rankings. Memory, Flags, Stop and Higher or Lower Population have the largest player bases — beating more players in these games has a bigger impact on your percentile than beating the same number in a newer game with fewer players.</p>
         <p style={{ marginBottom: 10 }}>Consistency matters more than intensity. Playing every day for 10 minutes will improve your scores faster than occasional two-hour sessions. The brain learns through repetition and consolidation, not through marathon training.</p>
         <p>Finally, track your progress over time. Your percentile rankings update in real time as you play and as new players join. A percentile that seems stuck may be moving relative to a growing global player base. Check your profile regularly and celebrate genuine improvements — they represent real neurological change.</p>
       </div>
     </details>

     <details style={{ marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         Brain training, cognitive fitness and mental agility exercises
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>
         <p style={{ marginBottom: 10 }}>MemGenius is designed as a daily cognitive fitness platform — the equivalent of a gym membership for your brain. Just as physical fitness requires varied exercise across different muscle groups, cognitive fitness requires varied training across different brain systems. A workout that only trains memory leaves reaction time and reasoning untouched. MemGenius ensures full-spectrum brain training in a single short daily session.</p>
         <p style={{ marginBottom: 10 }}>Mental agility — the ability to think quickly, switch between tasks, and solve problems under pressure — is one of the most practically valuable cognitive skills. It underlies performance in high-pressure professions, competitive sports, academic settings and daily decision-making. It is also one of the most trainable: regular cognitive challenge measurably improves mental agility across all age groups.</p>
         <p style={{ marginBottom: 10 }}>The question of how old your brain is — your brain age — is less useful than understanding where your brain performs well and where it struggles. Two people with the same calendar age can have wildly different cognitive profiles: one might have the reaction time of a 20-year-old and the memory of a 45-year-old, while another shows the opposite pattern. Your MemGenius profile captures this nuance in a way that a single brain age number never could.</p>
         <p>Whether you are looking for a free brain age test, a cognitive skills assessment, a daily brain workout or simply the satisfaction of competing on a global leaderboard, your MemGenius profile gives you something more valuable: an honest, data-driven picture of your cognitive strengths — and a clear path to improving them.</p>
       </div>
     </details>

   </div>
 )
}
