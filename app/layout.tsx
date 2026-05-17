import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MemGenius — Daily Brain Games',
  description: 'Train your brain and challenge your friends. Create a group, share it on WhatsApp and see who wins. 16 free brain games. No login required.',
  keywords: ['memory game', 'brain training', 'daily game', 'flag quiz', 'number memory', 'simon says'],
  openGraph: {
    title: 'MemGenius — Daily Brain Games',
    description: 'Train your brain and challenge your friends on WhatsApp. 16 free brain games with world rankings.',
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
    description: 'Train your brain and challenge your friends on WhatsApp. 16 free brain games with world rankings.',
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
import GAAnalytics from './analytics'
import { Nunito } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import ProtectPromptGlobal from '@/components/ProtectPromptGlobal'
import GameProfileGuard from '@/components/GameProfileGuard'

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
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9724686954428374" crossOrigin="anonymous"></script>
      <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
      <script dangerouslySetInnerHTML={{ __html: `window.OneSignalDeferred = window.OneSignalDeferred || []; window.OneSignalDeferred.push(async function(OneSignal) { await OneSignal.init({ appId: 'e0b94021-a1f5-466f-a5bb-4802608ea5d0' }); }); ` }} />
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
        <GAAnalytics />
        <VercelAnalytics />
        <GameProfileGuard>{children}</GameProfileGuard>
        <BottomNav />
        <div style={{ textAlign: 'center', padding: '8px 0 80px', fontSize: 11, color: '#4A2C0A40' }}>
          <a href='/privacy' style={{ color: '#4A2C0A40', textDecoration: 'none', marginRight: 16 }}>Privacy Policy</a>
          <a href='/terms' style={{ color: '#4A2C0A40', textDecoration: 'none' }}>Terms of Service</a>
        </div>
        <ProtectPromptGlobal />
        <GAAnalytics />
        <VercelAnalytics />
      </body>
    </html>
  )
}
