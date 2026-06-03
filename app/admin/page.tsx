'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

type Period = '1h' | 'today' | 'yesterday' | 'last_month' | 'last_year' | 'all'

function formatDateTime(date: string) {
 const d = new Date(date)
 const day = d.toLocaleDateString('en-GB', { day:'2-digit', month:'short' })
 const time = d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })
 return `${day} ${time}`
}

const ALL_GAMES = `
 SELECT COALESCE(player_name, 'anonymous') as player_name, created_at, 'memory' as game FROM scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'flags' FROM flag_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'higher_lower_' || category FROM higher_lower_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'countries' FROM shape_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'g2048' FROM game2048_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'mastermind' FROM mastermind_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'sudoku' FROM sudoku_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'wordle' FROM wordle_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'ace' FROM ace_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, COALESCE(game_type, 'stop') FROM precision_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'number' FROM number_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'simon' FROM sequence_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'nback' FROM nback_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'letter_rain' FROM letter_rain_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'capitals' FROM capitals_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'blink' FROM blink_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'blackjack' FROM blackjack_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'poke' FROM poke_scores
 UNION ALL SELECT COALESCE(player_name, 'anonymous'), created_at, 'typedrop' FROM typedrop_scores
`

export default function AdminPage() {
 const [period, setPeriod] = useState<Period>('today')
 const [players, setPlayers] = useState<any[]>([])
 const [lastGames, setLastGames] = useState<any[]>([])
 const [gameStats, setGameStats] = useState<any[]>([])
 const [totalGames, setTotalGames] = useState(0)
 const [totalPlayers, setTotalPlayers] = useState(0)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
   loadAll()
   const t = setInterval(loadAll, 60000)
   return () => clearInterval(t)
 }, [period])

 const getPeriodFrom = () => {
   const now = new Date()
   if (period === '1h') return new Date(Date.now() - 3600000).toISOString()
   if (period === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
   if (period === 'yesterday') return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
   if (period === 'last_month') return new Date(Date.now() - 30*86400000).toISOString()
   if (period === 'last_year') return new Date(Date.now() - 365*86400000).toISOString()
   return null
 }

 const getPeriodTo = () => {
   const now = new Date()
   if (period === 'yesterday') return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
   return null
 }

 const loadAll = async () => {
   setLoading(true)
   await Promise.all([loadPlayers(), loadLastGames(), loadGameStats()])
   setLoading(false)
 }

 const loadPlayers = async () => {
   const tables = [
     { table: 'scores', game: 'memory' },
     { table: 'flag_scores', game: 'flags' },
     { table: 'shape_scores', game: 'countries' },
     { table: 'ace_scores', game: 'ace' },
     { table: 'blink_scores', game: 'blink' },
     { table: 'nback_scores', game: 'nback' },
     { table: 'number_scores', game: 'digits' },
     { table: 'sequence_scores', game: 'simon' },
     { table: 'capitals_scores', game: 'capitals' },
     { table: 'sudoku_scores', game: 'sudoku' },
     { table: 'mastermind_scores', game: 'mastermind' },
     { table: 'wordle_scores', game: 'wordly' },
     { table: 'game2048_scores', game: 'g2048' },
     { table: 'blackjack_scores', game: 'blackjack' },
     { table: 'poke_scores', game: 'poke' },
     { table: 'letter_rain_scores', game: 'letter_rain' },
     { table: 'typedrop_scores', game: 'typedrop' },
     { table: 'precision_scores', game: 'stop' },
     { table: 'higher_lower_scores', game: 'hl' },
   ]

   const from = getPeriodFrom()
   const to = getPeriodTo()
   const allRows: any[] = []

   await Promise.all(tables.map(async ({ table, game }) => {
     let q = supabase.from(table).select('player_name, created_at')
     if (from) q = (q as any).gte('created_at', from)
     if (to) q = (q as any).lt('created_at', to)
     const { data } = await q
     data?.forEach((r: any) => allRows.push({ player: r.player_name || 'anonymous', time: r.created_at, game }))
   }))

   // aggregate by player
   const map: Record<string, any> = {}
   allRows.forEach(r => {
     if (!map[r.player]) map[r.player] = { player: r.player, games: 0, lastGame: r.time }
     map[r.player].games++
     if (r.time > map[r.player].lastGame) map[r.player].lastGame = r.time
   })

   const sorted = Object.values(map).sort((a: any, b: any) => new Date(b.lastGame).getTime() - new Date(a.lastGame).getTime())
   setTotalGames(allRows.length)
   setTotalPlayers(sorted.length)
   setPlayers(sorted.slice(0, 30))
 }

 const loadLastGames = async () => {
   const tables = [
     { table: 'scores', game: 'Memory', field: 'time_ms' },
     { table: 'precision_scores', game: 'Stop/F1/Pend', field: 'difference_ms' },
     { table: 'ace_scores', game: 'Ace', field: 'level' },
     { table: 'blink_scores', game: 'Blink', field: 'level' },
     { table: 'flag_scores', game: 'Flags', field: 'level' },
     { table: 'nback_scores', game: 'N-Back', field: 'level' },
     { table: 'wordle_scores', game: 'Wordly', field: 'attempts' },
     { table: 'mastermind_scores', game: 'Mastermind', field: 'attempts' },
     { table: 'number_scores', game: 'Digits', field: 'level' },
     { table: 'sequence_scores', game: 'Simon', field: 'level' },
     { table: 'capitals_scores', game: 'Capitals', field: 'level' },
     { table: 'shape_scores', game: 'Countries', field: 'level' },
     { table: 'higher_lower_scores', game: 'HL', field: 'level' },
     { table: 'sudoku_scores', game: 'Sudoku', field: 'time_ms' },
     { table: 'game2048_scores', game: '2048', field: 'best_tile' },
     { table: 'blackjack_scores', game: 'Blackjack', field: 'chips' },
     { table: 'poke_scores', game: 'Poke', field: 'level' },
     { table: 'letter_rain_scores', game: 'Letter Rain', field: 'level' },
     { table: 'typedrop_scores', game: 'TypeDrop', field: 'score' },
   ]
   const results: any[] = []
   await Promise.all(tables.map(async ({ table, game, field }) => {
     const { data } = await supabase.from(table).select(`player_name, created_at, ${field}`).order('created_at', { ascending: false }).limit(3)
     data?.forEach((r: any) => results.push({ game, player: r.player_name || 'anon', score: r[field], time: r.created_at }))
   }))
   results.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
   setLastGames(results.slice(0, 30))
 }

 const loadGameStats = async () => {
   const games = [
     { name: 'Stop', table: 'precision_scores', filter: { game_type: null } },
     { name: 'F1', table: 'precision_scores', filter: { game_type: 'formula1' } },
     { name: 'Pendulum', table: 'precision_scores', filter: { game_type: 'pendulum' } },
     { name: 'Memory', table: 'scores' },
     { name: 'Ace', table: 'ace_scores' },
     { name: 'Blink', table: 'blink_scores' },
     { name: 'Flags', table: 'flag_scores' },
     { name: 'Capitals', table: 'capitals_scores' },
     { name: 'Countries', table: 'shape_scores' },
     { name: 'N-Back', table: 'nback_scores' },
     { name: 'Digits', table: 'number_scores' },
     { name: 'Simon', table: 'sequence_scores' },
     { name: 'Letter Rain', table: 'letter_rain_scores' },
     { name: 'TypeDrop', table: 'typedrop_scores' },
     { name: 'Poke', table: 'poke_scores' },
     { name: 'Wordly', table: 'wordle_scores' },
     { name: 'Mastermind', table: 'mastermind_scores' },
     { name: 'Sudoku', table: 'sudoku_scores' },
     { name: '2048', table: 'game2048_scores' },
     { name: 'Blackjack', table: 'blackjack_scores' },
     { name: 'HL Pop', table: 'higher_lower_scores', filter: { category: 'population' } },
     { name: 'HL Area', table: 'higher_lower_scores', filter: { category: 'area' } },
   ]
   const from = getPeriodFrom()
   const to = getPeriodTo()
   const results = await Promise.all(games.map(async (g: any) => {
     let q = supabase.from(g.table).select('*', { count: 'exact', head: true })
     if (g.filter?.game_type === null) q = (q as any).is('game_type', null)
     else if (g.filter?.game_type) q = (q as any).eq('game_type', g.filter.game_type)
     else if (g.filter?.category) q = (q as any).eq('category', g.filter.category)
     if (from) q = (q as any).gte('created_at', from)
     if (to) q = (q as any).lt('created_at', to)
     const { count } = await q
     return { name: g.name, count: count || 0 }
   }))
   setGameStats(results.sort((a, b) => b.count - a.count))
 }

 const PERIODS: { key: Period, label: string }[] = [
   { key: '1h', label: '1H' },
   { key: 'today', label: 'Today' },
   { key: 'yesterday', label: 'Yesterday' },
   { key: 'last_month', label: '30D' },
   { key: 'last_year', label: '1Y' },
   { key: 'all', label: 'All' },
 ]

 return (
   <main style={{ minHeight:'100dvh', background:'#0f0f0f', fontFamily:'var(--font-nunito),sans-serif', padding:'16px 16px 100px', color:'#fff' }}>
     <div style={{ fontSize:20, fontWeight:900, color:GOLD, marginBottom:16 }}>⚡ Admin</div>

     <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
       {PERIODS.map(p => (
         <button key={p.key} onClick={() => setPeriod(p.key)}
           style={{ padding:'8px 14px', borderRadius:10, border:'none', background: period === p.key ? GOLD : '#252525', color: period === p.key ? '#000' : '#fff', fontSize:13, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
           {p.label}
         </button>
       ))}
       {loading && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, alignSelf:'center' }}>Loading...</div>}
     </div>

     <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
       <div style={{ background:'#1a1a1a', borderRadius:14, padding:'16px', textAlign:'center', border:'1px solid rgba(255,255,255,0.08)' }}>
         <div style={{ fontSize:36, fontWeight:900, color:GREEN }}>{totalGames.toLocaleString()}</div>
         <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>GAMES</div>
       </div>
       <div style={{ background:'#1a1a1a', borderRadius:14, padding:'16px', textAlign:'center', border:'1px solid rgba(255,255,255,0.08)' }}>
         <div style={{ fontSize:36, fontWeight:900, color:'#1565C0' }}>{totalPlayers.toLocaleString()}</div>
         <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>PLAYERS</div>
       </div>
     </div>

     <div style={{ background:'#1a1a1a', borderRadius:14, padding:'14px', marginBottom:16, border:'1px solid rgba(255,255,255,0.08)' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, marginBottom:10 }}>GAMES BY TYPE</div>
       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
         {gameStats.filter(g => g.count > 0).map(g => (
           <div key={g.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#252525', borderRadius:8, padding:'8px 10px' }}>
             <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.7)' }}>{g.name}</div>
             <div style={{ fontSize:14, fontWeight:900, color:GOLD }}>{g.count}</div>
           </div>
         ))}
       </div>
     </div>

     <div style={{ background:'#1a1a1a', borderRadius:14, padding:'14px', marginBottom:16, border:'1px solid rgba(255,255,255,0.08)' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, marginBottom:10 }}>LAST GAMES</div>
       {lastGames.map((g, i) => (
         <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
           <div style={{ flex:1 }}>
             <div style={{ fontSize:13, fontWeight:900, color:'#fff' }}>{g.player}</div>
             <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>{g.game}</div>
           </div>
           <div style={{ textAlign:'right' }}>
             <div style={{ fontSize:13, fontWeight:800, color:GOLD }}>{g.score}</div>
             <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)' }}>{formatDateTime(g.time)}</div>
           </div>
         </div>
       ))}
     </div>

     <div style={{ background:'#1a1a1a', borderRadius:14, padding:'14px', border:'1px solid rgba(255,255,255,0.08)' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, marginBottom:10 }}>PLAYERS</div>
       {players.map((p, i) => (
         <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
           <div style={{ flex:1 }}>
             <div style={{ fontSize:13, fontWeight:900, color:'#fff' }}>{p.player}</div>
             <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>{formatDateTime(p.lastGame)}</div>
           </div>
           <div style={{ textAlign:'right' }}>
             <div style={{ fontSize:13, fontWeight:800, color:GREEN }}>{p.games} games</div>
           </div>
         </div>
       ))}
     </div>
   </main>
 )
}
