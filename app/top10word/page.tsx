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
 { bg: '#F5F0E8', accent: '#8B6914', text: '#1C1410', bar: '#C8960C' },
 { bg: '#EEF2F7', accent: '#2C5F8A', text: '#1A2A3A', bar: '#4A8EC4' },
 { bg: '#EDF5EE', accent: '#2D6A4F', text: '#1A2E22', bar: '#40916C' },
 { bg: '#F5EEF2', accent: '#7B3B6E', text: '#2E1A2A', bar: '#A855A0' },
 { bg: '#F0EDF8', accent: '#4A3B8A', text: '#1E1A2E', bar: '#7B6ED8' },
 { bg: '#F7F2EC', accent: '#7A4F2A', text: '#2E1E10', bar: '#B07840' },
 { bg: '#ECF5F4', accent: '#2A6B64', text: '#1A2E2C', bar: '#3DC4B4' },
 { bg: '#F5EDEC', accent: '#8A3028', text: '#2E1A18', bar: '#C85048' },
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
  const [searchWord, setSearchWord] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [searchDone, setSearchDone] = useState(false)

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
     import('canvas-confetti').then(m => m.default({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors: ['#C8960C','#8B6914','#2D6A4F','#2C5F8A'] }))
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
   <div style={{ minHeight:'100dvh', background: section === 'vote' && currentWord ? theme.bg : '#F5F0E8', fontFamily:'var(--font-nunito), sans-serif', transition:'background 0.7s ease', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', position:'relative' }}>

     {/* VOTE */}
     {section === 'vote' && (
       <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:'100dvh' }}>

         {/* Header */}
         <div style={{ padding:"36px 28px 0", textAlign:"center" }}>
           <div style={{ fontSize:26, fontWeight:900, letterSpacing:-1, color: theme.text, fontFamily:"Georgia, serif", marginBottom:6 }}>
             Top<span style={{ color: theme.accent }}>10</span>Word.com
           </div>
           <div style={{ fontSize:12, fontWeight:500, color: theme.text, opacity:0.4, marginTop:4 }}>
             Which is the world's most beautiful word?
           </div>
           <div style={{ fontSize:10, fontWeight:700, color: theme.accent, letterSpacing:2, marginTop:6, opacity:0.7 }}>
             {totalVotes.toLocaleString()} VOTES WORLDWIDE
           </div>
         </div>


         {/* Word */}
         <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 28px' }}>
           {currentWord && (
             <div style={{
               textAlign:'center',
               width:'100%',
               transform: swipeDir === 'right' ? 'translateX(150%) rotate(12deg)' : swipeDir === 'left' ? 'translateX(-150%) rotate(-12deg)' : 'translateX(0)',
               opacity: swipeDir ? 0 : 1,
               transition: swipeDir ? 'transform 0.3s ease, opacity 0.25s ease' : 'none',
             }}>
               <div style={{
                 fontSize: currentWord.word.length > 14 ? 28 : currentWord.word.length > 11 ? 36 : currentWord.word.length > 8 ? 48 : currentWord.word.length > 5 ? 64 : 80,
                 fontWeight: 900,
                 fontFamily: font,
                 color: theme.text,
                 letterSpacing: -2,
                 lineHeight: 1,
                 marginBottom: 32,
                 textTransform: 'uppercase',
               }}>
                 {currentWord.word}
               </div>

               {/* Love bar */}
               <div style={{ width:'100%', maxWidth:240, margin:'0 auto 10px' }}>
                 <div style={{ background: `${theme.accent}18`, borderRadius:6, height:4, overflow:'hidden' }}>
                   <div style={{ height:'100%', borderRadius:6, background: theme.bar, width:`${lovePct}%`, transition:'width 0.8s ease' }} />
                 </div>
               </div>
               <div style={{ fontSize:11, fontWeight:700, color: theme.accent, letterSpacing:3, opacity:0.7 }}>
                 {lovePct}% LOVE THIS
               </div>
             </div>
           )}
         </div>

         {/* Buttons */}
         <div style={{ padding:'0 28px 140px', display:'flex', gap:14 }}>
           <button onClick={() => handleVote(false)} disabled={voted}
             style={{ flex:1, padding:'18px', borderRadius:18, border:`1px solid ${theme.accent}30`, background:`${theme.accent}08`, color:`${theme.text}60`, fontSize:22, fontFamily:'inherit', cursor:'pointer', transition:'all 0.15s' }}>
             ✕
           </button>
           <button onClick={() => handleVote(true)} disabled={voted}
             style={{ flex:2, padding:'18px', borderRadius:18, border:`1px solid ${theme.bar}60`, background:`${theme.bar}15`, color: theme.accent, fontSize:15, fontFamily:'inherit', cursor:'pointer', fontWeight:900, letterSpacing:2, transition:'all 0.15s' }}>
             LOVE IT
           </button>
         </div>
       </div>
     )}

     {/* PROPOSE */}
     {section === 'propose' && (
       <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:'100dvh', background:'#F5F0E8' }}>
         {proposeStep === 'input' ? (
           <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 28px 120px' }}>
             <div style={{ marginBottom:40 }}>
                <div style={{ textAlign:"center", marginBottom:28 }}>
                  <div style={{ fontSize:26, fontWeight:900, letterSpacing:-1, color:"#1C1410", fontFamily:"Georgia, serif" }}>
                    Top<span style={{ color:"#C8960C" }}>10</span>Word.com
                  </div>
                  <div style={{ fontSize:12, fontWeight:500, color:"rgba(28,20,16,0.4)", marginTop:4 }}>Leave your word in the world.</div>
                </div>

              </div>
             <input value={newWord} onChange={e => setNewWord(e.target.value.slice(0,24))} placeholder="Your word"
               maxLength={24}
               style={{ width:'100%', padding:'22px 20px', borderRadius:16, border: '1.5px solid #C8960C', background:'#fff', color:'#1C1410', fontSize:26, fontWeight:900, fontFamily:'Georgia, serif', outline:'none', boxSizing:'border-box', textAlign:'center', textTransform:'uppercase', letterSpacing:3, marginBottom:12, transition:'border 0.2s', boxShadow:'0 2px 20px rgba(28,20,16,0.06)' }} />

             <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Your name"
               style={{ width:'100%', padding:'16px 20px', borderRadius:14, border: '1.5px solid rgba(28,20,16,0.18)', background:'#fff', color:'rgba(28,20,16,0.7)', fontSize:15, fontWeight:600, fontFamily:'inherit', outline:'none', boxSizing:'border-box', textAlign:'center', marginBottom:20, transition:'border 0.2s', boxShadow:'0 2px 20px rgba(28,20,16,0.04)' }} />

             <button onClick={handleSubmit} disabled={!newWord.trim() || !username.trim() || loading}
               style={{ width:'100%', padding:'20px', borderRadius:16, border:'none', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', color:'#1C1410', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor: newWord.trim() && username.trim() ? 'pointer' : 'not-allowed', letterSpacing:2, boxShadow:'0 6px 28px rgba(200,150,12,0.25)', opacity: newWord.trim() && username.trim() ? 1 : 0.4, transition:'opacity 0.3s' }}>
               {loading ? 'RELEASING...' : 'RELEASE IT TO THE WORLD →'}
             </button>
           </div>
         ) : (
           <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 28px 120px', textAlign:'center' }}>
             <div style={{ fontSize:11, fontWeight:700, color:'#8B6914', letterSpacing:3, textTransform:'uppercase', marginBottom:16, opacity:0.7 }}>Your word is live</div>
             <div style={{ fontSize:52, fontWeight:900, fontFamily:'Georgia, serif', letterSpacing:-2, color:'#2D6A4F', marginBottom:8, textTransform:'uppercase', lineHeight:1 }}>{sharedWord}</div>
             <div style={{ fontSize:13, color:'rgba(28,20,16,0.35)', marginBottom:44, fontWeight:500 }}>People are voting right now.</div>

             <button onClick={() => {
               const url = `https://top10word.com?word=${encodeURIComponent(sharedWord)}`
               const txt = `I proposed the word ${sharedWord.toUpperCase()}. Vote if you love it!`
               if (navigator.share) navigator.share({ text: txt, url })
               else navigator.clipboard.writeText(txt + '\n' + url)
             }}
               style={{ width:'100%', padding:'18px', borderRadius:16, border:'none', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', color:'#1C1410', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:12, boxShadow:'0 6px 28px rgba(200,150,12,0.2)', letterSpacing:1 }}>
               Share & get votes →
             </button>
             <button onClick={() => { setProposeStep('input'); setSection('vote') }}
               style={{ width:'100%', padding:'16px', borderRadius:14, border:'1.5px solid rgba(28,20,16,0.1)', background:'transparent', color:'rgba(28,20,16,0.35)', fontSize:14, fontWeight:600, fontFamily:'inherit', cursor:'pointer' }}>
               Keep voting
             </button>
           </div>
         )}
       </div>
     )}

     {/* TOP 10 */}
     {section === 'top' && (
       <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:'100dvh', background:'#F5F0E8', padding:'48px 28px 120px' }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontSize:26, fontWeight:900, letterSpacing:-1, color:"#1C1410", fontFamily:"Georgia, serif" }}>
              Top<span style={{ color:"#C8960C" }}>10</span>Word.com
            </div>
            <div style={{ fontSize:12, fontWeight:500, color:"rgba(28,20,16,0.4)", marginTop:4 }}>World Ranking</div>
          </div>

          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              <input value={searchWord} onChange={e => { setSearchWord(e.target.value); setSearchDone(false) }} onKeyDown={e => e.key === "Enter" && searchWordFn()} placeholder="Search a word..." style={{ flex:1, padding:"11px 14px", borderRadius:11, border:"1.5px solid rgba(27,46,74,0.15)", background:"#fff", color:"#1C1410", fontSize:13, fontWeight:600, fontFamily:"inherit", outline:"none" }} />
              <button onClick={searchWordFn} style={{ padding:"11px 16px", borderRadius:11, border:"none", background:"#1B2E4A", color:"#fff", fontSize:12, fontWeight:900, fontFamily:"inherit", cursor:"pointer" }}>Search</button>
            </div>
            {searchDone && (
              <div style={{ padding:"14px", borderRadius:12, background:"#fff", border:"1px solid rgba(27,46,74,0.1)" }}>
                {searchResult ? (
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                      <div style={{ fontSize:17, fontWeight:800, fontFamily:"'Helvetica Neue', sans-serif", textTransform:"uppercase", letterSpacing:1, flex:1, color:"#1B2E4A" }}>{searchResult.word}</div>
                      <div style={{ fontSize:15, fontWeight:900, color:"#1B2E4A" }}>{searchResult.pct.toFixed(1)}%</div>
                    </div>
                    <div style={{ background:"rgba(27,46,74,0.07)", borderRadius:4, height:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:4, background:"#3A6EA5", width:`${searchResult.pct}%`, transition:"width 1s ease" }} />
                    </div>
                    <div style={{ fontSize:11, color:"rgba(28,20,16,0.35)", marginTop:5 }}>{(searchResult.total_yes||0)+(searchResult.total_no||0)} votes</div>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ fontSize:13, color:"rgba(28,20,16,0.4)" }}>"{searchWord}" not in ranking yet.</div>
                    <button onClick={() => { setNewWord(searchWord); setSection("propose") }}
                      style={{ padding:"8px 12px", borderRadius:9, border:"none", background:"linear-gradient(135deg, #8B6914, #C8960C)", color:"#fff", fontSize:12, fontWeight:900, fontFamily:"inherit", cursor:"pointer" }}>Propose →</button>
                  </div>
                )}
              </div>
            )}
          </div>

         <div style={{ display:'flex', gap:8, marginBottom:16 }}>
           {(['world','mine'] as const).map(t => (
             <button key={t} onClick={() => setTab(t)}
               style={{ flex:1, padding:'10px', borderRadius:10, border: tab === t ? 'none' : '1.5px solid rgba(28,20,16,0.1)', background: tab === t ? 'rgba(200,150,12,0.12)' : 'transparent', color: tab === t ? '#8B6914' : 'rgba(28,20,16,0.3)', fontSize:11, fontWeight:900, fontFamily:'inherit', cursor:'pointer', letterSpacing:2, textTransform:'uppercase' }}>
               {t === 'world' ? 'World' : 'My Words'}
             </button>
           ))}
         </div>
         {tab === 'world' && ranking.map((w, i) => {
           const isTop3 = i < 3
           const NAVY = "#1B2E4A"
           const NAVY_BAR = "#3A6EA5"
           return (
             <div key={w.id} style={{ marginBottom: isTop3 ? 14 : 10, paddingBottom: isTop3 ? 14 : 10, borderBottom:"1px solid rgba(27,46,74,0.08)" }}>
               <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                 <div style={{ fontSize:11, fontWeight:900, color: i===0 ? "#C8960C" : i===1 ? "#7A8FA6" : i===2 ? "#9AADBE" : "rgba(27,46,74,0.2)", width:22, flexShrink:0, fontFamily:"Georgia, serif" }}>{i+1}.</div>
                 <div style={{ fontSize: isTop3 ? 16 : 13, fontWeight:800, fontFamily:"'Helvetica Neue', sans-serif", textTransform:"uppercase", letterSpacing:1, flex:1, color: NAVY, lineHeight:1 }}>{w.word}</div>
                 <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                   <div style={{ fontSize: isTop3 ? 14 : 12, fontWeight:900, color: NAVY, minWidth:38, textAlign:"right" }}>{w.pct.toFixed(1)}%</div>
                   <button onClick={() => voteWord(w, false)}
                     style={{ width:26, height:26, borderRadius:6, border:"1px solid rgba(27,46,74,0.2)", background:"rgba(27,46,74,0.05)", color:"rgba(27,46,74,0.45)", fontSize:11, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                   <button onClick={() => voteWord(w, true)}
                     style={{ width:26, height:26, borderRadius:6, border:"1px solid rgba(27,46,74,0.3)", background:"rgba(27,46,74,0.08)", color: NAVY, fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>✓</button>
                 </div>
               </div>
               <div style={{ background:"rgba(27,46,74,0.07)", borderRadius:4, height:2, overflow:"hidden", marginLeft:30 }}>
                 <div style={{ height:"100%", borderRadius:4, background: NAVY_BAR, width:`${w.pct}%`, transition:"width 1.5s ease" }} />
               </div>
             </div>
           )
         })}

         {tab === 'mine' && (
           myWords.length > 0 ? myWords.map((w) => {
             const { theme: t, font: f } = getTheme(w.word)
             return (
               <div key={w.id} style={{ marginBottom:14, paddingBottom:14, borderBottom:'1.5px solid rgba(28,20,16,0.06)' }}>
                 <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:8 }}>
                   <div style={{ fontSize:20, fontWeight:900, fontFamily: f, textTransform:'uppercase', flex:1, color:'#1C1410' }}>{w.word}</div>
                   <div style={{ fontSize:17, fontWeight:900, color: t.accent }}>{w.pct.toFixed(1)}%</div>
                 </div>
                 <div style={{ background:'rgba(28,20,16,0.06)', borderRadius:4, height:3, overflow:'hidden' }}>
                   <div style={{ height:'100%', borderRadius:4, background: t.bar, width:`${w.pct}%`, transition:'width 1.2s ease' }} />
                 </div>
               </div>
             )
           }) : (
             <div style={{ textAlign:'center', padding:'60px 0', color:'rgba(28,20,16,0.25)', fontSize:14, lineHeight:1.8 }}>
               You haven't proposed a word yet.<br/>Be the first to leave yours.
             </div>
           )
         )}
       </div>
     )}

     {/* Propose prompt */}
     {showProposePrompt && (
       <div style={{ position:'fixed', inset:0, background:'rgba(28,20,16,0.5)', zIndex:1000, display:'flex', alignItems:'flex-end', padding:20, backdropFilter:'blur(4px)' }}>
         <div style={{ background:'#F5F0E8', borderRadius:24, padding:'32px 24px 28px', width:'100%', boxShadow:'0 -4px 60px rgba(28,20,16,0.15)', border:'1px solid rgba(200,150,12,0.2)' }}>
           <div style={{ fontSize:11, fontWeight:700, color:'#8B6914', letterSpacing:3, textTransform:'uppercase', marginBottom:10, opacity:0.7 }}>Your turn</div>
           <div style={{ fontSize:24, fontWeight:900, color:'#1C1410', marginBottom:8, lineHeight:1.2, letterSpacing:-0.5 }}>Propose a word<br/>to the world.</div>
           <div style={{ fontSize:13, color:'rgba(28,20,16,0.4)', marginBottom:28, lineHeight:1.6 }}>Leave one word in the global ranking. Share it. See if people love it.</div>
           <button onClick={() => { setShowProposePrompt(false); setSection('propose') }}
             style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', color:'#1C1410', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:10, boxShadow:'0 4px 20px rgba(200,150,12,0.2)', letterSpacing:1 }}>
             Leave my word →
           </button>
           <button onClick={() => setShowProposePrompt(false)}
             style={{ width:'100%', padding:'14px', borderRadius:12, border:'1.5px solid rgba(28,20,16,0.1)', background:'transparent', color:'rgba(28,20,16,0.3)', fontSize:13, fontWeight:600, fontFamily:'inherit', cursor:'pointer' }}>
             Keep voting
           </button>
         </div>
       </div>
     )}

     {/* Floating nav */}
     <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', display:'flex', background:'rgba(28,20,16,0.9)', backdropFilter:'blur(20px)', borderRadius:20, padding:'6px 8px', zIndex:100, gap:2, boxShadow:'0 8px 40px rgba(28,20,16,0.25)', whiteSpace:'nowrap' }}>
       {[
         { id:'vote', label:'Vote', activeColor:'#E8C876' },
         { id:'propose', label:'Propose', activeColor:'#A8C898' },
         { id:'top', label:'Top 10', activeColor:'#98B8D8' },
       ].map(n => (
         <button key={n.id} onClick={() => { setSection(n.id as Section); if (n.id === 'top') loadRanking() }}
           style={{ padding:'10px 18px', borderRadius:14, border:'none', background: section === n.id ? 'rgba(255,255,255,0.1)' : 'transparent', color: section === n.id ? n.activeColor : 'rgba(255,255,255,0.3)', fontSize:11, fontWeight:900, fontFamily:"'Helvetica Neue', sans-serif", cursor:'pointer', letterSpacing:1.5, transition:'all 0.2s', textTransform:'uppercase' }}>
           {n.label}
         </button>
       ))}
     </div>

   </div>
 )
}
