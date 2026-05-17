import Link from 'next/link'

const BROWN = '#4A2C0A'
const CREAM = '#FAF7F2'
const GREEN = '#2E7D32'

export const metadata = {
  title: 'Brain Age Test Online — Free, No Login | MemGenius',
  description: 'Discover your brain age in 4 minutes with the free MemGenius Brain Age Test. 5 cognitive games measuring memory, reaction time, precision, geography and logic. No login required.',
}

export default function BlogPost() {
  return (
    <main style={{ minHeight: '100dvh', background: CREAM, fontFamily: 'var(--font-nunito), sans-serif', color: BROWN }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>

        <Link href="/blog" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#4A2C0A50', marginBottom: 24 }}>Back to Blog</div>
        </Link>

        <div style={{ fontSize: 11, fontWeight: 800, color: GREEN, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Brain Training · May 2026</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.15 }}>Brain Age Test Online — Discover How Old Your Brain Really Is</h1>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>Your biological age and your brain age are two very different numbers. A 45-year-old who trains their cognitive abilities daily can have a brain that performs like a 28-year-old. A 25-year-old who never challenges their mind can test at 38. The MemGenius Brain Age Test measures exactly this — not how many years you have lived, but how well your brain actually performs right now.</p>

        <div style={{ background: GREEN, borderRadius: 20, padding: '20px 24px', marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Take the Brain Age Test now</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>5 games · 4 minutes · Free · No login</div>
          <Link href="/brain-test" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-block', background: '#fff', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 900, color: GREEN }}>Start Brain Age Test →</div>
          </Link>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 12px' }}>What is a Brain Age Test?</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>A brain age test is a standardized assessment of cognitive performance that produces a single number representing how your brain compares to the average performance of people at different ages. If you score like the average 30-year-old, your brain age is 30, regardless of whether you are actually 22 or 55.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>The concept was popularized by the Nintendo DS game Brain Age in 2005, which introduced millions of people to the idea that cognitive fitness is something you can measure and improve. Since then, neuroscience research has validated the core premise — that specific cognitive tasks can reliably predict overall brain health and the rate of cognitive aging.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>What the MemGenius Brain Age Test measures</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>The MemGenius Brain Age Test consists of five short games, each targeting a different cognitive domain. Together they produce a comprehensive picture of your brain performance across the areas most affected by aging.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '20px 0 8px' }}>1. Ace — Timing and Motor Precision</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>A tennis ball moves across the screen in an arc. You must hit the ball at the exact moment it passes through a target circle. This measures your timing precision and the speed of your sensorimotor loop — the circuit connecting visual perception to motor response. This ability peaks in the mid-twenties and declines measurably from the mid-thirties onward. Athletes who maintain this circuit through regular practice show significantly slower decline.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '20px 0 8px' }}>2. N-Back — Working Memory</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Colors appear and disappear one at a time. You must decide whether each new color matches the one that appeared immediately before it. This is the 1-Back version of the N-Back task, one of the most studied paradigms in cognitive neuroscience. Working memory — the ability to hold information in mind while processing new input — is the single cognitive ability most predictive of general intelligence and most sensitive to aging. It begins declining in the mid-thirties and accelerates after fifty.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '20px 0 8px' }}>3. Stop — Temporal Precision</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>A timer starts running. You must stop it at exactly five seconds. Your score is determined by how many milliseconds off you are. This measures your internal time perception — a cognitive function located primarily in the basal ganglia and cerebellum. People with better time perception perform better on tasks requiring attention, planning and impulse control. Time perception accuracy is strongly correlated with processing speed, which is one of the first cognitive abilities to decline with age.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '20px 0 8px' }}>4. GeoShape — Spatial Cognition and Long-term Knowledge</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Country outlines appear on screen and you must identify them from four options. This measures visuospatial processing — the ability to mentally rotate and recognize shapes — combined with crystallized intelligence, which is the accumulated knowledge built over a lifetime. Unlike fluid intelligence, crystallized intelligence typically increases through the forties and fifties before plateauing. This makes the GeoShape score particularly informative for older adults.</p>

        <h3 style={{ fontSize: 17, fontWeight: 900, margin: '20px 0 8px' }}>5. Digits — Short-term Memory Span</h3>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Seven digits appear for 2.5 seconds. They disappear. You type them in order using a numeric keypad. Both accuracy and speed are measured. Digit span — how many items you can hold in short-term memory — is a classic measure from the Wechsler intelligence scales used by psychologists for over a century. The average adult can hold seven items, give or take two. This capacity peaks in the twenties and declines slowly through adulthood, with more rapid decline after sixty-five.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>How your Brain Age is calculated</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>Each of the five games produces a score from 0 to 200 points, giving a total Brain Score between 0 and 1000. The scoring weights are calibrated to reflect the relative importance of each cognitive domain and the typical performance curves observed across age groups in published research.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>The N-Back score receives the highest weighting because working memory is the most predictive single measure of cognitive health. Stop precision receives a steep penalty curve because temporal precision declines sharply and consistently with age. The Digits score uses a fixed scale that rewards perfect recall disproportionately, since maintaining a full seven-digit span is a meaningful marker of intact short-term memory.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>The Brain Score is then converted to a Brain Age using a formula calibrated to typical performance by age group. A perfect score of 1000 corresponds to a Brain Age of 18 — the peak of most measured cognitive abilities. A score of 500 corresponds to approximately 41. A score near zero corresponds to 65. The formula also applies a time penalty — if you take significantly longer than the expected four minutes to complete the test, your Brain Age increases, reflecting the processing speed component of cognitive performance.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>What your Brain Age result means</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 16 }}>A Brain Age below your actual age is a positive sign. It suggests your cognitive performance is above average for your demographic. A Brain Age above your actual age does not mean something is wrong — it means there is room to improve, and cognitive improvement through regular mental exercise is well-documented in the research literature.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}>The most valuable use of your Brain Age score is as a baseline. Take the test today, then take it again in four weeks after daily training. The change in your score is more informative than the absolute number, because it controls for individual differences in cognitive style, education, and test-taking experience.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>How to improve your Brain Age</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 8 }}><strong>Daily cognitive training.</strong> Playing brain training games for 15-20 minutes every day produces measurable improvements in working memory, processing speed and attention within two to four weeks. The key is consistency — daily practice outperforms longer but less frequent sessions.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 8 }}><strong>Sleep.</strong> Sleep deprivation is one of the largest acute drivers of poor cognitive performance. A single night of poor sleep can temporarily raise your Brain Age by five to ten years on tests like this one. Prioritizing seven to nine hours of sleep is the highest-leverage intervention available.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 8 }}><strong>Aerobic exercise.</strong> Cardiovascular exercise increases brain-derived neurotrophic factor, a protein that supports the growth and maintenance of neurons. Studies show that adults who engage in regular aerobic exercise have larger hippocampal volume and better memory scores than sedentary adults of the same age.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#4A2C0A80', marginBottom: 24 }}><strong>Variety of challenges.</strong> The brain adapts to repeated stimuli — a game that challenged you last month may provide less benefit today. MemGenius offers sixteen games across four cognitive categories. Rotating between memory, agility, knowledge and logic training keeps the brain adapting and prevents the plateau that limits single-task training.</p>

        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '32px 0 12px' }}>Frequently asked questions</h2>
        {[
          { q: 'Is the MemGenius Brain Age Test scientifically accurate?', a: 'The test is based on established cognitive assessment paradigms — the N-Back task, digit span, temporal precision and visuospatial recognition — that have been validated in peer-reviewed research. It is not a clinical diagnostic tool and should not be used for medical decisions, but it provides a meaningful and reliable snapshot of your current cognitive performance.' },
          { q: 'How often should I take the Brain Age Test?', a: 'Once a month is a reasonable frequency for tracking progress. Taking it more often can lead to practice effects — improvements driven by familiarity with the test format rather than genuine cognitive gains. Monthly testing gives your brain time to adapt to training before measuring again.' },
          { q: 'Can my Brain Age change significantly?', a: 'Yes. Research shows that intensive cognitive training can produce meaningful improvements in working memory and processing speed within four to eight weeks. Lifestyle changes — improving sleep, starting regular exercise, reducing chronic stress — can produce even larger effects.' },
          { q: 'Is the Brain Age Test free?', a: 'Completely free. No login, no subscription, no payment. Play directly in your browser on any device.' },
          { q: 'What is a good Brain Age score?', a: 'A Brain Age below your actual age is a good score. A Brain Age more than ten years below your actual age is an excellent score. However, the most meaningful measure is your personal trend — whether your Brain Age is improving over time with consistent training.' },
          { q: 'Can I take the test on mobile?', a: 'Yes. The MemGenius Brain Age Test is designed mobile-first. All five games work perfectly on a smartphone browser with no installation required.' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', marginBottom: 12, border: '1px solid #4A2C0A10' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: BROWN, marginBottom: 8 }}>{item.q}</div>
            <div style={{ fontSize: 14, color: '#4A2C0A70', lineHeight: 1.7 }}>{item.a}</div>
          </div>
        ))}

        <div style={{ background: `${GREEN}10`, borderRadius: 20, padding: 28, textAlign: 'center', marginTop: 40, border: `1px solid ${GREEN}20` }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px' }}>How old is your brain?</h3>
          <p style={{ fontSize: 14, color: '#4A2C0A70', margin: '0 0 16px' }}>Free Brain Age Test · 5 games · 4 minutes · No login</p>
          <Link href="/brain-test" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-block', background: GREEN, borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 900, color: '#fff' }}>Start Brain Age Test</div>
          </Link>
        </div>

      </div>
    </main>
  )
}
