'use client'
import { useState, useCallback, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const MAX_ATTEMPTS = 6
const WORD_LENGTH = 5

const WORDS = [
 'BRAIN','LIGHT','CHESS','SCORE','PLANT','FLAME','STONE','CLOUD','STORM','TIGER',
 'EAGLE','SWIFT','CRANE','DANCE','EARTH','FAITH','GHOST','HEART','IVORY','JEWEL',
 'KNIFE','LASER','MAGIC','NIGHT','OCEAN','PEACE','QUEEN','RIVER','SOLAR','TRAIL',
 'ANGEL','BEACH','CANDY','DREAM','ELITE','FANCY','GRACE','HONEY','JOKER','KARMA',
 'LEMON','MAPLE','NOBLE','OPERA','POWER','QUEST','RADAR','SIGMA','THORN','VIVID',
 'WHEAT','YOUTH','BLEND','CRISP','EMOTE','FLAIR','GLIDE','HASTE','IDEAL','RALLY',
 'SAINT','TABOO','VIOLA','WHIRL','ADORE','BLAZE','CHANT','DEPOT','EMBER','FROST',
 'GUSTO','HABIT','INLET','SPARE','TEMPO','WRATH','YIELD','BRAWL','CHOIR','DWELL',
 'FUDGE','HINGE','IRONY','MOOSE','NOTCH','PERCH','ROUSE','SCONE','TRAWL','UNIFY',
 'VENOM','WALTZ','ABBOT','QUALM','KNEEL','LEDGE','MANOR','NERVE','ORBIT','PRISM',
]

const KEYBOARD_ROWS = [
 ['Q','W','E','R','T','Y','U','I','O','P'],
 ['A','S','D','F','G','H','J','K','L'],
 ['ENTER','Z','X','C','V','B','N','M','DEL'],
]

type CellState = 'correct' | 'present' | 'absent' | 'empty' | 'active'
type Phase = 'rules' | 'playing' | 'result'

function evaluateGuess(guess: string, word: string): CellState[] {
 const result: CellState[] = Array(WORD_LENGTH).fill('absent')
 const wordArr = word.split('')
 const guessArr = guess.split('')
 guessArr.forEach((l, i) => { if (l === wordArr[i]) { result[i] = 'correct'; wordArr[i] = '' } })
 guessArr.forEach((l, i) => {
   if (result[i] === 'correct') return
   const j = wordArr.indexOf(l)
   if (j !== -1) { result[i] = 'present'; wordArr[j] = '' }
 })
 return result
}

const BG: Record<string, string> = {
 correct: '#2E7D32',
 present: '#C8960C',
 absent: '#3a3a3a',
 empty: '#252525',
 active: '#252525',
}

export default function WordlyClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [word, setWord] = useState('')
 const [guesses, setGuesses] = useState<string[]>([])
 const [cellStates, setCellStates] = useState<CellState[][]>([])
 const [current, setCurrent] = useState('')
 const [keyColors, setKeyColors] = useState<Record<string, string>>({})
 const [won, setWon] = useState(false)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('wordle_scores').select('player_name, attempts').order('attempts', { ascending: true }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.attempts < best[s.player_name]) best[s.player_name] = s.attempts })
   const sorted = Object.entries(best).sort((a,b) => (a[1] as number)-(b[1] as number))
   setTop5(sorted.slice(0,5).map(([name,a]) => ({name, score:a+' tries'})))
   if (profile?.name && best[profile.name] !== undefined) setMyBest(best[profile.name])
 }, [profile?.name])

 useState(() => { loadData() })

 const startGame = () => {
   const w = WORDS[Math.floor(Math.random() * WORDS.length)]
   setWord(w)
   setGuesses([])
   setCellStates([])
   setCurrent('')
   setKeyColors({})
   setWon(false)
   setPhase('playing')
   window.dispatchEvent(new Event('gameStart'))
 }

 const submitGuess = useCallback(async (guess: string, currentWord: string, currentGuesses: string[], currentCellStates: CellState[][]) => {
   const result = evaluateGuess(guess, currentWord)
   const newGuesses = [...currentGuesses, guess]
   const newCellStates = [...currentCellStates, result]
   setGuesses(newGuesses)
   setCellStates(newCellStates)
   setCurrent('')

   // Update key colors
   setKeyColors(prev => {
     const next: Record<string, string> = { ...prev }
     guess.split('').forEach((l, i) => {
       const state = result[i]
       const prevColor = next[l]
       if (prevColor === '#2E7D32') return
       if (state === 'correct') next[l] = '#2E7D32'
       else if (state === 'present' && prevColor !== '#2E7D32') next[l] = '#C8960C'
       else if (state === 'absent' && !prevColor) next[l] = '#3a3a3a'
     })
     return next
   })

   if (guess === currentWord) {
     setWon(true)
     setPhase('result')
     window.dispatchEvent(new Event('gameResult'))
     const tries = newGuesses.length
     const { count } = await supabase.from('wordle_scores').select('player_name', { count: 'exact', head: true }).lt('attempts', tries)
     setWorldRank((count ?? 0) + 1)
     if (profile?.name) await supabase.from('wordle_scores').insert({ player_name: profile.name, attempts: tries })
   } else if (newGuesses.length >= MAX_ATTEMPTS) {
     setWon(false)
     setPhase('result')
     window.dispatchEvent(new Event('gameResult'))
   }
 }, [profile?.name])

 const handleKey = useCallback((key: string) => {
   if (phase !== 'playing') return
   if (key === 'DEL' || key === 'BACKSPACE') { setCurrent(c => c.slice(0,-1)); return }
   if (key === 'ENTER') {
     setCurrent(curr => {
       if (curr.length === WORD_LENGTH) {
         submitGuess(curr, word, guesses, cellStates)
       }
       return curr
     })
     return
   }
   if (/^[A-Z]$/.test(key)) setCurrent(c => c.length < WORD_LENGTH ? c + key : c)
 }, [phase, word, guesses, cellStates, submitGuess])

 useEffect(() => {
   const onKey = (e: KeyboardEvent) => handleKey(e.key.toUpperCase())
   window.addEventListener('keydown', onKey)
   return () => window.removeEventListener('keydown', onKey)
 }, [handleKey])

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 if (phase === 'rules') return (
   <GameRulesScreen icon="wordly.png" title="Wordly" subtitle="Guess the 5-letter word in 6 tries" worldRecord={worldRecord} myBest={myBest !== null ? myBest+' tries' : null} top5={top5} onPlay={startGame} />
 )

 if (phase === 'result') return (
   <GameResultScreen
     result={won ? guesses.length+' tries' : 'Failed'}
     resultColor={won ? (guesses.length <= 3 ? '#00C853' : GOLD) : '#D32F2F'}
     background={won ? (guesses.length <= 3 ? '#0D3320' : '#2D1A00') : '#1A0000'}
     worldRank={won ? worldRank : null}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   >
     {!won && <div style={{ fontSize:20, fontWeight:900, color:'rgba(255,255,255,0.6)' }}>Word: {word}</div>}
   </GameResultScreen>
 )

 return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 20px', flexShrink:0 }}>
       <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{guesses.length}/{MAX_ATTEMPTS}</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>WORDLY</div>
       <div style={{ width:40 }} />
     </div>

     <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5, padding:'0 16px' }}>
       {Array.from({ length: MAX_ATTEMPTS }).map((_, row) => {
         const guess = guesses[row]
         const rowStates = cellStates[row]
         const isActive = row === guesses.length
         const letters = isActive ? current.padEnd(WORD_LENGTH) : (guess || '').padEnd(WORD_LENGTH)
         return (
           <div key={row} style={{ display:'flex', gap:5 }}>
             {Array.from({ length: WORD_LENGTH }).map((_, col) => {
               const letter = letters[col] === ' ' ? '' : letters[col]
               const state: CellState = rowStates ? rowStates[col] : (isActive ? 'active' : 'empty')
               return (
                 <div key={col} style={{ width:52, height:52, borderRadius:8, background:BG[state], border: (state === 'empty' || state === 'active') ? '2px solid rgba(255,255,255,0.15)' : 'none', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:'#fff', transition:'background 0.3s' }}>
                   {letter}
                 </div>
               )
             })}
           </div>
         )
       })}
     </div>

     <div style={{ padding:'8px 8px 80px', flexShrink:0 }}>
       {KEYBOARD_ROWS.map((row, i) => (
         <div key={i} style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:4 }}>
           {row.map(k => (
             <button key={k} onPointerDown={() => handleKey(k)}
               style={{ height:44, minWidth: k.length > 1 ? 52 : 32, borderRadius:6, border:'none', background: keyColors[k] || '#3a3a3a', color:'#fff', fontSize: k.length > 1 ? 10 : 15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', padding:'0 3px', userSelect:'none', transition:'background 0.2s' }}>
               {k}
             </button>
           ))}
         </div>
       ))}
     </div>
   </main>
 )
}
