import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'MemGenius — Train your brain. Beat the world.',
  description: 'Free brain training games with world rankings. Memory, Agility, Knowledge and Logic. Sunday Brain Championship every week.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={nunito.variable} style={{ margin: 0, padding: 0, background: '#1A1A1A' }}>
        <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', position: 'relative' }}>
          <Header />
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
