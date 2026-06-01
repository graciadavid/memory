export default function AboutPage() {
 return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
     <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:20 }}>About</div>
     <div style={{ background:'#252525', borderRadius:16, padding:'20px' }}>
       <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:8 }}>Espiando Horizontes SL</div>
       <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7, marginBottom:16 }}>
         MemGenius is developed and operated by Espiando Horizontes SL, a company dedicated to building cognitive training tools that are free, accessible and scientifically grounded.
       </div>
       <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:6 }}>CIF: B55344980</div>
       <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:16 }}>Email: hello@memgenius.com</div>
       <a href="mailto:hello@memgenius.com" style={{ textDecoration:'none', display:'block', background:'#2E7D32', borderRadius:12, padding:'12px', textAlign:'center', fontSize:14, fontWeight:900, color:'#fff' }}>
         Contact us →
       </a>
     </div>
   </main>
 )
}
