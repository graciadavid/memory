const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

export default function TermsPage() {
  return (
    <main style={{
      minHeight: '100dvh', background: CREAM,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '32px 24px 100px', color: BROWN,
    }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Legal</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ fontSize: 13, color: `${BROWN}60`, marginBottom: 24 }}>Last updated: May 2026</p>
      {[
        { title: 'Acceptance', text: 'By using MemGenius you agree to these terms. If you do not agree, please do not use the service.' },
        { title: 'Use of Service', text: 'MemGenius is free for personal non-commercial use. You agree not to misuse the service or interfere with other users.' },
        { title: 'User Content', text: 'Your player name is visible in rankings. We reserve the right to remove offensive or inappropriate names.' },
        { title: 'Intellectual Property', text: 'All content and code of MemGenius is owned by Clinc Marketing. You may not copy or distribute any part without permission.' },
        { title: 'Disclaimers', text: 'MemGenius is provided as-is. We do not guarantee uninterrupted access or that the service will be error-free.' },
        { title: 'Limitation of Liability', text: 'We shall not be liable for any indirect or consequential damages arising from your use of the service.' },
        { title: 'Changes', text: 'We may update these terms at any time. Continued use constitutes acceptance of the new terms.' },
        { title: 'Contact', text: 'For questions about these terms, contact us at hello@memgenius.com' },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 6 }}>{s.title}</div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: `${BROWN}75`, margin: 0 }}>{s.text}</p>
        </div>
      ))}
    </main>
  )
}
