import BlackjackClient from './BlackjackClient'
import RelatedGames from '@/components/RelatedGames'

export const metadata = {
 title: 'Blackjack — Card Game with World Ranking | MemGenius',
 description: 'Classic Blackjack with chips. Start with 1000, grow your stack, cash out at your peak. Train decision-making under pressure. World ranking. No login required.',
}

export default function BlackjackPage() {
 return (
   <>
     <BlackjackClient />
     <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
       <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Blackjack train?</h2>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Blackjack trains decision-making under uncertainty, probabilistic thinking and emotional regulation. Every hand requires you to weigh risk against reward with incomplete information — the dealer's hidden card. The ability to make rational decisions despite uncertainty is one of the most valuable cognitive skills in everyday life.</p>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>Knowing when to cash out — resisting the urge to keep playing when you are ahead — trains impulse control and long-term thinking. These are the same neural circuits that underpin financial decision-making, negotiation and strategic planning.</p>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           How to play
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>You start with 1,000 chips. Each round you place a bet, then receive two cards. The dealer also gets two cards — one face up, one hidden. Your goal is to get closer to 21 than the dealer without going over. Hit to take another card, Stand to hold your hand. If you get exactly 21 with your first two cards, that is a Blackjack — it pays 1.5x your bet.</p>
           <p style={{ marginBottom: 10 }}>The dealer must draw until reaching 17 or above. If the dealer busts, you win. If you bust, you lose regardless of the dealer's hand.</p>
           <p>Your world ranking is based on your peak chip count — the highest balance you reached before cashing out or going broke. Cash out anytime to lock in your score.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Basic strategy — the optimal plays
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Basic strategy is a mathematically proven set of decisions that minimises the house edge. Follow these rules and you will make the correct play in every situation:</p>
           <p style={{ marginBottom: 6 }}><strong>Always stand on:</strong> 17 or above. Never risk busting when the dealer may bust too.</p>
           <p style={{ marginBottom: 6 }}><strong>Always hit on:</strong> 8 or below. You cannot bust and need a stronger hand.</p>
           <p style={{ marginBottom: 6 }}><strong>Stand on 12–16 when dealer shows 2–6:</strong> The dealer is likely to bust with a low card hidden.</p>
           <p style={{ marginBottom: 6 }}><strong>Hit on 12–16 when dealer shows 7 or higher:</strong> The dealer is likely to make a strong hand, so you need to improve yours.</p>
           <p><strong>Never take insurance:</strong> It looks like protection but it is a losing bet mathematically every time.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           The science of decision-making under pressure
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Every Blackjack hand activates the prefrontal cortex — the brain's seat of rational decision-making — while simultaneously triggering the limbic system's emotional response to potential gain or loss. The interplay between these systems is what makes Blackjack cognitively demanding.</p>
           <p style={{ marginBottom: 10 }}>Neuroscience research shows that the anticipation of reward activates dopaminergic circuits in the striatum, producing the feeling of excitement before a card is revealed. Learning to make rational decisions despite this arousal — hitting on 16 against a dealer's 10 when every instinct says stand — is genuine emotional regulation training.</p>
           <p>Studies on expert gamblers and poker players show they have measurably stronger connections between the prefrontal cortex and the amygdala — they feel the emotional pull of a bet but are less controlled by it. This is a trainable skill.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Betting strategy — how to grow your stack
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Since your ranking is based on peak chips, the goal is to reach a high point and cash out — not to maximise long-term expected value. This changes the optimal betting strategy significantly.</p>
           <p style={{ marginBottom: 10 }}><strong>Flat betting</strong> — betting the same amount every hand — is the safest approach and will slowly grind your stack up or down based on luck. It is low risk but unlikely to produce a dramatic peak.</p>
           <p style={{ marginBottom: 10 }}><strong>Aggressive betting when ahead</strong> — increasing your bet size after wins — is riskier but can produce much higher peaks. If you reach 2,000 chips, betting 500 per hand gives you the chance to reach 4,000 quickly, at the cost of potentially losing your gains fast.</p>
           <p><strong>Know when to cash out.</strong> The single most important decision in this game is not whether to hit or stand — it is recognising when you are at a peak and locking it in before variance pulls you back down.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Common mistakes to avoid
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}><strong>Standing on 16 against a dealer's 10:</strong> It feels safe because you fear busting, but statistically you will lose this hand more often by standing than by hitting. The math is clear — hit.</p>
           <p style={{ marginBottom: 10 }}><strong>Chasing losses with bigger bets:</strong> After a bad run, the temptation is to bet big to recover quickly. This is how stacks disappear. Keep bets consistent when losing.</p>
           <p style={{ marginBottom: 10 }}><strong>Not cashing out when ahead:</strong> You reach 3,000 chips and think you can get to 5,000. Then variance hits and you are back at 1,500. Know your target and cash out when you hit it.</p>
           <p><strong>Assuming the dealer's hidden card is a 10:</strong> This is a common heuristic but it leads to suboptimal play in many situations. Use basic strategy, not assumptions.</p>
         </div>
       </details>

       <RelatedGames category="logic" current="Blackjack" />
     </div>
   </>
 )
}
