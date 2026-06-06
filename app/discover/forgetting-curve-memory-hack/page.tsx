export const metadata = {
 title: 'Why You Forget 70% of Everything — MemGenius Discover',
 description: 'Ebbinghaus discovered the forgetting curve in 1885. Most people still ignore the fix. Here is the exact method to remember almost everything you learn.',
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
           src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/forget.png"
           alt="MemGenius brain mascot forgetting"
           style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
         />
         <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg, #1A1A1A 0%, transparent 55%)' }} />
         <div style={{ position:'absolute', top:12, left:12, background:'#6366f1', color:'#fff', fontSize:10, fontWeight:800, letterSpacing:2, textTransform:'uppercase', padding:'4px 10px', borderRadius:20 }}>Learning</div>
       </div>

       <div style={{ padding:'0 16px' }}>

         <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:8, marginTop:4 }}>Brain Science · 4 min read</div>
         <h1 style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:12, lineHeight:1.15 }}>
           Why You Forget 70% of Everything
         </h1>
         <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:20, fontWeight:600 }}>
           A German psychologist discovered the exact rate at which humans forget in 1885. The fix has been known for over a century. Almost nobody uses it.
         </p>

         <div style={{ display:'flex', gap:8, marginBottom:24 }}>
           {[['70%','Forgotten in 24h'],['1885','Discovery year'],['5x','Retention boost']].map(([num, lbl]) => (
             <div key={lbl} style={{ flex:1, background:'#252525', borderRadius:12, padding:'12px 8px', textAlign:'center', border:'1px solid rgba(99,102,241,0.25)' }}>
               <div style={{ fontSize:18, fontWeight:900, color:'#818cf8', lineHeight:1 }}>{num}</div>
               <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>{lbl}</div>
             </div>
           ))}
         </div>

         <div style={{ height:1, background:'rgba(255,255,255,0.07)', marginBottom:24 }} />

         <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.8, display:'flex', flexDirection:'column', gap:14 }}>

           <div style={{ fontSize:11, fontWeight:800, color:'#818cf8', letterSpacing:2, textTransform:'uppercase' }}>The Science</div>
           <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>The Forgetting Curve</h2>

           <p>Hermann Ebbinghaus spent years memorizing nonsense syllables and testing his own recall at precise intervals. What he found was ruthless: without any reinforcement, humans forget roughly <strong style={{color:'#fff'}}>50% of new information within an hour</strong>, 70% within 24 hours, and nearly 90% within a week. This decay follows a predictable mathematical curve.</p>

           <div style={{ background:'#252525', borderRadius:14, padding:'16px', border:'1px solid rgba(99,102,241,0.2)' }}>
             <div style={{ fontSize:10, fontWeight:800, color:'#818cf8', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Peer-reviewed study</div>
             <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.7, margin:0 }}>Modern replications of Ebbinghaus confirm his original findings. A 2015 study found that spaced repetition improves long-term retention by <strong style={{color:'#fff'}}>200-500%</strong> compared to a single study session of the same total duration.</p>
             <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:700, marginTop:8, fontStyle:'italic' }}>Cepeda et al. — Psychological Science (2015)</div>
           </div>

           <p>The key insight is that <strong style={{color:'#fff'}}>reviewing at the moment just before you forget</strong> is dramatically more effective than reviewing when the memory is still fresh. Each correctly timed review resets the forgetting curve at a shallower slope.</p>

           <div style={{ borderLeft:'3px solid #818cf8', padding:'12px 14px', background:'rgba(99,102,241,0.05)', borderRadius:'0 10px 10px 0' }}>
             <p style={{ fontSize:15, fontWeight:900, color:'#fff', lineHeight:1.3, margin:0 }}>"The spacing effect is one of the most robust findings in cognitive psychology. It works for every type of material, every age group, and every level of intelligence."</p>
             <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:8 }}>— Dr. Robert Bjork, UCLA Memory Lab</div>
           </div>

           <p>This is exactly why daily brain training works better than weekly sessions of the same total duration. Returning to MemGenius every day catches your memories at precisely the interval where reinforcement has the highest impact.</p>

           <div style={{ height:1, background:'rgba(255,255,255,0.07)' }} />

           <div style={{ fontSize:11, fontWeight:800, color:'#818cf8', letterSpacing:2, textTransform:'uppercase' }}>Apply It Today</div>
           <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>The Exact Protocol. 3 Steps.</h2>

           {[
             ['1','Review within 24 hours','Whatever you learn today — a name, a fact, a skill — review it once before you sleep and once the following morning. These two reviews alone cut the forgetting curve by more than half.','Review before sleep'],
             ['2','Space your reviews out','After the first review, wait longer each time: 1 day, then 3 days, then 1 week, then 2 weeks. Each interval should feel slightly uncomfortable — like you almost forgot. That difficulty is the signal that the review is working.','Increasing intervals'],
             ['3','Train daily, not in long sessions','A 5-minute daily MemGenius session beats a 35-minute weekly session every time. Your streak is not just a number — it is the engine of long-term memory consolidation.','Daily beats weekly'],
           ].map(([num, title, desc, tip]) => (
             <div key={num} style={{ display:'flex', gap:12, alignItems:'flex-start', background:'#252525', borderRadius:14, padding:'14px' }}>
               <div style={{ width:32, height:32, minWidth:32, background:'#6366f1', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff' }}>{num}</div>
               <div>
                 <div style={{ fontSize:14, fontWeight:900, color:'#fff', marginBottom:4 }}>{title}</div>
                 <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6, marginBottom:6 }}>{desc}</div>
                 <div style={{ fontSize:11, fontWeight:800, color:'#818cf8', background:'rgba(99,102,241,0.1)', padding:'3px 8px', borderRadius:6, display:'inline-block' }}>{tip}</div>
               </div>
             </div>
           ))}

         </div>

         <a href="/" style={{ textDecoration:'none', display:'block', marginTop:28 }}>
           <div style={{ background:'linear-gradient(135deg, #6366f1, #4338ca)', borderRadius:16, padding:'20px 16px', textAlign:'center' }}>
             <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:6 }}>Come Back Tomorrow.</div>
             <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.6, marginBottom:16 }}>You just learned about the forgetting curve. The best way to prove it works is to return tomorrow and train again.</div>
             <div style={{ background:'#C8960C', borderRadius:30, padding:'12px 24px', fontSize:15, fontWeight:900, color:'#fff', display:'inline-block' }}>Train Now</div>
           </div>
         </a>

         <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginTop:16, border:'1px solid rgba(255,255,255,0.06)' }}>
           <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Tomorrow's discovery</div>
           <div style={{ display:'flex', alignItems:'center', gap:12 }}>
             <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/3pm.png" alt="3pm brain peak" style={{ width:56, height:56, borderRadius:10, objectFit:'cover', opacity:0.35 }} />
             <div>
               <div style={{ fontSize:14, fontWeight:900, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Your Brain Peaks at 3pm. Here Is How to Use It.</div>
               <div style={{ fontSize:11, fontWeight:800, color:'#C8960C' }}>Come back tomorrow to unlock</div>
             </div>
           </div>
         </div>

       </div>
     </div>
   </main>
 )
}
