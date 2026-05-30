'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { usePlayer } from '@/lib/usePlayer'

const GREEN = '#2E7D32'
const GOLD = '#C8960C'

const KEYBOARD = [
 ['Q','W','E','R','T','Y','U','I','O','P'],
 ['A','S','D','F','G','H','J','K','L'],
 ['⌫','Z','X','C','V','B','N','M','↵'],
]

const WORDS_BY_LEVEL = [
  ['CAT','DOG','SUN','RUN','FLY','SKY','BOX','TOP','MAP','CUP','ARM','EAR','EGG','FAN','GUM','HAT','ICE','JAM','KEY','LAW','MIX','NET','OAK','PAN','RAG','SAP','TAR','URN','VAN','WAX'],
  ['FIRE','JUMP','LOVE','FAST','STAR','BLUE','RAIN','DARK','COOL','BIRD','BOLD','BURN','CALM','DARE','EARN','FACE','GAME','HAND','IRIS','JEST','KEEN','LAMP','MIND','NOON','OPEN','PIPE','QUIT','RICE','SAFE','TAIL'],
  ['BRAIN','SPEED','LIGHT','CLOUD','TIGER','FLASH','STONE','RIVER','NIGHT','SMILE','ANGLE','BRAVE','CHESS','DRIVE','EAGLE','FLAME','GRACE','HEART','IMAGE','JUDGE','KNIFE','LAYER','MUSIC','NERVE','ORBIT','PLACE','QUIET','RIDER','SLOPE','TRACE'],
  ['ROCKET','PLANET','BRIDGE','SILVER','DRAGON','WINTER','SPRING','CASTLE','GARDEN','MONKEY','ANCHOR','BETTER','CIRCLE','DANGER','ESCAPE','FLOWER','GLOBAL','HUNTER','INSECT','JUNGLE','KITTEN','LOCKET','MIRROR','NATURE','OFFICE','PALACE','QUARTZ','RIDDLE','STREAM','TRAVEL'],
  ['DIAMOND','THUNDER','RAINBOW','DOLPHIN','HORIZON','CRYSTAL','VOLCANO','WARRIOR','PHANTOM','ECLIPSE','BALANCE','CAPTAIN','DEFENSE','ELEGANT','FANTASY','GLACIER','HISTORY','IMAGINE','JOURNEY','KINGDOM','LANTERN','MYSTERY','NETWORK','OPINION','PATTERN','QUANTUM','RETREAT','SILENCE','TRIUMPH','UNIVERSE'],
]

function getWord(score: number) {
 const tier = Math.min(Math.floor(score / 5), 4)
 const pool = WORDS_BY_LEVEL[tier]
 return pool[Math.floor(Math.random() * pool.length)]
}

function getDuration(score: number) {
 return Math.max(2000, 8000 - score * 150)
}

type Phase = 'idle' | 'playing' | 'over'

export default function TypeDropClient() {
 const { profile } = usePlayer()
 const [phase, setPhase] = useState<Phase>('idle')
 const [score, setScore] = useState(0)
 const [word, setWord] = useState('')
 const [typed, setTyped] = useState('')
 const [posY, setPosY] = useState(0)
 const [saved, setSaved] = useState(false)
  const [worldRank, setWorldRank] = useState<number|null>(null)
 const [top5, setTop5] = useState<any[]>([])
 const [worldRecord, setWorldRecord] = useState<any>(null)
 const animRef = useRef<any>(null)
 const startRef = useRef<number>(0)
 const scoreRef = useRef(0)
 const wordRef = useRef('')
 const typedRef = useRef('')
 const durationRef = useRef(8000)
