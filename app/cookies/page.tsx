export default function CookiesPage() {
 return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
     <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:20 }}>Cookie Policy</div>
     <div style={{ background:'#252525', borderRadius:16, padding:'20px', display:'flex', flexDirection:'column', gap:16 }}>
       <div>
         <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>Essential Cookies</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>We use essential cookies to store your profile name locally on your device. No personal data is sent to third parties. These cookies are necessary for the app to function.</div>
       </div>
       <div>
         <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>Analytics</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>We use Vercel Analytics and Google Analytics to understand how users interact with MemGenius. This data is anonymised and used only to improve the product.</div>
       </div>
       <div>
         <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>No third-party advertising cookies</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>We do not use advertising cookies or sell your data to third parties.</div>
       </div>
       <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>Last updated: June 2026 · hello@memgenius.com</div>
     </div>
   </main>
 )
}
