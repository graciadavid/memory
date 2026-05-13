import Link from "next/link"
const BROWN = "#4A2C0A"
const GOLD = "#C8960C"
const CREAM = "#FAF7F2"
const GREEN = "#2E7D32"
const BASE = "https://bgmhfsccchktnknmqkuw.supabase.co/storage/v1/object/public/storage"
export const metadata = {
  title: "Best Free Brain Training Games for Classrooms | MemGenius",
  description: "Free brain training games for classrooms. Memory, geography, reaction time and logic, mobile-first, no login required.",
}
export default function BlogPost() {
  return (
    <main style={{ minHeight: "100dvh", background: CREAM, fontFamily: "var(--font-nunito), sans-serif", color: BROWN }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        <Link href="/blog" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#4A2C0A50", marginBottom: 24 }}>Back to Blog</div>
        </Link>
        <div style={{ fontSize: 11, fontWeight: 800, color: GREEN, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Education - May 2026</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 16px", lineHeight: 1.15 }}>Best Free Brain Training Games for Classrooms</h1>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 24 }}>Getting students to focus is harder than ever. But there is one thing that still works: competition. The moment students can see a live ranking with their name on it, everything changes.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 24 }}>MemGenius is a free brain training platform with 9 games designed to train memory, reaction time, geography and logical thinking. Teachers can create a private group so students compete in real time from their phones with no login or app download required.</p>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: "32px 0 12px" }}>Why brain training games work in class</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 16 }}>Research in cognitive neuroscience shows that working memory training improves academic performance. Students who play voluntarily improve faster than those doing structured exercises. Games with rankings and streaks keep students coming back daily.</p>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: "32px 0 12px" }}>The games and what they train</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 12 }}><strong>Memory</strong> - Match pairs by meaning. Trains associative memory for any subject.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 12 }}><strong>Digits</strong> - Memorize growing number sequences. Builds numerical focus and working memory.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 12 }}><strong>Simon Says</strong> - Repeat color patterns. Trains visual-sequential memory.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 12 }}><strong>Flags</strong> - Identify world flags. Students learn 195 countries without realizing it.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 12 }}><strong>Precision</strong> - Stop, F1 Reaction, Pendulum. Measures reaction speed and temporal perception.</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 24 }}><strong>Higher or Lower</strong> - Compare countries by population or area. Real geography through competitive gameplay.</p>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: "32px 0 12px" }}>How to set up a class in 60 seconds</h2>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 8 }}>1. Create a free profile at memgenius.com</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 8 }}>2. Create a group with your class name</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 8 }}>3. Share the link with students via WhatsApp or projector</p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: "#4A2C0A80", marginBottom: 24 }}>4. Students join instantly and the live ranking appears immediately</p>
        <div style={{ background: "#E8F5E9", borderRadius: 20, padding: 24, textAlign: "center", marginTop: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 8px" }}>Ready to try it with your class?</h3>
          <p style={{ fontSize: 14, color: "#4A2C0A70", margin: "0 0 16px" }}>Free, mobile-first, no setup required.</p>
          <Link href="/teachers" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-block", background: "#2E7D32", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 900, color: "#fff" }}>Visit the teachers page</div>
          </Link>
        </div>
      </div>
    </main>
  )
}
