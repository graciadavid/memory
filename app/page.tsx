export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center font-nunito">
      <div className="text-center px-6">
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-4xl font-black text-white mb-2">
          Pair<span className="text-[#FF4D6D]">IQ</span>
        </h1>
        <p className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-8">
          Association Memory Game
        </p>
        <div className="bg-[#13131f] border border-[#1e1e35] rounded-2xl p-6 text-left max-w-sm">
          <p className="text-gray-400 text-sm font-bold">
            🚀 Coming soon — 8 themes, world rankings, daily challenges
          </p>
        </div>
      </div>
    </main>
  )
}
