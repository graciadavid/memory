export const metadata = {
 title: 'Sunlight and Vitamin D: The Brain Nutrient Most People Are Missing — MemGenius Discover',
 description: 'Vitamin D deficiency affects 1 billion people and directly impairs memory, mood and cognitive speed. 20 minutes of sun changes everything.',
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
           src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/beach.png"
           alt="MemGenius brain mascot in the sun on the beach"
           style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
         />
         <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg, #1A1A1A 0%, transparent 55%)' }} />
         <div style={{ position:'absolute', top:12, left:12, background:'#f59e0b', color:'#1a1a1a', fontSize:10, fontWeight:800, letterSpacing:2, textTransform:'uppercase', padding:'4px 10px', borderRadius:20 }}>Sunlight</div>
       </div>

       <div style={{ padding:'0 16px' }}>

         <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:8, marginTop:4 }}>Brain Science · 4 min read</div>
         <h1 style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:12, lineHeight:1.15 }}>
           Sunlight and Vitamin D: The Brain Nutrient Most People Are Missing
         </h1>
         <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:20, fontWeight:600 }}>
           One billion people are deficient in Vitamin D. It is not just a bone problem — low Vitamin D directly impairs memory, slows cognitive processing, and accelerates brain aging.
         </p>

         <div style={{ display:'flex', gap:8, marginBottom:24 }}>
           {[['1B','People deficient'],['20min','Daily sun dose'],['42%','Dementia risk up']].map(([num, lbl]) => (
             <div key={lbl} style={{ flex:1, background:'#252525', borderRadius:12, padding:'12px 8px', textAlign:'center', border:'1px solid rgba(245,158,11,0.25)' }}>
               <div style={{ fontSize:18, fontWeight:900, color:'#fbbf24', lineHeight:1 }}>{num}</div>
               <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>{lbl}</div>
             </div>
           ))}
         </div>

         <div style={{ height:1, background:'rgba(255,255,255,0.07)', marginBottom:24 }} />

         <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.8, display:'flex', flexDirection:'column', gap:14 }}>

           <div style={{ fontSize:11, fontWeight:800, color:'#fbbf24', letterSpacing:2, textTransform:'uppercase' }}>The Science</div>
           <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>Vitamin D Is a Brain Hormone, Not Just a Vitamin</h2>

           <p>Vitamin D receptors are found throughout the brain — in the hippocampus, the prefrontal cortex, and the cerebellum. This is not coincidental. Vitamin D regulates the genes responsible for neuron survival, synaptic plasticity, and the production of serotonin and dopamine. Without enough of it, your brain runs on reduced power.</p>

           <div style={{ background:'#252525', borderRadius:14, padding:'16px', border:'1px solid rgba(245,158,11,0.2)' }}>
             <div style={{ fontSize:10, fontWeight:800, color:'#fbbf24', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Peer-reviewed study</div>
             <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.7, margin:0 }}>A large study published in the journal Neurology followed 1,600 adults over 6 years and found that those with Vitamin D deficiency were <strong style={{color:'#fff'}}>42% more likely to develop cognitive impairment</strong>. Severely deficient participants showed processing speeds and memory scores equivalent to people 5 years older.</p>
             <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:700, marginTop:8, fontStyle:'italic' }}>Llewellyn et al. — Neurology (2010)</div>
           </div>

           <p>The fastest and most natural way to restore Vitamin D is direct sunlight on skin. When UVB rays hit your skin, your body synthesizes Vitamin D in minutes. No supplement replicates the full cascade of photochemical effects that natural sunlight triggers — including the regulation of <strong style={{color:'#fff'}}>cortisol</strong> and <strong style={{color:'#fff'}}>melatonin</strong>, which directly affect memory consolidation during sleep.</p>

           <div style={{ borderLeft:'3px solid #fbbf24', padding:'12px 14px', background:'rgba(245,158,11,0.05)', borderRadius:'0 10px 10px 0' }}>
             <p style={{ fontSize:15, fontWeight:900, color:'#fff', lineHeight:1.3, margin:0 }}>"Vitamin D deficiency is the most common nutritional deficiency in the developed world — and one of the most correctable causes of cognitive decline."</p>
             <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:8 }}>— Dr. Michael Holick, Boston University School of Medicine</div>
           </div>

           <p>Morning sunlight has an additional effect beyond Vitamin D. Light exposure in the first hour after waking sets your <strong style={{color:'#fff'}}>circadian rhythm</strong> — the internal clock that governs when your brain is alert, when it consolidates memory, and when it releases the hormones needed for deep sleep. Getting outside in the morning is one of the highest-leverage habits for cognitive performance.</p>

           <div style={{ height:1, background:'rgba(255,255,255,0.07)' }} />

           <div style={{ fontSize:11, fontWeight:800, color:'#fbbf24', letterSpacing:2, textTransform:'uppercase' }}>Apply It Today</div>
           <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>The Exact Protocol. 3 Steps.</h2>

           {[
             ['1','Get outside within 1 hour of waking','No sunglasses for the first few minutes. Your retinas need direct light input to set the circadian clock. Even on a cloudy day, outdoor light is 10 to 50 times brighter than indoor lighting and sufficient to trigger the full biological response.','First hour of the day'],
             ['2','20 minutes of skin exposure at midday','Arms and face exposed between 10am and 2pm. This is when UVB rays are strong enough to trigger Vitamin D synthesis. In winter or at high latitudes, supplement with 1000-2000 IU of Vitamin D3 daily.','20 min midday sun'],
             ['3','Train your brain after your sun session','Sunlight boosts serotonin, which converts to dopamine — the neurotransmitter of motivation and learning. A MemGenius session in the hour after sun exposure takes advantage of elevated dopamine levels for faster skill acquisition.','Sunlight then train'],
           ].map(([num, title, desc, tip]) => (
             <div key={num} style={{ display:'flex', gap:12, alignItems:'flex-start', background:'#252525', borderRadius:14, padding:'14px' }}>
               <div style={{ width:32, height:32, minWidth:32, background:'#d97706', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff' }}>{num}</div>
               <div>
                 <div style={{ fontSize:14, fontWeight:900, color:'#fff', marginBottom:4 }}>{title}</div>
                 <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6, marginBottom:6 }}>{desc}</div>
                 <div style={{ fontSize:11, fontWeight:800, color:'#fbbf24', background:'rgba(245,158,11,0.1)', padding:'3px 8px', borderRadius:6, display:'inline-block' }}>{tip}</div>
               </div>
             </div>
           ))}

         </div>

         <a href="/" style={{ textDecoration:'none', display:'block', marginTop:28 }}>
           <div style={{ background:'linear-gradient(135deg, #d97706, #92400e)', borderRadius:16, padding:'20px 16px', textAlign:'center' }}>
             <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:6 }}>Go Outside. Then Train.</div>
             <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.6, marginBottom:16 }}>Sunlight primes your brain. MemGenius uses that prime. Do both and you compound the benefit of each.</div>
             <div style={{ background:'#C8960C', borderRadius:30, padding:'12px 24px', fontSize:15, fontWeight:900, color:'#fff', display:'inline-block' }}>Train Now</div>
           </div>
         </a>

         <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginTop:16, border:'1px solid rgba(255,255,255,0.06)' }}>
           <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Tomorrow's discovery</div>
           <div style={{ display:'flex', alignItems:'center', gap:12 }}>
             <div style={{ width:56, height:56, minWidth:56, borderRadius:10, background:'#333', opacity:0.35 }} />
             <div>
               <div style={{ fontSize:14, fontWeight:900, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Why You Forget 70% of Everything</div>
               <div style={{ fontSize:11, fontWeight:800, color:'#C8960C' }}>Come back tomorrow to unlock</div>
             </div>
           </div>
         </div>

       </div>
     </div>
   </main>
 )
}
