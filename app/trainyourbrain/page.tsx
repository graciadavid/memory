'use client'
import { useState, useEffect } from 'react'
import { usePlayer } from '@/lib/usePlayer'
import { supabase } from '@/lib/supabase'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

const CATS = [
 { key: 'memory', label: 'Memory', color: '#C62828', games: [
   { key: 'memory-easy', label: 'Memory', icon: '/icons/memory.webp', href: '/trainyourbrain/memory', unlocked: true },
   { key: 'memory-medium', label: 'Medium', icon: '/icons/memory.webp', href: '/trainyourbrain/memory-medium', unlocked: false },
   { key: 'memory-hard', label: 'Hard', icon: '/icons/memory.webp', href: '/trainyourbrain/memory-hard', unlocked: false },
   { key: 'digits', label: 'Digits', icon: '/icons/digits.webp', href: '/trainyourbrain/digits', unlocked: false },
   { key: 'simon', label: 'Simon Says', icon: '/icons/sequence.webp', href: '/trainyourbrain/simon', unlocked: false },
 ]},
 { key: 'agility', label: 'Agility', color: '#4A148C', games: [
   { key: 'stop', label: 'Stop', icon: '/icons/precision.png', href: '/trainyourbrain/stop', unlocked: true },
   { key: 'f1', label: 'F1 Reaction', icon: '/icons/f1.png', href: '/trainyourbrain/f1', unlocked: false },
   { key: 'pendulum', label: 'Pendulum', icon: '/icons/pendulum.png', href: '/trainyourbrain/pendulum', unlocked: false },
   { key: 'ace', label: 'Ace', icon: '/icons/padel.png', href: '/trainyourbrain/ace', unlocked: false },
 ]},
 { key: 'knowledge', label: 'Knowledge', color: '#00796B', games: [
   { key: 'flags', label: 'Flags', icon: '/icons/flags.webp', href: '/trainyourbrain/flags', unlocked: true },
   { key: 'versus-pop', label: 'Versus Pop', icon: '/icons/flags.webp', href: '/trainyourbrain/versus-pop', unlocked: false },
   { key: 'versus-area', label: 'Versus Area', icon: '/icons/flags.webp', href: '/trainyourbrain/versus-area', unlocked: false },
 ]},
 { key: 'logic', label: 'Logic', color: '#E65100', games: [
   { key: 'sudoku', label: 'Sudoku', icon: '/icons/memory.webp', href: '/trainyourbrain/sudoku', unlocked: true },
   { key: 'mastermind', label: 'Mastermind', icon: '/icons/memory.webp', href: '/trainyourbrain/mastermind', unlocked: false },
   { key: '2048', label: '2048', icon: '/icons/memory.webp', href: '/trainyourbrain/2048', unlocked: false },
 ]},
]

export default function TrainYourBrainPage() {
 const { profile } = usePlayer()

 return (
   <main style={{ height: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

     {/* Header */}
     <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
       <img src="/icons/brain-logo.webp" style={{ width: 36, height: 36, objectFit: 'contain' }} />
       <div>
         <div style={{ fontSize: 20, fontWeight: 900, color: BROWN }}>MemGenius</div>
         <div style={{ fontSize: 10, color: `${BROWN}50`, fontWeight: 700 }}>Your daily brain gym</div>
       </div>
     </div>

     {/* Games */}
     <div style={{ flex: 1, padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
       {CATS.map(cat => (
         <div key={cat.key}>
           <div style={{ fontSize: 12, fontWeight: 900, color: BROWN, marginBottom: 6 }}>{cat.label}</div>
           <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
             {cat.games.map(g => (
               g.unlocked ? (
                 <a key={g.key} href={g.href} style={{ textDecoration: 'none', flexShrink: 0 }}>
                   <div style={{ background: cat.color, borderRadius: 16, padding: '12px 10px', width: 90, height: 100, display: 'flex', flexDirection: 'column', boxShadow: `0 5px 0 ${cat.color}60` }}>
                     <div style={{ fontSize: 10, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{g.label}</div>
                     <img src={g.icon} style={{ flex: 1, width: '100%', objectFit: 'contain' }} />
                   </div>
                 </a>
               ) : (
                 <div key={g.key} style={{ background: cat.color, borderRadius: 16, padding: '12px 10px', width: 90, height: 100, flexShrink: 0, display: 'flex', flexDirection: 'column', opacity: 0.25 }}>
                   <div style={{ fontSize: 10, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{g.label}</div>
                   <img src={g.icon} style={{ flex: 1, width: '100%', objectFit: 'contain' }} />
                 </div>
               )
             ))}
           </div>
         </div>
       ))}
     </div>

   </main>
 )
}
