'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const GAMES = [
  { label: 'Stop', icon: 'precision.png', table: 'precision_scores', field: 'difference_ms', filter: { game_type: null }, lower: true, unit: 'ms' },
  { label: 'F1 Reaction', icon: 'f1.png', table: 'precision_scores', field: 'difference_ms', filter: { game_type: 'formula1' }, lower: true, unit: 'ms' },
  { label: 'Pendulum', icon: 'pendulum.png', table: 'precision_scores', field: 'difference_ms', filter: { game_type: 'pendulum' }, lower: true, unit: '°' },
  { label: 'Ace', icon: 'padel.png', table: 'ace_scores', field: 'level', filter: null, lower: false, unit: ' aces' },
  { label: 'Letter Rain', icon: 'rain.png', table: 'letter_rain_scores', field: 'level', filter: null, lower: false, unit: '' },
  { label: 'TypeDrop', icon: 'type.png', table: 'typedrop_scores', field: 'score', filter: null, lower: false, unit: ' words' },
  { label: 'Digits', icon: 'digits.png', table: 'number_scores', field: 'level', filter: null, lower: false, unit: ' digits' },
  { label: 'Simon Says', icon: 'sequence.png', table: 'sequence_scores', field: 'level', filter: null, lower: false, unit: '' },
  { label: 'N-Back', icon: 'nback.png', table: 'nback_scores', field: 'level', filter: null, lower: false, unit: '' },
  { label: 'Blink', icon: 'blink.png', table: 'blink_scores', field: 'level', filter: null, lower: false, unit: '' },
  { label: 'Poke', icon: 'salmon.png', table: 'poke_scores', field: 'level', filter: null, lower: false, unit: '' },
  { label: 'Flags', icon: 'flags.png', table: 'flag_scores', field: 'level', filter: null, lower: false, unit: '' },
  { label: 'Capitals', icon: 'capitals.png', table: 'capitals_scores', field: 'level', filter: null, lower: false, unit: '' },
  { label: 'Countries', icon: 'countries.png', table: 'shape_scores', field: 'level', filter: null, lower: false, unit: '' },
  { label: 'Higher or Lower Pop', icon: 'population.png', table: 'higher_lower_scores', field: 'level', filter: { category: 'population' }, lower: false, unit: '' },
  { label: 'Higher or Lower Area', icon: 'population.png', table: 'higher_lower_scores', field: 'level', filter: { category: 'area' }, lower: false, unit: '' },
  { label: 'Sudoku', icon: 'sudoku.png', table: 'sudoku_scores', field: 'time_ms', filter: null, lower: true, unit: 'ms' },
  { label: 'Mastermind', icon: 'mastermind.png', table: 'mastermind_scores', field: 'attempts', filter: null, lower: true, unit: ' tries' },
  { label: 'Wordly', icon: 'wordly.png', table: 'wordle_scores', field: 'attempts', filter: null, lower: true, unit: ' tries' },
  { label: '2048', icon: '2048.png', table: 'game2048_scores', field: 'score', filter: null, lower: false, unit: '' },
  { label: 'Blackjack', icon: 'blackjack.png', table: 'blackjack_scores', field: 'chips', filter: null, lower: false, unit: ' chips' },
  { label: 'Tetris', icon: 'tetris.png', table: 'tetris_scores', field: 'score', filter: null, lower: false, unit: '' },
]

export default function RankingsPage() {
  const [selected, setSelected] = useState(GAMES[0])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLeaderboard(selected)
  }, [selected])

  const fetchLeaderboard = async (game: typeof GAMES[0]) => {
    setLoading(true)
    let q: any = supabase.from(game.table).select(`player_name, ${game.field}`)
    if (game.filter) {
      Object.entries(game.filter).forEach(([k,v]) => {
        if (v === null) q = q.is(k, null)
        else q = q.eq(k, v)
      })
    }
    q = q.order(game.field, { ascending: game.lower }).limit(1000)
    const { data } = await q
    if (!data) { setLoading(false); return }

    const best: Record<string,number> = {}
    data.forEach((s:any) => {
      const val = s[game.field]
      if (!best[s.player_name] || (game.lower ? val < best[s.player_name] : val > best[s.player_name])) {
        best[s.player_name] = val
      }
    })
    const sorted = Object.entries(best)
      .sort((a,b) => game.lower ? (a[1] as number)-(b[1] as number) : (b[1] as number)-(a[1] as number))
      .slice(0, 50)
    setLeaderboard(sorted.map(([name, score]) => ({ name, score })))
    setLoading(false)
  }

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', padding:'16px 16px 100px' }}>
      <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:16 }}>Rankings</div>

      {/* Game selector */}
      <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:8, marginBottom:16, scrollbarWidth:'none' }}>
        {GAMES.map(g => (
          <button key={g.label} onClick={() => setSelected(g)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:20, border:'none', background: selected.label === g.label ? '#fff' : '#252525', color: selected.label === g.label ? '#000' : 'rgba(255,255,255,0.6)', fontSize:12, fontWeight:900, fontFamily:'inherit', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
            <img src={`${BASE}/${g.icon}`} style={{ width:18, height:18, objectFit:'contain' }} />
            {g.label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div style={{ background:'#252525', borderRadius:16, overflow:'hidden' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12 }}>
          <img src={`${BASE}/${selected.icon}`} style={{ width:28, height:28, objectFit:'contain' }} />
          <div style={{ fontSize:16, fontWeight:900, color:'#fff' }}>{selected.label}</div>
        </div>

        {loading && (
          <div style={{ padding:24, textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:14, fontWeight:700 }}>Loading...</div>
        )}

        {!loading && leaderboard.map((p, i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom: i < leaderboard.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div style={{ fontSize:13, fontWeight:900, color: i===0?GOLD:i===1?'#aaa':i===2?'#cd7f32':'rgba(255,255,255,0.3)', width:24, textAlign:'center' }}>
              {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
            </div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color: i < 3 ? '#fff' : 'rgba(255,255,255,0.7)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color: i===0?GOLD:'rgba(255,255,255,0.5)' }}>{p.score}{selected.unit}</div>
          </div>
        ))}

        {!loading && leaderboard.length === 0 && (
          <div style={{ padding:24, textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:14, fontWeight:700 }}>No scores yet</div>
        )}
      </div>
    </main>
  )
}
