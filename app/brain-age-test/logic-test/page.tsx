'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const COLORS = ['#D32F2F', '#1565C0', '#F9A825', '#2E7D32']
const COLOR_NAMES = ['Red', 'Blue', 'Yellow', 'Green']
const CODE_LENGTH = 4
const MAX_ATTEMPTS = 8

function getPercentile(attempts: number, birthYear: number): number {
 const age = new Date().getFullYear() - birthYear
 const median = age <= 25 ? 4 : age <= 35 ? 5 : age <= 50 ? 6 : 7
 const map: Record<number, number> = { 1: 99, 2: 92, 3: 80, 4: 65, 5: 50, 6: 35, 7: 20, 8: 10 }
 return map[attempts] || 5
}

function generateCode(): number[] {
 return Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * COLORS.length))
}

function checkGuess(guess: number[], code: number[]): { exact: number; color: number } {
 let exact = 0
 let color = 0
 const codeCopy = [...code]
 const guessCopy = [...guess]
 for (let i = 0; i < CODE_LENGTH; i++) {
   if (guess[i] === code[i]) { exact++; codeCopy[i] = -1; guessCopy[i] = -1 }
 }
 for (let i = 0; i < CODE_LENGTH; i++) {
   if (guessCopy[i] === -1) continue
   const j = codeCopy.indexOf(guessCopy[i])
   if (j !== -1) { color++; codeCopy[j] = -1 }
 }
 return { exact, color }
}

type Phase = 'intro' | 'playing' | 'result'

export default function LogicTestPage() {
 const [phase, setPhase] = useState<Phase>('intro')
 const [code, setCode] = useState<number[]>([])
 const [currentGuess, setCurrentGuess] = useState<number[]>([])
 const [attempts, setAttempts] = useState<{ guess: number[], result: { exact: number, color: number } }[]>([])
 const [won, setWon] = useState(false)
 const [percentile, setPercentile] = useState(0)
 const [session, setSession] = useState<any>(null)

 useEffect(() => {
   const s = localStorage.getItem('braintest_session')
   if (s) setSession(JSON.parse(s))
 }, [])

 const startGame = () => {
   setCode(generateCode())
   setCurrentGuess([])
   setAttempts([])
   setWon(false)
   setPhase('playing')
 }

 const addColor = (colorIdx: number) => {
   if (currentGuess.length < CODE_LENGTH) {
     setCurrentGuess([...currentGuess, colorIdx])
   }
 }

 const removeColor = () => {
   setCurrentGuess(currentGuess.slice(0, -1))
 }

 const submitGuess = () => {
   if (currentGuess.length !== CODE_LENGTH) return
   const result = checkGuess(currentGuess, code)
   const newAttempts = [...attempts, { guess: currentGuess, result }]
   setAttempts(newAttempts)
   setCurrentGuess([])

   if (result.exact === CODE_LENGTH) {
     setWon(true)
     const birthYear = session?.birthYear ? parseInt(session.birthYear) : 1990
     const pct = getPercentile(newAttempts.length, birthYear)
     setPercentile(pct)
     setPhase('result')
     const name = session?.name || JSON.parse(localStorage.getItem('memgenius_profile') || '{}').name
     if (name) {
       supabase.from('mastermind_scores').insert({ player_name: name, attempts: newAttempts.length })
       supabase.rpc('update_streak', { p_player_name: name })
     }
   } else if (newAttempts.length >= MAX_ATTEMPTS) {
     setWon(false)
     setPercentile(5)
     setPhase('result')
   }
 }

 const saveAndContinue = () => {
   if (!session) return
   const updated = { ...session, results: { ...session.results, logic: percentile } }
   localStorage.setItem('braintest_session', JSON.stringify(updated))
   window.location.href = '/brain-age-test'
 }

 return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>
     <a href="/brain-age-test" style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', textDecoration:'none', display:'block', marginBottom:20 }}>← Brain Age Test</a>

     <div style={{ fontSize:11, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>Step 3 of 4</div>
     <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:4 }}>Logic Test</div>
     <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>Crack the 4-color code</div>

     {phase === 'intro' && (
       <>
         <div style={{ background:'#252525', borderRadius:16, padding:'20px', marginBottom:20 }}>
           <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:12 }}>
             {COLORS.map((c, i) => <div key={i} style={{ width:32, height:32, borderRadius:'50%', background:c }} />)}
           </div>
           <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.7)', lineHeight:1.6, textAlign:'center' }}>
             Crack a secret 4-color code in {MAX_ATTEMPTS} attempts. After each guess you get hints.
           </div>
           <div style={{ marginTop:12, fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.6 }}>
             ⚫ = right color, right position<br/>
             ⚪ = right color, wrong position
           </div>
         </div>
         <button onClick={startGame}
           style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20' }}>
           Start Test →
         </button>
       </>
     )}

     {phase === 'playing' && (
       <>
         {/* Previous attempts */}
         <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:12 }}>
           {attempts.map((a, i) => (
             <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
               <div style={{ display:'flex', gap:4 }}>
                 {a.guess.map((c, j) => <div key={j} style={{ width:32, height:32, borderRadius:'50%', background:COLORS[c], border:'2px solid rgba(255,255,255,0.2)' }} />)}
               </div>
               <div style={{ display:'flex', gap:3, marginLeft:8 }}>
                 {Array.from({ length: a.result.exact }).map((_, j) => <div key={j} style={{ width:12, height:12, borderRadius:'50%', background:'#fff' }} />)}
                 {Array.from({ length: a.result.color }).map((_, j) => <div key={j} style={{ width:12, height:12, borderRadius:'50%', background:'rgba(255,255,255,0.3)', border:'1px solid rgba(255,255,255,0.5)' }} />)}
               </div>
               <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', marginLeft:'auto' }}>#{i+1}</div>
             </div>
           ))}
         </div>

         {/* Current guess */}
         <div style={{ background:'#252525', borderRadius:14, padding:'14px', marginBottom:12 }}>
           <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Attempt {attempts.length + 1} of {MAX_ATTEMPTS}</div>
           <div style={{ display:'flex', gap:8, marginBottom:12 }}>
             {Array.from({ length: CODE_LENGTH }).map((_, i) => (
               <div key={i} style={{ width:48, height:48, borderRadius:'50%', background: currentGuess[i] !== undefined ? COLORS[currentGuess[i]] : '#333', border:'2px solid rgba(255,255,255,0.15)', flex:1 }} />
             ))}
           </div>
           <div style={{ display:'flex', gap:6, marginBottom:10 }}>
             {COLORS.map((c, i) => (
               <div key={i} onClick={() => addColor(i)}
                 style={{ flex:1, height:44, borderRadius:10, background:c, cursor:'pointer', border:'2px solid rgba(255,255,255,0.2)' }} />
             ))}
           </div>
           <div style={{ display:'flex', gap:8 }}>
             <button onClick={removeColor}
               style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:'#333', color:'#fff', fontSize:14, fontWeight:800, fontFamily:'inherit', cursor:'pointer' }}>
               ← Remove
             </button>
             <button onClick={submitGuess} disabled={currentGuess.length !== CODE_LENGTH}
               style={{ flex:2, padding:'12px', borderRadius:10, border:'none', background: currentGuess.length === CODE_LENGTH ? GREEN : '#333', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor: currentGuess.length === CODE_LENGTH ? 'pointer' : 'not-allowed' }}>
               Submit →
             </button>
           </div>
         </div>
       </>
     )}

     {phase === 'result' && (
       <div style={{ textAlign:'center' }}>
         <div style={{ width:140, height:140, borderRadius:'50%', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
           <div style={{ width:124, height:124, borderRadius:'50%', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
             <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:1 }}>{won ? 'SOLVED IN' : 'FAILED'}</div>
             <div style={{ fontSize:36, fontWeight:900, color:won ? GOLD : '#FF5252', lineHeight:1 }}>{won ? `${attempts.length} tries` : 'X'}</div>
             {won && <div style={{ fontSize:13, fontWeight:800, color:GREEN }}>Top {percentile}%</div>}
           </div>
         </div>

         {!won && (
           <div style={{ marginBottom:16 }}>
             <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>The code was:</div>
             <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
               {code.map((c, i) => <div key={i} style={{ width:36, height:36, borderRadius:'50%', background:COLORS[c] }} />)}
             </div>
           </div>
         )}

         <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:24 }}>
           {won
             ? attempts.length <= 3 ? '🧠 Brilliant logic!' : attempts.length <= 5 ? '💪 Good solve!' : '🔥 Keep training!'
             : '😤 Try again — you\'ll get it!'}
         </div>

         <button onClick={startGame}
           style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:'#252525', color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:10 }}>
           Try Again
         </button>
         {won && (
           <button onClick={saveAndContinue}
             style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GOLD, color:'#000', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #8B6914' }}>
             Save & Continue →
           </button>
         )}
       </div>
     )}

     <details style={{ marginTop:40 }}>
       <summary style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.3)', cursor:'pointer', listStyle:'none' }}>What does this Logic Test measure? ▼</summary>
       <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.7, marginTop:12 }}>
         This logic test is based on Mastermind, a classic code-breaking game used in cognitive research. It measures deductive reasoning, systematic thinking and pattern recognition. The fewer attempts you need, the higher your logical intelligence score. Research shows logical reasoning ability correlates strongly with problem-solving performance in academic and professional settings.
       </div>
     </details>
   </main>
 )
}
