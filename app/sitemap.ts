import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Home
    { url: 'https://memgenius.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },

    // Category hubs
    { url: 'https://memgenius.com/memory-hub', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://memgenius.com/agility', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://memgenius.com/knowledge', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://memgenius.com/logic', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },

    // Memory games
    { url: 'https://memgenius.com/memory', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://memgenius.com/digits', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/sequence', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/nback', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/blink', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

    // Agility games
    { url: 'https://memgenius.com/stop', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/f1', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/pendulum', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/ace', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/letter-rain', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

    // Knowledge games
    { url: 'https://memgenius.com/flags', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/higherorlower/population', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://memgenius.com/higherorlower/area', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://memgenius.com/countries', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/capitals', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

    // Logic games
    { url: 'https://memgenius.com/sudoku', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/mastermind', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/2048', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/wordly', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://memgenius.com/blackjack', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

    // Rankings
    { url: 'https://memgenius.com/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: 'https://memgenius.com/ranking/memory', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/digits/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/flags/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/sequence/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/nback/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/ace/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/sudoku/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/wordly/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/mastermind/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/2048/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },

    // Profile & streak
    { url: 'https://memgenius.com/profile', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://memgenius.com/streak', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // Memory packs
    { url: 'https://memgenius.com/play/monuments-countries', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/cities-skylines', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/inventions-inventors', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/instruments-genres', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/animals-habitats', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // Info
    { url: 'https://memgenius.com/teachers', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://memgenius.com/how-to-play', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://memgenius.com/terms', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://memgenius.com/privacy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },

    // Blog
    { url: 'https://memgenius.com/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://memgenius.com/blog/brain-training-games-for-classrooms', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/blog/how-to-train-your-brain-daily', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/blog/simon-says-game-online', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/blog/higher-or-lower-game', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/blog/sudoku-game-online', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
