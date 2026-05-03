'use client'
import { useState } from 'react'

const EAGLE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/eagle.png'
const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

export default function Onboarding({ onCreate }: { onCreate: (name: string) => void }) {
  const [name, setName] = useState('')

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
        src={EAGLE}
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
          onChange={e => setName(e.target.value)}
          maxLength={20}
          autoFocus
          style={{
            width: '100%', padding: '14px 16px',
            borderRadius: 16, border: `2px solid ${BROWN}18`,
            background: '#fff', color: BROWN,
            fontSize: 18, fontWeight: 800,
            fontFamily: 'inherit', marginBottom: 14,
            boxSizing: 'border-box', outline: 'none',
            textAlign: 'center',
          }}
        />
        <button
          onClick={() => name.trim() && onCreate(name.trim())}
          disabled={!name.trim()}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 16, border: 'none',
            background: name.trim() ? BROWN : '#e0d9cf',
            color: name.trim() ? '#fff' : '#aaa',
            fontSize: 16, fontWeight: 900,
            fontFamily: 'inherit', cursor: name.trim() ? 'pointer' : 'default',
            boxShadow: name.trim() ? `0 8px 0 ${BROWN}40` : 'none',
          }}
        >
          Let's Play
        </button>
      </div>
    </div>
  )
}
