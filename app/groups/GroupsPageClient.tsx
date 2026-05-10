'use client'
import { useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export default function GroupsPageClient() {
  const { profile, loaded } = usePlayer()
  const [myGroups, setMyGroups] = useState<any[]>([])

  useEffect(() => {
    if (loaded && !profile?.name) window.location.href = '/'
  }, [loaded, profile?.name])

  useEffect(() => {
    if (!profile?.name) return
    const cacheKey = `groups_${profile.name}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      setMyGroups(JSON.parse(cached))
    }
    supabase.from('group_members')
      .select('group_id, groups(id, name, slug)')
      .eq('player_name', profile.name)
      .then(({ data }) => {
        if (data) {
          const groups = data.map((d: any) => d.groups).filter(Boolean)
          setMyGroups(groups)
          sessionStorage.setItem(cacheKey, JSON.stringify(groups))
        }
      })
  }, [profile?.name])

  if (!loaded || !profile?.name) return null

  return (
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, #FFF8E1 0%, ${CREAM} 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '32px 16px 100px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Community</div>
        <div style={{ fontSize: 30, fontWeight: 900, color: BROWN, letterSpacing: -1 }}>Groups</div>
        <div style={{ fontSize: 13, color: `${BROWN}55`, marginTop: 4 }}>Compete with friends or family</div>
      </div>

      {/* Create group button */}
      <a href="/create-group" style={{ textDecoration: 'none', display: 'block', marginBottom: 24 }}>
        <div style={{
          background: 'linear-gradient(135deg, #1A3A5C, #1565C0)',
          borderRadius: 20, padding: '18px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 8px 0 #0D47A160',
        }}>
          <img src={`${BASE}/groups.png`} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>Create a group</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Invite friends via link</div>
          </div>
        </div>
      </a>

      {/* My Groups */}
      {myGroups.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>My Groups</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myGroups.map((g: any) => (
              <a key={g.id} href={`/g/${g.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #1A3A5C, #1565C0)',
                  borderRadius: 16, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  boxShadow: '0 4px 0 #0D47A160',
                }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{g.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>→</div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {myGroups.length === 0 && (
        <div style={{ textAlign: 'center', color: `${BROWN}40`, fontSize: 14, fontWeight: 700, padding: '40px 0', lineHeight: 1.8 }}>
          You're not in any group yet.<br />Create one and invite your friends!
        </div>
      )}
    </main>
  )
}
