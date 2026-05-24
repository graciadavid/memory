'use client'
import { useState, useEffect } from 'react'
import ProfileSEO from './ProfileSEO'
import AuthModal from '@/components/AuthModal'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

function pctValue(pct: string): number {
  if (pct === 'Top 1%') return 99
  if (pct === 'Top 5%') return 95
  if (pct === 'Top 10%') return 90
  if (pct === 'Top 25%') return 75
  if (pct === 'Top 50%') return 50
  return 0
}

function catScore(keys: string[], percentiles: any): string {
  const vals = keys.map(k => percentiles[k]).filter(Boolean).map(pctValue)
  if (vals.length === 0) return ''
  const avg = Math.round(vals.reduce((a,b) => a+b, 0) / vals.length)
  if (avg >= 90) return 'Top 10%'
  if (avg >= 75) return 'Top 25%'
  if (avg >= 50) return 'Top 50%'
  return ''
}

function topPct(rank: number, total: number): string {
 if (!rank || !total) return ''
 const pct = Math.ceil((rank / total) * 100)
 if (pct <= 1) return 'Top 1%'
 if (pct <= 5) return 'Top 5%'
 if (pct <= 10) return 'Top 10%'
 if (pct <= 25) return 'Top 25%'
 if (pct <= 50) return 'Top 50%'
 return ''
}

function pctColor(pct: string): string {
 if (pct === 'Top 1%' || pct === 'Top 5%' || pct === 'Top 10%') return '#4CAF50'
 if (pct === 'Top 25%') return '#C8960C'
 if (pct === 'Top 50%') return '#FF5252'
 return 'rgba(255,255,255,0.3)'
}


function ProfileLoginButton() {
  const [show, setShow] = useState(false)
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:8 }}>Your Profile</div>
      <div style={{ fontSize:14, color:"rgba(255,255,255,0.4)", fontWeight:700, marginBottom:24 }}>Track your scores and rankings</div>
      <button onClick={() => setShow(true)} style={{ padding:"14px 32px", borderRadius:16, border:"none", background:"#2E7D32", color:"#fff", fontSize:16, fontWeight:900, fontFamily:"var(--font-nunito), sans-serif", cursor:"pointer" }}>
        Login / Register
      </button>
      {show && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <AuthModal onSuccess={() => window.location.reload()} title="Login or Register" subtitle="Enter your name and 4-digit PIN" onSkip={() => setShow(false)} />
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
 const { profile, loaded } = usePlayer()
 const [records, setRecords] = useState<any>({})
 const [percentiles, setPercentiles] = useState<any>({})
 const [streak, setStreak] = useState<number>(0)
  const [overallScore, setOverallScore] = useState<number>(0)
 const [editing, setEditing] = useState(false)
 const [newName, setNewName] = useState('')
 const [pin, setPin] = useState(['','','',''])
 const [currentPin, setCurrentPin] = useState(['','','',''])
 const [editMode, setEditMode] = useState<'name'|'pin'|null>(null)
 const [editError, setEditError] = useState('')
 const [editSuccess, setEditSuccess] = useState('')
 const [saving, setSaving] = useState(false)

 useEffect(() => {
   if (!profile?.name) return
   fetchRecords(profile.name)
   supabase.from('profiles').select('streak').eq('player_name', profile.name).single().then(({data}:any) => {
     if (data?.streak) setStreak(data.streak)
   })
 }, [profile?.name])

 const fetchRecords = async (name: string) => {
   const r: any = {}
   const p: any = {}

   // Fetch best scores and total counts in parallel
   const [
     mem, stop, f1, pendulum, ace, flags, vPop, countries, vArea,
     digits, seq, nback, sudoku, master, g2048, wordly, letterRain, capitals, blink, blackjack,
     // Totals
     memTotal, stopTotal, f1Total, pendulumTotal, aceTotal, flagsTotal,
     vPopTotal, countriesTotal, vAreaTotal, digitsTotal, seqTotal, nbackTotal,
     sudokuTotal, masterTotal, g2048Total, wordlyTotal, letterRainTotal, capitalsTotal, blinkTotal, blackjackTotal,
     // Ranks (how many are better)
   ] = await Promise.all([
     // Best scores
     supabase.from('scores').select('time_ms').eq('player_name', name).order('time_ms', { ascending: true }).limit(1),
     supabase.from('precision_scores').select('difference_ms').is('game_type', null).eq('player_name', name).order('difference_ms', { ascending: true }).limit(1),
     supabase.from('precision_scores').select('difference_ms').eq('game_type', 'formula1').eq('player_name', name).order('difference_ms', { ascending: true }).limit(1),
     supabase.from('precision_scores').select('difference_ms').eq('game_type', 'pendulum').eq('player_name', name).order('difference_ms', { ascending: true }).limit(1),
     supabase.from('ace_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
     supabase.from('flag_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
     supabase.from('higher_lower_scores').select('level').eq('category', 'population').eq('player_name', name).order('level', { ascending: false }).limit(1),
     supabase.from('shape_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
     supabase.from('higher_lower_scores').select('level').eq('category', 'area').eq('player_name', name).order('level', { ascending: false }).limit(1),
     supabase.from('number_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
     supabase.from('sequence_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
     supabase.from('nback_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
     supabase.from('sudoku_scores').select('time_ms').eq('player_name', name).order('time_ms', { ascending: true }).limit(1),
     supabase.from('mastermind_scores').select('attempts,time_ms').eq('player_name', name).order('attempts', { ascending: true }).order('time_ms', { ascending: true }).limit(1),
     supabase.from('game2048_scores').select('score').eq('player_name', name).order('score', { ascending: false }).limit(1),
     supabase.from('wordle_scores').select('attempts').eq('player_name', name).order('attempts', { ascending: true }).limit(1),
     supabase.from('letter_rain_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
     supabase.from('capitals_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
     supabase.from('blink_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
     supabase.from('blackjack_scores').select('chips').eq('player_name', name).order('chips', { ascending: false }).limit(1),
     // Total unique players per game
     supabase.from('scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('precision_scores').select('player_name', { count: 'exact', head: true }).is('game_type', null),
     supabase.from('precision_scores').select('player_name', { count: 'exact', head: true }).eq('game_type', 'formula1'),
     supabase.from('precision_scores').select('player_name', { count: 'exact', head: true }).eq('game_type', 'pendulum'),
     supabase.from('ace_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('flag_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('higher_lower_scores').select('player_name', { count: 'exact', head: true }).eq('category', 'population'),
     supabase.from('shape_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('higher_lower_scores').select('player_name', { count: 'exact', head: true }).eq('category', 'area'),
     supabase.from('number_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('sequence_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('nback_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('sudoku_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('mastermind_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('game2048_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('wordle_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('letter_rain_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('capitals_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('blink_scores').select('player_name', { count: 'exact', head: true }),
     supabase.from('blackjack_scores').select('player_name', { count: 'exact', head: true }),
   ])

   const fmt = (ms: number) => `${Math.floor(ms/60000)}:${String(Math.floor((ms%60000)/1000)).padStart(2,'0')}`

   // Records
   if (mem.data?.[0]) r.memory = fmt(mem.data[0].time_ms)
   if (stop.data?.[0]) r.stop = `${(stop.data[0].difference_ms/1000).toFixed(3)}s`
   if (f1.data?.[0]) r.f1 = `${f1.data[0].difference_ms}ms`
   if (pendulum.data?.[0]) r.pendulum = `${(pendulum.data[0].difference_ms/10).toFixed(1)}°`
   if (ace.data?.[0]) r.ace = `${ace.data[0].level} aces`
   if (flags.data?.[0]) r.flags = `${flags.data[0].level} flags`
   if (vPop.data?.[0]) r.versusPop = `${vPop.data[0].level} streak`
   if (countries.data?.[0]) r.countries = `${countries.data[0].level} correct`
   if (vArea.data?.[0]) r.versusArea = `${vArea.data[0].level} streak`
   if (digits.data?.[0]) r.digits = `Level ${digits.data[0].level}`
   if (seq.data?.[0]) r.sequence = `Level ${seq.data[0].level}`
   if (nback.data?.[0]) r.nback = `Level ${nback.data[0].level}`
   if (sudoku.data?.[0]) r.sudoku = fmt(sudoku.data[0].time_ms)
   if (master.data?.[0]) r.mastermind = `${master.data[0].attempts} tries · ${fmt(master.data[0].time_ms)}`
   if (g2048.data?.[0]) r.game2048 = `${g2048.data[0].score} pts`
   if (wordly.data?.[0]) r.wordly = `${wordly.data[0].attempts} tries`
   if (letterRain.data?.[0]) r.letterRain = `Letter ${String.fromCharCode(64 + letterRain.data[0].level)}`
   if (capitals.data?.[0]) r.capitals = `${capitals.data[0].level} correct`
   if (blink.data?.[0]) r.blink = `Level ${blink.data[0].level}`
   if (blackjack.data?.[0]) r.blackjack = `${blackjack.data[0].chips.toLocaleString()} chips`

   setRecords(r)

   // Now calculate percentiles - fetch ranks in parallel
   const rankQueries = await Promise.all([
     mem.data?.[0] ? supabase.from('scores').select('player_name', {count:'exact',head:true}).lt('time_ms', mem.data[0].time_ms) : Promise.resolve({count:0}),
     stop.data?.[0] ? supabase.from('precision_scores').select('player_name', {count:'exact',head:true}).is('game_type',null).lt('difference_ms', stop.data[0].difference_ms) : Promise.resolve({count:0}),
     f1.data?.[0] ? supabase.from('precision_scores').select('player_name', {count:'exact',head:true}).eq('game_type','formula1').lt('difference_ms', f1.data[0].difference_ms) : Promise.resolve({count:0}),
     pendulum.data?.[0] ? supabase.from('precision_scores').select('player_name', {count:'exact',head:true}).eq('game_type','pendulum').lt('difference_ms', pendulum.data[0].difference_ms) : Promise.resolve({count:0}),
     ace.data?.[0] ? supabase.from('ace_scores').select('player_name', {count:'exact',head:true}).gt('level', ace.data[0].level) : Promise.resolve({count:0}),
     flags.data?.[0] ? supabase.from('flag_scores').select('player_name', {count:'exact',head:true}).gt('level', flags.data[0].level) : Promise.resolve({count:0}),
     vPop.data?.[0] ? supabase.from('higher_lower_scores').select('player_name', {count:'exact',head:true}).eq('category','population').gt('level', vPop.data[0].level) : Promise.resolve({count:0}),
     countries.data?.[0] ? supabase.from('shape_scores').select('player_name', {count:'exact',head:true}).gt('level', countries.data[0].level) : Promise.resolve({count:0}),
     vArea.data?.[0] ? supabase.from('higher_lower_scores').select('player_name', {count:'exact',head:true}).eq('category','area').gt('level', vArea.data[0].level) : Promise.resolve({count:0}),
     digits.data?.[0] ? supabase.from('number_scores').select('player_name', {count:'exact',head:true}).gt('level', digits.data[0].level) : Promise.resolve({count:0}),
     seq.data?.[0] ? supabase.from('sequence_scores').select('player_name', {count:'exact',head:true}).gt('level', seq.data[0].level) : Promise.resolve({count:0}),
     nback.data?.[0] ? supabase.from('nback_scores').select('player_name', {count:'exact',head:true}).gt('level', nback.data[0].level) : Promise.resolve({count:0}),
     sudoku.data?.[0] ? supabase.from('sudoku_scores').select('player_name', {count:'exact',head:true}).lt('time_ms', sudoku.data[0].time_ms) : Promise.resolve({count:0}),
     master.data?.[0] ? supabase.from('mastermind_scores').select('player_name', {count:'exact',head:true}).lt('attempts', master.data[0].attempts) : Promise.resolve({count:0}),
     g2048.data?.[0] ? supabase.from('game2048_scores').select('player_name', {count:'exact',head:true}).gt('score', g2048.data[0].score) : Promise.resolve({count:0}),
     wordly.data?.[0] ? supabase.from('wordle_scores').select('player_name', {count:'exact',head:true}).lt('attempts', wordly.data[0].attempts) : Promise.resolve({count:0}),
     letterRain.data?.[0] ? supabase.from('letter_rain_scores').select('player_name', {count:'exact',head:true}).gt('level', letterRain.data[0].level) : Promise.resolve({count:0}),
     capitals.data?.[0] ? supabase.from('capitals_scores').select('player_name', {count:'exact',head:true}).gt('level', capitals.data[0].level) : Promise.resolve({count:0}),
     blink.data?.[0] ? supabase.from('blink_scores').select('player_name', {count:'exact',head:true}).gt('level', blink.data[0].level) : Promise.resolve({count:0}),
     blackjack.data?.[0] ? supabase.from('blackjack_scores').select('player_name', {count:'exact',head:true}).gt('chips', blackjack.data[0].chips) : Promise.resolve({count:0}),
   ])

   const totals = [memTotal,stopTotal,f1Total,pendulumTotal,aceTotal,flagsTotal,vPopTotal,countriesTotal,vAreaTotal,digitsTotal,seqTotal,nbackTotal,sudokuTotal,masterTotal,g2048Total,wordlyTotal,letterRainTotal,capitalsTotal,blinkTotal,blackjackTotal]
   const keys = ['memory','stop','f1','pendulum','ace','flags','versusPop','countries','versusArea','digits','sequence','nback','sudoku','mastermind','game2048','wordly','letterRain','capitals','blink','blackjack']

   const newPercentiles: any = {}
   rankQueries.forEach((rank: any, i) => {
     const better = rank.count ?? 0
     const total = totals[i].count ?? 0
     if (total > 0 && r[keys[i]]) {
       newPercentiles[keys[i]] = topPct(better + 1, total)
     }
   })

   setPercentiles(newPercentiles)

    const pctValues = Object.values(newPercentiles).map((p:any) => {
      if (p === 'Top 1%') return 99
      if (p === 'Top 5%') return 95
      if (p === 'Top 10%') return 90
      if (p === 'Top 25%') return 75
      if (p === 'Top 50%') return 50
      return 0
    })
    if (pctValues.length > 0) {
      const avg = Math.round((pctValues as number[]).reduce((a,b) => a+b, 0) / pctValues.length)
      setOverallScore(avg)
    }
 }

 const savePin = async () => {
   if (pin.join('').length !== 4) return
   setSaving(true); setEditError('')
   const {data:prof} = await supabase.from('profiles').select('password_hash').eq('player_name', profile!.name).single()
   if (prof?.password_hash !== btoa(currentPin.join(''))) { setEditError('Current PIN is wrong'); setSaving(false); return }
   await supabase.from('profiles').update({ password_hash: btoa(pin.join('')) }).eq('player_name', profile!.name)
   setSaving(false); setEditSuccess('PIN updated!'); setEditMode(null)
   setPin(['','','','']); setCurrentPin(['','','',''])
 }

 const saveName = async () => {
   if (!newName.trim()) return
   setSaving(true); setEditError('')
   const {data:existing} = await supabase.from('profiles').select('player_name').eq('player_name', newName.trim()).limit(1)
   if (existing && existing.length > 0) { setEditError('Name already taken'); setSaving(false); return }
   await supabase.from('profiles').update({ player_name: newName.trim() }).eq('player_name', profile!.name)
   localStorage.setItem('memgenius_profile', JSON.stringify({name: newName.trim()}))
   setSaving(false); window.location.reload()
 }

 if (!loaded) return <main style={{ minHeight:'100dvh', background:'#1C1C1E' }} />

  if (!profile?.name) return (
    <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <ProfileLoginButton />
    </main>
  )

 const CATS = [
   { label: 'Memory', color: '#C62828', icon: `${BASE}/brain-logo.webp`, games: [
     { label: 'Memory', key: 'memory' },
     { label: 'Digits', key: 'digits' },
     { label: 'Simon Says', key: 'sequence' },
     { label: 'N-Back', key: 'nback' },
     { label: 'Blink', key: 'blink' },
   ]},
   { label: 'Agility', color: '#F9A825', icon: `${BASE}/precision.png`, games: [
     { label: 'Stop', key: 'stop' },
     { label: 'F1 Reaction', key: 'f1' },
     { label: 'Pendulum', key: 'pendulum' },
     { label: 'Ace', key: 'ace' },
     { label: 'Letter Rain', key: 'letterRain' },
   ]},
   { label: 'Knowledge', color: '#00796B', icon: `${BASE}/population.png`, games: [
     { label: 'Flags', key: 'flags' },
     { label: 'Higher or Lower Pop', key: 'versusPop' },
     { label: 'Higher or Lower Area', key: 'versusArea' },
     { label: 'Countries', key: 'countries' },
     { label: 'Capitals', key: 'capitals' },
   ]},
   { label: 'Logic', color: '#E65100', icon: `${BASE}/target.png`, games: [
     { label: 'Sudoku', key: 'sudoku' },
     { label: 'Mastermind', key: 'mastermind' },
     { label: '2048', key: 'game2048' },
     { label: 'Wordly', key: 'wordly' },
     { label: 'Blackjack', key: 'blackjack' },
   ]},
 ]

 return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', paddingBottom:100 }}>

     {/* Header Card */}
    <div style={{ padding:'24px 20px 0' }}>
      <div style={{ background:'linear-gradient(135deg, #2A2A2E 0%, #1C1C1E 100%)', borderRadius:24, padding:'24px', border:'1px solid rgba(255,255,255,0.08)', marginBottom:24 }}>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>Player</div>
          <div style={{ fontSize:26, fontWeight:900, color:'#fff', lineHeight:1, marginBottom:10 }}>{profile?.name ?? 'Guest'}</div>
          <button onClick={() => { setEditing(!editing); setEditMode(null); setEditError(''); setEditSuccess('') }} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:'6px 14px', color:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>
            {editing ? 'Done' : 'Edit Profile'}
          </button>
        </div>
        {overallScore > 0 && (
          <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:16, padding:'16px', marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:10 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>Brain Score</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>Based on your global percentiles</div>
              </div>
              <div style={{ fontSize:48, fontWeight:900, lineHeight:1, color: overallScore >= 75 ? '#69F0AE' : overallScore >= 25 ? '#C8960C' : '#FF5252' }}>{overallScore}</div>
            </div>
            <div style={{ height:8, background:'rgba(255,255,255,0.08)', borderRadius:4, overflow:'hidden' }}>
              <div style={{ height:'100%', width:String(overallScore)+'%', background: overallScore >= 75 ? '#4CAF50' : overallScore >= 25 ? '#C8960C' : '#FF5252', borderRadius:4 }} />
            </div>
          </div>
        )}
        <a href="/streak" style={{ textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,109,0,0.08)', border:'1px solid rgba(255,109,0,0.2)', borderRadius:12, padding:'10px 14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/streak.png" style={{ width:20, height:20, objectFit:'contain' }} />
            <span style={{ fontSize:13, fontWeight:800, color:'#FF6D00' }}>{streak > 0 ? streak + ' day streak' : 'Start your streak'}</span>
          </div>
          <span style={{ fontSize:11, fontWeight:800, color:'rgba(255,109,0,0.5)' }}>Levels →</span>
        </a>
      </div>
    </div>

     <div style={{ padding:'0 20px' }}>
       {/* Edit panel */}
       {editing && (
         <div style={{ marginTop:20, background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'16px', border:'1px solid rgba(255,255,255,0.08)' }}>
           {editSuccess && <div style={{ fontSize:13, color:'#69F0AE', fontWeight:800, marginBottom:12 }}>✓ {editSuccess}</div>}
           <div style={{ display:'flex', gap:10, marginBottom: editMode ? 16 : 0 }}>
             <button onClick={() => { setEditMode(editMode==='name'?null:'name'); setEditError('') }} style={{ flex:1, padding:'10px', borderRadius:12, border:`1px solid ${editMode==='name'?GOLD:'rgba(255,255,255,0.1)'}`, background: editMode==='name'?'rgba(200,150,12,0.1)':'transparent', color: editMode==='name'?GOLD:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>
               Change Name
             </button>
             <button onClick={() => { setEditMode(editMode==='pin'?null:'pin'); setEditError('') }} style={{ flex:1, padding:'10px', borderRadius:12, border:`1px solid ${editMode==='pin'?GOLD:'rgba(255,255,255,0.1)'}`, background: editMode==='pin'?'rgba(200,150,12,0.1)':'transparent', color: editMode==='pin'?GOLD:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>
               Change PIN
             </button>
           </div>

           {editMode === 'name' && (
             <div>
               <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="New name" style={{ width:'100%', padding:'10px', borderRadius:10, border:'none', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14, fontWeight:800, fontFamily:'inherit', outline:'none', marginBottom:10, boxSizing:'border-box' }} />
               {editError && <div style={{ fontSize:12, color:'#FF5252', fontWeight:800, marginBottom:8 }}>{editError}</div>}
               <button onClick={saveName} disabled={!newName.trim()||saving} style={{ width:'100%', padding:'10px', borderRadius:10, border:'none', background:GREEN, color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>{saving?'Saving...':'Save Name'}</button>
             </div>
           )}

           {editMode === 'pin' && (
             <div>
               <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:6 }}>Current PIN</div>
               <div style={{ display:'flex', gap:6, marginBottom:12 }}>
                 {currentPin.map((d,i) => (
                   <input key={i} id={`cpin-${i}`} type="tel" maxLength={1} value={d}
                     onChange={e=>{const v=e.target.value.replace(/\D/,'');const p=[...currentPin];p[i]=v;setCurrentPin(p);if(v&&i<3)(document.getElementById(`cpin-${i+1}`) as HTMLInputElement)?.focus()}}
                     style={{ width:44, height:48, textAlign:'center', fontSize:22, fontWeight:900, borderRadius:10, border:'2px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.08)', color:'#fff', fontFamily:'inherit', outline:'none' }} />
                 ))}
               </div>
               <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:6 }}>New PIN</div>
               <div style={{ display:'flex', gap:6, marginBottom:12 }}>
                 {pin.map((d,i) => (
                   <input key={i} id={`npin-${i}`} type="tel" maxLength={1} value={d}
                     onChange={e=>{const v=e.target.value.replace(/\D/,'');const p=[...pin];p[i]=v;setPin(p);if(v&&i<3)(document.getElementById(`npin-${i+1}`) as HTMLInputElement)?.focus()}}
                     style={{ width:44, height:48, textAlign:'center', fontSize:22, fontWeight:900, borderRadius:10, border:'2px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.08)', color:'#fff', fontFamily:'inherit', outline:'none' }} />
                 ))}
               </div>
               {editError && <div style={{ fontSize:12, color:'#FF5252', fontWeight:800, marginBottom:8 }}>{editError}</div>}
               <button onClick={savePin} disabled={pin.join('').length!==4||currentPin.join('').length!==4||saving} style={{ width:'100%', padding:'10px', borderRadius:10, border:'none', background:GREEN, color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>{saving?'Saving...':'Save PIN'}</button>
             </div>
           )}
         </div>
       )}
     </div>

     {/* Records */}
     <div style={{ padding:'0 20px' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase', marginBottom:20 }}>Personal Records</div>
       {CATS.map(cat => (
         <div key={cat.label} style={{ marginBottom:24 }}>
           <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
             <img src={cat.icon} style={{ width:20, height:20, objectFit:'contain' }} />
             <div style={{ fontSize:12, fontWeight:900, color:cat.color, letterSpacing:1, textTransform:'uppercase' }}>{cat.label}</div>
           </div>
           <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
             {cat.games.map(g => (
               <div key={g.key} style={{ background:'rgba(255,255,255,0.04)', borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', border:'1px solid rgba(255,255,255,0.06)' }}>
                 <div style={{ fontSize:14, fontWeight:800, color:'rgba(255,255,255,0.6)' }}>{g.label}</div>
                 <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                   <div style={{ fontSize:14, fontWeight:900, color: records[g.key] ? '#fff' : 'rgba(255,255,255,0.2)' }}>{records[g.key] ?? '—'}</div>
                   {percentiles[g.key] && (
                     <div style={{ fontSize:10, fontWeight:900, color: pctColor(percentiles[g.key]), background:`${pctColor(percentiles[g.key])}18`, padding:'2px 8px', borderRadius:20, whiteSpace:'nowrap' }}>
                       {percentiles[g.key]}
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>
         </div>
       ))}
     </div>

      <ProfileSEO />
   </main>
 )
}
