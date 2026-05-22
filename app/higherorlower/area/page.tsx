import AreaClient from './AreaClient'
import RelatedGames from '@/components/RelatedGames'

export const metadata = {
 title: 'Higher or Lower Area — Country Size Quiz | MemGenius',
 description: 'Which country is bigger? Free online country size quiz with world ranking. Test your knowledge of world geography and country areas. No login required.',
}

export default function AreaPage() {
 return (
   <>
     <AreaClient />
     <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
       <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>Which country is bigger?</h2>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Higher or Lower Area shows you two countries and asks which one covers more land. It sounds straightforward until you face pairs like Kazakhstan vs Argentina, or Algeria vs DR Congo. Most people's mental map of country sizes is surprisingly distorted — and this game will expose exactly where your blind spots are.</p>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>The game covers over 80 countries across all continents. Each correct answer keeps your streak alive. One mistake ends the game and reveals your world ranking.</p>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           How to play
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Two countries are shown on screen with their flags. The top country shows its area in square kilometres. Your job is to decide whether the bottom country is bigger or smaller. Tap Bigger or Smaller. The correct area is revealed immediately and your streak continues or ends.</p>
           <p style={{ marginBottom: 10 }}>There is no time limit. Study the flags, think about what you know about each country's geography, and make your best call. Your score is the number of consecutive correct answers before your first mistake.</p>
           <p>To save your score you only need a name and a four-digit PIN. No email, no account required. Results are stored instantly and rankings update in real time as players compete worldwide.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           The largest countries in the world
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Russia is by far the largest country on Earth, covering 17.1 million square kilometres — more than the entire continent of Antarctica. It spans eleven time zones and covers roughly one eighth of the world's total land surface. Russia is so large that if it were placed over the contiguous United States, it would extend from coast to coast and still have land left over on both sides.</p>
           <p style={{ marginBottom: 10 }}>Canada is second with 9.98 million square kilometres, just barely larger than the United States at 9.83 million. These two are so close in size that many people cannot remember which is larger. The key fact is that Canada wins by about 150,000 square kilometres — roughly the size of Bangladesh. Despite its enormous area, Canada has only 38 million people, making it one of the least densely populated large countries on Earth.</p>
           <p style={{ marginBottom: 10 }}>China and Brazil are fourth and fifth, both around 8.5 million square kilometres. Brazil is the largest country in South America and the largest in the southern hemisphere. China is deceptively large — many people underestimate it because maps using the Mercator projection make high-latitude countries like Russia and Canada appear disproportionately large while shrinking equatorial countries.</p>
           <p>Australia rounds out the top six at 7.69 million square kilometres. It is the only country that is also an entire continent, which gives it a unique geographic status. Despite its vast size, almost all of Australia's interior is desert or semi-arid scrubland, which is why its population of 26 million is concentrated almost entirely along the coastal fringes.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Surprising size comparisons
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Algeria is the largest country in Africa and the tenth largest in the world, covering 2.38 million square kilometres. Most people dramatically underestimate its size because the Sahara Desert that covers most of it is sparsely populated and rarely in the news. Algeria is larger than Libya, Chad, Niger and Mali — all of which are themselves enormous countries that most people also underestimate.</p>
           <p style={{ marginBottom: 10 }}>Kazakhstan is the ninth largest country in the world at 2.72 million square kilometres — larger than the entire Western Europe combined. It is the world's largest landlocked country. Despite its enormous size, it has only 19 million people, giving it one of the lowest population densities of any sizeable country on Earth.</p>
           <p style={{ marginBottom: 10 }}>India feels large and densely populated, but at 3.29 million square kilometres it is only the seventh largest country — smaller than Australia, Brazil, the United States, China, Canada and Russia. The contrast between India's enormous population of 1.4 billion and its relatively modest area explains why it is one of the most densely populated large countries in the world.</p>
           <p>Japan surprises many players. It feels like a small island nation but actually covers 378,000 square kilometres — larger than Germany, the United Kingdom or Italy. Its mountainous terrain means that most of its population is squeezed into a small proportion of its total land area, which creates the impression of a far smaller country than it actually is.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Why maps distort country sizes
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>The map most people grew up with — the Mercator projection — was designed in 1569 for nautical navigation. It preserves angles and shapes, which is useful for plotting sailing routes, but it severely distorts the relative sizes of countries, making landmasses near the poles appear far larger than they actually are relative to equatorial regions.</p>
           <p style={{ marginBottom: 10 }}>The result is that Greenland appears roughly the same size as Africa on a Mercator map, when in reality Africa is fourteen times larger. Russia looks enormous — and it is large — but the Mercator projection makes it appear even bigger than it is. Conversely, countries near the equator like the DR Congo, Indonesia and Brazil appear far smaller on standard maps than their actual area warrants.</p>
           <p style={{ marginBottom: 10 }}>The Peters projection, developed in 1974, attempts to show countries at their correct relative sizes. On a Peters map, Africa dominates the center of the world in a way that is deeply unfamiliar to most people raised on Mercator maps. Europe and North America shrink dramatically while sub-Saharan Africa and South America expand to their true proportions.</p>
           <p>Understanding map distortion is one of the most powerful tools for improving your score in Higher or Lower Area. Once you know that Africa is systematically undersized on most maps and that high-latitude countries are oversized, you can correct for these biases and make much more accurate size judgments.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           The smallest countries in the world
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Vatican City is the smallest country in the world at just 0.44 square kilometres — smaller than many city parks. It is an independent state entirely surrounded by Rome, and it functions as the headquarters of the Catholic Church. Despite its tiny size, it has enormous global influence through its diplomatic relations with 183 countries and its leadership of 1.3 billion Catholics worldwide.</p>
           <p style={{ marginBottom: 10 }}>Monaco is the second smallest at 2.02 square kilometres, making it smaller than Central Park in New York. It is the most densely populated country on Earth, with around 40,000 people living in an area barely larger than a large shopping mall. Monaco is famous for its casino, Formula 1 Grand Prix and status as a tax haven for the ultra-wealthy.</p>
           <p style={{ marginBottom: 10 }}>Singapore is the smallest country in the game at 728 square kilometres — roughly the size of a medium city. Yet it is one of the wealthiest countries per capita in the world and one of the busiest ports and financial centers on Earth. Its tiny size has forced it to become extraordinarily efficient and outward-looking, trading with the entire world to compensate for its lack of natural resources and agricultural land.</p>
           <p>The contrast between the smallest and largest countries in the game is staggering. Russia is 23,000 times larger than Singapore. This extreme variation in size is one of the things that makes Higher or Lower Area such a challenging and educational game — the range of possible answers spans six orders of magnitude.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Tips to improve your score
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Memorize the top ten largest countries in order: Russia, Canada, United States, China, Brazil, Australia, India, Argentina, Kazakhstan, Algeria. If you know these ten cold, you can immediately resolve any comparison involving them without hesitation. These ten countries account for the majority of the world's land surface.</p>
           <p style={{ marginBottom: 10 }}>Learn the African giants. Algeria, DR Congo, Sudan, Libya, Chad, Niger, Mali, Angola, Ethiopia and South Africa are all enormous countries that most people dramatically underestimate. If you see an African country you are unfamiliar with, your default assumption should be that it is larger than you think — Africa contains many of the world's biggest countries by area.</p>
           <p style={{ marginBottom: 10 }}>Be especially careful with European countries. Europe contains many small and medium-sized countries that are easy to confuse. Remember that France is the largest country in the European Union at 552,000 square kilometres — larger than Spain, Germany, Sweden and every other EU member. The United Kingdom at 244,000 square kilometres is roughly half the size of France.</p>
           <p>Correct for Mercator bias systematically. Whenever you see a comparison involving a high-latitude country like Russia, Canada or Greenland versus an equatorial country like DR Congo or Indonesia, remember that the equatorial country is probably larger than it looks on the maps you grew up with. This single correction will improve your score significantly.</p>
         </div>
       </details>

       <RelatedGames category="knowledge" current="Higher or Lower Area" />
     </div>
   </>
 )
}
