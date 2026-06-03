'use client'
import { useState, useCallback } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { GameRulesScreen, GameResultScreen } from '@/components/GameLayout'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const RED = '#D32F2F'

const COUNTRIES = [
  { name: 'China', code: 'cn', population: 1412000000, area: 9597000 },
  { name: 'India', code: 'in', population: 1380000000, area: 3287000 },
  { name: 'USA', code: 'us', population: 331000000, area: 9834000 },
  { name: 'Indonesia', code: 'id', population: 273000000, area: 1905000 },
  { name: 'Pakistan', code: 'pk', population: 220000000, area: 796000 },
  { name: 'Brazil', code: 'br', population: 214000000, area: 8516000 },
  { name: 'Nigeria', code: 'ng', population: 211000000, area: 924000 },
  { name: 'Bangladesh', code: 'bd', population: 166000000, area: 148000 },
  { name: 'Russia', code: 'ru', population: 144000000, area: 17098000 },
  { name: 'Ethiopia', code: 'et', population: 117000000, area: 1104000 },
  { name: 'Mexico', code: 'mx', population: 128000000, area: 1964000 },
  { name: 'Japan', code: 'jp', population: 125000000, area: 378000 },
  { name: 'Philippines', code: 'ph', population: 111000000, area: 300000 },
  { name: 'Egypt', code: 'eg', population: 102000000, area: 1002000 },
  { name: 'DR Congo', code: 'cd', population: 89000000, area: 2345000 },
  { name: 'Iran', code: 'ir', population: 84000000, area: 1649000 },
  { name: 'Turkey', code: 'tr', population: 84000000, area: 785000 },
  { name: 'Germany', code: 'de', population: 83000000, area: 357000 },
  { name: 'Thailand', code: 'th', population: 70000000, area: 513000 },
  { name: 'UK', code: 'gb', population: 67000000, area: 243000 },
  { name: 'France', code: 'fr', population: 67000000, area: 552000 },
  { name: 'Tanzania', code: 'tz', population: 63000000, area: 945000 },
  { name: 'South Africa', code: 'za', population: 60000000, area: 1220000 },
  { name: 'Myanmar', code: 'mm', population: 54000000, area: 677000 },
  { name: 'South Korea', code: 'kr', population: 52000000, area: 100000 },
  { name: 'Colombia', code: 'co', population: 51000000, area: 1142000 },
  { name: 'Kenya', code: 'ke', population: 54000000, area: 580000 },
  { name: 'Spain', code: 'es', population: 47000000, area: 506000 },
  { name: 'Ukraine', code: 'ua', population: 44000000, area: 604000 },
  { name: 'Algeria', code: 'dz', population: 44000000, area: 2382000 },
  { name: 'Argentina', code: 'ar', population: 45000000, area: 2780000 },
  { name: 'Sudan', code: 'sd', population: 43000000, area: 1886000 },
  { name: 'Canada', code: 'ca', population: 38000000, area: 9985000 },
  { name: 'Poland', code: 'pl', population: 38000000, area: 313000 },
  { name: 'Morocco', code: 'ma', population: 37000000, area: 447000 },
  { name: 'Saudi Arabia', code: 'sa', population: 35000000, area: 2150000 },
  { name: 'Peru', code: 'pe', population: 33000000, area: 1285000 },
  { name: 'Angola', code: 'ao', population: 32000000, area: 1247000 },
  { name: 'Venezuela', code: 've', population: 28000000, area: 912000 },
  { name: 'Malaysia', code: 'my', population: 32000000, area: 330000 },
  { name: 'Ghana', code: 'gh', population: 32000000, area: 239000 },
  { name: 'Australia', code: 'au', population: 26000000, area: 7692000 },
  { name: 'Cameroon', code: 'cm', population: 27000000, area: 475000 },
  { name: 'Romania', code: 'ro', population: 19000000, area: 238000 },
  { name: 'Chile', code: 'cl', population: 19000000, area: 756000 },
  { name: 'Netherlands', code: 'nl', population: 17000000, area: 42000 },
  { name: 'Ecuador', code: 'ec', population: 17000000, area: 284000 },
  { name: 'Kazakhstan', code: 'kz', population: 19000000, area: 2725000 },
  { name: 'Bolivia', code: 'bo', population: 12000000, area: 1099000 },
  { name: 'Belgium', code: 'be', population: 11000000, area: 31000 },
  { name: 'Sweden', code: 'se', population: 10000000, area: 450000 },
  { name: 'Portugal', code: 'pt', population: 10000000, area: 92000 },
  { name: 'Greece', code: 'gr', population: 11000000, area: 132000 },
  { name: 'Libya', code: 'ly', population: 7000000, area: 1760000 },
  { name: 'Israel', code: 'il', population: 9000000, area: 21000 },
  { name: 'Switzerland', code: 'ch', population: 9000000, area: 41000 },
  { name: 'Austria', code: 'at', population: 9000000, area: 84000 },
  { name: 'New Zealand', code: 'nz', population: 5000000, area: 268000 },
  { name: 'Norway', code: 'no', population: 5000000, area: 385000 },
  { name: 'Finland', code: 'fi', population: 5000000, area: 338000 },
  { name: 'Mongolia', code: 'mn', population: 3000000, area: 1564000 },
  { name: 'Namibia', code: 'na', population: 3000000, area: 824000 },
  { name: 'Iceland', code: 'is', population: 400000, area: 103000 },
  { name: 'Qatar', code: 'qa', population: 3000000, area: 12000 },
  { name: 'Singapore', code: 'sg', population: 6000000, area: 728 },
  { name: 'Kuwait', code: 'kw', population: 4000000, area: 18000 },
  { name: 'Uruguay', code: 'uy', population: 3000000, area: 176000 },
  { name: 'Paraguay', code: 'py', population: 7000000, area: 407000 },
  { name: 'Costa Rica', code: 'cr', population: 5000000, area: 51000 },
  { name: 'Panama', code: 'pa', population: 4000000, area: 75000 },
  { name: 'Ireland', code: 'ie', population: 5000000, area: 70000 },
  { name: 'Croatia', code: 'hr', population: 4000000, area: 57000 },
  { name: 'Georgia', code: 'ge', population: 4000000, area: 70000 },
  { name: 'Jordan', code: 'jo', population: 10000000, area: 89000 },
  { name: 'UAE', code: 'ae', population: 10000000, area: 84000 },
  { name: 'Iraq', code: 'iq', population: 40000000, area: 438000 },
  { name: 'Nepal', code: 'np', population: 29000000, area: 147000 },
  { name: 'Sri Lanka', code: 'lk', population: 22000000, area: 66000 },
  { name: 'Czech Republic', code: 'cz', population: 11000000, area: 79000 },
  { name: 'Hungary', code: 'hu', population: 10000000, area: 93000 },
  { name: 'Bulgaria', code: 'bg', population: 7000000, area: 111000 },
  { name: 'Serbia', code: 'rs', population: 7000000, area: 88000 },
  { name: 'Denmark', code: 'dk', population: 6000000, area: 43000 },
  { name: 'Slovakia', code: 'sk', population: 5000000, area: 49000 },
  { name: 'Lithuania', code: 'lt', population: 3000000, area: 65000 },
  { name: 'Latvia', code: 'lv', population: 2000000, area: 65000 },
  { name: 'Estonia', code: 'ee', population: 1300000, area: 45000 },
  { name: 'Cuba', code: 'cu', population: 11000000, area: 110000 },
  { name: 'Dominican Republic', code: 'do', population: 11000000, area: 49000 },
  { name: 'Guatemala', code: 'gt', population: 17000000, area: 109000 },
  { name: 'Honduras', code: 'hn', population: 10000000, area: 112000 },
  { name: 'El Salvador', code: 'sv', population: 6000000, area: 21000 },
  { name: 'Jamaica', code: 'jm', population: 3000000, area: 11000 },
  { name: 'Zambia', code: 'zm', population: 18000000, area: 753000 },
  { name: 'Zimbabwe', code: 'zw', population: 15000000, area: 391000 },
  { name: 'Senegal', code: 'sn', population: 17000000, area: 197000 },
  { name: 'Uganda', code: 'ug', population: 47000000, area: 242000 },
  { name: 'Mozambique', code: 'mz', population: 32000000, area: 802000 },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function formatValue(n: number, cat: string): string {
  if (cat === 'population') {
    if (n >= 1000000000) return (n/1000000000).toFixed(1)+'B people'
    if (n >= 1000000) return Math.round(n/1000000)+'M people'
    return Math.round(n/1000)+'K people'
  } else {
    if (n >= 1000000) return (n/1000000).toFixed(1)+'M km²'
    return Math.round(n/1000)+'K km²'
  }
}

type Phase = 'rules' | 'playing' | 'result'
interface Props { category: 'population' | 'area' }

export default function HigherOrLowerClient({ category }: Props) {
  const { profile } = usePlayer()
  const [phase, setPhase] = useState<Phase>('rules')
  const [level, setLevel] = useState(0)
  const [top, setTop] = useState<typeof COUNTRIES[0]|null>(null)
  const [bottom, setBottom] = useState<typeof COUNTRIES[0]|null>(null)
  const [pool, setPool] = useState<typeof COUNTRIES>([])
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)
  const [revealed, setRevealed] = useState(false)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<any[]>([])

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('higher_lower_scores').select('player_name, level').eq('category', category).order('level', { ascending: false }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
    const sorted = Object.entries(best).sort((a,b) => (b[1] as number)-(a[1] as number))
    setTop5(sorted.slice(0,5).map(([name,l]) => ({name, score:l+' correct'})))
    const stored = typeof window !== 'undefined' ? localStorage.getItem('memgenius_profile') : null
    const pName = stored ? JSON.parse(stored).name : null
    if (pName && best[pName] !== undefined) setMyBest(best[pName])
  }, [profile?.name, category])

  useState(() => { loadData() })

  const nextQuestion = useCallback((currentPool: typeof COUNTRIES, newTop: typeof COUNTRIES[0]) => {
    if (currentPool.length === 0) return
    const idx = Math.floor(Math.random() * currentPool.length)
    const newBottom = currentPool[idx]
    const newPool = currentPool.filter((_,i) => i !== idx)
    setTop(newTop)
    setBottom(newBottom)
    setPool(newPool)
    setFeedback(null)
    setRevealed(false)
  }, [])

  const startGame = () => {
    const shuffled = shuffle(COUNTRIES)
    const firstTop = shuffled[0]
    const rest = shuffled.slice(1)
    setLevel(0)
    setPhase('playing')
    window.dispatchEvent(new Event('gameStart'))
    nextQuestion(rest, firstTop)
    setPool(rest)
  }

  const endGame = useCallback(async (finalLevel: number) => {
    setPhase('result')
    window.dispatchEvent(new Event('gameResult'))
    const { count } = await supabase.from('higher_lower_scores').select('player_name', { count: 'exact', head: true }).eq('category', category).gt('level', finalLevel)
    setWorldRank((count ?? 0) + 1)
    if (profile?.name && finalLevel > 0) await supabase.from('higher_lower_scores').insert({ player_name: profile.name, level: finalLevel, category })
     supabase.rpc('update_streak', { p_player_name: profile.name })  }, [profile?.name, category])

  const handleAnswer = useCallback((choice: 'higher' | 'lower') => {
    if (feedback || !top || !bottom) return
    const valTop = category === 'population' ? top.population : top.area
    const valBottom = category === 'population' ? bottom.population : bottom.area
    const isHigher = valBottom >= valTop
    const isCorrect = (choice === 'higher' && isHigher) || (choice === 'lower' && !isHigher)
    setRevealed(true)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      const newLevel = level + 1
      setLevel(newLevel)
      setTimeout(() => nextQuestion(pool, bottom), 1200)
    } else {
      setTimeout(() => endGame(level), 1200)
    }
  }, [feedback, top, bottom, category, level, pool, nextQuestion, endGame])

  const valTop = top ? (category === 'population' ? top.population : top.area) : 0
  const valBottom = bottom ? (category === 'population' ? bottom.population : bottom.area) : 0
  const worldRecord = top5[0] ? { value: top5[0].score, name: top5[0].name } : null
  const icon = category === 'population' ? 'population.png' : 'area.png'
  const subtitle = category === 'population' ? 'Which country has more people?' : 'Which country has more area?'

  if (phase === 'rules') return (
    <GameRulesScreen icon={icon} title="Higher or Lower" subtitle={subtitle} worldRecord={worldRecord} myBest={myBest !== null ? myBest+' correct' : null} top5={top5} onPlay={startGame} />
  )

  if (phase === 'result') return (
    <GameResultScreen result={level+' correct'} resultColor={level >= 20 ? '#00C853' : level >= 10 ? GOLD : RED} background={level >= 20 ? '#0D3320' : level >= 10 ? '#2D1A00' : '#1A0000'} worldRank={worldRank} hasProfile={!!profile?.name} onBack={() => { setPhase('rules'); loadData() }} onPlayAgain={startGame} />
  )

  return (
    <main style={{ height:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0 }}>
        <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{level}</div>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2 }}>{category === 'population' ? 'POPULATION' : 'AREA'}</div>
        <div style={{ width:40 }} />
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* TOP — fixed reference */}
        <div style={{ flex:1, background:'#252525', margin:'0 16px 6px', borderRadius:16, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, padding:16 }}>
          {top && (
            <>
              <img src={'https://flagcdn.com/w160/'+top.code+'.png'} style={{ width:110, height:'auto', borderRadius:6, boxShadow:'0 2px 8px rgba(0,0,0,0.4)' }} />
              <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>{top.name}</div>
              <div style={{ fontSize:16, fontWeight:800, color:GOLD }}>{formatValue(valTop, category)}</div>
            </>
          )}
        </div>

        {/* Divider with HIGHER/LOWER buttons */}
        <div style={{ display:'flex', gap:10, padding:'0 16px', flexShrink:0 }}>
          <button onClick={() => handleAnswer('higher')} disabled={!!feedback}
            style={{ flex:1, padding:'14px', borderRadius:12, border:'none', background: feedback ? (valBottom >= valTop ? GREEN : RED) : GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor: feedback ? 'default' : 'pointer', boxShadow: feedback ? 'none' : '0 5px 0 #1B5E20', transition:'all 0.3s' }}>
            ↑ Higher
          </button>
          <button onClick={() => handleAnswer('lower')} disabled={!!feedback}
            style={{ flex:1, padding:'14px', borderRadius:12, border:'none', background: feedback ? (valBottom < valTop ? GREEN : RED) : RED, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor: feedback ? 'default' : 'pointer', boxShadow: feedback ? 'none' : '0 5px 0 #B71C1C', transition:'all 0.3s' }}>
            ↓ Lower
          </button>
        </div>

        {/* BOTTOM — mystery country */}
        <div style={{ flex:1, background:'#252525', margin:'6px 16px 80px', borderRadius:16, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, padding:16, border: feedback === 'correct' ? '2px solid '+GREEN : feedback === 'wrong' ? '2px solid '+RED : '2px solid transparent', transition:'all 0.3s' }}>
          {bottom && (
            <>
              <img src={'https://flagcdn.com/w160/'+bottom.code+'.png'} style={{ width:110, height:'auto', borderRadius:6, boxShadow:'0 2px 8px rgba(0,0,0,0.4)' }} />
              <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>{bottom.name}</div>
              {revealed
                ? <div style={{ fontSize:16, fontWeight:800, color:GOLD }}>{formatValue(valBottom, category)}</div>
                : <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.3)' }}>???</div>
              }
            </>
          )}
        </div>
      </div>
    </main>
  )
}
