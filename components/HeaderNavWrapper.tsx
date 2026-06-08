'use client'
import { usePathname } from 'next/navigation'
import Header from './Header'
import BottomNav from './BottomNav'

export default function HeaderNavWrapper() {
 const pathname = usePathname()
 const isExactly5 = pathname?.startsWith('/exactly5')
 const isTop10Word = pathname?.startsWith('/top10word')
 if (isExactly5 || isTop10Word) return null
 return (
   <>
     <Header />
     <BottomNav />
   </>
 )
}
