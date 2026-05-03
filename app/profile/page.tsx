'use client'
import { useRef, useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { fetchLiveRanks, fetchDailyRank } from './RanksFetcher'
import Link from 'next/link'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const ACHIEVEMENTS = [
  { key: 'speed_genius', label: 'Speed Genius', desc: 'Finish in under 30 seconds', img: `${BASE}/bald-eagle.png` },
  { key: 'week_streak', label: '7-Day Streak', desc: 'Play 7 days in a row', img: `${BASE}/northern-lights.png` },
  { key: 'month_streak', label: '30-Day Streak', desc: 'Play 30 days in a row', img: `${BASE}/volcano.png` },
  { key: 'world_1', label: 'World #1', desc: 'Reach the top of any ranking', img: `${BASE}/pyramids-sphinx.png` },
  { key: '10_games', label: 'Dedicated', desc: 'Complete 10 games', img: `${BASE}/great-wall.png` },
]

const DIFF_CONFIG = [
  { key: 'daily', label: 'Daily', color: BROWN },
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

function Avatar({ name, photo, size = 72 }: { name: string, photo?: string, size?: number }) {
  if (photo) return <img src={photo} alt="avatar" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${GOLD}` }} />
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${GOLD}, ${BROWN})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 900, color: 'white',
      border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function ProfilePage() {
  const { profile, loaded, save } = usePlayer()
  const fileRef = useRef<HTMLInputElement>(null)
  const [liveRanks, setLiveRanks] = useState<Record<string, { rank: number | null, time: number | null }>>({})
  const [dailyRank, setDailyRank] = useState<{ rank: number | null, time: number | null }>({ rank: null, time: null })
  const [loadingRanks, setLoadingRanks] = useState(true)

  useEffect(() => {
    if (!profile?.name) return
    Promise.all([
      fetchLiveRanks(profile.name),
      fetchDailyRank(profile.name),
    ]).then(([ranks, daily]) => {
      setLiveRanks(ranks)
      setDailyRank(daily)
      setLoadingRanks(false)
    })
  }, [profile?.name])

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

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { save({ ...profile, avatar: reader.result as string }) }
    reader.readAsDataURL(file)
  }

  const today = new Date().toISOString().split('T')[0]
  const playedToday = profile.lastPlayedDate === today

  const shareCategory = async (key: string, label: string, color: string) => {
    const entry = liveRanks[key]
    if (!entry?.rank) return
    const text = `🦅 I'm #${entry.rank} in ${label} on MemGenius!\nTime: ${fmt(entry.time!)}\nCan you beat me? 👉 https://memgenius.com`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  return (
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, ${CREAM} 0%, #F0EBE1 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      paddingBottom: 100, overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        background: `url(https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/northern-lights.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        padding: '44px 24px 28px',
        borderRadius: '0 0 24px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.45) 100%)',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <Avatar name={profile.name} photo={profile.avatar} size={72} />
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: -0.5 }}>{profile.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginTop: 2 }}>Since {profile.joinedDate}</div>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
        <button onClick={() => fileRef.current?.click()} style={{
          background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
          color: 'white', fontSize: 12, fontWeight: 800,
          padding: '7px 16px', borderRadius: 20, fontFamily: 'inherit', cursor: 'pointer',
        }}>Edit photo</button>
      </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Streak */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '20px 22px',
          boxShadow: `0 2px 12px ${BROWN}10`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Current Streak</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: BROWN, letterSpacing: -1 }}>
              {profile.streak} <span style={{ fontSize: 18, opacity: 0.5 }}>days</span>
            </div>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 800,
            color: playedToday ? '#2E7D32' : '#B71C1C',
            background: playedToday ? '#2E7D3215' : '#B71C1C15',
            border: `1px solid ${playedToday ? '#2E7D3230' : '#B71C1C30'}`,
            borderRadius: 10, padding: '6px 12px',
          }}>
            {playedToday ? 'Done today' : 'Play today!'}
          </div>
        </div>

        {/* Best Positions — 4 columns with share */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '20px 22px',
          boxShadow: `0 2px 12px ${BROWN}10`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            Best Positions
          </div>
          {/* All — full width on top */}
          {(() => {
            const d = DIFF_CONFIG[0]
            const entry = liveRanks[d.key]
            const hasResult = entry?.rank != null
            return (
              <div style={{
                background: `${d.color}08`,
                border: `1px solid ${d.color}20`,
                borderRadius: 14, padding: '14px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 8,
              }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 900, color: `${d.color}80`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{d.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: hasResult ? BROWN : `${BROWN}20`, letterSpacing: -1 }}>
                    {loadingRanks ? '...' : hasResult ? `#${entry.rank}` : '—'}
                  </div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: hasResult ? GOLD : `${BROWN}20`, marginTop: 2 }}>
                    {loadingRanks ? '' : hasResult ? fmt(entry.time!) : '—'}
                  </div>
                </div>
                {hasResult && (
                  <button onClick={() => shareCategory(d.key, d.label, d.color)} style={{
                    padding: '10px 16px', borderRadius: 12, border: 'none',
                    background: BROWN, color: '#fff',
                    fontSize: 12, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
                    boxShadow: `0 4px 0 ${BROWN}50`,
                  }}>Share</button>
                )}
              </div>
            )
          })()}

          {/* Easy Medium Hard — 3 columns */}
          <div style={{ display: 'flex', gap: 8 }}>
            {DIFF_CONFIG.slice(1).map(d => {
              const entry = d.key === 'daily' ? dailyRank : liveRanks[d.key]
              const hasResult = entry?.rank != null
              return (
                <div key={d.key} style={{
                  flex: 1, textAlign: 'center',
                  background: `${d.color}08`,
                  border: `1px solid ${d.color}20`,
                  borderRadius: 14, padding: '14px 8px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <div style={{ fontSize: 9, fontWeight: 900, color: d.color, letterSpacing: 1, textTransform: 'uppercase' }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: hasResult ? BROWN : `${BROWN}20`, letterSpacing: -1 }}>
                    {loadingRanks ? '...' : hasResult ? `#${entry.rank}` : '—'}
                  </div>
                  <div style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: hasResult ? GOLD : `${BROWN}20` }}>
                    {loadingRanks ? '' : hasResult ? fmt(entry.time!) : '—'}
                  </div>
                  {hasResult && (
                    <button onClick={() => shareCategory(d.key, d.label, d.color)} style={{
                      marginTop: 4, padding: '6px 10px', borderRadius: 8, border: 'none',
                      background: d.color, color: '#fff',
                      fontSize: 10, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
                      boxShadow: `0 3px 0 ${d.color}50`,
                    }}>Share</button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Achievements */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '20px 22px',
          boxShadow: `0 2px 12px ${BROWN}10`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            Achievements
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ACHIEVEMENTS.map(a => {
              const unlocked = profile.achievements?.includes(a.key)
              return (
                <div key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 13, flexShrink: 0,
                    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: unlocked ? `0 4px 10px ${GOLD}40` : 'none',
                    filter: unlocked ? 'none' : 'grayscale(1) opacity(0.25)',
                    border: unlocked ? `2px solid ${GOLD}` : `2px solid ${BROWN}10`,
                  }}>
                    <img src={a.img} alt={a.label} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, opacity: unlocked ? 1 : 0.4 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: BROWN }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: `${BROWN}60`, marginTop: 1 }}>{a.desc}</div>
                  </div>
                  {unlocked && <div style={{ fontSize: 10, fontWeight: 900, color: GOLD, letterSpacing: 1, textTransform: 'uppercase' }}>Done</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
