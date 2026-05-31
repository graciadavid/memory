import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
 title: 'Reaction Time Test — Free Online | MemGenius',
 description: 'Test your reaction time for free online. No download, no login. See where you rank against the world.',
 keywords: ['reaction time test', 'online reaction time', 'human reaction time', 'reaction speed test', 'free reaction test'],
}

export default function ReactionTimeTestPage() {
 return (
   <main style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 100px', fontFamily: 'var(--font-nunito), sans-serif', background: '#fff', minHeight: '100dvh' }}>
     
     <h1 style={{ fontSize: 32, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>Reaction Time Test</h1>
     <p style={{ fontSize: 16, lineHeight: 1.8, color: '#555', marginBottom: 32 }}>How fast is your brain? Most people think they react pretty quickly. Most people are wrong. The average reaction time is 250ms. A Formula 1 driver reacts in under 200ms. Test yours for free and find out where you really stand.</p>

     <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E', marginBottom: 16 }}>Pick your test</h2>

     <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>

       <Link href="/stop" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '20px 24px', border: '1px solid #e0e0e0', display: 'block' }}>
         <div style={{ fontSize: 18, fontWeight: 900, color: '#1C1C1E', marginBottom: 6 }}>Stop</div>
         <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>Stop a timer at exactly 5 seconds. No visual help. Just you and your internal sense of time. It sounds easy. It really isn't. The world record is under 5ms from perfect.</div>
         <div style={{ marginTop: 10, fontSize: 13, fontWeight: 800, color: '#2E7D32' }}>Play free →</div>
       </Link>

       <Link href="/f1" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '20px 24px', border: '1px solid #e0e0e0', display: 'block' }}>
         <div style={{ fontSize: 18, fontWeight: 900, color: '#1C1C1E', marginBottom: 6 }}>F1 Reaction</div>
         <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>React the moment the Formula 1 lights go out. Pure reaction time, nothing else. How close to a real F1 driver are you?</div>
         <div style={{ marginTop: 10, fontSize: 13, fontWeight: 800, color: '#2E7D32' }}>Play free →</div>
       </Link>

       <Link href="/pendulum" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '20px 24px', border: '1px solid #e0e0e0', display: 'block' }}>
         <div style={{ fontSize: 18, fontWeight: 900, color: '#1C1C1E', marginBottom: 6 }}>Pendulum</div>
         <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>Stop a swinging pendulum at dead center. This one is about anticipation, not just reaction. You have to predict where it will be, not react to where it is. Much harder than it looks.</div>
         <div style={{ marginTop: 10, fontSize: 13, fontWeight: 800, color: '#2E7D32' }}>Play free →</div>
       </Link>

       <Link href="/ace" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '20px 24px', border: '1px solid #e0e0e0', display: 'block' }}>
         <div style={{ fontSize: 18, fontWeight: 900, color: '#1C1C1E', marginBottom: 6 }}>Ace</div>
         <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>Tap when a moving ball crosses a line. Same idea as hitting a tennis ball or catching something mid-air. Your brain is judging speed and position at the same time.</div>
         <div style={{ marginTop: 10, fontSize: 13, fontWeight: 800, color: '#2E7D32' }}>Play free →</div>
       </Link>

       <Link href="/letter-rain" style={{ textDecoration: 'none', background: '#f5f5f5', borderRadius: 16, padding: '20px 24px', border: '1px solid #e0e0e0', display: 'block' }}>
         <div style={{ fontSize: 18, fontWeight: 900, color: '#1C1C1E', marginBottom: 6 }}>Letter Rain</div>
         <div style={{ fontSize: 14, color: '#666', lineHeight: 1.7 }}>Letters fall from the top. Count only the target letter. Simple idea, brutal execution. Your brain has to filter and count at the same time under pressure.</div>
         <div style={{ marginTop: 10, fontSize: 13, fontWeight: 800, color: '#2E7D32' }}>Play free →</div>
       </Link>

     </div>

     <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>What is reaction time exactly?</h2>
     <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 16 }}>It is the time between something happening and your body doing something about it. Your eyes see a stimulus, your brain processes it, and your muscles respond. The whole chain takes somewhere between 150ms and 400ms depending on the person and the task.</p>
     <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 32 }}>Simple tasks like pressing a button when a light appears are faster. Complex tasks where you have to choose what to do, or predict where something will be, take longer. Both types are worth training.</p>

     <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>Can you actually get faster?</h2>
     <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 16 }}>Yes. Not infinitely, but measurably. Most people improve their Stop score by 30 to 50% in the first two weeks of daily practice. The improvement is real and it transfers to other tasks too.</p>
     <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 16 }}>Exercise helps a lot. Twenty minutes of cardio improves reaction time for several hours. Sleep deprivation destroys it. One night of poor sleep can make you react as slowly as someone who is legally drunk.</p>
     <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 40 }}>Age matters too but less than people think. Reaction time peaks around 24 and declines slowly. With regular training you can maintain performance well above average for decades.</p>

     <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1C1C1E', marginBottom: 12 }}>Where does your country rank?</h2>
     <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', marginBottom: 32 }}>We have collected reaction time data from players across 50 countries. Egypt consistently has the most precise internal timing, with an average error of 23ms on Stop. The US averages 168ms. Spain 158ms. Nobody has hit exactly 0ms yet. Play and see where you stand globally.</p>

     <div style={{ background: '#1C1C1E', borderRadius: 20, padding: '28px 24px', textAlign: 'center' }}>
       <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Ready to test yours?</div>
       <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Free. No login. World rankings.</div>
       <Link href="/stop" style={{ textDecoration: 'none', display: 'inline-block', background: '#2E7D32', borderRadius: 14, padding: '14px 32px', fontSize: 16, fontWeight: 900, color: '#fff' }}>
         Start now →
       </Link>
     </div>

   </main>
 )
}
