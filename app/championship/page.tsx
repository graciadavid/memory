'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GOLD = '#C8960C'
const GREEN = '#2E7D32'

const GAME_ICONS: Record<string,string> = {
  stop: `${BASE}/precision.png`,
  blink: `${BASE}/blink.png`,
  capitals: `${BASE}/capitals.png`,
  flags: `${BASE}/flags.png`,
  pendulum: `${BASE}/pendulum.png`,
  digits: `${BASE}/digits.png`,
  nback: `${BASE}/nback.png`,
  ace: `${BASE}/padel.png`,
  'letter-rain': `${BASE}/rain.png`,
  mastermind: `${BASE}/mastermind.png`,
}

function getCountdown(sundayDate: string) {
  const end = new Date(sundayDate + 'T23:59:59Z')
  const now = new Date()
  const diff = Math.max(0, end.getTime() - now.getTime())
  if (diff === 0) return { d: 0, h: 0, m: 0, s: 0, isOver: true }
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    isOver: false,
  }
}

export default function ChampionshipPage() {
  const [week, setWeek] = useState<any>(null)
  const [ranking, setRanking] = useState<any[]>([])
  const [hallOfFame, setHallOfFame] = useState<any[]>([])
  const [countdown, setCountdown] = useState<any>({ d:0, h:0, m:0, s:0, isOver:false })
  const [selectedWinner, setSelectedWinner] = useState<any>(null)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    supabase.from('championship_weeks').select('*').eq('active', true).single()
      .then(({ data }: any) => {
        if (!data) return
        setWeek(data)
        const start = data.sunday_date + 'T00:00:00Z'
        const end = data.sunday_date + 'T23:59:59Z'
        supabase.from('precision_scores').select('player_name, difference_ms')
          .is('game_type', null).gte('created_at', start).lte('created_at', end)
          .then(({ data: scores }: any) => {
            if (!scores) return
            const best: Record<string,number> = {}
            scores.forEach((s:any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
            setRanking(Object.entries(best).sort((a,b) => (a[1] as number)-(b[1] as number)).slice(0,10).map(([name,ms]) => ({name,ms})))
          })
      })
    supabase.from('championship_hall_of_fame').select('*').order('sunday_date', { ascending: false })
      .then(({ data }: any) => setHallOfFame(data || []))
  }, [])

  useEffect(() => {
    if (!week) return
    const tick = () => setCountdown(getCountdown(week.sunday_date))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [week])

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 600)
    return () => clearInterval(t)
  }, [])

  const gameLabel = week?.game ? week.game.charAt(0).toUpperCase() + week.game.slice(1) : ''
  const gameHref = week?.game ? `/${week.game}` : '/stop'
  const gameIcon = week?.game ? GAME_ICONS[week.game] : `${BASE}/precision.png`

  return (
    <main style={{ minHeight: '100dvh', background: '#1A1A1A', padding: '16px 16px 100px' }}>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <img src={`${BASE}/winner.png`} style={{ width: 32, height: 32, objectFit: 'contain' }} />
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>Sunday Championship</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>One game. One day. One winner.</div>
        </div>
      </div>

      {/* This week card */}
      {week && (
        <div style={{ background: '#252525', borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <img src={gameIcon} style={{ width: 44, height: 44, objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase' }}>This Week</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{gameLabel}</div>
            </div>
            {countdown.isOver === false && (
              <div style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 800, color: blink ? '#69F0AE' : 'transparent', transition: 'color 0.3s' }}>● LIVE</div>
            )}
          </div>

          {/* Countdown dd hh mm ss */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {[{v:countdown.d,l:'DD'},{v:countdown.h,l:'HH'},{v:countdown.m,l:'MM'},{v:countdown.s,l:'SS'}].map(({v,l}) => (
              <div key={l} style={{ flex:1, background:'#1A1A1A', borderRadius:10, padding:'8px 4px', textAlign:'center' }}>
                <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>{String(v).padStart(2,'0')}</div>
                <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:1 }}>{l}</div>
              </div>
            ))}
          </div>

          <a href={gameHref} style={{ textDecoration:'none', display:'block' }}>
            <div style={{ background:GREEN, borderRadius:12, padding:'14px', textAlign:'center', boxShadow:'0 4px 0 #1B5E20' }}>
              <div style={{ fontSize:16, fontWeight:900, color:'#fff' }}>Play {gameLabel} →</div>
            </div>
          </a>
        </div>
      )}

      {/* Live Ranking */}
      {ranking.length > 0 && (
        <div style={{ background: '#252525', borderRadius: 16, padding: '16px', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Live Ranking</div>
          {ranking.map((r, i) => (
            <div key={r.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:20 }}>{i===0?'👑':`#${i+1}`}</div>
              <div style={{ flex:1, fontSize:14, fontWeight:800, color:'#fff' }}>{r.name}</div>
              <div style={{ fontSize:13, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{r.ms}ms</div>
            </div>
          ))}
        </div>
      )}

      {/* Hall of Fame */}
      {hallOfFame.length > 0 && (
        <div style={{ background: '#252525', borderRadius: 16, padding: '16px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Hall of Fame</div>

          {/* Column headers */}
          <div style={{ display:'grid', gridTemplateColumns:'40px 1fr 1fr 70px', gap:8, marginBottom:8 }}>
            {['#','Game','Champion','Result'].map(h => (
              <div key={h} style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:1, textTransform:'uppercase' }}>{h}</div>
            ))}
          </div>

          {hallOfFame.map((h, i) => (
            <div key={h.id} onClick={() => setSelectedWinner(h)} style={{ display:'grid', gridTemplateColumns:'40px 1fr 1fr 70px', gap:8, alignItems:'center', marginBottom:10, cursor:'pointer', padding:'8px', borderRadius:10, background:'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize:12, fontWeight:900, color:GOLD }}>
                {String(hallOfFame.length - i).padStart(3,'0')}
              </div>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'capitalize' }}>{h.game}</div>
              <div style={{ fontSize:13, fontWeight:900, color:'#fff' }}>{h.winner_name}</div>
              <div style={{ fontSize:13, fontWeight:900, color:GOLD }}>{h.score}ms</div>
            </div>
          ))}
        </div>
      )}

      {/* Winner popup */}
      {selectedWinner && (
        <div onClick={() => setSelectedWinner(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:380 }}>
            <div style={{ background:'linear-gradient(135deg,#8B6914,#C8960C,#FFD700,#C8960C,#8B6914)', borderRadius:24, padding:'24px', boxShadow:'0 12px 0 rgba(100,70,0,0.5)' }}>
              <div style={{ textAlign:'center', marginBottom:20 }}>
                <img src={`${BASE}/winner.png`} style={{ width:56, height:56, objectFit:'contain', marginBottom:8 }} />
                <div style={{ fontSize:11, fontWeight:800, color:'rgba(0,0,0,0.5)', letterSpacing:2 }}>
                  CHAMPION #{String(hallOfFame.findIndex(h => h.id === selectedWinner.id) + 1).padStart(3,'0')}
                </div>
                <div style={{ fontSize:28, fontWeight:900, color:'#000', marginTop:4 }}>{selectedWinner.winner_name}</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
                <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:10, padding:'10px', textAlign:'center' }}>
                  <div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Result</div>
                  <div style={{ fontSize:18, fontWeight:900, color:'#000' }}>{selectedWinner.score}ms</div>
                </div>
                <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:10, padding:'10px', textAlign:'center' }}>
                  <div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Game</div>
                  <div style={{ fontSize:13, fontWeight:900, color:'#000', textTransform:'capitalize' }}>{selectedWinner.game}</div>
                </div>
                <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:10, padding:'10px', textAlign:'center' }}>
                  <div style={{ fontSize:9, fontWeight:800, color:'rgba(0,0,0,0.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Players</div>
                  <div style={{ fontSize:13, fontWeight:900, color:'#000' }}>{selectedWinner.participants || '—'}</div>
                </div>
              </div>
              <a href="https://memgenius.com/championship" style={{ textDecoration:'none', display:'block', width:'100%', padding:'14px', borderRadius:12, background:'rgba(0,0,0,0.25)', color:'#000', fontSize:15, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', textAlign:'center' }}>
                🏆 Visit memgenius.com/championship
              </a>
            </div>
            <button onClick={() => setSelectedWinner(null)} style={{ width:'100%', marginTop:10, padding:'12px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:14, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

    </main>
  )
}
