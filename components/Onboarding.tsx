'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const LOGO = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/logomemgenius.png'
const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

export default function Onboarding({ onCreate }: { onCreate: (name: string) => void }) {
  const [name, setName] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) return
    setChecking(true)
    setError('')

    const { count } = await supabase
      .from('scores')
      .select('*', { count: 'exact', head: true })
      .eq('player_name', name.trim())

    if ((count ?? 0) > 0) {
      setError(`"${name.trim()}" is already taken. Choose another name.`)
      setChecking(false)
      return
    }

    setChecking(false)
    onCreate(name.trim())
  }

  return (
    <div style={{
      height: '100dvh',
      background: `linear-gradient(180deg, ${CREAM} 0%, #F0EBE1 100%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-nunito), sans-serif',
      padding: '0 28px', maxWidth: 430, margin: '0 auto',
      textAlign: 'center',
    }}>
      <img
        src={LOGO}
        alt="MemGenius"
        style={{
          width: 150, height: 150,
          objectFit: 'contain',
          filter: 'drop-shadow(0 12px 28px rgba(74,44,10,0.2))',
          marginBottom: 12,
        }}
      />

      <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, marginBottom: 6 }}>
        <span style={{ color: GOLD }}>Mem</span>
        <span style={{ color: BROWN }}>Genius</span>
      </div>

      <div style={{
        fontSize: 11, fontWeight: 800, color: `${BROWN}60`,
        letterSpacing: 3, textTransform: 'uppercase', marginBottom: 44,
      }}>
        An Association Memory Game
      </div>

      <div style={{ width: '100%' }}>
        <div style={{
          fontSize: 12, fontWeight: 800, color: `${BROWN}70`,
          letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10,
        }}>
          What's your name?
        </div>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          maxLength={20}
          autoFocus
          style={{
            width: '100%', padding: '14px 16px',
            borderRadius: 16,
            border: error ? `2px solid #B71C1C` : `2px solid ${BROWN}18`,
            background: '#fff', color: BROWN,
            fontSize: 18, fontWeight: 800,
            fontFamily: 'inherit', marginBottom: error ? 6 : 14,
            boxSizing: 'border-box', outline: 'none',
            textAlign: 'center',
            transition: 'border 0.2s',
          }}
        />
        {error && (
          <div style={{
            fontSize: 12, fontWeight: 700, color: '#B71C1C',
            marginBottom: 12, textAlign: 'center',
          }}>
            {error}
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || checking}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 16, border: 'none',
            background: name.trim() && !checking ? BROWN : '#e0d9cf',
            color: name.trim() && !checking ? '#fff' : '#aaa',
            fontSize: 16, fontWeight: 900,
            fontFamily: 'inherit', cursor: name.trim() && !checking ? 'pointer' : 'default',
            boxShadow: name.trim() && !checking ? `0 8px 0 ${BROWN}40` : 'none',
            transition: 'all 0.2s',
          }}
        >
          {checking ? 'Checking...' : "Let's Play"}
        </button>
      </div>
    </div>
  )
}
