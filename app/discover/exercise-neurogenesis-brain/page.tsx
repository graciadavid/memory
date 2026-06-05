export const metadata = {
 title: 'The Exercise That Creates New Neurons — MemGenius Discover',
 description: 'Scientists discovered one specific type of movement grows brand new brain cells at any age. It is not what most people think.',
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
           src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/exercise.png"
           alt="MemGenius brain mascot exercising"
           style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
         />
         <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg, #1A1A1A 0%, transparent 55%)' }} />
         <div style={{ position:'absolute', top:12, left:12, background:'#16a34a', color:'#fff', fontSize:10, fontWeight:800, letterSpacing:2, textTransform:'uppercase', padding:'4px 10px', borderRadius:20 }}>Movement</div>
       </div>

       <div style={{ padding:'0 16px' }}>

         <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:8, marginTop:4 }}>Brain Science · 4 min read</div>
         <h1 style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:12, lineHeight:1.15 }}>
           The Exercise That Creates New Neurons
         </h1>
         <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:20, fontWeight:600 }}>
           For decades scientists believed the adult brain could not grow new cells. They were wrong. One specific type of movement triggers neurogenesis — and you can do it today.
         </p>

         <div style={{ display:'flex', gap:8, marginBottom:24 }}>
           {[['20min','Minimum dose'],['2x','Hippocampus growth'],['BDNF','The trigger']].map(([num, lbl]) => (
             <div key={lbl} style={{ flex:1, background:'#252525', borderRadius:12, padding:'12px 8px', textAlign:'center', border:'1px solid rgba(22,163,74,0.25)' }}>
               <div style={{ fontSize:18, fontWeight:900, color:'#4ade80', lineHeight:1 }}>{num}</div>
               <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>{lbl}</div>
             </div>
           ))}
         </div>

         <div style={{ height:1, background:'rgba(255,255,255,0.07)', marginBottom:24 }} />

         <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.8, display:'flex', flexDirection:'column', gap:14 }}>

           <div style={{ fontSize:11, fontWeight:800, color:'#4ade80', letterSpacing:2, textTransform:'uppercase' }}>The Science</div>
           <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>Your Brain Can Grow New Cells. Here Is How.</h2>

           <p>Neurogenesis — the birth of new neurons — was once thought impossible in adults. The discovery that it happens in the human hippocampus was one of the most important findings in modern neuroscience. And the most reliable trigger is not a drug, not a supplement. It is aerobic exercise.</p>

           <div style={{ background:'#252525', borderRadius:14, padding:'16px', border:'1px solid rgba(22,163,74,0.2)' }}>
             <div style={{ fontSize:10, fontWeight:800, color:'#4ade80', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Peer-reviewed study</div>
             <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.7, margin:0 }}>A landmark study at the University of British Columbia found that regular aerobic exercise increases the size of the hippocampus by <strong style={{color:'#fff'}}>2%</strong> — effectively reversing age-related shrinkage by 1 to 2 years. Participants who did resistance training or stretching showed no such effect.</p>
             <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:700, marginTop:8, fontStyle:'italic' }}>Erickson et al. — PNAS (2011)</div>
           </div>

           <p>The mechanism is <strong style={{color:'#fff'}}>BDNF</strong> — Brain-Derived Neurotrophic Factor. Aerobic exercise floods the brain with it. BDNF acts like fertilizer for neurons: it triggers the growth of new cells, strengthens existing connections, and makes learning dramatically faster in the hours after exercise.</p>

           <div style={{ borderLeft:'3px solid #4ade80', padding:'12px 14px', background:'rgba(22,163,74,0.05)', borderRadius:'0 10px 10px 0' }}>
             <p style={{ fontSize:15, fontWeight:900, color:'#fff', lineHeight:1.3, margin:0 }}>"Aerobic exercise is the single most powerful tool we have to optimize brain function. It is simply not debatable."</p>
             <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:8 }}>— Dr. John Ratey, Harvard Medical School</div>
           </div>

           <p>The key word is <strong style={{color:'#fff'}}>aerobic</strong>. Running, cycling, swimming, brisk walking — anything that raises your heart rate to 60-70% of its maximum for at least 20 minutes. Weightlifting and yoga have many benefits, but neurogenesis is not among them. The heart rate elevation is what triggers the BDNF cascade.</p>

           <div style={{ height:1, background:'rgba(255,255,255,0.07)' }} />

           <div style={{ fontSize:11, fontWeight:800, color:'#4ade80', letterSpacing:2, textTransform:'uppercase' }}>Apply It Today</div>
           <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>The Exact Protocol. 3 Steps.</h2>

           {[
             ['1','20 minutes at a conversational pace','You should be able to talk but not sing. That is the aerobic zone. A brisk 20-minute walk counts. You do not need a gym or special equipment — just sustained movement that elevates your heart rate.','20 min minimum'],
             ['2','Train your brain within 2 hours after','BDNF levels peak in the 2 hours following aerobic exercise. This is your neuroplasticity window — the time when your brain is most capable of forming new connections. A MemGenius session immediately after exercise compounds both effects.','Peak learning window'],
             ['3','Do it 3 times per week minimum','Neurogenesis is cumulative. A single session starts the process but consistency is what builds lasting change. Three sessions per week is the minimum dose shown to produce measurable hippocampal growth within 3 months.','3x per week'],
           ].map(([num, title, desc, tip]) => (
             <div key={num} style={{ display:'flex', gap:12, alignItems:'flex-start', background:'#252525', borderRadius:14, padding:'14px' }}>
               <div style={{ width:32, height:32, minWidth:32, background:'#16a34a', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff' }}>{num}</div>
               <div>
                 <div style={{ fontSize:14, fontWeight:900, color:'#fff', marginBottom:4 }}>{title}</div>
                 <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6, marginBottom:6 }}>{desc}</div>
                 <div style={{ fontSize:11, fontWeight:800, color:'#4ade80', background:'rgba(22,163,74,0.1)', padding:'3px 8px', borderRadius:6, display:'inline-block' }}>{tip}</div>
               </div>
             </div>
           ))}

         </div>

         <a href="/" style={{ textDecoration:'none', display:'block', marginTop:28 }}>
           <div style={{ background:'linear-gradient(135deg, #16a34a, #14532d)', borderRadius:16, padding:'20px 16px', textAlign:'center' }}>
             <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:6 }}>Your Neurons Are Ready.</div>
             <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.6, marginBottom:16 }}>Exercise opened the window. A MemGenius session right now plants the seeds in freshly fertilized brain tissue.</div>
             <div style={{ background:'#C8960C', borderRadius:30, padding:'12px 24px', fontSize:15, fontWeight:900, color:'#fff', display:'inline-block' }}>Train Now</div>
           </div>
         </a>

         <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginTop:16, border:'1px solid rgba(255,255,255,0.06)' }}>
           <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Tomorrow's discovery</div>
           <div style={{ display:'flex', alignItems:'center', gap:12 }}>
             <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/beach.png" alt="Sunlight" style={{ width:56, height:56, borderRadius:10, objectFit:'cover', opacity:0.35 }} />
             <div>
               <div style={{ fontSize:14, fontWeight:900, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Sunlight and Vitamin D: The Brain Nutrient Most People Are Missing</div>
               <div style={{ fontSize:11, fontWeight:800, color:'#C8960C' }}>Come back tomorrow to unlock</div>
             </div>
           </div>
         </div>

       </div>
     </div>
   </main>
 )
}
