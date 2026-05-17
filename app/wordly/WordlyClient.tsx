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

const WORDS = [
  'CRANE','SLATE','TRACE','RAISE','BRAIN','LIGHT','BRAVE','PLANT','FLESH','WATER',
  'SOUND','STONE','CHAIR','BREAD','WORLD','FLAME','CLIMB','DANCE','PLACE','SMILE',
  'BLOOD','FROST','SWEET','NIGHT','GROAN','PLAIN','TRAIN','MIGHT','CRAVE','SLANT',
  'FRESH','LATER','ROUND','PHONE','CHAIN','BREAK','WORTH','BLAME','CRISP','LANCE',
  'SPACE','WHILE','FLOOD','GROSS','GREET','TIGHT','ARISE','FIGHT','GRAVE','GRANT',
  'PRESS','CATER','FOUND','CLONE','CHILD','DREAM','WORRY','CLAIM','CRACK','CHANCE',
  'GRACE','STYLE','STOOD','CROSS','FLEET','RIGHT','SERAI','SIGHT','STAVE','CHANT',
  'DRESS','MATER','BOUND','DRONE','CHINA','CREAM','WORSE','FRAME','CRAFT','GLANCE',
  'TRACE','GUILE','BROOD','GLOSS','SLEET','FIGHT','AFIRE','BIGHT','SHAVE','SCANT',
  'BLESS','RATER','WOUND','PRONE','CHIEF','GREED','WORKS','SHAME','CRASH','FENCE',
  'BEACH','EXILE','DROOL','FLOSS','SHEET','WIGHT','REAIS','WIGHT','KNAVE','BLUNT',
  'CHESS','HATER','HOUND','OZONE','CHOIR','SPEED','WORDS','TAME','CRANK','HENCE',
  'PEACH','AGILE','STOOL','BOSS','STEEL','HIGHT','IAMBS','GLARE','FRONT','GUESS',
  'REACH','RILE','SPOOL','LOSS','WHEEL','STALE','BRAIN','FLARE','STUNT','STRESS',
  'TEACH','FILE','DROOP','MOSS','KNEEL','TALES','GROAN','SNARE','SHUNT','CRASS',
  'STEAL','MILE','TROOP','TOSS','KEEL','LEATS','PLAIN','SHONE','GRUNT','BRASS',
]

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)]

const LOGO = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/wordly.png'
const TROPHY = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/nav-trophy.webp'

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
  guessArr.forEach((l, i) => { if (l === targetArr[i]) { result[i] = 'correct'; used[i] = true } })
  guessArr.forEach((l, i) => {
    if (result[i] === 'correct') return
    const idx = targetArr.findIndex((t, j) => t === l && !used[j])
    if (idx !== -1) { result[i] = 'present'; used[idx] = true }
  })
  return result
}

const CELL_COLORS: Record<LetterState, string> = {
  correct: GREEN, present: YELLOW, absent: GRAY, empty: '#fff', active: '#fff',
}

function fmtTime(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const c = Math.floor((ms % 1000) / 100)
  return m > 0 ? `${m}:${String(s).padStart(2,'0')}.${c}` : `${s}.${c}s`
}

export default function WordlyClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<'intro' | 'playing' | 'won' | 'lost'>('intro')
  const [word, setWord] = useState(getRandomWord)
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({})
  const [shake, setShake] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [finalTime, setFinalTime] = useState(0)
  const [worldRank, setWorldRank] = useState<number | null>(null)
  const [topScores, setTopScores] = useState<{ name: string, time_ms: number, attempts: number }[]>([])
  const [bestScore, setBestScore] = useState<{ time_ms: number, attempts: number } | null>(null)

  useEffect(() => {
    supabase.from('wordle_scores').select('player_name, time_ms, attempts').order('time_ms', { ascending: true }).limit(200)
      .then(({ data }) => {
        if (!data) return
        const best: Record<string, { time_ms: number, attempts: number }> = {}
        data.forEach((s: any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name].time_ms) best[s.player_name] = { time_ms: s.time_ms, attempts: s.attempts } })
        setTopScores(Object.entries(best).map(([name, d]) => ({ name, ...d })).sort((a, b) => a.time_ms - b.time_ms))
        if (profile?.name && best[profile.name]) setBestScore(best[profile.name])
      })
  }, [profile?.name])

  useEffect(() => {
    if (phase !== 'playing') return
    const t = setInterval(() => setElapsed(Date.now() - startTime), 100)
    return () => clearInterval(t)
  }, [phase, startTime])

  const updateKeyStates = useCallback((guess: string, states: LetterState[]) => {
    setKeyStates(prev => {
      const next = { ...prev }
      const priority: Record<LetterState, number> = { correct: 3, present: 2, absent: 1, empty: 0, active: 0 }
      guess.split('').forEach((l, i) => {
        if (!next[l] || priority[states[i]] > priority[next[l]]) next[l] = states[i]
      })
      return next
    })
  }, [])

  const submit = useCallback(async () => {
    if (current.length !== 5) { setShake(true); setTimeout(() => setShake(false), 500); return }
    const states = getLetterStates(current, word)
    updateKeyStates(current, states)
    const newGuesses = [...guesses, current]
    setGuesses(newGuesses)
    setCurrent('')
    const won = current === word
    if (won || newGuesses.length >= 6) {
      const time = Date.now() - startTime
      setFinalTime(time)
      setPhase(won ? 'won' : 'lost')
      if (won && profile?.name) {
        const today = new Date().toISOString().split('T')[0]
        await supabase.from('wordle_scores').insert({ player_name: profile.name, word_date: today, attempts: newGuesses.length, time_ms: time })
        const { data } = await supabase.from('wordle_scores').select('player_name, time_ms').order('time_ms', { ascending: true }).limit(500)
        if (data) {
          const best: Record<string, number> = {}
          data.forEach((s: any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
          setWorldRank(Object.values(best).filter(t => t < time).length + 1)
        }
      }
    }
  }, [current, guesses, word, startTime, profile?.name, updateKeyStates])

  const handleKey = useCallback((k: string) => {
    if (phase !== 'playing') return
    if (k === 'ENTER') { submit(); return }
    if (k === '⌫') { setCurrent(p => p.slice(0, -1)); return }
    if (current.length < 5 && /^[A-Z]$/.test(k)) {
      const next = current + k
      setCurrent(next)
      if (next.length === 5) setTimeout(() => submit(), 150)
    }
  }, [phase, current, submit])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const k = e.key.toUpperCase()
      if (k === 'ENTER') handleKey('ENTER')
      else if (k === 'BACKSPACE') handleKey('⌫')
      else if (/^[A-Z]$/.test(k)) handleKey(k)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleKey])

  const playAgain = () => {
    setWord(getRandomWord())
    setGuesses([])
    setCurrent('')
    setKeyStates({})
    setWorldRank(null)
    setPhase('playing')
  }

  const rows = Array(6).fill(null).map((_, i) => {
    if (i < guesses.length) {
      const states = getLetterStates(guesses[i], word)
      return guesses[i].split('').map((l, j) => ({ letter: l, state: states[j] }))
    }
    if (i === guesses.length && phase === 'playing') {
      return Array(5).fill(null).map((_, j) => ({ letter: current[j] || '', state: (current[j] ? 'active' : 'empty') as LetterState }))
    }
    return Array(5).fill(null).map(() => ({ letter: '', state: 'empty' as LetterState }))
  })

  return (
    <div style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 80 }}>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} } @keyframes popIn { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 0', gap: 12 }}>
        <img src={LOGO} alt="Wordly" style={{ height: 48, objectFit: 'contain' }} />
        <div>
          <div style={{ fontSize: 26, fontWeight: 900, color: GREEN }}>Wordly</div>
          <div style={{ fontSize: 12, color: `${BROWN}50`, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>Guess the 5-letter word</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {phase === 'playing' && <div style={{ fontSize: 18, fontWeight: 900, color: BROWN, fontVariantNumeric: 'tabular-nums' }}>{fmtTime(elapsed)}</div>}
        </div>
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', gap: 16 }}>
          <div style={{ fontSize: 14, color: `${BROWN}70`, fontWeight: 700, textAlign: 'center', lineHeight: 1.8 }}>
            Guess the 5-letter word in 6 tries.<br />
            🟩 Correct position · 🟨 Wrong position · ⬜ Not in word
          </div>
          {bestScore && (
            <div style={{ background: `${GREEN}10`, borderRadius: 14, padding: '12px 20px', textAlign: 'center', width: '100%', border: `1px solid ${GREEN}20` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Your best</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: GREEN }}>{fmtTime(bestScore.time_ms)} · {bestScore.attempts} tries</div>
            </div>
          )}
          {topScores[0] && (
            <div style={{ background: `${GOLD}10`, borderRadius: 14, padding: '12px 20px', textAlign: 'center', width: '100%', border: `1px solid ${GOLD}20` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>World record</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: GOLD }}>{fmtTime(topScores[0].time_ms)} · {topScores[0].name}</div>
            </div>
          )}
          <button onClick={() => setPhase('playing')} style={{
            width: '100%', padding: '18px', borderRadius: 20, border: 'none',
            background: GREEN, color: '#fff', fontSize: 18, fontWeight: 900,
            fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 8px 0 #1B5E2060`,
          }}>Play</button>
          <Link href="/wordly/ranking" style={{ textDecoration: 'none', width: '100%' }}>
            <div style={{ width: '100%', padding: '14px', borderRadius: 16, background: '#fff', border: `1.5px solid ${BROWN}20`, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxSizing: 'border-box' }}>
              <img src={TROPHY} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
              <span style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>World Ranking</span>
            </div>
          </Link>
        </div>
      )}

      {/* GAME */}
      {phase !== 'intro' && (
        <>
          {/* Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '20px 20px 0', alignItems: 'center' }}>
            {rows.map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, animation: shake && i === guesses.length ? 'shake 0.5s ease' : undefined }}>
                {row.map((cell, j) => (
                  <div key={j} style={{
                    width: 52, height: 52, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 900, color: cell.state === 'empty' || cell.state === 'active' ? BROWN : '#fff',
                    background: CELL_COLORS[cell.state as LetterState],
                    border: cell.state === 'empty' ? `2px solid ${BROWN}15` : cell.state === 'active' ? `2px solid ${BROWN}60` : 'none',
                    transition: 'background 0.3s',
                    animation: i < guesses.length ? `popIn 0.2s ease ${j * 0.05}s both` : undefined,
                  }}>{cell.letter}</div>
                ))}
              </div>
            ))}
          </div>

          {/* Result */}
          {(phase === 'won' || phase === 'lost') && (
            <div style={{ margin: '20px 20px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: phase === 'won' ? GREEN : '#C62828' }}>
                {phase === 'won' ? fmtTime(finalTime) : word}
              </div>
              <div style={{ fontSize: 14, color: `${BROWN}60`, marginTop: 4, marginBottom: 16 }}>
                {phase === 'won' ? `Solved in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}` : 'Better luck next time!'}
              </div>
              {worldRank && <div style={{ fontSize: 20, fontWeight: 900, color: GREEN, marginBottom: 16 }}>#{worldRank} World</div>}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {phase === 'won' && (
                  <button onClick={() => {
                    const text = `I solved MemGenius Wordly in ${fmtTime(finalTime)} with ${guesses.length} tries!`
                    const url = 'https://memgenius.com/wordly'
                    if (navigator.share) { navigator.share({ title: 'MemGenius Wordly', text, url }) } else { window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank') }
                  }} style={{ padding: '14px 24px', borderRadius: 16, border: 'none', background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>
                    Share
                  </button>
                )}
                <button onClick={playAgain} style={{ padding: '14px 24px', borderRadius: 16, border: 'none', background: GOLD, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>
                  Play again
                </button>
              </div>
            </div>
          )}

          {/* Keyboard */}
          <div style={{ padding: '20px 12px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {KEYBOARD.map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                {row.map(k => (
                  <button key={k} onClick={() => handleKey(k)} style={{
                    padding: k.length > 1 ? '14px 8px' : '14px',
                    minWidth: k.length > 1 ? 48 : 36,
                    borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: keyStates[k] ? CELL_COLORS[keyStates[k]] : '#E0E0E0',
                    color: keyStates[k] && keyStates[k] !== 'empty' && keyStates[k] !== 'active' ? '#fff' : BROWN,
                    fontSize: k.length > 1 ? 11 : 14, fontWeight: 900, fontFamily: 'inherit',
                  }}>{k}</button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
