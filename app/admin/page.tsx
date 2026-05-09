'use client'
import { getSpainToday } from '@/lib/dailyChallenge'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const BLUE = '#1565C0'
const GREEN = '#2E7D32'
const RED = '#B71C1C'

type Period = '1h' | 'today' | '7d' | '30d' | '2026'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useState(false)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState<Period>('today')
  const [stats, setStats] = useState<any>(null)
  const [players, setPlayers] = useState<any>({})
  const [gameFilter, setGameFilter] = useState<'memory' | 'digits' | 'sequence' | 'flags' | 'precision' | 'versus'>('memory')
  const [topFilter, setTopFilter] = useState<'topMemory' | 'topDigits' | 'topSequence' | 'topFlags' | 'topPrecision' | 'topVersus'>('topMemory')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('memgenius_admin')
    if (saved === 'true') { setAuth(true); setTimeout(() => loadData(), 100) }
  }, [])

  const login = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem('memgenius_admin', 'true')
      setAuth(true)
      loadData()
    } else {
      setError('Wrong password')
    }
  }

  const getSpainOffset = () => {
    // Spain UTC+1 winter, UTC+2 summer
    const now = new Date()
    const jan = new Date(now.getFullYear(), 0, 1)
    const jul = new Date(now.getFullYear(), 6, 1)
    const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
    return now.getTimezoneOffset() < stdOffset ? 2 : 1
  }

  const spainDayStart = (daysAgo = 0) => {
    const offset = getSpainOffset()
    const spainNow = new Date(Date.now() + offset * 3600000)
    const spainDate = new Date(spainNow)
    spainDate.setUTCDate(spainDate.getUTCDate() - daysAgo)
    const dateStr = spainDate.toISOString().split('T')[0]
    // Convert midnight Madrid to UTC
    return new Date(dateStr + 'T00:00:00.000Z').toISOString().replace('Z', '') 
      // subtract offset hours
    return new Date(new Date(dateStr + 'T00:00:00.000Z').getTime() - offset * 3600000).toISOString()
  }

  const getPeriodStart = (p: Period) => {
    const now = new Date()
    const offset = getSpainOffset()
    if (p === '1h') return new Date(now.getTime() - 3600000).toISOString()
    if (p === 'today') return new Date(new Date(getSpainToday() + 'T00:00:00.000Z').getTime() - offset * 3600000).toISOString()
    if (p === '7d') { const y = new Date(now); y.setDate(y.getDate()-1); y.setHours(0,0,0,0); return y.toISOString() }
    if (p === '30d') return new Date(now.getTime() - 30 * 86400000).toISOString()
    return '2026-01-01T00:00:00.000Z'
  }

  const getPrevPeriodStart = (p: Period) => {
    const now = new Date()
    const offset = getSpainOffset()
    if (p === '1h') return new Date(now.getTime() - 7200000).toISOString()
    if (p === 'today') return new Date(new Date(getSpainToday() + 'T00:00:00.000Z').getTime() - offset * 3600000 - 86400000).toISOString()
    if (p === '7d') { const y = new Date(now); y.setDate(y.getDate()-2); y.setHours(0,0,0,0); return y.toISOString() }
    if (p === '30d') return new Date(now.getTime() - 60 * 86400000).toISOString()
    return '2025-01-01T00:00:00.000Z'
  }

  const loadData = async () => {
    setLoading(true)
    const periodStart = getPeriodStart(period)
    const prevStart = getPrevPeriodStart(period)

    const { count: groupsCount } = await supabase.from('groups').select('*', { count: 'exact', head: true })
    const { count: membersCount } = await supabase.from('group_members').select('*', { count: 'exact', head: true })

    const [memAll, digAll, seqAll, flagAll, precAll, vsAll] = await Promise.all([
      supabase.from('scores').select('player_name, time_ms, created_at, packs(difficulty)').neq('player_name', 'David').order('created_at', { ascending: false }),
      supabase.from('number_scores').select('player_name, level, created_at').neq('player_name', 'David').order('created_at', { ascending: false }),
      supabase.from('sequence_scores').select('player_name, level, created_at').neq('player_name', 'David').order('created_at', { ascending: false }),
      supabase.from('flag_scores').select('player_name, level, created_at').neq('player_name', 'David').order('created_at', { ascending: false }),
      supabase.from('precision_scores').select('player_name, difference_ms, created_at').neq('player_name', 'David').order('created_at', { ascending: false }),
      supabase.from('higher_lower_scores').select('player_name, level, created_at').neq('player_name', 'David').order('created_at', { ascending: false }),
    ])

    const mem = memAll.data || []
    const dig = digAll.data || []
    const seq = seqAll.data || []
    const flag = flagAll.data || []
    const prec = precAll.data || []
    const vs = vsAll?.data || []

    const inPeriod = (arr: any[]) => arr.filter(s => s.created_at >= periodStart)
    const inPrev = (arr: any[]) => arr.filter(s => s.created_at >= prevStart && s.created_at < periodStart)

    const pct = (curr: number, prev: number) => prev === 0 ? null : Math.round(((curr - prev) / prev) * 100)
    const uniq = (arr: any[]) => new Set(arr.map(s => s.player_name)).size

    const memP = inPeriod(mem).length
    const digP = inPeriod(dig).length
    const seqP = inPeriod(seq).length
    const flagP = inPeriod(flag).length
    const precP = inPeriod(prec).length
    const vsP = inPeriod(vs).length
    const memPrev = inPrev(mem).length
    const digPrev = inPrev(dig).length
    const seqPrev = inPrev(seq).length
    const flagPrev = inPrev(flag).length
    const precPrev = inPrev(prec).length
    const vsPrev = inPrev(vs).length

    const memU = uniq(inPeriod(mem))
    const digU = uniq(inPeriod(dig))
    const seqU = uniq(inPeriod(seq))
    const flagU = uniq(inPeriod(flag))
    const precU = uniq(inPeriod(prec))
    const vsU = uniq(inPeriod(vs))

    // All players
    const allPlayers = new Set([...mem, ...dig, ...seq, ...flag, ...prec, ...vs].map(s => s.player_name))
    const periodPlayers = new Set([...inPeriod(mem), ...inPeriod(dig), ...inPeriod(seq), ...inPeriod(flag), ...inPeriod(prec)].map(s => s.player_name))
    const prevPlayers = new Set([...inPrev(mem), ...inPrev(dig), ...inPrev(seq), ...inPrev(flag), ...inPrev(prec)].map(s => s.player_name))

    // New players in period (first game ever in period)
    const firstGame: Record<string, string> = {}
    ;[...mem, ...dig, ...seq, ...flag, ...prec, ...vs].forEach(s => {
      if (!firstGame[s.player_name] || s.created_at < firstGame[s.player_name]) firstGame[s.player_name] = s.created_at
    })
    const newInPeriod = Object.values(firstGame).filter(d => d >= periodStart).length
    const newInPrev = Object.values(firstGame).filter(d => d >= prevStart && d < periodStart).length

    // Retention
    const playerDays2: Record<string, Set<string>> = {}
    ;[...mem, ...dig, ...seq, ...flag, ...prec, ...vs].forEach(s => {
      const day = s.created_at?.split('T')[0]
      if (!day) return
      if (!playerDays2[s.player_name]) playerDays2[s.player_name] = new Set()
      playerDays2[s.player_name].add(day)
    })
    const retention2: Record<number, number> = {}
    Object.values(playerDays2).forEach(days => {
      const n = days.size
      retention2[n] = (retention2[n] || 0) + 1
    })
    const retentionData2 = Object.entries(retention2)
      .map(([days, players]) => ({ days: Number(days), players }))
      .sort((a, b) => a.days - b.days)

    setStats({ retentionData: retentionData2, groupsCount: groupsCount ?? 0, membersCount: membersCount ?? 0,
      games: [
        { label: 'Memory', curr: memP, pct: pct(memP, memPrev), color: BROWN, users: memU, avg: memU > 0 ? (memP / memU).toFixed(1) : '0' },
        { label: 'Digits', curr: digP, pct: pct(digP, digPrev), color: BLUE, users: digU, avg: digU > 0 ? (digP / digU).toFixed(1) : '0' },
        { label: 'Sequence', curr: seqP, pct: pct(seqP, seqPrev), color: '#6A1B9A', users: seqU, avg: seqU > 0 ? (seqP / seqU).toFixed(1) : '0' },
        { label: 'Flags', curr: flagP, pct: pct(flagP, flagPrev), color: '#00796B', users: flagU, avg: flagU > 0 ? (flagP / flagU).toFixed(1) : '0' },
          { label: 'Precision', curr: precP, pct: pct(precP, precPrev), color: '#4A148C', users: precU, avg: precU > 0 ? (precP / precU).toFixed(1) : '0' },
          { label: 'Versus', curr: vsP, pct: pct(vsP, vsPrev), color: '#C62828', users: vsU, avg: vsU > 0 ? (vsP / vsU).toFixed(1) : '0' },
      ],
      players: { total: allPlayers.size, period: periodPlayers.size, pctPlayers: pct(periodPlayers.size, prevPlayers.size), newPeriod: newInPeriod, pctNew: pct(newInPeriod, newInPrev) },
    })

    // Build player maps with best scores
    const buildMap = (arr: any[], type: 'memory' | 'level') => {
      const map: Record<string, any> = {}
      arr.forEach(s => {
        if (!map[s.player_name]) map[s.player_name] = { games: 0, lastGame: s.created_at, bestLevel: 0, bestTime: Infinity }
        map[s.player_name].games++
        if (s.created_at > map[s.player_name].lastGame) map[s.player_name].lastGame = s.created_at
        if (type === 'level' && s.level > map[s.player_name].bestLevel) map[s.player_name].bestLevel = s.level
        if (type === 'memory' && s.time_ms < map[s.player_name].bestTime) map[s.player_name].bestTime = s.time_ms
      })
      return map
    }

    const memMap = buildMap(mem, 'memory')
    const digMap = buildMap(dig, 'level')
    const seqMap = buildMap(seq, 'level')
    const flagMap = buildMap(flag, 'level')
    const precMap = buildMap(prec, 'level')
    const vsMap = buildMap(vs, 'level')

    const toList = (map: Record<string, any>) =>
      Object.entries(map).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.lastGame.localeCompare(a.lastGame))

    // Top players by total games across all games
    const totalMap: Record<string, number> = {}
    ;[...mem, ...dig, ...seq, ...flag].forEach(s => {
      totalMap[s.player_name] = (totalMap[s.player_name] || 0) + 1
    })
    const topOf = (map: Record<string, any>) =>
      Object.entries(map).map(([name, d]: [string, any]) => ({ name, games: d.games })).sort((a, b) => b.games - a.games).slice(0, 5)



    setPlayers({
      memory: toList(memMap).slice(0, 5),
      digits: toList(digMap).slice(0, 5),
      sequence: toList(seqMap).slice(0, 5),
      flags: toList(flagMap).slice(0, 5),
      precision: toList(precMap).slice(0, 5),
      versus: toList(vsMap).slice(0, 5),
      topMemory: topOf(memMap),
      topDigits: topOf(digMap),
      topSequence: topOf(seqMap),
      topFlags: topOf(flagMap),
      topPrecision: topOf(precMap),
      topVersus: topOf(vsMap),
    })
    setLoading(false)
  }

  useEffect(() => {
    if (auth) loadData()
  }, [period])

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  const fmtDate = (d: string) => new Date(d).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

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

  const currentPlayers = players[gameFilter] || []

  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '24px 16px 100px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: BROWN }}>Mem<span style={{ color: GOLD }}>Genius</span> Admin</div>
        <button onClick={loadData} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: BROWN, color: '#fff', fontSize: 12, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>↺ Refresh</button>
      </div>

      {/* Period selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['1h', 'today', '7d', '30d', '2026'] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, padding: '9px', borderRadius: 12, border: 'none',
            background: period === p ? BROWN : '#fff',
            color: period === p ? '#fff' : `${BROWN}60`,
            fontSize: 11, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: period === p ? `0 4px 0 ${BROWN}50` : `0 2px 6px ${BROWN}08`,
          }}>{p === '1h' ? '1h' : p === 'today' ? 'Today' : p === '7d' ? 'Yesterday' : p === '30d' ? '30d' : '2026'}</button>
        ))}
      </div>

      {loading && <div style={{ color: `${BROWN}60`, fontSize: 14, textAlign: 'center', marginTop: 40 }}>Loading...</div>}

      {stats && (
        <>
          {/* Games */}
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Games</div>

          {/* Total */}
          <div style={{ background: BROWN, borderRadius: 14, padding: '14px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase' }}>Total Games</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>{stats.games.reduce((a: number, g: any) => a + g.curr, 0)}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginLeft: 8, marginBottom: 4 }}>
                {(() => { const total = stats.games.reduce((a: number, g: any) => a + g.curr, 0); const users = new Set(stats.games.map((g: any) => g.users)).size; return total > 0 ? `${(total / Math.max(...stats.games.map((g: any) => g.users))).toFixed(1)} avg/user` : '' })()}
              </div>
              {(() => {
                const totalPct = Math.round(stats.games.reduce((a: number, g: any) => a + g.curr, 0) / Math.max(1, stats.games.reduce((a: number, g: any) => a + (g.curr / (1 + (g.pct || 0) / 100)), 0)) * 100) - 100
                return totalPct !== 0 ? (
                  <div style={{ fontSize: 12, fontWeight: 800, color: totalPct >= 0 ? '#81C784' : '#EF9A9A', marginBottom: 6 }}>
                    {totalPct >= 0 ? '↑' : '↓'}{Math.abs(totalPct)}%
                  </div>
                ) : null
              })()}
            </div>
          </div>

          {/* Per game */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {stats.games.map((g: any) => (
              <div key={g.label} style={{ background: '#fff', borderRadius: 12, padding: '10px 14px', boxShadow: `0 2px 8px ${BROWN}06`, border: `1px solid ${g.color}15` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: g.color, letterSpacing: 0.5, marginBottom: 8 }}>{g.label}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: BROWN }}>{g.curr}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: `${BROWN}40`, textTransform: 'uppercase', letterSpacing: 1 }}>Games</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: BROWN }}>{g.users}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: `${BROWN}40`, textTransform: 'uppercase', letterSpacing: 1 }}>Users</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: g.color }}>{g.avg}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: `${BROWN}40`, textTransform: 'uppercase', letterSpacing: 1 }}>Avg</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Players */}
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Players</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
            {[
              { label: 'Total', value: stats.players.total, pct: null },
              { label: 'Active', value: stats.players.period, pct: stats.players.pctPlayers },
              { label: 'New', value: stats.players.newPeriod, pct: stats.players.pctNew, highlight: true },
            ].map(s => (
              <div key={s.label} style={{ background: s.highlight ? `${GOLD}15` : '#fff', border: `1px solid ${s.highlight ? GOLD + '40' : BROWN + '08'}`, borderRadius: 14, padding: '14px 10px', boxShadow: `0 2px 8px ${BROWN}06` }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: s.highlight ? GOLD : `${BROWN}50`, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.highlight ? GOLD : BROWN }}>{s.value}</div>
                  {s.pct !== null && (
                    <div style={{ fontSize: 11, fontWeight: 800, color: s.pct >= 0 ? GREEN : RED, marginBottom: 3 }}>
                      {s.pct >= 0 ? '↑' : '↓'}{Math.abs(s.pct)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Groups */}
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Groups</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px', boxShadow: `0 2px 8px ${BROWN}06`, border: `1px solid ${GOLD}15` }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Groups</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: BROWN }}>{stats.groupsCount}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px', boxShadow: `0 2px 8px ${BROWN}06`, border: `1px solid ${GOLD}15` }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Members</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: BROWN }}>{stats.membersCount}</div>
            </div>
          </div>

          {/* Retention */}
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Retention — Days Active</div>
          <div style={{ background: '#fff', borderRadius: 16, padding: '14px', marginBottom: 16, boxShadow: `0 2px 8px ${BROWN}06` }}>
            {(stats.retentionData || []).filter((r: any) => r.days <= 30).map((r: any) => {
              const maxPlayers = Math.max(...(stats.retentionData || []).map((x: any) => x.players))
              const width = Math.round((r.players / maxPlayers) * 100)
              return (
                <div key={r.days} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, width: 40, textAlign: 'right', flexShrink: 0 }}>
                    {r.days}d
                  </div>
                  <div style={{ flex: 1, height: 20, background: `${BROWN}08`, borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${width}%`, background: r.days === 1 ? `${BROWN}40` : r.days <= 3 ? GOLD : r.days <= 7 ? '#2E7D32' : '#1565C0', borderRadius: 6, transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: BROWN, width: 30, flexShrink: 0 }}>{r.players}</div>
                </div>
              )
            })}
            <div style={{ fontSize: 10, color: `${BROWN}30`, marginTop: 8, fontStyle: 'italic' }}>
              Players grouped by number of different days they played
            </div>
          </div>

          {/* Top players per game */}
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Top Players</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {[
              { key: 'topMemory', label: 'Memory', color: BROWN },
              { key: 'topDigits', label: 'Digits', color: BLUE },
              { key: 'topSequence', label: 'Sequence', color: '#6A1B9A' },
              { key: 'topFlags', label: 'Flags', color: '#00796B' },
              { key: 'topPrecision', label: '⏱', color: '#4A148C' },
              { key: 'topVersus', label: '⚔️', color: '#C62828' },
            ].map(g => (
              <button key={g.key} onClick={() => setTopFilter(g.key as any)} style={{
                flex: 1, padding: '7px 4px', borderRadius: 10, border: 'none',
                background: topFilter === g.key ? g.color : '#fff',
                color: topFilter === g.key ? '#fff' : `${BROWN}60`,
                fontSize: 11, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
                boxShadow: topFilter === g.key ? `0 3px 0 ${g.color}50` : `0 2px 6px ${BROWN}08`,
              }}>{g.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {(players[topFilter] || []).map((p: any) => (
              <div key={p.name} style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', border: `1px solid ${BROWN}08`, boxShadow: `0 1px 4px ${BROWN}06`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>{p.name}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: BROWN }}>{p.games} <span style={{ fontSize: 10, color: `${BROWN}40` }}>games</span></div>
              </div>
            ))}
          </div>

          {/* Recent players by game */}
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Recent Players</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {[
              { key: 'memory', label: 'Memory', color: BROWN },
              { key: 'digits', label: 'Digits', color: BLUE },
              { key: 'sequence', label: 'Sequence', color: '#6A1B9A' },
              { key: 'flags', label: 'Flags', color: '#00796B' },
              { key: 'precision', label: '⏱', color: '#4A148C' },
              { key: 'versus', label: '⚔️', color: '#C62828' },
            ].map(g => (
              <button key={g.key} onClick={() => setGameFilter(g.key as any)} style={{
                flex: 1, padding: '7px 4px', borderRadius: 10, border: 'none',
                background: gameFilter === g.key ? g.color : '#fff',
                color: gameFilter === g.key ? '#fff' : `${BROWN}60`,
                fontSize: 11, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
                boxShadow: gameFilter === g.key ? `0 3px 0 ${g.color}50` : `0 2px 6px ${BROWN}08`,
              }}>{g.label}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {currentPlayers.map((p: any) => (
              <div key={p.name} style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', border: `1px solid ${BROWN}08`, boxShadow: `0 1px 4px ${BROWN}06` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>{p.name}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: BROWN }}>{p.games} <span style={{ fontSize: 10, color: `${BROWN}40` }}>games</span></div>
                </div>
                <div style={{ fontSize: 10, color: `${BROWN}40`, marginBottom: 2 }}>Last: {fmtDate(p.lastGame)}</div>
                {gameFilter === 'memory' && p.bestTime !== Infinity && (
                  <div style={{ fontSize: 11, color: BROWN, fontWeight: 700 }}>Best: {fmt(p.bestTime)}</div>
                )}
                {gameFilter !== 'memory' && p.bestLevel > 0 && (
                  <div style={{ fontSize: 11, color: gameFilter === 'digits' ? BLUE : gameFilter === 'sequence' ? '#6A1B9A' : '#00796B', fontWeight: 700 }}>
                    Best: {gameFilter === 'flags' ? `${p.bestLevel} flags` : `Level ${p.bestLevel}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
