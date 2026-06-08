'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Section = 'vote' | 'propose' | 'top'

function getDeviceId() {
 let id = localStorage.getItem('top10word_device')
 if (!id) { id = Math.random().toString(36).slice(2) + Date.now(); localStorage.setItem('top10word_device', id) }
 return id
}

const FONTS = [
 "'Georgia', serif",
 "'Palatino Linotype', serif", 
 "'Garamond', serif",
 "var(--font-nunito), sans-serif",
 "'Helvetica Neue', sans-serif",
 "'Trebuchet MS', sans-serif",
]

const CARD_ACCENTS = [
 { bg: 'linear-gradient(160deg, #0a0a14 0%, #0d0d1a 100%)', accent: '#7B8CDE', border: 'rgba(123,140,222,0.3)' },
 { bg: 'linear-gradient(160deg, #0a1408 0%, #0d1a0a 100%)', accent: '#6DBE7B', border: 'rgba(109,190,123,0.3)' },
 { bg: 'linear-gradient(160deg, #140a08 0%, #1a0d0a 100%)', accent: '#E8856A', border: 'rgba(232,133,106,0.3)' },
 { bg: 'linear-gradient(160deg, #14100a 0%, #1a1408 100%)', accent: '#C8960C', border: 'rgba(200,150,12,0.3)' },
 { bg: 'linear-gradient(160deg, #0a0e14 0%, #0a1018 100%)', accent: '#6BAED6', border: 'rgba(107,174,214,0.3)' },
 { bg: 'linear-gradient(160deg, #12080e 0%, #180a12 100%)', accent: '#D4A0C8', border: 'rgba(212,160,200,0.3)' },
]

function getWordStyle(word: string) {
 let hash = 0
 for (let i = 0; i < word.length; i++) hash = word.charCodeAt(i) + ((hash << 5) - hash)
 const fi = Math.abs(hash) % FONTS.length
 const ci = Math.abs(hash >> 3) % CARD_ACCENTS.length
 return { font: FONTS[fi], ...CARD_ACCENTS[ci] }
}

const BLACKLIST = [
 'fuck','shit','ass','bitch','cunt','dick','cock','pussy','porn','sex',
 'penis','vagina','boobs','tits','naked','nude','whore','slut','rape',
 'kill','murder','torture','massacre','genocide','terror','bomb','stab',
 'nigger','nigga','faggot','retard','spic','chink','kike','homo','dyke',
 'hitler','stalin','nazi','fascist','kkk','jihad','isis','hamas',
 'suicide','selfharm','heroin','cocaine','meth','crack','fentanyl',
 'pedophile','incest','trafficking'
]

export default function Top10WordPage() {
 const [section, setSection] = useState<Section>('vote')
 const [currentWord, setCurrentWord] = useState<any>(null)
 const [nextWord, setNextWord] = useState<any>(null)
 const [wordStyle, setWordStyle] = useState(CARD_ACCENTS[0])
 const [wordFont, setWordFont] = useState(FONTS[0])
 const [voted, setVoted] = useState(false)
 const [swipeDir, setSwipeDir] = useState<'left'|'right'|null>(null)
 const [newWord, setNewWord] = useState('')
 const [username, setUsername] = useState('')
 const [submitted, setSubmitted] = useState(false)
 const [sharedWord, setSharedWord] = useState('')
 const [loading, setLoading] = useState(false)
 const [ranking, setRanking] = useState<any[]>([])
 const [myWords, setMyWords] = useState<any[]>([])
 const [tab, setTab] = useState<'world'|'mine'>('world')
 const [totalVotes, setTotalVotes] = useState(0)
 const [voteCount, setVoteCount] = useState(0)
 const [showProposePrompt, setShowProposePrompt] = useState(false)
 const [pool, setPool] = useState<any[]>([])

 useEffect(() => {
   const u = localStorage.getItem('top10word_username') || ''
   setUsername(u)
   initPool()
   supabase.from('words').select('total_yes, total_no').then(({ data }: any) => {
     if (data) setTotalVotes(data.reduce((acc: number, w: any) => acc + (w.total_yes || 0) + (w.total_no || 0), 0))
   })
 }, [])

 const initPool = async () => {
   const wordParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('word') : null
   const deviceId = getDeviceId()
   const { data: votedData } = await supabase.from('votes').select('word_id').eq('device_id', deviceId)
   const votedIds = votedData?.map((v: any) => v.word_id) || []
   const { data } = await supabase.from('words').select('*').limit(500)
   if (!data || data.length === 0) return
   const unvoted = data.filter((w: any) => !votedIds.includes(w.id))
   const shuffled = (unvoted.length > 0 ? unvoted : data).sort(() => Math.random() - 0.5)
   if (wordParam) {
     const forced = shuffled.find((w: any) => w.word.toLowerCase() === wordParam.toLowerCase())
     if (forced) {
       const rest = shuffled.filter((w: any) => w.id !== forced.id)
       setPool(rest)
       setCard(forced)
       if (rest.length > 0) setNextWord(rest[0])
       window.history.replaceState({}, '', '/top10word')
       return
     }
   }
   setPool(shuffled.slice(1))
   setCard(shuffled[0])
   if (shuffled.length > 1) setNextWord(shuffled[1])
 }

 const setCard = (word: any) => {
   if (!word) return
   const style = getWordStyle(word.word)
   setCurrentWord(word)
   setWordStyle({ bg: style.bg, accent: style.accent, border: style.border })
   setWordFont(style.font)
   setVoted(false)
   setSwipeDir(null)
 }

 const loadNext = () => {
   if (pool.length === 0) return
   const next = pool[0]
   const rest = pool.slice(1)
   setPool(rest)
   setCard(next)
   setNextWord(rest[0] || null)
 }

 const handleVote = async (yes: boolean) => {
   if (!currentWord || voted) return
   const deviceId = getDeviceId()
   setVoted(true)
   setSwipeDir(yes ? 'right' : 'left')
   const field = yes ? 'total_yes' : 'total_no'
   const newVal = (currentWord[field] || 0) + 1
   supabase.from('words').update({ [field]: newVal }).eq('id', currentWord.id)
   supabase.from('votes').upsert({ word_id: currentWord.id, vote: yes, device_id: deviceId })
   setTotalVotes(v => v + 1)
   const newCount = voteCount + 1
   setVoteCount(newCount)
   if (newCount === 3) setShowProposePrompt(true)
   setTimeout(loadNext, 300)
 }

 const handleSubmitWord = async () => {
   if (!newWord.trim() || !username.trim()) return
   if (BLACKLIST.some(w => newWord.toLowerCase().includes(w))) {
     alert("Really? We're better than that.")
     return
   }
   setLoading(true)
   const uname = username.trim()
   localStorage.setItem('top10word_username', uname)
   const { error } = await supabase.from('words').insert({ word: newWord.trim(), proposed_by: uname })
   setLoading(false)
   if (error?.code === '23505') {
     alert('This word is already in the ranking!')
   } else if (!error) {
     setSharedWord(newWord.trim().toUpperCase())
     setSubmitted(true)
     setNewWord('')
     import('canvas-confetti').then(m => m.default({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#C8960C','#FFD700','#fff','#2E7D32'] }))
   }
 }

 const loadRanking = async () => {
   const { data } = await supabase.from('words').select('*').gt('total_yes', 0).limit(100)
   if (data) {
     const ranked = data
       .map((w: any) => ({ ...w, pct: Math.round((w.total_yes / Math.max(w.total_yes + w.total_no, 1)) * 100) }))
       .filter((w: any) => w.total_yes + w.total_no >= 5)
       .sort((a: any, b: any) => b.pct - a.pct)
       .slice(0, 10)
     setRanking(ranked)
   }
   const uname = localStorage.getItem('top10word_username')
   if (uname) {
     const { data: mine } = await supabase.from('words').select('*').eq('proposed_by', uname)
     if (mine) setMyWords(mine.map((w: any) => ({ ...w, pct: Math.round((w.total_yes / Math.max(w.total_yes + w.total_no, 1)) * 100) })))
   }
 }

 const ws = wordStyle as any

 return (
   <div style={{ minHeight:'100dvh', background:'linear-gradient(160deg, #080810 0%, #080808 50%, #080810 100%)', fontFamily:'var(--font-nunito), sans-serif', color:'#fff', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', position:'relative' }}>

     {/* Header */}
     <div style={{ padding:'20px 24px 0', textAlign:'center' }}>
       <div style={{ fontSize:26, fontWeight:900, letterSpacing:-1 }}>
         Top<span style={{ color:'#C8960C' }}>10</span>Word.com
       </div>
       {totalVotes > 0 && (
         <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.25)', letterSpacing:2, marginTop:4 }}>
           {totalVotes.toLocaleString()} VOTES WORLDWIDE
         </div>
       )}
     </div>

     {/* Content */}
     <div style={{ flex:1, padding:'16px 24px 140px', display:'flex', flexDirection:'column' }}>

       {/* VOTE */}
       {section === 'vote' && (
         <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>

           {/* Card stack illusion */}
           {nextWord && (
             <div style={{ width:'100%', height:8, background:'rgba(255,255,255,0.03)', borderRadius:'0 0 20px 20px', marginBottom:-4, border:'1px solid rgba(255,255,255,0.05)', borderTop:'none' }} />
           )}

           {/* Main card */}
           {currentWord && (
             <div style={{
               background: ws.bg,
               borderRadius:24,
               padding:'28px 24px 24px',
               width:'100%',
               boxShadow:`0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px ${ws.border}`,
               textAlign:'center',
               border:`1px solid ${ws.border}`,
               transform: swipeDir === 'right' ? 'translateX(140%) rotate(18deg)' : swipeDir === 'left' ? 'translateX(-140%) rotate(-18deg)' : 'translateX(0) rotate(0deg)',
               opacity: swipeDir ? 0 : 1,
               transition: swipeDir ? 'transform 0.28s ease, opacity 0.2s ease' : 'none',
               marginBottom:24,
             }}>
               <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, color:'rgba(255,255,255,0.2)', marginBottom:20, textTransform:'uppercase' }}>
                 Top<span style={{ color: ws.accent }}>10</span>Word
               </div>
               <div style={{ fontSize: currentWord.word.length > 11 ? 32 : currentWord.word.length > 7 ? 44 : 64, fontWeight:900, color:'#ffffff', letterSpacing:-1, lineHeight:1, marginBottom:20, textTransform:'uppercase', fontFamily: wordFont, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', textShadow:'0 2px 20px rgba(255,255,255,0.1)' }}>
                 {currentWord.word}
               </div>
               <div style={{ display:'flex', justifyContent:'center', gap:20, paddingTop:16, borderTop:`1px solid ${ws.border}` }}>
                 <div style={{ textAlign:'center' }}>
                   <div style={{ fontSize:15, fontWeight:900, color: ws.accent }}>{currentWord.total_yes || 0}</div>
                   <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.2)', letterSpacing:2 }}>LOVED</div>
                 </div>
                 <div style={{ width:1, background:'rgba(255,255,255,0.06)' }} />
                 <div style={{ textAlign:'center' }}>
                   <div style={{ fontSize:15, fontWeight:900, color:'rgba(255,255,255,0.4)' }}>{currentWord.total_no || 0}</div>
                   <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.2)', letterSpacing:2 }}>PASSED</div>
                 </div>
                 <div style={{ width:1, background:'rgba(255,255,255,0.06)' }} />
                 <div style={{ textAlign:'center' }}>
                   <div style={{ fontSize:15, fontWeight:900, color:'rgba(255,255,255,0.4)' }}>{(currentWord.total_yes||0)+(currentWord.total_no||0)}</div>
                   <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.2)', letterSpacing:2 }}>TOTAL</div>
                 </div>
               </div>
             </div>
           )}

           {/* Vote buttons */}
           <div style={{ display:'flex', gap:12, width:'100%' }}>
             <button onClick={() => handleVote(false)} disabled={voted}
               style={{ flex:1, padding:'18px', borderRadius:18, border:`1px solid rgba(220,50,50,0.3)`, background:'rgba(220,50,50,0.1)', color:'#FF5252', fontSize:28, fontFamily:'inherit', cursor:'pointer', backdropFilter:'blur(10px)', transition:'all 0.15s' }}>
               ✕
             </button>
             <button onClick={() => handleVote(true)} disabled={voted}
               style={{ flex:1, padding:'18px', borderRadius:18, border:`1px solid rgba(50,200,100,0.3)`, background:'rgba(50,200,100,0.1)', color:'#69F0AE', fontSize:28, fontFamily:'inherit', cursor:'pointer', backdropFilter:'blur(10px)', transition:'all 0.15s' }}>
               ✓
             </button>
           </div>
         </div>
       )}

       {/* PROPOSE */}
       {section === 'propose' && (
         <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', flex:1 }}>
           {!submitted ? (
             <>
               <div style={{ textAlign:'center', marginBottom:32 }}>
                 <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase' }}>Propose a word to the world</div>
               </div>
               <input value={newWord} onChange={e => setNewWord(e.target.value.slice(0,24))} placeholder="YOUR WORD"
                 maxLength={24}
                 style={{ width:'100%', padding:'22px', borderRadius:16, border: newWord.trim() ? '1px solid rgba(200,150,12,0.5)' : '1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', color:'#fff', fontSize:26, fontWeight:900, fontFamily:'Georgia, serif', outline:'none', boxSizing:'border-box', textAlign:'center', textTransform:'uppercase', letterSpacing:2, marginBottom:12, transition:'border 0.2s' }} />
               <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Your name"
                 style={{ width:'100%', padding:'16px', borderRadius:14, border: username.trim() ? '1px solid rgba(200,150,12,0.3)' : '1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.7)', fontSize:15, fontWeight:700, fontFamily:'inherit', outline:'none', boxSizing:'border-box', textAlign:'center', marginBottom:20, transition:'border 0.2s' }} />
               <button onClick={handleSubmitWord} disabled={!newWord.trim() || !username.trim() || loading}
                 style={{ width:'100%', padding:'18px', borderRadius:16, border:'none', background: newWord.trim() && username.trim() ? 'linear-gradient(135deg, #C8960C, #FFD700)' : 'rgba(255,255,255,0.05)', color: newWord.trim() && username.trim() ? '#000' : 'rgba(255,255,255,0.15)', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor: newWord.trim() && username.trim() ? 'pointer' : 'not-allowed', letterSpacing:2, transition:'all 0.2s' }}>
                 {loading ? 'RELEASING...' : 'RELEASE IT TO THE WORLD →'}
               </button>
             </>
           ) : (
             <div style={{ textAlign:'center' }}>
               <div style={{ fontSize:52, marginBottom:16 }}>🌍</div>
               <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Your word is live</div>
               <div style={{ fontSize:36, fontWeight:900, color:'#FFD700', fontFamily:'Georgia, serif', marginBottom:24 }}>{sharedWord}</div>
               <button onClick={() => {
                 const url = `https://top10word.com?word=${encodeURIComponent(sharedWord)}`
                 const txt = `I proposed the word ${sharedWord}. Vote if you love it!`
                 if (navigator.share) navigator.share({ text: txt, url })
                 else navigator.clipboard.writeText(txt + '\n' + url)
               }}
                 style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:'linear-gradient(135deg, #C8960C, #FFD700)', color:'#000', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:10 }}>
                 Share my word →
               </button>
               <button onClick={() => { setSubmitted(false); setSection('vote') }}
                 style={{ width:'100%', padding:'14px', borderRadius:14, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.4)', fontSize:14, fontWeight:800, fontFamily:'inherit', cursor:'pointer' }}>
                 Keep Voting
               </button>
             </div>
           )}
         </div>
       )}

       {/* TOP 10 */}
       {section === 'top' && (
         <div style={{ paddingTop:8 }}>
           <div style={{ display:'flex', gap:8, marginBottom:20 }}>
             {(['world','mine'] as const).map(t => (
               <button key={t} onClick={() => setTab(t)}
                 style={{ flex:1, padding:'10px', borderRadius:10, border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.08)', background: tab === t ? 'rgba(200,150,12,0.15)' : 'transparent', color: tab === t ? '#C8960C' : 'rgba(255,255,255,0.3)', fontSize:12, fontWeight:900, fontFamily:'inherit', cursor:'pointer', letterSpacing:2, textTransform:'uppercase' }}>
                 {t === 'world' ? '🌍 World' : '👤 My Words'}
               </button>
             ))}
           </div>
           {tab === 'world' && ranking.map((w, i) => {
             const s = getWordStyle(w.word)
             return (
               <div key={w.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                 <div style={{ fontSize:12, fontWeight:900, color: i===0 ? '#FFD700' : i===1 ? '#C0C0C0' : i===2 ? '#CD7F32' : 'rgba(255,255,255,0.2)', width:24, textAlign:'center' }}>#{i+1}</div>
                 <div style={{ flex:1 }}>
                   <div style={{ fontSize:17, fontWeight:900, textTransform:'uppercase', fontFamily: s.font, letterSpacing:0.5, marginBottom:6 }}>{w.word}</div>
                   <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:4, height:4, overflow:'hidden' }}>
                     <div style={{ height:'100%', borderRadius:4, background:`linear-gradient(90deg, ${s.accent}, ${s.accent}88)`, width:`${w.pct}%`, transition:'width 1s ease' }} />
                   </div>
                 </div>
                 <div style={{ fontSize:20, fontWeight:900, color: s.accent, minWidth:48, textAlign:'right' }}>{w.pct}%</div>
               </div>
             )
           })}
           {tab === 'mine' && (
             myWords.length > 0 ? myWords.map((w) => {
               const s = getWordStyle(w.word)
               return (
                 <div key={w.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                   <div style={{ flex:1 }}>
                     <div style={{ fontSize:17, fontWeight:900, textTransform:'uppercase', fontFamily: s.font, letterSpacing:0.5, marginBottom:6 }}>{w.word}</div>
                     <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:4, height:4, overflow:'hidden' }}>
                       <div style={{ height:'100%', borderRadius:4, background:`linear-gradient(90deg, ${s.accent}, ${s.accent}88)`, width:`${w.pct}%`, transition:'width 1s ease' }} />
                     </div>
                   </div>
                   <div style={{ fontSize:20, fontWeight:900, color: s.accent }}>{w.pct}%</div>
                 </div>
               )
             }) : (
               <div style={{ textAlign:'center', padding:'48px 0', color:'rgba(255,255,255,0.2)', fontSize:14 }}>
                 Propose a word with your name to track it here.
               </div>
             )
           )}
         </div>
       )}
     </div>

     {/* Propose prompt popup */}
     {showProposePrompt && (
       <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
         <div style={{ background:'linear-gradient(160deg, #0d0d14, #0a0a10)', borderRadius:24, padding:'28px 24px', width:'100%', maxWidth:360, border:'1px solid rgba(200,150,12,0.2)', textAlign:'center' }}>
           <div style={{ fontSize:36, marginBottom:12 }}>💬</div>
           <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:8 }}>Add your word</div>
           <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>Propose a word and share it with the world. See if people love it.</div>
           <button onClick={() => { setShowProposePrompt(false); setSection('propose') }}
             style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:'linear-gradient(135deg, #C8960C, #FFD700)', color:'#000', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:10 }}>
             Propose a word →
           </button>
           <button onClick={() => setShowProposePrompt(false)}
             style={{ width:'100%', padding:'14px', borderRadius:14, border:'1px solid rgba(255,255,255,0.08)', background:'transparent', color:'rgba(255,255,255,0.3)', fontSize:13, fontWeight:800, fontFamily:'inherit', cursor:'pointer' }}>
             Keep voting
           </button>
         </div>
       </div>
     )}

     {/* Bottom Nav */}
     <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', display:'flex', gap:8, background:'rgba(10,10,10,0.9)', backdropFilter:'blur(20px)', borderRadius:20, padding:'8px', border:'1px solid rgba(255,255,255,0.06)', zIndex:100 }}>
       {[
         { id:'vote', icon:'◈', label:'VOTE' },
         { id:'propose', icon:'✦', label:'PROPOSE' },
         { id:'top', icon:'▲', label:'TOP 10' },
       ].map(n => (
         <button key={n.id} onClick={() => { setSection(n.id as Section); if (n.id === 'top') loadRanking() }}
           style={{ padding:'10px 20px', borderRadius:14, border:'none', background: section === n.id ? (n as any).activeBg : 'transparent', color: section === n.id ? (n as any).activeColor : 'rgba(255,255,255,0.25)', fontSize:11, fontWeight:900, fontFamily:'inherit', cursor:'pointer', letterSpacing:2, transition:'all 0.2s', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
           <span style={{ fontSize:16 }}>{n.icon}</span>
           <span>{n.label}</span>
         </button>
       ))}
     </div>

   </div>
 )
}
