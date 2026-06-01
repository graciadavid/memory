'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GREEN = '#2E7D32'

export default function RegisterBar() {
  const [hasProfile, setHasProfile] = useState(true)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    setHasProfile(!!stored)

    const onStorage = () => {
      const s = localStorage.getItem('memgenius_profile')
      setHasProfile(!!s)
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('profileUpdated', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('profileUpdated', onStorage)
    }
  }, [])

  if (hasProfile) return null

  const handleSave = async () => {
    if (!name.trim()) { setError('Enter a name'); return }
    if (pin.join('').length !== 4) { setError('Enter your PIN'); return }
    setSaving(true); setError('')
    let country = ''
    try { const geo = await fetch('https://ipapi.co/json/'); const d = await geo.json(); country = d.country_code || '' } catch {}
    const pinHash = btoa(pin.join(''))
    const { data: existing } = await supabase.from('profiles').select('player_name, password_hash').eq('player_name', name.trim()).limit(1)
    if (existing && existing.length > 0) {
      if (existing[0].password_hash !== pinHash) { setError('Wrong PIN'); setSaving(false); return }
    } else {
      await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: pinHash, country })
    }
    localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim() }))
    setSaving(false)
    setHasProfile(true)
    setOpen(false)
    window.dispatchEvent(new Event('profileUpdated'))
    window.location.reload()
  }

  return (
    <>
      {/* Bar */}
      {!open && (
        <div onClick={() => setOpen(true)} style={{ background:'#D32F2F', padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', position:'sticky', top:0, zIndex:998 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:900, color:'#fff' }}>💾 Save your results</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.7)', fontWeight:700 }}>Create your free profile — Name + PIN</div>
          </div>
          <div style={{ fontSize:12, fontWeight:900, color:'#fff', background:'rgba(255,255,255,0.2)', borderRadius:8, padding:'4px 10px' }}>Create →</div>
        </div>
      )}

      {/* Expanded form */}
      {open && (
        <div style={{ background:'#1C1C1E', borderBottom:'1px solid rgba(255,255,255,0.1)', padding:'16px', position:'sticky', top:0, zIndex:998 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#fff' }}>Create your profile</div>
            <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:18, cursor:'pointer' }}>✕</button>
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:8 }}>
            <input value={name} onChange={e => { setName(e.target.value); setError('') }}
              placeholder="Your name" maxLength={20}
              style={{ flex:1, padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:14, fontWeight:800, fontFamily:'var(--font-nunito), sans-serif', outline:'none' }} />
            <div style={{ display:'flex', gap:4 }}>
              {pin.map((d,i) => (
                <input key={i} id={`rbar-pin-${i}`} type="tel" maxLength={1} value={d}
                  onChange={e => { const v=e.target.value.replace(/\D/,''); const p=[...pin]; p[i]=v; setPin(p); setError(''); if(v&&i<3)(document.getElementById(`rbar-pin-${i+1}`) as HTMLInputElement)?.focus() }}
                  style={{ width:32, height:38, textAlign:'center', borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:16, fontWeight:900, fontFamily:'inherit', outline:'none' }} />
              ))}
            </div>
          </div>
          {error && <div style={{ fontSize:11, color:'#FF5252', fontWeight:700, marginBottom:8 }}>{error}</div>}
          <button onClick={handleSave} disabled={saving}
            style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', background:GREEN, color:'#fff', fontSize:14, fontWeight:900, fontFamily:'var(--font-nunito), sans-serif', cursor:'pointer' }}>
            {saving ? 'Saving...' : 'Save & Start Playing →'}
          </button>
        </div>
      )}
    </>
  )
}
