import PopulationClient from './PopulationClient'
import RelatedGames from '@/components/RelatedGames'

export const metadata = {
 title: 'Higher or Lower Population — Country Quiz | MemGenius',
 description: 'Which country has more people? Free online population quiz with world ranking. Test your knowledge of world demographics. No login required.',
}

export default function PopulationPage() {
 return (
   <>
     <PopulationClient />
     <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
       <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>How well do you know world population?</h2>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Higher or Lower Population shows you two countries side by side and asks you a simple question: which one has more people? It sounds easy until you face pairs like Vietnam vs Germany, or Canada vs Australia. Intuitions built on size, wealth or fame constantly mislead you.</p>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>The game covers over 80 countries across all continents. Each correct answer keeps your streak alive. One wrong answer ends the game and shows your world ranking among all players.</p>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           How to play
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Two countries are shown on screen, each with their flag. The top country shows its population. Your job is to decide whether the bottom country has a higher or lower population. Tap Higher or Lower. The correct population is revealed immediately and your streak continues or ends.</p>
           <p style={{ marginBottom: 10 }}>There is no time limit. Study the flags, think about what you know about each country, and make your best guess. Your score is the number of consecutive correct answers before your first mistake.</p>
           <p>To save your score you only need a name and a four-digit PIN. No email, no account required. Your result is stored instantly and your ranking updates in real time.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           The most populated countries in the world
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>India overtook China in 2023 to become the most populous country on Earth, with over 1.4 billion people. This was a historic milestone — China had held the top position for centuries. India is projected to keep growing until around 2060, while China's population is already declining due to decades of its one-child policy.</p>
           <p style={{ marginBottom: 10 }}>The United States is third with 331 million people, followed by Indonesia with 273 million — a figure that surprises most players because Indonesia receives far less media attention than its population size would suggest. Pakistan, Brazil and Nigeria complete the top seven, all with over 200 million people each.</p>
           <p style={{ marginBottom: 10 }}>Nigeria deserves special attention. It is currently the seventh most populous country in the world, but it has one of the highest birth rates on Earth. By 2100, demographers project that Nigeria could have a population of 700 to 800 million people, potentially making it the second or third most populous country in the world after India.</p>
           <p>At the other extreme, the least populous countries are tiny island and landlocked nations. Vatican City has around 800 permanent residents. Nauru, the smallest island nation, has fewer than 12,000 people. San Marino, the world's oldest republic, has just 34,000 inhabitants despite being entirely surrounded by Italy.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Surprising population facts
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Canada is the second largest country in the world by area but has a smaller population than the state of California. Its entire population of 38 million people would fit inside Greater Tokyo with room to spare. This extreme contrast between size and population makes Canada one of the most counterintuitive countries in the game.</p>
           <p style={{ marginBottom: 10 }}>Australia presents a similar paradox. It is roughly the same size as the continental United States but has only 26 million people — fewer than Texas alone. The reason is simple: most of Australia's interior is desert, almost entirely uninhabitable. Over 85% of Australians live within 50 kilometres of the coast.</p>
           <p style={{ marginBottom: 10 }}>Bangladesh is one of the most shocking data points in the game. It is roughly the size of the state of Iowa, yet it contains 167 million people — more than Russia, which is 120 times larger by area. Bangladesh is one of the most densely populated countries on Earth, with over 1,100 people per square kilometre.</p>
           <p>Japan's population is aging faster than almost any other country. It currently has 125 million people but is projected to fall below 100 million by 2050 and could halve by the end of the century. Japan has more people aged over 65 than under 15 — a demographic structure with profound implications for its economy and society.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Why population is hard to guess
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Human intuition about population is systematically biased by media exposure. Countries that appear frequently in news, sports and entertainment feel more important and therefore larger than they are. This is why most people dramatically overestimate the populations of the United States and Western Europe, and underestimate those of sub-Saharan Africa and South Asia.</p>
           <p style={{ marginBottom: 10 }}>Geographic size is another major source of error. Russia is the largest country in the world by area but has only 145 million people — fewer than Bangladesh. Kazakhstan is nine times the size of Germany but has a fraction of its population. Size and population are almost entirely uncorrelated at the global level.</p>
           <p style={{ marginBottom: 10 }}>Wealth also misleads. The Gulf states — Saudi Arabia, UAE, Kuwait — are wealthy and prominent in global affairs but have relatively small populations. Saudi Arabia has 35 million people, less than Canada. The UAE has just 10 million, of whom only about 1 million are citizens. The rest are migrant workers.</p>
           <p>Playing Higher or Lower Population regularly recalibrates these biases. After a few weeks of practice, players report significantly better intuitions about world demographics — a genuinely useful form of knowledge for understanding global news, business and geopolitics.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           World population growth
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>The world population reached 8 billion people in November 2022, a milestone that took only 12 years after reaching 7 billion in 2011. For most of human history, population growth was imperceptibly slow — it took until 1804 for the world to reach its first billion. The second billion took another 123 years. The third billion arrived in just 33 years.</p>
           <p style={{ marginBottom: 10 }}>This acceleration was driven by improvements in medicine, sanitation, agriculture and economic development that dramatically reduced child mortality while birth rates remained high. The resulting population explosion of the 20th century transformed every aspect of human civilization, from cities and food systems to climate and biodiversity.</p>
           <p style={{ marginBottom: 10 }}>The growth rate is now slowing. As countries develop economically and women gain access to education and reproductive healthcare, birth rates fall. Europe and East Asia are already below replacement rate. The United Nations projects that world population will peak at around 10.4 billion sometime in the 2080s before beginning a slow decline.</p>
           <p>Almost all future population growth will occur in sub-Saharan Africa, which is the only major region still in the early stages of its demographic transition. Understanding this shift is essential for understanding the geopolitics, economics and culture of the 21st century — and it starts with knowing which countries are actually the most populous.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Tips to improve your score
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Memorize the top 20 most populous countries in rough order. If you know that Nigeria has around 206 million people and that puts it in the top ten, you can immediately judge almost any comparison involving Nigeria correctly. The top 20 covers the vast majority of pairs you will encounter in the game.</p>
           <p style={{ marginBottom: 10 }}>Be especially careful with African countries. Nigeria, Ethiopia, DR Congo and Tanzania all have larger populations than many European countries that receive far more global attention. Ethiopia with 120 million people is larger than Germany. DR Congo with 99 million is larger than France. These are the comparisons that catch most players off guard.</p>
           <p style={{ marginBottom: 10 }}>Remember the counterintuitive cases. Canada smaller than California. Australia smaller than Texas. Russia smaller than Bangladesh. Kazakhstan smaller than Morocco. These specific surprises come up repeatedly and are worth memorizing explicitly rather than trying to reason about them each time.</p>
           <p>Use round numbers rather than precise figures. You do not need to know that Germany has exactly 83 million people — knowing it is roughly 80 million is enough to beat almost any European comparison. Precision is less important than having a reliable mental map of which countries fall in which population range.</p>
         </div>
       </details>

       <RelatedGames category="knowledge" current="Higher or Lower Population" />
     </div>
   </>
 )
}
