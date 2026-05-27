'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import AuthModal from '@/components/AuthModal'
import { supabase } from '@/lib/supabase'
import { updateStreak } from '@/lib/streak'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

type Phase = 'rules' | 'countdown' | 'running' | 'result'

export default function StopPage() {
  const { profile, createProfile } = usePlayer()
  const [showSavePopup, setShowSavePopup] = useState(false)
  const hasRegistered = useRef(false)
  const [phase, setPhase] = useState<Phase>('rules')
  const [countdown, setCountdown] = useState(3)
  const [elapsed, setElapsed] = useState(0)
  const [difference, setDifference] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [worldRecord, setWorldRecord] = useState<{diff:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,diff:number}[]>([])
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [playCount, setPlayCount] = useState(0)
  const [showSharePopup, setShowSharePopup] = useState(false)
  const [saving, setSaving] = useState(false)
  const [playerCount] = useState(() => Math.floor(Math.random() * (62 - 31 + 1)) + 31)
  const [blink, setBlink] = useState(true)
  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 600); return () => clearInterval(t) }, [])
  const [saveError, setSaveError] = useState('')
  const startRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    if (profile?.name) setName(profile.name)
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    const {data:all} = await supabase.from('precision_scores').select('player_name,difference_ms').is('game_type',null).order('difference_ms',{ascending:true}).limit(5000)
    if (!all) return
    const best:Record<string,number> = {}
    all.forEach((s:any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
    const sorted = Object.entries(best).map(([n,d]) => ({name:n, diff:d as number})).sort((a,b) => a.diff-b.diff)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({diff:sorted[0].diff, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
  }

  const startCountdown = () => {
    setPhase('countdown')
    setCountdown(3)
    let c = 3
    const t = setInterval(() => { c--; if (c===0){clearInterval(t);startGame()}else setCountdown(c) }, 1000)
  }

  const startGame = () => {
    startRef.current = performance.now()
    setElapsed(0)
    setPhase('running')
    const tick = () => { setElapsed(performance.now()-startRef.current); rafRef.current = requestAnimationFrame(tick) }
    rafRef.current = requestAnimationFrame(tick)
  }

  const stopGame = useCallback(async () => {
    if (phase !== 'running') return
    cancelAnimationFrame(rafRef.current)
    const total = performance.now() - startRef.current
    const diff = Math.round(total - 5000)
    setDifference(diff)
    setPlayCount(c => {
      const next = c + 1
      if (next === 5) setShowSharePopup(true)
      return next
    })
    setPhase('result')
   const {count: rankCount} = await supabase.from('precision_scores').select('*',{count:'exact',head:true}).is('game_type',null).lt('difference_ms',Math.abs(diff))
   setWorldRank((rankCount??0)+1)
   if (!profile?.name && !hasRegistered.current) setTimeout(() => setShowSavePopup(true), 800)
    if (profile?.name) {
      await supabase.from('precision_scores').insert({player_name:profile.name, difference_ms:Math.abs(diff), game_type:null})
      const {count} = await supabase.from('precision_scores').select('*',{count:'exact',head:true}).is('game_type',null).lt('difference_ms',Math.abs(diff))
      setWorldRank((count??0)+1)
      if (myBest===null || Math.abs(diff)<myBest) setMyBest(Math.abs(diff))
      await updateStreak(profile.name)
    }
  }, [phase, profile?.name, myBest])

  const saveScore = async () => {
    if (!name.trim() || pin.join('').length!==4) return
    setSaving(true)
    setSaveError('')
    const pinHash = btoa(pin.join(''))
    const {data:existing} = await supabase.from('profiles').select('password_hash').eq('player_name', name.trim()).maybeSingle()
    if (existing) {
      if (existing.password_hash !== pinHash) {
        setSaveError('Wrong PIN for this name')
        setSaving(false)
        return
      }
    } else {
      await supabase.from('profiles').insert({player_name:name.trim(), password_hash:pinHash})
    }
    await supabase.from('precision_scores').insert({player_name:name.trim(), difference_ms:Math.abs(difference), game_type:null})
    const {count} = await supabase.from('precision_scores').select('*',{count:'exact',head:true}).is('game_type',null).lt('difference_ms',Math.abs(difference))
    setWorldRank((count??0)+1)
    setSaving(false)
    setSaved(true)
    createProfile(name.trim())
    
  }

  const fmt = (ms:number) => `${Math.floor(ms/1000)}.${String(Math.floor(ms%1000)).padStart(3,'0')}`
  const absDiff = Math.abs(difference)
  const resultColor = absDiff < 200 ? '#00C853' : absDiff < 500 ? '#FF6F00' : '#D32F2F'
  const bgResult = absDiff < 200 ? '#0D3320' : absDiff < 500 ? '#2D1A00' : '#1A0000'

  if (phase === 'rules') return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <img src={`${BASE}/precision.png`} style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Stop</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Stop at exactly 5.000s</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${(worldRecord.diff/1000).toFixed(3)}s` : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? `${(myBest/1000).toFixed(3)}s` : '—'}</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{(p.diff/1000).toFixed(3)}s</div>
          </div>
        ))}
      </div>
      <button onClick={startCountdown} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080', marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  if (phase === 'countdown') return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontSize:160, fontWeight:900, color:'#fff' }}>{countdown}</div>
    </main>
  )

  if (phase === 'running') return (
    <main onClick={stopGame} style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', gap:8 }}>
      <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.25)', letterSpacing:3, textTransform:'uppercase' }}>Target</div>
      <div style={{ fontSize:80, fontWeight:900, color:'#00C853', fontVariantNumeric:'tabular-nums', letterSpacing:-2 }}>5.00</div>
      <div style={{ width:60, height:2, background:'rgba(255,255,255,0.1)', margin:'8px 0' }} />
      <div style={{ fontSize:80, fontWeight:900, color:'#fff', fontVariantNumeric:'tabular-nums', letterSpacing:-2 }}>{fmt(elapsed)}</div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.15)', fontWeight:700, marginTop:24 }}>Tap anywhere to stop</div>
    </main>
  )

 if (showSavePopup) return (
   <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center', padding:'24px', fontFamily:'var(--font-nunito), sans-serif' }}>
     <div style={{ background:'#1C1C1E', borderRadius:24, padding:'28px 24px', width:'100%', maxWidth:400, border:'1px solid rgba(255,255,255,0.1)', textAlign:'center', animation:'slideUp 0.3s ease' }}>
       <button onClick={() => setShowSavePopup(false)} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', color:'rgba(255,255,255,0.3)', fontSize:20, cursor:'pointer' }}>✕</button>
       <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>You are</div>
       <div style={{ fontSize:64, fontWeight:900, color:'#C8960C', lineHeight:1, marginBottom:4 }}>#{worldRank}</div>
       <div style={{ fontSize:16, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:24 }}>in the world</div>
       <AuthModal onSuccess={async (playerName) => {
         await supabase.from('precision_scores').insert({player_name: playerName, difference_ms: Math.abs(difference), game_type: null})
         setShowSavePopup(false)
         setSaved(true)
       }} title="Save your result" subtitle="Free · No email needed" />
     </div>
   </div>
 )
 if (showSharePopup) return (
   <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', fontFamily:'var(--font-nunito), sans-serif' }}>
     <div style={{ background:'#1C1C1E', borderRadius:24, padding:'28px 24px', width:'100%', maxWidth:360, border:'1px solid rgba(255,255,255,0.1)', textAlign:'center' }}>
       <div style={{ fontSize:40, marginBottom:8 }}>🔥</div>
       <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:8 }}>You're on fire!</div>
       <div style={{ fontSize:14, color:'rgba(255,255,255,0.5)', fontWeight:700, marginBottom:24 }}>5 games played. Challenge your friends to beat your score!</div>
       <button onClick={() => { supabase.from('events').insert({ event:'stop_share', player_name: profile?.name || 'anonymous' }); if (navigator.share) { navigator.share({ title:'Stop — MemGenius', text:'Can you stop at exactly 5 seconds? Try to beat me at memgenius.com/stop', url:'https://memgenius.com/stop' }) } else { navigator.clipboard.writeText('https://memgenius.com/stop'); alert('Link copied!') } }} style={{ width:'100%', padding:'16px', borderRadius:16, border:'none', background:'#2E7D32', color:'#fff', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:10 }}>🔗 Challenge a Friend</button>
       <button onClick={() => setShowSharePopup(false)} style={{ width:'100%', padding:'12px', borderRadius:16, border:'none', background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Keep Playing</button>
     </div>
   </div>
 )
  return (
    <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Difference from 5.000s</div>
        <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2 }}>
          {difference>0?'+':''}{(difference/1000).toFixed(3)}s
        </div>
        {worldRank && <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:8 }}>#{worldRank} in the world</div>}
      </div>
      {/* Championship Banner */}
      <a href="/championship" style={{ textDecoration:'none', display:'block', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', borderRadius:16, padding:'14px 18px', marginBottom:12, boxShadow:'0 4px 0 rgba(100,70,0,0.5)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/winner.png" style={{ width:36, height:36, objectFit:'contain' }} />
          <div>
            <div style={{ fontSize:10, fontWeight:800, color:'rgba(0,0,0,0.5)', letterSpacing:2, textTransform:'uppercase' }}>Sunday Championship</div>
            <div style={{ fontSize:14, fontWeight:900, color:'#000' }}>This game is featured this Sunday →</div>
          </div>
        </div>
      </a>

      {saved && (
        <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:16, padding:'16px 20px', textAlign:'center' }}>
          <div style={{ fontSize:16, fontWeight:900, color:'#69F0AE' }}>✓ Score saved!</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:4 }}>#{worldRank} in the world</div>
        </div>
      )}

      <div style={{ display:'flex', gap:10, width:'100%' }}>
        <button onClick={()=>{setPhase('rules');setSaved(false);loadData()}} style={{ flex:1, padding:'16px', borderRadius:16, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
        <button onClick={()=>{setSaved(false);setPhase('rules');loadData()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E2080' }}>Play again →</button>
      </div>
    </main>
  )
}
