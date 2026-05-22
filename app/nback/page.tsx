'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const PURPLE = '#7B1FA2'

const COLORS = [
  { id: 0, color: '#E53935', name: 'Red' },
  { id: 1, color: '#43A047', name: 'Green' },
  { id: 2, color: '#1E88E5', name: 'Blue' },
  { id: 3, color: '#FDD835', name: 'Yellow' },
  { id: 4, color: '#FB8C00', name: 'Orange' },
]

type Phase = 'rules' | 'show' | 'answer' | 'result'

export default function NBackPage() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [history, setHistory] = useState<number[]>([])
  const historyRef = useRef<number[]>([])
  const [current, setCurrent] = useState<number>(0)
  const [streak, setStreak] = useState(0)
  const [nLevel] = useState(1) // 1-back
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)
  const [worldRecord, setWorldRecord] = useState<{level:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,level:number}[]>([])
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [finalStreak, setFinalStreak] = useState(0)

  useEffect(() => {
    if (profile?.name) setName(profile.name)
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('nback_scores').select('player_name,level').order('level', { ascending: false }).limit(500)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
    const sorted = Object.entries(best).map(([n,l]) => ({name:n, level:l as number})).sort((a,b) => b.level-a.level)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({level:sorted[0].level, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
  }

  const nextColor = useCallback((hist: number[], s: number) => {
    const next = Math.floor(Math.random() * COLORS.length)
    const newHist = [...hist, next]
    historyRef.current = newHist
    setCurrent(next)
    setHistory(newHist)
    setFeedback(null)
    setPhase('show')
    setTimeout(() => setPhase('answer'), 1000)
  }, [])

  const startGame = () => {
    const first = Math.floor(Math.random() * COLORS.length)
    setHistory([first])
    setCurrent(first)
    setStreak(0)
    setFeedback(null)
    setPhase('show')
    setTimeout(() => setPhase('answer'), 1000)
  }

  const handleAnswer = useCallback(async (isMatch: boolean) => {
    if (phase !== 'answer') return
    const h = historyRef.current
    const isActualMatch = h.length >= 2 && h[h.length - 1] === h[h.length - 2]
    console.log('history:', h, 'isActualMatch:', isActualMatch, 'userSaid:', isMatch)
    const correct = isMatch === isActualMatch

    if (correct) {
      const newStreak = streak + 1
      setStreak(newStreak)
      setFeedback('correct')
      setTimeout(() => nextColor(historyRef.current, newStreak), 600)
    } else {
      setFeedback('wrong')
      setFinalStreak(streak)
      setTimeout(async () => {
        setPhase('result')
        if (profile?.name && streak > 0) {
          await supabase.from('nback_scores').insert({player_name:profile.name, level:streak})
          const {count} = await supabase.from('nback_scores').select('*',{count:'exact',head:true}).gt('level',streak)
          setWorldRank((count??0)+1)
          if (myBest===null || streak>myBest) setMyBest(streak)
        }
      }, 800)
    }
  }, [phase, history, streak, nLevel, profile?.name, myBest, nextColor])

  const saveScore = async () => {
    if (!name.trim() || pin.join('').length!==4) return
    setSaving(true)
    setSaveError('')
    const pinHash = btoa(pin.join(''))
    const {data:existing} = await supabase.from('profiles').select('password_hash').eq('player_name',name.trim()).maybeSingle()
    if (existing) {
      if (existing.password_hash !== pinHash) { setSaveError('Wrong PIN'); setSaving(false); return }
    } else {
      await supabase.from('profiles').insert({player_name:name.trim(), password_hash:pinHash})
    }
    await supabase.from('nback_scores').insert({player_name:name.trim(), level:finalStreak})
    const {count} = await supabase.from('nback_scores').select('*',{count:'exact',head:true}).gt('level',finalStreak)
    setWorldRank((count??0)+1)
    setSaving(false)
    setSaved(true)
    localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
    setTimeout(() => window.location.reload(), 1500)
  }

  const reset = () => { setPhase('rules'); setSaved(false); loadData() }

  const resultColor = finalStreak >= 10 ? '#00C853' : finalStreak >= 5 ? '#FF6F00' : '#D32F2F'
  const bgResult = finalStreak >= 10 ? '#0D3320' : finalStreak >= 5 ? '#2D1A00' : '#1A0000'

  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
        <div style={{ width:60, height:60, background:'rgba(255,255,255,0.06)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>🧠</div>
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>N-Back</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Does it match the previous color?</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:'14px', marginBottom:20 }}>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>
          A color appears, then another. Press <span style={{ color:'#69F0AE', fontWeight:900 }}>Match</span> if it's the same as the previous one, or <span style={{ color:'#FF5252', fontWeight:900 }}>Different</span> if not. How many can you get right in a row?
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${worldRecord.level} streak` : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? `${myBest} streak` : '—'}</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.level} streak</div>
          </div>
        ))}
      </div>
      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:PURPLE, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 8px 0 ${PURPLE}80`, marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  if (phase === 'show' || phase === 'answer') return (
    <main style={{ height:'100dvh', background:'#0A0A0A', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:28, padding:'24px' }}>
      <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase' }}>
        Streak: {streak}
      </div>

      {/* Color always visible */}
      <div style={{ width:160, height:160, borderRadius:32, background:COLORS[current].color, boxShadow:`0 0 40px ${COLORS[current].color}60`, transition:'background 0.2s' }} />

      {feedback && (
        <div style={{ fontSize:22, fontWeight:900, color:feedback==='correct'?'#69F0AE':'#FF5252' }}>
          {feedback==='correct'?'✓ Correct!':'✗ Wrong!'}
        </div>
      )}

      {phase === 'answer' && !feedback && (
        <>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Same as the previous color?</div>
          <div style={{ display:'flex', gap:12, width:'100%' }}>
            <button onClick={() => handleAnswer(true)} style={{ flex:1, padding:'20px', borderRadius:18, border:'none', background:'rgba(105,240,174,0.15)', color:'#69F0AE', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', outline:'2px solid rgba(105,240,174,0.3)' }}>
              Match ✓
            </button>
            <button onClick={() => handleAnswer(false)} style={{ flex:1, padding:'20px', borderRadius:18, border:'none', background:'rgba(255,82,82,0.15)', color:'#FF5252', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', outline:'2px solid rgba(255,82,82,0.3)' }}>
              Different ✗
            </button>
          </div>
        </>
      )}

      {phase === 'show' && (
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Memorize this color...</div>
      )}
    </main>
  )

  return (
    <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Streak</div>
        <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2 }}>{finalStreak}</div>
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
        <button onClick={()=>{setSaved(false);startGame()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:PURPLE, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 5px 0 ${PURPLE}80` }}>Play again →</button>
      </div>
    </main>
  )
}
