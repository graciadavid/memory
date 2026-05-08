'use client'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

export default function GroupsPageClient({ publicGroups, memberCounts }: { publicGroups: any[], memberCounts: Record<string, number> }) {
  return (
    <main style={{
      minHeight: '100dvh',
      background: `linear-gradient(180deg, #FFF8E1 0%, ${CREAM} 100%)`,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '32px 16px 100px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Community</div>
        <div style={{ fontSize: 30, fontWeight: 900, color: BROWN, letterSpacing: -1 }}>Groups</div>
        <div style={{ fontSize: 13, color: `${BROWN}55`, marginTop: 4 }}>Compete with friends or join a public group</div>
      </div>

      {/* Create group button */}
      <a href="/create-group" style={{ textDecoration: 'none', display: 'block', marginBottom: 24 }}>
        <div style={{
          background: 'linear-gradient(135deg, #1A3A5C, #1565C0)',
          borderRadius: 20, padding: '18px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 8px 0 #0D47A160',
        }}>
          <img src="https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage/groups.png" alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>Create a group</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Invite friends via link</div>
          </div>
        </div>
      </a>

      {/* Public groups */}
      <div style={{ fontSize: 11, fontWeight: 800, color: `${BROWN}50`, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Join a group</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {publicGroups.map(group => (
          <a key={group.id} href={`/g/${group.slug || group.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: 18, padding: '16px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: `0 4px 16px ${BROWN}08`,
              border: `1px solid ${BROWN}08`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {group.icon === 'flags' ? (
                  <img src="/icons/flags.webp" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                ) : (
                  <div style={{ fontSize: 32 }}>{group.icon}</div>
                )}
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: BROWN }}>{group.name}</div>
                  <div style={{ fontSize: 12, color: `${BROWN}50`, fontWeight: 700, marginTop: 2 }}>
                    {memberCounts[group.id] || 0} members
                  </div>
                </div>
              </div>
              <div style={{ padding: '8px 16px', borderRadius: 10, background: BROWN, color: '#fff', fontSize: 12, fontWeight: 900 }}>Join</div>
            </div>
          </a>
        ))}

        {publicGroups.length === 0 && (
          <div style={{ textAlign: 'center', color: `${BROWN}30`, fontSize: 14, fontWeight: 700, padding: '40px 0' }}>
            No public groups yet
          </div>
        )}
      </div>
    </main>
  )
}
