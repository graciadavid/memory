import Link from 'next/link'

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'
const RED = '#C62828'
const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'

export const metadata = {
  title: 'Higher or Lower Game Online — Countries, Population & Area | MemGenius',
  description: 'Play Higher or Lower online for free. Guess which country has more people or bigger area. No login, world ranking, mobile-first.',
}

export default function BlogPost() {
  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', color: BROWN }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>

        <Link href="/blog" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#4A2C0A50', marginBottom: 24 }}>Back to Blog</div>
        </Link>

        <div style={{ fontSize: 11, fontWeight: 800, color: RED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Geography Games · May 2026</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.15 }}>Higher or Lower Game Online — Countries, Population and Area</h1>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>Two countries appear on screen. One question: which one is higher — in population, or in surface area? Get it right and the next pair appears. Get it wrong and the game ends. Your score is your streak — the number of consecutive correct answers before your first mistake.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>It sounds simple. It is not. The world is full of surprises that will break your assumptions and teach you real geography without you realizing it.</p>

        <div style={{ background: RED, borderRadius: 20, padding: '20px 24px', marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Play Higher or Lower now</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Free · No login · World ranking</div>
          <Link href="/versus" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-block', background: '#fff', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 900, color: RED }}>Play now →</div>
          </Link>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 12px' }}>How the Higher or Lower game works</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Two country names appear side by side. You tap the one that is higher — either in population or in surface area, depending on which mode you are playing. If you are right, the winning country stays on screen and a new challenger appears. If you are wrong, the game ends and your streak is submitted to the world leaderboard.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>There is no time limit. The pressure is entirely internal — every wrong answer ends everything, which makes each tap feel significant. That tension is what makes Higher or Lower so addictive.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>MemGenius has two versions of the game. Higher or Lower Population tests your knowledge of how many people live in each country. Higher or Lower Area tests your knowledge of which countries occupy the most land. Both draw from nearly 200 countries worldwide, including small island nations and territories that most players have never considered.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>Facts that will surprise you</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 8 }}>The game is designed to break assumptions. Here are some comparisons that catch almost every player:</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 8 }}><strong>Bangladesh vs Russia (population).</strong> Bangladesh has more people than Russia. A country roughly the size of Greece contains more human beings than the largest country on Earth. Russia has 144 million people. Bangladesh has over 170 million — packed into 147,000 square kilometers.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 8 }}><strong>France vs Germany (area).</strong> France is nearly twice the size of Germany. Most people who have not studied European geography assume they are roughly similar. France covers 551,000 km². Germany covers 357,000 km².</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 8 }}><strong>Kazakhstan vs Europe (area).</strong> Kazakhstan is the world's largest landlocked country at 2.7 million km² — larger than Western Europe combined. Most players underestimate Central Asian countries dramatically.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 8 }}><strong>Nigeria vs Germany (population).</strong> Nigeria has twice the population of Germany and is projected to become the third most populated country in the world by 2050. Most players guess Germany higher.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}><strong>Australia vs USA (area).</strong> Australia and the contiguous United States are almost identical in size. Australia covers 7.69 million km². The contiguous US covers 7.65 million km². Players are usually surprised by how close they are.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>The cognitive benefits of geography games</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Higher or Lower is not just entertainment. It is one of the most effective ways to build genuine geography knowledge quickly — because it uses active retrieval rather than passive review.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>When you get a comparison wrong, the correct answer surprises you. Surprise is one of the most powerful encoding signals the brain has. Unexpected information triggers a stronger memory consolidation response than expected information — which is why you remember the facts that shocked you far better than the ones that confirmed what you already knew.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Players who play Higher or Lower regularly for two weeks typically show dramatic improvements in their ability to estimate relative country sizes and populations — knowledge that transfers directly to understanding news, economics, migration and international affairs.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>The competitive element accelerates learning further. When your streak is on the line with every tap, you pay closer attention to the result of each comparison than you would reading the same fact in a book.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>Strategies to improve your streak</h2>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '16px 0 8px' }}>Know your anchors</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>A few key facts act as anchors for estimation. The most populated countries are China and India, both over 1.4 billion. The largest countries by area are Russia, Canada, USA, China and Brazil. Knowing these anchors lets you reason about unfamiliar countries by comparison rather than trying to recall exact numbers.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '16px 0 8px' }}>Use continent as a proxy</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Africa and Asia contain most of the world's population. A mid-sized African country is likely to have more people than a similarly-sized European country. South Asian countries are almost always more densely populated than their size suggests. Pacific island nations are almost always smaller in both population and area than players expect.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '16px 0 8px' }}>Learn from your mistakes</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>Every wrong answer is a lesson. The comparisons that end your streak are the ones you will remember longest. Keep a mental note of the surprises — the countries that broke your assumptions — and they will stop surprising you next time.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>Higher or Lower in the classroom</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Geography teachers have found Higher or Lower to be one of the most engaging classroom tools available. Students who resist traditional map exercises will play Higher or Lower competitively for 20 minutes and absorb more geography knowledge than a standard lesson would deliver.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>The game works especially well as a discussion starter. A comparison that surprises the class — Bangladesh vs Russia, for example — opens a natural conversation about population density, urbanization, historical migration and economic development. The game creates the question; the teacher provides the depth.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>Teachers can create a class group on MemGenius and have students compete on a shared leaderboard. The student with the highest streak at the end of the week becomes the class geography champion. No other incentive is needed.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>Frequently asked questions</h2>
        {[
          { q: 'Is the Higher or Lower game on MemGenius free?', a: 'Yes, completely free. No login, no download, no subscription. Play directly in your browser on any device, including mobile.' },
          { q: 'What is a good Higher or Lower score?', a: 'The average player gets 8-12 correct before making a mistake. A streak of 20 puts you in the top players. The world record grows as more players join the leaderboard.' },
          { q: 'What countries are included in the game?', a: 'Nearly 200 countries and territories worldwide, including small island nations, landlocked countries and territories that rarely appear in geography lessons. The game covers the full range of human settlement on Earth.' },
          { q: 'Can I play Higher or Lower on mobile?', a: 'Yes. MemGenius is built mobile-first. The game works perfectly on any smartphone browser with no installation required.' },
          { q: 'Is there a version about population and a version about area?', a: 'Yes. MemGenius has two separate modes: Higher or Lower Population (which country has more people) and Higher or Lower Area (which country covers more km²). Both have their own world ranking.' },
          { q: 'Can I use Higher or Lower in my geography class?', a: 'Absolutely. Create a free group on MemGenius, share the link with your students, and they compete on a shared leaderboard instantly — no setup, no accounts needed. Visit memgenius.com/teachers for more information.' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 12, border: '1px solid #4A2C0A10' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: BROWN, marginBottom: 8 }}>{item.q}</div>
            <div style={{ fontSize: 14, color: '#4A2C0A70', lineHeight: 1.7 }}>{item.a}</div>
          </div>
        ))}

        <div style={{ background: '#FFEBEE', borderRadius: 20, padding: 28, textAlign: 'center', marginTop: 40, border: `1px solid ${RED}20` }}>
          <img src={BASE + '/logomemgenius.webp'} alt="MemGenius" style={{ height: 48, objectFit: 'contain', marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px' }}>How long is your streak?</h3>
          <p style={{ fontSize: 14, color: '#4A2C0A70', margin: '0 0 16px' }}>Free Higher or Lower online. No login. Your streak goes straight to the world leaderboard.</p>
          <Link href="/versus" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-block', background: RED, borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 900, color: '#fff' }}>Play Higher or Lower now</div>
          </Link>
        </div>

      </div>
    </main>
  )
}
