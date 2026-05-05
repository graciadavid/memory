const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

export default function PrivacyPage() {
  return (
    <main style={{
      minHeight: '100dvh',
      background: CREAM,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '32px 24px 100px',
      color: BROWN,
    }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>
        Legal
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 24, letterSpacing: -0.5 }}>
        Privacy Policy
      </h1>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: `${BROWN}80`, marginBottom: 20 }}>
        Last updated: May 2026
      </p>
      {[
        { title: 'What we collect', text: 'MemGenius only stores the player name you choose and your game scores. No email, no password, no personal data. Your name and scores are stored in our database to power the world rankings.' },
        { title: 'Local storage', text: "We use your browser's local storage to remember your profile, streak, and game preferences. This data never leaves your device except for your name and scores which are submitted to our leaderboard." },
        { title: 'No ads', text: 'MemGenius is completely free and contains no advertisements. We do not sell your data to any third party.' },
        { title: 'Cookies', text: 'We do not use tracking cookies. Local storage is used solely for game functionality.' },
        { title: 'Third party services', text: 'We use Supabase to store game scores and Vercel to host the application. Both services comply with GDPR.' },
        { title: 'Data deletion', text: 'To delete your data, contact us through memgenius.com. We will remove your scores and profile within 48 hours.' },
        { title: 'Children', text: 'MemGenius is suitable for all ages. We do not knowingly collect personal information from children under 13.' },
        { title: 'Contact', text: 'For any privacy questions, reach out through memgenius.com.' },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 6 }}>{section.title}</div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: `${BROWN}75`, margin: 0 }}>{section.text}</p>
        </div>
      ))}
    </main>
  )
}
