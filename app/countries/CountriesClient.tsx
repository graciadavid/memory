'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const TEAL = '#00796B'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const COUNTRIES = [
 { code: 'fr', name: 'France' }, { code: 'de', name: 'Germany' },
 { code: 'es', name: 'Spain' }, { code: 'it', name: 'Italy' },
 { code: 'pt', name: 'Portugal' }, { code: 'gb', name: 'United Kingdom' },
 { code: 'us', name: 'United States' }, { code: 'ca', name: 'Canada' },
 { code: 'mx', name: 'Mexico' }, { code: 'br', name: 'Brazil' },
 { code: 'ar', name: 'Argentina' }, { code: 'cl', name: 'Chile' },
 { code: 'co', name: 'Colombia' }, { code: 'pe', name: 'Peru' },
 { code: 'jp', name: 'Japan' }, { code: 'cn', name: 'China' },
 { code: 'kr', name: 'South Korea' }, { code: 'in', name: 'India' },
 { code: 'au', name: 'Australia' }, { code: 'nz', name: 'New Zealand' },
 { code: 'za', name: 'South Africa' }, { code: 'ng', name: 'Nigeria' },
 { code: 'eg', name: 'Egypt' }, { code: 'ma', name: 'Morocco' },
 { code: 'ke', name: 'Kenya' }, { code: 'se', name: 'Sweden' },
 { code: 'no', name: 'Norway' }, { code: 'dk', name: 'Denmark' },
 { code: 'fi', name: 'Finland' }, { code: 'nl', name: 'Netherlands' },
 { code: 'be', name: 'Belgium' }, { code: 'ch', name: 'Switzerland' },
 { code: 'at', name: 'Austria' }, { code: 'pl', name: 'Poland' },
 { code: 'gr', name: 'Greece' }, { code: 'tr', name: 'Turkey' },
 { code: 'ru', name: 'Russia' }, { code: 'ua', name: 'Ukraine' },
 { code: 'th', name: 'Thailand' }, { code: 'vn', name: 'Vietnam' },
 { code: 'id', name: 'Indonesia' }, { code: 'ph', name: 'Philippines' },
 { code: 'my', name: 'Malaysia' }, { code: 'pk', name: 'Pakistan' },
 { code: 'bd', name: 'Bangladesh' }, { code: 'ir', name: 'Iran' },
 { code: 'sa', name: 'Saudi Arabia' }, { code: 'ae', name: 'UAE' },
 { code: 'il', name: 'Israel' }, { code: 'iq', name: 'Iraq' },
 { code: 'mm', name: 'Myanmar' }, { code: 'af', name: 'Afghanistan' },
 { code: 'kz', name: 'Kazakhstan' }, { code: 'mn', name: 'Mongolia' },
 { code: 'np', name: 'Nepal' }, { code: 'lk', name: 'Sri Lanka' },
 { code: 'sd', name: 'Sudan' }, { code: 'et', name: 'Ethiopia' },
 { code: 'cd', name: 'DR Congo' }, { code: 'ao', name: 'Angola' },
 { code: 'mz', name: 'Mozambique' }, { code: 'mg', name: 'Madagascar' },
 { code: 'cm', name: 'Cameroon' }, { code: 'gh', name: 'Ghana' },
 { code: 'tz', name: 'Tanzania' }, { code: 'ug', name: 'Uganda' },
 { code: 've', name: 'Venezuela' }, { code: 'ec', name: 'Ecuador' },
 { code: 'bo', name: 'Bolivia' }, { code: 'py', name: 'Paraguay' },
 { code: 'uy', name: 'Uruguay' }, { code: 'ro', name: 'Romania' },
 { code: 'hu', name: 'Hungary' }, { code: 'cz', name: 'Czech Republic' },
]

function shuffle<T>(arr: T[]): T[] {
 return [...arr].sort(() => Math.random() - 0.5)
}

type Phase = 'rules' | 'playing' | 'result'

export default function CountriesPage() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [score, setScore] = useState(0)
 const [question, setQuestion] = useState<typeof COUNTRIES[0] | null>(null)
 const [options, setOptions] = useState<string[]>([])
 const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
 const [lastAnswer, setLastAnswer] = useState('')
 const [imgLoaded, setImgLoaded] = useState(false)
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
   const { data } = await supabase.from('shape_scores').select('player_name,level').order('level', { ascending: false }).limit(500)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
   const sorted = Object.entries(best).map(([n,l]) => ({name:n, score:l as number})).sort((a,b) => b.score-a.score)
   setTop5(sorted.slice(0,5))
   if (sorted[0]) setWorldRecord({score:sorted[0].score, name:sorted[0].name})
   if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
 }

 const nextQuestion = useCallback(() => {
   setFeedback(null)
   setImgLoaded(false)
   const available = COUNTRIES.filter(c => !usedRef.has(c.code))
   const pool = available.length >= 4 ? available : COUNTRIES
   const shuffled = shuffle(pool)
   const correct = shuffled[0]
   usedRef.add(correct.code)
   const wrong = shuffle(COUNTRIES.filter(c => c.code !== correct.code)).slice(0, 3).map(c => c.name)
   setQuestion(correct)
   setOptions(shuffle([correct.name, ...wrong]))
 }, [usedRef])

 const startGame = () => {
   usedRef.clear()
   setScore(0)
   setPhase('playing')
   setTimeout(() => nextQuestion(), 50)
 }

 const handleAnswer = useCallback((answer: string) => {
   if (feedback || !question) return
   setLastAnswer(answer)
   const correct = answer === question.name
   setFeedback(correct ? 'correct' : 'wrong')
   if (correct) {
     setScore(s => s + 1)
     setTimeout(() => nextQuestion(), 700)
   } else {
     setTimeout(async () => {
       const finalScore = score
       setPhase('result')
       if (profile?.name) {
         await supabase.from('shape_scores').insert({player_name:profile.name, level:finalScore})
         const {count} = await supabase.from('shape_scores').select('*',{count:'exact',head:true}).gt('level',finalScore)
         setWorldRank((count??0)+1)
         if (myBest===null || finalScore>myBest) setMyBest(finalScore)
       }
     }, 1000)
   }
 }, [feedback, question, score, profile?.name, myBest, nextQuestion])

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
   await supabase.from('shape_scores').insert({player_name:name.trim(), level:score})
   const {count} = await supabase.from('shape_scores').select('*',{count:'exact',head:true}).gt('level',score)
   setWorldRank((count??0)+1)
   setSaving(false)
   setSaved(true)
   localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
   setTimeout(() => window.location.reload(), 1500)
 }

 const reset = () => { setPhase('rules'); setSaved(false); loadData() }

 const resultColor = score >= 15 ? '#00C853' : score >= 8 ? '#FF6F00' : '#D32F2F'
 const bgResult = score >= 15 ? '#0D3320' : score >= 8 ? '#2D1A00' : '#1A0000'

 if (phase === 'rules') return (
   <main style={{ minHeight:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
     <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
       <img src={`${BASE}/mapamundi.png`} style={{ width:60, height:60, objectFit:'contain' }} />
       <div>
         <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Countries</div>
         <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Identify countries by shape</div>
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
           <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.score} correct</div>
         </div>
       ))}
     </div>
     <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:TEAL, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${TEAL}80`, marginTop:'auto' }}>
       Play →
     </button>
   </main>
 )

 if (phase === 'playing') return (
   <main style={{ minHeight:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 20px 100px', overflowY:'auto' }}>
     <div style={{ fontSize:13, fontWeight:900, color:GOLD, marginBottom:20, textAlign:'center' }}>{score} correct</div>
     {question && (
       <>
         <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:20, padding:'20px', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'center', minHeight:200 }}>
           {!imgLoaded && <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>Loading...</div>}
           <img
             key={question.code}
             src={`https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${question.code.toLowerCase()}/512.png`}
             alt=""
             onLoad={() => setImgLoaded(true)}
             onError={() => setImgLoaded(true)}
             style={{ maxWidth:'100%', maxHeight:180, objectFit:'contain', display:imgLoaded?'block':'none', filter:'brightness(0) invert(1)' }}
           />
         </div>
         <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
           {options.map(opt => {
             let bg = 'rgba(255,255,255,0.06)'
             let color = '#fff'
             if (feedback) {
               if (opt === question.name) { bg = 'rgba(76,175,80,0.3)'; color = '#69F0AE' }
               else if (opt === lastAnswer && feedback === 'wrong') { bg = 'rgba(211,47,47,0.3)'; color = '#FF5252' }
             }
             return (
               <button key={opt} onClick={() => handleAnswer(opt)} style={{ width:'100%', padding:'16px', borderRadius:16, border:`1px solid ${feedback && opt===question.name ? 'rgba(76,175,80,0.5)' : 'rgba(255,255,255,0.08)'}`, background:bg, color, fontSize:15, fontWeight:800, fontFamily:'inherit', cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}>
                 {opt}
               </button>
             )
           })}
         </div>
       </>
     )}
   </main>
 )

 return (
   <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
     <div style={{ textAlign:'center' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Countries in a row</div>
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
       </div>
     )}
     <div style={{ display:'flex', gap:10, width:'100%' }}>
       <button onClick={reset} style={{ flex:1, padding:'16px', borderRadius:16, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
       <button onClick={()=>{setSaved(false);startGame()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:TEAL, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${TEAL}80` }}>Play again →</button>
     </div>
   </main>
 )
}
