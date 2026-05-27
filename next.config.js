/** @type {import('next').NextConfig} */
const nextConfig = {
 async redirects() {
   return [
     { source: '/geoshape', destination: '/countries', permanent: true },
     { source: '/geoshape/ranking', destination: '/countries', permanent: true },
     { source: '/versus', destination: '/higherorlower/population', permanent: true },
     { source: '/versus/population', destination: '/higherorlower/population', permanent: true },
     { source: '/versus/area', destination: '/higherorlower/area', permanent: true },
     { source: '/versus/ranking', destination: '/higherorlower/population', permanent: true },
     { source: '/precision/formula1', destination: '/f1', permanent: true },
     { source: '/precision/formula1/ranking', destination: '/f1', permanent: true },
     { source: '/precision/pendulum', destination: '/pendulum', permanent: true },
     { source: '/precision/ranking', destination: '/stop', permanent: true },
     { source: '/precision/stopwatch', destination: '/stop', permanent: true },
     { source: '/precision/stopwatch/ranking', destination: '/stop', permanent: true },
     { source: '/precision/stopwatch/rules', destination: '/stop', permanent: true },
     { source: '/precision', destination: '/stop', permanent: true },
     { source: '/sequence', destination: '/simon', permanent: true },
     { source: '/sequence/ranking', destination: '/simon', permanent: true },
   ]
 },
 async headers() {
   return [
     {
       source: '/_next/static/:path*',
       headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
     },
     {
       source: '/((?!_next/static).*)',
       headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
     },
   ]
 },
 images: {
   remotePatterns: [
     { protocol: 'https', hostname: 'bgmhfsccchktnknmqkuw.supabase.co' },
     { protocol: 'https', hostname: 'flagcdn.com' },
   ],
 },
}

module.exports = nextConfig
