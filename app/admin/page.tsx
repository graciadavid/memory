'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'

type Period = '1h' | '1d' | 'yesterday' | 'month' | 'year'

const PERIODS: { key: Period, label: string }[] = [
 { key: '1h', label: '1h' },
 { key: '1d', label: 'Today' },
 { key: 'yesterday', label: 'Yesterday' },
 { key: 'month', label: 'Month' },
 { key: 'year', label: 'Year' },
]

const GAME_TABLES = [
 { table: 'scores', game: 'memory', filter: null },
 { table: 'precision_scores', game: 'stop', filter: { col: 'game_type', val: null, isNull: true } },
 { table: 'precision_scores', game: 'f1', filter: { col: 'game_type', val: 'formula1', isNull: false } },
 { table: 'precision_scores', game: 'pendulum', filter: { col: 'game_type', val: 'pendulum', isNull: false } },
 { table: 'ace_scores', game: 'ace', filter: null },
 { table: 'flag_scores', game: 'flags', filter: null },
 { table: 'higher_lower_scores', game: 'hl_pop', filter: { col: 'category', val: 'population', isNull: false } },
 { table: 'higher_lower_scores', game: 'hl_area', filter: { col: 'category', val: 'area', isNull: false } },
 { table: 'shape_scores', game: 'countries', filter: null },
 { table: 'number_scores', game: 'digits', filter: null },
 { table: 'sequence_scores', game: 'simon', filter: null },
 { table: 'nback_scores', game: 'nback', filter: null },
 { table: 'sudoku_scores', game: 'sudoku', filter: null },
 { table: 'mastermind_scores', game: 'mastermind', filter: null },
 { table: 'game2048_scores', game: '2048', filter: null },
 { table: 'wordle_scores', game: 'wordly', filter: null },
 { table: 'letter_rain_scores', game: 'letter_rain', filter: null },
 { table: 'capitals_scores', game: 'capitals', filter: null },
 { table: 'blink_scores', game: 'blink', filter: null },
 { table: 'blackjack_scores', game: 'blackjack', filter: null },
]

function getPeriodRange(period: Period): { from: string, to?: string } {
 const now = new Date()
 if (period === '1h') return { from: new Date(now.getTime() - 3600000).toISOString() }
 if (period === '1d') { const d = new Date(); d.setHours(0,0,0,0); return { from: d.toISOString() } }
 if (period === 'yesterday') {
   const from = new Date(); from.setDate(from.getDate()-1); from.setHours(0,0,0,0)
   const to = new Date(); to.setHours(0,0,0,0)
   return { from: from.toISOString(), to: to.toISOString() }
 }
 if (period === 'month') return { from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString() }
 return { from: new Date(now.getFullYear(), 0, 1).toISOString() }
}

export default function AdminPage() {
  const [adminPass, setAdminPass] = useState('')
  const [adminAuth, setAdminAuth] = useState(false)

 const [period, setPeriod] = useState<Period>('1d')
const [potd, setPotd] = useState('capitals')
const [potdSaving, setPotdSaving] = useState(false)
const [potdSaved, setPotdSaved] = useState(false)

useEffect(() => {
  supabase.from('settings').select('value').eq('key','play_of_the_day').single()
    .then(({data}:any) => { if (data?.value) setPotd(data.value) })
}, [])
 const [loading, setLoading] = useState(false)
 const [totalPlays, setTotalPlays] = useState(0)
 const [totalUsers, setTotalUsers] = useState(0)
 const [gamePlays, setGamePlays] = useState<{game:string, plays:number}[]>([])
 const [lastGames, setLastGames] = useState<{player_name:string, game:string, created_at:string}[]>([])

 useEffect(() => { load() }, [period])

 const load = async () => {
   setLoading(true)
   const { from, to } = getPeriodRange(period)

   // Fetch each game
   const results = await Promise.all(
     GAME_TABLES.map(async ({ table, game, filter }) => {
       let q = supabase.from(table).select('player_name, created_at', { count: 'exact', head: false })
         .gte('created_at', from)
       if (to) q = q.lt('created_at', to)
       if (filter) {
         if (filter.isNull) q = q.is(filter.col, null)
         else q = q.eq(filter.col, filter.val)
       }
       const { data, count } = await q.order('created_at', { ascending: false }).limit(5000)
       return { game, plays: count || 0, rows: (data || []) as {player_name:string, created_at:string}[] }
     })
   )

   // Aggregate
   let total = 0
   const users = new Set<string>()
   const plays: {game:string, plays:number}[] = []
   const allRows: {player_name:string, game:string, created_at:string}[] = []

   results.forEach(({ game, plays: p, rows }) => {
     total += p
     plays.push({ game, plays: p })
     rows.forEach(r => {
       users.add(r.player_name)
       allRows.push({ player_name: r.player_name, game, created_at: r.created_at })
     })
   })

   // Fetch last 10 separately for recency
   const lastResults = await Promise.all(
     GAME_TABLES.map(async ({ table, game, filter }) => {
       let q = supabase.from(table).select('player_name, created_at')
       if (filter) {
         if (filter.isNull) q = q.is(filter.col, null)
         else q = q.eq(filter.col, filter.val)
       }
       const { data } = await q.order('created_at', { ascending: false }).limit(3)
       return (data || []).map((r:any) => ({ player_name: r.player_name, game, created_at: r.created_at }))
     })
   )
   const last10 = lastResults.flat().sort((a:any,b:any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0,10)

   setTotalPlays(total)
   setTotalUsers(users.size)
   setGamePlays(plays.filter(p => p.plays > 0).sort((a, b) => b.plays - a.plays))
   setLastGames(last10)
   setLoading(false)
 }

 const fmt = (d: string) => new Date(d).toLocaleString('es', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
 const maxPlays = Math.max(...gamePlays.map(g => g.plays), 1)

 return (
   <main style={{ minHeight: '100dvh', background: '#1C1C1E', fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 600, margin: '0 auto', padding: '24px 20px 100px', color: '#fff' }}>
     <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Admin</div>
     <button onClick={load} disabled={loading} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 24 }}>
       {loading ? 'Loading...' : '↻ Refresh'}
     </button>

     {/* Play of the Day */}

      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'16px', marginBottom:16, border:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, marginBottom:10 }}>PLAY OF THE DAY</div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <select value={potd} onChange={e=>setPotd(e.target.value)} style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14, fontWeight:800, fontFamily:'inherit', outline:'none' }}>
            <option value="memory">Memory</option><option value="digits">Digits</option><option value="sequence">Sequence</option><option value="nback">Nback</option><option value="blink">Blink</option><option value="stop">Stop</option><option value="f1">F1</option><option value="pendulum">Pendulum</option><option value="ace">Ace</option><option value="letter-rain">Letter rain</option><option value="flags">Flags</option><option value="capitals">Capitals</option><option value="countries">Countries</option><option value="blackjack">Blackjack</option><option value="sudoku">Sudoku</option><option value="mastermind">Mastermind</option><option value="2048">2048</option><option value="wordly">Wordly</option>
          </select>
          <button onClick={async()=>{setPotdSaving(true);await supabase.from('settings').upsert({key:'play_of_the_day',value:potd,updated_at:new Date().toISOString()});setPotdSaving(false);setPotdSaved(true);setTimeout(()=>setPotdSaved(false),2000)}} style={{ padding:'10px 16px', borderRadius:10, border:'none', background:potdSaved?'#2E7D32':'#C8960C', color:'#000', fontSize:13, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
            {potdSaving?'...' : potdSaved?'Saved':'Save'}
          </button>
        </div>
      </div>

     {/* Period tabs */}
     <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
       {PERIODS.map(p => (
         <button key={p.key} onClick={() => setPeriod(p.key)} style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: period === p.key ? GOLD : 'rgba(255,255,255,0.06)', color: period === p.key ? '#000' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>
           {p.label}
         </button>
       ))}
     </div>

     {/* KPIs */}
     <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
       <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px', textAlign: 'center' }}>
         <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Total Plays</div>
         <div style={{ fontSize: 42, fontWeight: 900, color: GOLD }}>{totalPlays.toLocaleString()}</div>
       </div>
       <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px', textAlign: 'center' }}>
         <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Users</div>
         <div style={{ fontSize: 42, fontWeight: 900, color: '#69F0AE' }}>{totalUsers.toLocaleString()}</div>
       </div>
     </div>

     {/* By game */}
     <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '16px', marginBottom: 24 }}>
       <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>By Game</div>
       <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
         {gamePlays.map(({ game, plays }) => (
           <div key={game} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
             <div style={{ width: 90, fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize', flexShrink: 0 }}>{game}</div>
             <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
               <div style={{ height: '100%', background: GOLD, borderRadius: 3, width: `${Math.round((plays / maxPlays) * 100)}%` }} />
             </div>
             <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', width: 40, textAlign: 'right' }}>{plays}</div>
           </div>
         ))}
       </div>
     </div>

     {/* Last 10 games */}
     <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '16px' }}>
       <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Last 10 Games</div>
       <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
         {lastGames.map((g, i) => (
           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
             <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.35)', flexShrink: 0, width: 110 }}>{fmt(g.created_at)}</div>
             <div style={{ flex: 1, fontSize: 13, fontWeight: 800, color: '#fff' }}>{g.player_name}</div>
             <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{g.game}</div>
           </div>
         ))}
       </div>
     </div>
   </main>
 )
}
