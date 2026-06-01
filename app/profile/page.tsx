'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GOLD = '#C8960C'
const GREEN = '#2E7D32'

const GAMES = [
  { label: 'Stop', table: 'precision_scores', field: 'difference_ms', filter: { game_type: null }, lower: true },
  { label: 'F1 Reaction', table: 'precision_scores', field: 'difference_ms', filter: { game_type: 'formula1' }, lower: true },
  { label: 'Pendulum', table: 'precision_scores', field: 'difference_ms', filter: { game_type: 'pendulum' }, lower: true },
  { label: 'Ace', table: 'ace_scores', field: 'level', filter: null, lower: false },
  { label: 'Letter Rain', table: 'letter_rain_scores', field: 'level', filter: null, lower: false },
  { label: 'TypeDrop', table: 'typedrop_scores', field: 'score', filter: null, lower: false },
  { label: 'Memory', table: 'scores', field: 'time_ms', filter: null, lower: true },
  { label: 'Digits', table: 'number_scores', field: 'level', filter: null, lower: false },
  { label: 'Simon Says', table: 'sequence_scores', field: 'level', filter: null, lower: false },
  { label: 'N-Back', table: 'nback_scores', field: 'level', filter: null, lower: false },
  { label: 'Blink', table: 'blink_scores', field: 'level', filter: null, lower: false },
  { label: 'Poke', table: 'poke_scores', field: 'level', filter: null, lower: false },
  { label: 'Flags', table: 'flag_scores', field: 'level', filter: null, lower: false },
  { label: 'Capitals', table: 'capitals_scores', field: 'level', filter: null, lower: false },
  { label: 'Countries', table: 'shape_scores', field: 'level', filter: null, lower: false },
  { label: 'Sudoku', table: 'sudoku_scores', field: 'time_ms', filter: null, lower: true },
  { label: 'Mastermind', table: 'mastermind_scores', field: 'attempts', filter: null, lower: true },
  { label: 'Wordly', table: 'wordle_scores', field: 'attempts', filter: null, lower: true },
  { label: '2048', table: 'game2048_scores', field: 'score', filter: null, lower: false },
  { label: 'Blackjack', table: 'blackjack_scores', field: 'chips', filter: null, lower: false },
  { label: 'Tetris', table: 'tetris_scores', field: 'score', filter: null, lower: false },
  { label: 'Higher or Lower Pop', table: 'higher_lower_scores', field: 'level', filter: { category: 'population' }, lower: false },
  { label: 'Higher or Lower Area', table: 'higher_lower_scores', field: 'level', filter: { category: 'area' }, lower: false },
]

async function getGameRank(name: string, g: typeof GAMES[0]) {
  let sq: any = supabase.from(g.table).select(g.field).eq('player_name', name)
  if (g.filter) Object.entries(g.filter).forEach(([k,v]) => { if (v === null) sq = sq.is(k, null); else sq = sq.eq(k, v) })
  sq = sq.order(g.field, { ascending: g.lower }).limit(1)
  const { data } = await sq
  if (!data || data.length === 0) return null
  const playerScore = data[0][g.field]

  let rq: any = supabase.from(g.table).select('player_name', { count: 'exact', head: true })
  if (g.filter) Object.entries(g.filter).forEach(([k,v]) => { if (v === null) rq = rq.is(k, null); else rq = rq.eq(k, v) })
  rq = g.lower ? rq.lt(g.field, playerScore) : rq.gt(g.field, playerScore)
  const { count } = await rq
  return { rank: (count || 0) + 1, score: playerScore }
}

function LoadingRankings() {
 const [blink, setBlink] = useState(true)
 useEffect(() => { const t = setInterval(() => setBlink(b => !b), 600); return () => clearInterval(t) }, [])
 return (
   <div style={{ background:'#252525', borderRadius:16, padding:'20px', textAlign:'center' }}>
     <div style={{ fontSize:14, fontWeight:900, color: blink ? '#69F0AE' : 'transparent', transition:'color 0.3s' }}>● Loading rankings...</div>
   </div>
 )
}

export default function ProfilePage() {
  const { profile } = usePlayer()
  const [profileData, setProfileData] = useState<any>(null)
  const [ranks, setRanks] = useState<Record<string, {rank:number, score:number}>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('profiles').select('*').eq('player_name', profile.name).single()
      .then(({ data }: any) => setProfileData(data))

    const newRanks: Record<string, {rank:number, score:number}> = {}
    let completed = 0
    GAMES.forEach(g => {
      getGameRank(profile.name, g).then(r => {
        completed++
        if (r) {
          newRanks[g.label] = r
          setRanks({...newRanks})
        }
        if (completed === GAMES.length) setLoaded(true)
      }).catch(() => { completed++; if (completed === GAMES.length) setLoaded(true) })
    })
  }, [profile?.name])

  if (!profile?.name) return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <img src={`${BASE}/brain-logo.webp`} style={{ width:60, height:60, marginBottom:16, opacity:0.5 }} />
      <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:8 }}>No profile yet</div>
      <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontWeight:700, textAlign:'center', marginBottom:24 }}>Play a game and save your results to create your profile</div>
      <a href="/register" style={{ textDecoration:'none', background:GREEN, borderRadius:14, padding:'14px 32px', fontSize:16, fontWeight:900, color:'#fff' }}>Create Profile →</a>
    </main>
  )

  const sortedGames = Object.entries(ranks).sort((a,b) => a[1].rank - b[1].rank)
  const maxRank = Math.max(...Object.values(ranks).map(r => r.rank), 1)

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>

      {/* Profile header */}
      <div style={{ background:'#252525', borderRadius:16, padding:'20px', marginBottom:12, display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ width:60, height:60, borderRadius:'50%', background:'#1A1A1A', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
          {profileData?.avatar_url
            ? <img src={profileData.avatar_url} style={{ width:60, height:60, objectFit:'cover' }} />
            : <img src={`${BASE}/nav-profile.webp`} style={{ width:36, height:36, objectFit:'contain', opacity:0.5 }} />
          }
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:2 }}>{profile.name}</div>
          {profileData?.country && <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{profileData.country}</div>}
        </div>
        {profileData?.streak > 0 && (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:900, color:'#FF6B35' }}>🔥{profileData.streak}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>days</div>
          </div>
        )}
      </div>

      {/* Rankings */}
      {!loaded && (
        <div style={{ background:'#252525', borderRadius:16, padding:'20px', textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:14, fontWeight:700 }}>
          Loading rankings...
        </div>
      )}

      {loaded && sortedGames.length > 0 && (
        <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:14 }}>World Rankings</div>
          {sortedGames.map(([game, {rank}]) => {
            const barWidth = Math.max(4, Math.round((1 - (rank-1)/Math.max(maxRank,1)) * 100))
            return (
              <div key={game} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>{game}</div>
                  <div style={{ fontSize:13, fontWeight:900, color:rank<=3?GOLD:'rgba(255,255,255,0.5)' }}>#{rank}</div>
                </div>
                <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:2 }}>
                  <div style={{ height:4, background:rank===1?GOLD:GREEN, borderRadius:2, width:`${barWidth}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button onClick={() => { localStorage.removeItem('memgenius_profile'); window.location.reload() }}
        style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:'#2E7D32', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer' }}>
        Log out
      </button>
    </main>
  )
}
