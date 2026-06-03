'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const CATEGORIES = [
  { label: 'Brain Memory', icon: `${BASE}/brain-logo.webp`, href: '/memory-hub' },
  { label: 'Brain Agility', icon: `${BASE}/precision.png`, href: '/agility' },
  { label: 'Brain Knowledge', icon: `${BASE}/population.png`, href: '/knowledge' },
  { label: 'Brain Logic', icon: `${BASE}/target.png`, href: '/logic' },
]

function WelcomePopup({ onComplete }: { onComplete: () => void }) {
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
      if (existing[0].password_hash !== pinHash) { setError('Wrong secret code'); setSaving(false); return }
    } else {
      let country = ''
      try { const controller = new AbortController(); setTimeout(() => controller.abort(), 2000); const geo = await fetch('https://ipapi.co/json/', { signal: controller.signal }); const d = await geo.json(); country = d.country_code || '' } catch {}
      await supabase.from("profiles").upsert({ player_name: name.trim(), password_hash: pinHash, country, streak: 1, last_played: new Date().toISOString().split("T")[0] })
    }
    localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim() }))
    setSaving(false)
    onComplete()
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:'var(--font-nunito),sans-serif' }}>
      <div style={{ background:'#1A1A1A', borderRadius:24, padding:'28px 24px', width:'100%', maxWidth:380, border:'1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:24 }}>
          <img src={`${BASE}/brain-logo.webp`} style={{ width:56, height:56, objectFit:'contain', flexShrink:0 }} />
          <div style={{ background:'#252525', borderRadius:'0 16px 16px 16px', padding:'14px 16px', flex:1, position:'relative' }}>
            <div style={{ position:'absolute', left:-8, top:16, width:0, height:0, borderTop:'8px solid transparent', borderBottom:'8px solid transparent', borderRight:'8px solid #252525' }} />
            <div style={{ fontSize:13, fontWeight:800, color:GREEN, marginBottom:4 }}>Mem Genius</div>
            <div style={{ fontSize:15, fontWeight:700, color:'#fff', lineHeight:1.6 }}>
              Hi, I am Mem Genius.<br />Train every day and your brain will improve massively.
            </div>
          </div>
        </div>
        <input value={name} onChange={e => { setName(e.target.value); setError('') }} placeholder="Your name" maxLength={20} autoFocus
          style={{ width:'100%', padding:'14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color:'#fff', fontSize:16, fontWeight:800, fontFamily:'inherit', outline:'none', boxSizing:'border-box', marginBottom:16 }} />
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Secret code</div>
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {pin.map((d,i) => (
            <input key={i} id={`wp-${i}`} type="tel" maxLength={1} value={d}
              onChange={e => { const v=e.target.value.replace(/\D/,''); const p=[...pin]; p[i]=v; setPin(p); setError(''); if(v&&i<3)(document.getElementById(`wp-${i+1}`) as HTMLInputElement)?.focus() }}
              onKeyDown={e => { if(e.key==='Backspace'&&!d&&i>0)(document.getElementById(`wp-${i-1}`) as HTMLInputElement)?.focus() }}
              style={{ width:52, height:52, textAlign:'center', fontSize:20, fontWeight:900, borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color:'#fff', fontFamily:'inherit', outline:'none', flexShrink:0 }} />
          ))}
        </div>
        {error && <div style={{ fontSize:13, color:'#FF5252', fontWeight:800, marginBottom:12 }}>{error}</div>}
        <button onClick={handleSave} disabled={saving}
          style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20' }}>
          {saving ? 'Saving...' : 'Start training! →'}
        </button>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:700, textAlign:'center', marginTop:10 }}>
          Free · No email · World ranking
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [splash, setSplash] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [champWeek, setChampWeek] = useState<any>(null)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) setProfile(JSON.parse(stored))
    else setShowWelcome(true)
    supabase.from('championship_weeks').select('*').eq('active', true).single()
      .then(({ data }: any) => { if (data) setChampWeek(data) })
  }, [])

  useEffect(() => {
    if (!champWeek) return
    const tick = () => {
      const end = new Date(champWeek.sunday_date + 'T23:59:59Z')
      const now = new Date()
      const diff = end.getTime() - now.getTime()
      if (diff <= 0) { setCountdown('LIVE'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [champWeek])

  if (splash) return (
    <main style={{ height:'100dvh', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <img src={`${BASE}/brain-logo.webp`} style={{ width:80, height:80, objectFit:'contain' }} />
      <div style={{ fontSize:28, fontWeight:900, color:'#fff', letterSpacing:-1 }}>MemGenius</div>
      <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:0.5 }}>Train your brain. Beat the world.</div>
    </main>
  )

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      {showWelcome && (
        <WelcomePopup onComplete={() => {
          const stored = localStorage.getItem('memgenius_profile')
          if (stored) setProfile(JSON.parse(stored))
          setShowWelcome(false)
          window.location.href = '/training'
        }} />
      )}

      {champWeek && (
        <a href="/championship" style={{ textDecoration:'none', display:'block', marginBottom:16 }}>
          <div style={{ background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', borderRadius:16, padding:'16px 20px', boxShadow:'0 6px 0 rgba(100,70,0,0.5)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <img src={`${BASE}/winner.png`} style={{ width:32, height:32, objectFit:'contain' }} />
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:'rgba(0,0,0,0.5)', letterSpacing:2, textTransform:'uppercase' }}>Every Sunday</div>
                <div style={{ fontSize:18, fontWeight:900, color:'#000' }}>Sunday Championship</div>
              </div>
            </div>
            <div style={{ fontSize:13, fontWeight:900, color:'rgba(0,0,0,0.6)' }}>{countdown}</div>
          </div>
        </a>
      )}

      <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Train your Brain</div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {CATEGORIES.map(cat => (
          <a key={cat.label} href={cat.href} style={{ textDecoration:'none' }}>
            <div style={{ background:'#252525', borderRadius:16, overflow:'hidden', display:'flex', alignItems:'center' }}>
              <div style={{ width:80, height:80, flexShrink:0, background:'#2a2a2a', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src={cat.icon} style={{ width:44, height:44, objectFit:'contain' }} />
              </div>
              <div style={{ padding:'14px 16px', flex:1 }}>
                <div style={{ fontSize:17, fontWeight:900, color:'#fff' }}>{cat.label}</div>
              </div>
              <div style={{ paddingRight:16, fontSize:18, color:'rgba(255,255,255,0.3)' }}>›</div>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
