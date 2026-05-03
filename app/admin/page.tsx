'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const login = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuth(true)
      loadData()
    } else {
      setError('Wrong password')
    }
  }

  const loadData = async () => {
    setLoading(true)

    const { data: scores } = await supabase
      .from('scores')
      .select('player_name, time_ms, is_daily, play_date, created_at, packs(difficulty)')
      .order('created_at', { ascending: false })

    if (!scores) return

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const uniquePlayers = [...new Set(scores.map(s => s.player_name))]
    const todayGames = scores.filter(s => s.play_date === today)
    const dailyGames = scores.filter(s => s.is_daily === true && s.play_date === today)

    // Players with first game date
    const playerMap: Record<string, { games: number, firstGame: string, lastGame: string, isDaily: boolean }> = {}
    scores.forEach(s => {
      if (!playerMap[s.player_name]) {
        playerMap[s.player_name] = { games: 0, firstGame: s.created_at, lastGame: s.created_at, isDaily: false }
      }
      playerMap[s.player_name].games++
      if (s.created_at > playerMap[s.player_name].lastGame) playerMap[s.player_name].lastGame = s.created_at
      if (s.created_at < playerMap[s.player_name].firstGame) playerMap[s.player_name].firstGame = s.created_at
      if (s.is_daily) playerMap[s.player_name].isDaily = true
    })

    const sortedPlayers = Object.entries(playerMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.lastGame.localeCompare(a.lastGame))

    setStats({
      totalPlayers: uniquePlayers.length,
      totalGames: scores.length,
      todayGames: todayGames.length,
      dailyPlayers: dailyGames.length,
      newToday: sortedPlayers.filter(p => p.firstGame.startsWith(today)).length,
    })

    setPlayers(sortedPlayers)
    setLoading(false)
  }

  const fmt = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  if (!auth) {
    return (
      <main style={{
        height: '100dvh', background: CREAM,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-nunito), sans-serif', padding: 24,
      }}>
        <div style={{ width: '100%', maxWidth: 320, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: BROWN, marginBottom: 24 }}>
            Mem<span style={{ color: GOLD }}>Genius</span> Admin
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12,
              border: `1px solid ${BROWN}20`, background: '#fff',
              fontSize: 16, fontFamily: 'inherit', marginBottom: 12,
              boxSizing: 'border-box', outline: 'none',
            }}
          />
          {error && <div style={{ color: '#B71C1C', fontSize: 12, marginBottom: 8 }}>{error}</div>}
          <button onClick={login} style={{
            width: '100%', padding: '12px', borderRadius: 12, border: 'none',
            background: BROWN, color: '#fff', fontSize: 15, fontWeight: 800,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>Enter</button>
        </div>
      </main>
    )
  }

  return (
    <main style={{
      minHeight: '100dvh', background: CREAM,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto', padding: '24px 16px 100px',
    }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 20 }}>
        Mem<span style={{ color: GOLD }}>Genius</span> Admin
      </div>

      {loading && <div style={{ color: `${BROWN}60`, fontSize: 14 }}>Loading...</div>}

      {stats && (
        <>
          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Total Players', value: stats.totalPlayers },
              { label: 'Total Games', value: stats.totalGames },
              { label: 'Games Today', value: stats.todayGames },
              { label: 'Daily Today', value: stats.dailyPlayers },
              { label: 'New Today', value: stats.newToday, highlight: true },
            ].map(s => (
              <div key={s.label} style={{
                background: s.highlight ? `${GOLD}15` : '#fff',
                border: `1px solid ${s.highlight ? GOLD + '40' : BROWN + '08'}`,
                borderRadius: 14, padding: '16px',
                boxShadow: `0 2px 8px ${BROWN}06`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: s.highlight ? GOLD : BROWN }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Players list */}
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
            Players
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {players.map((p, i) => (
              <div key={p.name} style={{
                background: '#fff', borderRadius: 12, padding: '12px 14px',
                border: `1px solid ${BROWN}08`,
                boxShadow: `0 1px 4px ${BROWN}06`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: BROWN, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {p.name}
                    {p.isDaily && <span style={{ fontSize: 9, background: `${GOLD}20`, color: GOLD, padding: '1px 6px', borderRadius: 4, fontWeight: 900 }}>DAILY</span>}
                  </div>
                  <div style={{ fontSize: 10, color: `${BROWN}40`, marginTop: 2 }}>
                    Last: {fmt(p.lastGame)}
                  </div>
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
