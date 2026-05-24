'use client'
import { useState, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { updateStreak } from '@/lib/streak'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const RED = '#C62828'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const START_CHIPS = 1000

const SUITS = ['♠','♥','♦','♣']
const VALUES = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']

type Card = { suit: string, value: string }
type Phase = 'rules' | 'betting' | 'playing' | 'dealer' | 'result' | 'gameover'

function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS)
    for (const value of VALUES)
      deck.push({ suit, value })
  return deck.sort(() => Math.random() - 0.5)
}

function cardValue(card: Card): number {
  if (['J','Q','K'].includes(card.value)) return 10
  if (card.value === 'A') return 11
  return parseInt(card.value)
}

function handValue(hand: Card[]): number {
  let total = hand.reduce((sum, c) => sum + cardValue(c), 0)
  let aces = hand.filter(c => c.value === 'A').length
  while (total > 21 && aces > 0) { total -= 10; aces-- }
  return total
}

function isRed(suit: string) { return suit === '♥' || suit === '♦' }

function CardView({ card, hidden }: { card: Card, hidden?: boolean }) {
  if (hidden) return (
    <div style={{ width:56, height:80, borderRadius:10, background:'#1a3a6b', border:'2px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🂠</div>
  )
  return (
    <div style={{ width:56, height:80, borderRadius:10, background:'#fff', border:'2px solid rgba(0,0,0,0.1)', display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'space-between', padding:'4px 6px', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}>
      <div style={{ fontSize:14, fontWeight:900, color: isRed(card.suit)?'#C62828':'#111', lineHeight:1 }}>{card.value}</div>
      <div style={{ fontSize:22, color: isRed(card.suit)?'#C62828':'#111', alignSelf:'center' }}>{card.suit}</div>
      <div style={{ fontSize:14, fontWeight:900, color: isRed(card.suit)?'#C62828':'#111', lineHeight:1, transform:'rotate(180deg)' }}>{card.value}</div>
    </div>
  )
}

export default function BlackjackClient() {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [deck, setDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [dealerHand, setDealerHand] = useState<Card[]>([])
  const [chips, setChips] = useState(START_CHIPS)
  const [bet, setBet] = useState(100)
  const [peakChips, setPeakChips] = useState(START_CHIPS)
  const [roundResult, setRoundResult] = useState<'win'|'lose'|'push'|'blackjack'|null>(null)
  const [worldRecord, setWorldRecord] = useState<{chips:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,chips:number}[]>([])
  const [saveName, setSaveName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [worldRank, setWorldRank] = useState<number|null>(null)

  useEffect(() => {
   if (profile?.name) {
     setSaveName(profile.name)
     // Load saved chips
     supabase.from('profiles').select('current_chips').eq('player_name', profile.name).single().then(({data}:any) => {
       if (data?.current_chips && data.current_chips > 0) {
         setChips(data.current_chips)
         setPeakChips(data.current_chips)
       }
     })
   }
   loadData()
 }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('blackjack_scores').select('player_name,chips').order('chips', { ascending: false }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.chips > best[s.player_name]) best[s.player_name] = s.chips })
    const sorted = Object.entries(best).map(([n,c]) => ({name:n, chips:c as number})).sort((a,b) => b.chips-a.chips)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({chips:sorted[0].chips, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
  }

  const startGame = (forceReset = false) => {
   setChips(START_CHIPS)
   setPeakChips(START_CHIPS)
   if (profile?.name) {
     supabase.from('profiles').update({ current_chips: START_CHIPS }).eq('player_name', profile.name)
   }
    setBet(100)
    setPhase('betting')
    setDeck(createDeck())
    setSaved(false)
    setWorldRank(null)
  }

  const placeBet = (amount: number) => {
    if (amount > chips) return
    setBet(amount)
  }

  const deal = () => {
    if (bet > chips) return
    const newDeck = deck.length > 10 ? [...deck] : createDeck()
    const p = [newDeck.pop()!, newDeck.pop()!]
    const d = [newDeck.pop()!, newDeck.pop()!]
    setDeck(newDeck)
    setPlayerHand(p)
    setDealerHand(d)
    setRoundResult(null)

    // Check blackjack
    if (handValue(p) === 21) {
      const winnings = Math.floor(bet * 1.5)
      const newChips = chips - bet + bet + winnings
      setChips(newChips)
     setPeakChips(prev => Math.max(prev, newChips))
     if (profile?.name) {
       supabase.from('profiles').update({ current_chips: newChips }).eq('player_name', profile.name)
     }
     setRoundResult('blackjack')
      setPhase('result')
    } else {
      setPhase('playing')
    }
  }

  const hit = () => {
    const newDeck = [...deck]
    const card = newDeck.pop()!
    const newHand = [...playerHand, card]
    setDeck(newDeck)
    setPlayerHand(newHand)
    if (handValue(newHand) > 21) {
     const newChips = chips - bet
     setChips(newChips)
     if (profile?.name) {
       supabase.from('profiles').update({ current_chips: Math.max(newChips, 0) }).eq('player_name', profile.name)
     }
     setRoundResult('lose')
     setPhase('result')
     if (newChips <= 0) setTimeout(() => setPhase('gameover'), 1500)
    }
  }

  const stand = () => {
    setPhase('dealer')
    let newDeck = [...deck]
    let dHand = [...dealerHand]

    // Dealer draws to 17
    while (handValue(dHand) < 17) {
      dHand.push(newDeck.pop()!)
    }
    setDeck(newDeck)
    setDealerHand(dHand)

    const pVal = handValue(playerHand)
    const dVal = handValue(dHand)

    let result: 'win'|'lose'|'push'
    let newChips = chips
    if (dVal > 21 || pVal > dVal) { result = 'win'; newChips = chips + bet }
    else if (pVal === dVal) { result = 'push' }
    else { result = 'lose'; newChips = chips - bet }

    setChips(newChips)
   setPeakChips(prev => Math.max(prev, newChips))
   setRoundResult(result)
   setPhase('result')
   if (profile?.name) {
     supabase.from('profiles').update({ current_chips: Math.max(newChips, 0) }).eq('player_name', profile.name)
   }
   if (newChips <= 0) setTimeout(() => setPhase('gameover'), 1500)
  }

  const cashOut = async () => {
    if (profile?.name) {
      await supabase.from('blackjack_scores').insert({player_name:profile.name, chips:peakChips})
      const {count} = await supabase.from('blackjack_scores').select('*',{count:'exact',head:true}).gt('chips',peakChips)
      setWorldRank((count??0)+1)
      if (myBest===null || peakChips>myBest) setMyBest(peakChips)
      await updateStreak(profile.name)
    }
    setPhase('gameover')
  }

  const saveScore = async () => {
    if (!saveName.trim() || pin.join('').length!==4) return
    setSaving(true); setSaveError('')
    const pinHash = btoa(pin.join(''))
    const {data:existing} = await supabase.from('profiles').select('password_hash').eq('player_name',saveName.trim()).maybeSingle()
    if (existing) {
      if (existing.password_hash !== pinHash) { setSaveError('Wrong PIN'); setSaving(false); return }
    } else {
      await supabase.from('profiles').insert({player_name:saveName.trim(), password_hash:pinHash})
    }
    await supabase.from('blackjack_scores').insert({player_name:saveName.trim(), chips:peakChips})
    const {count} = await supabase.from('blackjack_scores').select('*',{count:'exact',head:true}).gt('chips',peakChips)
    setWorldRank((count??0)+1)
    setSaving(false); setSaved(true)
    localStorage.setItem('memgenius_profile', JSON.stringify({name:saveName.trim()}))
    setTimeout(() => window.location.reload(), 1500)
  }

  const nextRound = () => {
    if (chips <= 0) { setPhase('gameover'); return }
    const newBet = Math.min(bet, chips)
    setBet(newBet)
    setPhase('betting')
  }

  const reset = () => { setPhase('rules'); setSaved(false); loadData() }

  const BET_OPTIONS = [50, 100, 200, 500, 1000].filter(b => b <= chips)

  // Rules
  if (phase === 'rules') return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <img src={`${BASE}/blackjack.png`} style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Blackjack</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Grow your stack. Cash out at your peak.</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? `${worldRecord.chips.toLocaleString()}` : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest ? myBest.toLocaleString() : '—'}</div>
        </div>
      </div>

      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.chips.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:24 }}>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.7 }}>
          Start with 1,000 chips. Beat the dealer to grow your stack. Cash out anytime — your peak chips is your world ranking score.
        </div>
      </div>

      <button onClick={() => setPhase('betting')} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080', marginTop:'auto' }}>
        Play →
      </button>
    </main>
  )

  const pVal = handValue(playerHand)
  const dVal = handValue(dealerHand)
  const showDealer = phase === 'dealer' || phase === 'result' || phase === 'gameover'

  // Betting screen
  if (phase === 'betting') return (
    <main style={{ height:'100dvh', background:'#0a2a0a', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'16px 20px 80px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <button onClick={reset} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>CHIPS</div>
          <div style={{ fontSize:28, fontWeight:900, color:GOLD }}>{chips.toLocaleString()}</div>
        </div>
        <button onClick={cashOut} style={{ background:'rgba(200,150,12,0.2)', border:`1px solid ${GOLD}`, borderRadius:10, padding:'6px 12px', color:GOLD, fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>Cash Out</button>
      </div>

      {peakChips > START_CHIPS && (
        <div style={{ textAlign:'center', marginBottom:16, fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Peak: {peakChips.toLocaleString()} chips</div>
      )}

      <div style={{ fontSize:18, fontWeight:900, color:'rgba(255,255,255,0.7)', textAlign:'center', marginBottom:20 }}>Place your bet</div>

      <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', marginBottom:24 }}>
        {BET_OPTIONS.map(b => (
          <button key={b} onClick={() => placeBet(b)} style={{ padding:'12px 20px', borderRadius:12, border:`2px solid ${bet===b?GOLD:'rgba(255,255,255,0.15)'}`, background: bet===b?'rgba(200,150,12,0.2)':'rgba(255,255,255,0.06)', color: bet===b?GOLD:'rgba(255,255,255,0.6)', fontSize:16, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
            {b}
          </button>
        ))}
      </div>

      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Current bet</div>
        <div style={{ fontSize:48, fontWeight:900, color:'#fff' }}>{bet}</div>
      </div>

      <button onClick={deal} style={{ width:'100%', padding:'20px', borderRadius:20, border:'none', background:GREEN, color:'#fff', fontSize:20, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 8px 0 #1B5E2080', marginTop:'auto' }}>
        Deal →
      </button>
    </main>
  )

  // Playing / Dealer / Result
  return (
    <main style={{ minHeight:'100dvh', background:'#0a2a0a', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'16px 20px 100px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <button onClick={reset} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>CHIPS</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{chips.toLocaleString()}</div>
        </div>
        <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)' }}>Bet: {bet}</div>
      </div>

      {/* Result banner */}
      {phase === 'result' && roundResult && (
        <div style={{ textAlign:'center', marginBottom:16, padding:'12px', borderRadius:14, background:
          roundResult==='win'||roundResult==='blackjack' ? 'rgba(46,125,50,0.4)' :
          roundResult==='push' ? 'rgba(100,100,100,0.4)' : 'rgba(198,40,40,0.4)' }}>
          <div style={{ fontSize:22, fontWeight:900, color:
            roundResult==='win'||roundResult==='blackjack' ? '#69F0AE' :
            roundResult==='push' ? '#fff' : '#FF5252' }}>
            {roundResult==='blackjack' ? '🃏 Blackjack! +'+Math.floor(bet*1.5) :
             roundResult==='win' ? `✓ You win! +${bet}` :
             roundResult==='push' ? 'Push — tie!' : `✗ Dealer wins -${bet}`}
          </div>
        </div>
      )}

      {/* Dealer hand */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, marginBottom:8 }}>
          DEALER {showDealer ? `— ${dVal}` : ''}
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {dealerHand.map((card, i) => (
            <CardView key={i} card={card} hidden={i===1 && !showDealer} />
          ))}
        </div>
      </div>

      {/* Player hand */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, marginBottom:8 }}>
          YOU — {pVal}{pVal > 21 ? ' BUST' : pVal === 21 ? ' 🎉' : ''}
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {playerHand.map((card, i) => <CardView key={i} card={card} />)}
        </div>
      </div>

      {/* Actions */}
      {phase === 'playing' && (
        <div style={{ display:'flex', gap:12, marginTop:'auto' }}>
          <button onClick={hit} style={{ flex:1, padding:'18px', borderRadius:16, border:'none', background:RED, color:'#fff', fontSize:18, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #7F000080' }}>Hit</button>
          <button onClick={stand} style={{ flex:1, padding:'18px', borderRadius:16, border:'none', background:GREEN, color:'#fff', fontSize:18, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E2080' }}>Stand</button>
        </div>
      )}

      {phase === 'result' && (
        <div style={{ display:'flex', gap:10, marginTop:'auto' }}>
          <button onClick={cashOut} style={{ flex:1, padding:'14px', borderRadius:14, border:`1px solid ${GOLD}`, background:'rgba(200,150,12,0.15)', color:GOLD, fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Cash Out</button>
          <button onClick={nextRound} style={{ flex:2, padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 5px 0 #1B5E2080' }}>Next hand →</button>
        </div>
      )}

      {/* Gameover */}
      {phase === 'gameover' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', zIndex:100 }}>
          <div style={{ background:'#1C1C1E', borderRadius:24, padding:'28px', width:'100%', maxWidth:360, textAlign:'center', border:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize:48, marginBottom:8 }}>🃏</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:4 }}>Game Over</div>
            <div style={{ fontSize:36, fontWeight:900, color:GOLD, marginBottom:4 }}>{peakChips.toLocaleString()}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:16 }}>peak chips</div>
            {worldRank && <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:16 }}>#{worldRank} in the world</div>}

            {!profile?.name && !saved && (
              <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:14, padding:'12px', marginBottom:16 }}>
                <input value={saveName} onChange={e=>setSaveName(e.target.value)} placeholder="Your name" style={{ width:'100%', padding:'8px', borderRadius:8, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:13, fontWeight:800, fontFamily:'inherit', outline:'none', marginBottom:8, boxSizing:'border-box' }} />
                <div style={{ display:'flex', gap:5, justifyContent:'center', marginBottom:8 }}>
                  {pin.map((d,i) => (
                    <input key={i} id={`pin-bj-${i}`} type="tel" maxLength={1} value={d}
                      onChange={e=>{const v=e.target.value.replace(/\D/,'');const p=[...pin];p[i]=v;setPin(p);if(v&&i<3)(document.getElementById(`pin-bj-${i+1}`) as HTMLInputElement)?.focus()}}
                      style={{ width:36, height:42, textAlign:'center', fontSize:18, fontWeight:900, borderRadius:8, border:'2px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'#fff', fontFamily:'inherit', outline:'none' }} />
                  ))}
                </div>
                {saveError && <div style={{ fontSize:11, color:'#FF5252', fontWeight:800, marginBottom:6 }}>{saveError}</div>}
                <button onClick={saveScore} disabled={!saveName.trim()||pin.join('').length!==4||saving} style={{ width:'100%', padding:'8px', borderRadius:8, border:'none', background:GREEN, color:'#fff', fontSize:13, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
                  {saving?'Saving...':'Save →'}
                </button>
              </div>
            )}
            {saved && <div style={{ background:'rgba(46,125,50,0.3)', borderRadius:10, padding:'8px', marginBottom:16 }}><div style={{ fontSize:13, fontWeight:900, color:'#69F0AE' }}>✓ Saved!</div></div>}

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={reset} style={{ flex:1, padding:'14px', borderRadius:14, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>← Back</button>
              <button onClick={() => startGame(true)} style={{ flex:2, padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Play again →</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
