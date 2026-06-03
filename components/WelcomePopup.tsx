'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'

interface Props {
 onComplete: () => void
}

export default function WelcomePopup({ onComplete }: Props) {
 const [name, setName] = useState('')
 const [pin, setPin] = useState(['','','',''])
 const [error, setError] = useState('')
 const [saving, setSaving] = useState(false)

 const handleSave = async () => {
   if (!name.trim()) { setError('Enter your name'); return }
   if (pin.join('').length !== 4) { setError('Create your secret code'); return }
   setSaving(true); setError('')
   const pinHash = btoa(pin.join(''))
   const { data: existing } = await supabase.from('profiles').select('player_name, password_hash').eq('player_name', name.trim()).limit(1)
   if (existing && existing.length > 0) {
     if (existing[0].password_hash !== pinHash) { setError('Wrong secret code for this name'); setSaving(false); return }
   } else {
     let country = ''
     try { const controller = new AbortController(); setTimeout(() => controller.abort(), 2000); const geo = await fetch('https://ipapi.co/json/', { signal: controller.signal }); const d = await geo.json(); country = d.country_code || '' } catch {}
     await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: pinHash, country })
   }
   localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim() }))
   setSaving(false)
   onComplete()
 }

 return (
   <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:'var(--font-nunito),sans-serif' }}>
     <div style={{ background:'#1A1A1A', borderRadius:24, padding:'28px 24px', width:'100%', maxWidth:380, border:'1px solid rgba(255,255,255,0.1)' }}>

       {/* Mem Genius */}
       <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:24 }}>
         <img src={`${BASE}/brain-logo.webp`} style={{ width:56, height:56, objectFit:'contain', flexShrink:0 }} />
         <div style={{ background:'#252525', borderRadius:'0 16px 16px 16px', padding:'14px 16px', flex:1, position:'relative' }}>
           <div style={{ position:'absolute', left:-8, top:16, width:0, height:0, borderTop:'8px solid transparent', borderBottom:'8px solid transparent', borderRight:'8px solid #252525' }} />
           <div style={{ fontSize:13, fontWeight:800, color:GREEN, marginBottom:4 }}>Mem Genius</div>
           <div style={{ fontSize:15, fontWeight:700, color:'#fff', lineHeight:1.5 }}>
             Hola, soy Mem Genius.<br />Si juegas cada día, tu cerebro mejorará muchísimo.
           </div>
         </div>
       </div>

       {/* Name */}
       <div style={{ marginBottom:16 }}>
         <input value={name} onChange={e=>{ setName(e.target.value); setError('') }} placeholder="Tu nombre" maxLength={20} autoFocus
           style={{ width:'100%', padding:'14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color:'#fff', fontSize:16, fontWeight:800, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} />
       </div>

       {/* Secret code */}
       <div style={{ marginBottom:20 }}>
         <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Código secreto</div>
         <div style={{ display:'flex', gap:8 }}>
           {pin.map((d,i) => (
             <input key={i} id={`wp-pin-${i}`} type="tel" maxLength={1} value={d}
               onChange={e=>{ const v=e.target.value.replace(/\D/,''); const p=[...pin]; p[i]=v; setPin(p); setError(''); if(v&&i<3)(document.getElementById(`wp-pin-${i+1}`) as HTMLInputElement)?.focus() }}
               onKeyDown={e=>{ if(e.key==='Backspace'&&!d&&i>0)(document.getElementById(`wp-pin-${i-1}`) as HTMLInputElement)?.focus() }}
               style={{ width:52, height:52, textAlign:'center', fontSize:20, fontWeight:900, borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color:'#fff', fontFamily:'inherit', outline:'none', flexShrink:0 }} />
           ))}
         </div>
       </div>

       {error && <div style={{ fontSize:13, color:'#FF5252', fontWeight:800, marginBottom:12 }}>{error}</div>}

       <button onClick={handleSave} disabled={saving}
         style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20' }}>
         {saving ? 'Guardando...' : '¡Empezar a entrenar! →'}
       </button>

       <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:700, textAlign:'center', marginTop:10 }}>
         Gratis · Sin email · Ranking mundial
       </div>
     </div>
   </div>
 )
}
