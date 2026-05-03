'use client'
import { useRef, useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

const ACHIEVEMENTS = [
  { key: 'speed_genius', label: 'Speed Genius', desc: 'Finish in under 30 seconds' },
  { key: 'week_streak', label: '7-Day Streak', desc: 'Play 7 days in a row' },
  { key: 'month_streak', label: '30-Day Streak', desc: 'Play 30 days in a row' },
  { key: 'world_1', label: 'World #1', desc: 'Reach the top of any ranking' },
  { key: '10_games', label: 'Dedicated', desc: 'Complete 10 games' },
]

const DIFF_PACKS: Record<string, { label: string, color: string, packs: string[] }> = {
  easy: { label: 'Easy', color: '#2E7D32', packs: ['monuments-countries', 'animals-habitats', 'cities-skylines'] },
  medium: { label: 'Medium', color: '#E65100', packs: ['foods-monuments', 'artworks-museums', 'civilizations-landmarks'] },
  hard: { label: 'Hard', color: '#B71C1C', packs: ['inventions-inventors', 'phenomena-locations'] },
}

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

interface BestEntry { rank: number | null, time: number | null }

export default function ProfilePage() {
  const { profile, loaded, save } = usePlayer()
  const fileRef = useRef<HTMLInputElement>(null)
  const [liveRanks, setLiveRanks] = useState<Record<string, BestEntry>>({})
  const [loadingRanks, setLoadingRanks] = useState(true)

  useEffect(() => {
    if (!profile?.name) return

    const fetchLiveRanks = async () => {
      setLoadingRanks(true)
      const result: Record<string, BestEntry> = {}

      for (const [diff, val] of Object.entries(DIFF_PACKS)) {
        let bestRank: number | null = null
        let bestTime: number | null = null

        for (const slug of val.packs) {
          // Get this player's best time for this pack
          const { data: myScores } = await supabase
            .from('scores')
            .select('time_ms, packs!inner(slug)')
            .eq('player_name', profile.name)
            .eq('packs.slug', slug)
            .order('time_ms', { ascending: true })
            .limit(1)

          if (!myScores || myScores.length === 0) continue

          const myBestTime = myScores[0].time_ms

          // Count how many players beat that time
          const { data: packData } = await supabase
            .from('packs')
            .select('id')
            .eq('slug', slug)
            .single()

          if (!packData) continue

          const { count } = await supabase
            .from('scores')
            .select('*', { count: 'exact', head: true })
            .eq('pack_id', packData.id)
            .lt('time_ms', myBestTime)

          const rank = (count ?? 0) + 1

          if (bestRank === null || rank < bestRank) {
            bestRank = rank
            bestTime = myBestTime
          }
        }

        result[diff] = { rank: bestRank, time: bestTime }
      }

      setLiveRanks(result)
      setLoadingRanks(false)
    }

    fetchLiveRanks()
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
        background: `linear-gradient(135deg, ${GOLD}, ${BROWN})`,
        padding: '44px 24px 28px',
        borderRadius: '0 0 28px 28px',
      }}>
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

        {/* Best positions — live from Supabase */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '20px 22px',
          boxShadow: `0 2px 12px ${BROWN}10`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            Best Positions
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {Object.entries(DIFF_PACKS).map(([key, val]) => {
              const entry = liveRanks[key]
              return (
                <div key={key} style={{
                  flex: 1, textAlign: 'center',
                  background: `${val.color}08`,
                  border: `1px solid ${val.color}20`,
                  borderRadius: 14, padding: '14px 8px',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: val.color, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                    {val.label}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: entry?.rank ? BROWN : `${BROWN}20`, letterSpacing: -1 }}>
                    {loadingRanks ? '...' : entry?.rank ? `#${entry.rank}` : '—'}
                  </div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: entry?.time ? GOLD : `${BROWN}20`, marginTop: 4 }}>
                    {loadingRanks ? '' : entry?.time ? fmt(entry.time) : '—'}
                  </div>
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
                    width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                    background: unlocked ? `linear-gradient(135deg, ${GOLD}, ${BROWN})` : '#f0ebe1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: unlocked ? `0 4px 10px ${GOLD}40` : 'none',
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: unlocked ? 'rgba(255,255,255,0.4)' : `${BROWN}20` }} />
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
