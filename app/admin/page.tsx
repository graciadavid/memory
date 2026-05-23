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

const TABLES = [
  { table: 'scores', game: 'memory' },
  { table: 'precision_scores', game: 'stop', filter: 'game_type IS NULL' },
  { table: 'precision_scores', game: 'f1', filter: "game_type = 'formula1'" },
  { table: 'precision_scores', game: 'pendulum', filter: "game_type = 'pendulum'" },
  { table: 'ace_scores', game: 'ace' },
  { table: 'flag_scores', game: 'flags' },
  { table: 'higher_lower_scores', game: 'hl_pop', filter: "category = 'population'" },
  { table: 'higher_lower_scores', game: 'hl_area', filter: "category = 'area'" },
  { table: 'shape_scores', game: 'countries' },
  { table: 'number_scores', game: 'digits' },
  { table: 'sequence_scores', game: 'simon' },
  { table: 'nback_scores', game: 'nback' },
  { table: 'sudoku_scores', game: 'sudoku' },
  { table: 'mastermind_scores', game: 'mastermind' },
  { table: 'game2048_scores', game: '2048' },
  { table: 'wordle_scores', game: 'wordly' },
]

function getDateFilter(period: Period): string {
  const now = new Date()
  switch (period) {
    case '1h': return new Date(now.getTime() - 3600000).toISOString()
    case '1d': return new Date(now.setHours(0,0,0,0)).toISOString()
    case 'yesterday': {
      const y = new Date(); y.setDate(y.getDate()-1); y.setHours(0,0,0,0)
      return y.toISOString()
    }
    case 'month': return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    case 'year': return new Date(now.getFullYear(), 0, 1).toISOString()
  }
}

function getDateFilterEnd(period: Period): string | null {
  if (period === 'yesterday') {
    const y = new Date(); y.setDate(y.getDate()); y.setHours(0,0,0,0)
    return y.toISOString()
  }
  return null
}

export default function AdminPage() {
  const [period, setPeriod] = useState<Period>('1d')
  const [totalPlays, setTotalPlays] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [gamePlays, setGamePlays] = useState<Record<string,number>>({})
  const [activity, setActivity] = useState<{player_name:string, game:string, created_at:string}[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadData() }, [period])

  const loadData = async () => {
    setLoading(true)
    const from = getDateFilter(period)
    const to = getDateFilterEnd(period)

    // Load all games in parallel
    const results = await Promise.all(
      TABLES.map(async ({table, game, filter}) => {
        let q = supabase.from(table).select('player_name, created_at', {count:'exact'}).gte('created_at', from)
        if (to) q = q.lt('created_at', to)
        // Apply game-specific filters
        if (table === 'precision_scores') {
          if (game === 'stop') q = q.is('game_type', null)
          else if (game === 'f1') q = q.eq('game_type', 'formula1')
          else if (game === 'pendulum') q = q.eq('game_type', 'pendulum')
        }
        if (table === 'higher_lower_scores') {
          if (game === 'hl_pop') q = q.eq('category', 'population')
          else if (game === 'hl_area') q = q.eq('category', 'area')
        }
        const {data, count} = await q.order('created_at', {ascending: false}).limit(5000)
        return { game, count: count || 0, data: data || [] }
      })
    )

    const plays: Record<string,number> = {}
    const allUsers = new Set<string>()
    const allActivity: {player_name:string, game:string, created_at:string}[] = []
    let total = 0

    results.forEach(({game, count, data}) => {
      plays[game] = count
      total += count
      data.forEach((d:any) => {
        allUsers.add(d.player_name)
        allActivity.push({player_name: d.player_name, game, created_at: d.created_at})
      })
    })

    allActivity.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setTotalPlays(total)
    setTotalUsers(allUsers.size)
    setGamePlays(plays)
    setActivity(allActivity.slice(0, 10))
    setLoading(false)
  }

  const fmt = (d: string) => {
    const date = new Date(d)
    return date.toLocaleTimeString('es', {hour:'2-digit', minute:'2-digit', second:'2-digit'})
  }

  return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:600, margin:'0 auto', padding:'24px 20px 100px', color:'#fff' }}>
      <div style={{ fontSize:24, fontWeight:900, marginBottom:24 }}>Admin</div>

      {/* Period tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {PERIODS.map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)} style={{ flex:1, padding:'10px', borderRadius:12, border:'none', background: period===p.key ? GOLD : 'rgba(255,255,255,0.06)', color: period===p.key ? '#000' : 'rgba(255,255,255,0.5)', fontSize:13, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
            {p.label}
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', padding:40 }}>Loading...</div>}

      {!loading && <>
        {/* KPIs */}
        <div style={{ display:'flex', gap:12, marginBottom:24 }}>
          <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'20px', textAlign:'center' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Total Plays</div>
            <div style={{ fontSize:42, fontWeight:900, color:GOLD }}>{totalPlays.toLocaleString()}</div>
          </div>
          <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'20px', textAlign:'center' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Total Users</div>
            <div style={{ fontSize:42, fontWeight:900, color:'#69F0AE' }}>{totalUsers.toLocaleString()}</div>
          </div>
        </div>

        {/* Game breakdown */}
        <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'16px', marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>By Game</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {TABLES
              .filter(t => gamePlays[t.game] > 0)
              .sort((a,b) => (gamePlays[b.game]||0) - (gamePlays[a.game]||0))
              .map(({game}) => (
              <div key={game} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ flex:1, fontSize:14, fontWeight:800, color:'rgba(255,255,255,0.7)', textTransform:'capitalize' }}>{game}</div>
                <div style={{ fontSize:14, fontWeight:900, color:'#fff' }}>{gamePlays[game].toLocaleString()}</div>
                <div style={{ width:100, height:6, background:'rgba(255,255,255,0.08)', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', background:GOLD, borderRadius:3, width:`${Math.round((gamePlays[game]/Math.max(...Object.values(gamePlays)))*100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last 10 activity */}
        <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'16px' }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Last 10 Games</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {activity.map((a, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.5)', width:60 }}>{fmt(a.created_at)}</div>
                <div style={{ flex:1, fontSize:13, fontWeight:800, color:'#fff' }}>{a.player_name}</div>
                <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.4)', textTransform:'capitalize' }}>{a.game}</div>
              </div>
            ))}
          </div>
        </div>
      </>}
    </main>
  )
}
