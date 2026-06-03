'use client'
import { useState, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const RED = '#D32F2F'

const SUITS = ['♠','♥','♦','♣']
const VALUES = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']

interface Card { suit: string, value: string }

function createDeck(): Card[] {
 const deck: Card[] = []
 for (const suit of SUITS) for (const value of VALUES) deck.push({ suit, value })
 return deck.sort(() => Math.random() - 0.5)
}

function cardValue(card: Card): number {
 if (['J','Q','K'].includes(card.value)) return 10
 if (card.value === 'A') return 11
 return parseInt(card.value)
}

function handTotal(hand: Card[]): number {
 let total = hand.reduce((sum, c) => sum + cardValue(c), 0)
 let aces = hand.filter(c => c.value === 'A').length
 while (total > 21 && aces > 0) { total -= 10; aces-- }
 return total
}

function isRed(card: Card): boolean {
 return card.suit === '♥' || card.suit === '♦'
}

type Phase = 'rules' | 'betting' | 'playing' | 'dealer' | 'result' | 'gameover'

export default function BlackjackClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('rules')
 const [chips, setChips] = useState(1000)
 const [bet, setBet] = useState(100)
 const [deck, setDeck] = useState<Card[]>([])
 const [playerHand, setPlayerHand] = useState<Card[]>([])
 const [dealerHand, setDealerHand] = useState<Card[]>([])
 const [message, setMessage] = useState('')
 const [roundResult, setRoundResult] = useState<'win'|'lose'|'push'|null>(null)
 const [worldRank, setWorldRank] = useState<number|null>(null)
 const [myBest, setMyBest] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])

 const loadData = useCallback(async () => {
   const { data } = await supabase.from('blackjack_scores').select('player_name, chips').order('chips', { ascending: false }).limit(5000)
   if (!data) return
   const best: Record<string,number> = {}
   data.forEach((s:any) => { if (!best[s.player_name] || s.chips > best[s.player_name]) best[s.player_name] = s.chips })
   const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
   setTop5(sorted.slice(0,5).map(([name,c]) => ({name, score:(c as number).toLocaleString()+' chips'})))
   const stored = typeof window !== 'undefined' ? localStorage.getItem('memgenius_profile') : null
    const pName = stored ? JSON.parse(stored).name : null
    if (pName && best[pName] !== undefined) setMyBest(best[pName])
 }, [profile?.name])

 useState(() => { loadData() })

 const startGame = () => {
   setChips(1000)
   setBet(100)
   setDeck(createDeck())
   setPhase('betting')
   window.dispatchEvent(new Event('gameStart'))
 }

 const dealCards = useCallback(() => {
   const newDeck = [...deck]
   const pH = [newDeck.pop()!, newDeck.pop()!]
   const dH = [newDeck.pop()!, newDeck.pop()!]
   setDeck(newDeck)
   setPlayerHand(pH)
   setDealerHand(dH)
   setRoundResult(null)
   setMessage('')
   setPhase('playing')

   if (handTotal(pH) === 21) {
     const winnings = Math.floor(bet * 1.5)
     setChips(c => c + winnings)
     setMessage('Blackjack! +'+winnings)
     setRoundResult('win')
     setPhase('dealer')
   }
 }, [deck, bet])

 const hit = useCallback(() => {
   const newDeck = [...deck]
   const card = newDeck.pop()!
   const newHand = [...playerHand, card]
   setDeck(newDeck)
   setPlayerHand(newHand)
   const total = handTotal(newHand)
   if (total > 21) {
     setChips(c => c - bet)
     setMessage('Bust! -'+bet)
     setRoundResult('lose')
     setPhase('dealer')
   }
 }, [deck, playerHand, bet])

 const stand = useCallback(async () => {
   let dHand = [...dealerHand]
   let dDeck = [...deck]
   while (handTotal(dHand) < 17) { dHand.push(dDeck.pop()!); }
   setDeck(dDeck)
   setDealerHand(dHand)

   const playerTotal = handTotal(playerHand)
   const dealerTotal = handTotal(dHand)
   let result: 'win'|'lose'|'push'
   let msg = ''

   if (dealerTotal > 21 || playerTotal > dealerTotal) {
     result = 'win'; setChips(c => { const nc = c + bet; return nc }); msg = 'You win! +'+bet.toLocaleString().toLocaleString()
   } else if (playerTotal === dealerTotal) {
     result = 'push'; msg = 'Push!'
   } else {
     result = 'lose'; setChips(c => { const nc = c - bet; return nc }); msg = 'Dealer wins! -'+bet.toLocaleString().toLocaleString()
   }
   setMessage(msg)
   setRoundResult(result)
   setPhase('dealer')

   // Check game over
   setTimeout(async () => {
     if (chips - (result === 'lose' ? bet : 0) <= 0) {
       setPhase('gameover')
       window.dispatchEvent(new Event('gameResult'))
       const finalChips = chips + (result === 'win' ? bet : result === 'lose' ? -bet : 0)
       const { count } = await supabase.from('blackjack_scores').select('player_name', { count: 'exact', head: true }).gt('chips', finalChips)
       setWorldRank((count ?? 0) + 1)
       if (profile?.name) await supabase.from('blackjack_scores').insert({ player_name: profile.name, chips: finalChips })
     supabase.rpc('update_streak', { p_player_name: profile.name })     }
   }, 100)
 }, [dealerHand, deck, playerHand, bet, chips, profile?.name])

 const nextRound = useCallback(() => {
   if (chips <= 0) { setPhase('gameover'); return }
   if (deck.length < 10) setDeck(createDeck())
   setBet(Math.min(bet, chips))
   setPhase('betting')
 }, [chips, deck, bet])

 const quitGame = useCallback(async () => {
   setPhase('gameover')
   window.dispatchEvent(new Event('gameResult'))
   const { count } = await supabase.from('blackjack_scores').select('player_name', { count: 'exact', head: true }).gt('chips', chips)
   setWorldRank((count ?? 0) + 1)
   if (profile?.name && chips > 1000) await supabase.from('blackjack_scores').insert({ player_name: profile.name, chips })
 }, [chips, profile?.name])

 const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null

 const renderCard = (card: Card, hidden = false) => (
   <div style={{ width:52, height:76, borderRadius:8, background: hidden ? '#1565C0' : '#fff', border:'1px solid rgba(255,255,255,0.2)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
     {!hidden && (
       <>
         <div style={{ fontSize:18, fontWeight:900, color: isRed(card) ? '#D32F2F' : '#1A1A1A' }}>{card.value}</div>
         <div style={{ fontSize:20, color: isRed(card) ? '#D32F2F' : '#1A1A1A' }}>{card.suit}</div>
       </>
     )}
   </div>
 )

 if (phase === 'rules') return (
   <GameRulesScreen icon="blackjack.png" title="Blackjack" subtitle="Beat the dealer. Start with 100 chips." worldRecord={worldRecord} myBest={myBest !== null ? myBest+' chips' : null} top5={top5} onPlay={startGame} />
 )

 if (phase === 'gameover') return (
   <GameResultScreen
     result={chips+' chips'}
     resultColor={chips > 1000 ? '#00C853' : chips === 100 ? GOLD : RED}
     background={chips > 1000 ? '#0D3320' : chips === 100 ? '#2D1A00' : '#1A0000'}
     worldRank={worldRank}
     hasProfile={!!profile?.name}
     onBack={() => { setPhase('rules'); loadData() }}
     onPlayAgain={startGame}
   />
 )

 return (
   <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
       <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{chips.toLocaleString()} chips</div>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>BLACKJACK</div>
       <button onClick={quitGame} style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Quit</button>
     </div>

     <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'0 20px', gap:16, justifyContent:'center' }}>

       {/* Dealer */}
       <div>
         <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>
           DEALER {phase === 'dealer' ? handTotal(dealerHand) : '?'}
         </div>
         <div style={{ display:'flex', gap:8 }}>
           {dealerHand.map((card, i) => renderCard(card, i === 1 && phase === 'playing'))}
         </div>
       </div>

       {/* Message */}
       {message && (
         <div style={{ fontSize:22, fontWeight:900, color: roundResult === 'win' ? '#00C853' : roundResult === 'lose' ? RED : GOLD, textAlign:'center' }}>
           {message}
         </div>
       )}

       {/* Player */}
       <div>
         <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>
           YOU {playerHand.length > 0 ? handTotal(playerHand) : ''}
         </div>
         <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
           {playerHand.map((card, i) => renderCard(card))}
         </div>
       </div>
     </div>

     {/* Actions */}
     <div style={{ padding:'12px 16px 80px', flexShrink:0 }}>
       {phase === 'betting' && (
         <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
           <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textAlign:'center' }}>Bet: {bet} chips</div>
            <div style={{ display:'flex', gap:8 }}>
             {[{label:'10%',pct:0.1},{label:'25%',pct:0.25},{label:'50%',pct:0.5},{label:'ALL',pct:1}].map(({label,pct}) => {
               const amount = Math.max(1, Math.floor(chips * pct))
               return (
                 <button key={label} onClick={() => setBet(amount)}
                   style={{ flex:1, padding:'10px 4px', borderRadius:10, border: bet === amount ? '2px solid '+GOLD : '2px solid transparent', background:'#252525', color: bet === amount ? GOLD : '#fff', fontSize:13, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
                   <div>{label}</div>
                   <div style={{ fontSize:10, opacity:0.6 }}>{amount.toLocaleString()}</div>
                 </button>
               )
             })}
           </div>
           <button onClick={dealCards} style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20' }}>
             Deal →
           </button>
         </div>
       )}

       {phase === 'playing' && (
         <div style={{ display:'flex', gap:10 }}>
           <button onClick={hit} style={{ flex:1, padding:'16px', borderRadius:14, border:'none', background:'#1565C0', color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #0D47A1' }}>Hit</button>
           <button onClick={stand} style={{ flex:1, padding:'16px', borderRadius:14, border:'none', background:RED, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #B71C1C' }}>Stand</button>
         </div>
       )}

       {phase === 'dealer' && (
         <button onClick={nextRound} style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E20' }}>
           Next Round →
         </button>
       )}
     </div>
   </main>
 )
}
