'use client'
import { useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const RED = '#C62828'

interface Props {
  easy: string | null
  medium: string | null
  hard: string | null
}

type View = 'rules' | 'categories'

export default function HomeClient({ easy, medium, hard }: Props) {
  const { profile, loaded } = usePlayer()
  const [view, setView] = useState<View>('rules')
  const [worldRecord, setWorldRecord] = useState<{time_ms:number,name:string}|null>(null)
  const [myBest, setMyBest] = useState<number|null>(null)
  const [top5, setTop5] = useState<{name:string,time_ms:number}[]>([])
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [pendingSlug, setPendingSlug] = useState<string|null>(null)
  const [showRegister, setShowRegister] = useState(false)
  const [packs, setPacks] = useState<{slug:string,name:string,difficulty:number}[]>([])

  useEffect(() => {
    if (profile?.name) setName(profile.name)
    loadData()
  }, [profile?.name])

  const loadData = async () => {
    const { data } = await supabase.from('scores').select('player_name,time_ms').order('time_ms', { ascending: true }).limit(5000)
    if (!data) return
    const best: Record<string,number> = {}
    data.forEach((s:any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
    const sorted = Object.entries(best).map(([n,t]) => ({name:n, time_ms:t as number})).sort((a,b) => a.time_ms-b.time_ms)
    setTop5(sorted.slice(0,5))
    if (sorted[0]) setWorldRecord({time_ms:sorted[0].time_ms, name:sorted[0].name})
    if (profile?.name && best[profile.name]) setMyBest(best[profile.name])
  }

  const loadPacks = async () => {
    const { data } = await supabase.from('packs').select('slug,title,difficulty,emoji').order('difficulty').order('title')
    if (data) setPacks(data.map((p:any) => ({...p, name: p.title})))
  }

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`
  }

  const handlePlay = (slug: string) => {
    if (profile?.name) {
      window.location.href = `/play/${slug}`
    } else {
      setPendingSlug(slug)
      setShowRegister(true)
    }
  }

  const handleRegister = async () => {
    if (!name.trim()) { setSaveError('Enter a name'); return }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { setSaveError('PIN must be 4 digits'); return }
    setSaving(true)
    const { data: existing } = await supabase.from('profiles').select('player_name').eq('player_name', name.trim()).limit(1)
    if (existing && existing.length > 0) { setSaveError('Name taken'); setSaving(false); return }
    await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: btoa(pin) })
    localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim() }))
    setSaving(false)
    setShowRegister(false)
    if (pendingSlug) window.location.href = `/play/${pendingSlug}`
  }

  if (!loaded) return null

  const LEVELS = [
    { slug: easy, label: 'Easy', color: GREEN },
    { slug: medium, label: 'Medium', color: '#E65100' },
    { slug: hard, label: 'Hard', color: RED },
  ]

  const diffLabel = (d: number) => d === 1 ? 'Easy' : d === 2 ? 'Medium' : 'Hard'
  const diffColor = (d: number) => d === 1 ? GREEN : d === 2 ? '#E65100' : RED

  // Register modal
  if (showRegister) return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px' }}>
      <div style={{ width:'100%', background:'rgba(255,255,255,0.06)', borderRadius:24, padding:'28px' }}>
        <div style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:4 }}>Create account</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:20 }}>To save your scores and compete worldwide</div>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:15, fontWeight:800, fontFamily:'inherit', outline:'none', marginBottom:12, boxSizing:'border-box' }} />
        <input value={pin} onChange={e=>setPin(e.target.value.replace(/\D/,'').slice(0,4))} placeholder="4-digit PIN" type="tel" maxLength={4} style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:15, fontWeight:800, fontFamily:'inherit', outline:'none', marginBottom:16, boxSizing:'border-box' }} />
        {saveError && <div style={{ fontSize:12, color:'#FF5252', fontWeight:800, marginBottom:10 }}>{saveError}</div>}
        <button onClick={handleRegister} disabled={saving} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', marginBottom:10 }}>
          {saving ? 'Saving...' : 'Play →'}
        </button>
        <button onClick={() => setShowRegister(false)} style={{ width:'100%', padding:'10px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)', fontSize:13, fontWeight:800, fontFamily:'inherit', cursor:'pointer' }}>Cancel</button>
      </div>
    </main>
  )

  // Categories view
  if (view === 'categories') return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <button onClick={() => setView('rules')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>Categories</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {packs.map(p => (
          <button key={p.slug} onClick={() => handlePlay(p.slug)} style={{ width:'100%', padding:'16px 20px', borderRadius:16, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', fontFamily:'inherit' }}>
            <div style={{ fontSize:15, fontWeight:800, color:'#fff', textAlign:'left' }}>{p.name}</div>
            <div style={{ fontSize:11, fontWeight:800, color:diffColor(p.difficulty), background:`${diffColor(p.difficulty)}20`, padding:'4px 10px', borderRadius:20 }}>{diffLabel(p.difficulty)}</div>
          </button>
        ))}
        {packs.length === 0 && <div style={{ fontSize:14, color:'rgba(255,255,255,0.3)', fontWeight:700, textAlign:'center', marginTop:40 }}>Loading...</div>}
      </div>
    </main>
  )

  // Rules view
  return (
    <main style={{ height:'100dvh', background:'#1C1C1E', fontFamily:'var(--font-nunito), sans-serif', maxWidth:430, margin:'0 auto', display:'flex', flexDirection:'column', padding:'24px 24px 100px', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <img src={`${BASE}/brain-logo.webp`} style={{ width:60, height:60, objectFit:'contain' }} />
        <div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>Memory</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:700 }}>Match pairs by connection</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:GOLD, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>World Record</div>
          <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{worldRecord ? fmt(worldRecord.time_ms) : '—'}</div>
          {worldRecord && <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, marginTop:2 }}>{worldRecord.name}</div>}
        </div>
        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:'14px', textAlign:'center' }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>Your Best</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{myBest ? fmt(myBest) : '—'}</div>
        </div>
      </div>

      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px', marginBottom:20 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Top Players</div>
        {top5.map((p,i) => (
          <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.25)', width:18 }}>{i+1}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:800, color:i===0?'#fff':'rgba(255,255,255,0.6)' }}>{p.name}</div>
            <div style={{ fontSize:14, fontWeight:900, color:i===0?GOLD:'rgba(255,255,255,0.5)' }}>{fmt(p.time_ms)}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap:10 }}>
       <div style={{ display:'flex', gap:10 }}>
         {LEVELS.map(l => l.slug && (
           <button key={l.label} onClick={() => handlePlay(l.slug!)} style={{ flex:1, padding:'16px 0', borderRadius:16, border:'none', background:l.color, color:'#fff', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:`0 6px 0 ${l.color}80` }}>
             {l.label}
           </button>
         ))}
       </div>
       <button onClick={() => { setView('categories'); loadPacks() }} style={{ width:'100%', padding:'14px', borderRadius:16, border:'1px solid rgba(255,255,255,0.15)', background:'transparent', color:'rgba(255,255,255,0.6)', fontSize:15, fontWeight:900, fontFamily:'inherit', cursor:'pointer' }}>
         Browse Categories →
       </button>
     </div>
   </main>
 )
}
