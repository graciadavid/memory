import Link from 'next/link'

export const metadata = {
 title: 'Discover — Brain Science That Changes Your Day | MemGenius',
 description: 'Science-backed facts about memory, focus and brain performance. One new discovery unlocks every day.',
}

const POSTS = [
 { slug: 'cold-water-brain-focus-memory', title: 'Cold Water Rewires Your Brain in 30 Seconds', image: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/ducha.png', locked: false },
 { slug: 'sleep-cycles-memory', title: 'The 90-Minute Sleep Cycle That Doubles Your Memory', image: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/sleep.png', locked: false },
 { slug: 'sugar-cognitive-decline-brain', title: 'What Sugar Does to Your Brain', image: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/sugar.png', locked: false },
 { slug: 'exercise-neurogenesis-brain', title: 'The Exercise That Creates New Neurons', image: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/exercise.png', locked: false },
 { slug: 'vitamin-d-sunlight-brain', title: 'Sunlight and Vitamin D: The Brain Nutrient Most People Are Missing', image: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/beach.png', locked: false },
 { slug: 'forgetting-curve-memory-hack', title: 'Why You Forget 70% of Everything', image: null, locked: true },
]

export default function DiscoverPage() {
 return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
     <div style={{ maxWidth:430, margin:'0 auto' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'#C8960C', letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>MemGenius</div>
       <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:4 }}>Discover</div>
       <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:24 }}>Brain science you can use today. One fact unlocks every day.</div>
       <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
         {POSTS.map((post) => (
           post.locked
             ? (
               <div key={post.slug} style={{ background:'#252525', borderRadius:16, padding:'12px', display:'flex', alignItems:'center', gap:14, opacity:0.4 }}>
                 <div style={{ width:72, height:72, minWidth:72, borderRadius:12, background:'#333', display:'flex', alignItems:'center', justifyContent:'center' }}>
                   <span style={{ fontSize:20, color:'rgba(255,255,255,0.2)', fontWeight:900 }}>?</span>
                 </div>
                 <div style={{ fontSize:14, fontWeight:900, color:'#fff', lineHeight:1.3 }}>{post.title}</div>
               </div>
             )
             : (
               <Link key={post.slug} href={`/discover/${post.slug}`} style={{ textDecoration:'none' }}>
                 <div style={{ background:'#252525', borderRadius:16, padding:'12px', display:'flex', alignItems:'center', gap:14, border:'1px solid rgba(200,150,12,0.25)' }}>
                   <img
                     src={post.image!}
                     alt={post.title}
                     style={{ width:72, height:72, minWidth:72, borderRadius:12, objectFit:'cover', display:'block' }}
                   />
                   <div style={{ fontSize:14, fontWeight:900, color:'#fff', lineHeight:1.3 }}>{post.title}</div>
                 </div>
               </Link>
             )
         ))}
       </div>
     </div>
   </main>
 )
}
