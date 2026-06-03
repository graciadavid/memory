export const metadata = {
  title: 'Cold Water Boosts Your Brain by 300% in 30 Seconds — MemGenius Discover',
  description: 'Science shows 30 seconds of cold water increases norepinephrine by 300%, sharpening focus and memory for hours. Here is exactly how to do it today.',
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
            src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/ducha.png"
            alt="MemGenius brain mascot under cold shower"
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg, #1A1A1A 0%, transparent 55%)' }} />
          <div style={{ position:'absolute', top:12, left:12, background:'#00b4d8', color:'#0b1d2e', fontSize:10, fontWeight:800, letterSpacing:2, textTransform:'uppercase', padding:'4px 10px', borderRadius:20 }}>💧 Focus</div>
          <div style={{ position:'absolute', top:12, right:12, background:'rgba(0,0,0,0.5)', color:'rgba(255,255,255,0.6)', fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:20 }}>01 / Discover</div>
        </div>

        <div style={{ padding:'0 16px' }}>

          <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:8, marginTop:4 }}>Brain Science · 4 min read</div>
          <h1 style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:12, lineHeight:1.15 }}>
            Cold Water Rewires Your Brain in 30 Seconds
          </h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:20, fontWeight:600 }}>
            Science shows a brief cold shower floods your brain with the same chemical that ADHD medication targets — and you already have a shower at home.
          </p>

          <div style={{ display:'flex', gap:8, marginBottom:24 }}>
            {[['300%','Focus boost'],['30s','Time needed'],['3h','Effect lasts']].map(([num, lbl]) => (
              <div key={lbl} style={{ flex:1, background:'#252525', borderRadius:12, padding:'12px 8px', textAlign:'center', border:'1px solid rgba(0,180,216,0.2)' }}>
                <div style={{ fontSize:18, fontWeight:900, color:'#00b4d8', lineHeight:1 }}>{num}</div>
                <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>{lbl}</div>
              </div>
            ))}
          </div>

          <div style={{ height:1, background:'rgba(255,255,255,0.07)', marginBottom:24 }} />

          <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.8, display:'flex', flexDirection:'column', gap:14 }}>

            <div style={{ fontSize:11, fontWeight:800, color:'#00b4d8', letterSpacing:2, textTransform:'uppercase' }}>The Science</div>
            <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>What Actually Happens to Your Brain</h2>

            <p>When cold water hits your skin, your nervous system fires an emergency signal upward. Your brain responds with a surge of <strong style={{color:'#fff'}}>norepinephrine</strong> — the neurotransmitter that controls attention, alertness, and memory encoding.</p>

            <div style={{ background:'#252525', borderRadius:14, padding:'16px', border:'1px solid rgba(0,180,216,0.2)' }}>
              <div style={{ fontSize:10, fontWeight:800, color:'#00b4d8', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>📄 Peer-reviewed study</div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.7, margin:0 }}>Cold water immersion increases norepinephrine by up to <strong style={{color:'#fff'}}>300%</strong> and dopamine by up to <strong style={{color:'#fff'}}>250%</strong> — both critical for focus and learning.</p>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:700, marginTop:8, fontStyle:'italic' }}>Srámek et al. — European Journal of Applied Physiology (2000)</div>
            </div>

            <p>This is the exact same neurochemical pathway targeted by common ADHD medications. Except this is free, has no side effects, and takes 30 seconds.</p>

            <div style={{ borderLeft:'3px solid #00b4d8', paddingLeft:14, background:'rgba(0,180,216,0.05)', borderRadius:'0 10px 10px 0', padding:'12px 14px' }}>
              <p style={{ fontSize:15, fontWeight:900, color:'#fff', lineHeight:1.3, margin:0 }}>"Cold exposure is one of the most powerful tools for shifting brain state available to humans."</p>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:8 }}>— Dr. Andrew Huberman, Stanford Neuroscience Lab</div>
            </div>

            <p>Cold water also triggers <strong style={{color:'#fff'}}>BDNF</strong> — a protein that builds new neural connections. More BDNF means learning sticks faster and memories consolidate better.</p>

            <div style={{ height:1, background:'rgba(255,255,255,0.07)' }} />

            <div style={{ fontSize:11, fontWeight:800, color:'#00b4d8', letterSpacing:2, textTransform:'uppercase' }}>Apply It Today</div>
            <h2 style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>The Exact Protocol. 3 Steps.</h2>

            {[
              ['1','Finish your shower warm','Wash normally. No need to suffer through the whole thing cold. The science works on brief exposure at the end.','⏱ 0 extra minutes'],
              ['2','Turn it cold. Breathe slowly.','Switch to the coldest setting. Slow nasal breathing deepens the neurological response — resist the urge to panic-breathe.','⏱ 30 seconds minimum'],
              ['3','Train your brain right after','The norepinephrine window lasts 2–3 hours. Use it for a MemGenius session and compound the benefit.','🧠 Peak brain state'],
            ].map(([num, title, desc, tip]) => (
              <div key={num} style={{ display:'flex', gap:12, alignItems:'flex-start', background:'#252525', borderRadius:14, padding:'14px' }}>
                <div style={{ width:32, height:32, minWidth:32, background:'#0077b6', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff' }}>{num}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:900, color:'#fff', marginBottom:4 }}>{title}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6, marginBottom:6 }}>{desc}</div>
                  <div style={{ fontSize:11, fontWeight:800, color:'#00b4d8', background:'rgba(0,180,216,0.1)', padding:'3px 8px', borderRadius:6, display:'inline-block' }}>{tip}</div>
                </div>
              </div>
            ))}

          </div>

          <a href="/" style={{ textDecoration:'none', display:'block', marginTop:28 }}>
            <div style={{ background:'linear-gradient(135deg, #0077b6, #005f8e)', borderRadius:16, padding:'20px 16px', textAlign:'center' }}>
              <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:6 }}>Your Brain is Ready.</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.6, marginBottom:16 }}>You just gave it a 300% boost. A 5-minute MemGenius session right now compounds the effect.</div>
              <div style={{ background:'#C8960C', borderRadius:30, padding:'12px 24px', fontSize:15, fontWeight:900, color:'#fff', display:'inline-block' }}>⚡ Train Now</div>
            </div>
          </a>

          {/* NEXT TEASER → ahora apunta a sleep */}
          <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginTop:16, border:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.25)', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>🔒 Tomorrow's discovery</div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ fontSize:32, opacity:0.3 }}>😴</div>
              <div>
                <div style={{ fontSize:14, fontWeight:900, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>The 90-Minute Sleep Cycle That Doubles Your Memory</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)', lineHeight:1.5, marginBottom:6 }}>It is not about how many hours you sleep. It is about when you wake up.</div>
                <div style={{ fontSize:11, fontWeight:800, color:'#C8960C' }}>Come back tomorrow to unlock →</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
