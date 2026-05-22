import RelatedGames from '@/components/RelatedGames'
import AceClient from './AceClient'

export const metadata = {
  title: 'Ace — Timing & Hand-Eye Coordination Game | MemGenius',
  description: 'Hit the ball at the perfect moment. Free online timing and hand-eye coordination game with world ranking. Train your interceptive timing. No login required.',
}

export default function AcePage() {
  return (
    <>
      <AceClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>Hit the sweet spot at the perfect moment</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Ace is a timing and hand-eye coordination game inspired by the serve in padel and tennis. A ball travels across the screen in an arc and you must tap at the exact moment it passes through the target zone. Too early or too late and you miss. Hit the center perfectly and you score maximum points.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>Each successful hit increases the ball speed, making the next attempt harder. Ace combines the reaction speed of F1 with the anticipatory timing of Pendulum — the most complete agility challenge on MemGenius.</p>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            How to play
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>A ball moves across the screen in an arc. A circular target marks the sweet spot. Tap SERVE when the ball passes through the circle. A perfect hit scores 200 points, a good hit scores 100. Miss and you score nothing. Each successful hit increases ball speed for the next attempt. Five attempts per round.</p>
            <p style={{ marginBottom: 10 }}>The key challenge is that you must tap slightly before the ball reaches the target to compensate for your reaction delay — just like a real tennis player must begin their swing before the ball arrives at the impact point. The faster the ball moves, the earlier you need to act.</p>
            <p>Save your score with a name and PIN to track your personal best and see your global ranking among all players worldwide.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Hand-eye coordination and the brain
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Hand-eye coordination involves a complex network of brain regions working in concert. The visual cortex processes the ball's position and trajectory. The parietal lobe integrates this spatial information and predicts where the ball will be. The cerebellum coordinates the timing and precision of the motor response. The motor cortex executes the tap at exactly the right moment.</p>
            <p style={{ marginBottom: 10 }}>This network is one of the most extensively trained in human evolution. Our ancestors needed precise interceptive timing to throw spears, catch prey and deflect threats. The neural circuits involved are ancient and highly trainable — which is why hand-eye coordination improves rapidly with practice and why the improvements feel so satisfying.</p>
            <p style={{ marginBottom: 10 }}>Studies of older adults who engage in regular hand-eye coordination training show significantly better performance on tests of fine motor control, balance and reaction time compared to sedentary peers of the same age. The cerebellum, which coordinates timing and precision, remains highly plastic throughout life and responds well to this type of training.</p>
            <p>Professional athletes in racket sports develop extraordinary hand-eye coordination through thousands of hours of practice. A professional tennis player can return a serve traveling at 220km/h — giving them approximately 400 milliseconds to track the ball, calculate its trajectory, initiate a full swing and make contact at the precise right moment. Ace trains the same fundamental skill in a form accessible to everyone.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            The serve in padel and tennis
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>The serve is the only shot in tennis and padel where the player has complete control over the ball before striking it. Yet it remains one of the most technically demanding shots because it requires precise timing of a full-body kinetic chain — legs, hips, torso, shoulder, arm and wrist must all fire in the correct sequence to produce a powerful, accurate serve.</p>
            <p style={{ marginBottom: 10 }}>The contact point — the moment the racket meets the ball — is the most critical instant. Even a timing error of 10 milliseconds can change the direction of the ball by several degrees, turning a winning serve into a fault. Elite servers develop an extraordinarily consistent sense of this contact moment through years of repetition and feedback.</p>
            <p style={{ marginBottom: 10 }}>Padel has exploded in popularity over the past decade, becoming the fastest-growing sport in the world by number of players. Unlike tennis, padel is played in an enclosed court with glass walls and wire fencing, and the ball can bounce off the walls — creating a faster, more social game that is easier to learn but equally demanding of timing and coordination at higher levels.</p>
            <p>Both sports require the same fundamental cognitive skill that Ace trains: the ability to predict where a moving object will be at a future moment and coordinate a precise motor action to meet it there. This skill transfers directly from the screen to the court — players who train Ace regularly report improved timing in their real-world racket sport practice.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Tips to improve your score
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Track the ball from the moment it appears, not just when it approaches the target. The more of the ball's trajectory you observe, the more accurately your brain can predict its arrival time at the target zone. Players who start watching late consistently miss more often than those who track the full arc.</p>
            <p style={{ marginBottom: 10 }}>Tap slightly before the ball reaches the target center. Your tap registers approximately 150 to 200 milliseconds after you decide to tap. At higher ball speeds, this delay means the ball will have traveled significantly past the center by the time your tap registers. Adjust your timing earlier as the ball speed increases.</p>
            <p style={{ marginBottom: 10 }}>Focus on the target zone, not the ball. This sounds counterintuitive, but experienced players in racket sports use a similar technique — they focus on the contact point rather than tracking the ball all the way in. Keeping the target in the center of your visual attention makes it easier to judge when the ball enters the sweet spot.</p>
            <p>Stay relaxed between attempts. Tension and anxiety increase timing variability and slow motor execution. Take a breath between shots, relax your tapping hand, and approach each attempt with calm focus rather than urgency. The most consistent performers on Ace maintain the same mental state across all five attempts regardless of how the previous one went.</p>
          </div>
        </details>

        <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Why interceptive timing is hard to fake
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Interceptive timing cannot be improved through memorization or strategy alone — it requires genuine motor learning through repetition and feedback. Unlike knowledge games where you can study facts in advance, or even reaction time games where alertness is the primary factor, interceptive timing demands that your cerebellum build a precise internal model of moving objects through thousands of trials.</p>
            <p style={{ marginBottom: 10 }}>This is why sports coaches emphasize repetition above all else for timing skills. A batsman does not get better by reading about batting — they get better by facing thousands of deliveries and receiving feedback on each one. Ace provides exactly this type of training: immediate visual feedback on every attempt, a score that reflects precision rather than luck, and increasing difficulty that prevents stagnation.</p>
            <p style={{ marginBottom: 10 }}>The improvements from interceptive timing training are also among the most durable of any cognitive skill. Unlike working memory improvements, which can fade quickly without continued practice, motor timing improvements tend to persist for months or years after training ends. This is because motor learning is stored in the cerebellum and basal ganglia, which are more resistant to forgetting than declarative memory systems.</p>
            <p>Ace is one of the few games on MemGenius where your score genuinely reflects a deep motor skill rather than accumulated knowledge or peak alertness. Consistent high scores require real training — which makes the leaderboard a meaningful reflection of genuine ability.</p>
          </div>
        </details>

        <RelatedGames category="agility" current="Ace" />
      </div>
    </>
  )
}
