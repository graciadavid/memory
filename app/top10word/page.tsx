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

  useEffect(() => {
    const u = localStorage.getItem('top10word_username') || ''
    setUsername(u)
    loadWord()
  }, [])

  const loadWord = async () => {
    const deviceId = getDeviceId()
    const { data: votedData } = await supabase.from('votes').select('word_id').eq('device_id', deviceId)
    const votedIds = votedData?.map((v: any) => v.word_id) || []
    const { data } = await supabase.from('words').select('*').order('created_at', { ascending: false }).limit(100)
    if (!data || data.length === 0) return
    const unvoted = data.filter((w: any) => !votedIds.includes(w.id))
    const pool = unvoted.length > 0 ? unvoted : data
    setCurrentWord(pool[Math.floor(Math.random() * pool.length)])
    setVoted(false)
    setVoteResult(null)
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
    setVoted(true)
    setVoteResult(yes)
    const field = yes ? 'total_yes' : 'total_no'
    const newVal = (currentWord[field] || 0) + 1
    await supabase.from('words').update({ [field]: newVal }).eq('id', currentWord.id)
    await supabase.from('votes').upsert({ word_id: currentWord.id, vote: yes, device_id: deviceId })
    setTimeout(loadWord, 800)
  }

  const handleSubmitWord = async () => {
    if (!newWord.trim() || newWord.trim().length < 2) return
    if (!username.trim()) return
    setLoading(true)
    const uname = username.trim()
    if (uname) localStorage.setItem('top10word_username', uname)
    const { error } = await supabase.from('words').insert({ word: newWord.trim(), proposed_by: uname || null })
    setLoading(false)
    if (!error) { setSubmitted(true); setNewWord('') }
  }

  const NAV = [
    { id: 'choose', label: 'VOTE' },
    { id: 'new', label: 'ADD' },
    { id: 'ranking', label: 'TOP 10' },
  ]

  return (
    <div style={{ minHeight:'100dvh', background:'#080808', fontFamily:'var(--font-nunito), sans-serif', color:'#fff', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column' }}>

      <div style={{ padding:'20px 20px 0', textAlign:'center' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.2)', letterSpacing:4, textTransform:'uppercase', marginBottom:4 }}>memgenius.com</div>
        <div style={{ fontSize:28, fontWeight:900, letterSpacing:-1 }}>top10<span style={{ color:'#E53935' }}>word</span></div>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:2, marginTop:2 }}>which words does the world love?</div>
      </div>

      <div style={{ display:'flex', gap:8, padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => { setSection(n.id as Section); if (n.id === 'ranking') loadRanking() }}
            style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background: section === n.id ? '#fff' : '#1a1a1a', color: section === n.id ? '#000' : 'rgba(255,255,255,0.4)', fontSize:12, fontWeight:900, fontFamily:'inherit', cursor:'pointer', letterSpacing:2 }}>
            {n.label}
          </button>
        ))}
      </div>

      <div style={{ flex:1, padding:'0 20px 100px' }}>

        {section === 'choose' && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'65vh' }}>
            {currentWord ? (
              <>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.2)', letterSpacing:4, textTransform:'uppercase', marginBottom:24 }}>do you love this word?</div>
                <div style={{ fontSize: currentWord.word.length > 8 ? 52 : 72, fontWeight:900, color:'#fff', textAlign:'center', letterSpacing:-2, lineHeight:1, marginBottom:16, textTransform:'uppercase' }}>
                  {currentWord.word}
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.2)', marginBottom:40 }}>
                  {(currentWord.total_yes || 0) + (currentWord.total_no || 0)} votes
                </div>
                {!voted ? (
                  <div style={{ display:'flex', gap:16, width:'100%' }}>
                    <button onClick={() => handleVote(false)}
                      style={{ flex:1, padding:'24px', borderRadius:16, border:'2px solid rgba(255,255,255,0.08)', background:'#111', color:'rgba(255,255,255,0.5)', fontSize:36, fontFamily:'inherit', cursor:'pointer' }}>
                      ✗
                    </button>
                    <button onClick={() => handleVote(true)}
                      style={{ flex:1, padding:'24px', borderRadius:16, border:'none', background:'#E53935', color:'#fff', fontSize:36, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 6px 0 #B71C1C' }}>
                      ✓
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:56, marginBottom:12 }}>{voteResult ? '❤️' : '👎'}</div>
                    <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>
                      {voteResult
                        ? `${Math.round(((currentWord.total_yes+1)/Math.max((currentWord.total_yes+1)+(currentWord.total_no||0),1))*100)}% love this word`
                        : `${Math.round(((currentWord.total_no+1)/Math.max((currentWord.total_yes||0)+(currentWord.total_no+1),1))*100)}% also said no`
                      }
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.3)' }}>Loading...</div>
            )}
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
                <button onClick={() => { setSubmitted(false); setSection('choose') }}
                  style={{ padding:'14px 28px', borderRadius:12, border:'none', background:'#E53935', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
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
