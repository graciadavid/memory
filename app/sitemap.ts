import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
 const base = 'https://memgenius.com'
 const now = new Date()

 const pages = [
   { url: '/', priority: 1.0, changeFreq: 'daily' },
   { url: '/training', priority: 0.9, changeFreq: 'weekly' },
   { url: '/championship', priority: 0.9, changeFreq: 'daily' },
   { url: '/profile', priority: 0.8, changeFreq: 'weekly' },
   { url: '/rankings', priority: 0.8, changeFreq: 'daily' },
   { url: '/more', priority: 0.6, changeFreq: 'monthly' },
   // Memory
   { url: '/memory-hub', priority: 0.8, changeFreq: 'weekly' },
   { url: '/memory', priority: 0.7, changeFreq: 'weekly' },
   { url: '/digits', priority: 0.7, changeFreq: 'weekly' },
   { url: '/simon-says', priority: 0.7, changeFreq: 'weekly' },
   { url: '/nback', priority: 0.7, changeFreq: 'weekly' },
   { url: '/blink', priority: 0.7, changeFreq: 'weekly' },
   { url: '/poke', priority: 0.7, changeFreq: 'weekly' },
   // Agility
   { url: '/agility', priority: 0.8, changeFreq: 'weekly' },
   { url: '/stop', priority: 0.7, changeFreq: 'weekly' },
   { url: '/f1', priority: 0.7, changeFreq: 'weekly' },
   { url: '/pendulum', priority: 0.7, changeFreq: 'weekly' },
   { url: '/ace', priority: 0.7, changeFreq: 'weekly' },
   { url: '/letter-rain', priority: 0.7, changeFreq: 'weekly' },
   { url: '/typedrop', priority: 0.7, changeFreq: 'weekly' },
   // Knowledge
   { url: '/knowledge', priority: 0.8, changeFreq: 'weekly' },
   { url: '/flags', priority: 0.7, changeFreq: 'weekly' },
   { url: '/capitals', priority: 0.7, changeFreq: 'weekly' },
   { url: '/countries', priority: 0.7, changeFreq: 'weekly' },
   { url: '/higherorlower/population', priority: 0.7, changeFreq: 'weekly' },
   { url: '/higherorlower/area', priority: 0.7, changeFreq: 'weekly' },
   // Logic
   { url: '/logic', priority: 0.8, changeFreq: 'weekly' },
   { url: '/sudoku', priority: 0.7, changeFreq: 'weekly' },
   { url: '/mastermind', priority: 0.7, changeFreq: 'weekly' },
   { url: '/wordly', priority: 0.7, changeFreq: 'weekly' },
   { url: '/2048', priority: 0.7, changeFreq: 'weekly' },
   { url: '/blackjack', priority: 0.7, changeFreq: 'weekly' },
   // SEO
   { url: '/reaction-time-test', priority: 0.8, changeFreq: 'monthly' },
   { url: '/memory-test', priority: 0.8, changeFreq: 'monthly' },
   { url: '/flag-quiz', priority: 0.8, changeFreq: 'monthly' },
   { url: '/world-capitals-quiz', priority: 0.8, changeFreq: 'monthly' },
 ]

 return pages.map(p => ({
   url: base + p.url,
   lastModified: now,
   changeFrequency: p.changeFreq as any,
   priority: p.priority,
 }))
}
