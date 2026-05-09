import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://memgenius.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://memgenius.com/memory', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://memgenius.com/digits', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://memgenius.com/sequence', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://memgenius.com/flags', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://memgenius.com/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: 'https://memgenius.com/higherlower', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://memgenius.com/precision', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://memgenius.com/how-to-play', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://memgenius.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://memgenius.com/terms', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://memgenius.com/privacy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]
}
