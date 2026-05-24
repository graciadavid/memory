'use client'
import { usePathname } from 'next/navigation'

export default function GameProfileGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
