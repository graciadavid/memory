import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MemGenius — Daily Brain Games',
  description: 'Train your brain with Memory, Digits, Sequence and Flags. Free daily brain games with world rankings. No login required.',
  keywords: ['memory game', 'brain training', 'daily game', 'flag quiz', 'number memory', 'simon says'],
  openGraph: {
    title: 'MemGenius — Daily Brain Games',
    description: 'Train your brain with Memory, Digits, Sequence and Flags.',
    url: 'https://memgenius.com',
    siteName: 'MemGenius',
    images: [
      {
        url: '/icons/logomemgenius.webp',
        width: 1200,
        height: 630,
        alt: 'MemGenius',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemGenius — Daily Brain Games',
    description: 'Train your brain with Memory, Digits, Sequence and Flags.',
    images: ['/icons/logomemgenius.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://memgenius.com',
  },
}
import Analytics from './analytics'
import { Nunito } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/BottomNav'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-nunito',
})


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <link rel="preconnect" href="https://bgmhfsccchktnknmqkuw.supabase.co" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="MemGenius" />
      <link rel="apple-touch-icon" href="/icons/pwa-192.png" />
      <meta name="theme-color" content="#4A2C0A" />
      <script dangerouslySetInnerHTML={{ __html: `
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
          })
        }
      `}} />
      <link rel="preconnect" href="https://flagcdn.com" />
      <body className={`${nunito.variable} font-nunito`} style={{ background: '#f2f2f2', margin: 0 }}>
        <Analytics />
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
