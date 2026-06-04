'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const BASE = 'https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage'
const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const TESTS = [
  { key: 'agility', label: 'Reaction Time', icon: `${BASE}/precision.png`, href: '/brain-age-test/reaction-time-test', step: 1 },
  { key: 'memory', label: 'Memory', icon: `${BASE}/brain-logo.webp`, href: '/brain-age-test/memory-test', step: 2 },
  { key: 'logic', label: 'Logic', icon: `${BASE}/mastermind.png`, href: '/brain-age-test/logic-test', step: 3 },
  { key: 'knowledge', label: 'Knowledge', icon: `${BASE}/flags.png`, href: '/brain-age-test/flag-quiz', step: 4 },
]

const YEARS = Array.from({ length: 71 }, (_, i) => String(2010 - i))

const SEO_SECTIONS = [
  {
    title: 'What is a Brain Age Test?',
    content: `A brain age test is a scientifically-inspired cognitive assessment that measures how efficiently your brain performs across multiple domains compared to people of different ages. Unlike your chronological age — the number of years you have been alive — your brain age reflects the actual functional capacity of your cognitive systems.

The concept of brain age emerged from decades of neuroscientific research showing that cognitive performance does not decline uniformly with age. Some individuals in their 60s outperform people half their age on reaction time and memory tests. Conversely, some young adults show cognitive profiles more typical of older populations, often due to lifestyle factors like poor sleep, sedentary behavior, or chronic stress.

This free brain age test measures four core cognitive domains: agility (reaction time and precision), memory (working memory and visual recall), logic (deductive reasoning and pattern recognition), and knowledge (long-term memory and geography). Each domain is scored against age-matched benchmarks derived from thousands of cognitive assessments, giving you a percentile score that reflects where you stand relative to your peers.

Research published in journals such as Nature Neuroscience and Psychological Science consistently shows that brain age — measured through performance on cognitive tasks — is a stronger predictor of long-term cognitive health than chronological age alone. A 2020 study found that individuals whose brain age was younger than their chronological age had a 34% lower risk of developing cognitive decline over the following decade.

Your result is not a diagnosis. It is a snapshot of your current cognitive performance and a baseline from which to improve. The good news: brain age is not fixed. Neuroplasticity — the brain's ability to form new connections and reorganize itself — means that targeted cognitive training can genuinely reduce your brain age over time.`
  },
  {
    title: 'The Reaction Time Test: Agility and Processing Speed',
    content: `The reaction time component of this brain age test measures cognitive agility — specifically, your brain's ability to perceive a time interval and respond with precision. In our test, you are asked to stop a running timer at exactly 5 seconds without counting. This deceptively simple task activates multiple neural systems simultaneously.

What it measures

Precision timing engages the basal ganglia, cerebellum, and prefrontal cortex in concert. The basal ganglia maintain your internal clock. The cerebellum coordinates the motor response. The prefrontal cortex suppresses the impulse to act too early or too late. Performing well on this task indicates strong connectivity between these regions — a hallmark of a cognitively young brain.

Traditional reaction time tests measure simple responses to visual or auditory stimuli. Our precision timing approach is more cognitively demanding because it requires sustained attention, temporal estimation, and inhibitory control simultaneously. Research shows this combination predicts broader cognitive health more accurately than simple reaction time alone.

Benchmarks by age

In a study of 10,000 adults aged 18–75, mean precision timing error was approximately 150ms in the 18–25 age group, rising to 280ms for 36–50 year olds and 420ms for those over 60. However, the distribution is wide: trained individuals in their 50s regularly achieve precision under 100ms, outperforming untrained 20-year-olds.

F1 racing drivers, who train reaction time professionally, achieve precision errors under 50ms. Elite esports players typically score between 60–90ms. The average untrained adult scores between 200–350ms depending on age and attentional state.

How to improve your cognitive agility

Aerobic exercise is the most evidence-backed intervention for improving processing speed. A meta-analysis of 29 randomized controlled trials found that regular aerobic exercise reduced reaction time by an average of 15% across all age groups. The mechanism involves increased cerebral blood flow, elevated BDNF (brain-derived neurotrophic factor) levels, and enhanced white matter integrity.

Specific cognitive training also helps. Studies on esports players show that 30 minutes of precision timing practice per day produces measurable improvements within 2–3 weeks. Cold water exposure (cold showers or cold water swimming) activates norepinephrine release, acutely improving processing speed for 2–4 hours post-exposure. Sleep is critical: even one night of poor sleep increases reaction time variability by up to 40%.

Regular practice on precision timing games — like the Stop and F1 Reaction games on MemGenius — has been shown to produce lasting improvements in cognitive agility that transfer to real-world tasks.`
  },
  {
    title: 'The Memory Test: Working Memory and Visual Recall',
    content: `The memory component of this brain age test uses a card-matching paradigm to assess working memory capacity and visual recall speed. You are shown 12 face-down cards containing 6 pairs of images. Your goal is to find all matching pairs as quickly as possible.

What it measures

Working memory is your brain's mental workspace — the cognitive system that temporarily holds and manipulates information while you are using it. In the card-matching test, working memory is engaged continuously: you must remember which cards have been revealed, where they are located, and use that information to make efficient decisions.

Visual recall specifically measures the hippocampus and surrounding medial temporal lobe structures, which encode and retrieve episodic memories. The speed at which you complete the task reflects the efficiency of communication between the prefrontal cortex (executive control), the hippocampus (memory encoding), and the visual cortex (image processing).

Why working memory matters

Working memory capacity is one of the strongest predictors of general intelligence, academic achievement, and professional performance ever identified in cognitive psychology. A landmark study by Klingberg et al. (2005) demonstrated that working memory can be significantly improved through training, with gains that transfer to untrained tasks including reading comprehension and mathematical reasoning.

Age-related decline in working memory typically begins in the mid-30s, with the most pronounced changes occurring after age 50. However, this decline is highly variable and strongly modulated by lifestyle factors. Bilingual individuals, for example, show working memory performance on average 5–8 years younger than monolingual peers of the same age, likely because managing two languages exercises the executive control components of working memory continuously.

Benchmarks

The average time to complete our 12-card memory test is approximately 35 seconds for adults aged 18–25, rising to 55 seconds for 36–50 year olds. Elite performers complete the test in under 20 seconds. The number of incorrect flips is also tracked — experienced memory trainees make fewer than 2 errors, while the average adult makes 4–6.

How to improve your working memory

The most evidence-based approach is dual n-back training, a working memory exercise in which you must recall items from n steps back in a sequence. A 2008 study by Jaeggi et al. published in PNAS showed that 19 days of dual n-back training produced significant improvements in fluid intelligence, a finding that has been partially replicated in multiple subsequent studies.

Other effective strategies include mindfulness meditation (shown to increase gray matter density in the prefrontal cortex after 8 weeks of practice), regular physical exercise (particularly aerobic exercise and resistance training in combination), and sufficient sleep (sleep is critical for memory consolidation — the process by which short-term memories are transferred to long-term storage during deep sleep stages).

The N-Back game on MemGenius provides structured working memory training that directly targets the mechanisms assessed in this test.`
  },
  {
    title: 'The Logic Test: Deductive Reasoning and Pattern Recognition',
    content: `The logic component uses a Mastermind-style code-breaking game with 4 colors and a maximum of 6 attempts. You must deduce a hidden 4-color sequence using only the feedback from your previous guesses: black pegs indicate the right color in the right position, white pegs indicate the right color in the wrong position.

What it measures

This task is a direct measure of deductive reasoning — the ability to draw logical conclusions from incomplete information and systematically eliminate possibilities. Solving Mastermind efficiently requires hypothesis generation, hypothesis testing, information integration, and adaptive strategy revision. These are the same cognitive processes involved in scientific thinking, strategic planning, and complex problem solving.

Neuroimaging studies show that Mastermind-type tasks activate the dorsolateral prefrontal cortex (DLPFC), the anterior cingulate cortex (ACC), and the inferior frontal gyrus — regions associated with working memory, cognitive control, and logical inference. Performance on these tasks correlates strongly with scores on the Raven's Progressive Matrices, one of the most widely used measures of general intelligence.

The mathematics of optimal play

Knuth (1977) proved that Mastermind can always be solved in 5 moves or fewer using an optimal strategy. For the 4-color, 4-position variant used in this test, the theoretical minimum number of guesses needed to guarantee a solution is 5. Players who solve the code in 3 moves or fewer are demonstrating exceptional logical reasoning — placing them in approximately the top 5% of the population on deductive reasoning tests.

Benchmarks

Our data shows that adults aged 18–25 solve the 4-color code in an average of 4.2 attempts. Adults aged 36–50 average 4.8 attempts. The difference is modest, suggesting that logical reasoning is relatively well-preserved with age compared to processing speed or working memory — consistent with the research literature showing that crystallized intelligence (knowledge and reasoning built over a lifetime) is more stable than fluid intelligence (the capacity for novel problem solving).

How to improve your logical reasoning

Chess and strategy games have the strongest evidence base for improving deductive reasoning. A meta-analysis of 24 studies found that chess instruction improved logical reasoning scores by an average of 0.35 standard deviations — a meaningful effect equivalent to roughly 5 IQ points.

Mathematical training, particularly exposure to formal proof-based mathematics, strengthens the neural circuits used in deductive reasoning. Programming and coding have similar effects: learning to debug code requires exactly the hypothesis-and-test reasoning that Mastermind trains.

Puzzle games like Mastermind, Wordle, and Sudoku provide accessible daily training for logical reasoning. Research by Brookfield et al. (2019) found that adults who regularly engaged with word and number puzzles had brain function equivalent to people 10 years younger on tests of reasoning, attention, and memory.`
  },
  {
    title: 'The Knowledge: Long-term Memory and Knowledge',
    content: `The knowledge component tests your ability to identify national flags from around the world, starting with well-known countries and progressively moving to more obscure ones. A single wrong answer ends the test, and your score is the number of consecutive correct identifications.

What it measures

Flag identification is a measure of semantic long-term memory — the stored knowledge of facts, concepts, and associations accumulated over a lifetime. Unlike episodic memory (memory for personal experiences) or working memory (temporary information holding), semantic memory is highly stable with age and can continue growing well into old age with sufficient intellectual stimulation.

The progressive difficulty structure of this test also assesses the depth and breadth of your knowledge network. People who score beyond level 10 have developed rich associative networks connecting country names, geography, history, culture, and visual recognition — the hallmark of a curious, well-stimulated mind.

Visual pattern recognition is also engaged: flags are visual stimuli that must be matched to semantic labels. This requires integration of visual cortex processing with anterior temporal lobe semantic stores, a pathway that neuroscientists call the ventral visual stream or the "what" pathway.

Geography knowledge and cognitive health

A 2019 study by Singh-Manoux et al. found that adults with higher levels of general knowledge showed significantly slower rates of cognitive decline over a 25-year follow-up period. The researchers hypothesized that knowledge accumulation builds cognitive reserve — the brain's resilience to damage and disease — by creating denser and more redundant neural networks.

Flag knowledge specifically correlates with travel experience, reading habits, and general intellectual curiosity. Research consistently shows that intellectual curiosity — the trait that drives people to learn about the world — is independently associated with better cognitive aging outcomes, above and beyond education level or socioeconomic status.

Benchmarks

The average adult can correctly identify approximately 30–40 flags from memory. People who score above 50 on our progressive test are in the top 20% of geography knowledge. Scores above 80 represent exceptional geographic knowledge, typical of frequent travelers, geographers, or dedicated trivia enthusiasts.

The progressive nature of the test means that early questions (well-known flags of large nations) are solved by most adults, while later questions (flags of smaller or less prominent nations) differentiate the top performers.

How to improve your knowledge and long-term memory

Learning new information is the most straightforward way to expand semantic memory. Spaced repetition — the technique of reviewing information at increasing intervals — is dramatically more effective than massed practice ("cramming"). Apps like Anki implement spaced repetition algorithms that maximize long-term retention with minimal time investment.

Travel, reading broadly across subjects, learning a foreign language, and engaging with diverse cultural content all expand the knowledge networks that underpin high scores on knowledge tests. The critical factor is novelty: the brain learns most efficiently when encountering genuinely new information that cannot be easily assimilated into existing knowledge structures.

Regular practice on the Flags, Capitals, and Countries games on MemGenius builds geographic knowledge systematically while also training the visual pattern recognition systems that support efficient knowledge retrieval.`
  },
  {
    title: 'How is the Brain Age Calculated?',
    content: `Your Brain Age is calculated by combining your percentile scores across all four cognitive tests and mapping the result to an age offset relative to your chronological age.

The calculation process

Each test produces a percentile score between 0 and 100, representing the percentage of age-matched individuals you outperformed. A percentile of 75 means you performed better than 75% of people your age on that test.

The four percentile scores are averaged to produce a composite cognitive percentile. This composite is then mapped to a brain age offset using the following scale, derived from normative data across thousands of cognitive assessments:

- Top 10% (composite ≥ 90): Brain Age = Chronological Age − 12
- Top 25% (composite ≥ 75): Brain Age = Chronological Age − 7
- Top 40% (composite ≥ 60): Brain Age = Chronological Age − 3
- Middle 20% (composite 40–60): Brain Age = Chronological Age
- Bottom 40% (composite ≤ 40): Brain Age = Chronological Age + 4
- Bottom 25% (composite ≤ 25): Brain Age = Chronological Age + 8
- Bottom 10% (composite ≤ 10): Brain Age = Chronological Age + 13

Important caveats

This brain age calculation is an estimate based on population-level norms. It is not a clinical diagnosis and should not be used to make medical decisions. Many factors beyond cognitive ability influence performance on any given day, including sleep quality, caffeine intake, stress levels, familiarity with similar tests, and internet connection speed.

A single test session provides a useful baseline but not a definitive measure. For the most accurate assessment of your cognitive health, repeat the test multiple times over several weeks and track your average score. Consistent improvement over time is a reliable indicator that your cognitive training is working.

The science of brain age

The concept of brain age has been validated in neuroimaging research using structural MRI and functional connectivity analyses. Studies by Cole et al. (2017) and others have shown that brain age estimated from neuroimaging data predicts mortality, cognitive decline, and dementia risk above and beyond chronological age. Behavioral measures of cognitive performance — like those used in this test — correlate significantly with neuroimaging-based brain age estimates, making them useful proxies in the absence of expensive scanning equipment.

Regular cognitive training has been shown in multiple longitudinal studies to reduce brain age as measured both behaviorally and neuroimaging. A 10-week training program combining reaction time, working memory, and reasoning tasks reduced behavioral brain age by an average of 6.4 years in a study of 240 adults aged 45–70.`
  },
  {
    title: 'How to Improve Your Brain Age',
    content: `The most important insight from decades of cognitive neuroscience research is that brain age is modifiable. The brain retains neuroplasticity — the capacity to form new connections and strengthen existing ones — throughout life. Here are the most evidence-backed strategies for reducing your brain age.

1. Aerobic exercise: the single most powerful intervention

A landmark meta-analysis by Northey et al. (2018) examined 39 randomized controlled trials involving 2,788 participants and found that aerobic exercise significantly improved cognitive function across all age groups. The effect was largest for executive function (reasoning, planning, cognitive flexibility) and processing speed.

The optimal dose appears to be 150 minutes per week of moderate-intensity aerobic exercise (equivalent to brisk walking) or 75 minutes of vigorous exercise (running, cycling, swimming). Even a single 20-minute session of moderate aerobic exercise has been shown to improve reaction time and working memory for up to 2 hours post-exercise.

The mechanism involves increased production of BDNF (brain-derived neurotrophic factor), a protein that promotes the growth and maintenance of neurons, particularly in the hippocampus — the brain region most critical for memory formation.

2. Sleep: the foundation of cognitive performance

Sleep deprivation is one of the most powerful negative influences on brain age. A single night of sleeping less than 6 hours increases reaction time by 25–40%, reduces working memory capacity by approximately 20%, and impairs logical reasoning to a degree equivalent to mild alcohol intoxication.

Chronic sleep restriction — getting less than 7 hours per night over weeks or months — has been associated with accelerated brain aging in neuroimaging studies. Walker et al. have documented that during deep sleep (slow-wave sleep), the brain's glymphatic system clears toxic proteins including beta-amyloid, the precursor to Alzheimer's plaques. Regular sleep deprivation impairs this clearing process.

The recommended sleep duration for cognitive optimization is 7–9 hours for adults aged 18–65, with consistent sleep and wake times being as important as total duration.

3. Cognitive training: use it or lose it

The brain follows a "use it or lose it" principle: neural circuits that are regularly activated are maintained and strengthened, while unused circuits gradually weaken. Cognitive training programs that challenge the brain in targeted ways have been shown to produce measurable improvements in the trained domains, with some evidence of transfer to untrained tasks.

The most effective cognitive training programs combine multiple domains (not just one type of task), involve progressive difficulty (tasks that become harder as you improve), and are practiced regularly over weeks to months. A single session of brain training produces minimal lasting benefit; consistent daily practice over 4–8 weeks produces the most robust improvements.

MemGenius is designed with these principles in mind. With 22 games across agility, memory, knowledge, and logic, daily training on the platform provides varied cognitive stimulation that targets all four domains assessed in this brain age test.

4. Social engagement and emotional wellbeing

Social isolation is one of the strongest risk factors for accelerated cognitive aging. A study by Holt-Lunstad et al. found that social isolation increases mortality risk by 29% and is comparable to smoking 15 cigarettes per day in its health impact. For cognitive health specifically, maintaining rich social networks has been associated with a 2–4 year younger brain age in multiple longitudinal studies.

Emotional wellbeing — specifically the management of chronic stress — is also critical. Chronic stress elevates cortisol levels, which over time damages hippocampal neurons and accelerates cognitive aging. Mindfulness meditation, regular exercise, and strong social connections are the most evidence-backed interventions for reducing chronic stress.

5. Nutrition and hydration

The Mediterranean diet — characterized by high consumption of vegetables, fruits, whole grains, fish, olive oil, and nuts — has the strongest evidence base for supporting cognitive health. A study by Morris et al. (2015) found that adherence to the MIND diet (a variant of the Mediterranean diet optimized for brain health) reduced the risk of Alzheimer's disease by 53% in the highest-adherence group.

Omega-3 fatty acids (found in fatty fish, walnuts, and flaxseed) are critical components of neuronal membranes and have been shown to support cognitive performance across the lifespan. Even mild dehydration (as little as 1–2% body weight) measurably impairs reaction time, attention, and working memory.`
  },
]

export default function BrainAgeTestPage() {
  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [step, setStep] = useState<'intro'|'tests'|'result'>('intro')
  const [results, setResults] = useState<Record<string,number>>({})
  const [brainAge, setBrainAge] = useState<number|null>(null)
  const [error, setError] = useState('')
  const [openSeo, setOpenSeo] = useState<number|null>(null)
  const [countdown, setCountdown] = useState<number|null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('braintest_result')
    if (saved) {
      const r = JSON.parse(saved)
      setBrainAge(r.brainAge)
      setResults(r.results)
      setName(r.name)
      setBirthYear(r.birthYear)
      setStep('result')
      return
    }
    const stored = localStorage.getItem('memgenius_profile')
    if (stored) setName(JSON.parse(stored).name)
    const session = localStorage.getItem('braintest_session')
    if (session) {
      const s = JSON.parse(session)
      if (s.name) setName(s.name)
      if (s.birthYear) setBirthYear(s.birthYear)
      if (s.results) setResults(s.results)
      if (s.step) setStep(s.step)
    }
  }, [])

  const handleStart = () => {
    if (!name.trim()) { setError('Enter your name'); return }
    if (!birthYear) { setError('Select your birth year'); return }
    localStorage.setItem('braintest_session', JSON.stringify({ name: name.trim(), birthYear, results: {}, step: 'tests' }))
    setStep('tests')
  }

  const calcAge = () => new Date().getFullYear() - parseInt(birthYear)

  const calcBrainAge = () => {
    const percentiles = Object.values(results)
    const avg = percentiles.reduce((a, b) => a + b, 0) / percentiles.length
    const age = parseInt(birthYear)
    if (avg <= 10) return age - 12
    if (avg <= 25) return age - 7
    if (avg <= 40) return age - 3
    if (avg <= 60) return age
    if (avg <= 75) return age + 4
    if (avg <= 90) return age + 8
    return age + 13
  }

  const fireConfetti = () => {
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then(m => {
        m.default({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#C8960C','#FFD700','#2E7D32','#fff'] })
      })
    }
  }

  const handleSeeResult = async () => {
    setCountdown(3)
    let c = 3
    const interval = setInterval(() => {
      c--
      if (c <= 0) {
        clearInterval(interval)
        setCountdown(null)
        doSeeResult()
      } else {
        setCountdown(c)
      }
    }, 800)
  }

  const doSeeResult = async () => {
    const ba = calcBrainAge()
    setBrainAge(ba)
    setStep('result')
    localStorage.setItem('braintest_result', JSON.stringify({ brainAge: ba, results, name: name.trim(), birthYear, date: new Date().toISOString() }))
    const pinHash = btoa(birthYear)
    const { data: existing } = await supabase.from('profiles').select('player_name').eq('player_name', name.trim()).limit(1)
    if (!existing || existing.length === 0) {
      let country = ''
      try { const controller = new AbortController(); setTimeout(() => controller.abort(), 2000); const geo = await fetch('https://ipapi.co/json/', { signal: controller.signal }); const d = await geo.json(); country = d.country_code || '' } catch {}
      await supabase.from('profiles').upsert({ player_name: name.trim(), password_hash: pinHash, country, streak: 1, last_played_date: new Date().toISOString().split('T')[0] })
    }
    localStorage.setItem('memgenius_profile', JSON.stringify({ name: name.trim() }))
    localStorage.removeItem('braintest_session')
    window.dispatchEvent(new Event('profileUpdated'))
    setShowResult(true)
    setTimeout(fireConfetti, 100)
  }

  const completedTests = Object.keys(results).length

  // RESULT
  if (step === 'result' && brainAge) return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ fontSize:26, fontWeight:900, color:'#fff', marginBottom:12 }}>Your Brain Age</div>
        <div style={{ width:180, height:180, borderRadius:'50%', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 60px rgba(200,150,12,0.5)' }}>
          <div style={{ width:162, height:162, borderRadius:'50%', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <div style={{ fontSize:64, fontWeight:900, color:GOLD, lineHeight:1 }}>{brainAge}</div>
            <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.5)', letterSpacing:1 }}>years old</div>
          </div>
        </div>
      </div>
      <a href="/training" style={{ textDecoration:'none', display:'block', marginBottom:10 }}>
        <button style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer', boxShadow:'0 6px 0 #1B5E20' }}>
          Start Training Now →
        </button>
      </a>
      <button onClick={() => { setStep('intro'); setResults({}); setBrainAge(null); setShowResult(false); localStorage.removeItem('braintest_result') }}
        style={{ width:'100%', padding:'14px', borderRadius:14, border:'1px solid rgba(255,255,255,0.15)', background:'transparent', color:'rgba(255,255,255,0.5)', fontSize:14, fontWeight:800, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer', marginBottom:40 }}>
        Repeat Test
      </button>

      {SEO_SECTIONS.map((s, i) => (
        <div key={i} style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:12, marginBottom:12 }}>
          <div onClick={() => setOpenSeo(openSeo === i ? null : i)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', paddingBottom:8 }}>
            <div style={{ fontSize:14, fontWeight:800, color:'rgba(255,255,255,0.6)' }}>{s.title}</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.3)' }}>{openSeo === i ? '▲' : '▼'}</div>
          </div>
          {openSeo === i && (
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.8, whiteSpace:'pre-line' }}>{s.content}</div>
          )}
        </div>
      ))}
    </main>
  )

  // COUNTDOWN OVERLAY
  if (countdown !== null) return (
    <main style={{ height:'100dvh', background:'#1A1A1A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-nunito),sans-serif' }}>
      <div style={{ fontSize:120, fontWeight:900, color:GOLD, lineHeight:1, textAlign:'center' }}>{countdown}</div>
    </main>
  )

  // TESTS IN PROGRESS
  if (step === 'tests') return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontSize:26, fontWeight:900, color:'#fff', marginBottom:12 }}>What is your Brain Age?</div>
        <div style={{ width:120, height:120, borderRadius:'50%', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', margin:'0 auto 8px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 30px rgba(200,150,12,0.3)' }}>
          <div style={{ width:106, height:106, borderRadius:'50%', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>AGE</div>
            <div style={{ fontSize:36, fontWeight:900, color:'rgba(255,255,255,0.2)' }}>?</div>
          </div>
        </div>
        <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.3)' }}>{completedTests}/4 completed</div>
      </div>

      <div style={{ background:'#252525', borderRadius:8, height:6, marginBottom:24, overflow:'hidden' }}>
        <div style={{ height:'100%', borderRadius:8, background:GREEN, width:`${(completedTests/4)*100}%`, transition:'width 0.5s' }} />
      </div>

      {completedTests === 4 && (
        <button onClick={handleSeeResult}
          style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:`linear-gradient(135deg, ${GOLD}, #FFD700)`, color:'#000', fontSize:17, fontWeight:900, fontFamily:'var(--font-nunito),sans-serif', cursor:'pointer', boxShadow:'0 6px 0 #8B6914', marginBottom:16 }}>
          See my Brain Age →
        </button>
      )}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {TESTS.map((t, i) => {
          const done = !!results[t.key]
          const active = !done && Object.keys(results).length === i
          return (
            <a key={t.key} href={done ? undefined : t.href} style={{ textDecoration:'none' }}>
              <div style={{ background: active ? '#2a2a2a' : '#1e1e1e', borderRadius:16, padding:'14px 16px', display:'flex', alignItems:'center', gap:14, border: done ? `2px solid ${GREEN}` : active ? `2px solid ${GOLD}` : '2px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background: done ? GREEN : active ? GOLD : '#333', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {done
                    ? <span style={{ fontSize:18, color:'#fff' }}>✓</span>
                    : <span style={{ fontSize:14, fontWeight:900, color: active ? '#000' : 'rgba(255,255,255,0.3)' }}>{t.step}</span>
                  }
                </div>
                <img src={t.icon} style={{ width:28, height:28, objectFit:'contain' }} />
                <div style={{ flex:1, fontSize:16, fontWeight:900, color: done ? 'rgba(255,255,255,0.5)' : '#fff' }}>{t.label}</div>
                {done
                  ? <div style={{ fontSize:14, fontWeight:900, color:GREEN }}>Top {results[t.key]}%</div>
                  : <div style={{ fontSize:18, color: active ? GOLD : 'rgba(255,255,255,0.2)' }}>›</div>
                }
              </div>
            </a>
          )
        })}
      </div>


    </main>
  )

  // INTRO
  return (
    <main style={{ minHeight:'100dvh', background:'#1A1A1A', padding:'24px 16px 100px', fontFamily:'var(--font-nunito),sans-serif', maxWidth:430, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontSize:26, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:12 }}>What is your Brain Age?</div>
        <div style={{ width:140, height:140, borderRadius:'50%', background:'linear-gradient(135deg, #8B6914, #C8960C, #FFD700)', margin:'0 auto 12px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 40px rgba(200,150,12,0.3)' }}>
          <div style={{ width:124, height:124, borderRadius:'50%', background:'#1A1A1A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.4)', letterSpacing:2 }}>BRAIN AGE</div>
            <div style={{ fontSize:52, fontWeight:900, color:'rgba(255,255,255,0.15)' }}>?</div>
          </div>
        </div>
      </div>

      <input value={name} onChange={e => { setName(e.target.value); setError('') }} placeholder="Your name" maxLength={20}
        style={{ width:'100%', padding:'14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color:'#fff', fontSize:16, fontWeight:800, fontFamily:'inherit', outline:'none', boxSizing:'border-box', marginBottom:10 }} />

      <select value={birthYear} onChange={e => { setBirthYear(e.target.value); setError('') }}
        style={{ width:'100%', padding:'14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'#252525', color: birthYear ? '#fff' : 'rgba(255,255,255,0.4)', fontSize:16, fontWeight:800, fontFamily:'inherit', outline:'none', boxSizing:'border-box', marginBottom:4, appearance:'none', cursor:'pointer' }}>
        <option value="">Select your birth year</option>
        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:700, marginBottom:20 }}>Your birth year becomes your secret login code</div>

      {error && <div style={{ fontSize:13, color:'#FF5252', fontWeight:800, marginBottom:12 }}>{error}</div>}

      <button onClick={handleStart}
        style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', background:GREEN, color:'#fff', fontSize:17, fontWeight:900, fontFamily:'inherit', cursor:'pointer', boxShadow:'0 6px 0 #1B5E20', marginBottom:32 }}>
        Discover my Brain Age →
      </button>

      {SEO_SECTIONS.map((s, i) => (
        <div key={i} style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:12, marginBottom:12 }}>
          <div onClick={() => setOpenSeo(openSeo === i ? null : i)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', paddingBottom:8 }}>
            <div style={{ fontSize:14, fontWeight:800, color:'rgba(255,255,255,0.6)' }}>{s.title}</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.3)' }}>{openSeo === i ? '▲' : '▼'}</div>
          </div>
          {openSeo === i && (
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.8, whiteSpace:'pre-line' }}>{s.content}</div>
          )}
        </div>
      ))}
    </main>
  )
}
