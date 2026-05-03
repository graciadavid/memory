'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'

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
    const save = async () => {
      const { error } = await supabase.from('scores').insert({
        pack_id: pack.id,
        player_name: profile.name,
        time_ms: ms,
        moves: 0,
      })
      if (error) console.error('Score save error:', error)
      recordGame(pack.slug, pack.pairs?.length || 6, worldRank || 999, ms)
    }
    save()
  }, [profile?.name])

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2,'00')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
  }

  const diffLabel = pack.difficulty === 1 ? 'Easy' : pack.difficulty === 2 ? 'Medium' : 'Hard'
  const diffColor = pack.difficulty === 1 ? '#2E7D32' : pack.difficulty === 2 ? '#E65100' : '#B71C1C'

  const share = async () => {
    const text = `I solved "${pack.title}" in ${fmt(ms)} on MemGenius!\nCan you beat me? 👉 https://memgenius.com`
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
        position: 'fixed', inset: 0,
        background: 'rgba(74,44,10,0.5)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 20px 80px',
      }}>
        <div style={{
          background: CREAM,
          borderRadius: 28,
          padding: '32px 24px',
          width: '100%', maxWidth: 340,
          textAlign: 'center',
          boxShadow: `0 24px 60px ${BROWN}40`,
          border: `1px solid ${GOLD}30`,
        }}>

          {/* Label */}
          <div style={{
            fontSize: 10, fontWeight: 900, letterSpacing: 3,
            color: `${BROWN}60`, textTransform: 'uppercase', marginBottom: 8,
          }}>
            Your Time
          </div>

          {/* Time — hero */}
          <div style={{
            fontSize: 48, fontWeight: 900, color: BROWN,
            fontFamily: 'monospace', letterSpacing: 1, lineHeight: 1,
            marginBottom: 6,
          }}>
            {fmt(ms)}
          </div>

          {/* Difficulty + pack */}
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: `${BROWN}50`, marginBottom: 20,
          }}>
            <span style={{
              color: diffColor, fontWeight: 900,
              background: `${diffColor}15`,
              padding: '2px 8px', borderRadius: 6,
              marginRight: 6,
            }}>{diffLabel}</span>
            {pack.title}
          </div>

          {/* World rank */}
          <div style={{
            background: `linear-gradient(135deg, ${GOLD}18, ${BROWN}10)`,
            border: `1px solid ${GOLD}40`,
            borderRadius: 16, padding: '14px 20px', marginBottom: 20,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 800, color: `${BROWN}50`,
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4,
            }}>
              World Ranking
            </div>
            <div style={{
              fontSize: 32, fontWeight: 900, color: BROWN,
              letterSpacing: -1,
            }}>
              {worldRank ? `#${worldRank}` : '—'}
            </div>
          </div>

          {/* Fun fact */}
          {lastFact && (
            <div style={{
              background: '#fff',
              border: `1px solid ${BROWN}10`,
              borderRadius: 16, padding: '14px 16px',
              marginBottom: 20, textAlign: 'left',
            }}>
              <div style={{
                fontSize: 9, fontWeight: 900, letterSpacing: 2,
                color: GOLD, textTransform: 'uppercase', marginBottom: 6,
              }}>
                Did you know?
              </div>
              <div style={{ fontSize: 12, color: `${BROWN}80`, lineHeight: 1.6 }}>
                {lastFact}
              </div>
            </div>
          )}

          {/* Share */}
          <button onClick={share} style={{
            width: '100%', padding: '14px', borderRadius: 14, border: 'none',
            background: shared
              ? `${BROWN}15`
              : 'linear-gradient(135deg, #1877F2, #0a5dc2)',
            color: shared ? `${BROWN}60` : 'white',
            fontSize: 14, fontWeight: 800, fontFamily: 'inherit',
            cursor: 'pointer', marginBottom: 10,
            boxShadow: shared ? 'none' : '0 6px 0 #0a4a9960',
            transition: 'all 0.2s',
          }}>
            {shared ? 'Shared!' : 'Share my result'}
          </button>

          {/* Play again / New game */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onReset} style={{
              flex: 1, padding: '13px', borderRadius: 14,
              background: '#fff',
              border: `1px solid ${BROWN}15`,
              color: `${BROWN}70`, fontSize: 13, fontWeight: 800,
              fontFamily: 'inherit', cursor: 'pointer',
            }}>
              Play again
            </button>
            <button onClick={() => router.push('/')} style={{
              flex: 1, padding: '13px', borderRadius: 14, border: 'none',
              background: BROWN,
              color: 'white', fontSize: 13, fontWeight: 800,
              fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: `0 6px 0 ${BROWN}50`,
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
        background: 'rgba(250,247,242,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${BROWN}10`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '8px 0 22px', zIndex: 300,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}><div style={{ fontSize: 22 }}>🏠</div></Link>
        <Link href="/ranking" style={{ textDecoration: 'none' }}><div style={{ fontSize: 22 }}>🏆</div></Link>
        <Link href="/profile" style={{ textDecoration: 'none' }}><div style={{ fontSize: 22 }}>👤</div></Link>
      </nav>
    </>
  )
}
