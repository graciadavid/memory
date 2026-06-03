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

  const getRange = () => {
    const now = new Date()
    if (period === '1h') return { from: new Date(Date.now() - 3600000).toISOString(), to: null }
    if (period === 'today') return { from: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(), to: null }
    if (period === 'yesterday') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return { from: start.toISOString(), to: end.toISOString() }
    }
    if (period === 'last_month') return { from: new Date(Date.now() - 30*86400000).toISOString(), to: null }
    if (period === 'last_year') return { from: new Date(Date.now() - 365*86400000).toISOString(), to: null }
    return { from: null, to: null }
  }

  const applyRange = (q: any) => {
    const { from, to } = getRange()
    if (from) q = q.gte('created_at', from)
    if (to) q = q.lt('created_at', to)
    return q
  }

  const loadAll = async () => {
    setLoading(true)
    await Promise.all([loadStats(), loadPlayers(), loadLastGames(), loadGameStats()])
    setLoading(false)
  }

  const loadStats = async () => {
    const tables = [
      { table: 'scores' },
      { table: 'precision_scores', filter: { game_type: null } },
      { table: 'precision_scores', filter: { game_type: 'formula1' } },
      { table: 'precision_scores', filter: { game_type: 'pendulum' } },
      { table: 'ace_scores' }, { table: 'flag_scores' }, { table: 'higher_lower_scores' },
      { table: 'shape_scores' }, { table: 'number_scores' }, { table: 'sequence_scores' },
      { table: 'nback_scores' }, { table: 'sudoku_scores' }, { table: 'mastermind_scores' },
      { table: 'game2048_scores' }, { table: 'wordle_scores' }, { table: 'letter_rain_scores' },
      { table: 'capitals_scores' }, { table: 'blink_scores' }, { table: 'blackjack_scores' },
      { table: 'poke_scores' }, { table: 'typedrop_scores' },
    ]
    let totalGames = 0
    const allPlayers = new Set<string>()
    await Promise.all(tables.map(async ({ table, filter }: any) => {
      let q = supabase.from(table).select('player_name', { count: 'exact' })
      if (filter?.game_type === null) q = (q as any).is('game_type', null)
      else if (filter?.game_type) q = (q as any).eq('game_type', filter.game_type)
      q = applyRange(q)
      const { data, count } = await q
      totalGames += count || 0
      data?.forEach((r: any) => { if (r.player_name) allPlayers.add(r.player_name) })
    }))
    setStats({ games: totalGames, players: allPlayers.size })
  }

  const loadPlayers = async () => {
    const { data } = await supabase.from('profiles').select('player_name, country, streak, last_played_date').order('last_played_date', { ascending: false }).limit(30)
    setPlayers(data || [])
  }

  const loadLastGames = async () => {
    const tables = [
      { table: 'scores', game: 'Memory', field: 'time_ms' },
      { table: 'precision_scores', game: 'Stop', field: 'difference_ms', filter: { game_type: null } },
      { table: 'precision_scores', game: 'F1', field: 'difference_ms', filter: { game_type: 'formula1' } },
      { table: 'precision_scores', game: 'Pendulum', field: 'difference_ms', filter: { game_type: 'pendulum' } },
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
      { table: 'higher_lower_scores', game: 'HL Pop', field: 'level', filter: { category: 'population' } },
      { table: 'higher_lower_scores', game: 'HL Area', field: 'level', filter: { category: 'area' } },
      { table: 'sudoku_scores', game: 'Sudoku', field: 'time_ms' },
      { table: 'game2048_scores', game: '2048', field: 'best_tile' },
      { table: 'blackjack_scores', game: 'Blackjack', field: 'chips' },
      { table: 'poke_scores', game: 'Poke', field: 'level' },
      { table: 'letter_rain_scores', game: 'Letter Rain', field: 'level' },
      { table: 'typedrop_scores', game: 'TypeDrop', field: 'score' },
    ]
    const results: any[] = []
    await Promise.all(tables.map(async ({ table, game, field, filter }: any) => {
      let q = supabase.from(table).select('player_name, created_at, ' + field).order('created_at', { ascending: false }).limit(3)
      if (filter?.game_type === null) q = (q as any).is('game_type', null)
      else if (filter?.game_type) q = (q as any).eq('game_type', filter.game_type)
      else if (filter?.category) q = (q as any).eq('category', filter.category)
      const { data } = await q
      data?.forEach((r: any) => results.push({ game, player: r.player_name || 'anon', score: r[field], time: r.created_at }))
    }))
    results.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    setLastGames(results.slice(0, 30))
  }

  const loadGameStats = async () => {
    const games = [
      { name: 'Stop', table: 'precision_scores', gt: null },
      { name: 'F1', table: 'precision_scores', gt: 'formula1' },
      { name: 'Pendulum', table: 'precision_scores', gt: 'pendulum' },
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
      { name: 'HL Pop', table: 'higher_lower_scores', cat: 'population' },
      { name: 'HL Area', table: 'higher_lower_scores', cat: 'area' },
    ]
    const results = await Promise.all(games.map(async (g: any) => {
      let q = supabase.from(g.table).select('*', { count: 'exact', head: true })
      if (g.gt === null) q = (q as any).is('game_type', null)
      else if (g.gt) q = (q as any).eq('game_type', g.gt)
      else if (g.cat) q = (q as any).eq('category', g.cat)
      q = applyRange(q)
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
              <div style={{ fontSize:13, fontWeight:900, color:'#fff' }}>{p.player_name}</div>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>{p.last_played_date || '—'}</div>
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
