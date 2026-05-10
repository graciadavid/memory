'use client'
import { useEffect, useState } from 'react'

const GOLD = '#C8960C'
const BROWN = '#4A2C0A'
const PURPLE = '#4A148C'
const RED = '#E8002D'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

function RankingList({ scores, myName, isF1 }: { scores: any[], myName: string, isF1: boolean }) {
  const myIndex = scores.findIndex(s => s.name === myName)
  const myScore = myIndex >= 0 ? scores[myIndex] : null
  const color = isF1 ? RED : PURPLE

  const fmt = (diff: number) => isF1 ? `${diff}ms` : `${(diff/1000).toFixed(3)}s`

  const share = async (position: number, diff: number) => {
    const text = isF1
      ? `🏎️ I'm #${position} in MemGenius F1 with ${diff}ms reaction!\nhttps://memgenius.com/precision/formula1`
      : `⏱ I'm #${position} in MemGenius Precision with ${(diff/1000).toFixed(3)}s off!\nhttps://memgenius.com/precision/stopwatch`
    if (navigator.share) await navigator.share({ text })
    else { await navigator.clipboard.writeText(text); alert('Copied!') }
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 90px 32px', padding: '0 16px 8px', gap: 6, flexShrink: 0 }}>
        {['#', 'Player', isF1 ? 'Reaction' : 'Diff', ''].map((h, i) => (
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
                  <div style={{ fontSize: 13, fontWeight: 900, color }}>{fmt(s.diff)}</div>
                  <div style={{ fontSize: 8, color: `${BROWN}35`, fontWeight: 700 }}>{new Date(s.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</div>
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
            <div style={{ fontSize: 12, fontWeight: 900, color, textAlign: 'center' }}>{fmt(myScore.diff)}</div>
            <button onClick={(e) => { e.stopPropagation(); share(myIndex + 1, myScore.diff) }} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: GOLD, color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
          </div>
        </div>
      )}
    </>
  )
}

export default function PrecisionRankingClient({ stopScores, f1Scores }: { stopScores: any[], f1Scores: any[] }) {
  const [myName, setMyName] = useState('')
  const [tab, setTab] = useState<'stop' | 'f1'>('stop')

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) setMyName(JSON.parse(stored).name || '')
  }, [])

  const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', flexShrink: 0 }}>
        {[
          { key: 'stop', label: 'Stop', img: `${BASE}/precision.png`, color: '#4A148C' },
          { key: 'f1', label: 'Formula 1', img: `${BASE}/f1.png`, color: '#E8002D' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} style={{
            flex: 1, padding: '10px', borderRadius: 12, border: 'none',
            background: tab === t.key ? t.color : '#fff',
            color: tab === t.key ? '#fff' : `${BROWN}60`,
            fontSize: 13, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: tab === t.key ? `0 4px 0 ${t.color}60` : `0 2px 8px ${BROWN}08`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <img src={t.img} alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'stop' && <RankingList scores={stopScores} myName={myName} isF1={false} />}
      {tab === 'f1' && <RankingList scores={f1Scores} myName={myName} isF1={true} />}
    </div>
  )
}
