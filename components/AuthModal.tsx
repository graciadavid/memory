'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
 onSuccess: (name: string) => void
 onSkip?: () => void
 title?: string
 subtitle?: string
}

export default function AuthModal({ onSuccess, onSkip, title = 'Save your result', subtitle = '' }: Props) {
 const [name, setName] = useState('')
 const [pin, setPin] = useState(['','','',''])
 const [error, setError] = useState('')
 const [saving, setSaving] = useState(false)

 const handleSave = async () => {
   if (!name.trim()) { setError('Enter a name'); return }
   if (pin.join('').length !== 4) { setError('Choose a 4-digit PIN'); return }
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
   const fullProfile = { name: name.trim(), streak: 0, lastPlayedDate: '', totalPairs: 0, gamesPlayed: 0, bestRanks: {}, bestTimes: {}, joinedDate: new Date().toISOString().split('T')[0], achievements: [] }; localStorage.setItem('memgenius_profile', JSON.stringify(fullProfile))
   setSaving(false)
   onSuccess(name.trim())
 }

 const ready = name.trim().length > 0 && pin.join('').length === 4

 return (
   <div style={{ background:'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', borderRadius:32, padding:'32px 28px 28px', width:'100%', maxWidth:380, border:'1px solid rgba(255,255,255,0.12)', boxShadow:'0 32px 80px rgba(0,0,0,0.6)' }}>

     {/* Streak badge */}
     <div style={{ textAlign:'center', marginBottom:24 }}>
       <div style={{ display:'inline-flex', flexDirection:'column', alignItems:'center', background:'rgba(255,255,255,0.06)', borderRadius:20, padding:'16px 28px', border:'1px solid rgba(255,255,255,0.1)', marginBottom:16 }}>
         <div style={{ fontSize:64, fontWeight:900, color:'#FF6D00', lineHeight:1 }}>1</div>
         <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.5)', letterSpacing:2, textTransform:'uppercase', marginTop:4 }}>Day Streak</div>
       </div>
       <div style={{ fontSize:24, fontWeight:900, color:'#fff', marginBottom:6 }}>Save your result</div>
       <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Free · No email · Rank globally</div>
     </div>

     {/* Name */}
     <div style={{ marginBottom:16 }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.5)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Your name</div>
       <input value={name} onChange={e=>{ setName(e.target.value); setError('') }} placeholder="Enter your name" maxLength={20}
         style={{ width:'100%', padding:'16px', borderRadius:14, border:'2px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:18, fontWeight:800, fontFamily:'var(--font-nunito), sans-serif', outline:'none', boxSizing:'border-box' }} />
     </div>

     {/* PIN */}
     <div style={{ marginBottom:24 }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.5)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Create PIN</div>
       <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
         {pin.map((d,i) => (
           <input key={i} id={"auth-pin-"+i} type="tel" maxLength={1} value={d}
             onChange={e=>{ const v=e.target.value.replace(/\D/,''); const p=[...pin]; p[i]=v; setPin(p); setError(''); if(v&&i<3)(document.getElementById("auth-pin-"+(i+1)) as HTMLInputElement)?.focus() }}
             onKeyDown={e=>{ if(e.key==='Backspace'&&!d&&i>0)(document.getElementById("auth-pin-"+(i-1)) as HTMLInputElement)?.focus() }}
             style={{ width:52, height:52, textAlign:'center', fontSize:20, fontWeight:900, borderRadius:12, border:'2px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.08)', color:'#fff', fontFamily:'var(--font-nunito), sans-serif', outline:'none', flexShrink:0 }} />
         ))}
       </div>
     </div>

     {error && <div style={{ fontSize:13, color:'#FF5252', fontWeight:800, marginBottom:14, textAlign:'center' }}>{error}</div>}

     {/* Save button */}
     <button onClick={handleSave} disabled={!ready||saving}
       style={{ width:'100%', padding:'18px', borderRadius:18, border:'none', background: ready ? 'linear-gradient(135deg, #FF6D00, #FF8F00)' : 'rgba(255,255,255,0.08)', color: ready ? '#fff' : 'rgba(255,255,255,0.2)', fontSize:17, fontWeight:900, fontFamily:'var(--font-nunito), sans-serif', cursor: ready ? 'pointer' : 'default', marginBottom:12, boxShadow: ready ? '0 8px 0 rgba(255,109,0,0.4)' : 'none', letterSpacing:0.3 }}>
       {saving ? 'Saving...' : 'Save & Continue Playing →'}
     </button>

     {onSkip && (
       <button onClick={onSkip} style={{ width:'100%', padding:'10px', borderRadius:12, border:'none', background:'transparent', color:'rgba(255,255,255,0.25)', fontSize:13, fontWeight:800, fontFamily:'var(--font-nunito), sans-serif', cursor:'pointer' }}>
         Skip for now
       </button>
     )}
   </div>
 )
}