'use client'
import { useRef, useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { fetchAllRanks } from './RanksFetcher'
import { supabase } from '@/lib/supabase'
import { getStreak } from '@/lib/streak'
import Link from 'next/link'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
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
  const [profileStreak, setProfileStreak] = useState<{ current: number, longest: number }>({ current: 0, longest: 0 })
  const [versusRank, setVersusRank] = useState<{ level: number | null, rank: number | null }>({ level: null, rank: null })
  const [versusPopRank, setVersusPopRank] = useState<{ level: number | null, rank: number | null }>({ level: null, rank: null })
  const [versusAreaRank, setVersusAreaRank] = useState<{ level: number | null, rank: number | null }>({ level: null, rank: null })
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
    getStreak(profile.name).then(s => setProfileStreak({ current: s.current, longest: s.longest }))

    // Fetch F1
    supabase.from('precision_scores').select('player_name, difference_ms').eq('game_type', 'formula1').order('difference_ms', { ascending: true }).limit(500).then(({ data }) => {
      if (!data) return
      const best: Record<string, number> = {}
      data.forEach((s: any) => { if (!best[s.player_name] || s.difference_ms < best[s.player_name]) best[s.player_name] = s.difference_ms })
      const myDiff = best[profile.name]
      if (!myDiff && myDiff !== 0) return
      setF1Rank({ diff: myDiff, rank: Object.values(best).filter(d => d < myDiff).length + 1 })
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

  if (!loaded) return null

  if (!profile?.name) {
    return (
      <main style={{ height: '100dvh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <div style={{ textAlign: 'center', color: `${BROWN}60`, fontSize: 14, fontWeight: 700 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
          No profile yet.<br />Play a game first!
          <div style={{ marginTop: 20 }}>
            <Link href="/" style={{ textDecoration: 'none', background: BROWN, color: 'white', padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 14 }}>Play now</Link>
          </div>
        </div>
      </main>
    )
  }

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
        background: 'linear-gradient(135deg, #C8960C, #F5D062, #B8860B)',
        padding: '18px 24px', borderRadius: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ position: 'relative' }}>
            <Avatar name={profile.name} photo={profile.avatar} size={80} />
            <button onClick={() => fileRef.current?.click()} style={{
              position: 'absolute', bottom: -4, right: -4,
              width: 26, height: 26, borderRadius: 8,
              background: GOLD, border: '2px solid #fff',
              fontSize: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>📷</button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
          </div>

          <div style={{ flex: 1 }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{profile.name}</div>
                <button onClick={() => { setNewName(profile.name); setEditingName(true) }} style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>Edit</button>
              </div>
            )}

            {/* Protect button */}
            <button onClick={() => setEditingPassword(!editingPassword)} style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: hasPassword ? 'rgba(46,125,50,0.3)' : 'rgba(230,81,0,0.8)',
              color: '#fff', fontSize: 11, fontWeight: 800,
            }}>
              {hasPassword ? '🔒 Protected' : '⚠️ Protect profile'}
            </button>
          </div>
        </div>

        {/* Password editor */}
        {editingPassword && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {passwordSaved && <div style={{ fontSize: 13, color: '#81C784', fontWeight: 800, textAlign: 'center' }}>✓ Password saved!</div>}
            <div style={{ position: 'relative' }}>
              <input type={showPwd ? 'text' : 'password'} placeholder={hasPassword ? 'New password' : 'Create password'} value={newPassword}
                onChange={e => { setNewPassword(e.target.value); setPasswordError('') }}
                style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 14, fontWeight: 800, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>{showPwd ? '🙈' : '👁'}</button>
            </div>
            <input type={showPwd ? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setPasswordError('') }}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 14, fontWeight: 800, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            {passwordError && <div style={{ fontSize: 11, color: '#FFB3B3', fontWeight: 700 }}>{passwordError}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={savePassword} disabled={passwordSaving} style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: GOLD, color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>{passwordSaving ? '...' : 'Save password'}</button>
              <button onClick={() => { setEditingPassword(false); setPasswordError('') }} style={{ padding: '12px 16px', borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 14, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>


        {/* Streak banner */}
        {profileStreak.current > 0 && (() => {
          const MILESTONES = [
            { min: 1,  max: 4,   img: 'seed.png',        color: '#2E7D32', msg: 'Your brain is warming up.', next: 'Reach 5 days to start forming a habit.' },
            { min: 5,  max: 9,   img: 'streak.png',      color: '#E65100', msg: 'Habit forming. Working memory improving.', next: 'Reach 10 days for reaction time gains.' },
            { min: 10, max: 29,  img: 'ray.png',         color: '#F57F17', msg: 'Reaction time is improving.', next: 'Reach 30 days for measurable memory gains.' },
            { min: 30, max: 49,  img: 'brain-logo.webp', color: '#1565C0', msg: 'Measurable memory gains. Science backs this.', next: 'Reach 50 days — top 5% of players.' },
            { min: 50, max: 99,  img: 'nav-trophy.webp', color: '#6A1B9A', msg: 'Top 5% of MemGenius players.', next: 'Reach 100 days — cognitive athlete level.' },
            { min: 100, max: 9999, img: 'target.png',    color: '#B71C1C', msg: 'Cognitive athlete. Among the best.', next: 'Keep going. There is no ceiling.' },
          ]
          const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
          const m = MILESTONES.find(x => profileStreak.current >= x.min && profileStreak.current <= x.max)
          return (
            <Link href="/streak" style={{ textDecoration: 'none' }}>
              <div style={{
                background: `linear-gradient(135deg, ${m?.color}22, ${m?.color}08)`,
                border: `2px solid ${m?.color}40`,
                borderRadius: 24, padding: '20px',
                boxShadow: `0 4px 20px ${m?.color}20`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                  <img src={`${BASE}/${m?.img}`} alt="" style={{ width: 64, height: 64, objectFit: 'contain', animation: 'blink 1.2s ease-in-out infinite', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 64, fontWeight: 900, color: m?.color, lineHeight: 1 }}>{profileStreak.current}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: `${m?.color}80`, textTransform: 'uppercase', letterSpacing: 2 }}>day streak</div>
                  </div>
                  {profileStreak.longest > profileStreak.current && (
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: `${m?.color}50` }}>{profileStreak.longest}</div>
                      <div style={{ fontSize: 9, color: `${m?.color}40`, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>best</div>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: m?.color, marginBottom: 4 }}>{m?.msg}</div>
                <div style={{ fontSize: 12, color: `${m?.color}70`, fontWeight: 700, marginBottom: 12 }}>{m?.next}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: m?.color, opacity: 0.6, textAlign: 'right' }}>Learn more about your streak →</div>
                {(() => {
                  const SEGMENTS = [
                    { min: 1,  max: 4,   steps: 4,  base: 0 },
                    { min: 5,  max: 9,   steps: 5,  base: 5 },
                    { min: 10, max: 29,  steps: 20, base: 10 },
                    { min: 30, max: 49,  steps: 20, base: 30 },
                    { min: 50, max: 99,  steps: 50, base: 50 },
                    { min: 100, max: 9999, steps: 1, base: 100 },
                  ]
                  const seg = SEGMENTS.find(s => profileStreak.current >= s.min && profileStreak.current <= s.max)
                  if (!seg) return null
                  const progress = profileStreak.current - seg.base
                  const stepsPerDot = seg.steps / 5
                  const daysToNext = seg.max === 9999 ? 0 : seg.max - profileStreak.current + 1
                  return (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 6 }}>
                        {[0,1,2,3,4].map(i => {
                          const filled = progress >= (i + 1) * stepsPerDot || seg.min === 100
                          const partial = !filled && progress > i * stepsPerDot
                          return (
                            <div key={i} style={{
                              width: 18, height: 18, borderRadius: 9,
                              background: filled ? m?.color : 'transparent',
                              border: `2px solid ${filled || partial ? m?.color : `${m?.color}40`}`,
                              boxShadow: filled ? `0 2px 6px ${m?.color}40` : 'none',
                            }} />
                          )
                        })}
                      </div>
                      {daysToNext > 0 && (
                        <div style={{ fontSize: 11, fontWeight: 700, color: `${m?.color}80`, textAlign: 'center' }}>
                          {daysToNext} day{daysToNext !== 1 ? 's' : ''} to next milestone
                        </div>
                      )}
                    </div>
                  )
                })()}
                {(() => {
                  const SEGMENTS = [
                    { min: 1,  max: 4,   steps: 4,  base: 0 },
                    { min: 5,  max: 9,   steps: 5,  base: 5 },
                    { min: 10, max: 29,  steps: 20, base: 10 },
                    { min: 30, max: 49,  steps: 20, base: 30 },
                    { min: 50, max: 99,  steps: 50, base: 50 },
                    { min: 100, max: 9999, steps: 1, base: 100 },
                  ]
                  const seg = SEGMENTS.find(s => profileStreak.current >= s.min && profileStreak.current <= s.max)
                  if (!seg) return null
                  const progress = profileStreak.current - seg.base
                  const stepsPerDot = seg.steps / 5
                  const daysToNext = seg.max === 9999 ? 0 : seg.max - profileStreak.current + 1
                  return (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 6 }}>
                        {[0,1,2,3,4].map(i => {
                          const filled = progress >= (i + 1) * stepsPerDot || seg.min === 100
                          const partial = !filled && progress > i * stepsPerDot
                          return (
                            <div key={i} style={{
                              width: 18, height: 18, borderRadius: 9,
                              background: filled ? m?.color : 'transparent',
                              border: `2px solid ${filled || partial ? m?.color : `${m?.color}40`}`,
                              boxShadow: filled ? `0 2px 6px ${m?.color}40` : 'none',
                            }} />
                          )
                        })}
                      </div>
                      {daysToNext > 0 && (
                        <div style={{ fontSize: 11, fontWeight: 700, color: `${m?.color}80`, textAlign: 'center' }}>
                          {daysToNext} day{daysToNext !== 1 ? 's' : ''} to next milestone
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </Link>
          )
        })()}

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

        {/* Memory */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '14px 16px', boxShadow: `0 2px 12px ${BROWN}08` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <img src="/icons/memory.webp" alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
            <div style={{ fontSize: 13, fontWeight: 900, color: BROWN }}>Memory</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {DIFF_CONFIG.map(d => {
              const entry = liveRanks[d.key]
              const hasResult = entry?.rank != null
              return (
                <div key={d.key} style={{ flex: 1, textAlign: 'center', background: `${d.color}08`, border: `1px solid ${d.color}20`, borderRadius: 12, padding: '8px 4px' }}>
                  <div style={{ fontSize: 8, fontWeight: 900, color: d.color, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{d.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: hasResult ? BROWN : `${BROWN}20` }}>
                    {loadingRanks ? '...' : hasResult ? `#${entry.rank}` : '—'}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: hasResult ? GOLD : `${BROWN}20` }}>
                    {loadingRanks ? '' : hasResult ? fmt(entry.time!) : ''}
                  </div>
                  {hasResult && (
                    <button onClick={() => shareScore(`🧠 I'm #${entry.rank} in ${d.label} Memory!\nhttps://memgenius.com/memory`)}
                      style={{ marginTop: 4, padding: '3px 8px', borderRadius: 6, border: 'none', background: d.color, color: '#fff', fontSize: 9, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>Share</button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Other games grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { key: 'digits', label: 'Digits', color: '#1565C0', icon: '/icons/digits.webp', score: digitsRank.level, rank: digitsRank.rank, unit: 'Level', share: `🔢 Level ${digitsRank.level} in Digits! #${digitsRank.rank}
https://memgenius.com/digits` },
            { key: 'sequence', label: 'Sequence', color: '#6A1B9A', icon: '/icons/sequence.webp', score: seqRank.level, rank: seqRank.rank, unit: 'Level', share: `🎵 Level ${seqRank.level} in Sequence! #${seqRank.rank}
https://memgenius.com/sequence` },
            { key: 'flags', label: 'Flags', color: '#00796B', icon: '/icons/flags.webp', score: flagsRank.level, rank: flagsRank.rank, unit: 'Flags', share: `🚩 ${flagsRank.level} flags! #${flagsRank.rank}
https://memgenius.com/flags` },

          ].map(g => (
            <div key={g.key} style={{ background: '#fff', borderRadius: 20, padding: '14px', boxShadow: `0 2px 12px ${BROWN}08` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                {g.icon && <img src={g.icon} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />}
                <div style={{ fontSize: 12, fontWeight: 900, color: g.color }}>{g.label}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: g.score ? BROWN : `${BROWN}20` }}>{loadingRanks ? '...' : g.score ?? '—'}</div>
                  <div style={{ fontSize: 8, color: `${BROWN}40`, fontWeight: 700, textTransform: 'uppercase' }}>{g.unit}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: g.rank ? GOLD : `${BROWN}20` }}>{loadingRanks ? '...' : g.rank ? `#${g.rank}` : '—'}</div>
                  <div style={{ fontSize: 8, color: `${BROWN}40`, fontWeight: 700, textTransform: 'uppercase' }}>World</div>
                </div>
              </div>
              {g.score && (
                <button onClick={() => shareScore(g.share)}
                  style={{ marginTop: 8, width: '100%', padding: '5px', borderRadius: 8, border: 'none', background: g.color, color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>Share</button>
              )}
            </div>
          ))}
        </div>

        {/* Precision */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '14px 16px', boxShadow: `0 2px 12px ${BROWN}08` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/precision.png" alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
            <div style={{ fontSize: 13, fontWeight: 900, color: '#4A148C' }}>Precision</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { label: 'Stop', data: precRank, fmt: (d: number) => `${(d/1000).toFixed(3)}s`, color: '#4A148C', share: `⏱ I'm #${precRank.rank} in Precision Stop!\nhttps://memgenius.com/precision/stopwatch` },
              { label: 'F1', data: f1Rank, fmt: (d: number) => `${d}ms`, color: '#E8002D', share: `🏎️ I'm #${f1Rank.rank} in F1 with ${f1Rank.diff}ms!\nhttps://memgenius.com/precision/formula1` },
            ].map(v => {
              const hasResult = v.data.diff !== null
              return (
                <div key={v.label} style={{ flex: 1, textAlign: 'center', background: `${v.color}08`, border: `1px solid ${v.color}20`, borderRadius: 12, padding: '8px 4px' }}>
                  <div style={{ fontSize: 8, fontWeight: 900, color: v.color, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{v.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: hasResult ? BROWN : `${BROWN}20` }}>
                    {loadingRanks ? '...' : hasResult ? `#${v.data.rank}` : '—'}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: hasResult ? GOLD : `${BROWN}20` }}>
                    {hasResult ? v.fmt(v.data.diff!) : ''}
                  </div>
                  {hasResult && (
                    <button onClick={() => shareScore(v.share)}
                      style={{ marginTop: 4, padding: '3px 8px', borderRadius: 6, border: 'none', background: v.color, color: '#fff', fontSize: 9, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>Share</button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Versus */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '14px 16px', boxShadow: `0 2px 12px ${BROWN}08` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/higuer.png" alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
            <div style={{ fontSize: 13, fontWeight: 900, color: '#C62828' }}>Versus</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { label: 'Population', data: versusPopRank, share: `🌍 I got ${versusPopRank.level} correct in Versus Population! #${versusPopRank.rank}\nhttps://memgenius.com/versus/population` },
              { label: 'Area km²', data: versusAreaRank, share: `🗺️ I got ${versusAreaRank.level} correct in Versus Area! #${versusAreaRank.rank}\nhttps://memgenius.com/versus/area` },
            ].map(v => {
              const hasResult = v.data.rank != null
              return (
                <div key={v.label} style={{ flex: 1, textAlign: 'center', background: '#C6282808', border: '1px solid #C6282820', borderRadius: 12, padding: '8px 4px' }}>
                  <div style={{ fontSize: 8, fontWeight: 900, color: '#C62828', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{v.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: hasResult ? BROWN : `${BROWN}20` }}>
                    {loadingRanks ? '...' : hasResult ? `#${v.data.rank}` : '—'}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: hasResult ? GOLD : `${BROWN}20` }}>
                    {loadingRanks ? '' : hasResult ? `${v.data.level} correct` : ''}
                  </div>
                  {hasResult && (
                    <button onClick={() => shareScore(v.share)}
                      style={{ marginTop: 4, padding: '3px 8px', borderRadius: 6, border: 'none', background: '#C62828', color: '#fff', fontSize: 9, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' }}>Share</button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
      </div>
    </main>
    </>
  )
}

