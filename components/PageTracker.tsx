'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    supabase.from('page_views').insert({ pathname })
  }, [pathname])

  return null
}
