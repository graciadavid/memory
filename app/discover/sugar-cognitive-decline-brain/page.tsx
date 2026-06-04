export const metadata = {
 title: 'What Sugar Does to Your Brain — MemGenius Discover',
 description: 'Sugar does not just affect your body. It shrinks the hippocampus, impairs memory formation, and accelerates cognitive decline. Here is the science.',
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
           src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/sugar.png"
           alt="MemGenius brain mascot and sugar"
           style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
         />
         <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg, #1A1A1A 0%, transparent 55%)' }} />
         <div style={{ position:'absolute', top:12, left:12, background:'#ef4444', color:'#fff', fontSize:10, fontWeight:800, letterSpacing:2, textTransform:'uppercase', padding:'4px 10px', borderRadius:20 }}>Nutrition</div>
       </div>

       <div style={{ padding:'0 16px' }}>

         <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:8, marginTop:4 }}>Brain Science · 4 min read</div>
         <h1 style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:12, lineHeight:1.15 }}>
           What Sugar Does to Your Brain
         </h1>
         <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:20, fontWeight:600 }}>
           Sugar does not just affect your waistline. It actively shrinks the part of your brain responsible for memory and learning — and the damage starts faster than most people think.
         </p>

         <div style={{ display:'flex', gap:8, marginBottom:24 }}>
           {[['#1','Memory killer'],['11%','Hippocampus loss'],['6wks','To show damage']].map(([num, lbl]) => (
             <div key={lbl} style={{ flex:1, background:'#252525', borderRadius:12, padding:'12px 8px', textAlign:'center', border:'1px solid rgba(239,68,68,0.25)' }}>
               <div style={{ fontSize:18, fontWeight:900, color:'#f87171', lineHeight:1 }}>{num}</div>
               <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>{lbl}</div>
             </div>
           ))}
         </div>

         <div style={{ height:1, background:'rgba(255,255,255,0.07)', marginBottom:24 }} />

         <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.8, display:'flex', flexDirection:'column', gap:14 }}>

           <div style={{ fontSize:11, fontWeight:800, color:'#f87171', letterSpacing:2, textTransform:'uppercase' }}>The Science</div>
           <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>Sugar Shrinks Your Memory Center</h2>

           <p>Your hippocampus is the part of the brain that forms new memories and retrieves old ones. It is also the region most sensitive to diet. High sugar intake — even over a short period — reduces its volume, its connectivity, and its ability to encode new information.</p>

           <div style={{ background:'#252525', borderRadius:14, padding:'16px', border:'1px solid rgba(239,68,68,0.2)' }}>
             <div style={{ fontSize:10, fontWeight:800, color:'#f87171', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Peer-reviewed study</div>
             <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.7, margin:0 }}>A study from the University of New South Wales found that rats on a high-sugar diet for 6 weeks showed <strong style={{color:'#fff'}}>significant hippocampal inflammation</strong> and performed measurably worse on spatial memory tasks — even though their total calorie intake was the same as the control group.</p>
             <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:700, marginTop:8, fontStyle:'italic' }}>Beilharz et al. — Behavioral Brain Research (2016)</div>
           </div>

           <p>The mechanism is <strong style={{color:'#fff'}}>BDNF suppression</strong>. Sugar reduces levels of Brain-Derived Neurotrophic Factor — the same protein that cold water and exercise increase. Less BDNF means fewer new neural connections, slower learning, and weaker memory consolidation.</p>

           <div style={{ borderLeft:'3px solid #f87171', padding:'12px 14px', background:'rgba(239,68,68,0.05)', borderRadius:'0 10px 10px 0' }}>
             <p style={{ fontSize:15, fontWeight:900, color:'#fff', lineHeight:1.3, margin:0 }}>"A high-sugar diet impairs cognitive function independently of obesity. The brain damage comes first — the weight gain is secondary."</p>
             <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:8 }}>— Dr. Fernando Gomez-Pinilla, UCLA Neuroscience</div>
           </div>

           <p>Fructose — the sugar in soft drinks, fruit juice and most processed foods — is particularly damaging. It disrupts insulin signaling in the brain, which the hippocampus depends on to form long-term memories. Regular consumption creates a state of <strong style={{color:'#fff'}}>brain insulin resistance</strong> that mirrors early-stage Alzheimer's pathology.</p>

           <div style={{ height:1, background:'rgba(255,255,255,0.07)' }} />

           <div style={{ fontSize:11, fontWeight:800, color:'#f87171', letterSpacing:2, textTransform:'uppercase' }}>Apply It Today</div>
           <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>3 Swaps That Protect Your Brain</h2>

           {[
             ['1','Cut liquid sugar first','Soft drinks and fruit juice are the highest-impact source. Replacing one can of soda per day with water reduces daily fructose load by around 25g — enough to measurably change brain inflammation markers within two weeks.','Start here'],
             ['2','Eat before you train your brain','Blood sugar spikes impair working memory for up to 2 hours after a high-sugar meal. Schedule cognitive work — including MemGenius sessions — before meals or after protein-and-fat-based ones, not after carb-heavy food.','Time your sessions'],
             ['3','Replace with slow carbs','Oats, sweet potato, and legumes release glucose slowly, providing steady brain fuel without the insulin spike. Your hippocampus gets the energy it needs without the inflammatory hit.','Stable fuel, stable memory'],
           ].map(([num, title, desc, tip]) => (
             <div key={num} style={{ display:'flex', gap:12, alignItems:'flex-start', background:'#252525', borderRadius:14, padding:'14px' }}>
               <div style={{ width:32, height:32, minWidth:32, background:'#dc2626', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff' }}>{num}</div>
               <div>
                 <div style={{ fontSize:14, fontWeight:900, color:'#fff', marginBottom:4 }}>{title}</div>
                 <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6, marginBottom:6 }}>{desc}</div>
                 <div style={{ fontSize:11, fontWeight:800, color:'#f87171', background:'rgba(239,68,68,0.1)', padding:'3px 8px', borderRadius:6, display:'inline-block' }}>{tip}</div>
               </div>
             </div>
           ))}

         </div>

         <a href="/" style={{ textDecoration:'none', display:'block', marginTop:28 }}>
           <div style={{ background:'linear-gradient(135deg, #dc2626, #991b1b)', borderRadius:16, padding:'20px 16px', textAlign:'center' }}>
             <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:6 }}>Train Your Brain Now.</div>
             <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.6, marginBottom:16 }}>Every MemGenius session builds the neural connections that sugar tries to break down. Start before your next meal.</div>
             <div style={{ background:'#C8960C', borderRadius:30, padding:'12px 24px', fontSize:15, fontWeight:900, color:'#fff', display:'inline-block' }}>Train Now</div>
           </div>
         </a>

         <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginTop:16, border:'1px solid rgba(255,255,255,0.06)' }}>
           <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Tomorrow's discovery</div>
           <div style={{ display:'flex', alignItems:'center', gap:12 }}>
             <div style={{ width:56, height:56, minWidth:56, borderRadius:10, background:'#333', opacity:0.35 }} />
             <div>
               <div style={{ fontSize:14, fontWeight:900, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>The Exercise That Creates New Neurons</div>
               <div style={{ fontSize:11, fontWeight:800, color:'#C8960C' }}>Come back tomorrow to unlock</div>
             </div>
           </div>
         </div>

       </div>
     </div>
   </main>
 )
}
