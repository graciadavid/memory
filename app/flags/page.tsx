import RelatedGames from '@/components/RelatedGames'
import FlagsClient from './FlagsClient'

export const metadata = {
  title: 'Flag Quiz — Identify Country Flags | MemGenius',
  description: 'How many country flags can you identify in a row? Free online flag quiz with world ranking. Test your knowledge of world flags, colors, symbols and history. No login required.',
}

export default function FlagsPage() {
  return (
    <>
      <FlagsClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>How well do you know the world's flags?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Flags is a visual recognition quiz that shows you a country flag and asks you to identify it from four options. The game includes flags from over 130 countries across all continents. Each correct answer keeps your streak alive. One wrong answer ends the game and shows your world ranking.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>Most adults can correctly identify fewer than 30 country flags. With daily practice, that number can reach 100 or more within a few weeks — a genuine expansion of your knowledge base that stays with you permanently.</p>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            How to play
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>A country flag appears on screen. Four country names are shown as options below. Tap the correct one. Each correct answer advances immediately to the next flag. One mistake ends the game and shows your score, your personal best and your world ranking among all players.</p>
            <p style={{ marginBottom: 10 }}>There is no time limit. You can study the flag as long as you need before answering. The challenge is purely about knowledge — how many flags have you stored in your long-term memory? Your score is the number of consecutive correct answers before your first mistake.</p>
            <p>To save your score you only need a name and a four-digit PIN. No email, no password, no account required. Results are stored instantly and rankings update in real time as players compete from all over the world.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            The meaning of colors in flags
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Flag colors are rarely chosen at random. Red almost universally represents blood, sacrifice or revolution. It appears in over 75% of all national flags, making it the most common flag color in the world. Blue often symbolizes the sea, the sky or freedom — which is why it dominates the flags of island nations and former colonial territories that sought independence.</p>
            <p style={{ marginBottom: 10 }}>Green is strongly associated with Islam, agriculture and hope. It dominates the flags of the Middle East and many African nations. Saudi Arabia, Pakistan and Libya all use green as their primary color. White represents peace, purity or surrender depending on context. Black often symbolizes the African continent, the people or the struggle against oppression — it features prominently in pan-African flag designs.</p>
            <p style={{ marginBottom: 10 }}>Yellow and gold represent wealth, natural resources or the sun. Brazil's yellow diamond, Ukraine's golden fields and Ghana's black star on gold all reference the land's natural abundance. Purple is the rarest color in national flags — for centuries it was the most expensive dye in the world, reserved for royalty. Today only Nicaragua and Nicaragua feature purple, and even then only as a small element in a rainbow.</p>
            <p>Understanding color symbolism turns flag recognition from memorization into a story. Once you know that green and white with a crescent is a common Islamic combination, or that red, yellow and green are the pan-African colors, you can make educated guesses about flags you have never seen before.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Flags that look almost identical
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Some of the world's flags are so similar that even geography experts confuse them. Romania and Chad are perhaps the most notorious example — both are vertical tricolors of blue, yellow and red, and are virtually indistinguishable at a distance. The only difference is a very slight variation in the shades of blue and yellow. Chad officially complained to the United Nations about the similarity in 2004.</p>
            <p style={{ marginBottom: 10 }}>Indonesia and Monaco are another famous pair. Both are simple horizontal bicolors of red on top and white on the bottom. The only difference is the proportion — Monaco's flag is slightly wider relative to its height. Poland uses the same colors but inverted, with white on top and red below. These three flags cause enormous confusion in flag quizzes worldwide.</p>
            <p style={{ marginBottom: 10 }}>New Zealand and Australia are frequently confused, both featuring the Union Jack and the Southern Cross constellation on a blue background. The key difference is that Australia has a large seven-pointed Commonwealth Star below the Union Jack, and its Southern Cross has five stars including one small one. New Zealand's Southern Cross has only four stars and they are red with white outlines rather than plain white.</p>
            <p>Colombia, Venezuela and Ecuador all use horizontal stripes of yellow, blue and red — a legacy of their shared history as part of Gran Colombia. The differences are in proportions and the coat of arms that Ecuador and Venezuela place in the center. Knowing this shared history makes all three flags immediately memorable.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Flags with coats of arms and symbols
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Many flags include coats of arms, emblems or complex symbols that make them instantly unique but also harder to memorize. Spain's flag features a detailed coat of arms incorporating the castles of Castile, the lions of León, the chains of Navarre and the stripes of Aragon — a visual history of the country's formation from separate medieval kingdoms.</p>
            <p style={{ marginBottom: 10 }}>Mexico's flag is one of the most recognizable in the world thanks to its central emblem: an eagle perched on a cactus devouring a snake. This image comes from an Aztec legend about the founding of Tenochtitlan, the ancient capital of the Aztec Empire that became Mexico City. The emblem transforms a simple green, white and red tricolor into an unmistakable national symbol.</p>
            <p style={{ marginBottom: 10 }}>Portugal's flag features a complex armillary sphere and shield. Mozambique is the only country in the world whose flag includes a modern weapon — an AK-47 rifle, representing the armed struggle for independence. Cambodia's flag shows Angkor Wat, making it one of the very few flags to depict a building. Belize features a mahogany tree and two woodcutters, reflecting its historic timber industry.</p>
            <p>Flags with distinctive central symbols are generally easier to identify in a quiz because the symbol acts as a powerful visual anchor. The challenge comes when two flags use similar backgrounds with different emblems — such as the many Central American flags that use blue and white stripes with varying coat of arms designs.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            The origins and history of flags
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>The oldest national flag still in use belongs to Denmark, whose red flag with a white cross — the Dannebrog — dates back to the 13th century. According to legend it fell from the sky during the Battle of Lyndanisse in 1219. Whether the legend is true or not, the design has remained essentially unchanged for over 800 years, making it the longest-surviving national flag in continuous use.</p>
            <p style={{ marginBottom: 10 }}>The Nordic cross design used by Denmark spread to the other Scandinavian countries. Norway, Sweden, Finland and Iceland all use variations of the same offset cross on a colored background. This shared design reflects their cultural, historical and religious connections — all five countries share a Lutheran Protestant heritage where the cross is the central symbol of faith.</p>
            <p style={{ marginBottom: 10 }}>The Union Jack of the United Kingdom is itself a combination of three flags: the red cross of St George for England, the white diagonal cross of St Andrew for Scotland, and the red diagonal cross of St Patrick for Ireland. Wales is not represented because it was already united with England before the flag was created. The asymmetry of the diagonal crosses is deliberate — it ensures the flag has a correct and incorrect way up.</p>
            <p>Many flags were redesigned after independence movements in the 20th century. Former colonies often deliberately removed all European symbols and replaced them with pan-African colors, Islamic crescents or indigenous symbols to assert a new national identity. South Africa's post-apartheid flag, designed in 1994, is a masterclass in this — its Y-shape symbolizes the convergence of diverse elements of South African society into a unified future.</p>
          </div>
        </details>

        <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Tips to improve your flag quiz score
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>The most effective strategy is to learn flags by region rather than randomly. Start with Europe, where the tricolor format — three vertical or horizontal stripes — dominates. Once you know the French tricolor of blue, white and red, you can immediately distinguish it from the Irish tricolor of green, white and orange, or the Italian green, white and red. Regional patterns make individual flags much easier to remember.</p>
            <p style={{ marginBottom: 10 }}>Focus first on the flags that appear most frequently in news and media. The flags of the United States, United Kingdom, Japan, China, Brazil, India, Canada, Australia and the major European nations are the ones most people encounter regularly. Building a solid foundation with these high-frequency flags dramatically improves your baseline score.</p>
            <p style={{ marginBottom: 10 }}>Use the process of elimination aggressively. If you see a flag with a crescent and star, you can immediately narrow it down to Muslim-majority countries. If you see a Nordic cross, it is one of five Scandinavian nations. If you see red, yellow and green stripes, think pan-African. These shortcuts let you make educated guesses even for flags you have not explicitly memorized.</p>
            <p>Pay attention to the flags you get wrong. The game shows you the correct answer immediately after a mistake. Use that moment to study the flag carefully — note the exact colors, the layout, any symbols. Players who actively study their mistakes rather than immediately restarting improve their scores significantly faster than those who just play repeatedly without reflection.</p>
          </div>
        </details>

        <RelatedGames category="knowledge" current="Flags" />
      </div>
    </>
  )
}
