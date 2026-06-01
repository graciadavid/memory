'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GREEN = '#2E7D32'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [newPin, setNewPin] = useState(['','','',''])
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) {
      const p = JSON.parse(stored)
      setProfile(p)
      setName(p.name)
    }
  }, [])

  const handleSave = async () => {
    if (!name.trim()) { setError('Name required'); return }
    if (pin.join('').length !== 4) { setError('Enter your current PIN'); return }
    setSaving(true); setError(''); setSuccess('')

    const pinHash = btoa(pin.join(''))
    const { data: existing } = await supabase.from('profiles').select('password_hash').eq('player_name', profile.name).single()
    if (!existing || existing.password_hash !== pinHash) { setError('Wrong PIN'); setSaving(false); return }

    const updates: any = { player_name: name.trim() }
    if (newPin.join('').length === 4) updates.password_hash = btoa(newPin.join(''))
    if (email && consent) updates.email = email

    await supabase.from('profiles').update(updates).eq('player_name', profile.name)
    localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim() }))
    setSaving(false)
    setSuccess('Saved!')
    setProfile({ ...profile, name: name.trim() })
  }

  if (!profile) return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <a href="/profile" style={{ color:'#fff', fontSize:16, fontWeight:800 }}>Login first →</a>
    </main>
  )

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:4 }}>Settings</div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:24 }}>Change your name, PIN or add email</div>

      <div style={{ background:'#252525', borderRadius:16, padding:'20px', marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:16 }}>Account</div>

        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Name</div>
          <input value={name} onChange={e => setName(e.target.value)} maxLength={20}
            style={{ width:'100%', padding:'12px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:16, fontWeight:800, fontFamily:'var(--font-nunito),sans-serif', outline:'none', boxSizing:'border-box' }} />
        </div>

        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Current PIN</div>
          <div style={{ display:'flex', gap:8 }}>
            {pin.map((d,i) => (
              <input key={i} id={`pin-${i}`} type="tel" maxLength={1} value={d}
                onChange={e=>{ const v=e.target.value.replace(/\D/,''); const p=[...pin]; p[i]=v; setPin(p); if(v&&i<3)(document.getElementById(`pin-${i+1}`) as HTMLInputElement)?.focus() }}
                onKeyDown={e=>{ if(e.key==='Backspace'&&!d&&i>0)(document.getElementById(`pin-${i-1}`) as HTMLInputElement)?.focus() }}
                style={{ width:52, height:52, textAlign:'center', fontSize:20, fontWeight:900, borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'#fff', fontFamily:'inherit', outline:'none', flexShrink:0 }} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>New PIN (optional)</div>
          <div style={{ display:'flex', gap:8 }}>
            {newPin.map((d,i) => (
              <input key={i} id={`newpin-${i}`} type="tel" maxLength={1} value={d}
                onChange={e=>{ const v=e.target.value.replace(/\D/,''); const p=[...newPin]; p[i]=v; setNewPin(p); if(v&&i<3)(document.getElementById(`newpin-${i+1}`) as HTMLInputElement)?.focus() }}
                onKeyDown={e=>{ if(e.key==='Backspace'&&!d&&i>0)(document.getElementById(`newpin-${i-1}`) as HTMLInputElement)?.focus() }}
                style={{ width:52, height:52, textAlign:'center', fontSize:20, fontWeight:900, borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'#fff', fontFamily:'inherit', outline:'none', flexShrink:0 }} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Email (optional)</div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
            style={{ width:'100%', padding:'12px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:14, fontWeight:700, fontFamily:'inherit', outline:'none', boxSizing:'border-box', marginBottom:10 }} />
          <div onClick={() => setConsent(!consent)} style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer' }}>
            <div style={{ width:20, height:20, borderRadius:6, border:'2px solid rgba(255,255,255,0.2)', background: consent ? GREEN : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
              {consent && <span style={{ color:'#fff', fontSize:12, fontWeight:900 }}>✓</span>}
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, lineHeight:1.5 }}>
              I agree to receive notifications about new games, tournaments and championships. We never share your data with third parties.
            </div>
          </div>
        </div>

        {error && <div style={{ fontSize:13, color:'#FF5252', fontWeight:800, marginBottom:10 }}>{error}</div>}
        {success && <div style={{ fontSize:13, color:'#69F0AE', fontWeight:800, marginBottom:10 }}>{success}</div>}

        <button onClick={handleSave} disabled={saving}
          style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 4px 0 #1B5E20' }}>
          {saving ? 'Saving...' : 'Save Changes →'}
        </button>
      </div>
    </main>
  )
}
