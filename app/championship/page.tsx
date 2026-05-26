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

function getCountdown() {
 const now = new Date()
 const sunday = getThisSunday()
 const end = new Date(sunday)
 end.setUTCHours(23,59,59,999)
 const isActive = now >= sunday && now <= end
 const target = isActive ? end : sunday
 const diff = target.getTime() - now.getTime()
 const h = Math.floor(diff / 3600000)
 const m = Math.floor((diff % 3600000) / 60000)
 const s = Math.floor((diff % 60000) / 1000)
 return { isActive, h, m, s, sunday }
}

export default function ChampionshipPage() {
 const { profile } = usePlayer()
 const [countdown, setCountdown] = useState(getCountdown())
 const [ranking, setRanking] = useState<any[]>([])
 const [week, setWeek] = useState<any>(null)
 const [hallOfFame, setHallOfFame] = useState<any[]>([])
 const [myRank, setMyRank] = useState<number | null>(null)

 useEffect(() => {
   const timer = setInterval(() => setCountdown(getCountdown()), 1000)
   return () => clearInterval(timer)
 }, [])

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
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', padding:'32px 20px 100px' }}>

     <div style={{ textAlign:'center', marginBottom:32 }}>
       <div style={{ fontSize:11, fontWeight:800, color:GOLD, letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Every Sunday</div>
       <div style={{ fontSize:32, fontWeight:900, color:'#fff', marginBottom:8 }}>Sunday Brain<br />Championship</div>
       <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>One game. One day. One winner.</div>
     </div>

     <div style={{ background:'linear-gradient(135deg, #1a2a1a, #0D3320)', borderRadius:24, padding:'24px', marginBottom:20, border:'1px solid rgba(46,125,50,0.3)' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, marginBottom:8 }}>THIS WEEK</div>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}><img src={gameIcon} style={{ width:64, height:64, objectFit:'contain' }} /><div style={{ fontSize:32, fontWeight:900, color:'#fff' }}>{gameLabel}</div></div>

       <div style={{ marginBottom:20 }}>
         <div style={{ fontSize:11, fontWeight:800, color: countdown.isActive ? '#69F0AE' : 'rgba(255,255,255,0.4)', letterSpacing:2, marginBottom:8 }}>
           {countdown.isActive ? 'CHAMPIONSHIP LIVE' : 'STARTS IN'}
         </div>
         <div style={{ display:'flex', gap:12 }}>
           {[{v:countdown.h,l:'HRS'},{v:countdown.m,l:'MIN'},{v:countdown.s,l:'SEC'}].map(({v,l}) => (
             <div key={l} style={{ flex:1, background:'rgba(0,0,0,0.3)', borderRadius:12, padding:'12px', textAlign:'center' }}>
               <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>{String(v).padStart(2,'0')}</div>
               <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>{l}</div>
             </div>
           ))}
         </div>
       </div>

       <a href={gameHref} style={{ textDecoration:'none', display:'block', background:GREEN, borderRadius:16, padding:'16px', textAlign:'center', boxShadow:'0 6px 0 #1B5E2080' }}>
         <div style={{ fontSize:16, fontWeight:900, color:'#fff' }}>Play {gameLabel} →</div>
       </a>

        <button onClick={() => { if (navigator.share) { navigator.share({ title:'Sunday Brain Championship', text:'Can you beat the world? This Sunday: ' + gameLabel, url:'https://memgenius.com/championship' }) } else { navigator.clipboard.writeText('https://memgenius.com/championship'); alert('Link copied!') } }} style={{ width:'100%', marginTop:10, padding:'14px', borderRadius:16, border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'var(--font-nunito), sans-serif', cursor:'pointer' }}>
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
           {ranking.slice(0,20).map((r, i) => (
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
 )
}
