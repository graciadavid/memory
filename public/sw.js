const CACHE = 'memgenius-v1'
const ASSETS = [
  '/',
  '/memory',
  '/digits',
  '/sequence',
  '/flags',
  '/icons/logomemgenius.webp',
  '/icons/memory.webp',
  '/icons/digits.webp',
  '/icons/sequence.webp',
  '/icons/flags.webp',
]

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  )
})
