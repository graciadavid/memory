'use client'
import { useRef } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

const ACHIEVEMENTS = [
  { key: 'speed_genius', label: 'Speed Genius', desc: 'Finish in under 30 seconds' },
  { key: 'week_streak', label: '7-Day Streak', desc: 'Play 7 days in a row' },
  { key: 'month_streak', label: '30-Day Streak', desc: 'Play 30 days in a row' },
  { key: 'world_1', label: 'World #1', desc: 'Reach the top of any ranking' },
  { key: '10_games', label: 'Dedicated', desc: 'Complete 10 games' },
  { key: 'perfect', label: 'Perfectionist', desc: 'Finish with no wrong pairs' },
]

function Avatar({ name, size = 64 }: { name: string, size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #FF4D6D, #ff8c00)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 900, color: 'white',
      flexShrink: 0,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function ProfilePage() {
  const { profile, loaded, save } = usePlayer()
  const fileRef = useRef<HTMLInputElement>(null)

  if (!loaded) return null

  if (!profile?.name) {
    return (
      <main style={{
        height: '100dvh', background: '#f2f2f2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-nunito), sans-serif',
      }}>
        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 14, fontWeight: 700 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
          No profile yet.<br />Play a game first!
          <div style={{ marginTop: 20 }}>
            <Link href="/" style={{
              textDecoration: 'none', background: '#FF4D6D',
              color: 'white', padding: '12px 24px', borderRadius: 12,
              fontWeight: 800, fontSize: 14,
            }}>Play now</Link>
          </div>
        </div>
      </main>
    )
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      save({ ...profile, avatar: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  return (
    <main style={{
      minHeight: '100dvh', background: '#f2f2f2',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      paddingBottom: 100, overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FF4D6D, #ff8c00)',
        padding: '40px 24px 28px',
        borderRadius: '0 0 28px 28px',
      }}>
        {/* Avatar + name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <div style={{ position: 'relative' }}>
            {profile.avatar ? (
              <img src={profile.avatar} alt="avatar" style={{
                width: 64, height: 64, borderRadius: '50%', objectFit: 'cover',
              }} />
            ) : (
              <Avatar name={profile.name} size={64} />
            )}
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: -1 }}>
              {profile.name}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
              Since {profile.joinedDate}
            </div>
          </div>
        </div>

        {/* Edit photo */}
        <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={handlePhoto} />
        <button onClick={() => fileRef.current?.click()} style={{
          background: 'rgba(255,255,255,0.2)', border: 'none',
          color: 'white', fontSize: 12, fontWeight: 800,
          padding: '6px 14px', borderRadius: 20,
          fontFamily: 'inherit', cursor: 'pointer',
        }}>
          Edit photo
        </button>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Streak */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#aaa', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            Current Streak
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#111' }}>
            {profile.streak} days
          </div>
        </div>

        {/* Stats */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#aaa', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
            Stats
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#111' }}>{profile.gamesPlayed}</div>
              <div style={{ fontSize: 12, color: '#aaa', fontWeight: 700 }}>Games Played</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#111' }}>{profile.totalPairs}</div>
              <div style={{ fontSize: 12, color: '#aaa', fontWeight: 700 }}>Pairs Matched</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#aaa', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
            Achievements
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ACHIEVEMENTS.map(a => {
              const unlocked = profile.achievements?.includes(a.key)
              return (
                <div key={a.key} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  opacity: unlocked ? 1 : 0.35,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: unlocked ? 'linear-gradient(135deg, #FF4D6D, #ff8c00)' : '#eee',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: 16, height: 16, borderRadius: 3, background: unlocked ? 'rgba(255,255,255,0.5)' : '#ccc' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{a.desc}</div>
                  </div>
                  {unlocked && (
                    <div style={{
                      fontSize: 11, fontWeight: 900, color: '#FF4D6D',
                      letterSpacing: 1, textTransform: 'uppercase',
                    }}>Done</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
