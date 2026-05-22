import KnowledgeClient from './KnowledgeClient'

export const metadata = {
 title: 'Knowledge Games — Geography & World Culture | MemGenius',
 description: 'Test your knowledge of world flags, country populations, country sizes and geography. Free online knowledge games with world rankings. No login required.',
}

export default function KnowledgePage() {
 return (
   <>
     <KnowledgeClient />
     <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
       <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>Why learning about the world matters</h2>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Geographic and cultural knowledge is one of the most underrated forms of intelligence. People who understand the world — where countries are, how large they are, how many people live there, what their flags look like — navigate global news, politics and business with far greater confidence and accuracy than those who don't.</p>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>The four Knowledge games on MemGenius each train a different dimension of world awareness. Together they build a mental map of the world that stays with you permanently — not as dry facts memorized for an exam, but as living knowledge reinforced through daily play and competition.</p>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Flags — visual memory and cultural literacy
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Flags trains visual recognition memory — the ability to match a pattern against knowledge stored in long-term memory. A country flag appears on screen and you must identify it from four options. Each correct answer advances to the next flag. One mistake ends your streak.</p>
           <p style={{ marginBottom: 10 }}>The game covers over 130 countries across all continents. Learning flags is more than a party trick. Colors and symbols encode the history, religion, culture and political identity of every nation. The crescent and star of Islam, the pan-African green-yellow-red, the Nordic cross, the Union Jack hidden inside a dozen Commonwealth flags — each is a compressed story about who a people are and where they came from.</p>
           <p>Most adults can identify fewer than 30 flags correctly. Daily practice on MemGenius can expand that to 100 or more within a few weeks — a genuine, permanent expansion of your cultural knowledge.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Higher or Lower Population — demographic intuition
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Two countries appear side by side. The top country shows its population. You decide whether the bottom country has more or fewer people. Simple in concept, surprisingly difficult in practice — human intuition about population is systematically biased by media exposure, geographic size and economic prominence.</p>
           <p style={{ marginBottom: 10 }}>Canada feels large and important but has fewer people than California. Bangladesh is tiny on a map but contains 167 million people — more than Russia, which is 120 times larger. Nigeria, largely absent from Western media, is the seventh most populous country on Earth and is projected to become one of the top three by 2100.</p>
           <p>Playing this game regularly recalibrates your demographic intuitions in a way that is genuinely useful for understanding global economics, politics and migration — the defining issues of the 21st century.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Higher or Lower Area — spatial reasoning
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Two countries appear on screen and you decide which covers more land. The Mercator projection maps most people grew up with have warped their sense of relative country sizes — making high-latitude countries like Russia and Canada look enormous while shrinking equatorial giants like the DR Congo and Indonesia.</p>
           <p style={{ marginBottom: 10 }}>Algeria is the largest country in Africa and the tenth largest in the world — larger than all of Western Europe combined. Kazakhstan is bigger than the entire European Union. These are facts that most educated people get wrong because their mental map was built on distorted projections.</p>
           <p>This game trains spatial reasoning and corrects geographic bias simultaneously. After a few weeks of play, you will look at a world map and see it completely differently — with a far more accurate sense of which parts of the world are truly vast and which are smaller than they appear.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Countries by Shape — visual geography
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>A white silhouette of a country appears on screen — no borders, no labels, no color. Four country names are shown below. You must identify the country from its shape alone. It sounds simple until you try to distinguish Paraguay from Uruguay, or Myanmar from Thailand, purely by outline.</p>
           <p style={{ marginBottom: 10 }}>The game covers over 75 countries and trains visual-spatial memory — the same cognitive ability used in navigation, architecture and engineering. Unlike flags or population figures, country shapes cannot be memorized from a list. They must be learned through repeated visual exposure, making this the most genuinely skill-based of the four knowledge games.</p>
           <p>Players who master Countries by Shape report that they start recognizing outlines automatically when they appear in news graphics, weather maps or travel content. It is one of the most satisfying knowledge skills to develop — immediately visible and genuinely impressive to others.</p>
         </div>
       </details>
     </div>
   </>
 )
}
