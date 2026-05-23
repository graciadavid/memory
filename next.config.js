/** @type {import('next').NextConfig} */
const nextConfig = {
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
