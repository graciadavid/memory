import PendulumClient from './PendulumClient'
import RelatedGames from '@/components/RelatedGames'

export const metadata = {
  title: 'Pendulum — Timing Precision Game | MemGenius',
  description: 'Tap when the pendulum is perfectly vertical. Free online timing precision game with world ranking. Train your anticipatory timing. No login required.',
}

export default function PendulumPage() {
  return (
    <>
      <PendulumClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>Can you tap at the perfect moment?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Pendulum is a timing precision game where a pendulum swings back and forth on screen. Your challenge is to tap at the exact moment it reaches the vertical position — the center of its arc. Your score is the angle between where the pendulum was when you tapped and perfect vertical, measured in degrees.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>Unlike reaction time games where faster is always better, Pendulum rewards accuracy over speed. You must predict the pendulum's motion slightly ahead of time and fire the tap command early enough to compensate for your own reaction delay.</p>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            How to play
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>A pendulum swings back and forth on screen. Tap anywhere at the moment it reaches the vertical position — pointing straight down. The closer to perfectly vertical your tap lands, the lower your score. A score of 0.0° means you tapped at the exact vertical moment. Lower is always better.</p>
            <p style={{ marginBottom: 10 }}>The pendulum speed varies slightly between rounds, so you cannot rely on pure rhythm. You must track the actual motion and judge the moment dynamically. The challenge increases because your tap registers slightly after you decide to tap — you need to anticipate and act a fraction early.</p>
            <p>Save your score with a name and PIN to track your personal best and see your global ranking. The world leaderboard shows the most precise tappers from around the world.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            The physics of a real pendulum
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>A real pendulum moves fastest at the bottom of its arc — the vertical position — and slowest at the extremes of its swing. This is because gravitational potential energy converts to kinetic energy as the pendulum falls toward the center, and back to potential energy as it rises toward the sides. The result is a sinusoidal motion that is fastest exactly where you need to tap.</p>
            <p style={{ marginBottom: 10 }}>This makes Pendulum deceptively difficult. The pendulum is moving at maximum speed precisely when you need to tap it, giving you the smallest window of opportunity. At the extremes of the swing, it is nearly stationary and easy to tap accurately — but tapping there would give you a very poor score since it is far from vertical.</p>
            <p style={{ marginBottom: 10 }}>The period of a pendulum — the time for one complete swing — depends only on its length and the strength of gravity. A pendulum one meter long has a period of approximately 2 seconds regardless of how wide it swings, as long as the angle is not too large. This is why pendulums were used in clocks for centuries — their timing is extraordinarily consistent.</p>
            <p>Galileo Galilei first described the isochronous property of pendulums in 1602, after allegedly observing a swinging chandelier in Pisa Cathedral and timing it against his own pulse. This discovery eventually led to the development of the pendulum clock by Christiaan Huygens in 1656, which remained the world's most accurate timekeeping device for nearly 300 years.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Anticipatory timing — the key skill
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Pendulum trains anticipatory timing — also called coincidence anticipation timing in sports science. This is the ability to synchronize a motor action with a moving target arriving at a specific point in space at a specific time. It is fundamentally different from simple reaction time, which responds to something that has already happened.</p>
            <p style={{ marginBottom: 10 }}>Anticipatory timing requires your brain to build a predictive model of the pendulum's motion and calculate when to fire the motor command so that the physical tap coincides with the target position. Since your tap registers approximately 150 to 250 milliseconds after you decide to tap, you must act before the pendulum reaches vertical — not when it arrives there.</p>
            <p style={{ marginBottom: 10 }}>This skill is central to ball sports. A cricket batsman timing a pull shot, a tennis player returning a fast serve, a footballer heading a cross — all require the same neural computation that Pendulum trains. The brain must predict where the ball will be and initiate the swing early enough for the bat or foot to arrive at the right place at the right time.</p>
            <p>Research shows that anticipatory timing improves significantly with practice and that improvements transfer across different tasks. Players who train extensively on Pendulum report better timing in sports, music and other activities that require synchronization with external events. It is one of the most broadly applicable cognitive skills trained by any game on MemGenius.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Tips to improve your score
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>The most important adjustment is to tap slightly early — before the pendulum reaches vertical — to compensate for your reaction delay. Most beginners tap when the pendulum looks vertical, but by that point it has already passed the target. Experiment with tapping when the pendulum is about 10 to 15 degrees before vertical and adjust from there based on your results.</p>
            <p style={{ marginBottom: 10 }}>Watch the whole arc, not just the center. Tracking the full motion of the pendulum gives your brain more information to build its predictive model. If you only look at the center, you have less time to prepare your response. Watching from the extreme of the swing gives you the full period to calculate when vertical will occur.</p>
            <p style={{ marginBottom: 10 }}>Relax your tapping hand. Tension in the muscles slows motor execution and increases variability. The most consistent tappers keep their hand relaxed and let the tap happen automatically once the decision is made, rather than consciously forcing the movement.</p>
            <p>Practice at different pendulum speeds. The game varies the speed slightly between rounds, which prevents you from relying on a fixed rhythm. Learning to adapt your timing to different speeds is the key to achieving consistently low scores rather than occasionally lucky ones.</p>
          </div>
        </details>

        <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Pendulum vs other agility games
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Pendulum is the most cognitively demanding of the four Agility games because it combines prediction, timing and motor control into a single action. Stop tests your internal clock in isolation. F1 Reaction tests pure response speed to an unpredictable stimulus. Pendulum requires all three simultaneously — you must predict the motion, time your response and execute it accurately.</p>
            <p style={{ marginBottom: 10 }}>Players who excel at F1 Reaction do not necessarily excel at Pendulum, and vice versa. Reaction time and anticipatory timing are distinct cognitive abilities that are only weakly correlated. Some people have fast reflexes but poor predictive timing. Others have average reaction times but exceptional ability to synchronize with moving targets. Pendulum specifically rewards the latter.</p>
            <p>Among timing games available online, Pendulum is unusual in that it specifically tests anticipatory timing rather than reactive timing. Most online reaction tests measure how fast you respond to something that has already happened. Pendulum measures something fundamentally different — how accurately you can predict when something will happen and coordinate your action accordingly.</p>
          </div>
        </details>

        <RelatedGames category="agility" current="Pendulum" />
      </div>
    </>
  )
}
