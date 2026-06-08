'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Section = 'choose' | 'new' | 'ranking'
type Tab = 'world' | 'mine'

function getDeviceId() {
  let id = localStorage.getItem('top10word_device')
  if (!id) { id = Math.random().toString(36).slice(2) + Date.now(); localStorage.setItem('top10word_device', id) }
  return id
}

const BLACKLIST = [
  'fuck','shit','ass','bitch','cunt','dick','cock','pussy','nigger','nigga',
  'faggot','fag','whore','slut','bastard','retard','rape','nazi','porn',
  'sex','penis','vagina','boobs','tits','naked','nude','kill','murder',
  'suicide','terrorist','jihad','hitler','satan','devil','hell','damn',
  'piss','crap','bastard','homo','dyke','tranny','spic','chink','kike'
]
export default function Top10WordPage() {
  const [section, setSection] = useState<Section>('choose')
  const [currentWord, setCurrentWord] = useState<any>(null)
  const [voted, setVoted] = useState(false)
  const [voteResult, setVoteResult] = useState<boolean|null>(null)
  const [newWord, setNewWord] = useState('')
  const [username, setUsername] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [ranking, setRanking] = useState<any[]>([])
  const [myWords, setMyWords] = useState<any[]>([])
  const [tab, setTab] = useState<Tab>('world')
  const [loading, setLoading] = useState(false)
  const [swipeDir, setSwipeDir] = useState<'left'|'right'|null>(null)
  const [totalVotes, setTotalVotes] = useState(0)
  const [showPct, setShowPct] = useState(false)
  const [lastPct, setLastPct] = useState(0)

  useEffect(() => {
    const u = localStorage.getItem('top10word_username') || ''
   setUsername(u)
   loadWord()
   supabase.from('words').select('total_yes, total_no').then(({ data }: any) => {
     if (data) setTotalVotes(data.reduce((acc: number, w: any) => acc + (w.total_yes || 0) + (w.total_no || 0), 0))
   })
  }, [])

  const loadWord = async () => {
    const deviceId = getDeviceId()
    const { data: votedData } = await supabase.from('votes').select('word_id').eq('device_id', deviceId)
    const votedIds = votedData?.map((v: any) => v.word_id) || []
    const { data } = await supabase.from('words').select('*').order('created_at', { ascending: false }).limit(100)
    const wordParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("word") : null
    if (!data || data.length === 0) return
    if (wordParam) {
      const forced = data.find((w: any) => w.word.toLowerCase() === wordParam.toLowerCase())
      if (forced) { setCurrentWord(forced); setVoted(false); setVoteResult(null); setSwipeDir(null); window.history.replaceState({}, "", "/top10word"); return }
    }
    const unvoted = data.filter((w: any) => !votedIds.includes(w.id))
    const pool = unvoted.length > 0 ? unvoted : data
    setCurrentWord(pool[Math.floor(Math.random() * pool.length)])
    setVoted(false)
    setVoteResult(null)
    setSwipeDir(null)
  }

  const loadRanking = async () => {
    const { data } = await supabase.from('words').select('*').order('total_yes', { ascending: false }).limit(50)
    if (data) {
      const ranked = data
        .map((w: any) => ({ ...w, pct: Math.round((w.total_yes / Math.max(w.total_yes + w.total_no, 1)) * 100) }))
        .filter((w: any) => w.total_yes + w.total_no > 0)
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

  const handleVote = async (yes: boolean) => {
    if (!currentWord || voted) return
    const deviceId = getDeviceId()
    setSwipeDir(yes ? 'right' : 'left')
    setVoted(true)
    setVoteResult(yes)
    const field = yes ? 'total_yes' : 'total_no'
   const newVal = (currentWord[field] || 0) + 1
   const pct = yes
     ? Math.round(((currentWord.total_yes + 1) / Math.max(currentWord.total_yes + 1 + (currentWord.total_no || 0), 1)) * 100)
     : Math.round(((currentWord.total_no + 1) / Math.max((currentWord.total_yes || 0) + currentWord.total_no + 1, 1)) * 100)
   setLastPct(pct)
   setShowPct(true)
   await supabase.from('words').update({ [field]: newVal }).eq('id', currentWord.id)
   await supabase.from('votes').upsert({ word_id: currentWord.id, vote: yes, device_id: deviceId })
   setTotalVotes(v => v + 1)
   setTimeout(() => { setShowPct(false); setTimeout(loadWord, 400) }, 1200)
  }

  const handleSubmitWord = async () => {
    if (!newWord.trim() || newWord.trim().length < 2) return
    if (!username.trim()) return
    if (BLACKLIST.some(w => newWord.toLowerCase().includes(w))) {
      alert("Really? We're better than that.")
      return
    }
    setLoading(true)
    const uname = username.trim()
    if (uname) localStorage.setItem('top10word_username', uname)
    const { error } = await supabase.from('words').insert({ word: newWord.trim(), proposed_by: uname || null })
   setLoading(false)
   if (error && error.code === '23505') {
     alert('This word is already in the ranking!')
   } else if (!error) {
     localStorage.setItem('top10word_lastword', newWord.trim().toUpperCase())
     setSubmitted(true)
     setNewWord('')
   }
  }

  const NAV = [
    { id: 'choose', label: 'VOTE' },
    { id: 'new', label: 'PROPOSE' },
    { id: 'ranking', label: 'TOP 10' },
  ]

  return (
    <div style={{ minHeight:'100dvh', background:'linear-gradient(160deg, #0a0a0f 0%, #080808 50%, #0a0805 100%)', fontFamily:'var(--font-nunito), sans-serif', color:'#fff', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column' }}>

      <div style={{ padding:'20px 20px 0', textAlign:'center' }}>
        <div style={{ fontSize:28, fontWeight:900, letterSpacing:-1 }}><span style={{ color:'#fff' }}>Top</span><span style={{ color:'#C8960C' }}>10</span><span style={{ color:'#fff' }}>Word.com</span></div>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:2, marginTop:2 }}>which words does the world love?</div>
       {totalVotes > 0 && <div style={{ fontSize:13, fontWeight:900, color:'rgba(200,150,12,0.7)', marginTop:6, letterSpacing:1 }}>{totalVotes.toLocaleString()} votes worldwide</div>}
      </div>

      <div style={{ display:'flex', gap:8, padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => { setSection(n.id as Section); if (n.id === 'ranking') loadRanking() }}
            style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background: section === n.id ? '#fff' : '#1a1a1a', color: section === n.id ? '#000' : 'rgba(255,255,255,0.4)', fontSize:12, fontWeight:900, fontFamily:'inherit', cursor:'pointer', letterSpacing:2 }}>
            {n.label}
          </button>
        ))}
      </div>

      <div style={{ flex:1, padding:'0 20px 80px' }}>

        {section === 'choose' && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'55vh', overflow:'hidden' }}>
            {currentWord && (
              <div style={{
                background:'#fff',
                borderRadius:24,
                padding:'48px 28px 36px',
                width:'100%',
                boxShadow:'0 24px 64px rgba(0,0,0,0.7)',
                textAlign:'center',
                marginBottom:28,
                transform: swipeDir === 'right' ? 'translateX(150%) rotate(20deg)' : swipeDir === 'left' ? 'translateX(-150%) rotate(-20deg)' : 'translateX(0) rotate(0deg)',
                opacity: swipeDir ? 0 : 1,
                transition: swipeDir ? 'transform 0.35s ease, opacity 0.25s ease' : 'none',
              }}>
                <div style={{ fontSize:36, fontWeight:900, letterSpacing:-1, marginBottom:28, color:'#111' }}>
                  Top<span style={{ color:'#C8960C' }}>10</span>Word.com
                </div>
                <div style={{ fontSize: currentWord.word.length > 11 ? 28 : currentWord.word.length > 8 ? 38 : currentWord.word.length > 6 ? 52 : 70, fontWeight:900, color:'#111', letterSpacing:-1, whiteSpace:'nowrap', lineHeight:1, marginBottom:20, textTransform:'uppercase' }}>
                  {currentWord.word}
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:'rgba(0,0,0,0.25)' }}>
                  {(currentWord.total_yes || 0) + (currentWord.total_no || 0)} votes worldwide
                </div>
               {showPct && (
                 <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.95)', borderRadius:28, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                   <div style={{ fontSize:64, fontWeight:900, color: voteResult ? '#2E7D32' : '#E53935', lineHeight:1 }}>{lastPct}%</div>
                   <div style={{ fontSize:14, fontWeight:700, color:'rgba(0,0,0,0.5)', marginTop:8 }}>{voteResult ? 'love this word' : 'passed on this word'}</div>
                 </div>
               )}
             </div>
           )}
           <div style={{ display:'flex', gap:16, width:'100%' }}>
              <button onClick={() => handleVote(false)} disabled={voted}
                style={{ flex:1, padding:'14px', borderRadius:16, border:'none', background:'#E53935', color:'#fff', fontSize:32, fontFamily:'inherit', cursor: voted ? 'not-allowed' : 'pointer', fontWeight:900, boxShadow:'0 5px 0 #B71C1C' }}>
                ✗
              </button>
              <button onClick={() => handleVote(true)} disabled={voted}
                style={{ flex:1, padding:'14px', borderRadius:16, border:'none', background:'#2E7D32', color:'#fff', fontSize:32, fontFamily:'inherit', cursor: voted ? 'not-allowed' : 'pointer', boxShadow:'0 5px 0 #1B5E20', fontWeight:900 }}>
                ✓
              </button>
            </div>
          </div>
        )}

        {section === 'new' && (
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', minHeight:'65vh' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.2)', letterSpacing:4, textTransform:'uppercase', marginBottom:20, textAlign:'center' }}>add a word to the world</div>
            {!submitted ? (
              <>
                <input value={newWord} onChange={e => setNewWord(e.target.value.slice(0,24))} placeholder="YOUR WORD"
                  maxLength={24}
                  style={{ width:'100%', padding:'20px', borderRadius:14, border:'2px solid rgba(255,255,255,0.1)', background:'#111', color:'#fff', fontSize:28, fontWeight:900, fontFamily:'inherit', outline:'none', boxSizing:'border-box', textAlign:'center', textTransform:'uppercase', letterSpacing:2, marginBottom:12 }} />
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Your name (required)"
                  style={{ width:'100%', padding:'14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.08)', background:'#111', color:'rgba(255,255,255,0.6)', fontSize:14, fontWeight:700, fontFamily:'inherit', outline:'none', boxSizing:'border-box', textAlign:'center', marginBottom:16 }} />
                <button onClick={handleSubmitWord} disabled={!newWord.trim() || !username.trim() || loading}
                  style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background: newWord.trim() && username.trim() ? '#E53935' : '#1a1a1a', color: newWord.trim() && username.trim() ? '#fff' : 'rgba(255,255,255,0.2)', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor: newWord.trim() && username.trim() ? 'pointer' : 'not-allowed', boxShadow: newWord.trim() && username.trim() ? '0 5px 0 #B71C1C' : 'none', letterSpacing:2 }}>
                  {loading ? 'ADDING...' : 'RELEASE IT →'}
                </button>
              </>
            ) : (
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:56, marginBottom:12 }}>🌍</div>
                <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:8 }}>Your word is in the world.</div>
                <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>People are voting on it right now.</div>
                <button onClick={() => {
                  const w = localStorage.getItem('top10word_lastword') || ''
                  const url = `https://top10word.com?word=${encodeURIComponent(w)}`
                  const txt = `I proposed the word ${w}. Vote if you love it!`
                  if (navigator.share) navigator.share({ text: txt, url })
                  else { navigator.clipboard.writeText(txt + '\n' + url) }
                }}
                  style={{ width:"100%", padding:"16px", borderRadius:14, border:"none", background:"#2E7D32", color:"#fff", fontSize:16, fontWeight:900, fontFamily:"inherit", cursor:"pointer", boxShadow:"0 5px 0 #1B5E20", marginBottom:12 }}>
                  Share my word →
                </button>
                <button onClick={() => { setSubmitted(false); setSection("choose") }}
                  style={{ width:"100%", padding:"14px", borderRadius:14, border:"1px solid rgba(255,255,255,0.15)", background:"transparent", color:"rgba(255,255,255,0.5)", fontSize:14, fontWeight:900, fontFamily:"inherit", cursor:"pointer" }}>
                  Keep Voting →
                </button>
              </div>
            )}
          </div>
        )}

        {section === 'ranking' && (
          <div style={{ paddingTop:16 }}>
            <div style={{ display:'flex', gap:8, marginBottom:16 }}>
              {(['world','mine'] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background: tab === t ? '#E53935' : '#1a1a1a', color:'#fff', fontSize:12, fontWeight:900, fontFamily:'inherit', cursor:'pointer', letterSpacing:2, textTransform:'uppercase' }}>
                  {t === 'world' ? '🌍 World' : '👤 My Words'}
                </button>
              ))}
            </div>
            {tab === 'world' && ranking.map((w, i) => (
              <div key={w.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize:13, fontWeight:900, color: i===0 ? '#E53935' : i===1 ? '#FF7043' : i===2 ? '#FFB300' : 'rgba(255,255,255,0.3)', width:28, textAlign:'center' }}>#{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:18, fontWeight:900, textTransform:'uppercase', letterSpacing:1 }}>{w.word}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)' }}>{w.total_yes + w.total_no} votes</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:22, fontWeight:900, color: w.pct >= 70 ? '#E53935' : w.pct >= 50 ? '#FF7043' : 'rgba(255,255,255,0.4)' }}>{w.pct}%</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', fontWeight:700 }}>loved</div>
                </div>
              </div>
            ))}
            {tab === 'mine' && (
              myWords.length > 0 ? myWords.map((w) => (
                <div key={w.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:18, fontWeight:900, textTransform:'uppercase', letterSpacing:1 }}>{w.word}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)' }}>{w.total_yes + w.total_no} votes</div>
                  </div>
                  <div style={{ fontSize:22, fontWeight:900, color: w.pct >= 70 ? '#E53935' : 'rgba(255,255,255,0.4)' }}>{w.pct}%</div>
                </div>
              )) : (
                <div style={{ textAlign:'center', padding:'40px 0', color:'rgba(255,255,255,0.3)', fontSize:14 }}>
                  Add a word with your name to see it here.
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div style={{ textAlign:'center', padding:'12px', fontSize:11, color:'rgba(255,255,255,0.1)', fontWeight:700 }}>
        top10word · <a href="https://memgenius.com" style={{ color:'rgba(255,255,255,0.15)', textDecoration:'none' }}>memgenius.com</a>
      </div>
    </div>
  )
}
