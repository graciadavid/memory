'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const TESTS = [
  { key: 'agility', label: 'Reaction Time', icon: `${BASE}/precision.png`, desc: 'How fast is your brain?', href: '/brain-age-test/reaction-time-test' },
  { key: 'memory', label: 'Memory', icon: `${BASE}/brain-logo.webp`, desc: 'How much can you remember?', href: '/brain-age-test/memory-test' },
  { key: 'logic', label: 'Logic', icon: `${BASE}/mastermind.png`, desc: 'Can you crack the code?', href: '/brain-age-test/logic-test' },
  { key: 'knowledge', label: 'Flag Quiz', icon: `${BASE}/flags.png`, desc: 'How many flags do you know?', href: '/brain-age-test/flag-quiz' },
]

export default function BrainAgeTestPage() {
  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [step, setStep] = useState<'intro'|'tests'|'result'>('intro')
  const [results, setResults] = useState<Record<string,number>>({})
  const [brainAge, setBrainAge] = useState<number|null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) {
      const p = JSON.parse(stored)
      setName(p.name)
    }
    const session = localStorage.getItem('braintest_session')
    if (session) {
      const s = JSON.parse(session)
      if (s.name) setName(s.name)
      if (s.birthYear) setBirthYear(s.birthYear)
      if (s.results) setResults(s.results)
      if (s.step) setStep(s.step)
    }
  }, [])

  const handleStart = async () => {
    if (!name.trim()) { setError('Enter your name'); return }
    if (birthYear.length !== 4 || isNaN(Number(birthYear))) { setError('Enter a valid birth year'); return }
    const session = { name: name.trim(), birthYear, results: {}, step: 'tests' }
    localStorage.setItem('braintest_session', JSON.stringify(session))
    setStep('tests')
  }

  const completedTests = Object.keys(results).length
  const allDone = completedTests === 4

  const calcBrainAge = () => {
    const percentiles = Object.values(results)
    const avg = percentiles.reduce((a, b) => a + b, 0) / percentiles.length
    const age = parseInt(birthYear)
    let offset = 0
    if (avg <= 10) offset = -12
    else if (avg <= 25) offset = -7
    else if (avg <= 40) offset = -3
    else if (avg <= 60) offset = 0
    else if (avg <= 75) offset = 4
    else if (avg <= 90) offset = 8
    else offset = 13
    return age + offset
  }

  const handleSeeResult = async () => {
    const ba = calcBrainAge()
    setBrainAge(ba)
    setStep('result')
    // Register user
    const pinHash = btoa(birthYear)
    const { data: existing } = await supabase.from('profiles').select('player_name').eq('player_name', name.trim()).limit(1)
    if (!existing || existing.length === 0) {
      let country = ''
      try { const controller = new AbortController(); setTimeout(() => controller.abort(), 2000); const geo = await fetch('https://ipapi.co/json/', { signal: controller.signal }); const d = await geo.json(); country = d.country_code || '' } catch {}
      await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: pinHash, country, streak: 1, last_played_date: new Date().toISOString().split('T')[0] })
    }
    localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim() }))
    localStorage.removeItem('braintest_session')
    window.dispatchEvent(new Event('profileUpdated'))
  }

  if (step === 'result' && brainAge) return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Your Brain Age</div>
        <div style={{ fontSize:96, fontWeight:900, background:`linear-gradient(135deg, ${GOLD}, #FFD700)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1 }}>{brainAge}</div>
        <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.6)', marginTop:8 }}>
          {brainAge < parseInt(birthYear)
            ? `Your brain is ${parseInt(birthYear) - brainAge} years younger than your age`
            : brainAge > parseInt(birthYear)
            ? `Your brain is ${brainAge - parseInt(birthYear)} years older than your age`
            : 'Your brain age matches your real age'}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
        {TESTS.map(t => (
          <div key={t.key} style={{ background:'#252525', borderRadius:14, padding:'14px', textAlign:'center' }}>
            <img src={t.icon} style={{ width:32, height:32, objectFit:'contain', marginBottom:8 }} />
            <div style={{ fontSize:12, fontWeight:800, color:'#fff', marginBottom:4 }}>{t.label}</div>
            <div style={{ fontSize:18, fontWeight:900, color: (results[t.key]||50) <= 50 ? '#FF5252' : GREEN }}>
              Top {results[t.key] || '—'}%
            </div>
          </div>
        ))}
      </div>

      <a href="/training" style={{ textDecoration:'none', display:'block' }}>
        <button style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:16, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20', marginBottom:12 }}>
          Start Training Now →
        </button>
      </a>
      <button onClick={() => { setStep('intro'); setResults({}); setBrainAge(null) }}
        style={{ width:'100%', padding:'14px', borderRadius:14, border:'1px solid rgba(255,255,255,0.15)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:14, fontWeight:800, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer' }}>
        Repeat Test
      </button>
    </main>
  )

  if (step === 'tests') return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>
      <div style={{ background:`linear-gradient(90deg, ${GOLD}, #FFD700)`, borderRadius:8, height:6, marginBottom:24, position:'relative' }}>
        <div style={{ position:'absolute', left:0, top:0, height:'100%', borderRadius:8, background:GREEN, width:`${(completedTests/4)*100}%`, transition:'width 0.5s' }} />
      </div>
      <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:4 }}>Hi {name} 👋</div>
      <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>{completedTests}/4 tests completed</div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
        {TESTS.map(t => (
          <a key={t.key} href={results[t.key] ? undefined : t.href} style={{ textDecoration:'none' }}>
            <div style={{ background:'#252525', borderRadius:16, padding:'16px', textAlign:'center', border: results[t.key] ? `2px solid ${GREEN}` : '2px solid transparent', opacity: results[t.key] ? 0.8 : 1 }}>
              <img src={t.icon} style={{ width:36, height:36, objectFit:'contain', marginBottom:8 }} />
              <div style={{ fontSize:13, fontWeight:900, color:'#fff', marginBottom:4 }}>{t.label}</div>
              {results[t.key]
                ? <div style={{ fontSize:14, fontWeight:900, color:GREEN }}>Top {results[t.key]}% ✓</div>
                : <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>{t.desc}</div>
              }
            </div>
          </a>
        ))}
      </div>

      {allDone && (
        <button onClick={handleSeeResult}
          style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:`linear-gradient(135deg, ${GOLD}, #FFD700)`, color:'#000', fontSize:17, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer', boxShadow:'0 6px 0 #8B6914' }}>
          See my Brain Age →
        </button>
      )}
    </main>
  )

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <img src={`${BASE}/brain-logo.webp`} style={{ width:72, height:72, objectFit:'contain', marginBottom:16, filter:'drop-shadow(0 0 20px rgba(200,150,12,0.5))' }} />
        <div style={{ fontSize:28, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:8 }}>What is your<br />Brain Age?</div>
        <div style={{ display:'inline-flex', gap:8, background:'rgba(200,150,12,0.15)', borderRadius:20, padding:'6px 14px', marginBottom:8 }}>
          <span style={{ fontSize:12, fontWeight:800, color:GOLD }}>4 tests · 4 minutes · 1 result</span>
        </div>
      </div>

      <input value={name} onChange={e => { setName(e.target.value); setError('') }} placeholder="Your name" maxLength={20}
        style={{ width:'100%', padding:'14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color:'#fff', fontSize:16, fontWeight:800, fontFamily:'var(--font-nunito),sans-serif', outline:'none', boxSizing:'border-box', marginBottom:10 }} />
      <div style={{ position:'relative', marginBottom:20 }}>
        <input value={birthYear} onChange={e => { setBirthYear(e.target.value.replace(/\D/,'').slice(0,4)); setError('') }} placeholder="Birth year (e.g. 1990)" maxLength={4} type="tel"
          style={{ width:'100%', padding:'14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color:'#fff', fontSize:16, fontWeight:800, fontFamily:'var(--font-nunito),sans-serif', outline:'none', boxSizing:'border-box' }} />
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:5 }}>This becomes your secret code to log in</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
        {TESTS.map(t => (
          <div key={t.key} style={{ background:'#252525', borderRadius:16, padding:'14px', textAlign:'center' }}>
            <img src={t.icon} style={{ width:32, height:32, objectFit:'contain', marginBottom:6 }} />
            <div style={{ fontSize:12, fontWeight:900, color:'#fff', marginBottom:2 }}>{t.label}</div>
            <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>{t.desc}</div>
          </div>
        ))}
      </div>

      {error && <div style={{ fontSize:13, color:'#FF5252', fontWeight:800, marginBottom:12 }}>{error}</div>}

      <button onClick={handleStart}
        style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer', boxShadow:'0 6px 0 #1B5E20', marginBottom:16 }}>
        Discover my Brain Age →
      </button>

      <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)', fontWeight:700, textAlign:'center' }}>
        Free · No email · Takes 4 minutes
      </div>
    </main>
  )
}
