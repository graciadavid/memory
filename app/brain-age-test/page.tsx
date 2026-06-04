'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const TESTS = [
 { key: 'agility', label: 'Reaction Time', icon: `${BASE}/precision.png`, href: '/brain-age-test/reaction-time-test', step: 1 },
 { key: 'memory', label: 'Memory', icon: `${BASE}/brain-logo.webp`, href: '/brain-age-test/memory-test', step: 2 },
 { key: 'logic', label: 'Logic', icon: `${BASE}/mastermind.png`, href: '/brain-age-test/logic-test', step: 3 },
 { key: 'knowledge', label: 'Flag Quiz', icon: `${BASE}/flags.png`, href: '/brain-age-test/flag-quiz', step: 4 },
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
   if (stored) setName(JSON.parse(stored).name)
   const session = localStorage.getItem('braintest_session')
   if (session) {
     const s = JSON.parse(session)
     if (s.name) setName(s.name)
     if (s.birthYear) setBirthYear(s.birthYear)
     if (s.results) setResults(s.results)
     if (s.step) setStep(s.step)
   }
 }, [])

 const handleStart = () => {
   if (!name.trim()) { setError('Enter your name'); return }
   if (birthYear.length !== 4 || isNaN(Number(birthYear))) { setError('Enter a valid birth year'); return }
   localStorage.setItem('braintest_session', JSON.stringify({ name: name.trim(), birthYear, results: {}, step: 'tests' }))
   setStep('tests')
 }

 const calcBrainAge = () => {
   const percentiles = Object.values(results)
   const avg = percentiles.reduce((a, b) => a + b, 0) / percentiles.length
   const age = parseInt(birthYear)
   if (avg <= 10) return age - 12
   if (avg <= 25) return age - 7
   if (avg <= 40) return age - 3
   if (avg <= 60) return age
   if (avg <= 75) return age + 4
   if (avg <= 90) return age + 8
   return age + 13
 }

 const handleSeeResult = async () => {
   const ba = calcBrainAge()
   setBrainAge(ba)
   setStep('result')
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

 const completedTests = Object.keys(results).length

 // RESULT
 if (step === 'result' && brainAge) return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>
     <div style={{ textAlign:'center', marginBottom:32 }}>
       <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Your Result</div>
       <div style={{ width:160, height:160, borderRadius:'50%', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 40px rgba(200,150,12,0.4)' }}>
         <div style={{ width:144, height:144, borderRadius:'50%', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
           <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>BRAIN AGE</div>
           <div style={{ fontSize:56, fontWeight:900, color:GOLD, lineHeight:1 }}>{brainAge}</div>
         </div>
       </div>
       <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.6)' }}>
         {brainAge < parseInt(birthYear)
           ? `🧠 Your brain is ${parseInt(birthYear) - brainAge} years younger than your age`
           : brainAge > parseInt(birthYear)
           ? `Your brain is ${brainAge - parseInt(birthYear)} years older than your age`
           : 'Your brain age matches your real age'}
       </div>
     </div>
     <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
       {TESTS.map(t => (
         <div key={t.key} style={{ background:'#252525', borderRadius:14, padding:'14px', textAlign:'center' }}>
           <img src={t.icon} style={{ width:28, height:28, objectFit:'contain', marginBottom:6 }} />
           <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.6)', marginBottom:4 }}>{t.label}</div>
           <div style={{ fontSize:20, fontWeight:900, color: (results[t.key]||50) <= 50 ? '#FF5252' : GREEN }}>
             {results[t.key] ? `Top ${results[t.key]}%` : '—'}
           </div>
         </div>
       ))}
     </div>
     <a href="/training" style={{ textDecoration:'none', display:'block', marginBottom:10 }}>
       <button style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:16, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20' }}>
         Start Training Now →
       </button>
     </a>
     <button onClick={() => { setStep('intro'); setResults({}); setBrainAge(null) }}
       style={{ width:'100%', padding:'14px', borderRadius:14, border:'1px solid rgba(255,255,255,0.15)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:14, fontWeight:800, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer' }}>
       Repeat Test
     </button>
   </main>
 )

 // TESTS IN PROGRESS
 if (step === 'tests') return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>
     <div style={{ textAlign:'center', marginBottom:24 }}>
       <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Your Result</div>
       <div style={{ width:120, height:120, borderRadius:'50%', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', margin:'0 auto 8px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 30px rgba(200,150,12,0.3)' }}>
         <div style={{ width:106, height:106, borderRadius:'50%', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
           <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>AGE</div>
           <div style={{ fontSize:36, fontWeight:900, color:'rgba(255,255,255,0.2)' }}>?</div>
         </div>
       </div>
       <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.3)' }}>{completedTests}/4 completed</div>
     </div>

     <div style={{ background:'#252525', borderRadius:8, height:6, marginBottom:24, overflow:'hidden' }}>
       <div style={{ height:'100%', borderRadius:8, background:GREEN, width:`${(completedTests/4)*100}%`, transition:'width 0.5s' }} />
     </div>

     <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
       {TESTS.map((t, i) => {
         const done = !!results[t.key]
         const active = !done && Object.keys(results).length === i
         return (
           <a key={t.key} href={done ? undefined : t.href} style={{ textDecoration:'none' }}>
             <div style={{ background: active ? '#2a2a2a' : '#1e1e1e', borderRadius:16, padding:'14px 16px', display:'flex', alignItems:'center', gap:14, border: done ? `2px solid ${GREEN}` : active ? `2px solid ${GOLD}` : '2px solid rgba(255,255,255,0.05)' }}>
               <div style={{ width:40, height:40, borderRadius:'50%', background: done ? GREEN : active ? GOLD : '#333', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                 {done
                   ? <span style={{ fontSize:18, color:'#fff' }}>✓</span>
                   : <span style={{ fontSize:14, fontWeight:900, color: active ? '#000' : 'rgba(255,255,255,0.3)' }}>{t.step}</span>
                 }
               </div>
               <img src={t.icon} style={{ width:28, height:28, objectFit:'contain' }} />
               <div style={{ flex:1, fontSize:16, fontWeight:900, color: done ? 'rgba(255,255,255,0.5)' : '#fff' }}>{t.label}</div>
               {done
                 ? <div style={{ fontSize:14, fontWeight:900, color:GREEN }}>Top {results[t.key]}%</div>
                 : <div style={{ fontSize:18, color: active ? GOLD : 'rgba(255,255,255,0.2)' }}>›</div>
               }
             </div>
           </a>
         )
       })}
     </div>

     {completedTests === 4 && (
       <button onClick={handleSeeResult}
         style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:`linear-gradient(135deg, ${GOLD}, #FFD700)`, color:'#000', fontSize:17, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer', boxShadow:'0 6px 0 #8B6914', marginTop:20 }}>
         See my Brain Age →
       </button>
     )}
   </main>
 )

 // INTRO
 return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>

     <div style={{ textAlign:'center', marginBottom:24 }}>
       <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Your Result</div>
       <div style={{ width:140, height:140, borderRadius:'50%', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', margin:'0 auto 12px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 40px rgba(200,150,12,0.3)' }}>
         <div style={{ width:124, height:124, borderRadius:'50%', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
           <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>BRAIN AGE</div>
           <div style={{ fontSize:52, fontWeight:900, color:'rgba(255,255,255,0.15)' }}>?</div>
         </div>
       </div>
       <div style={{ fontSize:26, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:8 }}>What is your Brain Age?</div>
       <div style={{ display:'inline-flex', background:'rgba(200,150,12,0.15)', borderRadius:20, padding:'5px 14px' }}>
         <span style={{ fontSize:12, fontWeight:800, color:GOLD }}>4 tests · 4 minutes · free</span>
       </div>
     </div>

     <input value={name} onChange={e => { setName(e.target.value); setError('') }} placeholder="Your name" maxLength={20}
       style={{ width:'100%', padding:'14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color:'#fff', fontSize:16, fontWeight:800, fontFamily:'var(--font-nunito),sans-serif', outline:'none', boxSizing:'border-box', marginBottom:10 }} />
     <input value={birthYear} onChange={e => { setBirthYear(e.target.value.replace(/\D/g,'').slice(0,4)); setError('') }} placeholder="Birth year (e.g. 1990)" maxLength={4} type="tel"
       style={{ width:'100%', padding:'14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color:'#fff', fontSize:16, fontWeight:800, fontFamily:'var(--font-nunito),sans-serif', outline:'none', boxSizing:'border-box', marginBottom:4 }} />
     <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, marginBottom:20 }}>Your birth year becomes your secret login code</div>

     {error && <div style={{ fontSize:13, color:'#FF5252', fontWeight:800, marginBottom:12 }}>{error}</div>}

     <button onClick={handleStart}
       style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer', boxShadow:'0 6px 0 #1B5E20', marginBottom:20 }}>
       Discover my Brain Age →
     </button>

     <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
       {TESTS.map(t => (
         <div key={t.key} style={{ background:'#252525', borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
           <div style={{ width:32, height:32, borderRadius:'50%', background:'#333', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
             <span style={{ fontSize:13, fontWeight:900, color:'rgba(255,255,255,0.4)' }}>{t.step}</span>
           </div>
           <img src={t.icon} style={{ width:26, height:26, objectFit:'contain' }} />
           <div style={{ fontSize:15, fontWeight:800, color:'rgba(255,255,255,0.7)' }}>{t.label}</div>
         </div>
       ))}
     </div>

     <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)', fontWeight:700, textAlign:'center', marginBottom:32 }}>Free · No email · 4 minutes</div>

     <details style={{ marginTop:8 }}>
       <summary style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', cursor:'pointer', listStyle:'none' }}>What is a Brain Age Test? ▼</summary>
       <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.7, marginTop:12 }}>
         A brain age test measures cognitive performance across reaction time, memory, logic and general knowledge. By comparing your results to thousands of people your age, it calculates whether your brain performs younger or older than your biological age. Research shows that regular cognitive training can reduce brain age by up to 10 years. This free brain age test takes 4 minutes and gives you an instant result with no signup required.
       </div>
     </details>
   </main>
 )
}
