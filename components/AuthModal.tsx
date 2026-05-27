'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
 onSuccess: (name: string) => void
 onSkip?: () => void
 title?: string
 subtitle?: string
}

export default function AuthModal({ onSuccess }: Props) {
 const [name, setName] = useState('')
 const [pin, setPin] = useState(['','','',''])
 const [error, setError] = useState('')
 const [saving, setSaving] = useState(false)

 const handleSave = async () => {
   if (!name.trim()) { setError('Enter a name'); return }
   if (pin.join('').length !== 4) { setError('Enter a 4-digit PIN'); return }
   setSaving(true); setError('')
   let country = ''
   try { const geo = await fetch('https://ipapi.co/json/'); const geoData = await geo.json(); country = geoData.country_code || '' } catch {}
   const pinHash = btoa(pin.join(''))
   const { data: existing } = await supabase.from('profiles').select('player_name, password_hash').eq('player_name', name.trim()).limit(1)
   if (existing && existing.length > 0) {
     if (existing[0].password_hash !== pinHash) { setError('Wrong PIN for this name'); setSaving(false); return }
   } else {
     await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: pinHash, country })
   }
   localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim() }))
   setSaving(false)
   onSuccess(name.trim())
 }

 const ready = name.trim().length > 0 && pin.join('').length === 4

 return (
   <div style={{ background:'#1C1C1E', borderRadius:20, padding:'24px', width:'100%', border:'1px solid rgba(255,255,255,0.1)' }}>
     <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:4 }}>Create your profile</div>
     <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:20 }}>Free · No email · Rank globally</div>

     <input value={name} onChange={e=>{ setName(e.target.value); setError('') }} placeholder="Your name" maxLength={20}
       style={{ width:'100%', padding:'12px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:16, fontWeight:800, fontFamily:'var(--font-nunito), sans-serif', outline:'none', boxSizing:'border-box', marginBottom:12 }} />

     <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>PIN</div>
     <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:16 }}>
       {pin.map((d,i) => (
         <input key={i} id={"auth-pin-"+i} type="tel" maxLength={1} value={d}
           onChange={e=>{ const v=e.target.value.replace(/\D/,''); const p=[...pin]; p[i]=v; setPin(p); setError(''); if(v&&i<3)(document.getElementById("auth-pin-"+(i+1)) as HTMLInputElement)?.focus() }}
           onKeyDown={e=>{ if(e.key==='Backspace'&&!d&&i>0)(document.getElementById("auth-pin-"+(i-1)) as HTMLInputElement)?.focus() }}
           style={{ width:52, height:52, textAlign:'center', fontSize:20, fontWeight:900, borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'#fff', fontFamily:'var(--font-nunito), sans-serif', outline:'none', flexShrink:0 }} />
       ))}
     </div>

     {error && <div style={{ fontSize:13, color:'#FF5252', fontWeight:800, marginBottom:12, textAlign:'center' }}>{error}</div>}

     <button onClick={handleSave} disabled={!ready||saving}
       style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background: ready ? '#2E7D32' : 'rgba(255,255,255,0.08)', color: ready ? '#fff' : 'rgba(255,255,255,0.2)', fontSize:16, fontWeight:900, fontFamily:'var(--font-nunito), sans-serif', cursor: ready ? 'pointer' : 'default', boxShadow: ready ? '0 4px 0 #1B5E20' : 'none' }}>
       {saving ? 'Saving...' : 'Save →'}
     </button>
   </div>
 )
}
