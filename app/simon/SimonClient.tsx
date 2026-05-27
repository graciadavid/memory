'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { updateStreak } from '@/lib/streak'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const PURPLE = '#7B1FA2'

const COLORS = [
  { id: 0, color: '#E53935', shadow: '#B71C1C' },
  { id: 1, color: '#43A047', shadow: '#1B5E20' },
  { id: 2, color: '#1E88E5', shadow: '#0D47A1' },
  { id: 3, color: '#FDD835', shadow: '#F57F17' },
]

type Phase = 'rules' | 'showing' | 'input' | 'result'

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

export default function SimonClient() {
  const { profile, createProfile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState<number[]>([])
  const [activeColor, setActiveColor] = useState<number | null>(null)
  const [level, setLevel] = useState(1)
  const [finalLevel, setFinalLevel] = useState(0)
  const [worldRecord, setWorldRecord] = useState<{level:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,level:number}[]>([])
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (profile?.name) setName(profile.name)
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('sequence_scores').select('player_name,level').order('level', { ascending: false }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
    const sorted = Object.entries(best).map(([n,l]) => ({name:n, level:l as number})).sort((a,b) => b.level-a.level)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({level:sorted[0].level, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
  }

  const showSequence = useCallback((seq: number[]) => {
    setPhase('showing')
    setActiveColor(null)
    let i = 0
    const next = () => {
      if (i >= seq.length) { setPhase('input'); setUserInput([]); return }
      setTimeout(() => {
        setActiveColor(seq[i])
        setTimeout(() => { setActiveColor(null); i++; setTimeout(next, 200) }, 500)
      }, 200)
    }
    setTimeout(next, 600)
  }, [])

  const startGame = () => {
    const first = [Math.floor(Math.random() * 4)]
    setSequence(first)
    setLevel(1)
    setUserInput([])
    showSequence(first)
  }

  const handlePress = useCallback(async (colorId: number) => {
    if (phase !== 'input') return
    const newInput = [...userInput, colorId]
    setUserInput(newInput)
    setActiveColor(colorId)
    setTimeout(() => setActiveColor(null), 200)
    const idx = newInput.length - 1
    if (newInput[idx] !== sequence[idx]) {
      const fl = level - 1
      setFinalLevel(fl)
      setTimeout(async () => {
        setPhase('result')
        if (profile?.name && fl > 0) {
          await supabase.from('sequence_scores').insert({player_name:profile.name, level:fl})
          const {count} = await supabase.from('sequence_scores').select('*',{count:'exact',head:true}).gt('level',fl)
          setWorldRank((count??0)+1)
          if (myBest===null || fl>myBest) setMyBest(fl)
          await updateStreak(profile.name)
        }
      }, 500)
      return
    }
    if (newInput.length === sequence.length) {
      const nextSeq = [...sequence, Math.floor(Math.random() * 4)]
      setSequence(nextSeq)
      setLevel(l => l + 1)
      setTimeout(() => showSequence(nextSeq), 800)
    }
  }, [phase, userInput, sequence, level, profile?.name, myBest, showSequence])

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
    await supabase.from('sequence_scores').insert({player_name:name.trim(), level:finalLevel})
    const {count} = await supabase.from('sequence_scores').select('*',{count:'exact',head:true}).gt('level',finalLevel)
    setWorldRank((count??0)+1)
    setSaving(false)
    setSaved(true)
    createProfile(name.trim())
    setTimeout(() => window.location.reload(), 1500)
  }

  const reset = () => { setPhase('rules'); setSaved(false); loadData() }

  const resultColor = finalLevel >= 10 ? '#00C853' : finalLevel >= 5 ? '#FF6F00' : '#D32F2F'
  const bgResult = finalLevel >= 10 ? '#0D3320' : finalLevel >= 5 ? '#2D1A00' : '#1A0000'

  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/sequence.png" style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Simon Says</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Repeat the color sequence</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `Level ${worldRecord.level}` : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? `Level ${myBest}` : '—'}</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>Level {p.level}</div>
          </div>
        ))}
      </div>
      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:PURPLE, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #4A148C80', marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  if (phase === 'showing' || phase === 'input') return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, padding:'24px' }}>
      <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase' }}>
        {phase === 'showing' ? `Level ${level} — Watch` : `Level ${level} — Your turn`}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, width:'100%', maxWidth:280 }}>
        {COLORS.map(c => (
          <button key={c.id} onClick={() => handlePress(c.id)} disabled={phase==='showing'}
            style={{ height:120, borderRadius:20, border:'none', background: activeColor===c.id ? c.color : `${c.color}44`, cursor: phase==='input'?'pointer':'default', boxShadow: activeColor===c.id ? `0 0 30px ${c.color}` : 'none', transition:'all 0.1s' }} />
        ))}
      </div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.15)', fontWeight:700 }}>
        {phase === 'showing' ? 'Watch the sequence...' : `${userInput.length} / ${sequence.length}`}
      </div>
    </main>
  )

  return (
    <main style={{ minHeight:'100dvh', background:bgResult, fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px 100px', gap:20, overflowY:'auto' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Best level reached</div>
        <div style={{ fontSize:80, fontWeight:900, color:resultColor, letterSpacing:-2 }}>{finalLevel}</div>
        {worldRank && <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, marginTop:8 }}>#{worldRank} in the world</div>}
      </div>
        <a href="/profile" style={{ textDecoration:'none', display:'block', width:'100%' }}>
          <div style={{ background:'rgba(200,150,12,0.15)', borderRadius:20, padding:'20px', textAlign:'center', border:'1px solid rgba(200,150,12,0.3)' }}>
            <div style={{ fontSize:16, fontWeight:900, color:'#C8960C', marginBottom:4 }}>Save your result →</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Create a free profile to track your scores</div>
          </div>
        </a>
      )}
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
      {saved && <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:16, padding:'16px 20px', textAlign:'center' }}><div style={{ fontSize:16, fontWeight:900, color:'#69F0AE' }}>✓ Score saved!</div></div>}
      <div style={{ display:'flex', gap:10, width:'100%' }}>
        <button onClick={reset} style={{ flex:1, padding:'16px', borderRadius:16, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
        <button onClick={()=>{setSaved(false);startGame()}} style={{ flex:2, padding:'16px', borderRadius:16, border:'none', background:PURPLE, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #4A148C80' }}>Play again →</button>
      </div>
    </main>
  )
}
