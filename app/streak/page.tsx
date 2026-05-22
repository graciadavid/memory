import Link from 'next/link'

const LEVELS = [
 {
   days: '1–9', name: 'Starter', color: '#9E9E9E',
   brain: 'Your brain is beginning to form new neural pathways. The first days of any habit are the hardest — dopamine circuits are learning to associate the activity with reward. Consistency at this stage sets the foundation for everything that follows.'
 },
 {
   days: '10–19', name: 'Consistent', color: '#4CAF50',
   brain: 'Ten days in, your prefrontal cortex has started encoding this habit into your daily routine. Research shows that 10 days of repeated behavior begins to reduce the cognitive effort required to initiate the activity — it starts feeling natural.'
 },
 {
   days: '20–29', name: 'Dedicated', color: '#00BCD4',
   brain: 'Three weeks of daily training produces measurable changes in working memory capacity. Your hippocampus is growing new connections. Reaction times begin to improve and pattern recognition sharpens noticeably.'
 },
 {
   days: '30–39', name: 'Focused', color: '#2196F3',
   brain: 'A full month of daily brain training. Studies show 30 days of consistent cognitive exercise improves sustained attention and reduces mental fatigue. Your brain is literally more efficient — it uses less energy to perform the same tasks.'
 },
 {
   days: '40–49', name: 'Relentless', color: '#3F51B5',
   brain: 'Forty days of training activates neuroplasticity at a deep level. The myelin sheath around key neural pathways thickens, making signals faster and more precise. Your processing speed is measurably higher than when you started.'
 },
 {
   days: '50–59', name: 'Elite', color: '#9C27B0',
   brain: 'Fifty days puts you in the top tier of brain trainers. Your working memory, processing speed and executive function are all elevated. The basal ganglia have fully automated the habit — it now requires almost no willpower to maintain.'
 },
 {
   days: '60–69', name: 'Champion', color: '#E91E63',
   brain: 'Two months of daily training. At this level, cognitive benefits extend beyond the games themselves. You will notice faster thinking in everyday tasks, better memory recall and improved ability to manage multiple things at once.'
 },
 {
   days: '70–79', name: 'Legend', color: '#FF5722',
   brain: 'Seventy days represents a level of dedication that only a tiny fraction of people reach. Your anterior cingulate cortex — responsible for attention and error detection — has been fundamentally strengthened. You notice mistakes faster and correct them more efficiently.'
 },
 {
   days: '80–89', name: 'Master', color: '#FF9800',
   brain: 'Eighty days of daily training produces cognitive resilience — your brain performs well even under stress, fatigue or distraction. Elite athletes, surgeons and chess grandmasters share this level of consistent mental training.'
 },
 {
   days: '90–99', name: 'Grandmaster', color: '#FFC107',
   brain: 'Ninety days is the threshold where neuroscientists consider a behavior truly permanent. Your brain has restructured itself around this habit. The cognitive gains are no longer temporary — they are part of who you are.'
 },
 {
   days: '100+', name: 'MemGenius', color: '#C8960C',
   brain: 'One hundred days. You have achieved what fewer than 1% of people ever do. Your brain training is no longer a habit — it is an identity. The neurological changes at this level are equivalent to years of advantage in memory, speed and reasoning over people who do not train.'
 },
]

export const metadata = {
 title: 'Streak Levels — MemGenius',
 description: 'Discover the 10 streak levels on MemGenius and what each one means for your brain.',
}

export default function StreakPage() {
 return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 24px 100px' }}>
     <Link href="/profile" style={{ textDecoration:'none', fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', display:'block', marginBottom:24 }}>← Profile</Link>

     <div style={{ marginBottom:32 }}>
       <div style={{ fontSize:32, fontWeight:900, color:'#fff', marginBottom:8 }}>Streak Levels</div>
       <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, lineHeight:1.6 }}>
         Every day you play, your streak grows. Each level represents real neurological progress — your brain is changing.
       </div>
     </div>

     <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
       {LEVELS.map((l, i) => (
         <div key={l.name} style={{ background:'rgba(255,255,255,0.04)', borderRadius:20, padding:'20px', border:`1px solid ${l.color}30` }}>
           <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
             <div>
               <div style={{ fontSize:20, fontWeight:900, color:l.color }}>{l.name}</div>
               <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{l.days} days</div>
             </div>
             <div style={{ width:44, height:44, borderRadius:'50%', background:`${l.color}20`, border:`2px solid ${l.color}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, color:l.color }}>
               {i + 1}
             </div>
           </div>
           <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>
             {l.brain}
           </div>
         </div>
       ))}
     </div>
   </main>
 )
}
