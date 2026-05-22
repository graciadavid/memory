'use client'
import { useState, useEffect, useRef } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const WORDS = [
  'CRANE','SLATE','TRACE','RAISE','BRAIN','LIGHT','BRAVE','PLANT','FLESH','WATER',
  'SOUND','STONE','CHAIR','BREAD','WORLD','FLAME','CLIMB','DANCE','PLACE','SMILE',
  'BLOOD','FROST','SWEET','NIGHT','GROAN','PLAIN','TRAIN','MIGHT','CRAVE','SLANT',
  'FRESH','LATER','ROUND','PHONE','CHAIN','BREAK','WORTH','BLAME','CRISP','LANCE',
  'SPACE','WHILE','FLOOD','GROSS','GREET','TIGHT','ARISE','FIGHT','GRAVE','GRANT',
  'PRESS','CATER','FOUND','CLONE','CHILD','DREAM','WORRY','CLAIM','CRACK','CHANCE',
  'GRACE','STYLE','STOOD','CROSS','FLEET','RIGHT','SIGHT','STAVE','CHANT','DRESS',
  'BOUND','DRONE','CREAM','FRAME','CRAFT','GLANCE','BROOD','SLEET','SHAVE','SCANT',
  'BLESS','WOUND','PRONE','GREED','SHAME','CRASH','FENCE','BEACH','DROOL','SHEET',
  'CHESS','HOUND','SPEED','WORDS','CRANK','HENCE','PEACH','STOOL','STEEL','STALE',
]

const KEYBOARD = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
]

type LetterState = 'empty'|'active'|'correct'|'present'|'absent'
const CELL_BG: Record<LetterState, string> = {
  empty: 'rgba(255,255,255,0.06)',
  active: 'rgba(255,255,255,0.15)',
  correct: '#2E7D32',
  present: '#F9A825',
  absent: '#333',
}
const KEY_BG: Record<string, string> = {
  correct: '#2E7D32',
  present: '#F9A825',
  absent: '#222',
}

function fmtTime(ms: number) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`
}

function evaluate(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(5).fill('absent')
  const targetArr = target.split('')
  const used = Array(5).fill(false)
  guess.split('').forEach((l, i) => { if (l === targetArr[i]) { result[i] = 'correct'; used[i] = true } })
  guess.split('').forEach((l, i) => {
    if (result[i] === 'correct') return
    const j = targetArr.findIndex((t, ti) => !used[ti] && t === l)
    if (j !== -1) { result[i] = 'present'; used[j] = true }
  })
  return result
}

type Phase = 'rules'|'playing'|'won'|'lost'

export default function WordlyClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [word, setWord] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [shake, setShake] = useState(false)
  const [keyStates, setKeyStates] = useState<Record<string,LetterState>>({})
  const [startTime, setStartTime] = useState(0)
  const [finalTime, setFinalTime] = useState(0)
  const [finalGuesses, setFinalGuesses] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [worldRecord, setWorldRecord] = useState<{attempts:number,time_ms:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,attempts:number,time_ms:number}[]>([])
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const timerRef = useRef<NodeJS.Timeout|null>(null)
  const profileNameRef = useRef<string|null>(null)
  const wordRef = useRef('')
  const guessesRef = useRef<string[]>([])
  const currentRef = useRef('')
  const keyStatesRef = useRef<Record<string,LetterState>>({})
  const startTimeRef = useRef(0)

  useEffect(() => {
    if (profile?.name) { setName(profile.name); profileNameRef.current = profile.name }
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('wordle_scores').select('player_name,attempts,time_ms').order('attempts', { ascending: true }).order('time_ms', { ascending: true }).limit(500)
    if (!data) return
    const best: Record<string,{attempts:number,time_ms:number}> = {}
    data.forEach((s:any) => {
      const e = best[s.player_name]
      if (!e || s.attempts < e.attempts || (s.attempts === e.attempts && (s.time_ms||0) < e.time_ms))
        best[s.player_name] = {attempts: s.attempts, time_ms: s.time_ms || 0}
    })
    const sorted = Object.entries(best).map(([n,v]) => ({name:n, attempts:v.attempts, time_ms:v.time_ms})).sort((a,b) => a.attempts !== b.attempts ? a.attempts-b.attempts : a.time_ms-b.time_ms)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({attempts:sorted[0].attempts, time_ms:sorted[0].time_ms, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name].attempts)
  }


  // Save score when won — separate from handleKey to avoid stale closure
  useEffect(() => {
    if (phase !== 'won' || !profile?.name || finalGuesses === 0 || finalTime === 0) return
    const doSave = async () => {
      await supabase.from('wordle_scores').insert({player_name:profile.name, attempts:finalGuesses, time_ms:finalTime, word_date:new Date().toISOString().split('T')[0]})
      const {count} = await supabase.from('wordle_scores').select('*',{count:'exact',head:true}).lt('attempts',finalGuesses)
      setWorldRank((count??0)+1)
      setMyBest(prev => prev===null || finalGuesses<prev ? finalGuesses : prev)
    }
    doSave()
  }, [phase, profile?.name, finalGuesses, finalTime])

  const startGame = () => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)]
    setWord(w); wordRef.current = w
    setGuesses([]); guessesRef.current = []
    setCurrent(''); currentRef.current = ''
    setKeyStates({}); keyStatesRef.current = {}
    setShake(false)
    const now = Date.now()
    setStartTime(now); startTimeRef.current = now
    setFinalTime(0)
    setElapsed(0)
    setPhase('playing')
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setElapsed(Date.now() - now), 500)
  }

  const handleKey = async (key: string) => {
    if (key === '⌫' || key === 'BACKSPACE') {
      const next = currentRef.current.slice(0,-1)
      setCurrent(next); currentRef.current = next
      return
    }
    if (key === 'ENTER') {
      const cur = currentRef.current
      const w = wordRef.current
      const gs = guessesRef.current
      if (cur.length !== 5) { setShake(true); setTimeout(() => setShake(false), 500); return }
      const states = evaluate(cur, w)
      const newGuesses = [...gs, cur]
      setGuesses(newGuesses); guessesRef.current = newGuesses
      const newKeys = {...keyStatesRef.current}
      cur.split('').forEach((l,i) => {
        const s = states[i]
        if (!newKeys[l] || s === 'correct' || (s === 'present' && newKeys[l] === 'absent')) newKeys[l] = s
      })
      setKeyStates(newKeys); keyStatesRef.current = newKeys
      setCurrent(''); currentRef.current = ''

      if (cur === w) {
        const t = Date.now() - startTimeRef.current
        setFinalTime(t)
        if (timerRef.current) clearInterval(timerRef.current)
        setFinalGuesses(newGuesses.length)
        setPhase('won')

      } else if (newGuesses.length >= 6) {
        if (timerRef.current) clearInterval(timerRef.current)
        setPhase('lost')
      }
      return
    }
    if (/^[A-Z]$/.test(key) && currentRef.current.length < 5) {
      const next = currentRef.current + key
      setCurrent(next); currentRef.current = next
    }
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

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
    await supabase.from('wordle_scores').insert({player_name:name.trim(), attempts:guesses.length, time_ms:finalTime, word_date:new Date().toISOString().split('T')[0]})
    const {count} = await supabase.from('wordle_scores').select('*',{count:'exact',head:true}).lt('attempts',guesses.length)
    setWorldRank((count??0)+1)
    setSaving(false); setSaved(true)
    localStorage.setItem('memgenius_profile', JSON.stringify({name:name.trim()}))
    setTimeout(() => window.location.reload(), 1500)
  }

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('rules')
    setSaved(false)
    loadData()
  }

  const rows = Array.from({length:6}, (_,i) => {
    const g = guesses[i]
    if (g) {
      const states = evaluate(g, word)
      return g.split('').map((l,j) => ({letter:l, state:states[j]}))
    }
    if (i === guesses.length && phase === 'playing') {
      return Array.from({length:5}, (_,j) => ({letter:current[j]||'', state:(current[j]?'active':'empty') as LetterState}))
    }
    return Array.from({length:5}, () => ({letter:'', state:'empty' as LetterState}))
  })

  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
        <img src={`${BASE}/wordly.png`} style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Wordly</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Guess the 5-letter word in 6 tries</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:'14px 16px', marginBottom:20 }}>
        <div style={{ display:'flex', gap:16, alignItems:'center', justifyContent:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:16, height:16, borderRadius:4, background:'#2E7D32' }} /><span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:700 }}>Right spot</span></div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:16, height:16, borderRadius:4, background:'#F9A825' }} /><span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:700 }}>Wrong spot</span></div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:16, height:16, borderRadius:4, background:'#333' }} /><span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:700 }}>Not in word</span></div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${worldRecord.attempts} tries` : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest!==null ? `${myBest} tries` : '—'}</div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.attempts} tries</div>
              {p.time_ms > 0 && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>{fmtTime(p.time_ms)}</div>}
            </div>
          </div>
        ))}
      </div>
      <button onClick={startGame} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080', marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'8px 10px 70px', overflow:'hidden', justifyContent:'space-between' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
        <button onClick={reset} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:13, fontWeight:900, color:'#fff' }}>Wordly</div>
          <div style={{ fontSize:18, fontWeight:900, color:GOLD, fontVariantNumeric:'tabular-nums' }}>{fmtTime(elapsed)}</div>
        </div>
        <div style={{ width:50 }} />
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'center' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display:'flex', gap:4, animation: shake && i === guesses.length ? 'shake 0.4s ease' : undefined }}>
            {row.map((cell, j) => (
              <div key={j} style={{
                width:46, height:46, borderRadius:6,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:20, fontWeight:900, color:'#fff',
                background: CELL_BG[cell.state],
                border: cell.state === 'empty' ? '2px solid rgba(255,255,255,0.1)' : cell.state === 'active' ? '2px solid rgba(255,255,255,0.4)' : 'none',
              }}>{cell.letter}</div>
            ))}
          </div>
        ))}
      </div>

      {(phase === 'won' || phase === 'lost') && (
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:20, fontWeight:900, color: phase==='won'?'#69F0AE':'#FF5252' }}>
            {phase==='won' ? `✓ ${guesses.length} tries · ${fmtTime(finalTime)}` : `The word was ${word}`}
          </div>
          {worldRank && phase==='won' && <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>#{worldRank} in the world</div>}
          {!profile?.name && !saved && phase==='won' && (
            <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:14, padding:'10px', marginTop:6 }}>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{ width:'100%', padding:'8px', borderRadius:8, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:13, fontWeight:800, fontFamily:'inherit', outline:'none', marginBottom:6, boxSizing:'border-box' }} />
              <div style={{ display:'flex', gap:5, justifyContent:'center', marginBottom:6 }}>
                {pin.map((d,i) => (
                  <input key={i} id={`pin-w-${i}`} type="tel" maxLength={1} value={d}
                    onChange={e=>{const v=e.target.value.replace(/\D/,'');const p=[...pin];p[i]=v;setPin(p);if(v&&i<3)(document.getElementById(`pin-w-${i+1}`) as HTMLInputElement)?.focus()}}
                    style={{ width:36, height:42, textAlign:'center', fontSize:18, fontWeight:900, borderRadius:8, border:'2px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontFamily:'inherit', outline:'none' }} />
                ))}
              </div>
              {saveError && <div style={{ fontSize:11, color:'#FF5252', fontWeight:800, marginBottom:4 }}>{saveError}</div>}
              <button onClick={saveScore} disabled={!name.trim()||pin.join('').length!==4||saving} style={{ width:'100%', padding:'8px', borderRadius:8, border:'none', background:name.trim()&&pin.join('').length===4?GREEN:'rgba(255,255,255,0.1)', color:'#fff', fontSize:13, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
                {saving?'Saving...':'Save →'}
              </button>
            </div>
          )}
          {saved && <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:10, padding:'6px', marginTop:4 }}><div style={{ fontSize:13, fontWeight:900, color:'#69F0AE' }}>✓ Saved!</div></div>}
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:6 }}>
            <button onClick={reset} style={{ padding:'8px 14px', borderRadius:10, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:12, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
            <button onClick={startGame} style={{ padding:'8px 14px', borderRadius:10, border:'none', background:GREEN, color:'#fff', fontSize:12, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Play again →</button>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        {KEYBOARD.map((row, i) => (
          <div key={i} style={{ display:'flex', gap:4, justifyContent:'center' }}>
            {row.map(k => (
              <button key={k} onClick={() => handleKey(k)} style={{
                padding: k.length > 1 ? '13px 5px' : '13px 0',
                minWidth: k.length > 1 ? 44 : 30,
                borderRadius:6, border:'none', cursor:'pointer',
                background: keyStates[k] ? KEY_BG[keyStates[k]] || 'rgba(255,255,255,0.08)' : k==='ENTER' ? GREEN : 'rgba(255,255,255,0.08)',
                color:'#fff',
                fontSize: k.length > 1 ? 9 : 14, fontWeight:900, fontFamily:'inherit',
              }}>{k}</button>
            ))}
          </div>
        ))}
      </div>

      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
    </main>
  )
}
