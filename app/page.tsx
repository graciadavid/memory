'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const GREEN = '#2E7D32'
const CREAM = '#FAF7F2'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export default function HomePage() {
  const [top5, setTop5] = useState<{ name: string, diff: number }[]>([])

  useEffect(() => {
    supabase.from('precision_scores')
      .select('player_name, difference_ms')
      .is('game_type', null)
      .order('difference_ms', { ascending: true })
      .limit(200)
      .then(({ data }) => {
        if (!data) return
        const best: Record<string, number> = {}
        data.forEach((s: any) => {
          if (!best[s.player_name] || s.difference_ms < best[s.player_name])
            best[s.player_name] = s.difference_ms
        })
        setTop5(Object.entries(best).map(([n, d]) => ({ name: n, diff: d })).sort((a, b) => a.diff - b.diff).slice(0, 5))
      })
  }, [])

  return (
    <main style={{ height: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', padding: '0 20px 80px', overflow: 'hidden' }}>

      <div style={{ paddingTop: 32, paddingBottom: 20, textAlign: 'center' }}>
        <img src={`${BASE}/memgeniuslogofull.png`} alt="MemGenius" style={{ height: 28, objectFit: 'contain', marginBottom: 10 }} />
        <div style={{ fontSize: 14, color: `${BROWN}50`, fontWeight: 700 }}>Every day, one game.</div>
        <div style={{ fontSize: 14, color: `${BROWN}50`, fontWeight: 700 }}>Compete with the world.</div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #4A148C, #7B1FA2)', borderRadius: 24, padding: '20px', boxShadow: '0 8px 0 #4A148C60' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <img src={`${BASE}/precision.png`} style={{ width: 52, height: 52, objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Stop</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Stop exactly at 5.000s</div>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: '12px', marginBottom: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Top Players</div>
          {top5.map((p, i) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: i === 0 ? GOLD : 'rgba(255,255,255,0.3)', width: 16 }}>{i+1}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 800, color: '#fff' }}>{p.name}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: i === 0 ? GOLD : 'rgba(255,255,255,0.6)' }}>{(p.diff/1000).toFixed(3)}s</div>
            </div>
          ))}
        </div>

        <a href="/stop" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ background: GREEN, borderRadius: 16, padding: '16px', textAlign: 'center', fontWeight: 900, fontSize: 18, color: '#fff', boxShadow: '0 6px 0 #1B5E2060' }}>
            Play →
          </div>
        </a>
      </div>

    </main>
  )
}
