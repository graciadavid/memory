import BrainTestClient from './BrainTestClient'

export const metadata = {
  title: 'Brain Age Test — How Old Is Your Brain? | MemGenius',
  description: 'Free online Brain Age Test. Play 5 cognitive games and discover your brain age in 4 minutes. Memory, reaction time, precision, geography and logic. No login required.',
  openGraph: {
    title: 'Brain Age Test — Discover How Old Your Brain Really Is',
    description: 'Free Brain Age Test. 5 games. 4 minutes. Discover your cognitive profile and share your result.',
    url: 'https://memgenius.com/brain-test',
  },
}

export default function BrainTestPage() {
  return <BrainTestClient />
}
