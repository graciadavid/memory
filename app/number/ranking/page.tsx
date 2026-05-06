'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const BLUE = '#1565C0'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

export default function NumberRankingPage() {
  const { profile } = usePlayer()
  const [scores, setScores] = useState<{ name: string, level: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('number_scores')
        .select('player_name, level')
        .order('level', { ascending: false })
        .limit(200)

      if (data) {
        const best: Record<string, number> = {}
        data.forEach(s => {
          if (!best[s.player_name] || s.level > best[s.player_name]) {
            best[s.player_name] = s.level
          }
        })
        const sorted = Object.entries(best)
          .map(([name, level]) => ({ name, level }))
          .sort((a, b) => b.level - a.level)
        setScores(sorted)
      }
      setLoading(false)
    }
    fetch()
  }, [])

  const myIndex = scores.findIndex(s => s.name === profile?.name)
  const myScore = myIndex >= 0 ? scores[myIndex] : null

  const share = async (position: number, level: number) => {
    const text = `🔢 I'm #${position} in NumGenius with ${level} digits!\nCan you beat me? 👉 https://memgenius.com/number`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  return (
    <main style={{
      height: '100dvh',
      background: `linear-gradient(180deg, #EEF4FF 0%, ${CREAM} 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 16px 12px', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: BLUE, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
          Leaderboard
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: BROWN, letterSpacing: -1 }}>
          NumGenius Ranking
        </div>
      </div>

      {/* Headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '36px 1fr 80px 32px',
        padding: '0 16px 8px', gap: 6, flexShrink: 0,
      }}>
        {['#', 'Player', 'Digits', ''].map((h, i) => (
          <div key={i} style={{ fontSize: 9, fontWeight: 900, color: `${BROWN}35`, letterSpacing: 2, textTransform: 'uppercase' }}>{h}</div>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px', paddingBottom: myScore ? 140 : 80 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: `${BROWN}40`, marginTop: 60, fontSize: 14 }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {scores.map((s, i) => {
              const isMe = s.name === profile?.name
              return (
                <div key={s.name} id={isMe ? 'my-row' : undefined} style={{
                  display: 'grid', gridTemplateColumns: '36px 1fr 80px 32px',
                  alignItems: 'center', gap: 6,
                  background: isMe ? `${GOLD}22` : i === 0 ? `${GOLD}08` : '#fff',
                  border: `1px solid ${isMe ? GOLD + '60' : i === 0 ? GOLD + '20' : BROWN + '08'}`,
                  borderRadius: 12, padding: '12px 10px',
                  boxShadow: isMe ? `0 4px 16px ${GOLD}25` : `0 1px 4px ${BROWN}06`,
                }}>
                  <div style={{
                    fontSize: 13, fontWeight: 900, textAlign: 'center',
                    color: i === 0 ? GOLD : i === 1 ? '#999' : i === 2 ? '#A0522D' : `${BROWN}30`,
                  }}>{i + 1}</div>
                  <div style={{
                    fontSize: 13, fontWeight: 800, color: BROWN,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {s.name}
                    {isMe && <span style={{ fontSize: 8, color: GOLD, fontWeight: 900, background: `${GOLD}20`, padding: '1px 5px', borderRadius: 4 }}>YOU</span>}
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: 900, color: BLUE, textAlign: 'center',
                  }}>{s.level} digits</div>
                  {isMe ? (
                    <button onClick={() => share(i + 1, s.level)} style={{
                      width: 26, height: 26, borderRadius: 7, border: 'none',
                      background: GOLD, color: '#fff', fontSize: 11,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>↑</button>
                  ) : <div />}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Sticky my position */}
      {myScore && (
        <div onClick={() => document.getElementById('my-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          style={{
            position: 'fixed', bottom: 60,
            left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430,
            padding: '8px 10px',
            background: 'rgba(250,247,242,0.97)',
            backdropFilter: 'blur(16px)',
            borderTop: `2px solid ${GOLD}40`,
            zIndex: 40, boxSizing: 'border-box', cursor: 'pointer',
          }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5, paddingLeft: 4 }}>
            Your position · tap to find
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '36px 1fr 80px 32px',
            alignItems: 'center', gap: 6,
            background: `${GOLD}22`, border: `1px solid ${GOLD}60`,
            borderRadius: 12, padding: '10px 10px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 900, textAlign: 'center', color: GOLD }}>{myIndex + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: BROWN }}>{myScore.name}</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: BLUE, textAlign: 'center' }}>{myScore.level} digits</div>
            <div />
          </div>
        </div>
      )}

      {/* Back button */}
      <Link href="/number" style={{
        position: 'fixed', top: 16, left: 16,
        textDecoration: 'none', zIndex: 50,
      }}>
        <div style={{
          background: '#fff', border: `1px solid ${BROWN}15`,
          borderRadius: 10, padding: '6px 12px',
          fontSize: 12, fontWeight: 800, color: `${BROWN}60`,
        }}>← Back</div>
      </Link>
    </main>
  )
}
