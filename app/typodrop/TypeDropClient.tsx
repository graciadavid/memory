'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const WORDS = [
  'CAT','DOG','SUN','RUN','FLY','SKY','BOX','TOP','MAP','CUP',
  'FIRE','JUMP','LOVE','FAST','STAR','BLUE','RAIN','DARK','COOL','BIRD',
  'BRAIN','SPEED','LIGHT','CLOUD','TIGER','FLASH','STONE','RIVER','NIGHT','SMILE',
  'ROCKET','PLANET','BRIDGE','SILVER','DRAGON','WINTER','SPRING','CASTLE','GARDEN','MONKEY',
  'DIAMOND','THUNDER','RAINBOW','DOLPHIN','HORIZON','CRYSTAL','VOLCANO','WARRIOR','PHANTOM','ECLIPSE',
]

function getWord(score: number) {
  if (score < 5) return WORDS[Math.floor(Math.random() * 10)]
  if (score < 15) return WORDS[10 + Math.floor(Math.random() * 10)]
  if (score < 30) return WORDS[20 + Math.floor(Math.random() * 10)]
  if (score < 50) return WORDS[30 + Math.floor(Math.random() * 10)]
  return WORDS[40 + Math.floor(Math.random() * 10)]
}

function getSpeed(score: number) {
  return Math.max(2, 8 - score * 0.1)
}

export default function TypeDropClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle')
  const [score, setScore] = useState(0)
  const [word, setWord] = useState('')
  const [typed, setTyped] = useState('')
  const [posY, setPosY] = useState(0)
  const [top5, setTop5] = useState<any[]>([])
  const [worldRecord, setWorldRecord] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const animRef = useRef<any>(null)
  const startRef = useRef<number>(0)
  const scoreRef = useRef(0)
  const posRef = useRef(0)

  useEffect(() => {
    supabase.from('typodrop_scores').select('player_name, score').order('score', { ascending: false }).limit(200)
      .then(({ data }) => {
        if (!data) return
        const best: Record<string, number> = {}
        data.forEach((s: any) => { if (!best[s.player_name] || s.score > best[s.player_name]) best[s.player_name] = s.score })
        const sorted = Object.entries(best).sort((a, b) => b[1] - a[1]).slice(0, 5)
        setTop5(sorted.map(([name, score]) => ({ name, score })))
        if (sorted.length > 0) setWorldRecord({ name: sorted[0][0], score: sorted[0][1] })
      })
  }, [])

  const spawnWord = useCallback((currentScore: number) => {
    const w = getWord(currentScore)
    setWord(w)
    setTyped('')
    setPosY(0)
    posRef.current = 0
    startRef.current = Date.now()

    const speed = getSpeed(currentScore)
    const duration = speed * 1000

    const animate = () => {
      const elapsed = Date.now() - startRef.current
      const progress = elapsed / duration
      const newPos = progress * 100

      if (newPos >= 100) {
        setPhase('over')
        window.dispatchEvent(new Event('gameResult'))
        return
      }

      posRef.current = newPos
      setPosY(newPos)
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
  }, [])

  const startGame = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    scoreRef.current = 0
    setScore(0)
    setPhase('playing')
    window.dispatchEvent(new Event('gameStart'))
    setTimeout(() => inputRef.current?.focus(), 100)
    spawnWord(0)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase()
    setTyped(val)

    if (val === word) {
      cancelAnimationFrame(animRef.current)
      const newScore = scoreRef.current + 1
      scoreRef.current = newScore
      setScore(newScore)
      setTyped('')
      setTimeout(() => inputRef.current?.focus(), 50)
      spawnWord(newScore)
    }
  }

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  // IDLE
  if (phase === 'idle') return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
        <div style={{ fontSize:48 }}>⌨️</div>
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>TypeDrop</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Type the word before it falls</div>
        </div>
      </div>

      <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:'14px', marginBottom:20 }}>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:700, lineHeight:1.8 }}>
          A word falls from the top.<br/>
          Type it before it hits the bottom.<br/>
          <span style={{ color:GREEN, fontWeight:900 }}>Each word gets faster.</span>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? worldRecord.score : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{profile?.name && top5.find(t => t.name === profile.name) ? top5.find(t => t.name === profile.name)!.score : '—'}</div>
        </div>
      </div>

      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p, i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.score}</div>
          </div>
        ))}
      </div>

      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080', marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  // GAME OVER
  if (phase === 'over') return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px', textAlign:'center' }}>
      <div style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:4 }}>Game Over</div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>The word was <span style={{ color:'#fff', fontWeight:900 }}>{word}</span></div>
      <div style={{ fontSize:64, fontWeight:900, color:GOLD, marginBottom:24 }}>{score}</div>

      {profile?.name && (
        <button onClick={async () => {
          await supabase.from('typodrop_scores').insert({ player_name: profile.name, score })
          window.dispatchEvent(new Event('gameResult'))
        }} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:12 }}>
          Save Score
        </button>
      )}

      <div style={{ display:'flex', gap:10 }}>
        <a href="/agility" style={{ flex:1, textDecoration:'none', display:'block', padding:'14px', borderRadius:14, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', fontSize:14, fontWeight:900, textAlign:'center' }}>← Agility</a>
        <button onClick={startGame} style={{ flex:2, padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Play Again →</button>
      </div>
    </main>
  )

  // PLAYING
  const letterColors = word.split('').map((letter, i) => {
    if (i < typed.length) return typed[i] === letter ? '#69F0AE' : '#FF5252'
    return 'rgba(255,255,255,0.9)'
  })

  const danger = posY > 70

  return (
    <main style={{ height:'50dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
      
      {/* Score */}
      <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 20px', alignItems:'center' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>SCORE</div>
        <div style={{ fontSize:28, fontWeight:900, color:GOLD }}>{score}</div>
      </div>

      {/* Fall area */}
      <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
        {/* Danger line */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:'rgba(255,82,82,0.5)' }} />

        {/* Falling word */}
        <div style={{
          position:'absolute',
          left:'50%',
          transform:'translateX(-50%)',
          top:`${posY}%`,
          transition:'none',
          display:'flex',
          gap:2,
        }}>
          {word.split('').map((letter, i) => (
            <div key={i} style={{
              fontSize: 36,
              fontWeight: 900,
              color: letterColors[i],
              textShadow: danger ? '0 0 20px rgba(255,82,82,0.8)' : 'none',
              transition:'color 0.1s',
            }}>{letter}</div>
          ))}
        </div>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        value={typed}
        onChange={handleInput}
        autoFocus
        autoCapitalize="characters"
        style={{ position:'absolute', opacity:0, pointerEvents:'none', top:0, left:0 }}
      />
    </main>
  )
}
