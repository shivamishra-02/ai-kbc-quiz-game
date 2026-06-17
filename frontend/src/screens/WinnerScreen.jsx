function WinnerScreen({ game }) {
  const { finalScore, gameStatus, playAgain } = game;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-white/60">
        {gameStatus === 'won' ? 'You cleared the board' : 'Game over'}
      </p>
      <p className="font-display text-6xl font-extrabold text-gradient-neon">
        ₹{finalScore.toLocaleString('en-IN')}
      </p>
      <button
        onClick={playAgain}
        className="glass glow-violet rounded-full px-10 py-4 font-display text-lg font-semibold transition hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
}

export default WinnerScreen;