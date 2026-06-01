'use client'
import { useState, useEffect } from 'react'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GOLD = '#C8960C'

const SECTIONS = [
  {
    title: 'Compete',
    items: [
      { label: 'Championship', desc: 'Sunday Brain Championship', icon: `${BASE}/winner.png`, href: '/championship' },
      { label: 'Hall of Fame', desc: 'All-time champions', icon: `${BASE}/winner.png`, href: '/championship' },
      { label: 'Rankings', desc: 'World leaderboard by game', icon: `${BASE}/target.png`, href: '/rankings' },
    ]
  },
  {
    title: 'Learn',
    items: [
      { label: 'How to Improve', desc: 'Science behind brain training', icon: `${BASE}/brain-logo.webp`, href: '/how-to-improve-reaction-time' },
      { label: 'Reaction Time', desc: 'Test and improve your reactions', icon: `${BASE}/precision.png`, href: '/reaction-time-test' },
      { label: 'Memory Test', desc: 'Measure your working memory', icon: `${BASE}/memory.png`, href: '/memory-test' },
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

export default function MorePage() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'16px 16px 100px' }}>
      <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:20 }}>More</div>

      {SECTIONS.map(section => (
        <div key={section.title} style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:8, paddingLeft:4 }}>{section.title}</div>
          <div style={{ background:'#252525', borderRadius:16, overflow:'hidden' }}>
            {section.items.map((item, i) => (
              <a key={item.label} href={item.href} style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderBottom: i < section.items.length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ width:40, height:40, borderRadius:10, background:'#1A1A1A', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {item.icon
                    ? <img src={item.icon} style={{ width:24, height:24, objectFit:'contain' }} />
                    : <div style={{ fontSize:18 }}>⚙️</div>
                  }
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
