'use client'
import { useState, useEffect, useRef } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { updateStreak } from '@/lib/streak'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GRID_SIZE = 5
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE

function getLevelConfig(level: number) {
  return {
    cells: Math.min(2 + level, 20),
    flashDuration: Math.max(500, 2000 - level * 100),
    previewDelay: 800,
  }
}

function generatePattern(count: number): number[] {
  const all = Array.from({length: TOTAL_CELLS}, (_,i) => i)
  const shuffled = all.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

type Phase = 'rules' | 'preview' | 'flash' | 'input' | 'result'

export default function BlinkClient() {
  const { profile, createProfile } = usePlayer()
 const [champGame, setChampGame] = useState<string|null>(null)
 useEffect(() => {
   supabase.from('championship_weeks').select('game').eq('active', true).single()
     .then(({data}:any) => { if (data?.game) setChampGame(data.game) })
 }, [])
  const [phase, setPhase] = useState<Phase>('rules')
  const [level, setLevel] = useState(1)
  const [pattern, setPattern] = useState<number[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [showFlash, setShowFlash] = useState(false)
  const [won, setWon] = useState(false)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [worldRecord, setWorldRecord] = useState<{level:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,level:number}[]>([])
  const [saveName, setSaveName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (profile?.name) setSaveName(profile.name)
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('blink_scores').select('player_name,level').order('level', { ascending: false }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
    const sorted = Object.entries(best).map(([n,l]) => ({name:n, level:l as number})).sort((a,b) => b.level-a.level)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({level:sorted[0].level, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
  }

  const startLevel = (lvl: number) => {
    const config = getLevelConfig(lvl)
    const p = generatePattern(config.cells)
    setPattern(p)
    setSelected([])
    setShowFlash(false)
    setPhase('preview')

    // Countdown then flash
    setCountdown(3)
    let c = 3
    const countInterval = setInterval(() => {
      c--
      setCountdown(c)
      if (c <= 0) {
        clearInterval(countInterval)
        setShowFlash(true)
        setPhase('flash')
        setTimeout(() => {
          setShowFlash(false)
          setPhase('input')
        }, config.flashDuration)
      }
    }, 1000)
  }

  const startGame = () => {
    setLevel(1)
    setSaved(false)
    setWorldRank(null)
    startLevel(1)
  }

  const toggleCell = (idx: number) => {
    if (phase !== 'input') return
    setSelected(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  const submitAnswer = async () => {
    const config = getLevelConfig(level)
    const correct = pattern.every(p => selected.includes(p)) && selected.length === pattern.length
    setWon(correct)
    setPhase('result')

    if (correct) {
      if (profile?.name) {
        await supabase.from('blink_scores').insert({player_name:profile.name, level})
        const {count} = await supabase.from('blink_scores').select('*',{count:'exact',head:true}).gt('level',level)
        setWorldRank((count??0)+1)
        if (myBest===null || level>myBest) setMyBest(level)
        await updateStreak(profile.name)
      }
    } else {
      if (profile?.name && level > 1) {
        await supabase.from('blink_scores').insert({player_name:profile.name, level:level-1})
      }
    }
  }

  const saveScore = async () => {
    if (!saveName.trim() || pin.join('').length!==4) return
    setSaving(true); setSaveError('')
    const pinHash = btoa(pin.join(''))
    const {data:existing} = await supabase.from('profiles').select('password_hash').eq('player_name',saveName.trim()).maybeSingle()
    if (existing) {
      if (existing.password_hash !== pinHash) { setSaveError('Wrong PIN'); setSaving(false); return }
    } else {
      await supabase.from('profiles').insert({player_name:saveName.trim(), password_hash:pinHash})
    }
    await supabase.from('blink_scores').insert({player_name:saveName.trim(), level})
    setSaving(false); setSaved(true)
    createProfile(saveName.trim())
    setTimeout(() => window.location.reload(), 1500)
  }

  const reset = () => { setPhase('rules'); setSaved(false); loadData() }
  const nextLevel = () => {
    const next = level + 1
    setLevel(next)
    window.scrollTo(0,0)
    startLevel(next)
  }

  const cellSize = `calc((min(100vw, 430px) - 48px) / ${GRID_SIZE})`

  // Rules
  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <img src={`${BASE}/blink.png`} style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Blink</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Remember the grid</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `Lvl ${worldRecord.level}` : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest ? `Lvl ${myBest}` : '—'}</div>
        </div>
      </div>

      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>Lvl {p.level}</div>
          </div>
        ))}
      </div>

      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080', marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  // Preview / Flash / Input
  if (phase === 'preview' || phase === 'flash' || phase === 'input') return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', padding:'16px 24px 80px', overflow:'hidden' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', marginBottom:20 }}>
        <button onClick={reset} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>Level {level}</div>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)' }}>{getLevelConfig(level).cells} cells</div>
        </div>
        <div style={{ width:50 }} />
      </div>

      {phase === 'preview' && (
        <div style={{ fontSize:80, fontWeight:900, color:'#fff', marginBottom:20 }}>{countdown}</div>
      )}

      {phase === 'flash' && (
        <div style={{ fontSize:20, fontWeight:900, color:GOLD, marginBottom:20 }}>Remember!</div>
      )}

      {phase === 'input' && (
        <div style={{ fontSize:16, fontWeight:800, color:'rgba(255,255,255,0.5)', marginBottom:20 }}>Tap the cells that lit up</div>
      )}

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${GRID_SIZE}, ${cellSize})`, gap:6, marginBottom:24 }}>
        {Array.from({length:TOTAL_CELLS}, (_,i) => {
          const isPattern = pattern.includes(i)
          const isSelected = selected.includes(i)
          let bg = 'rgba(255,255,255,0.06)'
          let border = '1px solid rgba(255,255,255,0.08)'

          if (phase === 'flash' && isPattern) {
            bg = GOLD
            border = `1px solid ${GOLD}`
          } else if (phase === 'input' && isSelected) {
            bg = 'rgba(200,150,12,0.3)'
            border = `1px solid ${GOLD}`
          }

          return (
            <div key={i} onClick={() => toggleCell(i)} style={{
              width: cellSize, height: cellSize,
              borderRadius: 8, background: bg, border,
              cursor: phase === 'input' ? 'pointer' : 'default',
              transition: 'all 0.15s',
            }} />
          )
        })}
      </div>

      {phase === 'input' && (
        <button onClick={submitAnswer} disabled={selected.length === 0} style={{ width:'100%', padding:'18px', borderRadius:16, border:'none', background:selected.length>0?GREEN:'rgba(255,255,255,0.1)', color:'#fff', fontSize:18, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:selected.length>0?'0 6px 0 #1B5E2080':'none' }}>
          Submit →
        </button>
      )}
    </main>
  )

  // Result
  const bgResult = won ? '#0D3320' : '#1A0000'
  return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px' }}>
      <div style={{ background:bgResult, borderRadius:24, padding:'28px', width:'100%', border:'1px solid rgba(255,255,255,0.08)', textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:8 }}>{won ? '✓' : '✗'}</div>
        <div style={{ fontSize:22, fontWeight:900, color:won?'#69F0AE':'#FF5252', marginBottom:4 }}>
          {won ? `Level ${level} complete!` : 'Wrong!'}
        </div>
        <div style={{ fontSize:15, color:'rgba(255,255,255,0.5)', fontWeight:700, marginBottom:20 }}>
          {won ? `You remembered ${getLevelConfig(level).cells} cells` : `You needed to remember ${getLevelConfig(level).cells} cells`}
        </div>

        {worldRank && won && <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:16 }}>#{worldRank} in the world</div>}

        {saved && <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:10, padding:'8px', marginBottom:16 }}><div style={{ fontSize:13, fontWeight:900, color:'#69F0AE' }}>✓ Saved!</div></div>}

        {/* Show correct pattern on failure */}
        {!won && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Correct pattern</div>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${GRID_SIZE}, 1fr)`, gap:3, maxWidth:160, margin:'0 auto' }}>
              {Array.from({length:TOTAL_CELLS}, (_,i) => (
                <div key={i} style={{ aspectRatio:'1', borderRadius:3, background: pattern.includes(i) ? GOLD : 'rgba(255,255,255,0.05)' }} />
              ))}
            </div>
          </div>
        )}

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={reset} style={{ flex:1, padding:'14px', borderRadius:14, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
          {won
            ? <button onClick={nextLevel} style={{ flex:2, padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E2080' }}>Level {level+1} →</button>
            : <button onClick={startGame} style={{ flex:2, padding:'14px', borderRadius:14, border:'none', background:'#C62828', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Try again →</button>
          }
        </div>
      </div>
    </main>
  )
}
