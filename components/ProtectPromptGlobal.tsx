'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import { track } from '@vercel/analytics'

const BROWN = '#4A2C0A'
const THRESHOLD = 5

export default function ProtectPromptGlobal() {
  const { profile } = usePlayer()
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!profile?.name) return

    const handler = async () => {
      // Check if user already has a group
      const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('player_name', profile.name)

      if ((count ?? 0) > 0) return // already in a group

      const key = `protect_count_${profile.name}`
      const current = parseInt(sessionStorage.getItem(key) || '0') + 1
      sessionStorage.setItem(key, String(current))

      if (current % THRESHOLD === 0) setShow(true)
    }

    window.addEventListener('game_completed', handler)
    return () => window.removeEventListener('game_completed', handler)
  }, [profile?.name])

  const dismiss = () => {
    setShow(false)
    if (profile?.name) sessionStorage.setItem(`protect_count_${profile.name}`, '0')
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 24px',
      fontFamily: 'var(--font-nunito), sans-serif',
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: '32px 24px',
        maxWidth: 380, width: '100%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 8, letterSpacing: -0.5 }}>
          Play with friends!
        </div>
        <div style={{ fontSize: 14, color: `${BROWN}70`, fontWeight: 600, lineHeight: 1.6, marginBottom: 24 }}>
          Create a group and compete with friends or family. See who's the best!
        </div>
        <button onClick={() => { track('protect_profile_clicked'); dismiss(); router.push('/create-group') }} style={{
          width: '100%', padding: '16px', borderRadius: 14, border: 'none',
          background: '#2E7D32', color: '#fff', fontSize: 16, fontWeight: 900,
          fontFamily: 'inherit', cursor: 'pointer',
          boxShadow: '0 6px 0 #1B5E2060', marginBottom: 10,
        }}>Set up now →</button>
        <button onClick={dismiss} style={{
          width: '100%', padding: '12px', borderRadius: 14, border: 'none',
          background: `${BROWN}10`, color: `${BROWN}60`, fontSize: 14, fontWeight: 800,
          fontFamily: 'inherit', cursor: 'pointer',
        }}>Maybe later</button>
      </div>
    </div>
  )
}
