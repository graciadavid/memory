'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

const ALL_GAMES_QUERY = `
 SELECT player_name, created_at, 'memory' as game FROM scores
 UNION ALL SELECT player_name, created_at, 'stop' FROM precision_scores WHERE game_type IS NULL
 UNION ALL SELECT player_name, created_at, 'formula1' FROM precision_scores WHERE game_type = 'formula1'
 UNION ALL SELECT player_name, created_at, 'pendulum' FROM precision_scores WHERE game_type = 'pendulum'
 UNION ALL SELECT player_name, created_at, 'ace' FROM ace_scores
 UNION ALL SELECT player_name, created_at, 'flags' FROM flag_scores
 UNION ALL SELECT player_name, created_at, 'higher_lower_pop' FROM higher_lower_scores WHERE category = 'population'
 UNION ALL SELECT player_name, created_at, 'higher_lower_area' FROM higher_lower_scores WHERE category = 'area'
 UNION ALL SELECT player_name, created_at, 'countries' FROM shape_scores
 UNION ALL SELECT player_name, created_at, 'digits' FROM number_scores
 UNION ALL SELECT player_name, created_at, 'simon' FROM sequence_scores
 UNION ALL SELECT player_name, created_at, 'nback' FROM nback_scores
 UNION ALL SELECT player_name, created_at, 'sudoku' FROM sudoku_scores
 UNION ALL SELECT player_name, created_at, 'mastermind' FROM mastermind_scores
 UNION ALL SELECT player_name, created_at, 'g2048' FROM game2048_scores
 UNION ALL SELECT player_name, created_at, 'wordly' FROM wordle_scores
 UNION ALL SELECT player_name, created_at, 'letter_rain' FROM letter_rain_scores
 UNION ALL SELECT player_name, created_at, 'capitals' FROM capitals_scores
 UNION ALL SELECT player_name, created_at, 'blink' FROM blink_scores
 UNION ALL SELECT player_name, created_at, 'blackjack' FROM blackjack_scores
 UNION ALL SELECT player_name, created_at, 'poke' FROM poke_scores
 UNION ALL SELECT player_name, created_at, 'typedrop' FROM typedrop_scores
`

type Period = '1h' | 'today' | 'yesterday' | 'last_month' | 'last_year' | 'all'

function getPeriodFilter(period: Period): string {
 const now = new Date()
 switch (period) {
   case '1h': return `created_at >= '${new Date(now.getTime() - 3600000).toISOString()}'`
   case 'today': return `created_at >= '${new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()}'`
   case 'yesterday': {
     const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
     const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
     return `created_at >= '${start.toISOString()}' AND created_at < '${end.toISOString()}'`
   }
   case 'last_month': return `created_at >= '${new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString()}'`
   case 'last_year': return `created_at >= '${new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString()}'`
   default: return '1=1'
 }
}

function timeAgo(date: string) {
 const diff = Date.now() - new Date(date).getTime()
 const m = Math.floor(diff / 60000)
 const h = Math.floor(m / 60)
 const d = Math.floor(h / 24)
 if (d > 0) return d + 'd ago'
 if (h > 0) return h + 'h ago'
 if (m > 0) return m + 'm ago'
 return 'just now'
}

export default function AdminPage() {
 const [period, setPeriod] = useState<Period>('today')
 const [stats, setStats] = useState<any>(null)
 const [players, setPlayers] = useState<any[]>([])
 const [lastGames, setLastGames] = useState<any[]>([])
 const [gameStats, setGameStats] = useState<any[]>([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
   loadAll()
   const t = setInterval(loadAll, 60000)
   return () => clearInterval(t)
 }, [period])

 const loadAll = async () => {
   setLoading(true)
   const filter = getPeriodFilter(period)
   await Promise.all([loadStats(filter), loadPlayers(filter), loadLastGames(), loadGameStats(filter)])
   setLoading(false)
 }

 const loadStats = async (filter: string) => {
   const { data } = await supabase.rpc('exec_sql', { query: `
     SELECT COUNT(*) as games, COUNT(DISTINCT player_name) as players
     FROM (${ALL_GAMES_QUERY}) g WHERE ${filter}
   ` }).catch(() => ({ data: null }))

   // Fallback - use individual queries
   const tables = [
     { table: 'scores', filter: '' },
     { table: 'precision_scores', filter: "WHERE game_type IS NULL" },
     { table: 'precision_scores', filter: "WHERE game_type = 'formula1'" },
     { table: 'precision_scores', filter: "WHERE game_type = 'pendulum'" },
     { table: 'ace_scores', filter: '' },
     { table: 'flag_scores', filter: '' },
     { table: 'higher_lower_scores', filter: '' },
     { table: 'shape_scores', filter: '' },
     { table: 'number_scores', filter: '' },
     { table: 'sequence_scores', filter: '' },
     { table: 'nback_scores', filter: '' },
     { table: 'sudoku_scores', filter: '' },
     { table: 'mastermind_scores', filter: '' },
     { table: 'game2048_scores', filter: '' },
     { table: 'wordle_scores', filter: '' },
     { table: 'letter_rain_scores', filter: '' },
     { table: 'capitals_scores', filter: '' },
     { table: 'blink_scores', filter: '' },
     { table: 'blackjack_scores', filter: '' },
     { table: 'poke_scores', filter: '' },
     { table: 'typedrop_scores', filter: '' },
   ]

   let totalGames = 0
   const allPlayers = new Set<string>()

   await Promise.all(tables.map(async ({ table, filter: tableFilter }) => {
     let q = supabase.from(table).select('player_name, created_at', { count: 'exact' })
     if (tableFilter.includes('IS NULL')) q = (q as any).is('game_type', null)
     else if (tableFilter.includes('formula1')) q = (q as any).eq('game_type', 'formula1')
     else if (tableFilter.includes('pendulum')) q = (q as any).eq('game_type', 'pendulum')

     const periodF = getPeriodFilter(period)
     if (period === '1h') q = (q as any).gte('created_at', new Date(Date.now() - 3600000).toISOString())
     else if (period === 'today') q = (q as any).gte('created_at', new Date(new Date().setHours(0,0,0,0)).toISOString())
     else if (period === 'yesterday') {
       const start = new Date(); start.setDate(start.getDate()-1); start.setHours(0,0,0,0)
       const end = new Date(); end.setHours(0,0,0,0)
       q = (q as any).gte('created_at', start.toISOString()).lt('created_at', end.toISOString())
     } else if (period === 'last_month') q = (q as any).gte('created_at', new Date(Date.now() - 30*86400000).toISOString())
     else if (period === 'last_year') q = (q as any).gte('created_at', new Date(Date.now() - 365*86400000).toISOString())

     const { data, count } = await q
     totalGames += count || 0
     data?.forEach((r: any) => { if (r.player_name) allPlayers.add(r.player_name) })
   }))

   setStats({ games: totalGames, players: allPlayers.size })
 }

 const loadPlayers = async (filter: string) => {
   const { data } = await supabase.from('profiles').select('player_name, country, streak, last_played_date').order('last_played_date', { ascending: false }).limit(20)
   setPlayers(data || [])
 }

 const loadLastGames = async () => {
   const results: any[] = []
   const tables = [
     { table: 'scores', game: 'Memory', field: 'time_ms' },
     { table: 'precision_scores', game: 'Stop', field: 'difference_ms', filter: { game_type: null } },
     { table: 'ace_scores', game: 'Ace', field: 'level' },
     { table: 'blink_scores', game: 'Blink', field: 'level' },
     { table: 'flag_scores', game: 'Flags', field: 'level' },
     { table: 'nback_scores', game: 'N-Back', field: 'level' },
     { table: 'wordle_scores', game: 'Wordly', field: 'attempts' },
     { table: 'mastermind_scores', game: 'Mastermind', field: 'attempts' },
   ]
   await Promise.all(tables.map(async ({ table, game, field }) => {
     let q = supabase.from(table).select('player_name, created_at, ' + field).order('created_at', { ascending: false }).limit(3)
     const { data } = await q
     data?.forEach((r: any) => results.push({ game, player: r.player_name || 'anon', score: r[field], time: r.created_at }))
   }))
   results.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
   setLastGames(results.slice(0, 20))
 }

 const loadGameStats = async (filter: string) => {
   const games = [
     { name: 'Stop', table: 'precision_scores', gameType: null },
     { name: 'F1', table: 'precision_scores', gameType: 'formula1' },
     { name: 'Pendulum', table: 'precision_scores', gameType: 'pendulum' },
     { name: 'Memory', table: 'scores', gameType: undefined },
     { name: 'Ace', table: 'ace_scores', gameType: undefined },
     { name: 'Blink', table: 'blink_scores', gameType: undefined },
     { name: 'Flags', table: 'flag_scores', gameType: undefined },
     { name: 'Capitals', table: 'capitals_scores', gameType: undefined },
     { name: 'Countries', table: 'shape_scores', gameType: undefined },
     { name: 'N-Back', table: 'nback_scores', gameType: undefined },
     { name: 'Digits', table: 'number_scores', gameType: undefined },
     { name: 'Simon', table: 'sequence_scores', gameType: undefined },
     { name: 'Letter Rain', table: 'letter_rain_scores', gameType: undefined },
     { name: 'TypeDrop', table: 'typedrop_scores', gameType: undefined },
     { name: 'Poke', table: 'poke_scores', gameType: undefined },
     { name: 'Wordly', table: 'wordle_scores', gameType: undefined },
     { name: 'Mastermind', table: 'mastermind_scores', gameType: undefined },
     { name: 'Sudoku', table: 'sudoku_scores', gameType: undefined },
     { name: '2048', table: 'game2048_scores', gameType: undefined },
     { name: 'Blackjack', table: 'blackjack_scores', gameType: undefined },
     { name: 'HL Pop', table: 'higher_lower_scores', gameType: 'population', catField: true },
     { name: 'HL Area', table: 'higher_lower_scores', gameType: 'area', catField: true },
   ]

   const results = await Promise.all(games.map(async g => {
     let q = supabase.from(g.table).select('*', { count: 'exact', head: true })
     if (g.gameType === null) q = (q as any).is('game_type', null)
     else if (g.gameType !== undefined && !g.catField) q = (q as any).eq('game_type', g.gameType)
     else if (g.catField) q = (q as any).eq('category', g.gameType)

     if (period === '1h') q = (q as any).gte('created_at', new Date(Date.now() - 3600000).toISOString())
     else if (period === 'today') q = (q as any).gte('created_at', new Date(new Date().setHours(0,0,0,0)).toISOString())
     else if (period === 'yesterday') {
       const start = new Date(); start.setDate(start.getDate()-1); start.setHours(0,0,0,0)
       const end = new Date(); end.setHours(0,0,0,0)
       q = (q as any).gte('created_at', start.toISOString()).lt('created_at', end.toISOString())
     } else if (period === 'last_month') q = (q as any).gte('created_at', new Date(Date.now() - 30*86400000).toISOString())
     else if (period === 'last_year') q = (q as any).gte('created_at', new Date(Date.now() - 365*86400000).toISOString())

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

     {/* Period selector */}
     <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
       {PERIODS.map(p => (
         <button key={p.key} onClick={() => setPeriod(p.key)}
           style={{ padding:'8px 14px', borderRadius:10, border:'none', background: period === p.key ? GOLD : '#252525', color: period === p.key ? '#000' : '#fff', fontSize:13, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
           {p.label}
         </button>
       ))}
       {loading && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, alignSelf:'center' }}>Loading...</div>}
     </div>

     {/* Main stats */}
     {stats && (
       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
         <div style={{ background:'#1a1a1a', borderRadius:14, padding:'16px', textAlign:'center', border:'1px solid rgba(255,255,255,0.08)' }}>
           <div style={{ fontSize:36, fontWeight:900, color:GREEN }}>{stats.games.toLocaleString()}</div>
           <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>GAMES</div>
         </div>
         <div style={{ background:'#1a1a1a', borderRadius:14, padding:'16px', textAlign:'center', border:'1px solid rgba(255,255,255,0.08)' }}>
           <div style={{ fontSize:36, fontWeight:900, color:'#1565C0' }}>{stats.players.toLocaleString()}</div>
           <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>PLAYERS</div>
         </div>
       </div>
     )}

     {/* Game stats */}
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

     {/* Last games */}
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
             <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)' }}>{timeAgo(g.time)}</div>
           </div>
         </div>
       ))}
     </div>

     {/* Players */}
     <div style={{ background:'#1a1a1a', borderRadius:14, padding:'14px', border:'1px solid rgba(255,255,255,0.08)' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, marginBottom:10 }}>PLAYERS</div>
       {players.map((p, i) => (
         <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
           <div style={{ flex:1 }}>
             <div style={{ fontSize:13, fontWeight:900, color:'#fff' }}>{p.player_name} {p.country ? '🏳️' : ''}</div>
             <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>Last: {p.last_played_date || '—'}</div>
           </div>
           <div style={{ textAlign:'right' }}>
             {p.streak > 0 && <div style={{ fontSize:12, fontWeight:800, color:'#FF6B35' }}>🔥{p.streak}</div>}
           </div>
         </div>
       ))}
     </div>
   </main>
 )
}
