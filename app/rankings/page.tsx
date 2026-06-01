'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const CATEGORIES = [
 {
   label: 'Agility',
   games: [
     { label: 'Stop', icon: 'precision.png', table: 'precision_scores', field: 'difference_ms', filter: { game_type: null }, lower: true, unit: 'ms' },
     { label: 'F1 Reaction', icon: 'f1.png', table: 'precision_scores', field: 'difference_ms', filter: { game_type: 'formula1' }, lower: true, unit: 'ms' },
     { label: 'Pendulum', icon: 'pendulum.png', table: 'precision_scores', field: 'difference_ms', filter: { game_type: 'pendulum' }, lower: true, unit: '°' },
     { label: 'Ace', icon: 'padel.png', table: 'ace_scores', field: 'level', filter: null, lower: false, unit: ' aces' },
     { label: 'Letter Rain', icon: 'rain.png', table: 'letter_rain_scores', field: 'level', filter: null, lower: false, unit: '' },
     { label: 'TypeDrop', icon: 'type.png', table: 'typedrop_scores', field: 'score', filter: null, lower: false, unit: ' words' },
   ]
 },
 {
   label: 'Memory',
   games: [
     { label: 'Digits', icon: 'digits.png', table: 'number_scores', field: 'level', filter: null, lower: false, unit: ' digits' },
     { label: 'Simon Says', icon: 'sequence.png', table: 'sequence_scores', field: 'level', filter: null, lower: false, unit: '' },
     { label: 'N-Back', icon: 'nback.png', table: 'nback_scores', field: 'level', filter: null, lower: false, unit: '' },
     { label: 'Blink', icon: 'blink.png', table: 'blink_scores', field: 'level', filter: null, lower: false, unit: '' },
     { label: 'Poke', icon: 'salmon.png', table: 'poke_scores', field: 'level', filter: null, lower: false, unit: '' },
   ]
 },
 {
   label: 'Knowledge',
   games: [
     { label: 'Flags', icon: 'flags.png', table: 'flag_scores', field: 'level', filter: null, lower: false, unit: '' },
     { label: 'Capitals', icon: 'capitals.png', table: 'capitals_scores', field: 'level', filter: null, lower: false, unit: '' },
     { label: 'Countries', icon: 'mapamundi.png', table: 'shape_scores', field: 'level', filter: null, lower: false, unit: '' },
     { label: 'Higher or Lower Pop', icon: 'population.png', table: 'higher_lower_scores', field: 'level', filter: { category: 'population' }, lower: false, unit: '' },
     { label: 'Higher or Lower Area', icon: 'population.png', table: 'higher_lower_scores', field: 'level', filter: { category: 'area' }, lower: false, unit: '' },
   ]
 },
 {
   label: 'Logic',
   games: [
     { label: 'Sudoku', icon: 'sudoku.png', table: 'sudoku_scores', field: 'time_ms', filter: null, lower: true, unit: 'mm:ss' },
     { label: 'Mastermind', icon: 'mastermind.png', table: 'mastermind_scores', field: 'attempts', filter: null, lower: true, unit: ' tries' },
     { label: 'Wordly', icon: 'wordly.png', table: 'wordle_scores', field: 'attempts', filter: null, lower: true, unit: ' tries' },
     { label: '2048', icon: '2048.png', table: 'game2048_scores', field: 'score', filter: null, lower: false, unit: '' },
     { label: 'Blackjack', icon: 'blackjack.png', table: 'blackjack_scores', field: 'chips', filter: null, lower: false, unit: ' chips' },
     { label: 'Tetris', icon: 'mango.png', table: 'tetris_scores', field: 'score', filter: null, lower: false, unit: '' },
   ]
 },
]

type Game = typeof CATEGORIES[0]['games'][0]

function GameLeaderboard({ game }: { game: Game }) {
 const [data, setData] = useState<any[]>([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
   const fetch = async () => {
     let q: any = supabase.from(game.table).select(`player_name, ${game.field}`)
     if (game.filter) Object.entries(game.filter).forEach(([k,v]) => { if (v === null) q = q.is(k, null); else q = q.eq(k, v) })
     q = q.order(game.field, { ascending: game.lower }).limit(500)
     const { data: rows } = await q
     if (!rows) { setLoading(false); return }
     const best: Record<string,number> = {}
     rows.forEach((s:any) => {
       const val = s[game.field]
       if (!best[s.player_name] || (game.lower ? val < best[s.player_name] : val > best[s.player_name])) best[s.player_name] = val
     })
     const sorted = Object.entries(best).sort((a,b) => game.lower ? (a[1] as number)-(b[1] as number) : (b[1] as number)-(a[1] as number)).slice(0,10)
     setData(sorted.map(([name,score]) => ({ name, score })))
     setLoading(false)
   }
   fetch()
 }, [])

 if (loading) return <div style={{ padding:'12px 16px', color:'rgba(255,255,255,0.3)', fontSize:13 }}>Loading...</div>

 return (
   <div>
     {data.map((p, i) => (
       <div key={p.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
         <div style={{ fontSize:13, fontWeight:900, color:i===0?GOLD:i===1?'#aaa':i===2?'#cd7f32':'rgba(255,255,255,0.3)', width:28, textAlign:'center' }}>
           {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
         </div>
         <div style={{ flex:1, fontSize:14, fontWeight:800, color:i<3?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
         <div style={{ fontSize:13, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.4)' }}>{ game.unit === 'mm:ss' ? `${Math.floor(p.score/60000)}:${String(Math.floor((p.score%60000)/1000)).padStart(2,"0")}` : `${p.score}${game.unit}` }</div>
       </div>
     ))}
     {data.length === 0 && <div style={{ padding:'12px 16px', color:'rgba(255,255,255,0.3)', fontSize:13 }}>No scores yet</div>}
   </div>
 )
}

function CategorySection({ category }: { category: typeof CATEGORIES[0] }) {
 const [openGame, setOpenGame] = useState<string|null>(null)

 return (
   <div style={{ background:'#252525', borderRadius:16, overflow:'hidden', marginBottom:12 }}>
     <div style={{ padding:'14px 16px', fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
       {category.label}
     </div>
     {category.games.map(game => (
       <div key={game.label}>
         <div onClick={() => setOpenGame(openGame === game.label ? null : game.label)}
           style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer' }}>
           <img src={`${BASE}/${game.icon}`} style={{ width:32, height:32, objectFit:'contain' }} />
           <div style={{ flex:1, fontSize:15, fontWeight:800, color:'#fff' }}>{game.label}</div>
           <div style={{ fontSize:14, color:'rgba(255,255,255,0.3)' }}>{openGame === game.label ? '▲' : '▼'}</div>
         </div>
         {openGame === game.label && <GameLeaderboard game={game} />}
       </div>
     ))}
   </div>
 )
}

export default function RankingsPage() {
 return (
   <main style={{ minHeight:'100dvh', background:'#1A1A1A', fontFamily:'var(--font-nunito),sans-serif', padding:'16px 16px 100px' }}>
     <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:16 }}>Rankings</div>
     {CATEGORIES.map(cat => <CategorySection key={cat.label} category={cat} />)}
   </main>
 )
}
