'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

function getThisSunday() {
 const now = new Date()
 const day = now.getUTCDay()
 const diff = day === 0 ? 0 : 7 - day
 const sunday = new Date(now)
 sunday.setUTCDate(now.getUTCDate() + diff)
 sunday.setUTCHours(0,0,0,0)
 return sunday
}

function getCountdown(sundayDate?: string) {
  const now = new Date()
  const sunday = sundayDate ? new Date(sundayDate + 'T00:00:00Z') : new Date()
  const end = new Date(sunday)
  end.setUTCHours(23,59,59,999)
  const isActive = now >= sunday && now <= end
  const target = isActive ? end : sunday
  const diff = Math.max(0, target.getTime() - now.getTime())
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { isActive, d, h, m, s }
}

export default function ChampionshipPage() {
 const { profile } = usePlayer()
  const [countdown, setCountdown] = useState(() => getCountdown('2026-06-01'))
 const [ranking, setRanking] = useState<any[]>([])
 const [week, setWeek] = useState<any>(null)
 const [hallOfFame, setHallOfFame] = useState<any[]>([])
 const [myRank, setMyRank] = useState<number | null>(null)

  useEffect(() => {
    if (!week?.sunday_date) return
    setCountdown(getCountdown(week.sunday_date))
    const timer = setInterval(() => setCountdown(getCountdown(week.sunday_date)), 1000)
    return () => clearInterval(timer)
  }, [week])
 useEffect(() => { loadWeek(); loadHallOfFame() }, [])

 useEffect(() => {
   if (!week) return
   loadRanking()
   const interval = setInterval(loadRanking, 5000)
   return () => clearInterval(interval)
 }, [week, profile])

 const loadWeek = async () => {
   const { data } = await supabase.from('championship_weeks').select('*').eq('active', true).single()
   setWeek(data)
 }

 const loadHallOfFame = async () => {
   const { data } = await supabase.from('championship_hall_of_fame').select('*').order('sunday_date', { ascending: false }).limit(10)
   setHallOfFame(data || [])
 }

 const loadRanking = async () => {
   if (!week) return
   const sunday = new Date(week.sunday_date)
   const start = sunday.toISOString()
   const end = new Date(sunday.getTime() + 86400000).toISOString()
   const { data } = await supabase.from('precision_scores').select('player_name, difference_ms').is('game_type', null).gte('created_at', start).lt('created_at', end)
   if (!data) return
   const best: Record<string, number> = {}
   data.forEach((s: any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
   const sorted = Object.entries(best).map(([name, ms]) => ({ name, ms })).sort((a, b) => a.ms - b.ms)
   setRanking(sorted)
   if (profile?.name) {
     const rank = sorted.findIndex(r => r.name === profile.name)
     setMyRank(rank >= 0 ? rank + 1 : null)
   }
 }

 const gameLabel = week?.game ? week.game.charAt(0).toUpperCase() + week.game.slice(1).replace('-', ' ') : 'Stop'
 const gameHref = week?.game ? `/${week.game}` : '/stop'
  const GAME_ICONS: Record<string,string> = { stop:'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/precision.png', blink:'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/blink.png', capitals:'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/capitals.png', flags:'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/flags.png', pendulum:'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/pendulum.png', digits:'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/digits.png', nback:'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/nback.png', ace:'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/ace.png', 'letter-rain':'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/letter-rain.png', mastermind:'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/mastermind.png' }
  const gameIcon = week?.game ? GAME_ICONS[week.game] : 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/precision.png'

 return (
   <>
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>

     <div style={{ textAlign:'center', marginBottom:32 }}>
       <div style={{ fontSize:11, fontWeight:800, color:GOLD, letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Every Sunday</div>
       <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:8 }}>
       <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/winner.png" style={{ width:44, height:44, objectFit:'contain' }} />
       <div style={{ fontSize:32, fontWeight:900, color:'#fff' }}>Sunday Brain<br />Championship</div>
       <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/winner.png" style={{ width:44, height:44, objectFit:'contain' }} />
     </div>
       <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>One game. One day. One winner.</div>
     </div>

      <div style={{ background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', borderRadius:24, padding:'24px', marginBottom:20, boxShadow:'0 8px 0 rgba(100,70,0,0.5)' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(0,0,0,0.5)', letterSpacing:2, marginBottom:8 }}>THIS WEEK</div>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}><img src={gameIcon} style={{ width:64, height:64, objectFit:'contain' }} /><div style={{ fontSize:32, fontWeight:900, color:'#000' }}>{gameLabel}</div></div>

       <div style={{ marginBottom:20 }}>
         <div style={{ fontSize:11, fontWeight:800, color: countdown.isActive ? '#69F0AE' : 'rgba(255,255,255,0.4)', letterSpacing:2, marginBottom:8 }}>
           {countdown.isActive ? 'CHAMPIONSHIP LIVE' : 'STARTS IN'}
         </div>
         <div style={{ display:'flex', gap:12 }}>
           {[{v:countdown.d,l:'DAYS'},{v:countdown.h,l:'HRS'},{v:countdown.m,l:'MIN'},{v:countdown.s,l:'SEC'}].map(({v,l}) => (
             <div key={l} style={{ flex:1, background:'rgba(0,0,0,0.3)', borderRadius:12, padding:'12px', textAlign:'center' }}>
               <div style={{ fontSize:28, fontWeight:900, color:'#000' }}>{String(v).padStart(2,'0')}</div>
               <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>{l}</div>
             </div>
           ))}
         </div>
       </div>

        <a href={gameHref} style={{ textDecoration:'none', display:'block', background:'rgba(0,0,0,0.25)', borderRadius:16, padding:'16px', textAlign:'center' }}>
         <div style={{ fontSize:16, fontWeight:900, color:'#000' }}>Play {gameLabel} →</div>
       </a>

        <button onClick={() => { if (navigator.share) { navigator.share({ title:'Sunday Brain Championship', text:'Can you beat the world? This Sunday: ' + gameLabel, url:'https://memgenius.com/championship' }) } else { navigator.clipboard.writeText('https://memgenius.com/championship'); alert('Link copied!') } }} style={{ width:'100%', marginTop:10, padding:'14px', borderRadius:16, border:'none', background:'#2E7D32', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'var(--font-nunito), sans-serif', cursor:'pointer' }}>
          🔗 Share Championship
        </button>

       {myRank && (
         <div style={{ marginTop:12, textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:700 }}>
           You are <span style={{ color:GOLD, fontWeight:900 }}>#{myRank}</span> of {ranking.length} players
         </div>
       )}
     </div>

     {ranking.length > 0 && (
       <div style={{ marginBottom:24 }}>
         <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Live Ranking</div>
         <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
           {ranking.slice(0,10).map((r, i) => (
             <div key={r.name} style={{ background: i === 0 ? 'rgba(200,150,12,0.1)' : 'rgba(255,255,255,0.04)', borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, border: i === 0 ? '1px solid rgba(200,150,12,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>
               <div style={{ fontSize:16, fontWeight:900, color: i === 0 ? GOLD : 'rgba(255,255,255,0.3)', width:28, textAlign:'center' }}>
                 {i === 0 ? '👑' : `#${i+1}`}
               </div>
               <div style={{ flex:1, fontSize:14, fontWeight:800, color: r.name === profile?.name ? GOLD : '#fff' }}>{r.name}</div>
               <div style={{ fontSize:14, fontWeight:900, color: r.ms < 50 ? '#69F0AE' : r.ms < 200 ? GOLD : 'rgba(255,255,255,0.6)' }}>{r.ms}ms</div>
             </div>
           ))}
         </div>
       </div>
     )}

     {hallOfFame.length > 0 && (
       <div>
         <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Hall of Fame</div>
         <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
           {hallOfFame.map((h) => (
             <div key={h.id} style={{ background:'rgba(255,255,255,0.04)', borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, border:'1px solid rgba(255,255,255,0.06)' }}>
               <div style={{ fontSize:20 }}>👑</div>
               <div style={{ flex:1 }}>
                 <div style={{ fontSize:14, fontWeight:900, color:'#fff' }}>{h.winner_name}</div>
                 <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>{h.game} · {new Date(h.sunday_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div>
               </div>
               <div style={{ fontSize:13, fontWeight:900, color:GOLD }}>{h.score}ms</div>
             </div>
           ))}
         </div>
       </div>
     )}

   </main>
    <ChampionshipSEO />
   </>
 )
}

function ChampionshipSEO() {
 return (
   <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif', background: '#1C1C1E', color: '#fff' }}>
     <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Sunday Brain Championship — The World's Weekly Cognitive Competition</h2>
     <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>Every Sunday, thousands of players from around the world compete in a single cognitive challenge. One game. One day. One winner. The Sunday Brain Championship is the world's first weekly brain training competition — free to enter, open to everyone, and decided purely by performance.</p>

     <details style={{ marginBottom: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         How the championship works
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', background: '#1C1C1E' }}>
         <p style={{ marginBottom: 10 }}>Each week a different game is selected from the MemGenius catalogue — Stop, Blink, Capitals, Flags, Pendulum, Digits and more. From 00:00 UTC to 23:59 UTC on Sunday, every registered player can compete. Your best score of the day counts. You can play as many times as you want to improve your result.</p>
         <p>The live ranking updates every few seconds throughout the day. At midnight, the championship closes automatically. The player with the best score is crowned champion and enters the Hall of Fame permanently.</p>
       </div>
     </details>

     <details style={{ marginBottom: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         Why compete? The science of competitive brain training
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', background: '#1C1C1E' }}>
         <p style={{ marginBottom: 10 }}>Competition is one of the most powerful motivators for cognitive improvement. Research in sports psychology consistently shows that competitive contexts produce greater effort, higher arousal and better performance than solo practice — and that performance improvements in competitive settings transfer to non-competitive ones.</p>
         <p>The weekly format is deliberately designed to match the optimal cycle for cognitive training. Daily practice builds the neural connections. Weekly competition provides the high-stakes moment that consolidates them. The combination of routine and peak performance is what drives genuine, lasting cognitive improvement.</p>
       </div>
     </details>

     <details style={{ marginBottom: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         The game rotation — what to train each week
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', background: '#1C1C1E' }}>
         <p style={{ marginBottom: 10 }}>The championship rotates through ten games covering all four cognitive categories. Stop and Pendulum test reaction time and temporal precision. Blink and Digits test working memory and spatial recall. Capitals and Flags test knowledge retrieval speed. Mastermind tests logical reasoning under pressure.</p>
         <p>No single cognitive profile dominates every week. The rotation ensures that different strengths are rewarded on different Sundays — making the championship genuinely inclusive and giving every type of player a realistic chance of winning.</p>
       </div>
     </details>

     <details style={{ marginBottom: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         How to prepare and win
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', background: '#1C1C1E' }}>
         <p style={{ marginBottom: 10 }}>The week before the championship is your preparation window. Play the featured game daily — even five minutes a day produces measurable improvement in the specific skill being tested. Your nervous system needs repetition to consolidate the timing and pattern recognition required for a top score.</p>
         <p style={{ marginBottom: 10 }}>On Sunday itself, play your first few attempts to warm up — do not expect your best score immediately. Peak cognitive performance typically occurs after three to five practice attempts, when your nervous system is calibrated and your focus is fully engaged.</p>
         <p>Avoid playing when fatigued, hungry or distracted. Cognitive performance is genuinely sensitive to physical state. The best scores are achieved in a focused, alert state — early afternoon tends to be optimal for most people.</p>
       </div>
     </details>

     <details style={{ marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
       <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         Free brain training competition — no entry fee, no limits
         <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>▼</span>
       </summary>
       <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', background: '#1C1C1E' }}>
         <p style={{ marginBottom: 10 }}>The Sunday Brain Championship is completely free. No entry fee, no premium tier, no advantage that can be purchased. Every player competes on equal terms — the only thing that matters is your cognitive performance on the day.</p>
         <p>All you need is a free MemGenius profile — a name and a four-digit PIN. Your scores are saved automatically, your rank updates in real time, and your place in the Hall of Fame is permanent if you win. The championship is open to players of all ages, backgrounds and experience levels worldwide.</p>
       </div>
     </details>
   </div>
 )
}
