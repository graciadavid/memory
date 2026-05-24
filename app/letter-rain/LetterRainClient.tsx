'use client'
import { useState, useEffect, useRef } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { updateStreak } from '@/lib/streak'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function fmtTime(ms: number) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`
}

type Phase = 'rules' | 'playing' | 'answer' | 'result'

interface FallingLetter {
  id: number
  letter: string
  x: number
  y: number
  speed: number
  size: number
  isTarget: boolean
}

function getLevelConfig(level: number) {
  return {
    duration: Math.max(6000, 12000 - level * 500),
    letterCount: 10 + level * 2,
    targetRatio: 0.25,
    speed: 0.5 + level * 0.15,
    confuserLetters: level >= 5 ? 1 : 0,
  }
}

function getTargetLetter(level: number): string {
  const easy = ['A', 'O', 'I', 'E', 'U']
  const medium = ['B', 'C', 'D', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T']
  const hard = ['J', 'Q', 'V', 'W', 'X', 'Y', 'Z']
  if (level <= 2) return easy[level % easy.length]
  if (level <= 6) return medium[(level - 3) % medium.length]
  return hard[(level - 7) % hard.length]
}

function getConfuser(target: string): string {
  const confusers: Record<string, string> = {
    'M': 'N', 'N': 'M', 'B': 'D', 'D': 'B', 'P': 'Q', 'Q': 'P',
    'I': 'L', 'L': 'I', 'O': 'Q', 'V': 'W', 'W': 'V', 'U': 'V',
    'C': 'G', 'G': 'C', 'S': 'Z', 'Z': 'S',
  }
  return confusers[target] || 'X'
}

export default function LetterRainClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [level, setLevel] = useState(1)
  const [target, setTarget] = useState('A')
  const [letters, setLetters] = useState<FallingLetter[]>([])
  const [correctCount, setCorrectCount] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [worldRecord, setWorldRecord] = useState<{level:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,level:number}[]>([])
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [won, setWon] = useState(false)
  const animRef = useRef<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const letterIdRef = useRef(0)
  const activeLettersRef = useRef<FallingLetter[]>([])
  const countRef = useRef(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (profile?.name) setName(profile.name)
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('letter_rain_scores').select('player_name,level').order('level', { ascending: false }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
    const sorted = Object.entries(best).map(([n,l]) => ({name:n, level:l as number})).sort((a,b) => b.level-a.level)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({level:sorted[0].level, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
  }

  const startLevel = (lvl: number) => {
    const t = getTargetLetter(lvl)
    const config = getLevelConfig(lvl)
    setTarget(t)
    setLetters([])
    activeLettersRef.current = []
    countRef.current = 0
    setCorrectCount(0)
    setUserAnswer('')
    setTimeLeft(config.duration)
    setPhase('playing')

    // Spawn all letters staggered
    const spawnDelay = config.duration / config.letterCount
    for (let i = 0; i < config.letterCount; i++) {
      setTimeout(() => {
        const isTarget = Math.random() < config.targetRatio
        const isConfuser = !isTarget && config.confuserLetters > 0 && Math.random() < 0.2
        let letter = isTarget ? t : isConfuser ? getConfuser(t) : ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)]
        if (letter === t && !isTarget) letter = 'X'
        const newLetter: FallingLetter = {
          id: letterIdRef.current++,
          letter,
          x: 5 + Math.random() * 85,
          y: -10,
          speed: config.speed + Math.random() * 0.3,
          size: 24 + Math.random() * 14,
          isTarget: letter === t,
        }
        if (letter === t) countRef.current++
        activeLettersRef.current = [...activeLettersRef.current, newLetter]
        setLetters([...activeLettersRef.current])
      }, i * spawnDelay)
    }

    // Animate
    let start: number | null = null
    const animate = (ts: number) => {
      if (!start) start = ts
      const delta = ts - start
      start = ts

      activeLettersRef.current = activeLettersRef.current
        .map(l => ({ ...l, y: l.y + l.speed * (delta / 16) }))
        .filter(l => l.y < 110)
      setLetters([...activeLettersRef.current])
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)

    // End timer
    setTimeout(() => {
      endRound(countRef.current)
    }, config.duration)

    // Countdown
    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) { clearInterval(countdownInterval); return 0 }
        return prev - 100
      })
    }, 100)
  }

  const endRound = (count: number) => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    if (timerRef.current) clearTimeout(timerRef.current)
    setCorrectCount(count)
    setLetters([])
    activeLettersRef.current = []
    setPhase('answer')
  }

  const checkAnswer = async () => {
    const correct = parseInt(userAnswer) === correctCount
    setWon(correct)
    setPhase('result')

    if (correct) {
      const nextLevel = level + 1
      if (profile?.name) {
        await supabase.from('letter_rain_scores').insert({player_name: profile.name, level: nextLevel})
        const {count} = await supabase.from('letter_rain_scores').select('*',{count:'exact',head:true}).gt('level', nextLevel)
        setWorldRank((count??0)+1)
        if (myBest===null || nextLevel>myBest) setMyBest(nextLevel)
        await updateStreak(profile.name)
      }
    }
  }

  const saveScore = async () => {
    if (!name.trim() || pin.join('').length!==4) return
    setSaving(true); setSaveError('')
    const pinHash = btoa(pin.join(''))
    const {data:existing} = await supabase.from('profiles').select('password_hash').eq('player_name',name.trim()).maybeSingle()
    if (existing) {
      if (existing.password_hash !== pinHash) { setSaveError('Wrong PIN'); setSaving(false); return }
    } else {
      await supabase.from('profiles').insert({player_name:name.trim(), password_hash:pinHash})
    }
    const lvl = won ? level + 1 : level
    await supabase.from('letter_rain_scores').insert({player_name:name.trim(), level:lvl})
    const {count} = await supabase.from('letter_rain_scores').select('*',{count:'exact',head:true}).gt('level', lvl)
    setWorldRank((count??0)+1)
    setSaving(false); setSaved(true)
    localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
    setTimeout(() => window.location.reload(), 1500)
  }

  const reset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    if (timerRef.current) clearTimeout(timerRef.current)
    setPhase('rules')
    setLevel(1)
    setSaved(false)
    loadData()
  }

  const nextLevel = () => {
    const next = level + 1
    setLevel(next)
    startLevel(next)
  }

  // Rules screen
  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <div style={{ fontSize:48 }}>🌧️</div>
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Letter Rain</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Count the target letter as it falls</div>
        </div>
      </div>

      <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:'16px', marginBottom:20 }}>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:700, lineHeight:1.7 }}>
          Letters fall from the top. One letter is highlighted as your target. Count how many times it appears. At the end, type the number. Get it right to advance to the next level.
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

      <button onClick={() => { setLevel(1); startLevel(1) }} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080', marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  // Playing screen
  if (phase === 'playing') return (
    <main style={{ height:'100dvh', background:'#0d0d1a', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
      {/* Header */}
      <div style={{ padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:10 }}>
        <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>Level {level}</div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase' }}>Count the</div>
          <div style={{ fontSize:48, fontWeight:900, color:GOLD, lineHeight:1 }}>{target}</div>
        </div>
        <div style={{ fontSize:16, fontWeight:900, color:'rgba(255,255,255,0.6)' }}>{(timeLeft/1000).toFixed(1)}s</div>
      </div>

      {/* Progress bar */}
      <div style={{ height:3, background:'rgba(255,255,255,0.1)', margin:'0 20px' }}>
        <div style={{ height:'100%', background:GOLD, width:`${(timeLeft/getLevelConfig(level).duration)*100}%`, transition:'width 0.1s linear' }} />
      </div>

      {/* Letter rain area */}
      <div ref={gameAreaRef} style={{ flex:1, position:'relative', overflow:'hidden' }}>
        {letters.map(l => (
          <div key={l.id} style={{
            position:'absolute',
            left:`${l.x}%`,
            top:`${l.y}%`,
            fontSize:l.size,
            fontWeight:900,
            fontFamily:'var(--font-nunito), sans-serif',
            color: l.isTarget ? GOLD : 'rgba(255,255,255,0.5)',
            transform:'translateX(-50%)',
            userSelect:'none',
            transition:'none',
          }}>{l.letter}</div>
        ))}
      </div>
    </main>
  )

  // Answer screen
  if (phase === 'answer') return (
    <main style={{ height:'100dvh', background:'#0d0d1a', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px' }}>
      <div style={{ fontSize:64, fontWeight:900, color:GOLD, marginBottom:8 }}>{target}</div>
      <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:32 }}>How many did you count?</div>
      <input
        type="tel"
        value={userAnswer}
        onChange={e => setUserAnswer(e.target.value.replace(/\D/,''))}
        placeholder="0"
        autoFocus
        style={{ width:120, height:80, textAlign:'center', fontSize:40, fontWeight:900, borderRadius:20, border:'2px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.08)', color:'#fff', fontFamily:'inherit', outline:'none', marginBottom:24 }}
      />
      <button onClick={checkAnswer} disabled={!userAnswer} style={{ width:'100%', padding:'18px', borderRadius:16, border:'none', background:userAnswer?GREEN:'rgba(255,255,255,0.1)', color:'#fff', fontSize:18, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
        Submit →
      </button>
    </main>
  )

  // Result screen
  const isCorrect = won
  const bgResult = isCorrect ? '#0D3320' : '#1A0000'

  return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px' }}>
      <div style={{ background:bgResult, borderRadius:24, padding:'28px', width:'100%', border:'1px solid rgba(255,255,255,0.08)', textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:8 }}>{isCorrect ? '✓' : '✗'}</div>
        <div style={{ fontSize:22, fontWeight:900, color:isCorrect?'#69F0AE':'#FF5252', marginBottom:4 }}>
          {isCorrect ? `Correct! Level ${level} complete` : 'Wrong!'}
        </div>
        <div style={{ fontSize:15, color:'rgba(255,255,255,0.5)', fontWeight:700, marginBottom:20 }}>
          The answer was <span style={{ color:'#fff', fontWeight:900 }}>{correctCount}</span> × {target}
          {!isCorrect && <span> · You said <span style={{ color:'#FF5252', fontWeight:900 }}>{userAnswer}</span></span>}
        </div>

        {worldRank && isCorrect && <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:16 }}>#{worldRank} in the world</div>}

        {!profile?.name && !saved && isCorrect && (
          <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:14, padding:'12px', marginBottom:16 }}>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{ width:'100%', padding:'8px', borderRadius:8, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:13, fontWeight:800, fontFamily:'inherit', outline:'none', marginBottom:8, boxSizing:'border-box' }} />
            <div style={{ display:'flex', gap:5, justifyContent:'center', marginBottom:8 }}>
              {pin.map((d,i) => (
                <input key={i} id={`pin-lr-${i}`} type="tel" maxLength={1} value={d}
                  onChange={e=>{const v=e.target.value.replace(/\D/,'');const p=[...pin];p[i]=v;setPin(p);if(v&&i<3)(document.getElementById(`pin-lr-${i+1}`) as HTMLInputElement)?.focus()}}
                  style={{ width:36, height:42, textAlign:'center', fontSize:18, fontWeight:900, borderRadius:8, border:'2px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontFamily:'inherit', outline:'none' }} />
              ))}
            </div>
            {saveError && <div style={{ fontSize:11, color:'#FF5252', fontWeight:800, marginBottom:6 }}>{saveError}</div>}
            <button onClick={saveScore} disabled={!name.trim()||pin.join('').length!==4||saving} style={{ width:'100%', padding:'8px', borderRadius:8, border:'none', background:GREEN, color:'#fff', fontSize:13, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
              {saving?'Saving...':'Save →'}
            </button>
          </div>
        )}
        {saved && <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:10, padding:'8px', marginBottom:16 }}><div style={{ fontSize:13, fontWeight:900, color:'#69F0AE' }}>✓ Saved!</div></div>}

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={reset} style={{ flex:1, padding:'14px', borderRadius:14, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
          {isCorrect
            ? <button onClick={nextLevel} style={{ flex:2, padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E2080' }}>Level {level+1} →</button>
            : <button onClick={() => { setLevel(1); startLevel(1) }} style={{ flex:2, padding:'14px', borderRadius:14, border:'none', background:'#C62828', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Try again →</button>
          }
        </div>
      </div>
    </main>
  )
}
