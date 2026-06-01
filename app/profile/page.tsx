'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import AuthModal from '@/components/AuthModal'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GOLD = '#C8960C'
const GREEN = '#2E7D32'

const GAMES = [
  { label: 'Stop', table: 'precision_scores', field: 'difference_ms', filter: { game_type: null }, lower: true, href: '/stop' },
  { label: 'F1 Reaction', table: 'precision_scores', field: 'difference_ms', filter: { game_type: 'formula1' }, lower: true, href: '/f1' },
  { label: 'Pendulum', table: 'precision_scores', field: 'difference_ms', filter: { game_type: 'pendulum' }, lower: true, href: '/pendulum' },
  { label: 'Ace', table: 'ace_scores', field: 'level', filter: null, lower: false, href: '/ace' },
  { label: 'Letter Rain', table: 'letter_rain_scores', field: 'level', filter: null, lower: false, href: '/letter-rain' },
  { label: 'Memory', table: 'scores', field: 'time_ms', filter: null, lower: true, href: '/memory' },
  { label: 'Digits', table: 'number_scores', field: 'level', filter: null, lower: false, href: '/digits' },
  { label: 'Simon Says', table: 'sequence_scores', field: 'level', filter: null, lower: false, href: '/simon' },
  { label: 'N-Back', table: 'nback_scores', field: 'level', filter: null, lower: false, href: '/nback' },
  { label: 'Blink', table: 'blink_scores', field: 'level', filter: null, lower: false, href: '/blink' },
  { label: 'Poke', table: 'poke_scores', field: 'level', filter: null, lower: false, href: '/poke' },
  { label: 'Flags', table: 'flag_scores', field: 'level', filter: null, lower: false, href: '/flags' },
  { label: 'Capitals', table: 'capitals_scores', field: 'level', filter: null, lower: false, href: '/capitals' },
  { label: 'Countries', table: 'shape_scores', field: 'level', filter: null, lower: false, href: '/countries' },
  { label: 'Sudoku', table: 'sudoku_scores', field: 'time_ms', filter: null, lower: true, href: '/sudoku' },
  { label: 'Mastermind', table: 'mastermind_scores', field: 'attempts', filter: null, lower: true, href: '/mastermind' },
  { label: 'Wordly', table: 'wordle_scores', field: 'attempts', filter: null, lower: true, href: '/wordly' },
  { label: '2048', table: 'game2048_scores', field: 'score', filter: null, lower: false, href: '/2048' },
  { label: 'Blackjack', table: 'blackjack_scores', field: 'chips', filter: null, lower: false, href: '/blackjack' },
  { label: 'Tetris', table: 'tetris_scores', field: 'score', filter: null, lower: false, href: '/tetris' },
  { label: 'Higher or Lower Pop', table: 'higher_lower_scores', field: 'level', filter: { category: 'population' }, lower: false, href: '/higherorlower/population' },
  { label: 'Higher or Lower Area', table: 'higher_lower_scores', field: 'level', filter: { category: 'area' }, lower: false, href: '/higherorlower/area' },
]

const STREAK_LEVELS = [
  { min: 1, max: 5, name: 'Beginner', emoji: 'seed.png', benefit: 'You are building the habit. Consistency is the first step to cognitive improvement.' },
  { min: 6, max: 10, name: 'Consistent', emoji: 'streak.png', benefit: 'Neural pathways are starting to strengthen. Your brain is adapting to regular training.' },
  { min: 11, max: 20, name: 'Focused', emoji: 'brain-logo.webp', benefit: 'Regular training is measurably improving your reaction time and memory capacity.' },
  { min: 21, max: 50, name: 'Dedicated', emoji: 'ray.png', benefit: 'You are in the top tier of brain trainers. Cognitive benefits are compounding daily.' },
  { min: 51, max: 99, name: 'Elite', emoji: 'winner.png', benefit: 'Elite level consistency. Your brain is operating at peak training efficiency.' },
  { min: 100, max: Infinity, name: 'Legend', emoji: 'target.png', benefit: 'Legendary. You are among the most consistent brain trainers in the world.' },
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
  const { count: better } = await rq

  let tq: any = supabase.from(g.table).select('player_name', { count: 'exact', head: true })
  if (g.filter) Object.entries(g.filter).forEach(([k,v]) => { if (v === null) tq = tq.is(k, null); else tq = tq.eq(k, v) })
  const { count: total } = await tq

  return { rank: (better || 0) + 1, score: playerScore, total: total || 1 }
}

function ProfileLoginButton() {
  const [show, setShow] = useState(true)
  if (!show) return null
  return (
    <div style={{ padding: '0 0 16px' }}>
      <AuthModal onSuccess={() => window.location.reload()} />
    </div>
  )
}

export default function ProfilePage() {
  const { profile } = usePlayer()
  const [profileData, setProfileData] = useState<any>(null)
  const [ranks, setRanks] = useState<Record<string, {rank:number, score:number, total:number}>>({})
  const [loaded, setLoaded] = useState(false)
  const [totalPlayers, setTotalPlayers] = useState(0)

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('profiles').select('*').eq('player_name', profile.name).single()
      .then(({ data }: any) => setProfileData(data))

    supabase.from('profiles').select('player_name', { count: 'exact', head: true })
      .then(({ count }: any) => setTotalPlayers(count || 0))

    const newRanks: Record<string, {rank:number, score:number, total:number}> = {}
    let completed = 0
    GAMES.forEach(g => {
      getGameRank(profile.name, g).then(r => {
        completed++
        if (r) { newRanks[g.label] = r; setRanks({...newRanks}) }
        if (completed === GAMES.length) setLoaded(true)
      }).catch(() => { completed++; if (completed === GAMES.length) setLoaded(true) })
    })
  }, [profile?.name])

  if (!profile?.name) return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      <ProfileLoginButton />
    </main>
  )

  const streak = profileData?.streak || 0
  const streakLevel = STREAK_LEVELS.find(l => streak >= l.min && streak <= l.max) || STREAK_LEVELS[0]
  const nextLevel = STREAK_LEVELS.find(l => l.min > streak)

  const sortedGames = Object.entries(ranks).sort((a,b) => {
    const pctA = a[1].rank / a[1].total
    const pctB = b[1].rank / b[1].total
    return pctA - pctB
  })

  const topGames = sortedGames.filter(([,{rank,total}]) => rank/total <= 0.1)
  const midGames = sortedGames.filter(([,{rank,total}]) => rank/total > 0.1 && rank/total <= 0.5)
  const lowGames = sortedGames.filter(([,{rank,total}]) => rank/total > 0.5)

  const myGlobalRank = sortedGames.length > 0
    ? Math.round(sortedGames.reduce((acc,[,{rank,total}]) => acc + rank/total, 0) / sortedGames.length * totalPlayers)
    : null
  const globalPct = myGlobalRank ? Math.round(myGlobalRank / totalPlayers * 100) : null
  if (myGlobalRank) localStorage.setItem("memgenius_world_rank", String(myGlobalRank))

  const renderGameCard = (game: string, rank: number, total: number, href: string) => {
    const pct = rank / total
    const barColor = pct <= 0.1 ? '#69F0AE' : pct <= 0.5 ? GOLD : '#FF5252'
    const barWidth = Math.max(4, Math.round((1 - (rank-1)/Math.max(total,1)) * 100))
    return (
      <div key={game} style={{ marginBottom: 14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
          <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>{game}</div>
          <div style={{ fontSize:13, fontWeight:900, color: rank<=3?GOLD:'rgba(255,255,255,0.6)' }}>#{rank} / {total}</div>
        </div>
        <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:2, marginBottom:6 }}>
          <div style={{ height:4, background:barColor, borderRadius:2, width:`${barWidth}%` }} />
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <a href={href} style={{ textDecoration:'none', flex:1 }}>
            <div style={{ background:'rgba(230,81,0,0.2)', borderRadius:8, padding:'6px', textAlign:'center', fontSize:11, fontWeight:800, color:'#FF6B35' }}>Training</div>
          </a>
          <button onClick={() => {
            const text = `I ranked #${rank} out of ${total} players in ${game} on MemGenius! Can you beat me? memgenius.com`
            if (navigator.share) { navigator.share({ title: 'MemGenius', text, url: 'https://memgenius.com' }) }
            else { navigator.clipboard.writeText(text); alert('Copied!') }
          }} style={{ flex:1, background:'rgba(46,125,50,0.2)', borderRadius:8, padding:'6px', textAlign:'center', fontSize:11, fontWeight:800, color:'#69F0AE', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
            Share
          </button>
        </div>
      </div>
    )
  }

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      {/* Unified profile card */}
      <div style={{ background:'#252525', borderRadius:16, padding:'20px', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom: (globalPct !== null || streak > 0) ? 16 : 0 }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:GREEN, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:24, fontWeight:900, color:'#fff' }}>{profile.name.charAt(0).toUpperCase()}</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:2 }}>{profile.name}</div>
            {profileData?.country && <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>{profileData.country}</div>}
          </div>
          {streak > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <img src={`${BASE}/${streakLevel.emoji}`} style={{ width:22, height:22, objectFit:'contain' }} />
              <span style={{ fontSize:18, fontWeight:900, color:'#FF6B35' }}>{streak}</span>
            </div>
          )}
        </div>
        {globalPct !== null && (
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:14, marginBottom: streak > 0 ? 14 : 0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>World Ranking</div>
                <div style={{ fontSize:28, fontWeight:900, color: globalPct <= 10 ? '#69F0AE' : globalPct <= 50 ? GOLD : '#FF5252' }}>Top {globalPct}%</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>#{myGlobalRank} of {totalPlayers} players</div>
              </div>
              <img src={`${BASE}/population.png`} style={{ width:36, height:36, objectFit:'contain', opacity:0.4 }} />
            </div>
          </div>
        )}
        {streak > 0 && (
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:14 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <div style={{ fontSize:15, fontWeight:900, color:'#fff' }}>{streakLevel.name}</div>
              {nextLevel && <div style={{ fontSize:12, fontWeight:800, color:'#69F0AE' }}>Next → {nextLevel.name}</div>}
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:700, lineHeight:1.5 }}>{streakLevel.benefit}</div>
          </div>
        )}
      </div>
{!loaded && (
        <div style={{ background:'#252525', borderRadius:16, padding:'20px', textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:14, fontWeight:700 }}>
          Loading rankings...
        </div>
      )}

      {loaded && topGames.length > 0 && (
        <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:800, color:'#69F0AE', letterSpacing:2, textTransform:'uppercase', marginBottom:14 }}>🏆 World Top 10%</div>
          {topGames.map(([game, {rank, total}]) => {
            const g = GAMES.find(x => x.label === game)!
            return renderGameCard(game, rank, total, g.href)
          })}
        </div>
      )}

      {loaded && midGames.length > 0 && (
        <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:14 }}>⚡ Top 50%</div>
          {midGames.map(([game, {rank, total}]) => {
            const g = GAMES.find(x => x.label === game)!
            return renderGameCard(game, rank, total, g.href)
          })}
        </div>
      )}

      {loaded && lowGames.length > 0 && (
        <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:800, color:'#FF5252', letterSpacing:2, textTransform:'uppercase', marginBottom:14 }}>💪 Keep Improving</div>
          {lowGames.map(([game, {rank, total}]) => {
            const g = GAMES.find(x => x.label === game)!
            return renderGameCard(game, rank, total, g.href)
          })}
        </div>
      )}

      <button onClick={() => { localStorage.removeItem('memgenius_profile'); window.location.reload() }}
        style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)', fontSize:14, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer' }}>
        Log out
      </button>

    </main>
  )
}
