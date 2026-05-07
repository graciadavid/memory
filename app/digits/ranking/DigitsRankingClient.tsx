'use client'
import { useEffect, useState } from 'react'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const BLUE = '#1565C0'

export default function DigitsRankingClient({ scores }: { scores: { name: string, level: number, created_at: string }[] }) {
  const [myName, setMyName] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) setMyName(JSON.parse(stored).name || '')
  }, [])

  const myIndex = scores.findIndex(s => s.name === myName)
  const myScore = myIndex >= 0 ? scores[myIndex] : null

  const share = async (position: number, level: number) => {
    const text = `🔢 I'm #${position} in MemGenius Digits with ${level} digits!\nCan you beat me? 👉 https://memgenius.com/digits`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 90px 32px', padding: '0 16px 8px', gap: 6, flexShrink: 0 }}>
        {['#', 'Player', 'Level', ''].map((h, i) => (
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
                  <div style={{ fontSize: 13, fontWeight: 900, color: BLUE }}>{s.level} digits</div>
                  <div style={{ fontSize: 8, color: `${BROWN}35`, fontWeight: 700 }}>{new Date(s.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</div>
                </div>
                {isMe ? (
                  <button onClick={() => share(i + 1, s.level)} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: GOLD, color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
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
            <div style={{ fontSize: 12, fontWeight: 900, color: BLUE, textAlign: 'center' }}>{myScore.level} digits</div>
            <button onClick={(e) => { e.stopPropagation(); share(myIndex + 1, myScore.level) }} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: GOLD, color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
          </div>
        </div>
      )}
    </>
  )
}
