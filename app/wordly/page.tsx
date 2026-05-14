'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const GREEN = '#2E7D32'
const YELLOW = '#F9A825'
const GRAY = '#9E9E9E'

// 5-letter word list (subset)
const WORDS = [
  'CRANE','SLATE','TRACE','CARTE','LEAST','STALE','TALES','STEAL','LEATS','TAELS',
  'RAISE','ARISE','SERAI','AFIRE','REAIS','IAMBS','BRAIN','GROAN','PLAIN','TRAIN',
  'LIGHT','NIGHT','MIGHT','TIGHT','RIGHT','FIGHT','SIGHT','BIGHT','WIGHT','HIGHT',
  'BRAVE','CRAVE','GRAVE','PRAVE','STAVE','SHAVE','KNAVE','GLARE','FLARE','SNARE',
  'PLANT','SLANT','GRANT','CHANT','SCANT','BLUNT','FRONT','STUNT','SHUNT','GRUNT',
  'FLESH','FRESH','PRESS','DRESS','BLESS','CHESS','GUESS','STRESS','CRASS','BRASS',
  'WATER','LATER','CATER','MATER','RATER','HATER','EATER','FATED','GATED','RATED',
  'SOUND','ROUND','FOUND','BOUND','WOUND','HOUND','MOUND','POUND','GROUND','CROWN',
  'STONE','PHONE','CLONE','DRONE','PRONE','OZONE','SHONE','ATONE','ALONE','BONES',
  'CHAIR','CHAIN','CHILD','CHINA','CHIEF','CHOIR','CHALK','CHASE','CHAOS','CHARM',
  'BREAD','BREAK','DREAM','CREAM','GREED','SPEED','STEED','BREED','CREED','FREED',
  'WORLD','WORTH','WORRY','WORSE','WORKS','WORDS','WORMS','WORST','WRITE','WROTE',
  'FLAME','BLAME','CLAIM','FRAME','SHAME','TAME','FAME','GAME','NAME','SAME',
  'CLIMB','CRIMP','CRISP','CRACK','CRAFT','CRASH','CRANK','CRAZY','CRAZE','GRACE',
  'DANCE','LANCE','CHANCE','PRANCE','GLANCE','FENCE','HENCE','SINCE','MINCE','WINCE',
  'PLACE','SPACE','GRACE','TRACE','BRACE','PEACE','BEACH','PEACH','REACH','TEACH',
  'SMILE','WHILE','STYLE','STILE','GUILE','EXILE','AGILE','RILE','FILE','MILE',
  'BLOOD','FLOOD','STOOD','BROOD','DROOL','STOOL','SPOOL','DROOP','TROOP','SCOOP',
  'FROST','GROSS','CROSS','GLOSS','FLOSS','BOSS','LOSS','MOSS','TOSS','COST',
  'SWEET','GREET','FLEET','SLEET','SHEET','STEEL','WHEEL','KNEEL','KEEL','FEEL',
]

const getDailyWord = () => {
  const start = new Date("2026-01-01").getTime()
  const today = new Date().toISOString().split("T")[0]
  const diff = Math.floor((new Date(today).getTime() - start) / 86400000)
  return WORDS[diff % WORDS.length]
}

const KEYBOARD = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
]

type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'active'

function getLetterStates(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(5).fill('absent')
  const targetArr = target.split('')
  const guessArr = guess.split('')
  const used = Array(5).fill(false)

  // First pass: correct
  guessArr.forEach((l, i) => {
    if (l === targetArr[i]) { result[i] = 'correct'; used[i] = true }
  })
  // Second pass: present
  guessArr.forEach((l, i) => {
    if (result[i] === 'correct') return
    const idx = targetArr.findIndex((t, j) => t === l && !used[j])
    if (idx !== -1) { result[i] = 'present'; used[idx] = true }
  })
  return result
}

const CELL_COLORS: Record<LetterState, string> = {
  correct: GREEN,
  present: YELLOW,
  absent: GRAY,
  empty: '#fff',
  active: '#fff',
}

export default function WordlePage() {
  const { profile } = usePlayer()
  const [word] = useState(getDailyWord)
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [phase, setPhase] = useState<'playing' | 'won' | 'lost'>('playing')
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [finalTime, setFinalTime] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [bestScore, setBestScore] = useState<{ time_ms: number, attempts: number } | null>(null)
  const [shake, setShake] = useState(false)
  const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({})
  const [alreadyPlayed, setAlreadyPlayed] = useState(false)

  useEffect(() => {
    if (phase !== 'playing' || alreadyPlayed) return
    const t = setInterval(() => setElapsed(Date.now() - startTime), 100)
    return () => clearInterval(t)
  }, [phase, startTime, alreadyPlayed])

  useEffect(() => {
    if (!profile?.name) return
    const today = new Date().toISOString().split('T')[0]
    supabase.from('wordle_scores').select('time_ms, attempts').eq('player_name', profile.name).order('time_ms', { ascending: true }).limit(1)
      .then(({ data }) => { if (data?.[0]) setBestScore(data[0]) })
    supabase.from('wordle_scores').select('id').eq('player_name', profile.name).eq('word_date', today).limit(1)
      .then(({ data }) => { if (data?.[0]) setAlreadyPlayed(true) })
  }, [profile?.name])

  const updateKeyStates = useCallback((guess: string, states: LetterState[]) => {
    setKeyStates(prev => {
      const next = { ...prev }
      guess.split('').forEach((l, i) => {
        const s = states[i]
        if (!next[l] || s === 'correct' || (s === 'present' && next[l] === 'absent')) next[l] = s
      })
      return next
    })
  }, [])

  const submit = useCallback(async () => {
    if (current.length !== 5) { setShake(true); setTimeout(() => setShake(false), 500); return }
    const states = getLetterStates(current, word)
    const newGuesses = [...guesses, current]
    setGuesses(newGuesses)
    updateKeyStates(current, states)
    setCurrent('')

    const won = current === word
    const lost = !won && newGuesses.length >= 6

    if (won || lost) {
      const time = Date.now() - startTime
      setFinalTime(time)
      setPhase(won ? 'won' : 'lost')

      if (won && profile?.name && !alreadyPlayed) {
        const today = new Date().toISOString().split('T')[0]
        await supabase.from('wordle_scores').insert({
          player_name: profile.name,
          word_date: today,
          attempts: newGuesses.length,
          time_ms: time,
        })
        const { data } = await supabase.from('wordle_scores').select('player_name, time_ms').eq('word_date', today).order('time_ms', { ascending: true }).limit(500)
        if (data) {
          const best: Record<string, number> = {}
          data.forEach((s: any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
          setWorldRank(Object.values(best).filter(t => t < time).length + 1)
        }
      }
    }
  }, [current, guesses, word, startTime, profile?.name, alreadyPlayed, updateKeyStates])

  const handleKey = useCallback((k: string) => {
    if (phase !== 'playing') return
    if (k === 'ENTER') { submit(); return }
    if (k === '⌫') { setCurrent(p => p.slice(0, -1)); return }
    if (current.length < 5 && /^[A-Z]$/.test(k)) setCurrent(p => p + k)
  }, [phase, current, submit])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase()
      if (k === 'ENTER') handleKey('ENTER')
      else if (k === 'BACKSPACE') handleKey('⌫')
      else if (/^[A-Z]$/.test(k)) handleKey(k)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleKey])

  const fmtTime = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 100)
    return m > 0 ? `${m}:${String(s).padStart(2,'0')}.${c}` : `${s}.${c}s`
  }

  const today = new Date().toISOString().split('T')[0]

  // Build grid
  const rows = Array(6).fill(null).map((_, i) => {
    if (i < guesses.length) {
      const states = getLetterStates(guesses[i], word)
      return guesses[i].split('').map((l, j) => ({ letter: l, state: states[j] }))
    }
    if (i === guesses.length && phase === 'playing') {
      return Array(5).fill(null).map((_, j) => ({ letter: current[j] || '', state: (current[j] ? 'active' : 'empty') as LetterState }))
    }
    return Array(5).fill({ letter: '', state: 'empty' as LetterState })
  })

  return (
    <main style={{ minHeight: '100dvh', background: `linear-gradient(180deg, #E8F5E9 0%, ${CREAM} 40%)`, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '0 0 100px', color: BROWN }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', gap: 12 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: GREEN, letterSpacing: -0.5 }}>Wordle</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginTop: 2 }}>Guess the word of the day</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {phase === 'playing' && <div style={{ fontSize: 18, fontWeight: 900, color: BROWN, fontVariantNumeric: 'tabular-nums' }}>{fmtTime(elapsed)}</div>}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: `1px solid ${BROWN}15`, borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 800, color: `${BROWN}60` }}>← Home</div>
          </Link>
        </div>
      </div>

      {alreadyPlayed && (
        <div style={{ margin: '16px 20px 0', background: `${GOLD}20`, borderRadius: 14, padding: '12px 16px', fontSize: 13, fontWeight: 800, color: BROWN, textAlign: 'center' }}>
          You already played today. Come back tomorrow!
        </div>
      )}

      {bestScore && (
        <div style={{ margin: '12px 20px 0', background: `${GREEN}10`, borderRadius: 14, padding: '10px 16px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, textTransform: 'uppercase' }}>Your best</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: GREEN }}>{fmtTime(bestScore.time_ms)} · {bestScore.attempts} tries</div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '20px 20px 0', alignItems: 'center' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, animation: shake && i === guesses.length ? 'shake 0.5s ease' : undefined }}>
            {row.map((cell, j) => (
              <div key={j} style={{
                width: 52, height: 52, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 900, color: cell.state === 'empty' || cell.state === 'active' ? BROWN : '#fff',
                background: CELL_COLORS[cell.state as LetterState],
                border: cell.state === 'empty' ? `2px solid ${BROWN}15` : cell.state === 'active' ? `2px solid ${BROWN}40` : 'none',
                transition: 'background 0.3s',
              }}>{cell.letter}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Result */}
      {phase !== 'playing' && (
        <div style={{ margin: '20px 20px 0', textAlign: 'center', animation: 'fadeUp 0.4s ease' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: phase === 'won' ? GREEN : '#C62828' }}>
            {phase === 'won' ? fmtTime(finalTime) : word}
          </div>
          <div style={{ fontSize: 14, color: `${BROWN}60`, marginTop: 4 }}>
            {phase === 'won' ? `Solved in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}` : 'Better luck tomorrow'}
          </div>
          {worldRank && <div style={{ fontSize: 20, fontWeight: 900, color: GREEN, marginTop: 8 }}>#{worldRank} World Today</div>}
          {phase === 'won' && (
            <button onClick={() => {
              const text = `I solved today's MemGenius Wordle in ${fmtTime(finalTime)} with ${guesses.length} tries! Can you beat me? memgenius.com/wordly`
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
            }} style={{ marginTop: 16, padding: '14px 32px', borderRadius: 16, border: 'none', background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>
              Share
            </button>
          )}
        </div>
      )}

      {/* Keyboard */}
      <div style={{ padding: '20px 12px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {KEYBOARD.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
            {row.map(k => {
              const state = keyStates[k]
              const isWide = k === 'ENTER' || k === '⌫'
              return (
                <button key={k} onClick={() => handleKey(k)} style={{
                  width: isWide ? 56 : 34, height: 46, borderRadius: 8, border: 'none',
                  background: state === 'correct' ? GREEN : state === 'present' ? YELLOW : state === 'absent' ? GRAY : '#fff',
                  color: state ? '#fff' : BROWN,
                  fontSize: isWide ? 10 : 14, fontWeight: 900, fontFamily: 'inherit',
                  cursor: 'pointer', boxShadow: '0 2px 0 #4A2C0A20',
                }}>{k}</button>
              )
            })}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes shake { 0%,100% { transform:translateX(0) } 25% { transform:translateX(-8px) } 75% { transform:translateX(8px) } }
      `}</style>
    </main>
  )
}
