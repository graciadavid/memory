'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const BLUE = '#1565C0'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [gameFilter, setGameFilter] = useState<'memory' | 'digits' | 'sequence'>('memory')

  useEffect(() => {
    const saved = localStorage.getItem('memgenius_admin')
    if (saved === 'true') { setAuth(true); loadData() }
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

  const loadData = async () => {
    setLoading(true)
    const today = new Date().toISOString().split('T')[0]

    const [memScores, digScores, seqScores] = await Promise.all([
      supabase.from('scores').select('player_name, time_ms, is_daily, play_date, created_at, packs(difficulty)').order('created_at', { ascending: false }),
      supabase.from('number_scores').select('player_name, level, created_at').order('created_at', { ascending: false }),
      supabase.from('sequence_scores').select('player_name, level, created_at').order('created_at', { ascending: false }),
    ])

    const scores = memScores.data || []
    const digits = digScores.data || []
    const sequence = seqScores.data || []

    // All players combined
    const allPlayers = new Set([
      ...scores.map(s => s.player_name),
      ...digits.map(s => s.player_name),
      ...sequence.map(s => s.player_name),
    ])

    const memPlayersToday = new Set(scores.filter(s => s.created_at?.startsWith(today)).map(s => s.player_name))
    const digPlayersToday = new Set(digits.filter(s => s.created_at?.startsWith(today)).map(s => s.player_name))
    const allPlayersToday = new Set([...memPlayersToday, ...digPlayersToday])

    // New players today — first game ever today
    const playerFirstGame: Record<string, string> = {}
    ;[...scores, ...digits].forEach(s => {
      const name = s.player_name
      if (!playerFirstGame[name] || s.created_at < playerFirstGame[name]) {
        playerFirstGame[name] = s.created_at
      }
    })
    const newToday = Object.values(playerFirstGame).filter(d => d.startsWith(today)).length

    setStats({
      totalGames: scores.length,
      totalGamesDigits: digits.length,
      totalGamesSeq: sequence.length,
      totalGamesToday: scores.filter(s => s.created_at?.startsWith(today)).length,
      totalGamesTodayDigits: digits.filter(s => s.created_at?.startsWith(today)).length,
      totalGamesTodaySeq: sequence.filter(s => s.created_at?.startsWith(today)).length,
      totalPlayers: allPlayers.size,
      playersToday: allPlayersToday.size,
      newToday,
    })

    // Build player list for memory
    const memPlayerMap: Record<string, { games: number, lastGame: string, firstGame: string }> = {}
    scores.forEach(s => {
      if (!memPlayerMap[s.player_name]) memPlayerMap[s.player_name] = { games: 0, lastGame: s.created_at, firstGame: s.created_at }
      memPlayerMap[s.player_name].games++
      if (s.created_at > memPlayerMap[s.player_name].lastGame) memPlayerMap[s.player_name].lastGame = s.created_at
      if (s.created_at < memPlayerMap[s.player_name].firstGame) memPlayerMap[s.player_name].firstGame = s.created_at
    })

    // Build player list for digits
    const digPlayerMap: Record<string, { games: number, lastGame: string, firstGame: string, bestLevel: number }> = {}
    digits.forEach(s => {
      if (!digPlayerMap[s.player_name]) digPlayerMap[s.player_name] = { games: 0, lastGame: s.created_at, firstGame: s.created_at, bestLevel: 0 }
      digPlayerMap[s.player_name].games++
      if (s.created_at > digPlayerMap[s.player_name].lastGame) digPlayerMap[s.player_name].lastGame = s.created_at
      if (s.created_at < digPlayerMap[s.player_name].firstGame) digPlayerMap[s.player_name].firstGame = s.created_at
      if (s.level > digPlayerMap[s.player_name].bestLevel) digPlayerMap[s.player_name].bestLevel = s.level
    })

    const seqPlayerMap: Record<string, { games: number, lastGame: string, firstGame: string, bestLevel: number }> = {}
    sequence.forEach(s => {
      if (!seqPlayerMap[s.player_name]) seqPlayerMap[s.player_name] = { games: 0, lastGame: s.created_at, firstGame: s.created_at, bestLevel: 0 }
      seqPlayerMap[s.player_name].games++
      if (s.created_at > seqPlayerMap[s.player_name].lastGame) seqPlayerMap[s.player_name].lastGame = s.created_at
      if (s.created_at < seqPlayerMap[s.player_name].firstGame) seqPlayerMap[s.player_name].firstGame = s.created_at
      if (s.level > seqPlayerMap[s.player_name].bestLevel) seqPlayerMap[s.player_name].bestLevel = s.level
    })

    const memList = Object.entries(memPlayerMap).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.lastGame.localeCompare(a.lastGame))
    const digList = Object.entries(digPlayerMap).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.lastGame.localeCompare(a.lastGame))
    const seqList = Object.entries(seqPlayerMap).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.lastGame.localeCompare(a.lastGame))

    setPlayers({ memory: memList, digits: digList, sequence: seqList } as any)
    setLoading(false)
  }

  const fmt = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  if (!auth) {
    return (
      <main style={{ height: '100dvh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-nunito), sans-serif', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 320, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: BROWN, marginBottom: 24 }}>
            Mem<span style={{ color: GOLD }}>Genius</span> Admin
          </div>
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${BROWN}20`, background: '#fff', fontSize: 16, fontFamily: 'inherit', marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
          />
          {error && <div style={{ color: '#B71C1C', fontSize: 12, marginBottom: 8 }}>{error}</div>}
          <button onClick={login} style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: BROWN, color: '#fff', fontSize: 15, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>Enter</button>
        </div>
      </main>
    )
  }

  const currentPlayers = gameFilter === 'memory' ? (players as any)?.memory || [] : gameFilter === 'digits' ? (players as any)?.digits || [] : (players as any)?.sequence || []

  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '24px 16px 100px' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 20 }}>
        Mem<span style={{ color: GOLD }}>Genius</span> Admin
      </div>

      {loading && <div style={{ color: `${BROWN}60`, fontSize: 14 }}>Loading...</div>}

      {stats && (
        <>
          {/* Games stats */}
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Games</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Total Memory', value: stats.totalGames },
              { label: 'Memory Today', value: stats.totalGamesToday },
              { label: 'Total Digits', value: stats.totalGamesDigits },
              { label: 'Digits Today', value: stats.totalGamesTodayDigits },
              { label: 'Total Sequence', value: stats.totalGamesSeq },
              { label: 'Sequence Today', value: stats.totalGamesTodaySeq },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', border: `1px solid ${BROWN}08`, borderRadius: 14, padding: '14px', boxShadow: `0 2px 8px ${BROWN}06` }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: BROWN }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Players stats */}
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Players</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            {[
              { label: 'Total Players', value: stats.totalPlayers },
              { label: 'Players Today', value: stats.playersToday },
              { label: 'New Today', value: stats.newToday, highlight: true },
            ].map(s => (
              <div key={s.label} style={{
                background: s.highlight ? `${GOLD}15` : '#fff',
                border: `1px solid ${s.highlight ? GOLD + '40' : BROWN + '08'}`,
                borderRadius: 14, padding: '14px',
                boxShadow: `0 2px 8px ${BROWN}06`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: s.highlight ? GOLD : `${BROWN}50`, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.highlight ? GOLD : BROWN }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Player list with game filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {[
              { key: 'memory' as const, label: 'Memory', color: BROWN },
              { key: 'digits' as const, label: 'Digits', color: BLUE },
              { key: 'sequence' as const, label: 'Sequence', color: '#6A1B9A' },
            ].map(g => (
              <button key={g.key} onClick={() => setGameFilter(g.key)} style={{
                flex: 1, padding: '9px', borderRadius: 12, border: 'none',
                background: gameFilter === g.key ? g.color : '#fff',
                color: gameFilter === g.key ? '#fff' : `${BROWN}60`,
                fontSize: 13, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
                boxShadow: gameFilter === g.key ? `0 4px 0 ${g.color}50` : `0 2px 6px ${BROWN}08`,
              }}>{g.label}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {currentPlayers.map((p: any) => (
              <div key={p.name} style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', border: `1px solid ${BROWN}08`, boxShadow: `0 1px 4px ${BROWN}06`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: `${BROWN}40`, marginTop: 2 }}>Last: {fmt(p.lastGame)}</div>
                  {gameFilter === 'digits' && p.bestLevel && (
                    <div style={{ fontSize: 10, color: BLUE, fontWeight: 700, marginTop: 1 }}>Best level: {p.bestLevel}</div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: BROWN }}>{p.games}</div>
                  <div style={{ fontSize: 9, color: `${BROWN}40` }}>games</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
