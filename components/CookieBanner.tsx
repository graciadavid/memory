'use client'
import { useState, useEffect } from 'react'

const BROWN = '#4A2C0A'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setShow(false)
  }

  const reject = () => {
    localStorage.setItem('cookie_consent', 'rejected')
    setShow(false)
  }

  if (!show) return null

  return (
    <>
      <style>{`@keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }`}</style>
      <div style={{
        position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, zIndex: 999,
        padding: '0 12px', boxSizing: 'border-box',
        animation: 'slideUp 0.3s ease',
      }}>
        <div style={{
          background: '#1A1A1A', borderRadius: 20,
          padding: '16px 20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: 12 }}>
            We use cookies to display ads and improve your experience. See our{' '}
            <a href="/privacy" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 800 }}>Privacy Policy</a>.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={reject} style={{
              flex: 1, padding: '10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent', color: 'rgba(255,255,255,0.6)',
              fontSize: 13, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer',
            }}>Reject</button>
            <button onClick={accept} style={{
              flex: 2, padding: '10px', borderRadius: 12, border: 'none',
              background: '#4CAF50', color: '#fff',
              fontSize: 13, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: '0 4px 0 #2E7D3260',
            }}>Accept cookies</button>
          </div>
        </div>
      </div>
    </>
  )
}
