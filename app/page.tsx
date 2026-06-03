'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import WelcomePopup from '@/components/WelcomePopup'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const CATEGORIES = [
 { label: 'Brain Memory', icon: `${BASE}/brain-logo.webp`, href: '/memory-hub' },
 { label: 'Brain Agility', icon: `${BASE}/precision.png`, href: '/agility' },
 { label: 'Brain Knowledge', icon: `${BASE}/population.png`, href: '/knowledge' },
 { label: 'Brain Logic', icon: `${BASE}/target.png`, href: '/logic' },
]

export default function Home() {
 const [splash, setSplash] = useState(true)
 const [profile, setProfile] = useState<any>(null)
  const [showWelcome, setShowWelcome] = useState(false)
 const [champWeek, setChampWeek] = useState<any>(null)
 const [countdown, setCountdown] = useState('')

 useEffect(() => {
   const t = setTimeout(() => setSplash(false), 2000)
   return () => clearTimeout(t)
 }, [])

 useEffect(() => {
   const stored = localStorage.getItem('memgenius_profile')
   if (stored) setProfile(JSON.parse(stored)); else setShowWelcome(true)
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

 if (splash) return (
   <main style={{ height: '100dvh', background: '#1A1A1A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
     <img src={`${BASE}/brain-logo.webp`} style={{ width: 80, height: 80, objectFit: 'contain' }} />
     <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>MemGenius</div>
     <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 }}>Train your brain. Beat the world.</div>
   </main>
 )

 return (
   <main style={{ minHeight: '100dvh', background: '#1A1A1A', padding: '16px 16px 100px' }}>

     {/* Championship Banner dorado */}
     {champWeek && (
       <a href="/championship" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
         <div style={{ background: 'linear-gradient(135deg, #8B6914, #C8960C, #FFD700, #C8960C, #8B6914)', borderRadius: 16, padding: '16px 20px', boxShadow: '0 6px 0 rgba(100,70,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
             <img src={`${BASE}/winner.png`} style={{ width: 32, height: 32, objectFit: 'contain' }} />
             <div>
               <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(0,0,0,0.5)', letterSpacing: 2, textTransform: 'uppercase' }}>Every Sunday</div>
               <div style={{ fontSize: 18, fontWeight: 900, color: '#000' }}>Sunday Championship</div>
             </div>
           </div>
           <div style={{ fontSize: 13, fontWeight: 900, color: 'rgba(0,0,0,0.6)' }}>{countdown}</div>
         </div>
       </a>
     )}

     {/* No profile CTA */}
     {!profile && (
       <a href="/profile" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
         <div style={{ background: GREEN, borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 0 #1B5E20' }}>
           <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>Login · Always free · No email</div>
           <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Rank globally →</div>
         </div>
       </a>
     )}

     {/* Categories */}
     <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Train your Brain</div>
     <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
       {CATEGORIES.map(cat => (
         <a key={cat.label} href={cat.href} style={{ textDecoration: 'none' }}>
           <div style={{ background: '#252525', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
             <div style={{ width: 80, height: 80, flexShrink: 0, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <img src={cat.icon} style={{ width: 44, height: 44, objectFit: 'contain' }} />
             </div>
             <div style={{ padding: '14px 16px', flex: 1 }}>
               <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>{cat.label}</div>
             </div>
             <div style={{ paddingRight: 16, fontSize: 18, color: 'rgba(255,255,255,0.3)' }}>›</div>
           </div>
         </a>
       ))}
     </div>

   </main>
  </>  
 )
}
