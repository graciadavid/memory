'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

interface Props {
  ms: number
  pack: any
  worldRank: number | null
  lastFact: string
  onReset: () => void
}

export default function ResultOverlay({ ms, pack, worldRank, lastFact, onReset }: Props) {
  const { profile, recordGame } = usePlayer()
  const [shared, setShared] = useState(false)

  useEffect(() => {
    if (!profile?.name) return
    supabase.from('scores').insert({
      pack_id: pack.id,
      player_name: profile.name,
      time_ms: ms,
      moves: 0,
    })
    recordGame(pack.slug, pack.pairs?.length || 6, worldRank || 999, ms)
  }, [])

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  const diffColor = pack.difficulty === 1 ? '#00c853' : pack.difficulty === 2 ? '#ff8c00' : '#FF4D6D'
  const diffLabel = pack.difficulty === 1 ? '🟢 Easy' : pack.difficulty === 2 ? '🟡 Medium' : '🔴 Hard'

  const share = async () => {
    const text = `🧠 PairIQ — I solved "${pack.title}" in ${fmt(ms)}! ${diffLabel}\nCan you beat me? 👉 https://memory-one-iota.vercel.app`
    if (navigator.share) {
      await navigator.share({ text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Copied!')
    }
    setShared(true)
  }

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 20px 80px',
      }}>
        <div style={{
          background: '#fff', borderRadius: 28,
          padding: '24px 20px', width: '100%', maxWidth: 340,
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 4 }}>🎉</div>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: diffColor, textTransform: 'uppercase', marginBottom: 4 }}>
            Completed!
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, color: '#111', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 2 }}>
            {fmt(ms)}
          </div>
          <div style={{ fontSize: 11, color: '#aaa', marginBottom: 14 }}>
            {diffLabel} · #{pack.slug}
          </div>

          {/* Rank */}
          <div style={{
            background: `${diffColor}10`, border: `1px solid ${diffColor}30`,
            borderRadius: 14, padding: '10px 14px', marginBottom: 10,
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: diffColor }}>
              🏆 {worldRank ? `#${worldRank} World` : '...'}
            </div>
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{pack.title}</div>
          </div>

          {/* Saved confirmation */}
          <div style={{
            fontSize: 12, color: '#00c853', fontWeight: 700, marginBottom: 12,
          }}>
            ✅ Saved as {profile?.name}
          </div>

          {/* Fun fact */}
          {lastFact && (
            <div style={{
              background: '#f8f8f8', border: '1px solid #eee',
              borderRadius: 14, padding: '10px 14px', marginBottom: 14, textAlign: 'left',
            }}>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, color: '#aaa', textTransform: 'uppercase', marginBottom: 4 }}>
                💡 Did you know?
              </div>
              <div style={{ fontSize: 12, color: '#555', lineHeight: 1.5 }}>{lastFact}</div>
            </div>
          )}

          {/* Share */}
          <button onClick={share} style={{
            width: '100%', padding: '12px', borderRadius: 12, border: 'none',
            background: shared ? '#eee' : '#111',
            color: shared ? '#aaa' : 'white',
            fontSize: 13, fontWeight: 800, fontFamily: 'inherit',
            cursor: 'pointer', marginBottom: 10,
          }}>
            {shared ? '✅ Shared!' : '🔗 Share my result'}
          </button>

          <button onClick={onReset} style={{
            width: '100%', padding: '11px', borderRadius: 12, border: 'none',
            background: '#f0f0f0', color: '#888', fontSize: 13, fontWeight: 800,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>↩️ Play again</button>
        </div>
      </div>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: 'rgba(30,30,30,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid #333',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '6px 0 16px',
        zIndex: 300,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 20 }}>🏠</div>
        </Link>
        <Link href="/ranking" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 20 }}>🏆</div>
        </Link>
        <Link href="/profile" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 20 }}>👤</div>
        </Link>
      </nav>
    </>
  )
}
