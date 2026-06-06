export const metadata = {
 title: 'Your Brain Peaks at 3pm — The Best Time to Study and Train | MemGenius Discover',
 description: 'Chronobiology research shows your brain hits peak performance in the early afternoon. Here is exactly how to use that window to study, learn and train smarter.',
 keywords: 'best time to study, brain peak performance time, circadian rhythm memory, when is your brain most active, best time to train your brain, 3pm focus, chronobiology productivity',
}

export default function Page() {
 return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'0 0 100px' }}>
     <div style={{ maxWidth:430, margin:'0 auto' }}>

       <div style={{ padding:'16px 16px 0' }}>
         <a href="/discover" style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, textDecoration:'none', display:'block', marginBottom:16 }}>← Discover</a>
       </div>

       <div style={{ position:'relative', width:'100%', aspectRatio:'1/1', overflow:'hidden' }}>
         <img
           src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/3pm.png"
           alt="MemGenius brain mascot at peak performance at 3pm"
           style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
         />
         <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg, #1A1A1A 0%, transparent 55%)' }} />
         <div style={{ position:'absolute', top:12, left:12, background:'#f97316', color:'#fff', fontSize:10, fontWeight:800, letterSpacing:2, textTransform:'uppercase', padding:'4px 10px', borderRadius:20 }}>Performance</div>
       </div>

       <div style={{ padding:'0 16px' }}>

         <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:8, marginTop:4 }}>Brain Science · 4 min read</div>
         <h1 style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:12, lineHeight:1.15 }}>
           Your Brain Peaks at 3pm. Here Is How to Use It.
         </h1>
         <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:20, fontWeight:600 }}>
           Chronobiology research has mapped the exact hours when your memory, focus and reaction time are at their highest. Most people waste that window without knowing it exists.
         </p>

         <div style={{ display:'flex', gap:8, marginBottom:24 }}>
           {[['3pm','Peak window'],['2h','Duration'],['26%','Better recall']].map(([num, lbl]) => (
             <div key={lbl} style={{ flex:1, background:'#252525', borderRadius:12, padding:'12px 8px', textAlign:'center', border:'1px solid rgba(249,115,22,0.25)' }}>
               <div style={{ fontSize:18, fontWeight:900, color:'#fb923c', lineHeight:1 }}>{num}</div>
               <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>{lbl}</div>
             </div>
           ))}
         </div>

         <div style={{ height:1, background:'rgba(255,255,255,0.07)', marginBottom:24 }} />

         <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.8, display:'flex', flexDirection:'column', gap:14 }}>

           <div style={{ fontSize:11, fontWeight:800, color:'#fb923c', letterSpacing:2, textTransform:'uppercase' }}>The Science</div>
           <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>Your Brain Has a Daily Performance Schedule</h2>

           <p>Your body runs on a 24-hour biological clock called the <strong style={{color:'#fff'}}>circadian rhythm</strong>. Every cognitive function — attention, working memory, processing speed, reaction time — follows a predictable daily curve. And that curve peaks in the early-to-mid afternoon for most people, typically between 2pm and 4pm.</p>

           <div style={{ background:'#252525', borderRadius:14, padding:'16px', border:'1px solid rgba(249,115,22,0.2)' }}>
             <div style={{ fontSize:10, fontWeight:800, color:'#fb923c', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Peer-reviewed study</div>
             <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.7, margin:0 }}>A study from the University of Toronto tested memory and attention across different times of day and found that performance on cognitive tasks was <strong style={{color:'#fff'}}>26% higher in the early afternoon</strong> compared to morning or evening. Reaction time, working memory accuracy and learning speed all peaked in the same window.</p>
             <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:700, marginTop:8, fontStyle:'italic' }}>Anderson et al. — Psychological Science (2014)</div>
           </div>

           <p>The mechanism is body temperature. Your core temperature rises through the morning, peaks in the early afternoon, and falls toward evening. <strong style={{color:'#fff'}}>Higher core temperature correlates directly with faster neural conduction</strong> — the speed at which signals travel between neurons. When your body is warmest, your brain is fastest.</p>

           <div style={{ borderLeft:'3px solid #fb923c', padding:'12px 14px', background:'rgba(249,115,22,0.05)', borderRadius:'0 10px 10px 0' }}>
             <p style={{ fontSize:15, fontWeight:900, color:'#fff', lineHeight:1.3, margin:0 }}>"The best time to study is not when you feel like it. It is when your biology has scheduled peak cognitive performance — and that window is predictable, consistent and usable."</p>
             <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:8 }}>— Dr. Daniel Pink, When: The Scientific Secrets of Perfect Timing</div>
           </div>

           <p>The post-lunch dip — that familiar afternoon fog around 1pm — is real and also biological. It is not caused by lunch. It happens even when people fast. It is a brief trough in the circadian curve, lasting 30-60 minutes, after which the brain rebounds to its daily peak. <strong style={{color:'#fff'}}>The peak follows the dip.</strong> If you can get through the dip — or sleep through it with a short nap — you arrive at the best cognitive window of the day.</p>

           <div style={{ height:1, background:'rgba(255,255,255,0.07)' }} />

           <div style={{ fontSize:11, fontWeight:800, color:'#fb923c', letterSpacing:2, textTransform:'uppercase' }}>When to Do What</div>
           <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>Map Your Day to Your Biology</h2>

           {[
             ['Morning 8–11am', 'Analytical work and deep focus', 'Cortisol is high and rising. This is the best time for tasks that require logical thinking, writing, planning and problem-solving. Not ideal for creative brainstorming but excellent for executing known tasks with precision.', 'Deep work'],
             ['Midday 12–2pm', 'The dip — protect or nap', 'Avoid scheduling anything cognitively demanding here. Use it for admin, calls, meals, or a 20-minute nap. A nap of exactly 20 minutes during this window restores alertness and sets you up for the afternoon peak.', 'Rest or nap'],
             ['Afternoon 2–4pm', 'Peak performance window', 'This is your brain at its best. Reaction time, working memory and learning speed are all at their daily maximum. Schedule your most important cognitive work here — studying, skill training, creative thinking, and MemGenius sessions.', 'Train here'],
             ['Evening 5–8pm', 'Social and creative tasks', 'Inhibitions are lower and associative thinking is more fluid. Good for creative work, language learning, reading and social activities. Memory consolidation begins as melatonin rises — a good time to review what you learned in the afternoon.', 'Review and consolidate'],
           ].map(([time, title, desc, tip]) => (
             <div key={time} style={{ display:'flex', gap:12, alignItems:'flex-start', background:'#252525', borderRadius:14, padding:'14px' }}>
               <div style={{ minWidth:44, textAlign:'center' }}>
                 <div style={{ fontSize:11, fontWeight:900, color:'#fb923c', lineHeight:1.2 }}>{time.split(' ')[0]}</div>
                 <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>{time.split(' ')[1]}</div>
               </div>
               <div>
                 <div style={{ fontSize:14, fontWeight:900, color:'#fff', marginBottom:4 }}>{title}</div>
                 <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6, marginBottom:6 }}>{desc}</div>
                 <div style={{ fontSize:11, fontWeight:800, color:'#fb923c', background:'rgba(249,115,22,0.1)', padding:'3px 8px', borderRadius:6, display:'inline-block' }}>{tip}</div>
               </div>
             </div>
           ))}

         </div>

         <a href="/" style={{ textDecoration:'none', display:'block', marginTop:28 }}>
           <div style={{ background:'linear-gradient(135deg, #f97316, #c2410c)', borderRadius:16, padding:'20px 16px', textAlign:'center' }}>
             <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:6 }}>Is It Your Peak Window Now?</div>
             <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.6, marginBottom:16 }}>If it is between 2pm and 4pm, this is the best moment of your day to train your brain. Open MemGenius and use the window.</div>
             <div style={{ background:'#C8960C', borderRadius:30, padding:'12px 24px', fontSize:15, fontWeight:900, color:'#fff', display:'inline-block' }}>Train Now</div>
           </div>
         </a>

         <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginTop:16, border:'1px solid rgba(255,255,255,0.06)' }}>
           <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Tomorrow's discovery</div>
           <div style={{ display:'flex', alignItems:'center', gap:12 }}>
             <div style={{ width:56, height:56, minWidth:56, borderRadius:10, background:'#333', opacity:0.35 }} />
             <div>
               <div style={{ fontSize:14, fontWeight:900, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>More discoveries coming soon</div>
               <div style={{ fontSize:11, fontWeight:800, color:'#C8960C' }}>Keep your streak to unlock</div>
             </div>
           </div>
         </div>

       </div>
     </div>
   </main>
 )
}
