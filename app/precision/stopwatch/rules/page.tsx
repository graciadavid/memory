'use client'
import { useState, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const PURPLE = '#4A148C'
const CREAM = '#FAF7F2'

export default function StopRulesPage() {
  const { profile } = usePlayer()
  const [worldRecord, setWorldRecord] = useState<{ diff: number, name: string } | null>(null)
  const [myBest, setMyBest] = useState<number | null>(null)
  const [lastResult, setLastResult] = useState<{ difference: number } | null>(null)
  const [f1Unlocked, setF1Unlocked] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('stop_last_result')
    if (stored) { setLastResult(JSON.parse(stored)); sessionStorage.removeItem('stop_last_result') }

    supabase.from('precision_scores').select('player_name, difference_ms')
      .is('game_type', null).order('difference_ms', { ascending: true }).limit(1)
      .then(({ data }) => { if (data?.[0]) setWorldRecord({ diff: data[0].difference_ms, name: data[0].player_name }) })

    if (!profile?.name) return

    supabase.from('precision_scores').select('difference_ms')
      .is('game_type', null).eq('player_name', profile.name)
      .order('difference_ms', { ascending: true }).limit(1)
      .then(({ data }) => { if (data?.[0]) setMyBest(data[0].difference_ms) })

    supabase.from('precision_scores').select('difference_ms')
      .is('game_type', null).eq('player_name', profile.name)
      .lt('difference_ms', 500).limit(1)
      .then(({ data }) => setF1Unlocked(!!(data && data.length > 0)))
  }, [profile?.name])

  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ background: `linear-gradient(135deg, ${PURPLE}, #7B1FA2)`, borderRadius: 24, padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 8px 0 ${PURPLE}60` }}>
          <img src="/icons/precision.png" style={{ width: 80, height: 80, objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>Stop</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginTop: 2 }}>Stop exactly at 5 seconds</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* 3 boxes */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, textAlign: 'center', background: `${GOLD}15`, borderRadius: 16, padding: '14px 6px' }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: GOLD, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>World Record</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: GOLD }}>{worldRecord ? `${(worldRecord.diff/1000).toFixed(3)}s` : '—'}</div>
            {worldRecord && <div style={{ fontSize: 9, color: `${BROWN}50`, fontWeight: 700, marginTop: 2 }}>{worldRecord.name}</div>}
          </div>
          <div style={{ flex: 1, textAlign: 'center', background: `${PURPLE}15`, borderRadius: 16, padding: '14px 6px' }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: PURPLE, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Your Best</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: PURPLE }}>{myBest !== null ? `${(myBest/1000).toFixed(3)}s` : '—'}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', background: lastResult ? '#E8F5E9' : `${BROWN}08`, borderRadius: 16, padding: '14px 6px' }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: `${BROWN}40`, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Last Play</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: lastResult ? (Math.abs(lastResult.difference) < 100 ? '#2E7D32' : Math.abs(lastResult.difference) < 500 ? '#E65100' : '#B71C1C') : `${BROWN}20` }}>
              {lastResult ? `${lastResult.difference > 0 ? '+' : ''}${(lastResult.difference/1000).toFixed(3)}s` : '—'}
            </div>
          </div>
        </div>

        {/* Next unlock */}
        {!f1Unlocked && <div style={{ background: '#fff', borderRadius: 20, padding: '18px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Next Unlock</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src="/icons/f1.png" style={{ width: 56, height: 56, objectFit: 'contain', filter: f1Unlocked ? 'none' : 'grayscale(80%)', opacity: f1Unlocked ? 1 : 0.4 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 4 }}>F1 Reaction</div>
              {f1Unlocked ? (
                <div style={{ fontSize: 12, color: '#2E7D32', fontWeight: 800 }}>✅ Unlocked!</div>
              ) : (
                <>
                  <div style={{ fontSize: 12, color: `${BROWN}60`, fontWeight: 700, marginBottom: 6 }}>Stop in less than 0.500s off</div>
                  <div style={{ background: `${BROWN}10`, borderRadius: 8, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: myBest !== null ? `${Math.min(100, Math.round((500 / myBest) * 50))}%` : '0%', height: '100%', background: GOLD, borderRadius: 8 }} />
                  </div>
                  <div style={{ fontSize: 10, color: `${BROWN}40`, fontWeight: 700, marginTop: 4 }}>
                    {myBest !== null ? `Best: ${(myBest/1000).toFixed(3)}s · Target: 0.500s` : 'Play to track progress'}
                  </div>
                </>
              )}
            </div>
            {!f1Unlocked && <div style={{ fontSize: 24 }}>🔒</div>}
          </div>
        </div>}

        {/* Play */}
        <a href="/precision/stopwatch?autostart=true" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#2E7D32', borderRadius: 20, padding: '20px', textAlign: 'center', boxShadow: '0 8px 0 #1B5E2060' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>Play →</div>
          </div>
        </a>

      </div>
    </main>
  )
}
