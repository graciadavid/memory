'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'

export default function Header() {
  const [profile, setProfile] = useState<any>(null)
  const [streak, setStreak] = useState(0)
  const [worldRank, setWorldRank] = useState<number|null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (!stored) return
    const p = JSON.parse(stored)
    setProfile(p)
    supabase.from('profiles').select('streak').eq('player_name', p.name).single()
      .then(({ data }: any) => { if (data?.streak) setStreak(data.streak) })
    const rank = localStorage.getItem('memgenius_world_rank')
    if (rank) setWorldRank(parseInt(rank))
  }, [])

  if (pathname === '/') return null

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#1A1A1A',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      maxWidth: 430, margin: '0 auto',
    }}>
      {/* Left — streak + world rank */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 80 }}>
        {profile && streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <img src={`${BASE}/streak.png`} style={{ width: 20, height: 20, objectFit: 'contain' }} />
            <span style={{ fontSize: 15, fontWeight: 900, color: '#FF6B35' }}>{streak}</span>
          </div>
        )}
        {profile && worldRank && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <img src={`${BASE}/population.png`} style={{ width: 20, height: 20, objectFit: 'contain' }} />
            <span style={{ fontSize: 15, fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>#{worldRank}</span>
          </div>
        )}
      </div>

      {/* Center — logo */}
      <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src={`${BASE}/brain-logo.webp`} style={{ width: 28, height: 28, objectFit: 'contain' }} />
        <span style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>MemGenius</span>
      </a>

      {/* Right — avatar inicial */}
      <div style={{ minWidth: 80, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <a href="/profile" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: profile ? GREEN : 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {profile
              ? <span style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{profile.name?.charAt(0).toUpperCase()}</span>
              : <img src={`${BASE}/nav-profile.webp`} style={{ width: 20, height: 20, objectFit: 'contain', opacity: 0.5 }} />
            }
          </div>
        </a>
      </div>
    </header>
  )
}
