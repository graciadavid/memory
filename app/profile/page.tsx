'use client'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

const ACHIEVEMENTS: Record<string, { label: string, emoji: string }> = {
  speed_genius: { label: 'Speed Genius', emoji: '⚡' },
  week_streak: { label: '7-Day Streak', emoji: '🔥' },
  month_streak: { label: '30-Day Streak', emoji: '🌋' },
  world_1: { label: 'World #1', emoji: '👑' },
  '10_games': { label: '10 Games', emoji: '🎮' },
}

export default function ProfilePage() {
  const { profile, loaded } = usePlayer()

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
            }}>Play now →</Link>
          </div>
        </div>
      </main>
    )
  }

  const today = new Date().toISOString().split('T')[0]
  const playedToday = profile.lastPlayedDate === today

  return (
    <main style={{
      minHeight: '100dvh', background: '#f2f2f2',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      paddingBottom: 100,
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FF4D6D, #ff8c00)',
        padding: '40px 24px 28px',
        borderRadius: '0 0 28px 28px',
      }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🧠</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: -1 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginTop: 4 }}>
          Playing since {profile.joinedDate}
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Streak */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#aaa', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
              Current Streak
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#111' }}>
              🔥 {profile.streak} days
            </div>
            <div style={{ fontSize: 12, color: playedToday ? '#00c853' : '#FF4D6D', fontWeight: 700, marginTop: 4 }}>
              {playedToday ? '✅ Played today' : '⚠️ Play today to keep streak!'}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Pairs Found', value: profile.totalPairs, emoji: '🃏' },
            { label: 'Games Played', value: profile.gamesPlayed, emoji: '🎮' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#fff', borderRadius: 16, padding: '16px',
              textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: 28 }}>{stat.emoji}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#111' }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#aaa', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
            Achievements
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(ACHIEVEMENTS).map(([key, val]) => {
              const unlocked = profile.achievements.includes(key)
              return (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  opacity: unlocked ? 1 : 0.3,
                }}>
                  <div style={{ fontSize: 24 }}>{val.emoji}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>{val.label}</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>{unlocked ? 'Unlocked!' : 'Locked'}</div>
                  </div>
                  {unlocked && <div style={{ marginLeft: 'auto', fontSize: 16 }}>✅</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
