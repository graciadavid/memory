'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

const TABS = [
  { key: 'memory', label: 'Memory', color: BROWN },
  { key: 'digits', label: 'Digits', color: '#1565C0' },
  { key: 'sequence', label: 'Simon Says', color: '#6A1B9A' },
  { key: 'flags', label: 'Flags', color: '#00796B' },
  { key: 'stop', label: 'Stop', color: '#4A148C' },
  { key: 'f1', label: 'F1', color: '#E8002D' },
  { key: 'population', label: 'Population', color: '#C62828' },
  { key: 'area', label: 'Area km²', color: '#B71C1C' },
]

function fmt(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const c = Math.floor((ms % 1000) / 10)
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(c).padStart(2,'0')}`
}

export default function GroupPageClient({ group, members, memberCount, bestMemory, bestDigits, bestSeq, bestFlags, bestPrecision, bestF1, bestVersusPop, bestVersusArea }: any) {
  const [tab, setTab] = useState('flags')
  const [myName, setMyName] = useState('')
  const [joined, setJoined] = useState(false)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) {
      const p = JSON.parse(stored)
      setMyName(p.name || '')
      const isMember = members.some((m: any) => m.player_name === p.name)
      setJoined(isMember)
    }
  }, [])

  const joinGroup = async () => {
    if (!myName || joining) return
    setJoining(true)
    await supabase.from('group_members').upsert({ group_id: group.id, player_name: myName })
    setJoined(true)
    setJoining(false)
    window.location.reload()
  }

  const share = async () => {
    const url = `${window.location.origin}/g/${group.slug || group.id}`
    const text = `Join my group "${group.name}" on MemGenius! Compete with me in Memory, Digits, Sequence and Flags 🧠`
    if (navigator.share) await navigator.share({ title: group.name, text, url })
    else { await navigator.clipboard.writeText(`${text}\n${url}`); alert('Link copied!') }
  }

  const getRanking = () => {
    const memberNames = members.map((m: any) => m.player_name)
    switch(tab) {
      case 'memory':
        return memberNames
          .filter((n: string) => bestMemory[n])
          .map((n: string) => ({ name: n, score: fmt(bestMemory[n]), raw: bestMemory[n] }))
          .sort((a: any, b: any) => a.raw - b.raw)
      case 'digits':
        return memberNames
          .filter((n: string) => bestDigits[n])
          .map((n: string) => ({ name: n, score: `Level ${bestDigits[n]}`, raw: bestDigits[n] }))
          .sort((a: any, b: any) => b.raw - a.raw)
      case 'sequence':
        return memberNames
          .filter((n: string) => bestSeq[n])
          .map((n: string) => ({ name: n, score: `Level ${bestSeq[n]}`, raw: bestSeq[n] }))
          .sort((a: any, b: any) => b.raw - a.raw)
      case 'flags':
        return memberNames
          .filter((n: string) => bestFlags[n])
          .map((n: string) => ({ name: n, score: `${bestFlags[n]} flags`, raw: bestFlags[n] }))
          .sort((a: any, b: any) => b.raw - a.raw)
      case 'stop':
        return memberNames
          .filter((n: string) => bestPrecision?.[n] !== undefined)
          .map((n: string) => ({ name: n, score: `${(bestPrecision?.[n]/1000).toFixed(3)}s`, raw: bestPrecision?.[n] }))
          .sort((a: any, b: any) => a.raw - b.raw)
      case 'f1':
        return memberNames
          .filter((n: string) => bestF1?.[n] !== undefined)
          .map((n: string) => ({ name: n, score: `${bestF1?.[n]}ms`, raw: bestF1?.[n] }))
          .sort((a: any, b: any) => a.raw - b.raw)
      case 'population':
        return memberNames
          .filter((n: string) => bestVersusPop?.[n] !== undefined)
          .map((n: string) => ({ name: n, score: `${bestVersusPop?.[n]} correct`, raw: bestVersusPop?.[n] }))
          .sort((a: any, b: any) => b.raw - a.raw)
      case 'area':
        return memberNames
          .filter((n: string) => bestVersusArea?.[n] !== undefined)
          .map((n: string) => ({ name: n, score: `${bestVersusArea?.[n]} correct`, raw: bestVersusArea?.[n] }))
          .sort((a: any, b: any) => b.raw - a.raw)
      default: return []
    }
  }

  const ranking = getRanking()
  const activeTab = TABS.find(t => t.key === tab)!

  return (
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, #FFF8E1 0%, ${CREAM} 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '0 0 100px',
    }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1A3A5C, #1565C0)', padding: '28px 20px 24px' }}>
        <a href="/profile" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 800, textDecoration: 'none' }}>← Profile</a>
        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginTop: 12, marginBottom: 4 }}>Group</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{group.name}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{memberCount} member{memberCount !== 1 ? 's' : ''}</div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button onClick={share} style={{
            flex: 1, padding: '13px', borderRadius: 14, border: 'none',
            background: '#2E7D32', color: '#fff',
            fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 5px 0 #1B5E2060',
          }}>Invite friends</button>

          {!joined && myName && (
            <button onClick={joinGroup} disabled={joining} style={{
              flex: 1, padding: '13px', borderRadius: 14, border: 'none',
              background: BROWN, color: '#fff',
              fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: `0 5px 0 ${BROWN}60`,
            }}>{joining ? '...' : 'Join group'}</button>
          )}
        </div>



        {/* Ranking tabs */}
        <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Ranking</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '10px 4px', borderRadius: 12, border: 'none',
              background: tab === t.key ? t.color : '#fff',
              color: tab === t.key ? '#fff' : `${BROWN}60`,
              fontSize: 11, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: tab === t.key ? `0 4px 0 ${t.color}60` : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Ranking list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ranking.length === 0 ? (
            <div style={{ textAlign: 'center', color: `${BROWN}30`, fontSize: 14, fontWeight: 700, padding: '40px 0' }}>
              No scores yet — play to appear here!
            </div>
          ) : ranking.map((r: any, i: number) => (
            <div key={r.name} style={{
              background: r.name === myName ? `${GOLD}22` : i === 0 ? `${GOLD}08` : '#fff',
              border: `1px solid ${r.name === myName ? GOLD + '60' : i === 0 ? GOLD + '20' : BROWN + '08'}`,
              borderRadius: 12, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: i === 0 ? GOLD : i === 1 ? '#999' : i === 2 ? '#A0522D' : `${BROWN}30`, width: 24 }}>{i + 1}</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 800, color: BROWN }}>
                {r.name}{r.name === myName ? ' 👤' : ''}
              </div>
              <div style={{ fontSize: 14, fontWeight: 900, color: activeTab.color }}>{r.score}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
