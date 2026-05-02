import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'PairIQ — Association Memory Game',
  description: 'Match pairs and test your knowledge. World rankings, daily challenges.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-nunito bg-[#0c0c14] text-white`}>
        {children}
      </body>
    </html>
  )
}
