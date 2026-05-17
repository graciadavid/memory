import DigitsClient from './DigitsClient'

export const metadata = {
  title: 'Digits — Memory Game | MemGenius',
  description: 'How many digits can you remember? Free online digit span memory game with world ranking. Train your short-term memory and working memory. No login required.',
}

export default function DigitsPage() {
  return (
    <>
      <DigitsClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>What does Digits train?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Digits trains short-term memory and working memory span — the ability to hold a sequence of numbers in your mind and recall them in order. This is one of the most fundamental cognitive abilities, used every time you remember a phone number, a PIN code, or a set of instructions.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>The average adult can hold 7 digits in short-term memory, give or take two. This capacity — known as the digit span — peaks in the mid-twenties and declines gradually with age. Regular practice can slow this decline and even reverse it in many cases.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>How to play</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>A sequence of digits appears on screen for 2.5 seconds. Memorize them. When they disappear, type them in the correct order using the numeric keypad. Each correct answer adds one digit to the next sequence. One mistake ends the game. Your score is the longest sequence you remembered correctly.</p>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12, marginTop: 24 }}>Why digit span matters</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Digit span is a component of the Wechsler Intelligence Scale, one of the most widely used intelligence tests in psychology. A strong digit span correlates with better performance in mathematics, reading comprehension and problem-solving. It is also one of the first abilities affected by cognitive decline, making it a valuable early indicator of brain health.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>Daily practice with Digits builds the neural circuits responsible for verbal working memory, improving your ability to follow complex instructions, retain information during conversations and perform mental arithmetic.</p>
      </div>
    </>
  )
}
