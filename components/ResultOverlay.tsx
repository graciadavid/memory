'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  const saved = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (saved.current) return
    if (!profile?.name) return
    saved.current = true
    supabase.from('scores').insert({
      pack_id: pack.id,
      player_name: profile.name,
      time_ms: ms,
      moves: 0,
    }).then(() => {
      recordGame(pack.slug, pack.pairs?.length || 6, worldRank || 999, ms)
    })
  }, [profile])

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  const diffColor = pack.difficulty === 1 ? '#00c853' : pack.difficulty === 2 ? '#ff8c00' : '#FF4D6D'
  const diffLabel = pack.difficulty === 1 ? 'Easy' : pack.difficulty === 2 ? 'Medium' : 'Hard'

  const share = async () => {
    const text = `🧠 MemGenius — I solved "${pack.title}" in ${fmt(ms)}!\nCan you beat me? 👉 https://memgenius.com`
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
          padding: '28px 22px', width: '100%', maxWidth: 340,
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}>
          <div style={{ fontSize: 44, marginBottom: 6 }}>🎉</div>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 3, color: diffColor, textTransform: 'uppercase', marginBottom: 6 }}>
            Completed · {diffLabel}
          </div>
          <div style={{ fontSize: 42, fontWeight: 700, color: '#111', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 16 }}>
            {fmt(ms)}
          </div>

          {/* Rank */}
          <div style={{
            background: `${diffColor}10`, border: `1px solid ${diffColor}30`,
            borderRadius: 16, padding: '14px', marginBottom: 20,
          }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: diffColor }}>
              {worldRank ? `#${worldRank} World` : '...'}
            </div>
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
              {pack.title}
            </div>
          </div>

          {/* Share */}
          <button onClick={share} style={{
            width: '100%', padding: '14px', borderRadius: 14, border: 'none',
            background: shared ? '#f0f0f0' : '#111',
            color: shared ? '#aaa' : 'white',
            fontSize: 14, fontWeight: 800, fontFamily: 'inherit',
            cursor: 'pointer', marginBottom: 12,
          }}>
            {shared ? 'Shared!' : 'Share my result'}
          </button>

          {/* Fun fact */}
          {lastFact && (
            <div style={{
              background: '#f8f8f8', border: '1px solid #eee',
              borderRadius: 14, padding: '12px 14px', marginBottom: 16, textAlign: 'left',
            }}>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, color: '#aaa', textTransform: 'uppercase', marginBottom: 4 }}>
                Did you know?
              </div>
              <div style={{ fontSize: 12, color: '#555', lineHeight: 1.5 }}>{lastFact}</div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onReset} style={{
              flex: 1, padding: '13px', borderRadius: 14, border: 'none',
              background: '#f0f0f0', color: '#555',
              fontSize: 13, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
            }}>
              Play again
            </button>
            <button onClick={() => router.push('/')} style={{
              flex: 1, padding: '13px', borderRadius: 14, border: 'none',
              background: diffColor, color: 'white',
              fontSize: 13, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
            }}>
              New game
            </button>
          </div>
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
          <div style={{ fontSize: 22 }}>🏠</div>
        </Link>
        <Link href="/ranking" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 22 }}>🏆</div>
        </Link>
        <Link href="/profile" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 22 }}>👤</div>
        </Link>
      </nav>
    </>
  )
}
