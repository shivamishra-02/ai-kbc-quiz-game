function StartScreen({ game }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">AI Quiz · 15 questions</p>
      <h1 className="font-display text-5xl font-extrabold text-gradient-neon">AI Crorepati</h1>
      <p className="max-w-md text-white/70">
        Climb the prize ladder by answering questions on AI, machine learning, and the latest tech.
        Three lifelines. Two locked milestones. One shot.
      </p>
      {game.error && <p className="glass glow-rose rounded-xl px-4 py-2 text-sm text-rose">{game.error}</p>}
      <button
        onClick={game.start}
        disabled={game.loading}
        className="glass glow-violet rounded-full px-10 py-4 font-display text-lg font-semibold transition hover:scale-105 disabled:opacity-50"
      >
        {game.loading ? 'Starting…' : 'Start Game'}
      </button>
    </div>
  );
}

export default StartScreen;