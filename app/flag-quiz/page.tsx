import { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export const metadata: Metadata = {
 title: 'Flag Quiz — Free Online World Flags Test | MemGenius',
 description: 'Test your knowledge of world flags for free. Guess the country from its flag. World rankings. No login required.',
 keywords: ['flag quiz', 'world flags quiz', 'flag test', 'country flag quiz', 'guess the flag'],
}

export default function FlagQuizPage() {
 return (
   <main style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 100px', fontFamily: 'var(--font-nunito), sans-serif', background: '#fff', minHeight: '100dvh' }}>

     <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>Flag Quiz</h1>
     <p style={{ fontSize: 16, lineHeight: 1.8, color: '#555', marginBottom: 32 }}>A flag appears. You tap the right country. Sounds simple. Most people fail before reaching 10 in a row. There are 195 countries in the world and a surprising number of flags that look almost identical. How far can you go?</p>

     <div style={{ marginBottom: 48 }}>
       <Link href="/flags" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '24px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 16 }}>
         <img src={`${BASE}/flags.png`} style={{ width: 64, height: 64, objectFit: 'contain', flexShrink: 0 }} />
         <div>
           <div style={{ fontSize: 20, fontWeight: 900, color: '#1C1C1E', marginBottom: 6 }}>Flags — World Flag Quiz</div>
           <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>A flag appears with 4 country options. Tap the right one before time runs out. Each correct answer brings a harder flag. The world record is over 80 in a row. Where will you stop?</div>
           <div style={{ marginTop: 12, fontSize: 14, fontWeight: 900, color: '#2E7D32' }}>Play free →</div>
         </div>
       </Link>
     </div>

     <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>Why are flags hard to remember?</h2>
     <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 16 }}>Many flags share the same colors and similar designs. The tricolor pattern used by France, Italy, Ireland, Romania and many others forces your brain to encode subtle differences rather than obvious ones. That is exactly the kind of detail that slips through working memory.</p>
     <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 32 }}>The flags that trip people up most are those of Chad and Romania (almost identical), New Zealand and Australia (easily confused), and the many green, yellow and red combinations across African nations.</p>

     <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>Also try these knowledge games</h2>
     <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
       <Link href="/capitals" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 14, padding: '16px 20px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 14 }}>
         <img src={`${BASE}/capitals.png`} style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }} />
         <div>
           <div style={{ fontSize: 16, fontWeight: 900, color: '#1C1C1E' }}>Capitals Quiz</div>
           <div style={{ fontSize: 13, color: '#666' }}>What is the capital of this country? 195 countries. Some will surprise you.</div>
         </div>
       </Link>
       <Link href="/countries" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 14, padding: '16px 20px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 14 }}>
         <img src={`${BASE}/countries.png`} style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }} />
         <div>
           <div style={{ fontSize: 16, fontWeight: 900, color: '#1C1C1E' }}>Countries by Shape</div>
           <div style={{ fontSize: 13, color: '#666' }}>Identify a country from its silhouette. Harder than it sounds.</div>
         </div>
       </Link>
     </div>

     <div style={{ background: '#1C1C1E', borderRadius: 20, padding: '28px 24px', textAlign: 'center' }}>
       <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>How many flags do you know?</div>
       <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Free. No login. World rankings.</div>
       <Link href="/flags" style={{ textDecoration: 'none', display: 'inline-block', background: '#2E7D32', borderRadius: 14, padding: '14px 32px', fontSize: 16, fontWeight: 900, color: '#fff' }}>
         Start the quiz →
       </Link>
     </div>

   </main>
 )
}
