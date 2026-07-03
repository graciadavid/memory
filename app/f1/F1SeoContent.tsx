'use client'
import { useState } from 'react'
import Link from 'next/link'

const GOLD = '#C8960C'

const SECTIONS = [
  {
    title: 'What Is the F1 Reaction Test?',
    content: `This test reproduces the exact start-light sequence used on a real Formula 1 grid. Five pairs of red lights illuminate one at a time, then all go out together after a random pause. The moment they go dark, you react — just like a driver flooring the throttle at the start of a Grand Prix.

It sounds simple, but it isolates one specific skill: pure visual reaction time, free of guessing or rhythm. You cannot count the lights and time your response, because the pause before they go out is randomized on every attempt. The only way to score well is to genuinely react to the stimulus.

For context, the average human takes around 200-250ms to react to a simple visual cue. Trained athletes and racing drivers push that down through repetition, and this test is a quick way to see exactly where you stand — with a global ranking to compare yourself against everyone else who has taken it.`
  },
  {
    title: 'How the Real F1 Start Works',
    content: `The procedure you just played is not a simplification — it is how every Formula 1 race actually starts. Five pairs of red lights come on at one-second intervals across the gantry above the grid. Once all five are lit, an official (or, since 2023, an automated system) holds them for a random duration — between roughly 0.2 and 3 seconds — specifically to prevent drivers from anticipating the exact moment.

When the lights go out simultaneously, that is the start signal. Every car on the grid is fitted with a sensor that detects the smallest movement before that instant. If a driver moves even a fraction of a second early, it is flagged as a jump start and penalized — which is exactly what happens in this test when you tap during the "Wait..." phase and see "Too soon!"

This randomized hold is a deliberate piece of game design by the FIA: it forces every driver to rely on genuine reaction rather than rhythm or memorized timing, which is precisely the cognitive skill this test measures.`
  },
  {
    title: 'How Fast Are F1 Drivers, Really?',
    content: `Professional racing drivers train reaction time as seriously as they train fitness. Simple visual reaction time for the general population averages around 200-250ms; elite athletes and trained drivers can consistently push below that, though there is a hard physiological floor — reactions clocked much below roughly 100-150ms are generally considered anticipation rather than a genuine response to the signal, which is why start-line sensors and statistical checks exist in real racing to catch jump starts that "look" fast but were actually guesses.

That distinction matters for this test too. A very fast time is a great result, but an impossibly fast one usually means you reacted to your own internal countdown rather than the lights — the same trap real drivers have to avoid on an actual grid.`
  },
  {
    title: 'MemGenius Global Benchmarks',
    content: `Numbers below are pulled directly from real attempts recorded on this test, not estimates:

- Median reaction time across all recorded attempts: 345ms
- Top 25% of players: under 298ms
- Top 10% of players: under 234ms
- Only about 1 in 9 attempts beats the commonly-cited "average human" benchmark of 250ms

If your result lands under 250ms, you are already ahead of roughly 90% of everyone who has taken this test. Under 200ms puts you in truly elite territory — the range associated with trained athletes and professional drivers.`
  },
  {
    title: 'How to Improve Your Reaction Time',
    content: `Reaction time is trainable, though the ceiling is largely physiological. A few things reliably help:

Sleep is the single biggest lever. Even mild sleep deprivation measurably slows visual reaction time — if you want an honest score, take this test well-rested rather than late at night.

Practice helps, but with a catch: repeated attempts on the exact same test teach you the "feel" of the interface more than they improve raw reaction speed. Genuine improvement in reaction time is better trained through varied stimuli — which is why this test is paired with Pendulum, Ace, and Letter Rain in the Agility category, each targeting a slightly different timing skill.

Caffeine, taken in moderate doses roughly 30-60 minutes before testing, is one of the few substances with consistent evidence for improving simple reaction time. Cold exposure (a cold shower or splash of cold water) can produce a similar short-term alertness boost.

Minimize distraction. Reaction time tests are sensitive to divided attention — testing with notifications on or music playing measurably slows results compared to a quiet, focused attempt.`
  },
]

export default function F1SeoContent() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section style={{ maxWidth: 430, margin: '0 auto', padding: '8px 16px 60px', fontFamily: 'var(--font-nunito),sans-serif' }}>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }} />

      {SECTIONS.map((s, i) => (
        <div key={i} style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : undefined, paddingTop: 12, marginBottom: 12 }}>
          <div onClick={() => setOpen(open === i ? null : i)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', paddingBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>{s.title}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>{open === i ? '▲' : '▼'}</div>
          </div>
          {open === i && (
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{s.content}</div>
          )}
        </div>
      ))}

      <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', margin: '28px 0 12px' }}>More Agility Tests</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { href: '/stop', title: 'Stop', desc: 'Internal clock precision — stop at exactly 5.000s' },
          { href: '/pendulum', title: 'Pendulum', desc: 'Anticipatory timing — stop a swing at dead center' },
          { href: '/ace', title: 'Ace', desc: 'Spatial reaction — tap the moving sweet spot' },
          { href: '/letter-rain', title: 'Letter Rain', desc: 'Selective attention under time pressure' },
        ].map(g => (
          <Link key={g.href} href={g.href} style={{ textDecoration: 'none', background: '#252525', borderRadius: 12, padding: '12px 16px', display: 'block' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{g.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{g.desc}</div>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <Link href="/reaction-time-test" style={{ textDecoration: 'none', fontSize: 12, fontWeight: 800, color: GOLD }}>See all 5 reaction time tests →</Link>
      </div>
    </section>
  )
}
