'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'

export default function CreateGroupBanner({ playerName }: { playerName: string }) {
  const [hasGroup, setHasGroup] = useState(true)

  useEffect(() => {
    if (!playerName) {
      setHasGroup(false) // no name = show banner
      return
    }
    supabase.from('group_members')
      .select('id')
      .eq('player_name', playerName)
      .limit(1)
      .then(({ data }) => setHasGroup(!!(data && data.length > 0)))
  }, [playerName])

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(t)
  }, [])

  if (hasGroup || !visible) return null

  return (
    <a href="/create-group" style={{ textDecoration: 'none', width: '100%', display: 'block' }}>
      <div style={{
        width: '100%', padding: '14px 16px', borderRadius: 16,
        background: 'linear-gradient(135deg, #1A3A5C, #1565C0)',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 6px 0 #0D47A160',
      }}>
        <div style={{ fontSize: 28 }}>👥</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>Create a group with friends or family</div>
          
        </div>
      </div>
    </a>
  )
}
