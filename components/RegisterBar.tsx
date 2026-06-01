'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GREEN = '#2E7D32'

export default function RegisterBar() {
  const [hasProfile, setHasProfile] = useState(true)
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    setHasProfile(!!stored)
    const onStorage = () => setHasProfile(!!localStorage.getItem('memgenius_profile'))
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
    window.dispatchEvent(new Event('profileUpdated'))
    window.location.reload()
  }

  return (
    <div style={{ background:'#D32F2F', padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ fontSize:11, fontWeight:900, color:'rgba(255,255,255,0.8)', letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>💾 Save your results</div>
      <div style={{ display:'flex', gap:6, marginBottom:6 }}>
        <input value={name} onChange={e => { setName(e.target.value); setError('') }}
          placeholder="Your name" maxLength={20}
          style={{ flex:1, padding:'8px 10px', borderRadius:8, border:'none', background:'rgba(255,255,255,0.15)', color:'#fff', fontSize:13, fontWeight:800, fontFamily:'var(--font-nunito), sans-serif', outline:'none' }} />
        <div style={{ display:'flex', gap:3 }}>
          {pin.map((d,i) => (
            <input key={i} id={`rbar-pin-${i}`} type="tel" maxLength={1} value={d}
              onChange={e => { const v=e.target.value.replace(/\D/,''); const p=[...pin]; p[i]=v; setPin(p); setError(''); if(v&&i<3)(document.getElementById(`rbar-pin-${i+1}`) as HTMLInputElement)?.focus() }}
              style={{ width:28, height:34, textAlign:'center', borderRadius:6, border:'none', background:'rgba(255,255,255,0.15)', color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', outline:'none' }} />
          ))}
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ padding:'8px 12px', borderRadius:8, border:'none', background:'#fff', color:'#D32F2F', fontSize:12, fontWeight:900, fontFamily:'var(--font-nunito), sans-serif', cursor:'pointer', whiteSpace:'nowrap' }}>
          {saving ? '...' : 'Save →'}
        </button>
      </div>
      {error && <div style={{ fontSize:10, color:'rgba(255,255,255,0.8)', fontWeight:700 }}>{error}</div>}
    </div>
  )
}
