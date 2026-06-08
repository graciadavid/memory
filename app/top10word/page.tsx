'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Section = 'vote' | 'propose' | 'top'

function getDeviceId() {
 let id = localStorage.getItem('top10word_device')
 if (!id) { id = Math.random().toString(36).slice(2) + Date.now(); localStorage.setItem('top10word_device', id) }
 return id
}

const WORD_THEMES = [
 { bg: 'linear-gradient(160deg, #1a1008 0%, #241808 100%)', accent: '#E8A83A', text: '#FFF8E7' },
 { bg: 'linear-gradient(160deg, #08101a 0%, #081824 100%)', accent: '#4A9EE8', text: '#E8F4FF' },
 { bg: 'linear-gradient(160deg, #0a1008 0%, #0e1a0a 100%)', accent: '#5DBE7A', text: '#EDFFF2' },
 { bg: 'linear-gradient(160deg, #14080e 0%, #1e0c14 100%)', accent: '#D47AB0', text: '#FFF0F8' },
 { bg: 'linear-gradient(160deg, #0e0e14 0%, #121220 100%)', accent: '#8B7ED8', text: '#F0EEFF' },
 { bg: 'linear-gradient(160deg, #100e08 0%, #181408 100%)', accent: '#C8960C', text: '#FFFAE8' },
 { bg: 'linear-gradient(160deg, #08140e 0%, #0c1e14 100%)', accent: '#3DC4B4', text: '#E8FFFC' },
 { bg: 'linear-gradient(160deg, #140808 0%, #200c0c 100%)', accent: '#E87A5D', text: '#FFF2EE' },
]

const FONTS = [
 "'Georgia', serif",
 "'Palatino Linotype', 'Book Antiqua', serif",
 "var(--font-nunito), sans-serif",
 "'Helvetica Neue', Arial, sans-serif",
 "'Trebuchet MS', sans-serif",
 "'Garamond', 'EB Garamond', serif",
]

function getTheme(word: string) {
 let hash = 0
 for (let i = 0; i < word.length; i++) hash = word.charCodeAt(i) + ((hash << 5) - hash)
 return {
   theme: WORD_THEMES[Math.abs(hash) % WORD_THEMES.length],
   font: FONTS[Math.abs(hash >> 2) % FONTS.length],
 }
}

const BLACKLIST = ['fuck','shit','bitch','cunt','dick','cock','pussy','porn','rape','kill','murder','nigger','nigga','faggot','retard','hitler','nazi','jihad','isis','suicide','cocaine','heroin','pedophile']

export default function Top10WordPage() {
 const [section, setSection] = useState<Section>('vote')
 const [currentWord, setCurrentWord] = useState<any>(null)
 const [theme, setTheme] = useState(WORD_THEMES[0])
 const [font, setFont] = useState(FONTS[0])
 const [pool, setPool] = useState<any[]>([])
 const [voted, setVoted] = useState(false)
 const [swipeDir, setSwipeDir] = useState<'left'|'right'|null>(null)
 const [newWord, setNewWord] = useState('')
 const [username, setUsername] = useState('')
 const [proposeStep, setProposeStep] = useState<'input'|'share'>('input')
 const [sharedWord, setSharedWord] = useState('')
 const [loading, setLoading] = useState(false)
 const [ranking, setRanking] = useState<any[]>([])
 const [myWords, setMyWords] = useState<any[]>([])
 const [tab, setTab] = useState<'world'|'mine'>('world')
 const [voteCount, setVoteCount] = useState(0)
 const [showProposePrompt, setShowProposePrompt] = useState(false)
 const [totalVotes, setTotalVotes] = useState(0)

 useEffect(() => {
   setUsername(localStorage.getItem('top10word_username') || '')
   initPool()
   supabase.from('words').select('total_yes, total_no').then(({ data }: any) => {
     if (data) setTotalVotes(data.reduce((a: number, w: any) => a + w.total_yes + w.total_no, 0))
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
   const shuffled = (unvoted.length > 5 ? unvoted : data).sort(() => Math.random() - 0.5)
   if (wordParam) {
     const forced = data.find((w: any) => w.word.toLowerCase() === wordParam.toLowerCase())
     if (forced) {
       const rest = shuffled.filter((w: any) => w.id !== forced.id)
       setPool(rest)
       applyCard(forced)
       if (typeof window !== 'undefined') window.history.replaceState({}, '', '/top10word')
       return
     }
   }
   setPool(shuffled.slice(1))
   applyCard(shuffled[0])
 }

 const applyCard = (word: any) => {
   if (!word) return
   const { theme: t, font: f } = getTheme(word.word)
   setCurrentWord(word)
   setTheme(t)
   setFont(f)
   setVoted(false)
   setSwipeDir(null)
 }

 const nextCard = () => {
   if (pool.length === 0) return
   setPool(prev => { applyCard(prev[0]); return prev.slice(1) })
 }

 const handleVote = async (yes: boolean) => {
   if (!currentWord || voted) return
   const deviceId = getDeviceId()
   setVoted(true)
   setSwipeDir(yes ? 'right' : 'left')
   supabase.from('words').update({ [yes ? 'total_yes' : 'total_no']: (currentWord[yes ? 'total_yes' : 'total_no'] || 0) + 1 }).eq('id', currentWord.id)
   let country = ''
   try {
     country = localStorage.getItem('top10word_country') || ''
     if (!country) {
       const d = await (await fetch('https://ipapi.co/json/')).json()
       country = d.country_code || ''
       if (country) localStorage.setItem('top10word_country', country)
     }
   } catch {}
   supabase.from('votes').upsert({ word_id: currentWord.id, vote: yes, device_id: deviceId, country })
   setTotalVotes(v => v + 1)
   const nc = voteCount + 1
   setVoteCount(nc)
   if (nc === 3) setShowProposePrompt(true)
   setTimeout(nextCard, 320)
 }

 const handleSubmit = async () => {
   if (!newWord.trim() || !username.trim()) return
   if (BLACKLIST.some(w => newWord.toLowerCase().includes(w))) { alert("Really? We're better than that."); return }
   setLoading(true)
   const uname = username.trim()
   localStorage.setItem('top10word_username', uname)
   const { error } = await supabase.from('words').insert({ word: newWord.trim(), proposed_by: uname })
   setLoading(false)
   if (error?.code === '23505') { alert('This word is already in the ranking!') }
   else if (!error) {
     setSharedWord(newWord.trim())
     setProposeStep('share')
     setNewWord('')
     import('canvas-confetti').then(m => m.default({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors: ['#C8960C','#FFD700','#fff','#E8A83A'] }))
   }
 }

 const loadRanking = async () => {
   const { data } = await supabase.from('words').select('*').gt('total_yes', 0).limit(200)
   if (data) {
     const ranked = data
       .map((w: any) => ({ ...w, pct: Math.round((w.total_yes / Math.max(w.total_yes + w.total_no, 1)) * 1000) / 10 }))
       .filter((w: any) => w.total_yes + w.total_no >= 5)
       .sort((a: any, b: any) => b.pct - a.pct)
       .slice(0, 10)
     setRanking(ranked)
   }
   const uname = localStorage.getItem('top10word_username')
   if (uname) {
     const { data: mine } = await supabase.from('words').select('*').eq('proposed_by', uname)
     if (mine) setMyWords(mine.map((w: any) => ({ ...w, pct: Math.round((w.total_yes / Math.max(w.total_yes + w.total_no, 1)) * 1000) / 10 })).sort((a: any, b: any) => b.pct - a.pct))
   }
 }

 const lovePct = currentWord ? Math.round((currentWord.total_yes / Math.max(currentWord.total_yes + currentWord.total_no, 1)) * 100) : 0

 return (
   <div style={{ minHeight:'100dvh', background: section === 'vote' && currentWord ? theme.bg : '#1C1714', fontFamily:'var(--font-nunito), sans-serif', color:'#fff', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', transition:'background 0.6s ease', position:'relative', overflow:'hidden' }}>

     {/* VOTE SECTION */}
     {section === 'vote' && (
       <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:'100dvh' }}>

         {/* Header */}
         <div style={{ padding:'32px 24px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
           <div style={{ fontSize:13, fontWeight:900, letterSpacing:1, color: theme.accent, opacity:0.8 }}>
             Top<span style={{ opacity:1 }}>10</span>Word
           </div>
           <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.2)', letterSpacing:2 }}>
             {totalVotes.toLocaleString()} VOTES
           </div>
         </div>

         {/* Claim */}
         <div style={{ padding:'24px 24px 0', textAlign:'center' }}>
           <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:1, lineHeight:1.5 }}>
             Which is the world's most<br/>beautiful word?
           </div>
         </div>

         {/* Word - center of screen */}
         <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 32px' }}>
           {currentWord && (
             <div style={{
               textAlign:'center',
               transform: swipeDir === 'right' ? 'translateX(150%) rotate(15deg)' : swipeDir === 'left' ? 'translateX(-150%) rotate(-15deg)' : 'translateX(0)',
               opacity: swipeDir ? 0 : 1,
               transition: swipeDir ? 'transform 0.3s ease, opacity 0.25s ease' : 'none',
             }}>
               <div style={{
                 fontSize: currentWord.word.length > 12 ? 36 : currentWord.word.length > 8 ? 52 : currentWord.word.length > 5 ? 72 : 88,
                 fontWeight: 900,
                 fontFamily: font,
                 color: theme.text,
                 letterSpacing: -2,
                 lineHeight: 1,
                 marginBottom: 24,
                 textTransform: 'uppercase',
                 textShadow: `0 0 60px ${theme.accent}33`,
               }}>
                 {currentWord.word}
               </div>

               {/* Love bar */}
               <div style={{ width: 200, margin: '0 auto 8px' }}>
                 <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:4, height:3, overflow:'hidden' }}>
                   <div style={{ height:'100%', borderRadius:4, background: theme.accent, width:`${lovePct}%`, transition:'width 0.8s ease' }} />
                 </div>
               </div>
               <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.25)', letterSpacing:2 }}>
                 {lovePct}% LOVE THIS
               </div>
             </div>
           )}
         </div>

         {/* Vote buttons */}
         <div style={{ padding:'0 24px 120px', display:'flex', gap:16 }}>
           <button onClick={() => handleVote(false)} disabled={voted}
             style={{ flex:1, padding:'20px', borderRadius:20, border:'1px solid rgba(255,80,80,0.2)', background:'rgba(255,80,80,0.06)', color:'rgba(255,100,100,0.7)', fontSize:24, fontFamily:'inherit', cursor:'pointer', transition:'all 0.15s', backdropFilter:'blur(10px)' }}>
             ✕
           </button>
           <button onClick={() => handleVote(true)} disabled={voted}
             style={{ flex:2, padding:'20px', borderRadius:20, border:`1px solid ${theme.accent}44`, background:`${theme.accent}12`, color: theme.accent, fontSize:22, fontFamily:'inherit', cursor:'pointer', fontWeight:900, letterSpacing:1, transition:'all 0.15s', backdropFilter:'blur(10px)' }}>
             LOVE IT ✓
           </button>
         </div>
       </div>
     )}

     {/* PROPOSE SECTION */}
     {section === 'propose' && (
       <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:'100dvh', padding:'48px 28px 120px' }}>
         {proposeStep === 'input' ? (
           <>
             <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
               <div style={{ marginBottom:48, textAlign:'center' }}>
                 <div style={{ fontSize:32, fontWeight:900, letterSpacing:-1, color:'#fff', marginBottom:8 }}>
                   Leave your word<br/>in the world.
                 </div>
                 <div style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.3)', lineHeight:1.6 }}>
                   One word. Millions of votes.<br/>Does the world love it?
                 </div>
               </div>

               <input value={newWord} onChange={e => setNewWord(e.target.value.slice(0,24))} placeholder="YOUR WORD"
                 maxLength={24} autoFocus
                 style={{ width:'100%', padding:'24px', borderRadius:18, border: newWord.trim() ? '1px solid rgba(200,150,12,0.5)' : '1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', color:'#fff', fontSize:28, fontWeight:900, fontFamily:'Georgia, serif', outline:'none', boxSizing:'border-box', textAlign:'center', textTransform:'uppercase', letterSpacing:3, marginBottom:14, transition:'all 0.2s' }} />

               <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Your name"
                 style={{ width:'100%', padding:'18px', borderRadius:14, border: username.trim() ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.03)', color:'rgba(255,255,255,0.8)', fontSize:15, fontWeight:700, fontFamily:'inherit', outline:'none', boxSizing:'border-box', textAlign:'center', marginBottom:24, transition:'all 0.2s' }} />

               <button onClick={handleSubmit} disabled={!newWord.trim() || !username.trim() || loading}
                 style={{ width:'100%', padding:'20px', borderRadius:16, border:'none', background: newWord.trim() && username.trim() ? 'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)' : 'rgba(255,255,255,0.05)', color: newWord.trim() && username.trim() ? '#000' : 'rgba(255,255,255,0.15)', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor: newWord.trim() && username.trim() ? 'pointer' : 'not-allowed', letterSpacing:2, boxShadow: newWord.trim() && username.trim() ? '0 8px 32px rgba(200,150,12,0.3)' : 'none', transition:'all 0.3s' }}>
                 {loading ? 'RELEASING...' : 'RELEASE IT TO THE WORLD →'}
               </button>
             </div>
           </>
         ) : (
           <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
             <div style={{ fontSize:64, marginBottom:24 }}>🌍</div>
             <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase', marginBottom:12 }}>Your word is live</div>
             <div style={{ fontSize:52, fontWeight:900, fontFamily:'Georgia, serif', letterSpacing:-2, color:'#69F0AE', marginBottom:8, textTransform:'uppercase' }}>{sharedWord}</div>
             <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.3)', marginBottom:40 }}>People are voting right now.</div>

             <button onClick={() => {
               const url = `https://top10word.com?word=${encodeURIComponent(sharedWord)}`
               const txt = `I proposed the word ${sharedWord.toUpperCase()}. Vote if you love it!`
               if (navigator.share) navigator.share({ text: txt, url })
               else navigator.clipboard.writeText(txt + '\n' + url)
             }}
               style={{ width:'100%', padding:'18px', borderRadius:16, border:'none', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', color:'#000', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:12, boxShadow:'0 8px 32px rgba(200,150,12,0.3)', letterSpacing:1 }}>
               Share & get votes →
             </button>

             <button onClick={() => { setProposeStep('input'); setSection('vote') }}
               style={{ width:'100%', padding:'16px', borderRadius:14, border:'1px solid rgba(255,255,255,0.08)', background:'transparent', color:'rgba(255,255,255,0.35)', fontSize:14, fontWeight:700, fontFamily:'inherit', cursor:'pointer' }}>
               Keep voting
             </button>
           </div>
         )}
       </div>
     )}

     {/* TOP 10 SECTION */}
     {section === 'top' && (
       <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:'100dvh', padding:'48px 24px 120px' }}>
         <div style={{ fontSize:28, fontWeight:900, letterSpacing:-1, marginBottom:4 }}>
           Top<span style={{ color:'#C8960C' }}>10</span>Word
         </div>
         <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:2, marginBottom:28 }}>WORLD RANKING</div>

         <div style={{ display:'flex', gap:8, marginBottom:24 }}>
           {(['world','mine'] as const).map(t => (
             <button key={t} onClick={() => setTab(t)}
               style={{ flex:1, padding:'10px', borderRadius:10, border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.06)', background: tab === t ? 'rgba(200,150,12,0.12)' : 'transparent', color: tab === t ? '#C8960C' : 'rgba(255,255,255,0.25)', fontSize:11, fontWeight:900, fontFamily:'inherit', cursor:'pointer', letterSpacing:2, textTransform:'uppercase' }}>
               {t === 'world' ? '🌍 World' : '👤 My Words'}
             </button>
           ))}
         </div>

         {tab === 'world' && ranking.map((w, i) => {
           const { theme: t, font: f } = getTheme(w.word)
           return (
             <div key={w.id} style={{ marginBottom:16 }}>
               <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:6 }}>
                 <div style={{ fontSize:11, fontWeight:900, color: i===0 ? '#FFD700' : i===1 ? '#C0C0C0' : i===2 ? '#CD7F32' : 'rgba(255,255,255,0.2)', width:20 }}>#{i+1}</div>
                 <div style={{ fontSize:20, fontWeight:900, fontFamily: f, textTransform:'uppercase', letterSpacing:0.5, flex:1 }}>{w.word}</div>
                 <div style={{ fontSize:18, fontWeight:900, color: t.accent }}>{w.pct.toFixed(1)}%</div>
               </div>
               <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:4, height:3, overflow:'hidden', marginLeft:30 }}>
                 <div style={{ height:'100%', borderRadius:4, background:`linear-gradient(90deg, ${t.accent}, ${t.accent}66)`, width:`${w.pct}%`, transition:'width 1.2s ease' }} />
               </div>
             </div>
           )
         })}

         {tab === 'mine' && (
           myWords.length > 0 ? myWords.map((w) => {
             const { theme: t, font: f } = getTheme(w.word)
             return (
               <div key={w.id} style={{ marginBottom:16 }}>
                 <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:6 }}>
                   <div style={{ fontSize:20, fontWeight:900, fontFamily: f, textTransform:'uppercase', letterSpacing:0.5, flex:1 }}>{w.word}</div>
                   <div style={{ fontSize:18, fontWeight:900, color: t.accent }}>{w.pct.toFixed(1)}%</div>
                 </div>
                 <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:4, height:3, overflow:'hidden' }}>
                   <div style={{ height:'100%', borderRadius:4, background:`linear-gradient(90deg, ${t.accent}, ${t.accent}66)`, width:`${w.pct}%`, transition:'width 1.2s ease' }} />
                 </div>
               </div>
             )
           }) : (
             <div style={{ textAlign:'center', padding:'60px 0', color:'rgba(255,255,255,0.2)', fontSize:14, lineHeight:1.8 }}>
               You haven't proposed a word yet.<br/>Be the first to leave yours.
             </div>
           )
         )}
       </div>
     )}

     {/* Propose prompt */}
     {showProposePrompt && (
       <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center', padding:24, backdropFilter:'blur(8px)' }}>
         <div style={{ background:'linear-gradient(160deg, #1e1a10, #14100a)', borderRadius:24, padding:'32px 24px 28px', width:'100%', maxWidth:400, border:'1px solid rgba(200,150,12,0.25)', boxShadow:'0 0 80px rgba(200,150,12,0.1)' }}>
           <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase', marginBottom:12 }}>Your turn</div>
           <div style={{ fontSize:24, fontWeight:900, color:'#fff', marginBottom:8, lineHeight:1.2 }}>Propose a word<br/>to the world.</div>
           <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:28, lineHeight:1.6 }}>Leave one word in the global ranking. Share it and discover if people love it.</div>
           <button onClick={() => { setShowProposePrompt(false); setSection('propose') }}
             style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', color:'#000', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:10, boxShadow:'0 6px 24px rgba(200,150,12,0.25)', letterSpacing:1 }}>
             Leave my word →
           </button>
           <button onClick={() => setShowProposePrompt(false)}
             style={{ width:'100%', padding:'14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', background:'transparent', color:'rgba(255,255,255,0.25)', fontSize:13, fontWeight:700, fontFamily:'inherit', cursor:'pointer' }}>
             Keep voting
           </button>
         </div>
       </div>
     )}

     {/* Floating nav */}
     <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', display:'flex', background:'rgba(15,12,8,0.92)', backdropFilter:'blur(24px)', borderRadius:22, padding:'6px', border:'1px solid rgba(255,255,255,0.07)', zIndex:100, gap:4, boxShadow:'0 8px 40px rgba(0,0,0,0.6)' }}>
       {[
         { id:'vote', label:'Vote', color:'#6BAED6' },
         { id:'propose', label:'Propose', color:'#C8960C' },
         { id:'top', label:'Top 10', color:'#C0C0C0' },
       ].map(n => (
         <button key={n.id} onClick={() => { setSection(n.id as Section); if (n.id === 'top') loadRanking() }}
           style={{ padding:'10px 18px', borderRadius:16, border:'none', background: section === n.id ? `${n.color}18` : 'transparent', color: section === n.id ? n.color : 'rgba(255,255,255,0.2)', fontSize:12, fontWeight:900, fontFamily:'inherit', cursor:'pointer', letterSpacing:1, transition:'all 0.2s', whiteSpace:'nowrap' }}>
           {n.label}
         </button>
       ))}
     </div>

   </div>
 )
}
