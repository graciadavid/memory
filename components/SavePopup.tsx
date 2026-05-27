'use client'
import { useState } from 'react'
import AuthModal from '@/components/AuthModal'

interface Props {
 worldRank: number | null
 onSave: (playerName: string) => Promise<void>
}

export default function SavePopup({ worldRank, onSave }: Props) {
 const [visible, setVisible] = useState(true)
 const [saved, setSaved] = useState(false)

 if (!visible || saved) return null

 return (
   <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center', padding:'24px', fontFamily:'var(--font-nunito), sans-serif' }}>
     <div style={{ background:'#1C1C1E', borderRadius:24, padding:'28px 24px', width:'100%', maxWidth:400, border:'1px solid rgba(255,255,255,0.1)', textAlign:'center', position:'relative' }}>
       <button onClick={() => setVisible(false)} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', color:'rgba(255,255,255,0.3)', fontSize:20, cursor:'pointer' }}>✕</button>
       {worldRank && (
         <>
           <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>You are</div>
           <div style={{ fontSize:64, fontWeight:900, color:'#C8960C', lineHeight:1, marginBottom:4 }}>#{worldRank}</div>
           <div style={{ fontSize:16, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:24 }}>in the world</div>
         </>
       )}
       <AuthModal onSuccess={async (playerName) => {
         await onSave(playerName)
         setSaved(true)
         setVisible(false)
       }} title="Save your result" subtitle="Free · No email needed" />
     </div>
   </div>
 )
}
