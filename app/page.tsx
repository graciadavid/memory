'use client'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'

export default function HomePage() {
 return (
   <main style={{
     height: '100dvh',
     background: '#0A0A0A',
     fontFamily: 'var(--font-nunito), sans-serif',
     maxWidth: 430,
     margin: '0 auto',
     display: 'flex',
     flexDirection: 'column',
     alignItems: 'center',
     justifyContent: 'center',
     padding: '0 32px',
     gap: 40,
   }}>
     {/* Logo */}
     <div style={{ textAlign: 'center' }}>
       <img src={`${BASE}/brain-logo.webp`} style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 20 }} />
       <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 10 }}>MemGenius</div>
       <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>Train your brain daily.</div>
       <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>Compete with the world.</div>
     </div>

     {/* Game banner */}
     <div style={{ width: '100%', background: 'linear-gradient(135deg, #4A148C, #7B1FA2)', borderRadius: 28, padding: '28px', textAlign: 'center', boxShadow: '0 12px 0 #4A148C50' }}>
       <img src={`${BASE}/precision.png`} style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 14 }} />
       <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Stop</div>
       <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginBottom: 24 }}>Stop the timer at exactly 5.000s</div>
       <a href="/stop" style={{ textDecoration: 'none', display: 'block' }}>
         <div style={{ background: GREEN, borderRadius: 18, padding: '18px', fontWeight: 900, fontSize: 20, color: '#fff', boxShadow: '0 8px 0 #1B5E2070' }}>
           Let's Go →
         </div>
       </a>
     </div>

     <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', fontWeight: 700 }}>Free · No login required</div>
   </main>
 )
}
