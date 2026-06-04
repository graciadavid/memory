export const metadata = {
 title: 'The 90-Minute Sleep Cycle That Doubles Your Memory — MemGenius Discover',
 description: 'Why 6 hours of well-timed sleep beats 8 hours of poor sleep for memory. The exact formula to wake up sharp every morning.',
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
           src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/sleep.png"
           alt="MemGenius brain mascot sleeping"
           style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
         />
         <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg, #1A1A1A 0%, transparent 55%)' }} />
         <div style={{ position:'absolute', top:12, left:12, background:'#7c3aed', color:'#fff', fontSize:10, fontWeight:800, letterSpacing:2, textTransform:'uppercase', padding:'4px 10px', borderRadius:20 }}>Sleep</div>
       </div>

       <div style={{ padding:'0 16px' }}>

         <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:8, marginTop:4 }}>Sleep Science · 4 min read</div>
         <h1 style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:12, lineHeight:1.15 }}>
           The 90-Minute Sleep Cycle That Doubles Your Memory
         </h1>
         <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:20, fontWeight:600 }}>
           It is not about how many hours you sleep. It is about when you wake up. Get this right and your brain consolidates twice as much of what you learned.
         </p>

         <div style={{ display:'flex', gap:8, marginBottom:24 }}>
           {[['90min','Sleep cycle'],['2x','Memory boost'],['REM','The key stage']].map(([num, lbl]) => (
             <div key={lbl} style={{ flex:1, background:'#252525', borderRadius:12, padding:'12px 8px', textAlign:'center', border:'1px solid rgba(124,58,237,0.25)' }}>
               <div style={{ fontSize:18, fontWeight:900, color:'#a78bfa', lineHeight:1 }}>{num}</div>
               <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>{lbl}</div>
             </div>
           ))}
         </div>

         <div style={{ height:1, background:'rgba(255,255,255,0.07)', marginBottom:24 }} />

         <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.8, display:'flex', flexDirection:'column', gap:14 }}>

           <div style={{ fontSize:11, fontWeight:800, color:'#a78bfa', letterSpacing:2, textTransform:'uppercase' }}>The Science</div>
           <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>What Happens to Your Brain While You Sleep</h2>

           <p>Every night your brain runs a filing system. Everything you experienced, learned or practiced during the day gets processed, compressed and stored in long-term memory. But this only happens during specific stages of sleep — and if you interrupt the cycle at the wrong moment, the filing gets lost.</p>

           <div style={{ background:'#252525', borderRadius:14, padding:'16px', border:'1px solid rgba(124,58,237,0.25)' }}>
             <div style={{ fontSize:10, fontWeight:800, color:'#a78bfa', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Peer-reviewed study</div>
             <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.7, margin:0 }}>Harvard Medical School researchers found that people who got a full night of sleep after learning a task performed <strong style={{color:'#fff'}}>20-40% better</strong> on tests the next day. REM sleep — which dominates the final cycles of the night — was the critical factor.</p>
             <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:700, marginTop:8, fontStyle:'italic' }}>Stickgold R. — Nature Reviews Neuroscience (2005)</div>
           </div>

           <p>Your sleep runs in <strong style={{color:'#fff'}}>90-minute cycles</strong>. Each cycle ends with a REM phase where your hippocampus replays the day and transfers memories to the cortex for long-term storage. Wake up mid-cycle and you cut that transfer short.</p>

           <div style={{ borderLeft:'3px solid #a78bfa', padding:'12px 14px', background:'rgba(124,58,237,0.05)', borderRadius:'0 10px 10px 0' }}>
             <p style={{ fontSize:15, fontWeight:900, color:'#fff', lineHeight:1.3, margin:0 }}>"Sleep is not the absence of wakefulness. It is an active, highly structured process that the brain uses to consolidate everything you have learned."</p>
             <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:8 }}>— Matthew Walker, Why We Sleep (2017)</div>
           </div>

           <p>Six cycles equals <strong style={{color:'#fff'}}>9 hours</strong>. But even <strong style={{color:'#fff'}}>5 cycles (7h 30min)</strong> — waking at the end of a cycle — beats 8 hours cut short mid-cycle. The endpoint matters more than the total.</p>

           <div style={{ height:1, background:'rgba(255,255,255,0.07)' }} />

           <div style={{ fontSize:11, fontWeight:800, color:'#a78bfa', letterSpacing:2, textTransform:'uppercase' }}>Apply It Tonight</div>
           <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>The Exact Formula. 3 Steps.</h2>

           {[
             ['1','Decide your wake-up time','Fix it first. Everything works backwards from here. Consistency matters more than the hour.','Pick one time, keep it'],
             ['2','Count back in 90-minute blocks','For a 7am wake-up: 7:00 → 5:30 → 4:00 → 2:30 → 1:00 → 11:30pm. That last one is your ideal bedtime for 5 full cycles.','5 cycles = 7h 30min'],
             ['3','Train before you sleep','Anything you practice in the 2 hours before sleep gets priority processing during REM. A MemGenius session before bed means your brain rehearses those patterns overnight.','Learn → Sleep → Lock in'],
           ].map(([num, title, desc, tip]) => (
             <div key={num} style={{ display:'flex', gap:12, alignItems:'flex-start', background:'#252525', borderRadius:14, padding:'14px' }}>
               <div style={{ width:32, height:32, minWidth:32, background:'#7c3aed', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff' }}>{num}</div>
               <div>
                 <div style={{ fontSize:14, fontWeight:900, color:'#fff', marginBottom:4 }}>{title}</div>
                 <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6, marginBottom:6 }}>{desc}</div>
                 <div style={{ fontSize:11, fontWeight:800, color:'#a78bfa', background:'rgba(124,58,237,0.1)', padding:'3px 8px', borderRadius:6, display:'inline-block' }}>{tip}</div>
               </div>
             </div>
           ))}

         </div>

         <a href="/" style={{ textDecoration:'none', display:'block', marginTop:28 }}>
           <div style={{ background:'linear-gradient(135deg, #7c3aed, #5b21b6)', borderRadius:16, padding:'20px 16px', textAlign:'center' }}>
             <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:6 }}>Train Before You Sleep.</div>
             <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.6, marginBottom:16 }}>What you practice tonight gets consolidated overnight. A 5-minute session now is worth double tomorrow.</div>
             <div style={{ background:'#C8960C', borderRadius:30, padding:'12px 24px', fontSize:15, fontWeight:900, color:'#fff', display:'inline-block' }}>Train Now</div>
           </div>
         </a>

         <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginTop:16, border:'1px solid rgba(255,255,255,0.06)' }}>
           <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Tomorrow's discovery</div>
           <div style={{ display:'flex', alignItems:'center', gap:12 }}>
             <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/sugar.png" alt="Sugar" style={{ width:56, height:56, borderRadius:10, objectFit:'cover', opacity:0.35 }} />
             <div>
               <div style={{ fontSize:14, fontWeight:900, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>What Sugar Does to Your Brain</div>
               <div style={{ fontSize:11, fontWeight:800, color:'#C8960C' }}>Come back tomorrow to unlock</div>
             </div>
           </div>
         </div>

       </div>
     </div>
   </main>
 )
}
