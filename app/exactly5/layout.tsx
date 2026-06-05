import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'Exactly5 — Stop at 5 seconds',
  description: 'Can you stop a timer at exactly 5 seconds?',
}

export default function Exactly5Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={nunito.variable} style={{ fontFamily:'var(--font-nunito), sans-serif', background:'#0a0a0a', minHeight:'100dvh' }}>
      {children}
    </div>
  )
}
