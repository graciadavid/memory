'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

function fmt(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const c = Math.floor((ms % 1000) / 10)
  return m > 0 ? `${m}:${String(s % 60).padStart(2,'0')}` : `${s}.${String(c).padStart(2,'0')}s`
}

export default function ProfilePage() {
  const { profile, loaded, save } = usePlayer()
  const [myGroups, setMyGroups] = useState<any[]>([])
  const [hasPassword, setHasPassword] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [nameError, setNameError] = useState('')
  const [nameSaving, setNameSaving] = useState(false)
  const [editingPassword, setEditingPassword] = useState(false)
  const [pin, setPin] = useState(['', '', '', ''])
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [groupsOpen, setGroupsOpen] = useState(false)
  const [records, setRecords] = useState<Record<string, any[]>>({ memory: [], agility: [], knowledge: [], logic: [] })
  const [openArea, setOpenArea] = useState<string | null>(null)

  useEffect(() => {
    if (!profile?.name) return

    supabase.from('brain_test_scores').select('score').eq('player_name', profile.name)
      .order('created_at', { ascending: false }).limit(1)
      .then(({ data }) => {
        if (data?.[0]) setBrainAge(Math.min(65, Math.max(18, Math.round(65 - (data[0].score / 1000) * 47))))
      })

    // Groups
    supabase.from('group_members').select('group_id, groups(id, name)').eq('player_name', profile.name)
      .then(({ data }) => { if (data) setMyGroups(data.map((d: any) => d.groups).filter(Boolean)) })

    // Password
    supabase.from('profiles').select('password_hash').eq('player_name', profile.name).single()
      .then(({ data }) => { if (data?.password_hash) setHasPassword(true) })

    // Records — fetch best scores per game
    fetchRecords(profile.name)
  }, [profile?.name])

  const fetchRecords = async (name: string) => {
    const [digits, nback, seq, memory, stop, f1, pendulum, ace, flags, geo, versus, sudoku, wordly, mm, g2048] = await Promise.all([
      supabase.from('number_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
      supabase.from('nback_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
      supabase.from('sequence_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
      supabase.from('scores').select('time_ms').eq('player_name', name).order('time_ms', { ascending: true }).limit(1),
      supabase.from('precision_scores').select('difference_ms').eq('player_name', name).is('game_type', null).order('difference_ms', { ascending: true }).limit(1),
      supabase.from('precision_scores').select('difference_ms').eq('player_name', name).eq('game_type', 'formula1').order('difference_ms', { ascending: true }).limit(1),
      supabase.from('precision_scores').select('difference_ms').eq('player_name', name).eq('game_type', 'pendulum').order('difference_ms', { ascending: true }).limit(1),
      supabase.from('ace_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
      supabase.from('flag_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
      supabase.from('shape_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
      supabase.from('higher_lower_scores').select('level').eq('player_name', name).order('level', { ascending: false }).limit(1),
      supabase.from('sudoku_scores').select('time_ms, difficulty').eq('player_name', name).order('time_ms', { ascending: true }).limit(1),
      supabase.from('wordle_scores').select('time_ms, attempts').eq('player_name', name).order('time_ms', { ascending: true }).limit(1),
      supabase.from('mastermind_scores').select('time_ms, attempts').eq('player_name', name).order('time_ms', { ascending: true }).limit(1),
      supabase.from('game2048_scores').select('best_tile').eq('player_name', name).order('best_tile', { ascending: false }).limit(1),
    ])

    const grouped: Record<string, any[]> = {
      memory: [], agility: [], knowledge: [], logic: []
    }

    if (nback.data?.[0]) grouped.memory.push({ game: 'N-Back', href: '/nback', value: `${nback.data[0].level} correct` })
    if (digits.data?.[0]) grouped.memory.push({ game: 'Digits', href: '/digits', value: `${digits.data[0].level} digits` })
    if (seq.data?.[0]) grouped.memory.push({ game: 'Simon Says', href: '/sequence', value: `${seq.data[0].level} in a row` })
    if (memory.data?.[0]) grouped.memory.push({ game: 'Memory', href: '/memory', value: fmt(memory.data[0].time_ms) })

    if (stop.data?.[0]) grouped.agility.push({ game: 'Stop', href: '/precision/stopwatch', value: `${stop.data[0].difference_ms}ms off` })
    if (f1.data?.[0]) grouped.agility.push({ game: 'F1 Reaction', href: '/precision/formula1', value: `${f1.data[0].difference_ms}ms` })
    if (pendulum.data?.[0]) grouped.agility.push({ game: 'Pendulum', href: '/precision/pendulum', value: `${(pendulum.data[0].difference_ms/10).toFixed(1)}° off` })
    if (ace.data?.[0]) grouped.agility.push({ game: 'Ace', href: '/ace', value: `Level ${ace.data[0].level}` })

    if (flags.data?.[0]) grouped.knowledge.push({ game: 'Flags', href: '/flags', value: `${flags.data[0].level} in a row` })
    if (geo.data?.[0]) grouped.knowledge.push({ game: 'GeoShape', href: '/geoshape', value: `${geo.data[0].level} in a row` })
    if (versus.data?.[0]) grouped.knowledge.push({ game: 'Higher or Lower', href: '/versus', value: `${versus.data[0].level} in a row` })

    if (sudoku.data?.[0]) grouped.logic.push({ game: 'Sudoku', href: '/sudoku', value: fmt(sudoku.data[0].time_ms) })
    if (wordly.data?.[0]) grouped.logic.push({ game: 'Wordly', href: '/wordly', value: `${wordly.data[0].attempts} tries` })
    if (mm.data?.[0]) grouped.logic.push({ game: 'Mastermind', href: '/mastermind', value: `${mm.data[0].attempts} tries` })
    if (g2048.data?.[0]) grouped.logic.push({ game: '2048', href: '/2048', value: `Tile ${g2048.data[0].best_tile}` })

    setRecords(grouped)
  }

  const saveName = async () => {
    if (!newName.trim() || !profile?.name) return
    setNameSaving(true)
    const { data } = await supabase.from('profiles').select('player_name').eq('player_name', newName.trim()).maybeSingle()
    if (data) { setNameError('Name already taken'); setNameSaving(false); return }
    await supabase.from('profiles').update({ player_name: newName.trim() }).eq('player_name', profile.name)
    save({ ...profile, name: newName.trim() })
    setEditingName(false)
    setNameSaving(false)
  }

  const savePin = async () => {
    const p = pin.join('')
    if (p.length !== 4) return
    await supabase.from('profiles').upsert({ player_name: profile!.name, password_hash: p, updated_at: new Date().toISOString() })
    setHasPassword(true)
    setPasswordSaved(true)
    setTimeout(() => { setPasswordSaved(false); setEditingPassword(false) }, 1500)
  }

  if (!loaded) return null
  if (!profile?.name) { if (typeof window !== 'undefined') window.location.href = '/'; return null }

  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', paddingBottom: 100 }}>

      {/* Header card */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ background: 'linear-gradient(135deg, #0A1628, #0D2B5E, #1565C0)', padding: '20px 24px', borderRadius: 24, boxShadow: '0 8px 32px rgba(13,43,94,0.5)' }}>

          {/* Name row */}
          <div style={{ marginBottom: 20 }}>
            {editingName ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input type="text" value={newName} onChange={e => { setNewName(e.target.value); setNameError('') }} onKeyDown={e => e.key === 'Enter' && saveName()} maxLength={20} autoFocus
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 16, fontWeight: 800, fontFamily: 'inherit', outline: 'none' }} />
                  <button onClick={saveName} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: GOLD, color: '#fff', fontSize: 12, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>{nameSaving ? '...' : 'Save'}</button>
                  <button onClick={() => { setEditingName(false); setNameError('') }} style={{ padding: '8px 10px', borderRadius: 10, border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>✕</button>
                </div>
                {nameError && <div style={{ fontSize: 10, color: '#FFB3B3', fontWeight: 700 }}>{nameError}</div>}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{profile.name}</div>
                <button onClick={() => { setNewName(profile.name); setEditingName(true) }} style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => setEditingPassword(!editingPassword)} style={{ padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: hasPassword ? 'rgba(46,125,50,0.4)' : 'rgba(230,81,0,0.8)', color: '#fff', fontSize: 9, fontWeight: 800 }}>
                  {hasPassword ? '🔒' : '⚠️ Protect'}
                </button>
              </div>
            )}
          </div>

          {/* PIN editor */}
          {editingPassword && (
            <div style={{ marginBottom: 16 }}>
              {passwordSaved && <div style={{ fontSize: 13, color: '#81C784', fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>✓ PIN saved!</div>}
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 8 }}>Set your 4-digit PIN</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                {pin.map((d, i) => (
                  <input key={i} id={`pin-${i}`} type="tel" maxLength={1} value={d}
                    onChange={e => { const v = e.target.value.replace(/\D/,''); const p=[...pin]; p[i]=v; setPin(p); if(v && i<3) (document.getElementById(`pin-${i+1}`) as HTMLInputElement)?.focus() }}
                    style={{ width: 44, height: 52, textAlign: 'center', fontSize: 24, fontWeight: 900, borderRadius: 12, border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontFamily: 'inherit', outline: 'none' }} />
                ))}
              </div>
              <button onClick={savePin} disabled={pin.join('').length !== 4} style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: pin.join('').length === 4 ? GOLD : 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>Save PIN</button>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, whiteSpace: 'nowrap' }}>Brain Age Test</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: brainAge ? '#4CAF50' : 'rgba(255,255,255,0.3)', lineHeight: 1 }}>{brainAge ?? '—'}</div>
              {brainAge && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase', marginTop: 2 }}>years old</div>}
              <a href="/brain-test" style={{ textDecoration: 'none', marginTop: 6, display: 'block' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 8px' }}>{brainAge ? 'Retake →' : 'Take test →'}</div>
              </a>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>My Plan</div>
              <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/myplan.png" alt="" style={{ width: 48, height: 48, objectFit: 'contain', margin: '0 auto', display: 'block' }} />
              <a href="/my-plan" style={{ textDecoration: 'none', marginTop: 6, display: 'block' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 8px' }}>View plan →</div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {/* Groups */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px 20px', marginBottom: 12, boxShadow: '0 2px 12px #4A2C0A08' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setGroupsOpen(!groupsOpen)}>
            <div style={{ fontSize: 14, fontWeight: 900, color: BROWN }}>My Groups</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <a href="/create-group" onClick={e => e.stopPropagation()} style={{ padding: '4px 12px', borderRadius: 8, background: '#2E7D32', color: '#fff', fontSize: 11, fontWeight: 800, textDecoration: 'none' }}>+ New</a>
              <span style={{ fontSize: 16, color: `${BROWN}40` }}>{groupsOpen ? '▲' : '▼'}</span>
            </div>
          </div>
          {groupsOpen && (
            <div style={{ marginTop: 12 }}>
              {myGroups.length === 0 ? (
                <div style={{ fontSize: 13, color: `${BROWN}30`, fontWeight: 700 }}>No groups yet. Create one and invite friends!</div>
              ) : myGroups.map((g: any) => (
                <a key={g.id} href={`/g/${g.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'linear-gradient(135deg, #1A3A5C, #1565C0)', borderRadius: 12, padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>→</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Records by area */}
        {[
          { key: 'memory', label: 'Memory', color: '#E91E63', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/brain-logo.webp' },
          { key: 'agility', label: 'Agility', color: '#FF6F00', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/ray.png' },
          { key: 'knowledge', label: 'Knowledge', color: '#1565C0', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/population.png' },
          { key: 'logic', label: 'Logic', color: '#6A1B9A', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/sudoku.png' },
        ].map(area => {
          const areaRecords = records[area.key] || []
          if (areaRecords.length === 0) return null
          const isOpen = openArea === area.key
          return (
            <div key={area.key} style={{ background: '#fff', borderRadius: 20, padding: '14px 20px', marginBottom: 10, boxShadow: '0 2px 12px #4A2C0A08' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setOpenArea(isOpen ? null : area.key)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={area.icon} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                  <div style={{ fontSize: 14, fontWeight: 900, color: BROWN }}>{area.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: area.color }}>{areaRecords.length} games</div>
                </div>
                <span style={{ fontSize: 14, color: `${BROWN}40` }}>{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {areaRecords.map((r: any, i: number) => (
                    <a key={i} href={r.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, background: '#F5F5F5' }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: BROWN }}>{r.game}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: area.color }}>{r.value}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Blog */}
        <a href='/blog' style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #4A2C0A10', boxShadow: '0 2px 8px #4A2C0A08' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: BROWN }}>Brain Training Blog</div>
              <div style={{ fontSize: 12, color: `${BROWN}50`, fontWeight: 700 }}>Tips, science and guides</div>
            </div>
            <div style={{ fontSize: 20, color: `${BROWN}40` }}>→</div>
          </div>
        </a>
      </div>
    </main>
  )
}
