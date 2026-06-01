export default function TermsPage() {
 return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
     <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:20 }}>Legal Notice</div>
     <div style={{ background:'#252525', borderRadius:16, padding:'20px', display:'flex', flexDirection:'column', gap:16 }}>
       <div>
         <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>Company details</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>Espiando Horizontes SL · CIF B55344980 · hello@memgenius.com</div>
       </div>
       <div>
         <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>Use of the service</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>MemGenius is a free brain training platform. Use of the service is subject to these terms. We reserve the right to modify or discontinue the service at any time. Users must not attempt to manipulate rankings, reverse engineer the platform or use it for any unlawful purpose.</div>
       </div>
       <div>
         <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>Intellectual property</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>All content, design and code on MemGenius is the property of Espiando Horizontes SL. Reproduction without written permission is prohibited.</div>
       </div>
       <div>
         <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>Limitation of liability</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>MemGenius is provided as-is. We make no guarantees regarding availability, accuracy or fitness for any particular purpose. Use at your own risk.</div>
       </div>
       <div>
         <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>Governing law</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>These terms are governed by Spanish law. Any disputes shall be resolved in the courts of Spain.</div>
       </div>
       <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>Last updated: June 2026</div>
     </div>
   </main>
 )
}
