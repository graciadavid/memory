'use client'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'

// Today's game — change daily
const TODAY = { href: '/stop', label: 'Stop' }

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
     gap: 48,
   }}>
     <div style={{ textAlign: 'center' }}>
       <img src={`${BASE}/brain-logo.webp`} style={{ width: 90, height: 90, objectFit: 'contain', marginBottom: 24 }} />
       <div style={{ fontSize: 42, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 12 }}>MemGenius</div>
       <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontWeight: 700, lineHeight: 1.6 }}>Your daily brain gym.</div>
     </div>

     <a href={TODAY.href} style={{ textDecoration: 'none', width: '100%' }}>
       <div style={{ background: GREEN, borderRadius: 24, padding: '22px', textAlign: 'center', boxShadow: '0 10px 0 #1B5E2070' }}>
         <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Today's game</div>
         <div style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>Play of the Day →</div>
       </div>
     </a>

     <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', fontWeight: 700 }}>Free · No login required</div>
   </main>
 )
}
