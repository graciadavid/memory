const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

export const metadata = {
  title: 'Privacy Policy | MemGenius',
  description: 'Privacy policy for MemGenius brain training games.',
}

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', maxWidth: 430, margin: '0 auto', padding: '32px 24px 100px', color: BROWN }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Legal</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>Privacy Policy</h1>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: `${BROWN}80`, marginBottom: 24 }}>Last updated: May 2026</p>

      {[
        {
          title: 'What we collect',
          text: 'MemGenius only stores the player name you choose and your game scores. No email address, no real name, no sensitive personal data is required or collected. Your chosen name and scores are stored in our database to power the world rankings.',
        },
        {
          title: 'Local storage',
          text: "We use your browser's local storage to remember your profile, streak, and game preferences. This data never leaves your device except for your name and scores which are submitted to our leaderboard.",
        },
        {
          title: 'Cookies and advertising',
          text: 'MemGenius uses Google AdSense to display advertisements. Google AdSense uses cookies to serve ads based on your prior visits to this website and other sites. Google\'s use of advertising cookies enables it and its partners to serve ads based on your visit to MemGenius and other sites on the Internet. You may opt out of personalized advertising by visiting Google\'s Ads Settings at https://www.google.com/settings/ads.',
        },
        {
          title: 'Google Analytics',
          text: 'We use Google Analytics to understand how visitors use MemGenius. Google Analytics collects anonymized data about pages visited, time spent and general location. This data is used solely to improve the platform. You can opt out using the Google Analytics opt-out browser add-on.',
        },
        {
          title: 'Third party services',
          text: 'We use Supabase to store game scores and Vercel to host the application. We use Google AdSense to display advertisements. All services comply with GDPR where applicable.',
        },
        {
          title: 'GDPR and your rights',
          text: 'If you are located in the European Economic Area, you have the right to access, correct or delete your personal data. You also have the right to object to or restrict certain processing of your data. To exercise these rights, contact us through memgenius.com.',
        },
        {
          title: 'Data deletion',
          text: 'To delete your data, contact us through memgenius.com. We will remove your scores and profile within 48 hours.',
        },
        {
          title: 'Children',
          text: 'MemGenius is suitable for all ages. We do not knowingly collect personal information from children under 13 beyond the chosen player name used for game rankings.',
        },
        {
          title: 'Contact',
          text: 'For any privacy questions, reach out through memgenius.com.',
        },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 6 }}>{section.title}</div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: `${BROWN}75`, margin: 0 }}>{section.text}</p>
        </div>
      ))}
    </main>
  )
}
