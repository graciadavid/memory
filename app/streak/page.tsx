'use client'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const STREAK_LEVELS = [
 { min: 1, max: 5, name: 'Beginner', emoji: 'seed.png', benefit: 'You are building the habit. Consistency is the first step to cognitive improvement.', color: '#69F0AE' },
 { min: 6, max: 10, name: 'Consistent', emoji: 'streak.png', benefit: 'Neural pathways are starting to strengthen. Your brain is adapting to regular training.', color: '#69F0AE' },
 { min: 11, max: 20, name: 'Focused', emoji: 'brain-logo.webp', benefit: 'Regular training is measurably improving your reaction time and memory capacity.', color: GOLD },
 { min: 21, max: 50, name: 'Dedicated', emoji: 'ray.png', benefit: 'You are in the top tier of brain trainers. Cognitive benefits are compounding daily.', color: GOLD },
 { min: 51, max: 99, name: 'Elite', emoji: 'winner.png', benefit: 'Elite level consistency. Your brain is operating at peak training efficiency.', color: '#FF6B35' },
 { min: 100, max: Infinity, name: 'Legend', emoji: 'target.png', benefit: 'Legendary. You are among the most consistent brain trainers in the world.', color: '#FF6B35' },
]

export default function StreakPage() {
 return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
     <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
       <img src={`${BASE}/streak.png`} style={{ width:32, height:32, objectFit:'contain' }} />
       <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>Streak Levels</div>
     </div>
     <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:24 }}>Play every day to level up your brain</div>

     <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
       {STREAK_LEVELS.map(level => (
         <div key={level.name} style={{ background:'#252525', borderRadius:16, padding:'16px', display:'flex', gap:14, alignItems:'flex-start' }}>
           <img src={`${BASE}/${level.emoji}`} style={{ width:40, height:40, objectFit:'contain', flexShrink:0 }} />
           <div style={{ flex:1 }}>
             <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
               <div style={{ fontSize:16, fontWeight:900, color:'#fff' }}>{level.name}</div>
               <div style={{ fontSize:11, fontWeight:800, color:level.color, background:'rgba(255,255,255,0.05)', borderRadius:8, padding:'3px 8px' }}>
                 {level.max === Infinity ? `${level.min}+ days` : `${level.min}–${level.max} days`}
               </div>
             </div>
             <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.5 }}>{level.benefit}</div>
           </div>
         </div>
       ))}
     </div>
   </main>
 )
}
