'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'


export default function RegisterPage() {
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) { setError('Enter a name'); return }
    if (pin.join('').length !== 4) { setError('Enter a 4-digit PIN'); return }
    setSaving(true); setError('')
    let country = ''
    try { const geo = await fetch('https://ipapi.co/json/'); const d = await geo.json(); country = d.country_code || '' } catch {}
    const pinHash = btoa(pin.join(''))
    const { data: existing } = await supabase.from('profiles').select('player_name, password_hash').eq('player_name', name.trim()).limit(1)
    if (existing && existing.length > 0) {
      if (existing[0].password_hash !== pinHash) { setError('Wrong PIN for this name'); setSaving(false); return }
    } else {
      await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: pinHash, country })
    }
    localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim() }))
    setSaving(false)
    window.location.href = '/profile'
  }

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'32px 20px 100px' }}>
      <div style={{ fontSize:24, fontWeight:900, color:'#fff', marginBottom:4 }}>Create your profile</div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:28 }}>Free · No email · Rank globally</div>

      {/* Avatar picker */}
      <div style={{ marginBottom:24 }}>
              style={{ width:'100%', height:52, textAlign:'center', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color:'#fff', fontSize:22, fontWeight:900, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} />
          ))}
        </div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:6 }}>Remember your PIN — it's how you log in</div>
      </div>

      {error && <div style={{ fontSize:13, color:'#FF5252', fontWeight:800, marginBottom:16 }}>{error}</div>}

      <button onClick={handleSave} disabled={saving}
        style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer', boxShadow:'0 6px 0 #1B5E20' }}>
        {saving ? 'Saving...' : 'Start Playing →'}
      </button>
    </main>
  )
}
