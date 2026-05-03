'use client'
import { useState } from 'react'

export default function Onboarding({ onCreate }: { onCreate: (name: string) => void }) {
  const [name, setName] = useState('')

  return (
    <div style={{
      height: '100dvh', background: '#f2f2f2',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-nunito), sans-serif',
      padding: '0 28px', maxWidth: 430, margin: '0 auto',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🧠</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: '#111', letterSpacing: -1, marginBottom: 6, textAlign: 'center' }}>
        Welcome to<br />Mem<span style={{ color: '#FF4D6D' }}>Genius</span>
      </div>
      <div style={{ fontSize: 14, color: '#aaa', fontWeight: 700, marginBottom: 48, textAlign: 'center' }}>
        The association memory game.<br />Match pairs. Beat the world.
      </div>

      <div style={{ width: '100%' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#aaa', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
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
            borderRadius: 16, border: '2px solid #eee',
            background: '#fff', color: '#111',
            fontSize: 18, fontWeight: 800,
            fontFamily: 'inherit', marginBottom: 14,
            boxSizing: 'border-box', outline: 'none',
          }}
        />
        <button
          onClick={() => name.trim() && onCreate(name.trim())}
          disabled={!name.trim()}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 16, border: 'none',
            background: name.trim() ? 'linear-gradient(135deg, #FF4D6D, #ff8c00)' : '#eee',
            color: name.trim() ? 'white' : '#bbb',
            fontSize: 16, fontWeight: 900,
            fontFamily: 'inherit', cursor: name.trim() ? 'pointer' : 'default',
            boxShadow: name.trim() ? '0 8px 0 #ff4d6d40' : 'none',
          }}
        >
          Let's Play
        </button>
      </div>
    </div>
  )
}
