import { supabase } from '@/lib/supabase'
import GameBoard from '@/components/GameBoard'

export default async function PlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const today = new Date().toISOString().split('T')[0]

  const { data: pack, error } = await supabase
    .from('packs')
    .select('*, pairs(*)')
    .eq('slug', slug)
    .single()

  if (error) return <div style={{ color: '#111', padding: 20 }}>Error: {error.message}</div>
  if (!pack) return <div style={{ color: '#111', padding: 20 }}>Pack not found</div>

  // Check if this is today's daily
  const { data: daily } = await supabase
    .from('daily_challenges')
    .select('pack_slug')
    .eq('date', today)
    .single()

  const isDaily = daily?.pack_slug === slug
  console.log('SERVER: slug:', slug, 'daily slug:', daily?.pack_slug, 'isDaily:', isDaily)

  const seoContent: Record<string, { title: string; desc1: string; desc2: string; faqs: { q: string; a: string }[] }> = {
    'memgenius-colors': {
      title: 'Colors Memory — Match Colors and Names',
      desc1: 'Test your color recognition by matching color names to their visual representation. Simple to start, surprisingly tricky as the board grows.',
      desc2: 'Color association is one of the earliest cognitive skills we develop. This pack reinforces visual-semantic links — connecting what we see with what we know.',
      faqs: [
        { q: 'What does this pack train?', a: 'Visual recognition and color-name association — a fundamental cognitive link between perception and language.' },
        { q: 'Is it good for beginners?', a: 'Yes, Colors is one of the most accessible packs and a great starting point for new players.' },
        { q: 'How many pairs are there?', a: 'The number of pairs depends on the difficulty level you selected — Easy, Medium, or Hard.' },
      ]
    },
    'monuments-countries': {
      title: 'Monuments & Countries — Match Landmarks to Nations',
      desc1: 'Can you match the Colosseum to Italy, Machu Picchu to Peru, or Angkor Wat to Cambodia? This pack pairs the world’s most iconic monuments with their home countries.',
      desc2: 'Monuments are among the most powerful memory anchors in geography. Learning which landmark belongs to which country builds a vivid mental map of the world — far more effective than memorizing facts alone.',
      faqs: [
        { q: 'Which monuments are included?', a: 'The pack covers iconic landmarks from all continents — from the Eiffel Tower to the Taj Mahal, Petra, the Colosseum, and many more.' },
        { q: 'Is this good for geography learning?', a: 'Yes. Visual landmark association is one of the most effective ways to remember countries and their cultures.' },
        { q: 'Can children play this pack?', a: 'Absolutely. Monuments and Countries is educational and suitable for all ages.' },
      ]
    },
    'cities-skylines': {
      title: 'Cities & Skylines — Recognize the World’s Great Cities',
      desc1: 'Match famous city skylines to their names. From the Manhattan skyline to the Dubai marina, test how well you know the world’s most recognizable urban landscapes.',
      desc2: 'City skylines are among the most visually distinctive images in geography. This pack trains visual memory and global awareness simultaneously — every correct match is a new city locked into your memory.',
      faqs: [
        { q: 'Which cities are in this pack?', a: 'The pack includes major global cities across all continents, from New York and London to Tokyo, Sydney, and beyond.' },
        { q: 'Is this harder than Monuments?', a: 'It can be. Skylines require recognizing architectural silhouettes rather than iconic single structures, which is a different visual challenge.' },
        { q: 'What does it train cognitively?', a: 'Visual pattern recognition and geographic memory — your brain learns to identify complex urban landscapes as unified visual signatures.' },
      ]
    },
    'skyscrapers-cities': {
      title: 'Skyscrapers & Cities — Match the World’s Tallest Buildings',
      desc1: 'Do you know which city the Burj Khalifa is in? What about the Shanghai Tower or the One World Trade Center? Match the world’s most famous skyscrapers to their cities.',
      desc2: 'Skyscrapers are symbols of ambition and identity. This pack combines architecture, geography, and visual memory into one challenging game. Every match teaches you something real about the world’s great cities.',
      faqs: [
        { q: 'Which skyscrapers are included?', a: 'The pack covers the world’s most iconic tall buildings — Burj Khalifa, Taipei 101, Empire State Building, CN Tower, and many more.' },
        { q: 'Do I need to know architecture to play?', a: 'Not at all. The game teaches you as you play — each match reinforces the connection between building and city.' },
        { q: 'Is this pack harder than Cities Skylines?', a: 'Different rather than harder. You match individual buildings to cities rather than full skylines to city names.' },
      ]
    },
    'phenomena-locations': {
      title: 'Natural Phenomena & Locations — Where on Earth?',
      desc1: 'Match extraordinary natural phenomena to the places where they occur. Aurora Borealis to Norway, the Great Barrier Reef to Australia, the Northern Lights to Iceland.',
      desc2: 'Natural phenomena are some of the most awe-inspiring facts about our planet. This pack teaches earth science and geography together — where these wonders happen and why they are unique to those locations.',
      faqs: [
        { q: 'What kind of phenomena are included?', a: 'The pack covers geological, meteorological, and biological phenomena — from volcanic activity and northern lights to natural wonders and unique ecosystems.' },
        { q: 'Is this educational?', a: 'Highly. Each match connects a natural event to its geographic location, building real earth science knowledge.' },
        { q: 'What age is this suitable for?', a: 'Suitable for all ages, though older children and adults will find it particularly rewarding.' },
      ]
    },
    'civilizations-landmarks': {
      title: 'Civilizations & Landmarks — Ancient History Memory Game',
      desc1: 'Match ancient civilizations to their most iconic landmarks. The Pyramids to Egypt, the Parthenon to Greece, Stonehenge to England. How well do you know the ancient world?',
      desc2: 'Ancient civilizations built structures that have survived thousands of years. This pack connects history and architecture in a way that makes both more memorable — see a landmark, think of a civilization, forever.',
      faqs: [
        { q: 'Which civilizations are covered?', a: 'Egyptian, Greek, Roman, Mayan, Incan, Chinese, Mesopotamian, and more — the major ancient civilizations and their defining monuments.' },
        { q: 'Is this good for students?', a: 'Excellent for history students. The associative format makes historical facts stick far better than reading alone.' },
        { q: 'How difficult is this pack?', a: 'Moderate to hard — some connections are well known, others will surprise even history enthusiasts.' },
      ]
    },
    'inventions-inventors': {
      title: 'Inventions & Inventors — Who Invented What?',
      desc1: 'Match history’s greatest inventions to the people who created them. Did you know the telephone was invented by Alexander Graham Bell? What about the light bulb, the printing press, or penicillin?',
      desc2: 'Behind every invention is a human story. This pack makes history personal by connecting breakthrough technologies to the brilliant minds behind them — a perfect blend of science and human achievement.',
      faqs: [
        { q: 'Which inventions are included?', a: 'The pack covers major inventions across centuries — from ancient tools to modern technology, spanning science, medicine, communication, and engineering.' },
        { q: 'Is this good for general knowledge?', a: 'Excellent. Knowing who invented what is classic general knowledge tested in quizzes worldwide.' },
        { q: 'What does this pack train?', a: 'Associative memory linking people to achievements — a particularly powerful form of semantic memory.' },
      ]
    },
    'instruments-genres': {
      title: 'Instruments & Music Genres — Music Memory Game',
      desc1: 'Match musical instruments to the genres they define. A saxophone to jazz, a sitar to classical Indian music, an accordion to tango. How deep does your musical knowledge go?',
      desc2: 'Music is one of the most universal human experiences. This pack connects the tools of music to the styles they created — building cultural knowledge and auditory-visual associations that are surprisingly hard to forget.',
      faqs: [
        { q: 'Which instruments are in the pack?', a: 'The pack covers instruments from across the world and musical traditions — from orchestral and rock to folk, jazz, and world music.' },
        { q: 'Do I need musical training to play?', a: 'No. Many connections are intuitive and the game teaches you the less obvious ones as you play.' },
        { q: 'Is this suitable for music students?', a: 'Yes, it is a fun way to reinforce music theory and cultural knowledge alongside formal study.' },
      ]
    },
    'foods-monuments': {
      title: 'Foods & Origins — Match Dishes to Their Countries',
      desc1: 'Match iconic foods to the countries they come from. Sushi to Japan, pizza to Italy, tacos to Mexico. Sounds easy — until you get to the less obvious ones.',
      desc2: 'Food is culture. Every dish tells the story of the people and place that created it. This pack turns culinary geography into a memory game — and makes you hungry in the process.',
      faqs: [
        { q: 'Which foods are included?', a: 'The pack covers iconic dishes from across the world — from well-known classics to some surprising regional specialties.' },
        { q: 'Is this suitable for foodies?', a: 'Perfect for food lovers. It combines culinary knowledge with geography in a way that is both fun and educational.' },
        { q: 'Can children play this?', a: 'Yes, food and countries is one of the most accessible and enjoyable packs for all ages.' },
      ]
    },
    'animals-habitats': {
      title: 'Animals & Habitats — Match Wildlife to Their Ecosystems',
      desc1: 'Match animals to the natural habitats where they live. A polar bear to the Arctic, a jaguar to the Amazon rainforest, a camel to the Sahara desert. How well do you know the natural world?',
      desc2: 'Understanding where animals live is the foundation of ecology and conservation. This pack teaches environmental science through play — every match builds awareness of the planet’s incredible biodiversity.',
      faqs: [
        { q: 'Which animals are featured?', a: 'The pack includes mammals, birds, reptiles, and marine animals from ecosystems across all continents and oceans.' },
        { q: 'Is this educational for children?', a: 'Highly. Animals and Habitats is one of the most educational packs on MemGenius and perfect for school-age children.' },
        { q: 'What does it teach cognitively?', a: 'Categorical reasoning and ecological memory — grouping living things by environment, a key skill in natural sciences.' },
      ]
    },
    'objects-uses': {
      title: 'Objects & Uses — Everyday Association Memory Game',
      desc1: 'Match everyday objects to what they are used for. This pack is about the world around you — the tools, items, and objects you interact with daily, and the purposes they serve.',
      desc2: 'Semantic memory — knowing what things are for — is one of the most fundamental cognitive systems. This pack trains functional associations in a playful, accessible way suitable for all ages and abilities.',
      faqs: [
        { q: 'What kind of objects are in the pack?', a: 'Everyday household and common objects — tools, kitchen items, office supplies, and more — matched to their primary uses.' },
        { q: 'Is this good for younger players?', a: 'Yes, Objects and Uses is one of the most accessible packs and ideal for children learning about the world around them.' },
        { q: 'What cognitive skill does this train?', a: 'Functional semantic memory — the ability to associate objects with their purpose, which underpins practical intelligence.' },
      ]
    },
  }

  const seo = seoContent[slug]

  return (
    <GameBoard pack={{ ...pack, isDaily }} />
      {seo && (
        <section style={{
          maxWidth: 430, margin: '0 auto',
          padding: '48px 24px 120px',
          fontFamily: 'system-ui, sans-serif',
          background: '#FAF7F2',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>
            {seo.title}
          </h2>
          <p style={{ fontSize: 14, color: '#4A2C0A99', lineHeight: 1.8, marginBottom: 16 }}>
            {seo.desc1}
          </p>
          <p style={{ fontSize: 14, color: '#4A2C0A99', lineHeight: 1.8, marginBottom: 32 }}>
            {seo.desc2}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {seo.faqs.map((item, i) => (
              <details key={i} style={{
                background: '#fff', borderRadius: 14,
                border: '1px solid #4A2C0A15',
                padding: '14px 18px',
              }}>
                <summary style={{
                  fontSize: 14, fontWeight: 800, color: '#4A2C0A',
                  cursor: 'pointer', listStyle: 'none',
                }}>
                  {item.q}
                </summary>
                <p style={{ fontSize: 13, color: '#4A2C0A80', lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}
  )
}
