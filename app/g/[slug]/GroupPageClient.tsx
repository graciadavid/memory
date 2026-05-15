'use client'
import { useState, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const TABS = [
  { key: 'memory', label: 'Memory', color: '#4A2C0A' },
  { key: 'digits', label: 'Digits', color: '#1565C0' },
  { key: 'sequence', label: 'Sequence', color: '#6A1B9A' },
  { key: 'flags', label: 'Flags', color: '#00796B' },
  { key: 'precision', label: 'Precision', color: '#4A148C' },
  { key: 'versus', label: 'Versus', color: '#C62828' },
]

function fmt(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const c = Math.floor((ms % 1000) / 10)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
}

export default function GroupPageClient({ group, members, memberCount, bestMemory, bestDigits, bestSeq, bestFlags, bestPrecision, bestVersus }: any) {
  const { profile } = usePlayer()
  const [tab, setTab] = useState('memory')

  const getRanking = () => {
    const memberNames = members.map((m: any) => m.player_name)
    switch (tab) {
      case 'memory':
        return memberNames
          .filter((n: string) => bestMemory[n] !== undefined)
          .map((n: string) => ({ name: n, score: fmt(bestMemory[n]), raw: bestMemory[n] }))
          .sort((a: any, b: any) => a.raw - b.raw)
      case 'digits':
        return memberNames
          .filter((n: string) => bestDigits[n] !== undefined)
          .map((n: string) => ({ name: n, score: `Level ${bestDigits[n]}`, raw: bestDigits[n] }))
          .sort((a: any, b: any) => b.raw - a.raw)
      case 'sequence':
        return memberNames
          .filter((n: string) => bestSeq[n] !== undefined)
          .map((n: string) => ({ name: n, score: `Level ${bestSeq[n]}`, raw: bestSeq[n] }))
          .sort((a: any, b: any) => b.raw - a.raw)
      case 'flags':
        return memberNames
          .filter((n: string) => bestFlags[n] !== undefined)
          .map((n: string) => ({ name: n, score: `${bestFlags[n]} flags`, raw: bestFlags[n] }))
          .sort((a: any, b: any) => b.raw - a.raw)
      case 'precision':
        return memberNames
          .filter((n: string) => bestPrecision[n] !== undefined)
          .map((n: string) => ({ name: n, score: `${(bestPrecision[n]/1000).toFixed(3)}s`, raw: bestPrecision[n] }))
          .sort((a: any, b: any) => a.raw - b.raw)
      case 'versus':
        return memberNames
          .filter((n: string) => bestVersus[n] !== undefined)
          .map((n: string) => ({ name: n, score: `${bestVersus[n]} correct`, raw: bestVersus[n] }))
          .sort((a: any, b: any) => b.raw - a.raw)
      default: return []
    }
  }

  const ranking = getRanking()
  const myName = profile?.name || ''

  const shareGroup = () => {
    const url = `${window.location.origin}/g/${group.slug || group.id}`
    const text = `🧠 Join "${group.name}" on MemGenius and compete with me!\n${url}`
    if (navigator.share) navigator.share({ text })
    else navigator.clipboard.writeText(url).then(() => alert('Link copied!'))
  }

  return (
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, #FFF8E1 0%, ${CREAM} 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      paddingBottom: 100,
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A3A5C, #1565C0)',
        padding: '28px 20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Group</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{group.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{memberCount} member{memberCount !== 1 ? 's' : ''}</div>
          </div>
          <button onClick={shareGroup} style={{
            padding: '10px 16px', borderRadius: 12, border: 'none',
            background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 800,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>Invite 📲</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '16px 16px 8px', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 14px', borderRadius: 20, border: 'none', flexShrink: 0,
            background: tab === t.key ? t.color : '#fff',
            color: tab === t.key ? '#fff' : `${BROWN}60`,
            fontSize: 12, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: tab === t.key ? `0 4px 0 ${t.color}50` : `0 2px 8px ${BROWN}08`,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Ranking */}
      <div style={{ padding: '8px 16px' }}>
        {ranking.length === 0 ? (
          <div style={{ textAlign: 'center', color: `${BROWN}30`, fontSize: 14, fontWeight: 700, padding: '40px 0' }}>
            No scores yet. Play {TABS.find(t => t.key === tab)?.label} to appear here!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ranking.map((r: any, i: number) => {
              const isMe = r.name === myName
              return (
                <div key={r.name} style={{
                  display: 'grid', gridTemplateColumns: '36px 1fr auto',
                  alignItems: 'center', gap: 10,
                  background: isMe ? `${GOLD}22` : i === 0 ? `${GOLD}08` : '#fff',
                  border: `1px solid ${isMe ? GOLD + '60' : i === 0 ? GOLD + '20' : BROWN + '08'}`,
                  borderRadius: 14, padding: '14px 12px',
                }}>
                  <div style={{ fontSize: 15, fontWeight: 900, textAlign: 'center', color: i === 0 ? GOLD : i === 1 ? '#999' : i === 2 ? '#A0522D' : `${BROWN}30` }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: BROWN, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {r.name}
                    {isMe && <span style={{ fontSize: 8, color: GOLD, fontWeight: 900, background: `${GOLD}20`, padding: '1px 5px', borderRadius: 4 }}>YOU</span>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: TABS.find(t => t.key === tab)?.color }}>{r.score}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
