'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

export default function CreateGroupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [playerName, setPlayerName] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) setPlayerName(JSON.parse(stored).name || '')
  }, [])

  const [nameError, setNameError] = useState('')

  const create = async () => {
    if (!name.trim() || !playerName || creating) return
    setCreating(true)
    setNameError('')

    // Check if group name already exists
    const { count } = await supabase
      .from('groups')
      .select('*', { count: 'exact', head: true })
      .eq('name', name.trim())

    if ((count ?? 0) > 0) {
      setNameError('A group with this name already exists')
      setCreating(false)
      return
    }

    const { data: group } = await supabase
      .from('groups')
      .insert({ name: name.trim(), created_by: playerName })
      .select()
      .single()

    if (group) {
      await supabase.from('group_members').insert({ group_id: group.id, player_name: playerName })
      window.location.href = `/group?id=${group.id}`
    }
    setCreating(false)
  }

  return (
    <main style={{
      height: '100dvh',
      background: `radial-gradient(ellipse at 50% 0%, #fff8ee 0%, ${CREAM} 50%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '0 20px',
    }}>
      <div style={{ width: '100%', background: '#fff', borderRadius: 24, padding: '28px 24px', boxShadow: `0 16px 48px ${BROWN}15`, boxSizing: 'border-box' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>New Group</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: BROWN, marginBottom: 6 }}>Create a group</div>
        <div style={{ fontSize: 13, color: `${BROWN}60`, marginBottom: 24, lineHeight: 1.6 }}>
          Invite friends via link and compete together in all 4 games.
        </div>

        <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Group name</div>
        <input
          type="text"
          placeholder="e.g. Friends, Madrid crew, Work team..."
          value={name}
          onChange={e => { setName(e.target.value); setNameError('') }}
          onKeyDown={e => e.key === 'Enter' && create()}
          maxLength={30}
          autoFocus
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            border: `2px solid ${nameError ? '#B71C1C' : BROWN}15`,
            background: CREAM, color: BROWN,
            fontSize: 16, fontWeight: 800,
            fontFamily: 'inherit', outline: 'none',
            boxSizing: 'border-box', marginBottom: 8,
          }}
        />
        {nameError && <div style={{ fontSize: 11, color: '#B71C1C', fontWeight: 700, marginBottom: 12 }}>{nameError}</div>}

        <button onClick={create} disabled={!name.trim() || creating} style={{
          width: '100%', padding: '16px', borderRadius: 16, border: 'none',
          background: name.trim() ? '#2E7D32' : '#e0d9cf',
          color: name.trim() ? '#fff' : '#aaa',
          fontSize: 16, fontWeight: 900, fontFamily: 'inherit',
          cursor: name.trim() ? 'pointer' : 'default',
          boxShadow: name.trim() ? `0 6px 0 ${BROWN}60` : 'none',
        }}>
          {creating ? 'Creating...' : 'Create group →'}
        </button>
      </div>

      <a href="/profile" style={{ marginTop: 20, fontSize: 13, color: `${BROWN}40`, fontWeight: 700, textDecoration: 'none' }}>← Back to profile</a>
    </main>
  )
}
