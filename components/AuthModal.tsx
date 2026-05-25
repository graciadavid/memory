'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  onSuccess: (name: string) => void
  onSkip?: () => void
  title?: string
  subtitle?: string
}

export default function AuthModal({ onSuccess, onSkip, title = 'Save your result', subtitle = 'Free · Takes 10 seconds · No email needed' }: Props) {
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) { setError('Enter a name'); return }
    if (pin.join('').length !== 4) { setError('Choose a 4-digit PIN'); return }
    setSaving(true); setError('')
    const pinHash = btoa(pin.join(''))
    const { data: existing } = await supabase.from('profiles').select('player_name, password_hash').eq('player_name', name.trim()).limit(1)
    if (existing && existing.length > 0) {
      if (existing[0].password_hash !== pinHash) { setError('Wrong PIN for this name'); setSaving(false); return }
    } else {
      await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: pinHash })
    }
    localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim() }))
    setSaving(false)
    onSuccess(name.trim())
  }

  const ready = name.trim().length > 0 && pin.join('').length === 4

  return (
    <div style={{ background:'#1C1C1E', borderRadius:28, padding:'28px 24px 24px', width:'100%', maxWidth:360, border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 24px 64px rgba(0,0,0,0.5)' }}>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:6 }}>{title}</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)', fontWeight:700 }}>{subtitle}</div>
      </div>
      <div style={{ display:'flex', gap:12, marginBottom:16 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.35)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:6 }}>Name</div>
          <input value={name} onChange={e=>{ setName(e.target.value); setError('') }} placeholder="Your name" maxLength={20}
            style={{ width:'100%', padding:'12px', borderRadius:12, border:'1.5px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:15, fontWeight:800, fontFamily:'var(--font-nunito), sans-serif', outline:'none', boxSizing:'border-box' }} />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.35)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:6 }}>PIN</div>
          <div style={{ display:'flex', gap:6 }}>
            {pin.map((d,i) => (
              <input key={i} id={"auth-pin-"+i} type="tel" maxLength={1} value={d}
                onChange={e=>{ const v=e.target.value.replace(/\D/,''); const p=[...pin]; p[i]=v; setPin(p); setError(''); if(v&&i<3)(document.getElementById("auth-pin-"+(i+1)) as HTMLInputElement)?.focus() }}
                onKeyDown={e=>{ if(e.key==='Backspace'&&!d&&i>0)(document.getElementById("auth-pin-"+(i-1)) as HTMLInputElement)?.focus() }}
                style={{ flex:1, height:44, textAlign:'center', fontSize:18, fontWeight:900, borderRadius:10, border:'1.5px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', color:'#fff', fontFamily:'var(--font-nunito), sans-serif', outline:'none' }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)', fontWeight:700, marginBottom:16, textAlign:'center' }}>Same name + PIN to login on any device</div>
      {error && <div style={{ fontSize:12, color:'#FF5252', fontWeight:800, marginBottom:12, textAlign:'center' }}>{error}</div>}
      <button onClick={handleSave} disabled={!ready||saving}
        style={{ width:'100%', padding:'15px', borderRadius:16, border:'none', background: ready ? '#2E7D32' : 'rgba(255,255,255,0.08)', color: ready ? '#fff' : 'rgba(255,255,255,0.2)', fontSize:16, fontWeight:900, fontFamily:'var(--font-nunito), sans-serif', cursor: ready ? 'pointer' : 'default', marginBottom: onSkip ? 10 : 0, boxShadow: ready ? '0 6px 0 #1B5E2060' : 'none' }}>
        {saving ? 'Saving...' : 'Save & Rank Me'}
      </button>
      {onSkip && (
        <button onClick={onSkip} style={{ width:'100%', padding:'10px', borderRadius:12, border:'none', background:'transparent', color:'rgba(255,255,255,0.25)', fontSize:13, fontWeight:800, fontFamily:'var(--font-nunito), sans-serif', cursor:'pointer' }}>
          Skip for now
        </button>
      )}
    </div>
  )
}