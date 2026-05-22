import RelatedGames from '@/components/RelatedGames'
import MastermindClient from './MastermindClient'

export const metadata = {
  title: 'Mastermind — Crack the Color Code | MemGenius',
  description: 'Crack the hidden color code in 7 attempts. Free online Mastermind game with world ranking. Train your deductive reasoning and logical thinking. No login required.',
}

export default function MastermindPage() {
  return (
    <>
      <MastermindClient />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>Crack the hidden color code</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Mastermind is a classic deductive reasoning game. A secret sequence of 5 colors is hidden from you. You have 7 attempts to figure it out. After each guess, colored feedback tells you how close you are. Use logic to eliminate possibilities and converge on the correct answer before you run out of attempts.</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>Mastermind looks simple but rewards deep strategic thinking. The best players think several moves ahead, choosing guesses that maximize information gain regardless of the answer — the same mindset used in scientific reasoning, medical diagnosis and game theory.</p>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            How to play
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>A secret code of 5 colors is generated from a palette of 5 options. Select your guess by tapping colors and submit it. After each guess, colored borders give you feedback — green means the color is correct and in the right position, pink means the color is in the code but in the wrong position, no border means the color does not appear in the code at all.</p>
            <p style={{ marginBottom: 10 }}>Colors confirmed in the correct position are automatically carried forward to your next guess. You have 7 attempts to crack the full code. Your score is the number of attempts it took — fewer is better. Solving it in 3 or fewer attempts is exceptional.</p>
            <p>Save your score with a name and PIN to track your personal best and see your global ranking. The world leaderboard tracks the fastest solvers across all players worldwide.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            The history of Mastermind
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Mastermind was invented in 1970 by Mordecai Meirowitz, an Israeli telecommunications expert. He initially tried to sell the idea to established game companies but was rejected. Eventually Invicta Plastics of the United Kingdom licensed the game and launched it in 1971. It became an immediate success, selling 50 million sets in its first three years.</p>
            <p style={{ marginBottom: 10 }}>The game is a modern adaptation of an older pen-and-paper game called Bulls and Cows, which has been played since at least the 19th century. In Bulls and Cows, players guess a secret number rather than a color sequence — a bull means correct digit in correct position, a cow means correct digit in wrong position. The underlying logic is identical to Mastermind.</p>
            <p style={{ marginBottom: 10 }}>Mastermind attracted serious mathematical attention almost immediately after its publication. In 1977, Donald Knuth — one of the greatest computer scientists of all time and author of The Art of Computer Programming — published a paper proving that the classic six-color, four-position version can always be solved in five or fewer guesses using an optimal minimax strategy.</p>
            <p>The game has since become a standard benchmark in artificial intelligence and combinatorial optimization research. Algorithms for solving Mastermind optimally have been studied extensively, and the problem of finding the minimum number of guesses required to guarantee a solution is a well-known problem in information theory and game theory.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            The mathematics of Mastermind
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>The classic Mastermind with 6 colors and 4 positions has 1,296 possible codes. The MemGenius version uses 5 colors and 5 positions, creating 3,125 possible codes — a significantly larger solution space that makes the game more challenging and rewards more sophisticated strategies.</p>
            <p style={{ marginBottom: 10 }}>Knuth's optimal algorithm for the classic version works by always choosing the guess that minimizes the maximum number of remaining possibilities, regardless of what the answer turns out to be. This minimax strategy guarantees a solution in at most 5 guesses. Adapting this approach to 5 colors and 5 positions requires more computation but the same logical principle applies.</p>
            <p style={{ marginBottom: 10 }}>Information theory provides another lens for understanding optimal Mastermind play. Each guess should ideally provide the maximum possible information about the secret code. A guess that could result in many different feedback patterns is more informative than one that produces similar feedback regardless of the answer. The best first guess is one that splits the solution space as evenly as possible.</p>
            <p>The connection between Mastermind and real-world problem solving is direct. Medical diagnosis, fault isolation in engineering, debugging code and scientific hypothesis testing all use the same logical structure: propose a test, observe the result, update your model of what is true, and repeat until the answer is found. Mastermind trains this loop in its purest form.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Deductive reasoning and brain training
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Mastermind trains deductive reasoning — the ability to draw logical conclusions from incomplete information. This is a component of fluid intelligence, the capacity to solve novel problems without relying on prior knowledge. Fluid intelligence is one of the cognitive abilities most sensitive to aging but also most responsive to training.</p>
            <p style={{ marginBottom: 10 }}>Each Mastermind guess is a logical experiment. The feedback constrains the solution space in a way that must be tracked and integrated with previous feedback. This places demands on working memory, logical reasoning and systematic thinking simultaneously. Players who approach the game strategically rather than intuitively develop all three abilities through regular practice.</p>
            <p style={{ marginBottom: 10 }}>Regular practice with deductive reasoning tasks has been shown in multiple studies to improve performance on general problem-solving assessments. The transfer of training is strongest when the training task shares the logical structure of the target skill — and Mastermind's deductive structure is one of the most general and broadly applicable in any brain training game.</p>
            <p>The game also trains working memory indirectly. To play optimally, you must hold the results of all previous guesses in mind simultaneously and integrate them into a coherent model of the remaining possibilities. As you improve, this process becomes more automatic — freeing up cognitive resources for higher-level strategic thinking rather than basic bookkeeping.</p>
          </div>
        </details>

        <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Tips to improve your score
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Start your first guess by using as many different colors as possible. A first guess that uses 5 different colors immediately tells you which colors are in the code and which are not. This maximizes the information you receive from the very first feedback and gives you the strongest possible foundation for subsequent guesses.</p>
            <p style={{ marginBottom: 10 }}>Never guess a color that has been confirmed absent. Once feedback tells you a color is not in the code, eliminate it completely from all future guesses. This sounds obvious but under time pressure or cognitive load, players often reintroduce eliminated colors — a mistake that wastes an entire attempt.</p>
            <p style={{ marginBottom: 10 }}>Use pink feedback aggressively. A pink indicator tells you a color is in the code but in the wrong position. This gives you two pieces of information simultaneously: the color belongs in the code, and it does not belong in the position you placed it. Move confirmed colors to different positions in subsequent guesses to narrow down their correct location.</p>
            <p>Think about what each guess will tell you regardless of the feedback. The best guesses are ones that will give you useful information no matter what the response is. A guess that would only be informative if a specific unlikely answer comes back is a weak guess. Aim for guesses that split the remaining possibilities as evenly as possible across different feedback outcomes.</p>
          </div>
        </details>

        <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
          <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Mastermind vs Wordle and other guessing games
            <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
          </summary>
          <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
            <p style={{ marginBottom: 10 }}>Wordle, which became a global phenomenon in 2022, is essentially a word-based version of Mastermind. Both games use the same feedback mechanism — correct position, correct element in wrong position, element not present — applied to different domains. Wordle applies it to letters forming words, Mastermind applies it to colors in a sequence.</p>
            <p style={{ marginBottom: 10 }}>The key difference is that Wordle requires language knowledge — knowing which letter combinations form valid English words constrains your guesses and provides additional information beyond the color-coded feedback. Mastermind is purely logical — no prior knowledge helps you. Every player starts with the same information and the same tools. This makes Mastermind a purer test of deductive reasoning.</p>
            <p style={{ marginBottom: 10 }}>Compared to Sudoku, Mastermind involves more active hypothesis generation and less constraint propagation. Sudoku rewards patient, systematic elimination of possibilities using fixed logical rules. Mastermind rewards strategic information gathering — deciding which experiment to run next to maximize what you learn. Both train logical thinking but through different cognitive processes.</p>
            <p>Among the Logic games on MemGenius, Mastermind is the one most directly linked to scientific reasoning. The guess-feedback-update cycle is identical to the hypothetico-deductive method used in science: form a hypothesis, design an experiment, observe the result, update your theory. Playing Mastermind daily is one of the most direct ways to train the logical habits of a scientific mind.</p>
          </div>
        </details>

        <RelatedGames category="logic" current="Mastermind" />
      </div>
    </>
  )
}
