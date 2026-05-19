'use client'
import { useRef, useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { fetchAllRanks } from './RanksFetcher'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'

const BRAIN_AREAS = {
  memory: { label: 'Memory', color: '#E91E63', icon: '🧠', desc: 'Working memory and short-term recall', games: [{ label: 'N-Back', href: '/nback' },{ label: 'Digits', href: '/digits' },{ label: 'Simon Says', href: '/sequence' },{ label: 'Memory', href: '/memory' },{ label: 'N-Back', href: '/nback' },{ label: 'Digits', href: '/digits' },{ label: 'Simon Says', href: '/sequence' }] },
  agility: { label: 'Agility', color: '#FF6F00', icon: '⚡', desc: 'Reaction time and motor precision', games: [{ label: 'Stop', href: '/precision/stopwatch' },{ label: 'F1 Reaction', href: '/precision/formula1' },{ label: 'Pendulum', href: '/precision/pendulum' },{ label: 'Ace', href: '/ace' },{ label: 'Stop', href: '/precision/stopwatch' },{ label: 'F1 Reaction', href: '/precision/formula1' },{ label: 'Pendulum', href: '/precision/pendulum' }] },
  knowledge: { label: 'Knowledge', color: '#1565C0', icon: '🌍', desc: 'Spatial cognition and world knowledge', games: [{ label: 'Flags', href: '/flags' },{ label: 'GeoShape', href: '/geoshape' },{ label: 'Higher or Lower', href: '/versus' },{ label: 'Flags', href: '/flags' },{ label: 'GeoShape', href: '/geoshape' },{ label: 'Higher or Lower', href: '/versus' },{ label: 'Flags', href: '/flags' }] },
  logic: { label: 'Logic', color: '#6A1B9A', icon: '🎯', desc: 'Logical thinking and deductive reasoning', games: [{ label: 'Mastermind', href: '/mastermind' },{ label: 'Sudoku', href: '/sudoku' },{ label: 'Wordly', href: '/wordly' },{ label: '2048', href: '/2048' },{ label: 'Mastermind', href: '/mastermind' },{ label: 'Sudoku', href: '/sudoku' },{ label: 'Wordly', href: '/wordly' }] },
}

function calcAreaScores(test: any) {
  const nbP = Math.min(250, (test.nback_score || 0) * 50)
  const stopDiff = test.stop_score || 2000
  const stopP = Math.max(0, Math.round(200 - (stopDiff / 100) * 20))
  const geoP = Math.min(200, (test.geoshape_score || 0) * 40)
  const digP = Math.min(200, test.mastermind_score || 0)
  const aceP = Math.min(150, (test.ace_score || 0) * 0.75)
  return {
    memory: Math.round(((nbP / 250) + (digP / 200)) / 2 * 100),
    agility: Math.round(((aceP / 150) + (stopP / 200)) / 2 * 100),
    knowledge: Math.round((geoP / 200) * 100),
    logic: Math.round((digP / 200) * 100),
  }
}
const CREAM = '#FAF7F2'

const DIFF_CONFIG = [
  { key: 'easy', label: 'Easy', color: '#2E7D32' },
  { key: 'medium', label: 'Medium', color: '#E65100' },
  { key: 'hard', label: 'Hard', color: '#B71C1C' },
]

function fmt(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const c = Math.floor((ms % 1000) / 10)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
}

function getColor(name: string) {
  const colors = ['#C8960C', '#1565C0', '#2E7D32', '#6A1B9A', '#B71C1C', '#00796B']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function Avatar({ name, photo, size = 80 }: { name: string, photo?: string, size?: number }) {
  if (photo) return <img src={photo} alt="avatar" style={{ width: size, height: size, borderRadius: size * 0.28, objectFit: 'cover', border: `3px solid ${GOLD}`, flexShrink: 0 }} />
  const color = getColor(name)
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: `linear-gradient(135deg, ${color}, ${color}AA)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 900, color: 'white',
      border: `3px solid rgba(255,255,255,0.3)`, flexShrink: 0,
      boxShadow: `0 4px 16px ${color}50`,
    }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}


export default function ProfilePage() {
  const { profile, loaded, save } = usePlayer()
  const fileRef = useRef<HTMLInputElement>(null)
  const [liveRanks, setLiveRanks] = useState<Record<string, { rank: number | null, time: number | null }>>({})
  const [loadingRanks, setLoadingRanks] = useState(true)
  const [digitsRank, setDigitsRank] = useState<{ level: number | null, rank: number | null }>({ level: null, rank: null })
  const [seqRank, setSeqRank] = useState<{ level: number | null, rank: number | null }>({ level: null, rank: null })
  const [flagsRank, setFlagsRank] = useState<{ level: number | null, rank: number | null }>({ level: null, rank: null })
  const [precRank, setPrecRank] = useState<{ diff: number | null, rank: number | null }>({ diff: null, rank: null })
  const [f1Rank, setF1Rank] = useState<{ diff: number | null, rank: number | null }>({ diff: null, rank: null })
  const [pendulumRank, setPendulumRank] = useState<{ diff: number | null, rank: number | null }>({ diff: null, rank: null })
  const [profileBrainAge, setProfileBrainAge] = useState<number | null>(null)
  const [brainTest, setBrainTest] = useState<any | null>(null)
  const [brainPlan, setBrainPlan] = useState<any | null>(null)
  const [brainPercentiles, setBrainPercentiles] = useState<Record<string, number>>({})
  const [creatingPlan, setCreatingPlan] = useState(false)
  const [versusRank, setVersusRank] = useState<{ level: number | null, rank: number | null }>({ level: null, rank: null })
  const [versusPopRank, setVersusPopRank] = useState<{ level: number | null, rank: number | null }>({ level: null, rank: null })
  const [versusAreaRank, setVersusAreaRank] = useState<{ level: number | null, rank: number | null }>({ level: null, rank: null })
  const [activeTab, setActiveTab] = useState('memory')
  const [nbackRank, setNbackRank] = useState<{ level: number | null, rank: number | null }>({ level: null, rank: null })
  const [rank2048, setRank2048] = useState<{ tile: number | null, time: number | null, rank: number | null }>({ tile: null, time: null, rank: null })
  const [aceRank, setAceRank] = useState<{ level: number | null, rank: number | null }>({ level: null, rank: null })
  const [geoRank, setGeoRank] = useState<{ level: number | null, rank: number | null }>({ level: null, rank: null })
  const [sudokuRank, setSudokuRank] = useState<{ time: number | null, rank: number | null, difficulty: string | null }>({ time: null, rank: null, difficulty: null })
  const [wordlyRank, setWordlyRank] = useState<{ time: number | null, rank: number | null, attempts: number | null }>({ time: null, rank: null, attempts: null })
  const [mastermindRank, setMastermindRank] = useState<{ time: number | null, rank: number | null, attempts: number | null }>({ time: null, rank: null, attempts: null })
  const [myGroups, setMyGroups] = useState<any[]>([])
  const [hasPassword, setHasPassword] = useState(false)

  // Edit name
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [nameError, setNameError] = useState('')
  const [nameSaving, setNameSaving] = useState(false)

  // Edit password
  const [editingPassword, setEditingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  useEffect(() => {
    if (!profile?.name) return

    supabase.from('profiles').select('password_hash').eq('player_name', profile.name).single().then(({ data }) => {
      setHasPassword(!!data?.password_hash)
    })

    supabase.from('group_members').select('group_id, groups(id, name)').eq('player_name', profile.name).then(({ data }) => {
      if (data) setMyGroups(data.map((d: any) => d.groups).filter(Boolean))
    })

    supabase.from('flag_scores').select('player_name, level').order('level', { ascending: false }).limit(500).then(({ data }) => {
      if (!data) return
      const best: Record<string, number> = {}
      data.forEach(s => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
      const myLevel = best[profile.name]
      if (!myLevel) return
      setFlagsRank({ level: myLevel, rank: Object.values(best).filter(l => l > myLevel).length + 1 })
    })

    // Fetch precision
    supabase.from('precision_scores').select('player_name, difference_ms').order('difference_ms', { ascending: true }).limit(500).then(({ data }) => {
      if (!data) return
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
      const myDiff = best[profile.name]
      if (!myDiff && myDiff !== 0) return
      setPrecRank({ diff: myDiff, rank: Object.values(best).filter(d => d < myDiff).length + 1 })
    })

    // Fetch streak
    supabase.from('brain_test_scores').select('*').eq('player_name', profile.name)
      .order('created_at', { ascending: false }).limit(1)
      .then(({ data }) => {
        if (data?.[0]) {
          const score = data[0].score
          const age = Math.min(65, Math.max(18, Math.round(65 - (score / 1000) * 47)))
          setProfileBrainAge(age)
          setBrainTest(data[0])
          // Calculate percentiles
          supabase.from('brain_test_scores').select('score, ace_score, nback_score, stop_score, geoshape_score, mastermind_score').then(({ data: all }) => {
            if (all && data[0]) {
              const myScores = calcAreaScores(data[0])
              const percs: Record<string, number> = {}
              for (const area of Object.keys(BRAIN_AREAS)) {
                const allS = all.map((t: any) => calcAreaScores(t)[area as keyof typeof myScores])
                percs[area] = Math.round((allS.filter((s: number) => s < myScores[area as keyof typeof myScores]).length / allS.length) * 100)
              }
              setBrainPercentiles(percs)
            }
          })
        }
      })
    supabase.from('brain_plans').select('*').eq('player_name', profile.name).order('created_at', { ascending: false }).limit(1)
      .then(({ data }) => { if (data?.[0]) setBrainPlan(data[0]) })

    // Fetch F1
    supabase.from('precision_scores').select('player_name, difference_ms').eq('game_type', 'formula1').order('difference_ms', { ascending: true }).limit(500).then(({ data }) => {
      if (!data) return
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
      const myDiff = best[profile.name]
      if (!myDiff && myDiff !== 0) return
      setF1Rank({ diff: myDiff, rank: Object.values(best).filter(d => d < myDiff).length + 1 })
    })

    // Fetch Pendulum
    supabase.from('precision_scores').select('player_name, difference_ms').eq('game_type', 'pendulum').order('difference_ms', { ascending: true }).limit(500).then(({ data }) => {
      const best: Record<string, number> = {}
      const myDiff = best[profile.name]
      setPendulumRank({ diff: myDiff, rank: Object.values(best).filter(d => d < myDiff).length + 1 })
    })

    // Fetch Sudoku
    supabase.from('sudoku_scores').select('player_name, time_ms, difficulty').order('time_ms', { ascending: true }).limit(500).then(({ data }) => {
      if (!data) return
      const best: Record<string, {time: number, difficulty: string}> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name].time) best[s.player_name] = {time: s.time_ms, difficulty: s.difficulty} })
      const myBest = best[profile.name]
      if (!myBest) return
      setSudokuRank({ time: myBest.time, difficulty: myBest.difficulty, rank: Object.values(best).filter(d => d.time < myBest.time).length + 1 })
    })

    // Fetch 2048
    supabase.from('game2048_scores').select('player_name, best_tile, time_ms').order('best_tile', { ascending: false }).order('time_ms', { ascending: true }).limit(500).then(({ data }) => {
      if (!data) return
      const best: Record<string, { tile: number, time: number }> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.best_tile > best[s.player_name].tile || (s.best_tile === best[s.player_name].tile && s.time_ms < best[s.player_name].time)) best[s.player_name] = { tile: s.best_tile, time: s.time_ms } })
      const myBest = best[profile.name]
      if (!myBest) return
      const sorted = Object.values(best).sort((a, b) => b.tile - a.tile || a.time - b.time)
      setRank2048({ tile: myBest.tile, time: myBest.time, rank: sorted.findIndex(s => s.tile === myBest.tile && s.time === myBest.time) + 1 })
    })

    // Fetch Ace
    supabase.from('ace_scores').select('player_name, level').order('level', { ascending: false }).limit(500).then(({ data }) => {
      if (!data) return
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
      const myBest = best[profile.name]
      if (!myBest) return
      setAceRank({ level: myBest, rank: Object.values(best).filter(l => l > myBest).length + 1 })
    })

    // Fetch GeoShape
    supabase.from('shape_scores').select('player_name, level').order('level', { ascending: false }).limit(500).then(({ data }) => {
      if (!data) return
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
      const myBest = best[profile.name]
      if (!myBest) return
      setGeoRank({ level: myBest, rank: Object.values(best).filter(l => l > myBest).length + 1 })
    })

    // Fetch NBack
    supabase.from('nback_scores').select('player_name, level').order('level', { ascending: false }).limit(500).then(({ data }) => {
      if (!data) return
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
      const myBest = best[profile.name]
      if (!myBest) return
      setNbackRank({ level: myBest, rank: Object.values(best).filter(l => l > myBest).length + 1 })
    })

    // Fetch Wordly
    supabase.from('wordle_scores').select('player_name, time_ms, attempts').order('time_ms', { ascending: true }).limit(500).then(({ data }) => {
      if (!data) return
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
      const myBest = best[profile.name]
      if (!myBest) return
      const myAttempts = data.find((s: any) => s.player_name === profile.name)?.attempts
      setWordlyRank({ time: myBest, rank: Object.values(best).filter(t => t < myBest).length + 1, attempts: myAttempts })
    })

    // Fetch Mastermind
    supabase.from('mastermind_scores').select('player_name, time_ms, attempts').order('time_ms', { ascending: true }).limit(500).then(({ data }) => {
      if (!data) return
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.time_ms < best[s.player_name]) best[s.player_name] = s.time_ms })
      const myBest = best[profile.name]
      if (!myBest) return
      const myAttempts = data.find((s: any) => s.player_name === profile.name)?.attempts
      setMastermindRank({ time: myBest, rank: Object.values(best).filter(t => t < myBest).length + 1, attempts: myAttempts })
    })

    // Fetch versus by category
    supabase.from('higher_lower_scores').select('player_name, level, category').order('level', { ascending: false }).limit(1000).then(({ data }) => {
      if (!data) return
      const calcRank = (cat: string) => {
        const catData = data.filter((s: any) => s.category === cat)
        const best: Record<string, number> = {}
        catData.forEach((s: any) => { if (!best[s.player_name] || s.level > best[s.player_name]) best[s.player_name] = s.level })
        const myLevel = best[profile.name]
        if (!myLevel) return { level: null, rank: null }
        return { level: myLevel, rank: Object.values(best).filter(l => l > myLevel).length + 1 }
      }
      setVersusPopRank(calcRank('population'))
      setVersusAreaRank(calcRank('area'))
    })

    fetchAllRanks(profile.name).then(({ memoryRanks, digitsRank, seqRank }) => {
      setLiveRanks(memoryRanks)
      setDigitsRank(digitsRank)
      setSeqRank(seqRank)
      setLoadingRanks(false)
    })
  }, [profile?.name])

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const avatarBase64 = reader.result as string
      save({ ...profile!, avatar: avatarBase64 })
      if (profile?.name) {
        await supabase.from('profiles').upsert({ player_name: profile.name, avatar_url: avatarBase64, updated_at: new Date().toISOString() })
      }
    }
    reader.readAsDataURL(file)
  }

  const saveName = async () => {
    if (!newName.trim() || newName.trim() === profile?.name) { setEditingName(false); return }
    setNameSaving(true)
    setNameError('')
    const [r1, r2, r3, r4] = await Promise.all([
      supabase.from('scores').select('*', { count: 'exact', head: true }).eq('player_name', newName.trim()),
      supabase.from('number_scores').select('*', { count: 'exact', head: true }).eq('player_name', newName.trim()),
      supabase.from('sequence_scores').select('*', { count: 'exact', head: true }).eq('player_name', newName.trim()),
      supabase.from('flag_scores').select('*', { count: 'exact', head: true }).eq('player_name', newName.trim()),
    ])
    if ((r1.count ?? 0) > 0 || (r2.count ?? 0) > 0 || (r3.count ?? 0) > 0 || (r4.count ?? 0) > 0) {
      setNameError('Name already taken')
      setNameSaving(false)
      return
    }
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) {
      const p = JSON.parse(stored)
      p.name = newName.trim()
      localStorage.setItem('memgenius_profile', JSON.stringify(p))
      window.location.reload()
    }
    setNameSaving(false)
    setEditingName(false)
  }

  const savePassword = async () => {
    if (!newPassword.trim()) return
    if (newPassword !== confirmPassword) { setPasswordError("Passwords don't match"); return }
    if (newPassword.length < 4) { setPasswordError('Min 4 characters'); return }
    setPasswordSaving(true)
    await supabase.from('profiles').upsert({ player_name: profile!.name, password_hash: newPassword.trim(), updated_at: new Date().toISOString() })
    setHasPassword(true)
    setPasswordSaved(true)
    setEditingPassword(false)
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
    setPasswordSaving(false)
    setTimeout(() => setPasswordSaved(false), 3000)
  }

  const shareScore = async (text: string) => {
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  const createPlan = async (weakArea: string) => {
    if (!profile?.name) return
    setCreatingPlan(true)
    const areaData = BRAIN_AREAS[weakArea as keyof typeof BRAIN_AREAS]
    await supabase.from('brain_plans').insert({
      player_name: profile.name,
      weak_area: weakArea,
      games: areaData.games.map(g => g.href),
      game_labels: areaData.games.map(g => g.label),
      completed_days: [],
      start_date: new Date().toISOString().split('T')[0],
    })
    const { data } = await supabase.from('brain_plans').select('*').eq('player_name', profile.name).order('created_at', { ascending: false }).limit(1)
    if (data?.[0]) setBrainPlan(data[0])
    setCreatingPlan(false)
  }

  if (!loaded) return null

  if (!profile?.name) { if (typeof window !== 'undefined') window.location.href = '/'; return null }

  return (
    <>
    <style>{`@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0.3 } }`}</style>
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, ${CREAM} 0%, #F0EBE1 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      paddingBottom: 100,
    }}>

      {/* HEADER */}
      <div style={{ padding: '16px 16px 0' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0A1628, #0D2B5E, #1565C0)',
        padding: '18px 24px', borderRadius: 24,
        boxShadow: '0 8px 32px rgba(13,43,94,0.5)',
      }}>
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

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase' }}>Brain Age</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: profileBrainAge ? '#4CAF50' : 'rgba(255,255,255,0.3)', lineHeight: 1 }}>{profileBrainAge ?? '—'}</div>
            {profileBrainAge && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>years old</div>}
            <a href="/brain-test" style={{ textDecoration: 'none', marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#4CAF50', background: 'rgba(76,175,80,0.2)', borderRadius: 10, padding: '8px 12px' }}>{profileBrainAge ? 'Retake test →' : 'Take test →'}</div>
            </a>
          </div>
        </div>

        {/* Password editor */}
        {editingPassword && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {passwordSaved && <div style={{ fontSize: 13, color: '#81C784', fontWeight: 800, textAlign: 'center' }}>✓ PIN saved!</div>}

            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase' }}>New PIN</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}
              onClick={() => (document.getElementById('profile-pin-new') as HTMLInputElement)?.focus()}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{
                  width: 52, height: 64, borderRadius: 14,
                  border: `2px solid ${newPassword.length > i ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'}`,
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 900, color: '#fff',
                }}>{newPassword[i] ? '•' : ''}</div>
              ))}
            </div>
            <input id="profile-pin-new" type="tel" inputMode="numeric" pattern="[0-9]*" value={newPassword} maxLength={4}
              onChange={e => { setNewPassword(e.target.value.replace(/\D/g,'').slice(0,4)); setPasswordError('') }}
              style={{ opacity: 0, position: 'absolute', width: 1, height: 1 }} />

            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase' }}>Confirm PIN</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}
              onClick={() => (document.getElementById('profile-pin-confirm') as HTMLInputElement)?.focus()}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{
                  width: 52, height: 64, borderRadius: 14,
                  border: `2px solid ${confirmPassword.length > i ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'}`,
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 900, color: '#fff',
                }}>{confirmPassword[i] ? '•' : ''}</div>
              ))}
            </div>
            <input id="profile-pin-confirm" type="tel" inputMode="numeric" pattern="[0-9]*" value={confirmPassword} maxLength={4}
              onChange={e => { setConfirmPassword(e.target.value.replace(/\D/g,'').slice(0,4)); setPasswordError('') }}
              style={{ opacity: 0, position: 'absolute', width: 1, height: 1 }} />

            {passwordError && <div style={{ fontSize: 11, color: '#FFB3B3', fontWeight: 700, textAlign: 'center' }}>{passwordError}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={savePassword} disabled={passwordSaving || newPassword.length < 4 || confirmPassword.length < 4} style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: newPassword.length === 4 && confirmPassword.length === 4 ? GOLD : 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>{passwordSaving ? '...' : 'Save PIN'}</button>
              <button onClick={() => { setEditingPassword(false); setPasswordError(''); setNewPassword(''); setConfirmPassword('') }} style={{ padding: '12px 16px', borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 14, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>



        <div style={{ background: '#fff', borderRadius: 20, padding: '18px 20px', boxShadow: `0 2px 12px ${BROWN}08` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: BROWN }}>My Groups</div>
            <a href="/create-group" style={{ padding: '6px 14px', borderRadius: 10, background: '#2E7D32', color: '#fff', fontSize: 12, fontWeight: 800, textDecoration: 'none', boxShadow: '0 3px 0 #1B5E2060' }}>+ New</a>
          </div>
          {myGroups.length === 0 ? (
            <div style={{ fontSize: 13, color: `${BROWN}30`, fontWeight: 700 }}>Create a group and invite friends to compete!</div>
          ) : myGroups.map((g: any) => (
            <a key={g.id} href={`/g/${g.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #1A3A5C, #1565C0)', borderRadius: 14, padding: '12px 16px', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 0 #0D47A160' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{g.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>→</div>
              </div>
            </a>
          ))}
        </div>

        {/* RECORDS */}
        <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', paddingLeft: 4 }}>My Records</div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 6, margin: '8px 0' }}>
          {([{key:'memory',label:'Memory',color:'#E91E63'},{key:'agility',label:'Agility',color:'#FF6F00'},{key:'knowledge',label:'Knowledge',color:'#1565C0'},{key:'logic',label:'Logic',color:'#6A1B9A'}] as {key:string,label:string,color:string}[]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex: 1, padding: '8px 4px', borderRadius: 12, border: 'none', background: activeTab === tab.key ? tab.color : '#fff', color: activeTab === tab.key ? '#fff' : BROWN, fontSize: 10, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: activeTab === tab.key ? `0 4px 0 ${tab.color}60` : '0 2px 0 #4A2C0A10' }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === 'memory' && <>
          {DIFF_CONFIG.map(d => {
            const entry = liveRanks[d.key]
            const hasResult = entry?.rank != null
            return (
              <div key={d.key} style={{ borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ background: `linear-gradient(135deg, ${d.color}, ${d.color}BB)`, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src="/icons/memory.webp" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>Memory</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{d.label}{hasResult ? ` · ${fmt(entry.time!)}` : ''}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{loadingRanks ? '...' : hasResult ? `#${entry.rank}` : '—'}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase' }}>World</div>
                    {hasResult && (
                      <button onClick={() => shareScore(`🧠 I'm #${entry.rank} in Memory ${d.label} on MemGenius! ${fmt(entry.time!)}\nhttps://memgenius.com/memory`)} style={{
                        padding: '4px 10px', borderRadius: 8, border: 'none',
                        background: 'rgba(255,255,255,0.2)', color: '#fff',
                        fontSize: 10, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
                      }}>Share</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          {([
            { key: 'digits', label: 'Digits', color: '#1976D2', icon: '/icons/digits.webp', score: digitsRank.level, rank: digitsRank.rank, unit: 'Level', share: `Level ${digitsRank.level} in Digits! #${digitsRank.rank} https://memgenius.com/digits` },
            { key: 'simon', label: 'Simon Says', color: '#FF6F00', icon: '/icons/sequence.webp', score: seqRank.level, rank: seqRank.rank, unit: 'Level', share: `Level ${seqRank.level} in Simon Says! #${seqRank.rank} https://memgenius.com/sequence` },
            { key: 'nback', label: 'N-Back', color: '#6A1B9A', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/nback.png', score: nbackRank.level, rank: nbackRank.rank, unit: 'Correct', share: `I got ${nbackRank.level} correct in N-Back! #${nbackRank.rank} https://memgenius.com/nback` },
          ] as any[]).map(g => (
            <div key={g.key} style={{ borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}BB)`, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={g.icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{g.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{loadingRanks ? '...' : g.score ? `${g.score} ${g.unit}` : 'No record yet'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{loadingRanks ? '...' : g.rank ? `#${g.rank}` : '—'}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase' }}>World</div>
                  {g.rank && g.share && (
                    <button onClick={() => shareScore(g.share)} style={{
                      padding: '4px 10px', borderRadius: 8, border: 'none',
                      background: 'rgba(255,255,255,0.2)', color: '#fff',
                      fontSize: 10, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
                    }}>Share</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>}

        {activeTab === 'agility' && <>
          {([
            { label: 'Stop', color: '#388E3C', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/precision.png', score: precRank.diff !== null ? `${(precRank.diff/1000).toFixed(3)}s off` : null, rank: precRank.rank, share: `I am #${precRank.rank} in Stop! https://memgenius.com/precision/stopwatch` },
            { label: 'F1 Reaction', color: '#E8002D', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/f1.png', score: f1Rank.diff !== null ? `${f1Rank.diff}ms` : null, rank: f1Rank.rank, share: `I am #${f1Rank.rank} in F1 with ${f1Rank.diff}ms! https://memgenius.com/precision/formula1` },
            { label: 'Pendulum', color: '#1565C0', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/pendulum.png', score: pendulumRank.diff !== null ? `${pendulumRank.diff}ms` : null, rank: pendulumRank.rank, share: `I am #${pendulumRank.rank} in Pendulum with ${pendulumRank.diff}ms! https://memgenius.com/precision/pendulum` },
            { label: 'Ace', color: '#4CAF50', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/padel.png', score: aceRank.level !== null ? `${aceRank.level} aces` : null, rank: aceRank.rank, share: `I hit ${aceRank.level} aces in a row on MemGenius! https://memgenius.com/ace` },
          ] as any[]).map(g => (
            <div key={g.label} style={{ borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}BB)`, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={g.icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{g.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{loadingRanks ? '...' : g.score ?? 'No record yet'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{loadingRanks ? '...' : g.rank ? `#${g.rank}` : '—'}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase' }}>World</div>
                  {g.rank && g.share && (
                    <button onClick={() => shareScore(g.share)} style={{
                      padding: '4px 10px', borderRadius: 8, border: 'none',
                      background: 'rgba(255,255,255,0.2)', color: '#fff',
                      fontSize: 10, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
                    }}>Share</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>}

        {activeTab === 'knowledge' && <>
          {([
            { label: 'Flags', color: '#E65100', icon: '/icons/flags.webp', score: flagsRank.level, rank: flagsRank.rank, unit: 'Flags', share: `${flagsRank.level} flags! #${flagsRank.rank} https://memgenius.com/flags` },
            { label: 'GeoShape', color: '#1565C0', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/mapamundi.png', score: geoRank.level, rank: geoRank.rank, unit: 'Countries', share: `${geoRank.level} countries in GeoShape! #${geoRank.rank} https://memgenius.com/geoshape` },
            { label: 'Population', color: '#6A1B9A', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/higuer.png', score: versusPopRank.rank !== null ? `${versusPopRank.level} correct` : null, rank: versusPopRank.rank, share: `I got ${versusPopRank.level} correct in Population! #${versusPopRank.rank} https://memgenius.com/versus/population` },
            { label: 'Area km2', color: '#00695C', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/higuer.png', score: versusAreaRank.rank !== null ? `${versusAreaRank.level} correct` : null, rank: versusAreaRank.rank, share: `I got ${versusAreaRank.level} correct in Area! #${versusAreaRank.rank} https://memgenius.com/versus/area` },
          ] as any[]).map(g => (
            <div key={g.label} style={{ borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}BB)`, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={g.icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{g.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{loadingRanks ? '...' : g.score ? `${g.score} ${g.unit ?? ''}` : 'No record yet'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{loadingRanks ? '...' : g.rank ? `#${g.rank}` : '—'}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase' }}>World</div>
                  {g.rank && g.share && (
                    <button onClick={() => shareScore(g.share)} style={{
                      padding: '4px 10px', borderRadius: 8, border: 'none',
                      background: 'rgba(255,255,255,0.2)', color: '#fff',
                      fontSize: 10, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
                    }}>Share</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>}

        {activeTab === 'logic' && <>
          {([
            { label: 'Sudoku', color: '#757575', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/sudoku.png', score: sudokuRank.time ? `${sudokuRank.difficulty} · ${Math.floor(sudokuRank.time/60000)}:${String(Math.floor((sudokuRank.time%60000)/1000)).padStart(2,'0')}` : null, rank: sudokuRank.rank, share: `🧩 I'm #${sudokuRank.rank} in Sudoku on MemGenius!\nhttps://memgenius.com/sudoku` },
            { label: 'Wordly', color: '#2E7D32', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/wordly.png', score: wordlyRank.time ? `${Math.floor(wordlyRank.time/60000)}:${String(Math.floor((wordlyRank.time%60000)/1000)).padStart(2,'0')} · ${wordlyRank.attempts} tries` : null, rank: wordlyRank.rank, share: `📝 I'm #${wordlyRank.rank} in Wordly on MemGenius!\nhttps://memgenius.com/wordly` },
            { label: 'Mastermind', color: '#6A1B9A', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/mastermind.png', score: mastermindRank.time ? `${Math.floor(mastermindRank.time/60000)}:${String(Math.floor((mastermindRank.time%60000)/1000)).padStart(2,'0')} · ${mastermindRank.attempts} tries` : null, rank: mastermindRank.rank, share: `🔐 I'm #${mastermindRank.rank} in Mastermind on MemGenius!\nhttps://memgenius.com/mastermind` },
            { label: '2048', color: '#EDC22E', icon: 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/2048.png', score: rank2048.tile ? String(rank2048.tile) : null, rank: rank2048.rank, share: `🎮 I reached tile ${rank2048.tile} in 2048 on MemGenius! #${rank2048.rank}\nhttps://memgenius.com/2048` },
          ] as any[]).map(g => (
            <div key={g.label} style={{ borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}BB)`, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={g.icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{g.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{g.score ?? 'No record yet'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{g.rank ? `#${g.rank}` : '—'}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase' }}>World</div>
                  {g.rank && g.share && (
                    <button onClick={() => shareScore(g.share)} style={{
                      padding: '4px 10px', borderRadius: 8, border: 'none',
                      background: 'rgba(255,255,255,0.2)', color: '#fff',
                      fontSize: 10, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
                    }}>Share</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>}

      </div>
      </div>
    {/* Brain Age + Plan */}
    {brainTest && (
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {/* 4 Areas */}
        <div style={{ fontSize: 11, fontWeight: 800, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Cognitive Areas</div>
        {Object.entries(BRAIN_AREAS).map(([key, area]) => {
          const scores = calcAreaScores(brainTest)
          const score = scores[key as keyof typeof scores]
          const pct = brainPercentiles[key] ?? 50
          const areaScores2 = calcAreaScores(brainTest)
          const isWeak = key === Object.entries(areaScores2).sort((a, b) => a[1] - b[1])[0][0]
          return (
            <div key={key} style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', border: isWeak ? `2px solid ${area.color}` : '1px solid #4A2C0A08' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{area.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#4A2C0A' }}>{area.label}</div>
                    <div style={{ fontSize: 11, color: '#4A2C0A50', fontWeight: 700 }}>{area.desc}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: area.color }}>Top {100 - pct}%</div>
                  {isWeak && <div style={{ fontSize: 10, fontWeight: 800, color: area.color, textTransform: 'uppercase', letterSpacing: 1 }}>Weakest</div>}
                </div>
              </div>
              <div style={{ background: '#F5F5F5', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, height: '100%', background: area.color, borderRadius: 8 }} />
              </div>
            </div>
          )
        })}

        {/* Plan */}
        <div style={{ fontSize: 11, fontWeight: 800, color: '#4A2C0A50', letterSpacing: 2, textTransform: 'uppercase', marginTop: 8, marginBottom: 4 }}>7-Day Training Plan</div>
        {!brainPlan && (() => {
          const areaScores3 = calcAreaScores(brainTest)
          const weakArea = Object.entries(areaScores3).sort((a, b) => a[1] - b[1])[0][0]
          const area = BRAIN_AREAS[weakArea as keyof typeof BRAIN_AREAS]
          return (
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px', border: '1px solid #4A2C0A08', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#4A2C0A', marginBottom: 8 }}>{area.icon} Train your {area.label}</div>
              <div style={{ fontSize: 13, color: '#4A2C0A60', marginBottom: 16 }}>Your weakest area. 7 days to improve it.</div>
              <button onClick={() => createPlan(weakArea)} disabled={creatingPlan} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: area.color, color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>
                {creatingPlan ? 'Creating...' : 'Start 7-day plan'}
              </button>
            </div>
          )
        })()}

        {brainPlan && brainPlan.completed_days.length < 7 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px', border: '1px solid #4A2C0A08' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#4A2C0A' }}>
                  {BRAIN_AREAS[brainPlan.weak_area as keyof typeof BRAIN_AREAS]?.icon} {BRAIN_AREAS[brainPlan.weak_area as keyof typeof BRAIN_AREAS]?.label} Plan
                </div>
                <div style={{ fontSize: 12, color: '#4A2C0A50', fontWeight: 700 }}>Day {brainPlan.completed_days.length} of 7</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: BRAIN_AREAS[brainPlan.weak_area as keyof typeof BRAIN_AREAS]?.color }}>{brainPlan.completed_days.length}/7</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {brainPlan.game_labels.map((label: string, i: number) => {
                const completed = brainPlan.completed_days.includes(i + 1)
                const today = new Date().toISOString().split('T')[0]
                const planDay = Math.ceil((new Date(today).getTime() - new Date(brainPlan.start_date).getTime()) / 86400000) + 1
                const isToday = i + 1 === planDay
                const areaColor = BRAIN_AREAS[brainPlan.weak_area as keyof typeof BRAIN_AREAS]?.color || '#4A2C0A'
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: completed ? '#E8F5E9' : isToday ? `${areaColor}10` : '#F5F5F5', border: isToday ? `1.5px solid ${areaColor}40` : 'none' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: completed ? '#2E7D32' : isToday ? areaColor : '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                      {completed ? '✓' : i + 1}
                    </div>
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 800, color: completed ? '#2E7D32' : '#4A2C0A' }}>Day {i + 1} — {label}</div>
                    {isToday && !completed && (
                      <a href={brainPlan.games[i]} style={{ textDecoration: 'none', background: areaColor, color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 900 }}>Play</a>
                    )}
                    {!isToday && !completed && i + 1 > planDay && (
                      <span style={{ fontSize: 16 }}>🔒</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {brainPlan && brainPlan.completed_days.length >= 7 && (
          <div style={{ background: '#E8F5E9', borderRadius: 20, padding: '20px', textAlign: 'center', border: '1px solid #2E7D3220' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#2E7D32', marginBottom: 8 }}>Plan complete!</div>
            <a href="/brain-test" style={{ textDecoration: 'none', display: 'block', background: '#2E7D32', color: '#fff', padding: '14px', borderRadius: 14, fontWeight: 900, fontSize: 15 }}>Retake Brain Age Test</a>
          </div>
        )}
      </div>
    )}

    <div style={{ padding: '0 16px 16px' }}>
      <a href='/blog' style={{ textDecoration: 'none' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #4A2C0A10', boxShadow: '0 2px 8px #4A2C0A08' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#4A2C0A' }}>Brain Training Blog</div>
            <div style={{ fontSize: 12, color: '#4A2C0A50', fontWeight: 700 }}>Tips, science and guides</div>
          </div>
          <div style={{ fontSize: 20, color: '#4A2C0A40' }}>→</div>
        </div>
      </a>
    </div>
    </main>
    </>
  )
}

