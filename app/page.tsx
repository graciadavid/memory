'use client'
const BROWN = '#4A2C0A'
const GREEN = '#2E7D32'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export default function HomePage() {
 return (
   <main style={{ height: '100dvh', background: '#0A0A0A', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 32 }}>

     {/* Logo */}
     <div style={{ textAlign: 'center' }}>
       <img src={`${BASE}/brain-logo.webp`} style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 16 }} />
       <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 8 }}>MemGenius</div>
       <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Train your brain daily.</div>
     </div>

     {/* Game banner */}
     <div style={{ width: '100%', background: 'linear-gradient(135deg, #4A148C, #7B1FA2)', borderRadius: 24, padding: '24px', textAlign: 'center', boxShadow: '0 10px 0 #4A148C60' }}>
       <img src={`${BASE}/precision.png`} style={{ width: 90, height: 90, objectFit: 'contain', marginBottom: 16 }} />
       <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Stop</div>
       <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginBottom: 24 }}>Stop the timer at exactly 5.000s</div>
       <a href="/stop" style={{ textDecoration: 'none', display: 'block' }}>
         <div style={{ background: GREEN, borderRadius: 18, padding: '18px', fontWeight: 900, fontSize: 20, color: '#fff', boxShadow: '0 8px 0 #1B5E2080' }}>
           Let's Go →
         </div>
       </a>
     </div>

     <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>Free · No login required</div>

   </main>
 )
}
