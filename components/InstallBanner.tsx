'use client'
import { useState, useEffect } from 'react'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'

export default function InstallBanner() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent))
    setIsStandalone((window.navigator as any).standalone === true)
  }, [])

  if (isStandalone) return null

  return (
    <>
      {/* Banner */}
      <div
        onClick={() => setShowModal(true)}
        style={{
          background: '#fff',
          border: `1.5px solid ${BROWN}15`,
          borderRadius: 16, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer',
          boxShadow: `0 2px 12px ${BROWN}08`,
          fontFamily: 'var(--font-nunito), sans-serif',
        }}>
        <div style={{ fontSize: 28 }}>📲</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: BROWN }}>Install MemGenius</div>
          <div style={{ fontSize: 11, color: `${BROWN}50`, marginTop: 2 }}>Add to your home screen</div>
        </div>
        <div style={{ fontSize: 12, color: `${BROWN}30`, fontWeight: 700 }}>→</div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          fontFamily: 'var(--font-nunito), sans-serif',
        }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#FAF7F2',
            borderRadius: '24px 24px 0 0',
            padding: '28px 24px 40px',
            width: '100%', maxWidth: 430,
            boxSizing: 'border-box',
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: BROWN, marginBottom: 6 }}>
              Install MemGenius
            </div>
            <div style={{ fontSize: 13, color: `${BROWN}60`, marginBottom: 24, lineHeight: 1.5 }}>
              Play faster, offline and without the browser bar.
            </div>

            {isIOS ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { step: '1', icon: '⬆️', text: 'Tap the Share button at the bottom of Safari' },
                  { step: '2', icon: '📋', text: 'Scroll down and tap "Add to Home Screen"' },
                  { step: '3', icon: '✅', text: 'Tap "Add" — done!' },
                ].map(s => (
                  <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: BROWN, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 900, flexShrink: 0,
                    }}>{s.step}</div>
                    <div style={{ fontSize: 14, color: BROWN, fontWeight: 700, lineHeight: 1.4 }}>
                      {s.icon} {s.text}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { step: '1', icon: '⋮', text: 'Tap the menu (three dots) in Chrome' },
                  { step: '2', icon: '📲', text: 'Tap "Add to Home Screen"' },
                  { step: '3', icon: '✅', text: 'Tap "Add" — done!' },
                ].map(s => (
                  <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: BROWN, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 900, flexShrink: 0,
                    }}>{s.step}</div>
                    <div style={{ fontSize: 14, color: BROWN, fontWeight: 700, lineHeight: 1.4 }}>
                      {s.icon} {s.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setShowModal(false)} style={{
              width: '100%', marginTop: 28, padding: '16px',
              borderRadius: 16, border: 'none',
              background: BROWN, color: '#fff',
              fontSize: 16, fontWeight: 900,
              fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: `0 6px 0 ${BROWN}60`,
            }}>Got it</button>
          </div>
        </div>
      )}
    </>
  )
}
