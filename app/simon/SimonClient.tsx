import SimonClient from './SimonClient'
import RelatedGames from '@/components/RelatedGames'

export const metadata = {
 title: 'Simon Says — Color Sequence Memory Game | MemGenius',
 description: 'Watch and repeat the color sequence. Free online Simon Says game with world ranking. Train your sequential memory and attention. No login required.',
}

export default function SimonPage() {
 return (
   <>
     <SimonClient />
     <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 24px 80px', fontFamily: 'var(--font-nunito), sans-serif' }}>
       <h2 style={{ fontSize: 20, fontWeight: 900, color: '#4A2C0A', marginBottom: 12 }}>Watch the sequence. Repeat it perfectly.</h2>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 12 }}>Simon Says is a sequential memory game where colored buttons light up in a pattern and you must repeat it in the correct order. Each round adds one more color to the sequence. One mistake ends the game. Your score is the longest sequence you repeated correctly before your first error.</p>
       <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80', marginBottom: 24 }}>The average player reaches level 7 to 9. Reaching level 15 or beyond requires genuine sequential memory skill developed through consistent practice. The world leaderboard shows how far the best players have pushed their memory capacity.</p>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           How to play
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Four colored buttons — red, green, blue and yellow — are displayed on screen. The game lights them up in a sequence, one at a time. Watch carefully. When the sequence ends, repeat it by tapping the buttons in the exact same order. Get it right and a new color is added to the end of the sequence. Make one mistake and the game ends.</p>
           <p style={{ marginBottom: 10 }}>The sequence starts at length 1 and grows by one color each round. By level 10, you are memorizing and repeating a sequence of 10 colors in exact order. By level 15, you need to hold 15 items in your sequential memory — a genuinely impressive feat that requires deliberate memorization strategies rather than passive observation.</p>
           <p>Save your score with a name and PIN to track your personal best and see your global ranking. Results update in real time as players compete worldwide.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           The history of Simon
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>The original Simon electronic game was invented by Ralph Baer and Howard Morrison and launched by Milton Bradley in 1978. Baer, who is often called the father of video games for inventing the Magnavox Odyssey — the world's first home video game console — designed Simon as a standalone electronic memory toy with four large colored buttons and a distinctive circular shape.</p>
           <p style={{ marginBottom: 10 }}>Simon was an immediate commercial success, becoming one of the defining toys of the late 1970s and 1980s. It appeared on the cover of Time magazine and was featured in the film Close Encounters of the Third Kind, where a similar device is used to communicate with aliens — a scene that became one of the most iconic in science fiction cinema and dramatically boosted Simon's cultural prominence.</p>
           <p style={{ marginBottom: 10 }}>The game's name comes from the children's game Simon Says, in which a leader gives instructions that players must follow only when prefaced with the phrase "Simon says." The electronic version simplified this to a pure memory challenge — repeat what Simon does, or you are out. This elegantly simple concept has proven timeless, with Simon remaining in production and selling consistently for nearly five decades.</p>
           <p>Simon has been studied extensively in cognitive psychology research as a tool for measuring and training sequential working memory. Its standardized format — fixed colors, consistent timing, incrementally growing sequences — makes it ideal for controlled memory research. Versions of Simon-style tasks appear in numerous cognitive assessment batteries used in clinical and research settings worldwide.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           What Simon Says trains in your brain
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Simon Says trains sequential working memory — the ability to hold an ordered list of items in mind and reproduce them accurately. This is distinct from general working memory capacity, which measures how many items you can hold simultaneously. Sequential memory specifically requires you to maintain both the content and the order of each item, which places additional demands on the hippocampus and prefrontal cortex.</p>
           <p style={{ marginBottom: 10 }}>The game also trains sustained attention. As sequences grow longer, the temptation to let attention wander during the playback phase becomes harder to resist. Players who lose concentration even briefly during a long sequence will miss a color and fail. Developing the ability to sustain focused attention for the full duration of a long playback is one of the most valuable cognitive skills the game trains.</p>
           <p style={{ marginBottom: 10 }}>Visuospatial processing is another key component. The colors are associated with specific spatial positions on screen, and most players naturally encode both the color and the position of each button press. This dual encoding — color plus location — actually helps memory by providing two independent retrieval cues for each item in the sequence.</p>
           <p>Regular practice with sequential memory tasks has been shown to improve performance on a range of everyday memory tasks including following multi-step instructions, remembering spoken phone numbers and directions, and retaining the order of items in a list. These improvements are among the most practically useful of any cognitive training outcome.</p>
         </div>
       </details>

       <details style={{ marginBottom: 12, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Tips to improve your score
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Use chunking to extend your memory capacity. Instead of remembering individual colors one by one, group them into patterns of two or three. A sequence of red-blue-red-green-blue becomes "red-blue-red" plus "green-blue" — two chunks instead of five individual items. Chunking is the most powerful memory technique for sequential tasks and is used by memory champions worldwide.</p>
           <p style={{ marginBottom: 10 }}>Create a verbal narrative while watching the sequence. Say the color names quietly to yourself as they light up — "red, green, blue, red, yellow." This verbal rehearsal engages your phonological loop, a component of working memory specifically designed for holding sequences of verbal information. Most people find verbal rehearsal significantly extends how many colors they can remember.</p>
           <p style={{ marginBottom: 10 }}>Focus especially on the new color added at the end of each round. You already know the previous sequence — the only new information is the final color. Many players make mistakes on the last color because they relax their attention once they feel confident about the earlier part. Stay alert until the very end of every sequence.</p>
           <p>Repeat the sequence to yourself during the input phase as you tap. Saying "red" as you tap red, "green" as you tap green, gives you real-time feedback that helps catch errors before they become wrong taps. This active rehearsal during recall is one of the most effective techniques for reducing error rates in sequential memory tasks.</p>
         </div>
       </details>

       <details style={{ marginBottom: 24, background: '#fff', borderRadius: 14, border: '1px solid #4A2C0A10', overflow: 'hidden' }}>
         <summary style={{ padding: '16px', fontSize: 15, fontWeight: 900, color: '#4A2C0A', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           Simon Says vs other memory games
           <span style={{ fontSize: 12, color: '#4A2C0A40' }}>▼</span>
         </summary>
         <div style={{ padding: '0 16px 16px', fontSize: 14, lineHeight: 1.8, color: '#4A2C0A80' }}>
           <p style={{ marginBottom: 10 }}>Among the Memory games on MemGenius, Simon Says is the most focused on sequential order. Digits trains you to remember a sequence of numbers in order, which is very similar — both require ordered sequential recall. The key difference is that Simon Says uses colors and spatial positions rather than numbers, engaging visuospatial memory rather than verbal memory. Players who excel at one often excel at the other but the skills are distinct enough that training both provides broader memory benefits.</p>
           <p style={{ marginBottom: 10 }}>N-Back trains a different aspect of working memory — the ability to compare a current item with one presented several steps earlier. This requires continuous updating of a memory buffer rather than sequential recall of a fixed list. N-Back is generally considered more cognitively demanding per item than Simon Says, but Simon Says challenges absolute sequence length in a way that N-Back does not.</p>
           <p>Compared to the Memory card matching game, Simon Says is significantly more demanding of active memorization. Card matching allows you to build knowledge passively across multiple attempts. Simon Says provides no such second chances — every item in every sequence must be memorized correctly on a single pass. This makes Simon Says a purer and more demanding test of genuine working memory capacity.</p>
         </div>
       </details>

       <RelatedGames category="memory" current="Simon Says" />
     </div>
   </>
 )
}
