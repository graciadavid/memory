'use client'
import { useEffect, useState } from 'react'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const RED = '#E8002D'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export default function F1RankingClient({ scores }: { scores: any[] }) {
  const [myName, setMyName] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) setMyName(JSON.parse(stored).name || '')
  }, [])

  const myIndex = scores.findIndex(s => s.name === myName)
  const myScore = myIndex >= 0 ? scores[myIndex] : null

  const share = async (pos: number, diff: number) => {
    const text = `🏎️ I'm #${pos} in MemGenius F1 with ${diff}ms reaction!\nhttps://memgenius.com/precision/formula1`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  return (
    <main style={{
      height: '100dvh', background: 'linear-gradient(180deg, #FFEBEE 0%, #FAF7F2 100%)',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '24px 16px 12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={`${BASE}/f1.png`} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>Leaderboard</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: BROWN, letterSpacing: -1 }}>F1 Reaction</div>
          </div>
        </div>
        <a href="/precision/formula1" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: `1px solid ${BROWN}15`, borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 800, color: `${BROWN}60` }}>Back ✕</div>
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 90px 32px', padding: '0 16px 8px', gap: 6, flexShrink: 0 }}>
        {['#', 'Player', 'Time', ''].map((h, i) => (
          <div key={i} style={{ fontSize: 9, fontWeight: 900, color: `${BROWN}35`, letterSpacing: 2, textTransform: 'uppercase' }}>{h}</div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px', paddingBottom: myScore ? 140 : 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {scores.map((s, i) => {
            const isMe = s.name === myName
            return (
              <div key={s.name} id={isMe ? 'my-row' : undefined} style={{
                display: 'grid', gridTemplateColumns: '36px 1fr 90px 32px',
                alignItems: 'center', gap: 6,
                background: isMe ? `${GOLD}22` : i === 0 ? `${GOLD}08` : '#fff',
                border: `1px solid ${isMe ? GOLD + '60' : i === 0 ? GOLD + '20' : BROWN + '08'}`,
                borderRadius: 12, padding: '12px 10px',
              }}>
                <div style={{ fontSize: 13, fontWeight: 900, textAlign: 'center', color: i === 0 ? GOLD : i === 1 ? '#999' : i === 2 ? '#A0522D' : `${BROWN}30` }}>{i + 1}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: BROWN, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {s.name}
                  {isMe && <span style={{ fontSize: 8, color: GOLD, fontWeight: 900, background: `${GOLD}20`, padding: '1px 5px', borderRadius: 4 }}>YOU</span>}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: RED }}>{s.diff}ms</div>
                </div>
                {isMe ? (
                  <button onClick={() => share(i + 1, s.diff)} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: GOLD, color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
                ) : <div />}
              </div>
            )
          })}
        </div>
      </div>

      {myScore && (
        <div onClick={() => document.getElementById('my-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          style={{ position: 'fixed', bottom: 60, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '8px 10px', background: 'rgba(250,247,242,0.97)', backdropFilter: 'blur(16px)', borderTop: `2px solid ${GOLD}40`, zIndex: 40, boxSizing: 'border-box', cursor: 'pointer' }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5, paddingLeft: 4 }}>Your position · tap to find</div>
          <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 90px 32px', alignItems: 'center', gap: 6, background: `${GOLD}22`, border: `1px solid ${GOLD}60`, borderRadius: 12, padding: '10px 10px' }}>
            <div style={{ fontSize: 13, fontWeight: 900, textAlign: 'center', color: GOLD }}>{myIndex + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: BROWN }}>{myScore.name}</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: RED, textAlign: 'center' }}>{myScore.diff}ms</div>
            <button onClick={(e) => { e.stopPropagation(); share(myIndex + 1, myScore.diff) }} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: GOLD, color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
          </div>
        </div>
      )}
    </main>
  )
}
