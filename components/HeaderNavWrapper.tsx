'use client'
import { usePathname } from 'next/navigation'
import Header from './Header'
import BottomNav from './BottomNav'

export default function HeaderNavWrapper() {
  const pathname = usePathname()
  if (pathname?.startsWith('/exactly5') || pathname?.startsWith('/top10word')) return null
  return (
    <>
      <Header />
      <BottomNav />
    </>
  )
}
