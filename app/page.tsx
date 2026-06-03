'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'
const GOLD = '#C8960C'

export default function Home() {
 const [splash, setSplash] = useState(true)
 const [profile, setProfile] = useState<any>(null)
 const [champWeek, setChampWeek] = useState<any>(null)
 const [countdown, setCountdown] = useState('')

 useEffect(() => {
   const t = setTimeout(() => setSplash(false), 2000)
   return () => clearTimeout(t)
 }, [])

 useEffect(() => {
   const stored = localStorage.getItem('memgenius_profile')
   if (stored) setProfile(JSON.parse(stored))
   supabase.from('championship_weeks').select('*').eq('active', true).single()
     .then(({ data }: any) => { if (data) setChampWeek(data) })
 }, [])

 useEffect(() => {
   if (!champWeek) return
   const tick = () => {
     const end = new Date(champWeek.sunday_date + 'T23:59:59Z')
     const now = new Date()
     const diff = end.getTime() - now.getTime()
     if (diff <= 0) { setCountdown('LIVE'); return }
     const d = Math.floor(diff / 86400000)
     const h = Math.floor((diff % 86400000) / 3600000)
     const m = Math.floor((diff % 3600000) / 60000)
     const s = Math.floor((diff % 60000) / 1000)
     setCountdown(d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`)
   }
   tick()
   const t = setInterval(tick, 1000)
   return () => clearInterval(t)
 }, [champWeek])

 const GAME_ICONS: Record<string,string> = {
   stop: `${BASE}/precision.png`,
   blink: `${BASE}/blink.png`,
   capitals: `${BASE}/capitals.png`,
   flags: `${BASE}/flags.png`,
   pendulum: `${BASE}/pendulum.png`,
   digits: `${BASE}/digits.png`,
   nback: `${BASE}/nback.png`,
   ace: `${BASE}/padel.png`,
   'letter-rain': `${BASE}/rain.png`,
   mastermind: `${BASE}/mastermind.png`,
 }

 if (splash) return (
   <main style={{ height: '100dvh', background: '#1A1A1A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
     <img src={`${BASE}/brain-logo.webp`} style={{ width: 80, height: 80, objectFit: 'contain' }} />
     <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>MemGenius</div>
     <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 }}>Train your brain. Beat the world.</div>
   </main>
 )

 return (
   <main style={{ minHeight: '100dvh', background: '#1A1A1A', padding: '16px 16px 100px' }}>

     {/* NO PROFILE — solo mostrar create profile */}
     {!profile && (
       <a href="/profile" style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}>
         <div style={{ background: GREEN, borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', boxShadow: '0 4px 0 #1B5E20' }}>
           <div style={{ width: 100, height: 100, flexShrink: 0, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <img src={`${BASE}/brain-logo.webp`} style={{ width: 56, height: 56, objectFit: 'contain' }} />
           </div>
           <div style={{ padding: '14px 16px', flex: 1 }}>
             <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Free · No email</div>
             <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Create your profile</div>
             <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Rank globally in 22 games →</div>
           </div>
           <div style={{ paddingRight: 16, fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>›</div>
         </div>
       </a>
     )}

     {/* CON PROFILE — Training */}
     {profile && (
       <a href="/training" style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}>
         <div style={{ background: '#252525', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
           <div style={{ width: 100, height: 100, flexShrink: 0, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <img src={`${BASE}/brain-logo.webp`} style={{ width: 56, height: 56, objectFit: 'contain' }} />
           </div>
           <div style={{ padding: '14px 16px', flex: 1 }}>
             <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Training</div>
             <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Train your Brain</div>
             <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>22 games · 4 categories</div>
           </div>
           <div style={{ paddingRight: 16, fontSize: 18, color: 'rgba(255,255,255,0.3)' }}>›</div>
         </div>
       </a>
     )}

     {/* Championship — siempre visible */}
     {champWeek && (
       <a href="/championship" style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}>
         <div style={{ background: '#252525', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
           <div style={{ width: 100, height: 100, flexShrink: 0, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <img src={GAME_ICONS[champWeek.game] || `${BASE}/precision.png`} style={{ width: 56, height: 56, objectFit: 'contain' }} />
           </div>
           <div style={{ padding: '14px 16px', flex: 1 }}>
             <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Sunday Championship</div>
             <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', marginBottom: 4, textTransform: 'capitalize' }}>{champWeek.game}</div>
             <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{countdown}</div>
           </div>
           <div style={{ paddingRight: 16, fontSize: 18, color: 'rgba(255,255,255,0.3)' }}>›</div>
         </div>
       </a>
     )}

   </main>
 )
}
