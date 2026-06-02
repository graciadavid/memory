'use client'
import { useState, useEffect, useCallback } from 'react'
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
  { label: 'Higher or Lower Pop', table: 'higher_lower_scores', field: 'level', filter: { category: 'population' }, lower: false },
  { label: 'Higher or Lower Area', table: 'higher_lower_scores', field: 'level', filter: { category: 'area' }, lower: false },
  { label: 'Sudoku', table: 'sudoku_scores', field: 'time_ms', filter: null, lower: true },
  { label: 'Mastermind', table: 'mastermind_scores', field: 'attempts', filter: null, lower: true },
  { label: 'Wordly', table: 'wordle_scores', field: 'attempts', filter: null, lower: true },
  { label: '2048', table: 'game2048_scores', field: 'best_tile', filter: null, lower: false },
  { label: 'Blackjack', table: 'blackjack_scores', field: 'chips', filter: null, lower: false },
]

async function getGameRank(name: string, g: typeof GAMES[0]): Promise<{rank:number, score:number, total:number} | null> {
  let sq: any = supabase.from(g.table).select('player_name, '+g.field).eq('player_name', name)
  if (g.filter) Object.entries(g.filter).forEach(([k,v]) => { if (v === null) sq = sq.is(k, null); else sq = sq.eq(k, v) })
  sq = sq.order(g.field, { ascending: g.lower }).limit(1)
  const { data } = await sq
  if (!data || data.length === 0) return null
  const playerScore = (data[0] as any)[g.field]

  let rq: any = supabase.from(g.table).select('player_name, '+g.field)
  if (g.filter) Object.entries(g.filter).forEach(([k,v]) => { if (v === null) rq = rq.is(k, null); else rq = rq.eq(k, v) })
  const { data: allScores } = await rq
  if (!allScores) return { rank: 1, score: playerScore, total: 1 }

  const bestPerPlayer: Record<string, number> = {}
  allScores.forEach((s: any) => {
    const val = (s as any)[g.field]
    if (s.player_name && (!bestPerPlayer[s.player_name] || (g.lower ? val < bestPerPlayer[s.player_name] : val > bestPerPlayer[s.player_name]))) {
      bestPerPlayer[s.player_name] = val
    }
  })
  const total = Object.keys(bestPerPlayer).length
  const betterCount = Object.values(bestPerPlayer).filter(v => g.lower ? v < playerScore : v > playerScore).length
  return { rank: betterCount + 1, score: playerScore, total }
}

function RegisterForm() {
  const [name, setName] = useState('')
  const [pin, setPin] = useState(['','','',''])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) { setError('Enter a name'); return }
    if (pin.join('').length !== 4) { setError('Enter a 4-digit PIN'); return }
    setSaving(true); setError('')
    let country = ''
    try { const geo = await fetch('https://ipapi.co/json/'); const d = await geo.json(); country = d.country_code || '' } catch {}
    const pinHash = btoa(pin.join(''))
    const { data: existing } = await supabase.from('profiles').select('player_name, password_hash').eq('player_name', name.trim()).limit(1)
    if (existing && existing.length > 0) {
      if (existing[0].password_hash !== pinHash) { setError('Wrong PIN for this name'); setSaving(false); return }
    } else {
      await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: pinHash, country })
    }
    localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim() }))
    setSaving(false)
    window.dispatchEvent(new Event('profileUpdated'))
    window.location.reload()
  }

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'32px 20px 100px', fontFamily:'var(--font-nunito),sans-serif' }}>
      <div style={{ fontSize:24, fontWeight:900, color:'#fff', marginBottom:4 }}>Create your profile</div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:28 }}>Free · No email · Rank globally</div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Your name</div>
        <input value={name} onChange={e => { setName(e.target.value); setError('') }} placeholder="Enter your name" maxLength={20} autoFocus
          style={{ width:'100%', padding:'14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color:'#fff', fontSize:16, fontWeight:800, fontFamily:'var(--font-nunito),sans-serif', outline:'none', boxSizing:'border-box' }} />
      </div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>4-digit PIN</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8 }}>
          {pin.map((d,i) => (
            <input key={i} id={'pin-'+i} type="tel" maxLength={1} value={d}
              onChange={e => { const v=e.target.value.replace(/\D/,''); const p=[...pin]; p[i]=v; setPin(p); setError(''); if(v&&i<3)(document.getElementById('pin-'+(i+1)) as HTMLInputElement)?.focus() }}
              style={{ width:'100%', height:48, textAlign:'center', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color:'#fff', fontSize:18, fontWeight:900, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} />
          ))}
        </div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:6 }}>Remember your PIN — it's how you log in</div>
      </div>
      {error && <div style={{ fontSize:13, color:'#FF5252', fontWeight:800, marginBottom:16 }}>{error}</div>}
      <button onClick={handleSave} disabled={saving}
        style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer', boxShadow:'0 6px 0 #1B5E20' }}>
        {saving ? 'Saving...' : 'Start Playing →'}
      </button>
    </main>
  )
}

export default function ProfilePage() {
  const { profile } = usePlayer()
  const [profileData, setProfileData] = useState<any>(null)
  const [ranks, setRanks] = useState<Record<string, {rank:number, score:number, total:number}>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('profiles').select('*').eq('player_name', profile.name).single()
      .then(({ data }: any) => setProfileData(data))

    setLoaded(false)
    const newRanks: Record<string, {rank:number, score:number, total:number}> = {}
    let completed = 0
    GAMES.forEach(g => {
      getGameRank(profile.name, g).then(r => {
        completed++
        if (r) { newRanks[g.label] = r; setRanks({...newRanks}) }
        if (completed === GAMES.length) {
          setLoaded(true)
          // Calculate and save global rank
          const sorted = Object.entries(newRanks).sort((a,b) => a[1].rank - b[1].rank)
          if (sorted.length > 0) {
            const avg = Math.round(sorted.reduce((acc,[,{rank,total}]) => acc + rank/Math.max(total,1), 0) / sorted.length * 100)
            localStorage.setItem('memgenius_world_rank', String(avg))
            window.dispatchEvent(new Event('profileUpdated'))
          }
        }
      }).catch(() => { completed++; if (completed === GAMES.length) setLoaded(true) })
    })
  }, [profile?.name])

  if (!profile?.name) return <RegisterForm />

  // Sort by rank ascending
  const sortedGames = Object.entries(ranks).sort((a,b) => a[1].rank - b[1].rank)

  // Group by percentile based on rank/total
  const top10 = sortedGames.filter(([,{rank,total}]) => total > 0 && rank/total <= 0.1)
  const top50 = sortedGames.filter(([,{rank,total}]) => total > 0 && rank/total > 0.1 && rank/total <= 0.5)
  const rest = sortedGames.filter(([,{rank,total}]) => total > 0 && rank/total > 0.5)

  const GAME_HREFS: Record<string,string> = {
    'Stop':'/stop','F1 Reaction':'/f1','Pendulum':'/pendulum','Ace':'/ace',
    'Letter Rain':'/letter-rain','TypeDrop':'/typedrop','Memory':'/memory',
    'Digits':'/digits','Simon Says':'/simon-says','N-Back':'/nback','Blink':'/blink',
    'Poke':'/poke','Flags':'/flags','Capitals':'/capitals','Countries':'/countries',
    'Higher or Lower Pop':'/higherorlower/population','Higher or Lower Area':'/higherorlower/area',
    'Sudoku':'/sudoku','Mastermind':'/mastermind','Wordly':'/wordly',
    '2048':'/2048','Blackjack':'/blackjack'
  }

  const renderGame = (label: string, rank: number, total: number) => {
    const pct = rank / total
    const barColor = pct <= 0.1 ? '#69F0AE' : pct <= 0.5 ? GOLD : '#FF5252'
    const barWidth = Math.max(4, Math.round((1 - (rank-1)/Math.max(total,1)) * 100))
    const href = GAME_HREFS[label] || '/'
    const shareText = `I'm #${rank} in ${label} on MemGenius! Can you beat me? memgenius.com${href}`
    return (
      <div key={label} style={{ marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
          <div style={{ flex:1, fontSize:13, fontWeight:800, color:'#fff' }}>{label}</div>
          <div style={{ fontSize:13, fontWeight:900, color: rank<=3 ? GOLD : 'rgba(255,255,255,0.6)' }}>#{rank}</div>
          <a href={href} style={{ textDecoration:'none', background:'#2E7D32', borderRadius:6, padding:'3px 8px', fontSize:10, fontWeight:900, color:'#fff' }}>Improve</a>
          <button onClick={() => navigator.share ? navigator.share({text:shareText,url:'https://memgenius.com'+href}) : navigator.clipboard.writeText(shareText)}
            style={{ background:'#C8960C', border:'none', cursor:'pointer', fontSize:11, color:'#fff', fontWeight:900, padding:'4px 10px', fontFamily:'inherit', borderRadius:8, boxShadow:'0 2px 0 #8B6914' }}>Share</button>
        </div>
        <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:2 }}>
          <div style={{ height:4, background:barColor, borderRadius:2, width:barWidth+'%' }} />
        </div>
      </div>
    )
  }

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px', fontFamily:'var(--font-nunito),sans-serif' }}>


     {/* Profile header */}
     {(() => {
      const streak = profileData?.streak || 0
      const streakTitle = streak >= 100 ? 'Legend' : streak >= 51 ? 'Elite' : streak >= 21 ? 'Dedicated' : streak >= 11 ? 'Focused' : streak >= 6 ? 'Consistent' : streak >= 1 ? 'Beginner' : null
      const totalPlayers = loaded && sortedGames.length > 0 ? Math.max(...sortedGames.map(([,{total}]) => total)) : 0
      const globalRank = loaded && sortedGames.length > 0
        ? Math.round(sortedGames.reduce((acc,[,{rank,total}]) => acc + rank/Math.max(total,1), 0) / sortedGames.length * totalPlayers)
        : null
      if (globalRank) localStorage.setItem('memgenius_world_rank', String(globalRank))
      return (
       <div style={{ background:'linear-gradient(135deg,#1A1200,#2D2000)', borderRadius:20, padding:'24px', marginBottom:12, border:'2px solid #C8960C40', boxShadow:'0 8px 32px rgba(200,150,12,0.15)' }}>
         {/* Name + World Rank */}
         <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
           <div>
             <div style={{ fontSize:11, fontWeight:800, color:'rgba(200,150,12,0.6)', letterSpacing:3, textTransform:'uppercase', marginBottom:4 }}>Brain Athlete</div>
             <div style={{ fontSize:32, fontWeight:900, color:'#fff', lineHeight:1 }}>{profile.name}</div>
             {profileData?.country && <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.3)', marginTop:4 }}>{profileData.country}</div>}
           </div>
           <div style={{ textAlign:'right' }}>
             <div style={{ fontSize:11, fontWeight:800, color:'rgba(200,150,12,0.6)', letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>World Ranking</div>
             <div style={{ fontSize:52, fontWeight:900, color:'#C8960C', lineHeight:1, letterSpacing:-2 }}>{globalRank ? '#'+globalRank : '—'}</div>
           </div>
         </div>
         {/* Streak */}
         <div style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,107,53,0.12)', borderRadius:14, padding:'14px 18px', border:'1px solid rgba(255,107,53,0.2)' }}>
           <span style={{ fontSize:36 }}>🔥</span>
           <div>
             <div style={{ fontSize:28, fontWeight:900, color:'#FF6B35', lineHeight:1 }}>{streak} <span style={{ fontSize:16, fontWeight:700 }}>days</span></div>
             {streakTitle && <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,107,53,0.7)', marginTop:3, letterSpacing:1, textTransform:'uppercase' }}>{streakTitle}</div>}
           </div>
         </div>
       </div>
     )
      {!loaded && (
          Loading rankings...
        </div>
      )}

      {loaded && top10.length > 0 && (
        <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:800, color:'#69F0AE', letterSpacing:2, marginBottom:12 }}><img src='https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/trophy.png' style={{ width:16, height:16, objectFit:'contain', verticalAlign:'middle', marginRight:4 }} />TOP 10%</div>
          {top10.map(([label, {rank, total}]) => renderGame(label, rank, total))}
        </div>
      )}

      {loaded && top50.length > 0 && (
        <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:800, color:GOLD, letterSpacing:2, marginBottom:12 }}><img src='https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/ray.png' style={{ width:16, height:16, objectFit:'contain', verticalAlign:'middle', marginRight:4 }} />TOP 50%</div>
          {top50.map(([label, {rank, total}]) => renderGame(label, rank, total))}
        </div>
      )}

      {loaded && rest.length > 0 && (
        <div style={{ background:'#252525', borderRadius:16, padding:'16px', marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, marginBottom:12 }}>KEEP TRAINING</div>
          {rest.map(([label, {rank, total}]) => renderGame(label, rank, total))}
        </div>
      )}

      <button onClick={() => { localStorage.removeItem('memgenius_profile'); window.location.reload() }}
        style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:14, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer' }}>
        Log out
      </button>
    </main>
  )
}
