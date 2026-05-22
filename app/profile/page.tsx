'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export default function ProfilePage() {
 const { profile, loaded } = usePlayer()
 const [pin, setPin] = useState(['', '', '', ''])
 const [editingPassword, setEditingPassword] = useState(false)
 const [passwordSaved, setPasswordSaved] = useState(false)
 const [records, setRecords] = useState<any>({})

 useEffect(() => {
   if (!profile?.name) return
   fetchRecords(profile.name)
 }, [profile?.name])

 const fetchRecords = async (name: string) => {
   const r: any = {}

   // Memory best
   const { data: mem } = await supabase.from('scores').select('time_ms').eq('player_name', name).order('time_ms', { ascending: true }).limit(1)
   if (mem?.[0]) r.memory = `${Math.floor(mem[0].time_ms/60000)}:${String(Math.floor((mem[0].time_ms%60000)/1000)).padStart(2,'0')}`

   // Stop best
   const { data: stop } = await supabase.from('precision_scores').select('difference_ms').is('game_type', null).eq('player_name', name).order('difference_ms', { ascending: true }).limit(1)
   if (stop?.[0]) r.stop = `${(stop[0].difference_ms/1000).toFixed(3)}s`

   // F1 best
   const { data: f1 } = await supabase.from('precision_scores').select('difference_ms').eq('game_type', 'formula1').eq('player_name', name).order('difference_ms', { ascending: true }).limit(1)
   if (f1?.[0]) r.f1 = `${f1[0].difference_ms}ms`

   // Flags best
   const { data: flags } = await supabase.from('flag_scores').select('score').eq('player_name', name).order('score', { ascending: false }).limit(1)
   if (flags?.[0]) r.flags = `${flags[0].score} pts`

   // Digits best
   const { data: digits } = await supabase.from('number_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1)
   if (digits?.[0]) r.digits = `Level ${digits[0].level}`

   // Sequence best
   const { data: seq } = await supabase.from('sequence_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1)
   if (seq?.[0]) r.sequence = `Level ${seq[0].level}`

   // Ace best
   const { data: ace } = await supabase.from('ace_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1)
   if (ace?.[0]) r.ace = `${ace[0].level} aces`

   // Sudoku best
   const { data: sudoku } = await supabase.from('sudoku_scores').select('time_ms').eq('player_name', name).order('time_ms', { ascending: true }).limit(1)
   if (sudoku?.[0]) r.sudoku = `${Math.floor(sudoku[0].time_ms/60000)}:${String(Math.floor((sudoku[0].time_ms%60000)/1000)).padStart(2,'0')}`


   // Pendulum best
   const { data: pendulum } = await supabase.from('precision_scores').select('difference_ms').eq('game_type', 'pendulum').eq('player_name', name).order('difference_ms', { ascending: true }).limit(1)
   if (pendulum?.[0]) r.pendulum = `${(pendulum[0].difference_ms/10).toFixed(1)}°`

   // N-Back best
   const { data: nback } = await supabase.from('nback_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1)
   if (nback?.[0]) r.nback = `Level ${nback[0].level}`

   // Versus Pop
   const { data: vPop } = await supabase.from('higher_lower_scores').select('score').eq('category', 'population').eq('player_name', name).order('score', { ascending: false }).limit(1)
   if (vPop?.[0]) r.versusPop = `${vPop[0].score} pts`

   // Versus Area
   const { data: vArea } = await supabase.from('higher_lower_scores').select('score').eq('category', 'area').eq('player_name', name).order('score', { ascending: false }).limit(1)
   if (vArea?.[0]) r.versusArea = `${vArea[0].score} pts`

   // Mastermind best
   const { data: master } = await supabase.from('mastermind_scores').select('time_ms').eq('player_name', name).order('time_ms', { ascending: true }).limit(1)
   if (master?.[0]) r.mastermind = `${Math.floor(master[0].time_ms/60000)}:${String(Math.floor((master[0].time_ms%60000)/1000)).padStart(2,'0')}`

   // 2048 best
   const { data: g2048 } = await supabase.from('game2048_scores').select('score').eq('player_name', name).order('score', { ascending: false }).limit(1)
   if (g2048?.[0]) r.game2048 = `${g2048[0].score} pts`

   // Wordly best
   const { data: wordly } = await supabase.from('wordle_scores').select('attempts').eq('player_name', name).order('attempts', { ascending: true }).limit(1)
   if (wordly?.[0]) r.wordly = `${wordly[0].attempts} tries`
   setRecords(r)
 }

 const savePin = async () => {
   if (!profile?.name) return
   const code = pin.join('')
   const hash = btoa(code)
   await supabase.from('profiles').upsert({ player_name: profile.name, password_hash: hash })
   setPasswordSaved(true)
   setEditingPassword(false)
 }

 if (!loaded) return null

 const CATS = [
   { label: 'Memory', color: '#C62828', games: [
     { label: 'Memory', value: records.memory },
     { label: 'Digits', value: records.digits },
     { label: 'Simon Says', value: records.sequence },
   ]},
   { label: 'Agility', color: '#4A148C', games: [
     { label: 'Stop', value: records.stop },
     { label: 'F1 Reaction', value: records.f1 },
     { label: 'Ace', value: records.ace },
   ]},
   { label: 'Knowledge', color: '#00796B', games: [
     { label: 'Flags', value: records.flags },
   ]},
   { label: 'Logic', color: '#E65100', games: [
     { label: 'Sudoku', value: records.sudoku },
   ]},
 ]

 return (
   <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 80 }}>

     {/* Header */}
     <div style={{ background: `linear-gradient(160deg, ${BROWN}, #2A1205)`, padding: '40px 24px 32px', textAlign: 'center' }}>
       <div style={{ width: 80, height: 80, borderRadius: '50%', background: GOLD, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, color: '#fff', boxShadow: `0 6px 0 ${GOLD}60` }}>
         {profile?.name?.[0]?.toUpperCase() ?? '?'}
       </div>
       <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{profile?.name ?? 'Guest'}</div>
       <button onClick={() => setEditingPassword(!editingPassword)} style={{ marginTop: 10, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '6px 14px', color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
         {editingPassword ? 'Cancel' : '🔑 PIN'}
       </button>

       {editingPassword && (
         <div style={{ marginTop: 16 }}>
           {passwordSaved && <div style={{ fontSize: 13, color: '#81C784', fontWeight: 800, marginBottom: 8 }}>✓ PIN saved!</div>}
           <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
             {pin.map((d, i) => (
               <input key={i} id={`pin-${i}`} type="tel" maxLength={1} value={d}
                 onChange={e => { const v = e.target.value.replace(/\D/,''); const p=[...pin]; p[i]=v; setPin(p); if(v && i<3) (document.getElementById(`pin-${i+1}`) as HTMLInputElement)?.focus() }}
                 style={{ width: 44, height: 52, textAlign: 'center', fontSize: 24, fontWeight: 900, borderRadius: 12, border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontFamily: 'inherit', outline: 'none' }} />
             ))}
           </div>
           <button onClick={savePin} disabled={pin.join('').length !== 4} style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: pin.join('').length === 4 ? GOLD : 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>Save PIN</button>
         </div>
       )}
     </div>

     {/* Records */}
     <div style={{ padding: '20px 16px' }}>
       <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Your Records</div>
       {CATS.map(cat => (
         <div key={cat.label} style={{ marginBottom: 16 }}>
           <div style={{ fontSize: 12, fontWeight: 900, color: cat.color, marginBottom: 8 }}>{cat.label}</div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
             {cat.games.map(g => (
               <div key={g.label} style={{ background: '#fff', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                 <div style={{ fontSize: 13, fontWeight: 800, color: BROWN }}>{g.label}</div>
                 <div style={{ fontSize: 13, fontWeight: 900, color: g.value ? cat.color : `${BROWN}25` }}>{g.value ?? '—'}</div>
               </div>
             ))}
           </div>
         </div>
       ))}
     </div>

   </main>
 )
}
