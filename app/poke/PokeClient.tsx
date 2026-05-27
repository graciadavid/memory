'use client'
import { useState, useEffect, useRef } from 'react'
import AuthModal from '@/components/AuthModal'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const GREEN = '#2E7D32'
const GOLD = '#C8960C'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const INGREDIENTS = [
  { id: 'aguacate', label: 'Avocado', img: `${BASE}/aguacate.png` },
  { id: 'arroz', label: 'Rice', img: `${BASE}/arroz.png` },
  { id: 'atun', label: 'Tuna', img: `${BASE}/atun.png` },
  { id: 'cebolla', label: 'Onion', img: `${BASE}/cebolla.png` },
  { id: 'edamame', label: 'Edamame', img: `${BASE}/edamame.png` },
  { id: 'mango', label: 'Mango', img: `${BASE}/mango.png` },
  { id: 'pepino', label: 'Cucumber', img: `${BASE}/pepino.png` },
  { id: 'salmon', label: 'Salmon', img: `${BASE}/salmon.png` },
  { id: 'zanahoria', label: 'Carrot', img: `${BASE}/zanahoria.png` },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type Phase = 'idle' | 'memorize' | 'guess' | 'correct' | 'wrong' | 'over'

export default function PokeClient() {
  const { profile } = usePlayer()
  const [saved, setSaved] = useState(false)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [level, setLevel] = useState(1)
  const [bowl, setBowl] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(8)
  const [totalTime, setTotalTime] = useState(8)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [top5, setTop5] = useState<any[]>([])
  const timerRef = useRef<any>(null)

  useEffect(() => {
    supabase.from('poke_scores').select('player_name, level').order('level', { ascending: false }).limit(200)
      .then(({ data }) => {
        if (!data) return
        const best: Record<string, number> = {}
        data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
        const sorted = Object.entries(best).sort((a, b) => b[1] - a[1]).slice(0, 5)
        setTop5(sorted.map(([name, level]) => ({ name, level })))
      })
  }, [])

  const startLevel = (lvl: number) => {
    const count = Math.min(3 + lvl, 9)
    const time = Math.max(3, 8 - Math.max(0, count - 5))
    const picked = shuffle(INGREDIENTS).slice(0, count).map(i => i.id)
    setBowl(picked)
    setSelected([])
    setTimeLeft(time)
    setTotalTime(time)
    setPhase('memorize')
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setPhase('guess')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const startGame = () => {
    setWorldRank(null)
    setLevel(1)
    startLevel(1)
  }

  const handleSelect = async (id: string) => {
    if (phase !== 'guess') return
    if (selected.includes(id)) return
    if (!bowl.includes(id)) {
      clearInterval(timerRef.current)
      setPhase('wrong')
      supabase.from('poke_scores').select('*', { count: 'exact', head: true }).gt('level', level - 1)
        .then(({ count }) => setWorldRank((count || 0) + 1))
      return
    }
    const newSelected = [...selected, id]
    setSelected(newSelected)
    if (newSelected.length === bowl.length) {
      setPhase('correct')
      if (profile?.name) {
        await supabase.from('poke_scores').insert({ player_name: profile.name, level })
      }
      setTimeout(() => {
        const nextLevel = level + 1
        setLevel(nextLevel)
        startLevel(nextLevel)
      }, 800)
    }
  }

  if (phase === 'idle') return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
        <img src={`${BASE}/salmon.png`} style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Poke</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Remember the bowl ingredients</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{top5[0] ? `Level ${top5[0].level}` : '—'}</div>
          {top5[0] && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{top5[0].name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{profile?.name && top5.find(t => t.name === profile.name) ? `Level ${top5.find(t => t.name === profile.name)!.level}` : '—'}</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p, i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>Level {p.level}</div>
          </div>
        ))}
      </div>
      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'var(--font-nunito), sans-serif', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080', marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  if (phase === 'wrong') return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <div style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:4 }}>Game Over</div>
        <div style={{ fontSize:48, fontWeight:900, color:GOLD, marginBottom:4 }}>Level {level}</div>
        {worldRank && <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>#{worldRank} in the world</div>}
      </div>
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
          {bowl.map(id => {
            const ing = INGREDIENTS.find(i => i.id === id)!
            return (
              <div key={id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, background:'rgba(46,125,50,0.15)', borderRadius:14, padding:'10px 8px', border:'1px solid rgba(105,240,174,0.3)', minWidth:64 }}>
                <img src={ing.img} style={{ width:44, height:44, objectFit:'contain' }} />
                <div style={{ fontSize:9, fontWeight:800, color:'#69F0AE' }}>{ing.label}</div>
              </div>
            )
          })}
        </div>
      </div>
      {!profile?.name && !saved && (
        <div style={{ marginBottom:16 }}>
          <AuthModal onSuccess={async (playerName) => {
            await supabase.from('poke_scores').insert({ player_name: playerName, level })
            setSaved(true)
          }} title="Save your result" subtitle="Free · No email needed" />
        </div>
      )}
      {profile?.name && !saved && (
        <button onClick={async () => {
          await supabase.from('poke_scores').insert({ player_name: profile.name, level })
          setSaved(true)
        }} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:12 }}>
          Save Score
        </button>
      )}
      {saved && <div style={{ fontSize:13, color:'#69F0AE', fontWeight:800, textAlign:'center', marginBottom:12 }}>✓ Saved!</div>}

      <div style={{ display:'flex', gap:10 }}>
        <a href="/memory-hub" style={{ flex:1, textDecoration:'none', display:'block', padding:'14px', borderRadius:14, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', fontSize:14, fontWeight:900, textAlign:'center' }}>← Memory</a>
        <button onClick={startGame} style={{ flex:2, padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Play Again →</button>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'16px 20px 100px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>LEVEL {level}</div>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>{bowl.length} INGREDIENTS</div>
      </div>
      {phase === 'memorize' && (
        <div style={{ marginBottom:20 }}>
          <div style={{ height:6, background:'rgba(255,255,255,0.1)', borderRadius:6, overflow:'hidden' }}>
            <div style={{ height:'100%', background:GREEN, borderRadius:6, width:`${(timeLeft/totalTime)*100}%`, transition:'width 1s linear' }} />
          </div>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', textAlign:'center', marginTop:6 }}>Memorize the bowl — {timeLeft}s</div>
        </div>
      )}
      {phase === 'guess' && (
        <div style={{ marginBottom:20, textAlign:'center' }}>
          <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.5)' }}>Select the {bowl.length} ingredients from the bowl</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:4 }}>{selected.length} / {bowl.length} selected</div>
        </div>
      )}
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:24, padding:'20px', marginBottom:24, border:'1px solid rgba(255,255,255,0.08)', minHeight:120, display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center', alignItems:'center' }}>
        {phase === 'memorize' ? (
          bowl.map(id => {
            const ing = INGREDIENTS.find(i => i.id === id)!
            return <img key={id} src={ing.img} style={{ width:56, height:56, objectFit:'contain' }} />
          })
        ) : (
          <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.2)' }}>
            {phase === 'correct' ? '✓ Correct!' : 'What was in the bowl?'}
          </div>
        )}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, marginBottom:24 }}>
        {INGREDIENTS.map(ing => {
          const isSelected = selected.includes(ing.id)
          return (
            <button key={ing.id} onPointerDown={() => handleSelect(ing.id)}
              style={{ background: isSelected ? 'rgba(46,125,50,0.3)' : 'rgba(255,255,255,0.06)', borderRadius:16, padding:'12px 8px', border: isSelected ? '2px solid #69F0AE' : '2px solid rgba(255,255,255,0.08)', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <img src={ing.img} style={{ width:48, height:48, objectFit:'contain' }} />
              <div style={{ fontSize:10, fontWeight:800, color: isSelected ? '#69F0AE' : 'rgba(255,255,255,0.5)', textAlign:'center' }}>{ing.label}</div>
            </button>
          )
        })}
      </div>
    </main>
  )
}
