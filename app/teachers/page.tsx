'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const GREEN = '#2E7D32'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const SUBJECTS = [
  { icon: '🌍', subject: 'Geography', games: 'Flags, Higher or Lower', desc: 'Countries, populations, surface areas' },
  { icon: '🔢', subject: 'Math & Logic', games: 'Digits, Precision Stop', desc: 'Number sequences, time estimation' },
  { icon: '🧬', subject: 'Science', games: 'F1 Reaction, Pendulum', desc: 'Reaction time, rhythm and physics' },
  { icon: '🎵', subject: 'Music & Arts', games: 'Simon Says', desc: 'Pattern recognition, auditory memory' },
  { icon: '🧠', subject: 'Any subject', games: 'Memory', desc: 'Concentration and working memory' },
]

export default function TeachersPage() {
  const [form, setForm] = useState({ name: '', subject: '', school: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!form.message.trim()) return
    setLoading(true)
    await supabase.from('teacher_feedback').insert({
      name: form.name || null,
      subject: form.subject || null,
      school: form.school || null,
      email: form.email || null,
      message: form.message,
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, #E8F5E9 0%, ${CREAM} 40%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '32px 20px 120px',
      color: BROWN,
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: `${BROWN}50`, marginBottom: 24 }}>← Back</div>
      </Link>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <img src={`${BASE}/logomemgenius.webp`} alt="MemGenius" style={{ height: 56, objectFit: 'contain', marginBottom: 16 }} />
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 8px', letterSpacing: -0.5 }}>
          Bring MemGenius<br />to your classroom
        </h1>
        <p style={{ fontSize: 14, color: `${BROWN}70`, lineHeight: 1.7, margin: 0 }}>
          Free brain training games your students will actually want to play — on their phones, right now, no sign-up needed.
        </p>
      </div>
      <div style={{ background: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, border: `1px solid ${BROWN}10` }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: BROWN, marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' }}>Why teachers love it</div>
        {[
          { icon: '📱', text: 'Mobile-first — works instantly on any phone or tablet' },
          { icon: '🆓', text: 'Completely free, forever. No login required.' },
          { icon: '🏆', text: 'Live class rankings — students compete in real time' },
          { icon: '⚡', text: 'One link to share — your whole class joins in seconds' },
          { icon: '🧠', text: 'Every game trains a different cognitive skill' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 13, color: `${BROWN}80`, lineHeight: 1.6 }}>{item.text}</span>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: BROWN, marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' }}>Games by subject</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SUBJECTS.map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', border: `1px solid ${BROWN}10`, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: BROWN }}>{s.subject}</div>
                <div style={{ fontSize: 12, color: GOLD, fontWeight: 800 }}>{s.games}</div>
                <div style={{ fontSize: 11, color: `${BROWN}60`, marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link href="/groups" style={{ textDecoration: 'none' }}>
        <div style={{ background: GREEN, borderRadius: 20, padding: '18px 24px', textAlign: 'center', marginBottom: 28, boxShadow: `0 8px 0 #1B5E2060` }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>Create a class group</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Share one link — your class competes instantly</div>
        </div>
      </Link>
      <div style={{ background: `${GOLD}15`, borderRadius: 20, padding: 20, marginBottom: 20, border: `1px solid ${GOLD}30` }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: BROWN, marginBottom: 8 }}>We want your ideas</div>
        <p style={{ fontSize: 13, color: `${BROWN}80`, lineHeight: 1.7, margin: 0 }}>
          Students today expect mobile-first experiences. At MemGenius our priority is <strong>Train Your Brain</strong> — and teachers are the best people to tell us what that means in practice.
        </p>
        <p style={{ fontSize: 13, color: `${BROWN}80`, lineHeight: 1.7, margin: '10px 0 0' }}>
          Have an idea for improving an existing game? Want a new game for your subject? We read every message and build what matters most to educators.
        </p>
      </div>
      {sent ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, textAlign: 'center', border: `1px solid ${GREEN}30` }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: GREEN }}>Thank you!</div>
          <div style={{ fontSize: 13, color: `${BROWN}70`, marginTop: 6 }}>We will review your message and get back to you if you left an email.</div>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, border: `1px solid ${BROWN}10` }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: BROWN, marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>Share your ideas</div>
          {[
            { key: 'name', label: 'Your name', placeholder: 'Ms. Johnson', type: 'text' },
            { key: 'subject', label: 'Subject you teach', placeholder: 'Geography, Math...', type: 'text' },
            { key: 'school', label: 'School (optional)', placeholder: 'Lincoln High School', type: 'text' },
            { key: 'email', label: 'Email (optional)', placeholder: 'you@school.edu', type: 'email' },
          ].map((field) => (
            <div key={field.key} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, marginBottom: 4 }}>{field.label}</div>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={(form as any)[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `1px solid ${BROWN}20`, fontSize: 14, fontFamily: 'inherit', background: CREAM, boxSizing: 'border-box', outline: 'none', color: BROWN }}
              />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, marginBottom: 4 }}>Your idea or feedback *</div>
            <textarea
              placeholder="I'd love a game that helps students memorize the periodic table... or I think Flags would work better if..."
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={4}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `1px solid ${BROWN}20`, fontSize: 14, fontFamily: 'inherit', background: CREAM, boxSizing: 'border-box', outline: 'none', color: BROWN, resize: 'none' }}
            />
          </div>
          <button onClick={submit} disabled={loading || !form.message.trim()} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: form.message.trim() ? GREEN : `${BROWN}20`, color: form.message.trim() ? '#fff' : `${BROWN}40`, fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: form.message.trim() ? 'pointer' : 'default', boxShadow: form.message.trim() ? `0 6px 0 #1B5E2060` : 'none' }}>
            {loading ? 'Sending...' : 'Send your idea'}
          </button>
        </div>
      )}
    </main>
  )
}
