'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import { getStreak } from '@/lib/streak'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const LOGO = `${BASE}/logomemgenius.webp`
const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

const GAMES = [
  { key: 'memory', href: '/memory', icon: '/icons/memory.webp', label: 'Memory', sub: 'Match pairs by connection', bg: BROWN, shadow: `${BROWN}60` },
  { key: 'digits', href: '/digits', icon: '/icons/digits.webp', label: 'Digits', sub: 'How many digits can you remember?', bg: '#1565C0', shadow: '#0D47A160' },
  { key: 'sequence', href: '/sequence', icon: '/icons/sequence.webp', label: 'Sequence', sub: 'Repeat the pattern', bg: '#6A1B9A', shadow: '#4A148C60' },
  { key: 'flags', href: '/flags', icon: '/icons/flags.webp', label: 'Flags', sub: 'How many flags in a row?', bg: '#00796B', shadow: '#00695160' },
  { key: 'precision', href: '/precision', icon: '⏱', label: 'Precision', sub: 'Stop at exactly 5 seconds', bg: '#4A148C', shadow: '#4A148C60', emoji: true },
  { key: 'versus', href: '/versus/population', icon: '⚔️', label: 'Versus', sub: 'Higher or Lower · Population', bg: '#C62828', shadow: '#C6282860', emoji: true },
]

export default function LandingPage() {
  const { profile, loaded, createProfile } = usePlayer()
  const [name, setName] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const [records, setRecords] = useState<Record<string, { value: string, by: string }>>({})
  const [streak, setStreak] = useState<{ current: number, longest: number, playedToday: boolean }>({ current: 0, longest: 0, playedToday: false })
  const [nameExists, setNameExists] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const fetchRecords = async () => {
      const [mem, dig, seq, flag, prec, hl] = await Promise.all([
        supabase.from('scores').select('player_name, time_ms').order('time_ms', { ascending: true }).limit(1),
        supabase.from('number_scores').select('player_name, level').order('level', { ascending: false }).limit(1),
        supabase.from('sequence_scores').select('player_name, level').order('level', { ascending: false }).limit(1),
        supabase.from('flag_scores').select('player_name, level').order('level', { ascending: false }).limit(1),
        supabase.from('precision_scores').select('player_name, difference_ms').order('difference_ms', { ascending: true }).limit(1),
        supabase.from('higher_lower_scores').select('player_name, level').eq('category', 'population').order('level', { ascending: false }).limit(1),
      ])
      const fmt = (ms: number) => {
        const m = Math.floor(ms / 60000)
        const s = Math.floor((ms % 60000) / 1000)
        const c = Math.floor((ms % 1000) / 10)
        return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
      }
      setRecords({
        memory: mem.data?.[0] ? { value: fmt(mem.data[0].time_ms), by: mem.data[0].player_name } : { value: '', by: '' },
        digits: dig.data?.[0] ? { value: `Level ${dig.data[0].level}`, by: dig.data[0].player_name } : { value: '', by: '' },
        sequence: seq.data?.[0] ? { value: `Level ${seq.data[0].level}`, by: seq.data[0].player_name } : { value: '', by: '' },
        flags: flag.data?.[0] ? { value: `${flag.data[0].level} flags`, by: flag.data[0].player_name } : { value: '', by: '' },
        precision: prec.data?.[0] ? { value: `${(prec.data[0].difference_ms / 1000).toFixed(3)}s off`, by: prec.data[0].player_name } : { value: '', by: '' },
        versus: hl.data?.[0] ? { value: `${hl.data[0].level} correct`, by: hl.data[0].player_name } : { value: '', by: '' },
      })
    }
    fetchRecords()
  }, [])

  useEffect(() => {
    if (!profile?.name) return
    getStreak(profile.name).then(setStreak)
  }, [profile?.name])

  const handleSave = async () => {
    if (!name.trim()) return
    setChecking(true)
    setError('')

    // Check if name exists in profiles
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('player_name, password_hash')
      .eq('player_name', name.trim())
      .single()

    if (existingProfile) {
      // Name exists — ask for password
      if (!nameExists) {
        setNameExists(true)
        setChecking(false)
        return
      }
      // Validate password
      if (!password.trim()) {
        setError('Please enter your password')
        setChecking(false)
        return
      }
      if (existingProfile.password_hash && existingProfile.password_hash !== password.trim()) {
        setError('Wrong password')
        setNameExists(false)
        setPassword('')
        setChecking(false)
        return
      }
      // Correct password or no password set — enter
      createProfile(name.trim())
      setChecking(false)
      return
    }

    // Check scores tables for legacy users without profile entry
    const { count } = await supabase.from('scores').select('*', { count: 'exact', head: true }).eq('player_name', name.trim())
    const { count: count2 } = await supabase.from('number_scores').select('*', { count: 'exact', head: true }).eq('player_name', name.trim())
    const { count: count3 } = await supabase.from('flag_scores').select('*', { count: 'exact', head: true }).eq('player_name', name.trim())
    const { count: count4 } = await supabase.from('sequence_scores').select('*', { count: 'exact', head: true }).eq('player_name', name.trim())

    if ((count ?? 0) + (count2 ?? 0) + (count3 ?? 0) + (count4 ?? 0) > 0) {
      // Legacy user — ask for password
      if (!nameExists) {
        setNameExists(true)
        setChecking(false)
        return
      }
      // No password set for legacy user — let them in
      createProfile(name.trim())
      setChecking(false)
      return
    }

    // New user
    createProfile(name.trim())
    setChecking(false)
  }

  if (!loaded) return null

  return (
    <>
    <style>{`@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0.3 } }`}</style>
    <main style={{
      height: '100dvh',
      background: `radial-gradient(ellipse at 50% 0%, #fff8ee 0%, ${CREAM} 40%, #EDE5D8 100%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '0 20px',
      overflowY: 'auto',
    }}>

      {!profile?.name ? (
        /* NOT REGISTERED */
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Logo */}
          <img src={LOGO} alt="MemGenius" style={{ height: 110, objectFit: 'contain', marginBottom: 8 }} />
          {/* Claim */}
          <div style={{ fontSize: 14, color: `${BROWN}55`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginBottom: 28, letterSpacing: 0.3 }}>
            Your daily brain workout
          </div>
          {!nameExists ? (
            <>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, textAlign: 'center' }}>
                Your name
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => { setName(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  maxLength={20}
                  autoFocus
                  style={{
                    flex: 1, padding: '12px 14px', borderRadius: 14,
                    border: error ? '2px solid #B71C1C' : `2px solid ${BROWN}18`,
                    background: '#fff', color: BROWN,
                    fontSize: 16, fontWeight: 800,
                    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button onClick={handleSave} disabled={!name.trim() || checking} style={{
                  padding: '12px 18px', borderRadius: 14, border: 'none',
                  background: name.trim() ? BROWN : '#e0d9cf',
                  color: name.trim() ? '#fff' : '#aaa',
                  fontSize: 14, fontWeight: 900, fontFamily: 'inherit',
                  cursor: name.trim() ? 'pointer' : 'default',
                  boxShadow: name.trim() ? `0 6px 0 ${BROWN}50` : 'none',
                  flexShrink: 0,
                }}>{checking ? '...' : 'Next'}</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, textAlign: 'center', marginBottom: 4 }}>Welcome back, {name}!</div>
              <div style={{ fontSize: 12, color: `${BROWN}60`, textAlign: 'center', marginBottom: 16 }}>Enter your password to continue</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  autoFocus
                  style={{
                    flex: 1, padding: '12px 14px', borderRadius: 14,
                    border: error ? '2px solid #B71C1C' : `2px solid ${BROWN}18`,
                    background: '#fff', color: BROWN,
                    fontSize: 16, fontWeight: 800,
                    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button onClick={() => setShowPassword(!showPassword)} style={{ padding: '12px', borderRadius: 14, border: `1px solid ${BROWN}20`, background: '#fff', fontSize: 16, cursor: 'pointer', flexShrink: 0 }}>{showPassword ? '🙈' : '👁'}</button>
                <button onClick={handleSave} disabled={checking} style={{ padding: '12px 18px', borderRadius: 14, border: 'none', background: BROWN, color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', boxShadow: `0 6px 0 ${BROWN}50`, flexShrink: 0 }}>{checking ? '...' : 'Enter'}</button>
              </div>
              <button onClick={() => { setNameExists(false); setPassword(''); setError('') }} style={{ background: 'none', border: 'none', color: `${BROWN}50`, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'center', padding: '4px' }}>← Use a different name</button>
            </>
          )}
          {error && <div style={{ fontSize: 11, color: '#B71C1C', fontWeight: 700, marginTop: 6, textAlign: 'center' }}>{error}</div>}
        </div>
      ) : (
        /* REGISTERED */
        <>
          {/* Logo */}
          <img src={LOGO} alt="MemGenius" style={{ height: 100, objectFit: 'contain', marginBottom: 2 }} />

          {/* Greeting + Streak */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: BROWN }}>Hey, {profile.name}!</div>
            {streak.current > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E8F5E9', borderRadius: 10, padding: '4px 10px', border: '1.5px solid #2E7D32' }}>
                <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/streak.png" alt="" style={{ width: 20, height: 20, objectFit: 'contain', animation: 'blink 1.2s ease-in-out infinite' }} />
                <span style={{ fontSize: 13, fontWeight: 900, color: '#2E7D32' }}>{streak.current} day{streak.current !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Claim */}
          <div style={{ fontSize: 12, color: `${BROWN}55`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginBottom: 16, letterSpacing: 0.3 }}>
            Your daily brain workout
          </div>

          {/* Game grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
            {GAMES.map(game => (
              <a key={game.key} href={game.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: game.bg,
                  borderRadius: 20,
                  padding: '6px 12px 6px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 4,
                  boxShadow: `0 6px 0 ${game.shadow}`,
                  aspectRatio: '5/2.5',
                }}>
                  {(game as any).emoji ? (
                    <div style={{ fontSize: 58 }}>{game.icon}</div>
                  ) : (
                    <img src={game.icon} alt="" style={{ width: 80, height: 80, objectFit: 'contain' }} />
                  )}
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', textAlign: 'center', letterSpacing: -0.3 }}>{game.label}</div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </main>
    </>
  )
}
