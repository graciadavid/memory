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
       <RelatedGames category="logic" current="Blackjack" />
     </div>
   </>
 )
}
