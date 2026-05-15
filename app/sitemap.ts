import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Home
    { url: 'https://memgenius.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },

    // Memory
    { url: 'https://memgenius.com/memory', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://memgenius.com/digits', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/sequence', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

    // Agility
    { url: 'https://memgenius.com/precision/stopwatch', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://memgenius.com/precision/formula1', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://memgenius.com/precision/pendulum', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },

    // Knowledge
    { url: 'https://memgenius.com/flags', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/versus/population', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://memgenius.com/versus/area', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://memgenius.com/ace', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/geoshape', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

    // Logic
    { url: 'https://memgenius.com/sudoku', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/wordly', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://memgenius.com/mastermind', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://memgenius.com/2048', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

    // Rankings
    { url: 'https://memgenius.com/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: 'https://memgenius.com/ranking/memory', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/digits/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/flags/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/sequence/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/precision/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/versus/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/geoshape/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/ace/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/sudoku/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/wordly/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/mastermind/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/2048/ranking', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://memgenius.com/ranking/hall-of-fame', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },

    // Memory packs
    { url: 'https://memgenius.com/play/memgenius-colors', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/monuments-countries', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/cities-skylines', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/skyscrapers-cities', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/phenomena-locations', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/civilizations-landmarks', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/inventions-inventors', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/instruments-genres', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/foods-monuments', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/animals-habitats', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/play/objects-uses', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // Social
    { url: 'https://memgenius.com/groups', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: 'https://memgenius.com/streak', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // Blog
    { url: 'https://memgenius.com/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://memgenius.com/blog/brain-training-games-for-classrooms', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/blog/how-to-train-your-brain-daily', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/blog/simon-says-game-online', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/blog/higher-or-lower-game', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://memgenius.com/blog/sudoku-game-online', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // Info
    { url: 'https://memgenius.com/teachers', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://memgenius.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://memgenius.com/terms', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://memgenius.com/privacy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]
}
