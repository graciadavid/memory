import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'MemGenius — Train your brain. Beat the world.',
  description: 'Free brain training games with world rankings. Memory, Agility, Knowledge and Logic. Sunday Brain Championship every week.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={nunito.variable} style={{ margin: 0, padding: 0, background: '#1A1A1A', fontFamily: 'var(--font-nunito), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
