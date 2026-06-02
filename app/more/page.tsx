'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#C8960C'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const SECTIONS = [
  {
    title: 'Compete',
    items: [
      { label: 'Championship', desc: 'Sunday Brain Championship', icon: `${BASE}/winner.png`, href: '/championship' },
      { label: 'Rankings', desc: 'World leaderboard by game', icon: `${BASE}/target.png`, href: '/rankings' },
    ]
  },
  {
    title: 'Learn',
    items: [
      { label: 'Reaction Time Test', desc: 'Test and improve your reactions', icon: `${BASE}/precision.png`, href: '/reaction-time-test' },
      { label: 'Memory Test', desc: 'Measure your working memory', icon: `${BASE}/memory.png`, href: '/memory-test' },
      { label: 'Flag Quiz', desc: 'Test your knowledge of world flags', icon: `${BASE}/flags.png`, href: '/flag-quiz' },
      { label: 'World Capitals Quiz', desc: 'Name the capital of every country', icon: `${BASE}/capitals.png`, href: '/world-capitals-quiz' },
    ]
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', desc: 'Your stats and rankings', icon: `${BASE}/nav-profile.webp`, href: '/profile' },
      { label: 'Settings', desc: 'Change name, PIN or avatar', icon: null, href: '/settings' },
    ]
  },
]

function WorldRankingWidget() {
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('global_rankings').select('*').order('world_rank', { ascending: true }).limit(10)
      .then(({ data }: any) => { if (data) setPlayers(data); setLoading(false) })
  }, [])

  return (
    <div style={{ background:'#252525', borderRadius:16, overflow:'hidden', marginBottom:24 }}>
      <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:10 }}>
        <img src={`${BASE}/winner.png`} style={{ width:28, height:28, objectFit:'contain' }} />
        <div style={{ fontSize:16, fontWeight:900, color:'#fff' }}>World Ranking</div>
      </div>
      {loading && <div style={{ padding:20, textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:13 }}>Loading...</div>}
      {players.map((p, i) => (
        <div key={p.player_name} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize:14, fontWeight:900, color: i===0?GOLD:i===1?'#aaa':i===2?'#cd7f32':'rgba(255,255,255,0.3)', width:28, textAlign:'center' }}>
            {i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+p.world_rank}
          </div>
          <div style={{ flex:1, fontSize:14, fontWeight:800, color:'#fff' }}>{p.player_name}</div>
          <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>Top {p.top_pct}%</div>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)' }}>{p.games_played}g</div>
        </div>
      ))}
    </div>
  )
}

export default function MorePage() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px', fontFamily:'var(--font-nunito),sans-serif' }}>
      <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:20 }}>More</div>

      <WorldRankingWidget />

      {SECTIONS.map(section => (
        <div key={section.title} style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:8, paddingLeft:4 }}>{section.title}</div>
          <div style={{ background:'#252525', borderRadius:16, overflow:'hidden' }}>
            {section.items.map((item, i) => (
              <a key={item.label} href={item.href} style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderBottom: i < section.items.length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ width:40, height:40, borderRadius:10, background:'#1A1A1A', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {item.icon ? <img src={item.icon} style={{ width:24, height:24, objectFit:'contain' }} /> : <div style={{ fontSize:18 }}>⚙️</div>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:800, color:'#fff' }}>{item.label}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.4)' }}>{item.desc}</div>
                </div>
                <div style={{ fontSize:18, color:'rgba(255,255,255,0.2)' }}>›</div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {profile && (
        <button onClick={() => { localStorage.removeItem('memgenius_profile'); window.location.reload() }}
          style={{ width:'100%', padding:'14px', borderRadius:14, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.4)', fontSize:14, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer' }}>
          Log out
        </button>
      )}
    </main>
  )
}
