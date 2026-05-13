'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const GREEN = '#2E7D32'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

const GAMES = [
  { href: '/memory', icon: '/icons/memory.webp', label: 'Memory', sub: 'Match pairs by connection', bg: '#4A2C0A', subject: 'Any subject', desc: 'Trains working memory and concentration. Works for vocabulary, history dates, or any content you pair up.' },
  { href: '/digits', icon: '/icons/digits.webp', label: 'Digits', sub: 'How many digits can you remember?', bg: '#1565C0', subject: 'Math & Logic', desc: 'Memorize growing number sequences. Builds short-term memory and numerical focus.' },
  { href: '/sequence', icon: '/icons/sequence.webp', label: 'Simon Says', sub: 'Repeat the pattern', bg: '#6A1B9A', subject: 'Music & Attention', desc: 'Watch a color pattern and repeat it. Trains visual memory and sequential thinking.' },
  { href: '/flags', icon: '/icons/flags.webp', label: 'Flags', sub: 'How many flags in a row?', bg: '#00796B', subject: 'Geography', desc: 'Identify world flags. Perfect for geography classes — students learn 195 countries without realizing it.' },
  { href: '/precision', icon: `${BASE}/precision.png`, label: 'Precision', sub: 'Stop, F1 Reaction, Pendulum', bg: '#4A148C', subject: 'Science & Physics', desc: 'Three timing challenges that measure reaction speed and rhythm. Great for science discussions on human perception.' },
  { href: '/versus', icon: `${BASE}/higuer.png`, label: 'Higher or Lower', sub: 'Population · Area km²', bg: '#C62828', subject: 'Geography & Social Science', desc: 'Compare countries by population or surface area. Students discover surprising facts about the world.' },
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
      background: `linear-gradient(180deg, #E8F5E9 0%, ${CREAM} 30%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      color: BROWN,
    }}>

      {/* Hero */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 0' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: `${BROWN}50`, marginBottom: 32 }}>← Back to MemGenius</div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <img src={`${BASE}/logomemgenius.webp`} alt="MemGenius" style={{ height: 52, objectFit: 'contain' }} />
          <div style={{ fontSize: 11, fontWeight: 800, color: GREEN, letterSpacing: 2, textTransform: 'uppercase' }}>For educators</div>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 16px', letterSpacing: -1, lineHeight: 1.1 }}>
          Brain training games<br />your students will love
        </h1>
        <p style={{ fontSize: 15, color: `${BROWN}70`, lineHeight: 1.8, margin: '0 0 32px', maxWidth: 560 }}>
          9 free games that train memory, reaction, geography and logic — built mobile-first so students can play instantly on their phones. No login, no app download, no cost.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' }}>

          <Link href="/groups" style={{ textDecoration: 'none' }}>
            <div style={{ background: GREEN, borderRadius: 16, padding: '14px 24px', boxShadow: `0 6px 0 #1B5E2060`, cursor: 'pointer' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>Create a class group</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Share one link with your class</div>
            </div>
          </Link>
        </div>

        {/* Why it works */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 56 }}>
          {[
            { icon: '📱', title: 'Mobile-first', desc: 'Works on any phone, instantly' },
            { icon: '🆓', title: 'Always free', desc: 'No login, no paywalls' },
            { icon: '🏆', title: 'Live rankings', desc: 'Students compete in real time' },
            { icon: '⚡', title: 'One link', desc: 'Whole class joins in seconds' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '16px', border: `1px solid ${BROWN}10` }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: BROWN }}>{item.title}</div>
              <div style={{ fontSize: 12, color: `${BROWN}60`, marginTop: 4 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Games */}
        <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>The games</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 56 }}>
          {GAMES.map((g, i) => (
            <Link key={i} href={g.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: `1px solid ${BROWN}10`, transition: 'transform 0.15s', cursor: 'pointer' }}>
                <div style={{ background: g.bg, padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img src={g.icon} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>{g.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{g.sub}</div>
                  </div>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, marginBottom: 4 }}>{g.subject}</div>
                  <div style={{ fontSize: 13, color: `${BROWN}70`, lineHeight: 1.6 }}>{g.desc}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: BROWN, marginTop: 10 }}>Try it →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* We want your ideas */}
        <div style={{ background: `${GOLD}15`, borderRadius: 24, padding: '28px 28px', marginBottom: 32, border: `1px solid ${GOLD}30` }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 12px' }}>We want your ideas</h2>
          <p style={{ fontSize: 14, color: `${BROWN}80`, lineHeight: 1.8, margin: '0 0 10px' }}>
            Students today expect mobile-first experiences. At MemGenius our priority is <strong>Train Your Brain</strong> — and teachers are the best people to tell us what that means in practice.
          </p>
          <p style={{ fontSize: 14, color: `${BROWN}80`, lineHeight: 1.8, margin: 0 }}>
            Have an idea to improve an existing game? Want a new game for your subject? We read every message and build what matters most to educators.
          </p>
        </div>

        {/* Form */}
        {sent ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, textAlign: 'center', border: `1px solid ${GREEN}30`, marginBottom: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: GREEN }}>Thank you!</div>
            <div style={{ fontSize: 14, color: `${BROWN}70`, marginTop: 8 }}>We will review your message and get back to you if you left an email.</div>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 24, padding: 28, border: `1px solid ${BROWN}10`, marginBottom: 60 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 20px' }}>Share your ideas</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
              {[
                { key: 'name', label: 'Your name', placeholder: 'Ms. Johnson', type: 'text' },
                { key: 'subject', label: 'Subject you teach', placeholder: 'Geography, Math...', type: 'text' },
                { key: 'school', label: 'School (optional)', placeholder: 'Lincoln High School', type: 'text' },
                { key: 'email', label: 'Email (optional)', placeholder: 'you@school.edu', type: 'email' },
              ].map((field) => (
                <div key={field.key}>
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
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}60`, marginBottom: 4 }}>Your idea or feedback *</div>
              <textarea
                placeholder="I would love a game that helps students memorize the periodic table... or I think Flags would work better if..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={4}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `1px solid ${BROWN}20`, fontSize: 14, fontFamily: 'inherit', background: CREAM, boxSizing: 'border-box', outline: 'none', color: BROWN, resize: 'none' }}
              />
            </div>
            <button onClick={submit} disabled={loading || !form.message.trim()} style={{ padding: '16px 32px', borderRadius: 16, border: 'none', background: form.message.trim() ? GREEN : `${BROWN}20`, color: form.message.trim() ? '#fff' : `${BROWN}40`, fontSize: 15, fontWeight: 900, fontFamily: 'inherit', cursor: form.message.trim() ? 'pointer' : 'default', boxShadow: form.message.trim() ? `0 6px 0 #1B5E2060` : 'none' }}>
              {loading ? 'Sending...' : 'Send your idea'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
