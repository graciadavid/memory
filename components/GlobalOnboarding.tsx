'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePathname } from 'next/navigation'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'

// Pages that don't need onboarding
const EXCLUDED = ['/', '/terms', '/privacy', '/about', '/how-to-play']

export default function GlobalOnboarding() {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Don't show on excluded pages
    if (EXCLUDED.includes(pathname)) return
    // Don't show on game pages - only blog, groups, ranking, profile
    const showOn = ['/groups', '/profile', '/streak']
    const shouldShow = showOn.some(p => pathname.startsWith(p))
    if (!shouldShow) return

    const stored = localStorage.getItem('memgenius_profile')
    if (!stored || !JSON.parse(stored).name) {
      setTimeout(() => setShow(true), 1000)
    }
  }, [pathname])

  const handleSave = async () => {
    if (!name.trim()) { setError('Please enter a name'); return }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { setError('PIN must be 4 digits'); return }
    setSaving(true)
    setError('')

    // Check name availability
    const { data: existing } = await supabase.from('profiles').select('player_name').eq('player_name', name.trim()).limit(1)
    if (existing && existing.length > 0) {
      setError('Name already taken — try another')
      setSaving(false)
      return
    }

    // Save profile
    const bcrypt = pin // simplified — store pin hash in real app
    await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: pin })
    localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim(), pin }))
    setSaving(false)
    setShow(false)
    window.location.reload()
  }

  if (!show) return null

  return (
    <>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(74,44,10,0.6)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}>
        <div style={{
          background: '#FAF7F2', borderRadius: '24px 24px 0 0',
          padding: '32px 24px 48px', width: '100%', maxWidth: 430,
          animation: 'slideUp 0.3s ease',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Join MemGenius</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: BROWN }}>Create your profile</div>
            <div style={{ fontSize: 13, color: `${BROWN}60`, marginTop: 6, lineHeight: 1.6 }}>Choose a name and a 4-digit PIN to save your scores and compete on the world ranking.</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              style={{
                padding: '14px 16px', borderRadius: 14,
                border: `1.5px solid ${BROWN}20`, background: '#fff',
                fontSize: 16, fontFamily: 'inherit', outline: 'none',
                color: BROWN, fontWeight: 700,
              }}
            />
            <input
              type="number"
              placeholder="4-digit PIN"
              value={pin}
              onChange={e => setPin(e.target.value.slice(0, 4))}
              style={{
                padding: '14px 16px', borderRadius: 14,
                border: `1.5px solid ${BROWN}20`, background: '#fff',
                fontSize: 16, fontFamily: 'inherit', outline: 'none',
                color: BROWN, fontWeight: 700,
              }}
            />
            {error && <div style={{ fontSize: 12, color: '#C62828', fontWeight: 700, textAlign: 'center' }}>{error}</div>}
            <button onClick={handleSave} disabled={saving} style={{
              padding: '16px', borderRadius: 16, border: 'none',
              background: BROWN, color: '#fff',
              fontSize: 16, fontWeight: 900, fontFamily: 'inherit',
              cursor: saving ? 'default' : 'pointer',
              boxShadow: `0 6px 0 ${BROWN}60`,
              marginTop: 4,
            }}>{saving ? 'Saving...' : 'Join MemGenius'}</button>
            <button onClick={() => setShow(false)} style={{
              padding: '10px', borderRadius: 12, border: 'none',
              background: 'transparent', color: `${BROWN}50`,
              fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
              cursor: 'pointer',
            }}>Maybe later</button>
          </div>
        </div>
      </div>
    </>
  )
}
