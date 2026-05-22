'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const TEAL = '#00796B'
const FLAG_CDN = 'https://flagcdn.com/w320'

const COUNTRIES = [
 { code: 'cn', name: 'China', pop: 1412000000 },
 { code: 'in', name: 'India', pop: 1380000000 },
 { code: 'us', name: 'United States', pop: 331000000 },
 { code: 'id', name: 'Indonesia', pop: 273000000 },
 { code: 'pk', name: 'Pakistan', pop: 220000000 },
 { code: 'br', name: 'Brazil', pop: 213000000 },
 { code: 'ng', name: 'Nigeria', pop: 206000000 },
 { code: 'bd', name: 'Bangladesh', pop: 167000000 },
 { code: 'ru', name: 'Russia', pop: 145000000 },
 { code: 'mx', name: 'Mexico', pop: 130000000 },
 { code: 'et', name: 'Ethiopia', pop: 120000000 },
 { code: 'jp', name: 'Japan', pop: 125000000 },
 { code: 'ph', name: 'Philippines', pop: 111000000 },
 { code: 'eg', name: 'Egypt', pop: 102000000 },
 { code: 'cd', name: 'DR Congo', pop: 99000000 },
 { code: 'vn', name: 'Vietnam', pop: 97000000 },
 { code: 'ir', name: 'Iran', pop: 84000000 },
 { code: 'tr', name: 'Turkey', pop: 84000000 },
 { code: 'de', name: 'Germany', pop: 83000000 },
 { code: 'th', name: 'Thailand', pop: 70000000 },
 { code: 'gb', name: 'United Kingdom', pop: 67000000 },
 { code: 'fr', name: 'France', pop: 67000000 },
 { code: 'tz', name: 'Tanzania', pop: 63000000 },
 { code: 'za', name: 'South Africa', pop: 60000000 },
 { code: 'mm', name: 'Myanmar', pop: 54000000 },
 { code: 'ke', name: 'Kenya', pop: 54000000 },
 { code: 'kr', name: 'South Korea', pop: 52000000 },
 { code: 'co', name: 'Colombia', pop: 51000000 },
 { code: 'es', name: 'Spain', pop: 47000000 },
 { code: 'ug', name: 'Uganda', pop: 47000000 },
 { code: 'ar', name: 'Argentina', pop: 45000000 },
 { code: 'ua', name: 'Ukraine', pop: 44000000 },
 { code: 'dz', name: 'Algeria', pop: 44000000 },
 { code: 'sd', name: 'Sudan', pop: 44000000 },
 { code: 'iq', name: 'Iraq', pop: 40000000 },
 { code: 'pl', name: 'Poland', pop: 38000000 },
 { code: 'ca', name: 'Canada', pop: 38000000 },
 { code: 'ma', name: 'Morocco', pop: 37000000 },
 { code: 'pe', name: 'Peru', pop: 33000000 },
 { code: 'ao', name: 'Angola', pop: 33000000 },
 { code: 'gh', name: 'Ghana', pop: 32000000 },
 { code: 'mz', name: 'Mozambique', pop: 32000000 },
 { code: 'ye', name: 'Yemen', pop: 30000000 },
 { code: 'np', name: 'Nepal', pop: 29000000 },
 { code: 've', name: 'Venezuela', pop: 28000000 },
 { code: 'au', name: 'Australia', pop: 26000000 },
 { code: 'cm', name: 'Cameroon', pop: 27000000 },
 { code: 'nl', name: 'Netherlands', pop: 17000000 },
 { code: 'cl', name: 'Chile', pop: 19000000 },
 { code: 'ro', name: 'Romania', pop: 19000000 },
 { code: 'ec', name: 'Ecuador', pop: 18000000 },
 { code: 'kz', name: 'Kazakhstan', pop: 19000000 },
 { code: 'gt', name: 'Guatemala', pop: 17000000 },
 { code: 'zm', name: 'Zambia', pop: 18000000 },
 { code: 'sy', name: 'Syria', pop: 17000000 },
 { code: 'se', name: 'Sweden', pop: 10000000 },
 { code: 'be', name: 'Belgium', pop: 11000000 },
 { code: 'pt', name: 'Portugal', pop: 10000000 },
 { code: 'gr', name: 'Greece', pop: 10000000 },
 { code: 'cz', name: 'Czech Republic', pop: 10000000 },
 { code: 'il', name: 'Israel', pop: 9000000 },
 { code: 'ch', name: 'Switzerland', pop: 8600000 },
 { code: 'at', name: 'Austria', pop: 9000000 },
 { code: 'sa', name: 'Saudi Arabia', pop: 35000000 },
 { code: 'ae', name: 'UAE', pop: 10000000 },
 { code: 'no', name: 'Norway', pop: 5400000 },
 { code: 'dk', name: 'Denmark', pop: 5900000 },
 { code: 'fi', name: 'Finland', pop: 5500000 },
 { code: 'sg', name: 'Singapore', pop: 5900000 },
 { code: 'nz', name: 'New Zealand', pop: 5000000 },
 { code: 'ie', name: 'Ireland', pop: 5000000 },
 { code: 'cr', name: 'Costa Rica', pop: 5100000 },
 { code: 'pa', name: 'Panama', pop: 4300000 },
 { code: 'hr', name: 'Croatia', pop: 4000000 },
 { code: 'bo', name: 'Bolivia', pop: 12000000 },
 { code: 'hn', name: 'Honduras', pop: 10000000 },
 { code: 'py', name: 'Paraguay', pop: 7200000 },
 { code: 'jo', name: 'Jordan', pop: 10000000 },
 { code: 'lk', name: 'Sri Lanka', pop: 22000000 },
]

function shuffle<T>(arr: T[]): T[] {
 return [...arr].sort(() => Math.random() - 0.5)
}

function formatPop(n: number): string {
 if (n >= 1000000000) return `${(n/1000000000).toFixed(1)}B`
 if (n >= 1000000) return `${(n/1000000).toFixed(0)}M`
 return `${(n/1000).toFixed(0)}K`
}

type Phase = 'rules' | 'playing' | 'result'

export default function HolPopPage() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [score, setScore] = useState(0)
 const [top, setTop] = useState<typeof COUNTRIES[0] | null>(null)
 const [bottom, setBottom] = useState<typeof COUNTRIES[0] | null>(null)
 const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
 const [showPop, setShowPop] = useState(false)
 const [worldRecord, setWorldRecord] = useState<{score:number,name:string}|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<{name:string,score:number}[]>([])
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [name, setName] = useState('')
 const [pin, setPin] = useState(['','','',''])
 const [saved, setSaved] = useState(false)
 const [saving, setSaving] = useState(false)
 const [saveError, setSaveError] = useState('')
 const usedRef = useState<Set<string>>(() => new Set())[0]

 useEffect(() => {
   if (profile?.name) setName(profile.name)
   loadData()
 }, [profile?.name])

 const loadData = async () => {
   const { data } = await supabase.from('higher_lower_scores').select('player_name,score').eq('category','population').order('score', { ascending: false }).limit(500)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.score > best[s.player_name]) best[s.player_name] = s.score })
   const sorted = Object.entries(best).map(([n,s]) => ({name:n, score:s as number})).sort((a,b) => b.score-a.score)
   setTop5(sorted.slice(0,5))
   if (sorted[0]) setWorldRecord({score:sorted[0].score, name:sorted[0].name})
   if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
 }

 const nextRound = useCallback((currentTop: typeof COUNTRIES[0]) => {
   const available = COUNTRIES.filter(c => !usedRef.has(c.code) && c.code !== currentTop.code)
   if (available.length === 0) { usedRef.clear() }
   const pool = available.length > 0 ? available : COUNTRIES.filter(c => c.code !== currentTop.code)
   const next = shuffle(pool)[0]
   usedRef.add(next.code)
   setTop(currentTop)
   setBottom(next)
   setFeedback(null)
   setShowPop(false)
 }, [usedRef])

 const startGame = () => {
   usedRef.clear()
   setScore(0)
   setFeedback(null)
   setShowPop(false)
   const shuffled = shuffle(COUNTRIES)
   usedRef.add(shuffled[0].code)
   usedRef.add(shuffled[1].code)
   setTop(shuffled[0])
   setBottom(shuffled[1])
   setPhase('playing')
 }

 const handleAnswer = useCallback(async (higher: boolean) => {
   if (feedback || !top || !bottom) return
   const bottomIsHigher = bottom.pop > top.pop
   const correct = higher === bottomIsHigher
   setShowPop(true)
   setFeedback(correct ? 'correct' : 'wrong')

   if (correct) {
     const newScore = score + 1
     setScore(newScore)
     setTimeout(() => nextRound(bottom), 1200)
   } else {
     setTimeout(async () => {
       const finalScore = score
       setPhase('result')
       if (profile?.name) {
         await supabase.from('higher_lower_scores').insert({player_name:profile.name, score:finalScore, category:'population'})
         const {count} = await supabase.from('higher_lower_scores').select('*',{count:'exact',head:true}).eq('category','population').gt('score',finalScore)
         setWorldRank((count??0)+1)
         if (myBest===null || finalScore>myBest) setMyBest(finalScore)
       }
     }, 1200)
   }
 }, [feedback, top, bottom, score, profile?.name, myBest, nextRound])

 const saveScore = async () => {
   if (!name.trim() || pin.join('').length!==4) return
   setSaving(true)
   setSaveError('')
   const pinHash = btoa(pin.join(''))
   const {data:existing} = await supabase.from('profiles').select('password_hash').eq('player_name',name.trim()).maybeSingle()
   if (existing) {
     if (existing.password_hash !== pinHash) { setSaveError('Wrong PIN for this name'); setSaving(false); return }
   } else {
     await supabase.from('profiles').insert({player_name:name.trim(), password_hash:pinHash})
   }
   await supabase.from('higher_lower_scores').insert({player_name:name.trim(), score, category:'population'})
   const {count} = await supabase.from('higher_lower_scores').select('*',{count:'exact',head:true}).eq('category','population').gt('score',score)
   setWorldRank((count??0)+1)
   setSaving(false)
   setSaved(true)
   localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
   setTimeout(() => window.location.reload(), 1500)
 }

 const reset = () => {
   setPhase('rules')
   setSaved(false)
   loadData()
 }

 const resultColor = score >= 15 ? '#00C853' : score >= 8 ? '#FF6F00' : '#D32F2F'
 const bgResult = score >= 15 ? '#0D3320' : score >= 8 ? '#2D1A00' : '#1A0000'

 if (phase === 'rules') return (
   <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
     <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
       <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/population.png" style={{ width:60, height:60, objectFit:'contain' }} />
       <div>
         <div style={{ fontSize:26, fontWeight:900, color:'#fff' }}>Higher or Lower</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Which country has more population?</div>
       </div>
     </div>
     <div style={{ display:'flex', gap:10, marginBottom:20 }}>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
         <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? worldRecord.score : '—'}</div>
         {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
       </div>
       <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
         <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
         <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? myBest : '—'}</div>
       </div>
     </div>
     <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
       <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
       {top5.map((p,i) => (
         <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
           <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
           <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
           <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.score} streak</div>
         </div>
       ))}
     </div>
     <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:TEAL, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${TEAL}80`, marginTop:'auto' }}>
       Play →
     </button>
   </main>
 )

 if (phase === 'playing') return (
   <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', overflow:'hidden' }}>
     {/* Score */}
     <div style={{ padding:'16px 24px', textAlign:'center', fontSize:13, fontWeight:900, color:GOLD }}>
       {score} correct
     </div>

     {/* Top country — fixed */}
     {top && (
       <div style={{ flex:1, background:'rgba(255,255,255,0.04)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, padding:'16px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
         <img src={`${FLAG_CDN}/${top.code}.png`} style={{ maxWidth:140, maxHeight:90, objectFit:'contain', borderRadius:6, boxShadow:'0 0 0 1px rgba(255,255,255,0.15)' }} />
         <div style={{ fontSize:18, fontWeight:900, color:'#fff' }}>{top.name}</div>
         <div style={{ fontSize:24, fontWeight:900, color:GOLD }}>{formatPop(top.pop)}</div>
       </div>
     )}

     {/* VS divider */}
     <div style={{ background:'#0A0A0A', padding:'8px', textAlign:'center', fontSize:12, fontWeight:900, color:'rgba(255,255,255,0.2)', letterSpacing:3 }}>VS</div>

     {/* Bottom country — guess */}
     {bottom && (
       <div style={{ flex:1, background: feedback === 'correct' ? 'rgba(76,175,80,0.15)' : feedback === 'wrong' ? 'rgba(211,47,47,0.15)' : 'rgba(255,255,255,0.04)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, padding:'16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
         <img src={`${FLAG_CDN}/${bottom.code}.png`} style={{ maxWidth:140, maxHeight:90, objectFit:'contain', borderRadius:6, boxShadow:'0 0 0 1px rgba(255,255,255,0.15)' }} />
         <div style={{ fontSize:18, fontWeight:900, color:'#fff' }}>{bottom.name}</div>
         {showPop ? (
           <div style={{ fontSize:24, fontWeight:900, color: feedback==='correct'?'#69F0AE':'#FF5252' }}>{formatPop(bottom.pop)}</div>
         ) : (
           <div style={{ display:'flex', gap:12 }}>
             <button onClick={() => handleAnswer(true)} style={{ padding:'14px 28px', borderRadius:14, border:'none', background:'rgba(76,175,80,0.3)', color:'#69F0AE', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Higher ↑</button>
             <button onClick={() => handleAnswer(false)} style={{ padding:'14px 28px', borderRadius:14, border:'none', background:'rgba(211,47,47,0.3)', color:'#FF5252', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Lower ↓</button>
           </div>
         )}
       </div>
     )}
   </main>
 )

 return (
   <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
     <div style={{ textAlign:'center' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Correct answers</div>
       <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2 }}>{score}</div>
       {worldRank && <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:8 }}>#{worldRank} in the world</div>}
     </div>

     {!profile?.name && !saved && (
       <div style={{ width:'100%', background:'rgba(0,0,0,0.3)', borderRadius:24, padding:'24px' }}>
         <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:4 }}>Save your score</div>
         <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:16 }}>New user? Create account. Returning? Enter your PIN.</div>
         <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.12)', color:'#fff', fontSize:15, fontWeight:800, fontFamily:'inherit', outline:'none', marginBottom:12, boxSizing:'border-box' }} />
         <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>PIN</div>
         <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:16 }}>
           {pin.map((d,i) => (
             <input key={i} id={`pin-${i}`} type="tel" maxLength={1} value={d}
               onChange={e=>{const v=e.target.value.replace(/\D/,'');const p=[...pin];p[i]=v;setPin(p);if(v&&i<3)(document.getElementById(`pin-${i+1}`) as HTMLInputElement)?.focus()}}
               style={{ width:48, height:56, textAlign:'center', fontSize:24, fontWeight:900, borderRadius:12, border:'2px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontFamily:'inherit', outline:'none' }} />
           ))}
         </div>
         {saveError && <div style={{ fontSize:12, color:'#FF5252', fontWeight:800, textAlign:'center', marginBottom:10 }}>{saveError}</div>}
         <button onClick={saveScore} disabled={!name.trim()||pin.join('').length!==4||saving} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:name.trim()&&pin.join('').length===4?GREEN:'rgba(255,255,255,0.15)', color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
           {saving?'Saving...':'Save →'}
         </button>
       </div>
     )}

     {saved && (
       <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:16, padding:'16px 20px', textAlign:'center' }}>
         <div style={{ fontSize:16, fontWeight:900, color:'#69F0AE' }}>✓ Score saved!</div>
         <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:4 }}>#{worldRank} in the world</div>
       </div>
     )}

     <div style={{ display:'flex', gap:10, width:'100%' }}>
       <button onClick={reset} style={{ flex:1, padding:'16px', borderRadius:16, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
       <button onClick={()=>{setSaved(false);startGame()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:TEAL, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${TEAL}80` }}>Play again →</button>
     </div>
   </main>
 )
}
