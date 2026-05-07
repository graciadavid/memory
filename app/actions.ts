'use server'
import { revalidatePath } from 'next/cache'

export async function revalidateRanking(game: 'memory' | 'digits' | 'sequence' | 'flags') {
  switch(game) {
    case 'memory': revalidatePath('/ranking/memory'); break
    case 'digits': revalidatePath('/digits/ranking'); break
    case 'sequence': revalidatePath('/sequence/ranking'); break
    case 'flags': revalidatePath('/flags/ranking'); break
  }
}
