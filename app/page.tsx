'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const LOGO = `${BASE}/logomemgenius.png`
const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  return (
    <main style={{
      height: '100dvh',
      background: `radial-gradient(ellipse at 50% 0%, #fff8ee 0%, ${CREAM} 40%, #EDE5D8 100%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '0 20px',
    }}>
      <img
        src={LOGO}
        alt="MemGenius"
        style={{
          height: 160, objectFit: 'contain',
          filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.1))',
          marginBottom: 12,
        }}
      />
      <div style={{
        fontSize: 14, color: `${BROWN}55`,
        fontStyle: 'italic', fontFamily: 'Georgia, serif',
        marginBottom: 48,
      }}>
        Your daily brain workout
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Link href="/memory" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '100%', borderRadius: 22,
            background: BROWN,
            boxShadow: `0 8px 0 ${BROWN}60`,
            padding: '22px 24px',
            display: 'flex', alignItems: 'center', gap: 16,
            cursor: 'pointer', boxSizing: 'border-box',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: `${GOLD}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}>🧠</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>Memory</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>
                Match pairs by connection
              </div>
            </div>
          </div>
        </Link>
        <Link href="/digits" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '100%', borderRadius: 22,
            background: '#1565C0',
            boxShadow: '0 8px 0 #0D47A160',
            padding: '22px 24px',
            display: 'flex', alignItems: 'center', gap: 16,
            cursor: 'pointer', boxSizing: 'border-box',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}>🔢</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>Digits</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>
                How many digits can you remember?
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: `${BROWN}30`, letterSpacing: 1 }}>
          Always free · No ads · No login
        </div>
      </div>
    </main>
  )
}
