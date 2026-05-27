import Link from 'next/link'

export const metadata = {
 title: 'Brain Test — Discover Your Brain Score | MemGenius',
 description: 'Test your reaction time, memory, knowledge and logic. Play free brain games and discover your Brain Score with a world ranking. No login required.',
}

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const CATEGORIES = [
 { icon: `${BASE}/precision.png`, label: 'Agility', desc: 'Reaction time and precision', color: '#FF6F00' },
 { icon: `${BASE}/brain-logo.webp`, label: 'Memory', desc: 'Working memory and recall', color: '#C62828' },
 { icon: `${BASE}/flags.png`, label: 'Knowledge', desc: 'Geography and world culture', color: '#00796B' },
 { icon: `${BASE}/mastermind.png`, label: 'Logic', desc: 'Reasoning and strategy', color: '#6A1B9A' },
]

export default function BrainTestPage() {
 return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'40px 24px 100px', display:'flex', flexDirection:'column' }}>
     <div style={{ textAlign:'center', marginBottom:40 }}>
       <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:3, textTransform:'uppercase', marginBottom:12 }}>MemGenius</div>
       <div style={{ fontSize:36, fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:12 }}>Discover your<br />Brain Score</div>
       <div style={{ fontSize:15, color:'rgba(255,255,255,0.45)', fontWeight:700, lineHeight:1.6 }}>Play games across 4 cognitive categories. Your results generate a Brain Score and a world ranking saved to your profile.</div>
     </div>
     <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40 }}>
       {CATEGORIES.map(c => (
         <div key={c.label} style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, border:'1px solid rgba(255,255,255,0.08)' }}>
           <img src={c.icon} style={{ width:48, height:48, objectFit:'contain', flexShrink:0 }} />
           <div style={{ flex:1 }}>
             <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:2 }}>{c.label}</div>
             <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{c.desc}</div>
           </div>
           <div style={{ width:10, height:10, borderRadius:'50%', background:c.color, boxShadow:`0 0 8px ${c.color}` }} />
         </div>
       ))}
     </div>
     <div style={{ background:'rgba(200,150,12,0.1)', borderRadius:20, padding:'20px', marginBottom:32, border:'1px solid rgba(200,150,12,0.2)', textAlign:'center' }}>
       <div style={{ fontSize:13, fontWeight:800, color:'#C8960C', marginBottom:4 }}>Your Brain Score</div>
       <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700 }}>After playing games in each category your profile will show your Brain Score — a percentile ranking based on your performance against players worldwide.</div>
     </div>
     <Link href="/agility" style={{ textDecoration:'none', marginTop:'auto' }}>
       <div style={{ background:'#C8960C', borderRadius:20, padding:'20px', textAlign:'center', boxShadow:'0 8px 0 rgba(100,70,0,0.5)' }}>
         <div style={{ fontSize:20, fontWeight:900, color:'#000' }}>Start Testing →</div>
         <div style={{ fontSize:12, fontWeight:700, color:'rgba(0,0,0,0.5)', marginTop:4 }}>Free · No login required</div>
       </div>
     </Link>
   </main>
 )
}
