'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const GOLD = '#C8960C'
const GREEN = '#2E7D32'

export default function ProfilePage() {
 const { profile, loaded } = usePlayer()
 const [pin, setPin] = useState(['', '', '', ''])
 const [editingPin, setEditingPin] = useState(false)
 const [pinSaved, setPinSaved] = useState(false)
 const [records, setRecords] = useState<any>({})

 useEffect(() => {
   if (!profile?.name) return
   fetchRecords(profile.name)
 }, [profile?.name])

 const fetchRecords = async (name: string) => {
   const r: any = {}
   const [mem, stop, f1, pendulum, ace, flags, vPop, countries, vArea, digits, seq, nback, sudoku, master, g2048, wordly] = await Promise.all([
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
   ])
   const fmt = (ms: number) => `${Math.floor(ms/60000)}:${String(Math.floor((ms%60000)/1000)).padStart(2,'0')}`
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
   setRecords(r)
 }

 const savePin = async () => {
   if (!profile?.name || pin.join('').length !== 4) return
   await supabase.from('profiles').upsert({ player_name: profile.name, password_hash: btoa(pin.join('')) })
   setPinSaved(true)
   setEditingPin(false)
 }

 if (!loaded) return null

 const CATS = [
   { label: 'Memory', color: '#C62828', games: [
     { label: 'Memory', value: records.memory },
     { label: 'Digits', value: records.digits },
     { label: 'Simon Says', value: records.sequence },
     { label: 'N-Back', value: records.nback },
   ]},
   { label: 'Agility', color: '#4A148C', games: [
     { label: 'Stop', value: records.stop },
     { label: 'F1 Reaction', value: records.f1 },
     { label: 'Pendulum', value: records.pendulum },
     { label: 'Ace', value: records.ace },
   ]},
   { label: 'Knowledge', color: '#00796B', games: [
     { label: 'Flags', value: records.flags },
     { label: 'Higher or Lower Pop', value: records.versusPop },
     { label: 'Higher or Lower Area', value: records.versusArea },
     { label: 'Countries', value: records.countries },
   ]},
   { label: 'Logic', color: '#E65100', games: [
     { label: 'Sudoku', value: records.sudoku },
     { label: 'Mastermind', value: records.mastermind },
     { label: '2048', value: records.game2048 },
     { label: 'Wordly', value: records.wordly },
   ]},
 ]

 return (
   <main style={{ minHeight:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', paddingBottom:100 }}>

     {/* Header */}
     <div style={{ padding:'40px 24px 32px', textAlign:'center', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
       <div style={{ width:72, height:72, borderRadius:'50%', background:GOLD, margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:900, color:'#fff', boxShadow:`0 6px 0 ${GOLD}60` }}>
         {profile?.name?.[0]?.toUpperCase() ?? '?'}
       </div>
       <div style={{ fontSize:24, fontWeight:900, color:'#fff', marginBottom:8 }}>{profile?.name ?? 'Guest'}</div>
       <button onClick={() => setEditingPin(!editingPin)} style={{ background:'rgba(255,255,255,0.08)', border:'none', borderRadius:10, padding:'6px 14px', color:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>
         {editingPin ? 'Cancel' : '🔑 Change PIN'}
       </button>
       {editingPin && (
         <div style={{ marginTop:16 }}>
           {pinSaved && <div style={{ fontSize:13, color:'#69F0AE', fontWeight:800, marginBottom:8 }}>✓ PIN saved!</div>}
           <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:12 }}>
             {pin.map((d,i) => (
               <input key={i} id={`pin-${i}`} type="tel" maxLength={1} value={d}
                 onChange={e=>{const v=e.target.value.replace(/\D/,'');const p=[...pin];p[i]=v;setPin(p);if(v&&i<3)(document.getElementById(`pin-${i+1}`) as HTMLInputElement)?.focus()}}
                 style={{ width:44, height:52, textAlign:'center', fontSize:24, fontWeight:900, borderRadius:12, border:'2px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.08)', color:'#fff', fontFamily:'inherit', outline:'none' }} />
             ))}
           </div>
           <button onClick={savePin} disabled={pin.join('').length!==4} style={{ padding:'10px 24px', borderRadius:12, border:'none', background:pin.join('').length===4?GREEN:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>Save PIN</button>
         </div>
       )}
     </div>

     {/* Records */}
     <div style={{ padding:'24px 20px' }}>
       <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:20 }}>Your Records</div>
       {CATS.map(cat => (
         <div key={cat.label} style={{ marginBottom:20 }}>
           <div style={{ fontSize:12, fontWeight:900, color:cat.color, marginBottom:8, letterSpacing:0.5 }}>{cat.label}</div>
           <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
             {cat.games.map(g => (
               <div key={g.label} style={{ background:'rgba(255,255,255,0.05)', borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', border:'1px solid rgba(255,255,255,0.06)' }}>
                 <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.7)' }}>{g.label}</div>
                 <div style={{ fontSize:13, fontWeight:900, color:'#fff' }}>{g.value ?? '—'}</div>
               </div>
             ))}
           </div>
         </div>
       ))}
     </div>

   </main>
 )
}
