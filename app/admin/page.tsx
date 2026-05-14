'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const RED = '#B71C1C'

type Period = '1h' | '1d' | 'yesterday' | 'month' | 'year'

const PERIODS: { key: Period, label: string }[] = [
  { key: '1h', label: '1h' },
  { key: '1d', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
]

const CATEGORIES = [
  { key: 'memory', label: 'Memory', color: '#E91E63', games: [
    { key: 'memory', label: 'Memory', table: 'scores' },
    { key: 'digits', label: 'Digits', table: 'number_scores' },
    { key: 'simon', label: 'Simon Says', table: 'sequence_scores' },
  ]},
  { key: 'agility', label: 'Agility', color: '#FF6F00', games: [
    { key: 'stop', label: 'Stop', table: 'precision_scores', filter: { game_type: null } },
    { key: 'f1', label: 'F1', table: 'precision_scores', filter: { game_type: 'formula1' } },
    { key: 'pendulum', label: 'Pendulum', table: 'precision_scores', filter: { game_type: 'pendulum' } },
  ]},
  { key: 'knowledge', label: 'Knowledge', color: '#1565C0', games: [
    { key: 'flags', label: 'Flags', table: 'flag_scores' },
    { key: 'population', label: 'Population', table: 'higher_lower_scores', filter: { category: 'population' } },
    { key: 'area', label: 'Area', table: 'higher_lower_scores', filter: { category: 'area' } },
  ]},
  { key: 'logic', label: 'Logic', color: '#6A1B9A', games: [
    { key: 'sudoku', label: 'Sudoku', table: 'sudoku_scores' },
    { key: 'wordly', label: 'Wordly', table: 'wordle_scores' },
    { key: 'mastermind', label: 'Mastermind', table: 'mastermind_scores' },
  ]},
]

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useState(false)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState<Period>('1d')
  const [activeCategory, setActiveCategory] = useState('memory')
  const [loading, setLoading] = useState(false)
  const [kpis, setKpis] = useState<any>(null)
  const [gameStats, setGameStats] = useState<any[]>([])
  const [recentPlayers, setRecentPlayers] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('memgenius_admin')
    if (saved === 'true') { setAuth(true); setTimeout(() => loadData(), 100) }
  }, [])

  const getOffset = () => {
    const now = new Date()
    const jan = new Date(now.getFullYear(), 0, 1)
    const jul = new Date(now.getFullYear(), 6, 1)
    const std = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
    return now.getTimezoneOffset() < std ? 2 : 1
  }

  const getMidnight = (daysAgo: number) => {
    const offset = getOffset()
    const now = new Date()
    const spain = new Date(now.getTime() + offset * 3600000)
    spain.setUTCDate(spain.getUTCDate() - daysAgo)
    spain.setUTCHours(0, 0, 0, 0)
    return new Date(spain.getTime() - offset * 3600000).toISOString()
  }

  const getPeriodRange = (p: Period): [string, string] => {
    const now = new Date().toISOString()
    const offset = getOffset()
    if (p === '1h') {
      const spainNow = new Date(Date.now() + offset * 3600000)
      spainNow.setUTCMinutes(0, 0, 0)
      const start = new Date(spainNow.getTime() - offset * 3600000).toISOString()
      return [start, now]
    }
    if (p === '1d') return [getMidnight(0), now]
    if (p === 'yesterday') return [getMidnight(1), getMidnight(0)]
    if (p === 'month') return [getMidnight(30), now]
    return ['2026-01-01T00:00:00.000Z', now]
  }

  const loadData = async () => {
    setLoading(true)
    const [start, end] = getPeriodRange(period)

    // KPIs
    const [usersToday, streaks, groups] = await Promise.all([
      supabase.from('streaks').select('player_name', { count: 'exact', head: true }).gte('updated_at', start).lte('updated_at', end),
      supabase.from('streaks').select('player_name', { count: 'exact', head: true }).gte('current_streak', 2).eq('last_played_date', new Date().toISOString().split('T')[0]),
      supabase.from('groups').select('id', { count: 'exact', head: true }).gte('created_at', start).lte('created_at', end),
    ])

    // Game stats
    const allGameStats: any[] = []
    for (const cat of CATEGORIES) {
      for (const game of cat.games) {
        let query = supabase.from(game.table as any).select('player_name, created_at').gte('created_at', start).lte('created_at', end).neq('player_name', 'David')
        if ((game as any).filter) {
          const filter = (game as any).filter
          for (const [k, v] of Object.entries(filter)) {
            if (v === null) query = (query as any).is(k, null)
            else query = (query as any).eq(k, v)
          }
        }
        const { data } = await query
        const plays = data?.length || 0
        const users = new Set(data?.map((s: any) => s.player_name)).size
        allGameStats.push({ category: cat.key, categoryLabel: cat.label, categoryColor: cat.color, game: game.key, label: game.label, plays, users })
      }
    }

    // Recent players across all games
    const { data: recentMem } = await supabase.from('scores').select('player_name, created_at').order('created_at', { ascending: false }).limit(20)
    const { data: recentDig } = await supabase.from('number_scores').select('player_name, created_at').order('created_at', { ascending: false }).limit(20)
    const { data: recentSeq } = await supabase.from('sequence_scores').select('player_name, created_at').order('created_at', { ascending: false }).limit(20)
    const { data: recentFlag } = await supabase.from('flag_scores').select('player_name, created_at').order('created_at', { ascending: false }).limit(20)
    const { data: recentPrec } = await supabase.from('precision_scores').select('player_name, created_at, game_type').order('created_at', { ascending: false }).limit(20)
    const { data: recentVs } = await supabase.from('higher_lower_scores').select('player_name, created_at, category').order('created_at', { ascending: false }).limit(20)
    const { data: recentSud } = await supabase.from('sudoku_scores').select('player_name, created_at, difficulty').order('created_at', { ascending: false }).limit(20)

    const allRecent = [
      ...(recentMem || []).map((s: any) => ({ ...s, game: 'Memory' })),
      ...(recentDig || []).map((s: any) => ({ ...s, game: 'Digits' })),
      ...(recentSeq || []).map((s: any) => ({ ...s, game: 'Simon Says' })),
      ...(recentFlag || []).map((s: any) => ({ ...s, game: 'Flags' })),
      ...(recentPrec || []).map((s: any) => ({ ...s, game: s.game_type === 'formula1' ? 'F1' : s.game_type === 'pendulum' ? 'Pendulum' : 'Stop' })),
      ...(recentVs || []).map((s: any) => ({ ...s, game: s.category === 'population' ? 'Population' : 'Area' })),
      ...(recentSud || []).map((s: any) => ({ ...s, game: `Sudoku ${s.difficulty}` })),
    ].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 30)

    setKpis({
      users: usersToday.count || 0,
      streaks: streaks.count || 0,
      groups: groups.count || 0,
      totalPlays: allGameStats.reduce((sum, g) => sum + g.plays, 0),
    })
    setGameStats(allGameStats)
    setRecentPlayers(allRecent)
    setLoading(false)
  }

  useEffect(() => { if (auth) loadData() }, [period])

  const fmtDate = (d: string) => new Date(d).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

  const login = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem('memgenius_admin', 'true')
      setAuth(true)
      loadData()
    } else setError('Wrong password')
  }

  if (!auth) return (
    <main style={{ height: '100dvh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-nunito), sans-serif', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 320, textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: BROWN, marginBottom: 24 }}>Mem<span style={{ color: GOLD }}>Genius</span> Admin</div>
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${BROWN}20`, background: '#fff', fontSize: 16, fontFamily: 'inherit', marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
        />
        {error && <div style={{ color: RED, fontSize: 12, marginBottom: 8 }}>{error}</div>}
        <button onClick={login} style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: BROWN, color: '#fff', fontSize: 15, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>Enter</button>
      </div>
    </main>
  )

  const activeCat = CATEGORIES.find(c => c.key === activeCategory)
  const activeCatStats = gameStats.filter(g => g.category === activeCategory)

  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '24px 16px 100px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: BROWN }}>Mem<span style={{ color: GOLD }}>Genius</span> Admin</div>
        <button onClick={loadData} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: BROWN, color: '#fff', fontSize: 12, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>↺</button>
      </div>

      {/* Period tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {PERIODS.map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none',
            background: period === p.key ? BROWN : '#fff',
            color: period === p.key ? '#fff' : BROWN,
            fontSize: 11, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
          }}>{p.label}</button>
        ))}
      </div>

      {loading && <div style={{ textAlign: 'center', color: `${BROWN}50`, padding: 40 }}>Loading...</div>}

      {!loading && kpis && <>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {[
            { label: 'Players', value: kpis.users, color: '#1565C0' },
            { label: 'Plays', value: kpis.totalPlays, color: '#2E7D32' },
            { label: 'Streaks 2+', value: kpis.streaks, color: '#FF6F00' },
            { label: 'Groups', value: kpis.groups, color: '#6A1B9A' },
          ].map(k => (
            <div key={k.label} style={{ background: '#fff', borderRadius: 16, padding: '16px', border: `1px solid ${BROWN}10` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, textTransform: 'uppercase', letterSpacing: 1 }}>{k.label}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Games by category */}
        <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Games</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
              flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none',
              background: activeCategory === cat.key ? cat.color : '#fff',
              color: activeCategory === cat.key ? '#fff' : BROWN,
              fontSize: 10, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
            }}>{cat.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {activeCatStats.map(g => (
            <div key={g.game} style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: `1px solid ${BROWN}10`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: BROWN }}>{g.label}</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: activeCat?.color }}>{g.plays}</div>
                  <div style={{ fontSize: 9, color: `${BROWN}50`, fontWeight: 800, textTransform: 'uppercase' }}>Plays</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: BROWN }}>{g.users}</div>
                  <div style={{ fontSize: 9, color: `${BROWN}50`, fontWeight: 800, textTransform: 'uppercase' }}>Users</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent players */}
        <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Recent players</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {recentPlayers.map((p, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '10px 14px', border: `1px solid ${BROWN}10`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: BROWN }}>{p.player_name}</div>
                <div style={{ fontSize: 11, color: `${BROWN}50` }}>{p.game}</div>
              </div>
              <div style={{ fontSize: 11, color: `${BROWN}40` }}>{fmtDate(p.created_at)}</div>
            </div>
          ))}
        </div>
      </>}
    </main>
  )
}
