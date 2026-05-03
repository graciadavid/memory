import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/BottomNav'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'MemGenius — Association Memory Game',
  description: 'Match pairs and test your knowledge. World rankings, daily challenges.',
  metadataBase: new URL('https://memgenius.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-nunito`} style={{ background: '#f2f2f2', margin: 0 }}>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
