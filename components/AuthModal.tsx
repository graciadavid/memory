'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const GREEN = '#2E7D32'

interface Props {
 onSuccess: (name: string) => void
 onSkip?: () => void
 title?: string
 subtitle?: string
}

export default function AuthModal({ onSuccess, onSkip, title = 'Save your result', subtitle = 'Create a free profile to save your score and rank globally' }: Props) {
 const [name, setName] = useState('')
 const [pin, setPin] = useState(['','','',''])
 const [error, setError] = useState('')
 const [saving, setSaving] = useState(false)

 const handleSave = async () => {
   if (!name.trim()) { setError('Enter a name'); return }
   if (pin.join('').length !== 4) { setError('PIN must be 4 digits'); return }
   setSaving(true); setError('')

   const pinHash = btoa(pin.join(''))
   const { data: existing } = await supabase
     .from('profiles')
     .select('player_name, password_hash')
     .eq('player_name', name.trim())
     .limit(1)

   if (existing && existing.length > 0) {
     // Name exists — try login
     if (existing[0].password_hash !== pinHash) {
       setError('Wrong PIN for this name')
       setSaving(false)
       return
     }
     // Login successful
   } else {
     // New user — register
     await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: pinHash })
   }

   localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim() }))
   setSaving(false)
   onSuccess(name.trim())
 }

 return (
   <div style={{ background:'#1C1C1E', borderRadius:24, padding:'28px 24px', width:'100%', maxWidth:340, border:'1px solid rgba(255,255,255,0.08)' }}>
     <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:4 }}>{title}</div>
     <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:20 }}>{subtitle}</div>

     <input
       value={name}
       onChange={e => { setName(e.target.value); setError('') }}
       placeholder="Your name"
       style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:15, fontWeight:800, fontFamily:'var(--font-nunito), sans-serif', outline:'none', marginBottom:12, boxSizing:'border-box' }}
     />

     <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', marginBottom:8, letterSpacing:1 }}>PIN — 4 digits to protect your profile</div>
     <div style={{ display:'flex', gap:6, marginBottom:16, justifyContent:'center' }}>
       {pin.map((d,i) => (
         <input key={i} id={`auth-pin-${i}`} type="tel" maxLength={1} value={d}
           onChange={e=>{const v=e.target.value.replace(/\D/,'');const p=[...pin];p[i]=v;setPin(p);setError('');if(v&&i<3)(document.getElementById(`auth-pin-${i+1}`) as HTMLInputElement)?.focus()}}
           style={{ width:56, height:56, textAlign:'center', fontSize:22, fontWeight:900, borderRadius:10, border:'2px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.08)', color:'#fff', fontFamily:'var(--font-nunito), sans-serif', outline:'none', flexShrink:0 }}
         />
       ))}
     </div>

     {error && <div style={{ fontSize:12, color:'#FF5252', fontWeight:800, marginBottom:12 }}>{error}</div>}

     <button onClick={handleSave} disabled={!name.trim()||pin.join('').length!==4||saving}
       style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:name.trim()&&pin.join('').length===4?GREEN:'rgba(255,255,255,0.1)', color:'#fff', fontSize:15, fontWeight:900, fontFamily:'var(--font-nunito), sans-serif', cursor:'pointer', marginBottom: onSkip ? 10 : 0 }}>
       {saving ? 'Saving...' : 'Save & Play →'}
     </button>

     {onSkip && (
       <button onClick={onSkip} style={{ width:'100%', padding:'10px', borderRadius:12, border:'none', background:'transparent', color:'rgba(255,255,255,0.3)', fontSize:13, fontWeight:800, fontFamily:'var(--font-nunito), sans-serif', cursor:'pointer' }}>
         Skip for now
       </button>
     )}
   </div>
 )
}
