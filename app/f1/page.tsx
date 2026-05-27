import F1Client from './F1Client'
import RelatedGames from '@/components/RelatedGames'

export const metadata = {
 title: 'F1 Reaction Test — How Fast Are Your Reflexes? | MemGenius',
 description: 'React when the Formula 1 lights go out. Free online reaction time test with world ranking. Measure your reflexes in milliseconds. No login required.',
}

export default function F1Page() {
 return (
   <>
     <F1Client />
     <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
       <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>How fast are your reflexes?</h2>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>F1 Reaction is a pure reflex test inspired by the Formula 1 starting procedure. Five red lights illuminate one by one. When they go out, tap as fast as you can. Your reaction time is measured to the millisecond and compared against players from all over the world.</p>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>The average human reaction time to a visual stimulus is around 250 milliseconds. Elite Formula 1 drivers consistently react in under 200ms. Where do you rank?</p>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           How to play
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Five red lights illuminate one by one, just like the start of a real Formula 1 race. After all five are lit, there is a random delay before they go out. The moment they go out, tap the Accelerate button as fast as you can. Your reaction time in milliseconds is your score — lower is better.</p>
           <p style={{ marginBottom: 10 }}>If you tap before the lights go out, it counts as a jump start. The random delay prevents anticipation and ensures your score reflects true reaction speed.</p>
           <p>Save your score with a name and PIN to track your personal best and see your global ranking.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           The science of reaction time
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Simple reaction time reflects the total speed of the perception-decision-action chain. The theoretical minimum for human simple reaction time is around 100ms. The world record for a controlled simple reaction time test is approximately 101ms.</p>
           <p>Age significantly affects reaction time. Simple reaction time is fastest in the mid-twenties and declines gradually thereafter. Regular practice can partially offset this decline.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Reaction time in Formula 1
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>The FIA measures every driver reaction time at each race start to the millisecond. The fastest legitimate F1 start reactions are typically 150 to 200 milliseconds. If a reaction is faster than 100ms it is automatically flagged as a jump start.</p>
           <p>The five-light starting procedure was introduced in 1994. Before that, F1 used a single red light which was easier to anticipate.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Tips to improve your score
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Focus your attention on the lights rather than the button. Keep your finger hovering just above the screen. Play when you are alert and focused. Do not try to anticipate — the random delay is designed to prevent timing strategies.</p>
         </div>
       </details>

       <RelatedGames category="agility" current="F1 Reaction" />
     </div>
   </>
 )
}
