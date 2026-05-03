'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  ms: number
  pack: any
  worldRank: number | null
  lastFact: string
  onReset: () => void
}

export default function ResultOverlay({ ms, pack, worldRank, lastFact, onReset }: Props) {
  const [playerName, setPlayerName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  const difficultyLabel = pack.difficulty === 1 ? '🟢 Easy' : pack.difficulty === 2 ? '🟡 Medium' : '🔴 Hard'

  const submitScore = async () => {
    if (!playerName.trim()) return
    setSubmitting(true)
    await supabase.from('scores').insert({
      pack_id: pack.id,
      player_name: playerName.trim(),
      time_ms: ms,
      moves: 0,
    })
    setSubmitted(true)
    setSubmitting(false)
  }

  const share = async () => {
    const text = `🧠 PairIQ — I solved "${pack.title}" in ${fmt(ms)}! ${difficultyLabel}\nCan you beat me? 👉 https://memory-one-iota.vercel.app`
    if (navigator.share) {
      await navigator.share({ text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
      backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 100, padding: 20,
    }}>
      <div style={{
        background: '#0f0f1c', border: '2px solid #FF4D6D',
        borderRadius: 28, padding: '28px 22px',
        width: '100%', maxWidth: 340, textAlign: 'center',
        boxShadow: '0 20px 60px rgba(255,77,109,0.25)',
      }}>
        {/* Result */}
        <div style={{ fontSize: 44, marginBottom: 6 }}>🎉</div>
        <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: '#FF4D6D', textTransform: 'uppercase', marginBottom: 4 }}>
          Completed!
        </div>
        <div style={{ fontSize: 40, fontWeight: 700, color: 'white', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 4 }}>
          {fmt(ms)}
        </div>
        <div style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>
          {difficultyLabel} · #{pack.slug}
        </div>

        {/* Rank */}
        <div style={{
          background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)',
          borderRadius: 14, padding: '12px 14px', marginBottom: 12,
        }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#FF4D6D' }}>
            🏆 {worldRank ? `#${worldRank} World` : '...'}
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{pack.title}</div>
        </div>

        {/* Fun fact */}
        {lastFact && (
          <div style={{
            background: '#111120', border: '1px solid #1e1e35',
            borderRadius: 14, padding: '12px 14px', marginBottom: 14, textAlign: 'left',
          }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, color: '#6060ff', textTransform: 'uppercase', marginBottom: 6 }}>
              💡 Did you know?
            </div>
            <div style={{ fontSize: 12, color: '#aaa', lineHeight: 1.6 }}>{lastFact}</div>
          </div>
        )}

        {/* Name + submit */}
        {!submitted ? (
          <div style={{ marginBottom: 14 }}>
            <input
              type="text"
              placeholder="Your name"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              maxLength={20}
              style={{
                width: '100%', padding: '11px 14px',
                borderRadius: 12, border: '1px solid #2a2a40',
                background: '#111120', color: 'white',
                fontSize: 14, fontWeight: 700,
                fontFamily: 'inherit', marginBottom: 8,
                boxSizing: 'border-box', outline: 'none',
              }}
            />
            <button onClick={submitScore} disabled={submitting || !playerName.trim()} style={{
              width: '100%', padding: '12px', borderRadius: 12, border: 'none',
              background: playerName.trim() ? 'linear-gradient(135deg,#FF4D6D,#ff8c00)' : '#1a1a2e',
              color: playerName.trim() ? 'white' : '#444',
              fontSize: 13, fontWeight: 800, fontFamily: 'inherit',
              cursor: playerName.trim() ? 'pointer' : 'default',
            }}>
              {submitting ? 'Uploading...' : '🏆 Upload to Ranking'}
            </button>
          </div>
        ) : (
          <button onClick={share} style={{
            width: '100%', padding: '12px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg,#00b4d8,#0077b6)',
            color: 'white', fontSize: 13, fontWeight: 800,
            fontFamily: 'inherit', cursor: 'pointer', marginBottom: 14,
          }}>
            🔗 Share my result
          </button>
        )}

        {/* Again */}
        <button onClick={onReset} style={{
          width: '100%', padding: '12px 8px', borderRadius: 14, border: 'none',
          background: '#1a1a2e', color: '#666', fontSize: 13, fontWeight: 800,
          fontFamily: 'inherit', cursor: 'pointer',
        }}>↩️ Play again</button>
      </div>
    </div>
  )
}
