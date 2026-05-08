import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Play MemGenius — Complete Guide to All Brain Games',
  description: 'Learn how to play Memory, Digits, Sequence and Flags on MemGenius. Complete guide with tips, strategies and how to challenge friends. Free daily brain training games.',
  keywords: ['how to play memgenius', 'memory game guide', 'brain training games', 'flag quiz how to play', 'digits memory game', 'sequence simon says', 'free brain games'],
  openGraph: {
    title: 'How to Play MemGenius — Complete Brain Training Guide',
    description: 'Master all four MemGenius brain games. Step by step guides for Memory, Digits, Sequence and Flags.',
    url: 'https://memgenius.com/how-to-play',
  },
  alternates: { canonical: 'https://memgenius.com/how-to-play' },
}

const BROWN = '#4A2C0A'
const GOLD = '#C8960C'
const CREAM = '#FAF7F2'

const Section = ({ title, color, children }: { title: string, color: string, children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 22, fontWeight: 900, color, letterSpacing: -0.5, marginBottom: 16, borderLeft: `4px solid ${color}`, paddingLeft: 12 }}>{title}</h2>
    {children}
  </section>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 14, lineHeight: 1.9, color: `${BROWN}80`, marginBottom: 14 }}>{children}</p>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontSize: 16, fontWeight: 900, color: BROWN, marginBottom: 8, marginTop: 20 }}>{children}</h3>
)

export default function HowToPlayPage() {
  return (
    <main style={{
      minHeight: '100dvh',
      background: CREAM,
      fontFamily: 'var(--font-nunito), sans-serif',
      maxWidth: 430, margin: '0 auto',
      padding: '32px 24px 100px',
      color: BROWN,
    }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Guide</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, letterSpacing: -1, lineHeight: 1.2 }}>
        How to Play MemGenius
      </h1>
      <p style={{ fontSize: 14, color: `${BROWN}60`, fontStyle: 'italic', fontFamily: 'Georgia, serif', marginBottom: 32, lineHeight: 1.6 }}>
        Your complete guide to all four brain training games, world rankings, challenge links and more.
      </p>

      {/* Table of contents */}
      <nav style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 40, border: `1px solid ${BROWN}10`, boxShadow: `0 4px 16px ${BROWN}06` }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Contents</div>
        {[
          { href: '#memory', label: 'Memory — Match Pairs', color: BROWN },
          { href: '#digits', label: 'Digits — Number Memory', color: '#1565C0' },
          { href: '#sequence', label: 'Sequence — Pattern Game', color: '#6A1B9A' },
          { href: '#flags', label: 'Flags — Flag Quiz', color: '#00796B' },
          { href: '#rankings', label: 'World Rankings', color: GOLD },
          { href: '#challenge', label: 'Challenge a Friend', color: '#C62828' },
          { href: '#profile', label: 'Your Profile', color: BROWN },
          { href: '#tips', label: 'Tips & Strategies', color: '#2E7D32' },
        ].map(item => (
          <a key={item.href} href={item.href} style={{ display: 'block', fontSize: 13, fontWeight: 800, color: item.color, textDecoration: 'none', padding: '4px 0', borderBottom: `1px solid ${BROWN}06` }}>
            → {item.label}
          </a>
        ))}
      </nav>

      {/* Memory */}
      <Section title="Memory — Match Pairs by Connection" color={BROWN}>
        <div id="memory" />
        <P>
          Memory is the flagship game of MemGenius and it works differently from traditional memory games. Instead of finding two identical cards, you need to find pairs that are <strong>connected by meaning</strong>. The Eiffel Tower pairs with Paris. A violin pairs with classical music. A key pairs with a lock. This makes Memory a true test of knowledge and associative thinking, not just visual memory.
        </P>
        <H3>How to start</H3>
        <P>
          From the home screen, tap the Memory button. You will be taken to the Memory home where you can choose your difficulty level: Easy, Medium or Hard. You can also browse packs by category using the Categories button, which organizes all available packs by topic — Geography, History, Music, Science, Food and more.
        </P>
        <H3>Gameplay</H3>
        <P>
          The game board shows 12 face-down cards arranged in a 3x4 grid. Tap any card to flip it and reveal the image underneath. Then tap a second card — if the two cards form a connected pair, they stay face-up and are highlighted with a gold border. If they do not match, both cards flip back face-down after a brief moment. The goal is to find all 6 pairs as quickly as possible.
        </P>
        <P>
          A timer runs from the moment the board appears. Your final time is recorded in the format MM:SS:CS (minutes, seconds, centiseconds). The faster you complete the board, the higher your world ranking will be.
        </P>
        <H3>Difficulty levels</H3>
        <P>
          Easy packs focus on well-known associations like monuments and countries, animals and their habitats, or everyday objects and their uses. Medium packs introduce more nuanced connections — artworks and the museums that house them, musical instruments and the genres they belong to, or foods and their countries of origin. Hard packs challenge your knowledge with scientific phenomena, famous inventions and their inventors, or architectural landmarks from around the world.
        </P>
        <H3>Categories</H3>
        <P>
          The Categories section lets you browse all available packs organized by theme. Geography packs cover monuments, flags and world cities. History packs explore civilizations and landmarks. Music packs connect instruments to genres and composers to their works. Science packs challenge you with phenomena and discoveries. The MemGenius category includes special packs made exclusively for our community. New packs are added regularly so check back often.
        </P>
        <H3>Scoring and ranking</H3>
        <P>
          Your best time for each difficulty level is saved to your profile and compared against all other players worldwide. The Memory ranking shows separate leaderboards for Easy, Medium and Hard. If you complete a pack in record time, you will appear at the top of the world ranking — and you can share that achievement directly from the result screen.
        </P>
      </Section>

      {/* Digits */}
      <Section title="Digits — How Many Numbers Can You Remember?" color="#1565C0">
        <div id="digits" />
        <P>
          Digits is a pure test of short-term numerical memory. It is based on the classic Digit Span test used by psychologists to measure working memory capacity. The world record for most digits memorized in sequence is over 20 — can you beat it?
        </P>
        <H3>How it works</H3>
        <P>
          Each round begins with a number appearing on screen. The number starts with just one digit and grows longer with each level. You have 4 seconds to memorize the number before it disappears. Then a text field appears and you must type the number exactly as it appeared. Get it right and you advance to the next level with one more digit. Get it wrong and the game ends.
        </P>
        <H3>The progression bar</H3>
        <P>
          While the number is displayed, a red progress bar at the bottom counts down from full to empty over 4 seconds. When the bar reaches the end, the number disappears and your input field appears. Pay attention to both the number and the bar — knowing how much time you have left helps you pace your memorization.
        </P>
        <H3>Result screen</H3>
        <P>
          When you make a mistake, the result screen shows you the correct number in green and what you typed in red, so you can see exactly where you went wrong. It also shows your world ranking for that score — how many digits you memorized before failing compared to all other players.
        </P>
        <H3>Tips for Digits</H3>
        <P>
          Group the digits into chunks of 3 or 4 rather than trying to memorize them individually. For example, if the number is 847293, think of it as 847 and 293 rather than six separate digits. This technique, called chunking, is used by memory champions worldwide and can dramatically increase how many digits you can hold in working memory.
        </P>
      </Section>

      {/* Sequence */}
      <Section title="Sequence — The Pattern Memory Game" color="#6A1B9A">
        <div id="sequence" />
        <P>
          Sequence is MemGenius's take on the classic Simon Says game. Four colored buttons appear on screen — red, blue, green and yellow — and each has its own distinct musical note. The game plays a sequence of flashes, and you must repeat it in the exact same order. With each successful round, one more step is added to the sequence. How long can your memory hold?
        </P>
        <H3>Watch and repeat</H3>
        <P>
          Each round starts with the buttons lighting up one at a time in a sequence. The buttons dim between flashes so you can see each individual step clearly. Watch carefully and remember the order. When the sequence is done, the screen shows "Your turn" and you must tap the buttons in the same order they appeared.
        </P>
        <H3>Sound is your secret weapon</H3>
        <P>
          Each of the four buttons plays a different musical note — red plays a low C, blue plays an E, green plays a G and yellow plays a high C. Together they form a musical chord pattern. Many players find it easier to remember the sequence as a melody rather than a visual pattern. Try humming the notes as you watch and it will feel more natural when you repeat.
        </P>
        <H3>Auto-advance</H3>
        <P>
          When you complete a sequence correctly, MemGenius automatically advances to the next level after a brief celebration. There is no next button to tap — this keeps the flow going and lets you stay in the zone. The brain-green mascot appears when you are correct and the brain-red mascot when you make a mistake.
        </P>
        <H3>World ranking</H3>
        <P>
          Your best level is saved and compared against all other Sequence players worldwide. Ties are broken by who reached that level first, so the earlier you set your record the better your ranking position.
        </P>
      </Section>

      {/* Flags */}
      <Section title="Flags — The Ultimate Flag Quiz" color="#00796B">
        <div id="flags" />
        <P>
          Flags is the most popular game on MemGenius and it is easy to see why — flags are beautiful, surprising and endlessly interesting. The goal is simple: identify as many flags in a row as you can without making a mistake. How far can you go?
        </P>
        <H3>Gameplay</H3>
        <P>
          A flag appears on screen — large, clear and colorful. Below it are four country names. Tap the correct country and you advance to the next flag. Get it wrong and the game ends, showing you the flag you missed and your final score. There is no time limit per question but a subtle progress indicator reminds you that speed matters for a good experience.
        </P>
        <H3>130+ countries</H3>
        <P>
          MemGenius includes flags from over 130 countries across every continent. You will see familiar flags from major nations alongside lesser-known ones from smaller countries. The game randomly selects flags so every session is different. Over time you will build a comprehensive knowledge of world flags — a skill that impresses in geography quizzes and trivia nights.
        </P>
        <H3>The streak system</H3>
        <P>
          Your score in Flags is your streak — the number of flags you correctly identified in a row. The world record is currently 91 flags set by Jan. The ranking is sorted by streak length, with ties broken by who achieved the streak first. If you beat the record, you go straight to number one in the world and your name appears in the Hall of Fame.
        </P>
        <H3>Tips for Flags</H3>
        <P>
          Look for distinctive features: colors, symbols, patterns and layout. Red-white-blue tricolors are common in Europe — learn which direction the stripes go. Flags with religious symbols like crosses or crescents are easy to narrow down. Island nations often have blue backgrounds representing the ocean. Flags with animals, plants or unique shapes are usually the easiest to remember.
        </P>
      </Section>

      {/* Rankings */}
      <Section title="World Rankings — Compete Globally" color={GOLD}>
        <div id="rankings" />
        <P>
          Every game on MemGenius contributes to a global ranking. Tap the trophy icon in the bottom navigation bar to access the World Ranking hub, where you can see leaderboards for all four games.
        </P>
        <H3>Memory ranking</H3>
        <P>
          The Memory ranking shows the fastest times for each difficulty level. Each player's best time per difficulty is shown — only your fastest completion counts. The ranking updates within 60 seconds of a new game being completed.
        </P>
        <H3>Digits, Sequence and Flags rankings</H3>
        <P>
          For Digits and Sequence, the ranking shows the highest level reached by each player. For Flags it shows the longest streak. In all three cases, ties are broken by who achieved the score first — so it pays to set your record early.
        </P>
        <H3>Your position</H3>
        <P>
          A sticky bar at the bottom of each ranking screen shows your current position and score. Tap it to scroll directly to your row in the list. You can also share your ranking position directly from that bar using the share button.
        </P>
        <H3>Hall of Fame</H3>
        <P>
          The Hall of Fame shows the all-time world record holder for each game and difficulty. These are the players with the highest score ever recorded. If you beat a world record, your name appears in the Hall of Fame immediately and you can share that achievement with your friends.
        </P>
      </Section>

      {/* Challenge */}
      <Section title="Challenge a Friend — Go Viral" color="#C62828">
        <div id="challenge" />
        <P>
          The best way to grow your score and have fun on MemGenius is to challenge your friends directly. After completing any game — Digits, Sequence or Flags — the result screen shows a Challenge a Friend button. Tap it to generate a personal challenge link.
        </P>
        <H3>How it works</H3>
        <P>
          When you tap Challenge a Friend, a link is created that contains your name and your score. Share it via WhatsApp, Instagram, iMessage or any other app. When your friend opens the link, they see a special page that says your name and your score — and asks if they can beat you. They enter their name and jump straight into the game.
        </P>
        <H3>Why it is so effective</H3>
        <P>
          A personal challenge from a friend is much more compelling than a generic invitation to play. "Jan got 91 flags. Can you beat him?" creates an immediate social obligation and competitive motivation. This is the same mechanism that made Wordle go viral — shareable results that create personal challenges.
        </P>
        <H3>Tips for sharing</H3>
        <P>
          Send your challenge link to family groups on WhatsApp — flags and memory games are perfect for all ages. Post your result on Instagram Stories with the link in your bio. Challenge coworkers to beat your Digits score. The more people you challenge, the more MemGenius grows — and the more impressive your ranking position becomes.
        </P>
      </Section>

      {/* Profile */}
      <Section title="Your Profile — Track Your Progress" color={BROWN}>
        <div id="profile" />
        <P>
          Your MemGenius profile keeps track of all your achievements across every game. Tap the person icon in the bottom navigation bar to access your profile.
        </P>
        <H3>What your profile shows</H3>
        <P>
          Your profile displays your current streak — the number of consecutive days you have played. Above it you can see your world ranking in Memory (Easy, Medium and Hard separately), your best level in Digits, your best level in Sequence, and your best streak in Flags. Each section has a share button so you can show off your achievements.
        </P>
        <H3>Adding a photo</H3>
        <P>
          Tap the Edit photo button below your avatar to add a profile picture. Upload any photo from your camera roll. Your photo appears in your profile and — if you hold a world record — in the Hall of Fame for everyone to see. Adding a photo makes your results more personal and recognizable when friends see them in rankings.
        </P>
        <H3>Editing your name</H3>
        <P>
          You can change your player name at any time by tapping the Edit button next to your name. Your new name must not already be taken by another player. Your existing scores and rankings are preserved — only the display name changes.
        </P>
        <H3>Achievements</H3>
        <P>
          MemGenius awards special achievements for milestones like completing your first 10 games, maintaining a 7-day streak, finishing a Memory game in under 30 seconds, or reaching world number one in any game. Achievements appear at the bottom of your profile and are a badge of honor in the MemGenius community.
        </P>
        <H3>Install MemGenius</H3>
        <P>
          For the best experience, install MemGenius on your home screen. In Safari on iPhone, tap the Share button (the square with an arrow) and select Add to Home Screen. On Android, tap the three dots menu in Chrome and select Add to Home Screen. Once installed, MemGenius opens like a native app — full screen with no browser bars.
        </P>
      </Section>

      {/* Tips */}
      <Section title="General Tips & Strategies" color="#2E7D32">
        <div id="tips" />
        <H3>Play every day</H3>
        <P>
          Your streak counter rewards daily play. Even a single game of Flags or a quick round of Digits counts toward your streak. Keeping your streak alive also keeps you sharp — research shows that spaced repetition over multiple days leads to much better long-term memory retention than marathon sessions.
        </P>
        <H3>Start with what you know</H3>
        <P>
          If you are new to MemGenius, start with Easy Memory packs on topics you already know — geography or everyday objects. Once you are comfortable with the mechanics, move to Medium and Hard. For Flags, start with major world countries before attempting the full 130+ flag rotation.
        </P>
        <H3>Use sound in Sequence</H3>
        <P>
          Turn your sound on when playing Sequence. The musical notes make the pattern much easier to remember as a melody. Many players who struggle with Sequence visually find it trivial once they start listening to the pattern as music.
        </P>
        <H3>Chunk numbers in Digits</H3>
        <P>
          Break long numbers into groups of 3 or 4 digits and memorize each group as a unit. This chunking technique is how memory champions remember hundreds of digits — it works because working memory holds about 4 chunks at a time, not 4 individual items.
        </P>
        <H3>Challenge, challenge, challenge</H3>
        <P>
          The more you challenge friends, the more motivation you have to improve. When you know someone is trying to beat your score, you naturally play more carefully and strategically. Use the Challenge button after every game to keep your friends engaged and competing.
        </P>
      </Section>

      {/* Footer CTA */}
      <div style={{ background: `linear-gradient(135deg, ${BROWN}, #2C1A05)`, borderRadius: 20, padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Ready to play?</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>Free, no login required</div>
        <a href="/" style={{
          display: 'inline-block', padding: '14px 32px', borderRadius: 14,
          background: GOLD, color: '#fff',
          fontSize: 15, fontWeight: 900, textDecoration: 'none',
          boxShadow: `0 6px 0 ${GOLD}60`,
        }}>Play MemGenius →</a>
      </div>
    </main>
  )
}
