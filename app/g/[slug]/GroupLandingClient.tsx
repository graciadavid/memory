'use client'
import { useEffect, useState } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'

export default function GroupLandingClient({ group, memberCount }: { group: any, memberCount: number }) {
  const { profile, loaded } = usePlayer()
  const [isMember, setIsMember] = useState<boolean | null>(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (!loaded) return
    if (!profile?.name) {
      setIsMember(false)
      return
    }
    supabase.from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('player_name', profile.name)
      .maybeSingle()
      .then(({ data }) => setIsMember(!!data))
  }, [loaded, profile?.name, group.id])

  const joinGroup = async () => {
    if (!profile?.name) {
      // Save group to join after registration
      sessionStorage.setItem('pending_group', group.id)
      window.location.href = `/?join=${group.slug || group.id}`
      return
    }
    setJoining(true)
    await supabase.from('group_members').insert({ group_id: group.id, player_name: profile.name })
    setIsMember(true)
    setJoining(false)
  }

  // Already a member — show nothing, GroupPageClient handles it
  if (isMember) return null
  if (isMember === null) return null // loading

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 24px',
      fontFamily: 'var(--font-nunito), sans-serif',
    }}>
      <div style={{
        background: '#fff', borderRadius: 28, padding: '36px 28px',
        maxWidth: 380, width: '100%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Icon */}
        <div style={{ fontSize: 52, marginBottom: 16 }}>🧠</div>

        {/* Group name */}
        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>
          You're invited to
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: BROWN, letterSpacing: -0.5, marginBottom: 8 }}>
          {group.name}
        </div>
        <div style={{ fontSize: 14, color: `${BROWN}60`, fontWeight: 600, marginBottom: 8 }}>
          {memberCount} member{memberCount !== 1 ? 's' : ''} competing on MemGenius
        </div>
        <div style={{ fontSize: 13, color: `${BROWN}50`, marginBottom: 28, lineHeight: 1.6 }}>
          Memory · Digits · Sequence · Flags · Precision · Versus
        </div>

        {/* CTA */}
        <button onClick={joinGroup} disabled={joining} style={{
          width: '100%', padding: '18px', borderRadius: 16, border: 'none',
          background: BROWN, color: '#fff', fontSize: 18, fontWeight: 900,
          fontFamily: 'inherit', cursor: 'pointer',
          boxShadow: `0 8px 0 ${BROWN}60`, marginBottom: 12,
        }}>
          {joining ? '...' : profile?.name ? 'Join & Compete 🏆' : 'Join & Play Free 🏆'}
        </button>

        <div style={{ fontSize: 11, color: `${BROWN}30`, fontWeight: 600 }}>
          Free · No download · No ads
        </div>
      </div>
    </div>
  )
}
