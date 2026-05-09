import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const THRESHOLD = 5

export function useProtectPrompt(playerName: string | undefined) {
  const [show, setShow] = useState(false)

  const increment = async () => {
    if (!playerName) return

    // Check if user already has password
    const { data } = await supabase
      .from('profiles')
      .select('password_hash')
      .eq('player_name', playerName)
      .maybeSingle()

    if (data?.password_hash) return // already protected

    const key = `protect_count_${playerName}`
    const current = parseInt(sessionStorage.getItem(key) || '0') + 1
    sessionStorage.setItem(key, String(current))
    console.log('Protect count:', current, 'threshold:', THRESHOLD)

    if (current % THRESHOLD === 0) {
      console.log('Showing protect prompt!')
      setShow(true)
    }
  }

  const dismiss = () => {
    setShow(false)
    // Reset counter so next 5 games triggers again
    if (playerName) {
      sessionStorage.setItem(`protect_count_${playerName}`, '0')
    }
  }

  return { show, increment, dismiss }
}
