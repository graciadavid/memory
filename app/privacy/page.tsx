export default function PrivacyPage() {
 return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
     <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:20 }}>Privacy Policy</div>
     <div style={{ background:'#252525', borderRadius:16, padding:'20px', display:'flex', flexDirection:'column', gap:16 }}>
       <div>
         <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>Who we are</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>MemGenius is operated by Espiando Horizontes SL (CIF B55344980). Contact: hello@memgenius.com</div>
       </div>
       <div>
         <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>What data we collect</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>We collect the username and PIN you create, your game scores, your country (detected via IP at registration), and optionally your email if you provide it. We do not collect your real name, phone number or payment information.</div>
       </div>
       <div>
         <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>How we use your data</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>Your data is used solely to provide the MemGenius service — displaying rankings, tracking your progress and sending notifications if you have consented. We never sell or share your data with third parties.</div>
       </div>
       <div>
         <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>Your rights</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>You can request deletion of your account and all associated data at any time by emailing hello@memgenius.com. Under GDPR you have the right to access, rectify and erase your personal data.</div>
       </div>
       <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>Last updated: June 2026</div>
     </div>
   </main>
 )
}
