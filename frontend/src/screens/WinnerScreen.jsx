import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    let frame;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: Math.random() * 100,
        color: i % 3 === 0 ? 'var(--color-gold)' : i % 3 === 1 ? 'var(--color-violet)' : 'var(--color-cyan)',
        duration: 2.5 + Math.random() * 1.5,
        delay: Math.random() * 0.5,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{ left: `${p.left}%`, background: p.color }}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: '110vh', opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

function WinnerScreen({ game }) {
  const { finalScore, gameStatus, question, playAgain } = game;
  const animatedScore = useCountUp(finalScore);
  const won = gameStatus === 'won';

  const questionsCleared = won ? 15 : Math.max((question?.questionNumber ?? 1) - 1, 0);
  const lifelinesUsed = question?.lifelinesUsed || { fiftyFifty: false, twoX: false, hint: false };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden p-6 text-center">
      {won && <Confetti />}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm uppercase tracking-widest text-white/60"
      >
        {won ? 'You cleared the board' : 'Game over'}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`font-display text-6xl font-extrabold ${won ? 'text-gradient-neon-animated' : 'text-rose'}`}
      >
        ₹{animatedScore.toLocaleString('en-IN')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass flex flex-col gap-2 rounded-2xl px-6 py-4 text-sm text-white/70"
      >
        <p>
          Questions cleared: <span className="text-white">{questionsCleared} / 15</span>
        </p>
        <p className="flex items-center gap-2">
          Lifelines used:
          {['fiftyFifty', 'twoX', 'hint'].map((key) => (
            <span
              key={key}
              className={`rounded-full px-2 py-0.5 text-xs ${
                lifelinesUsed[key] ? 'bg-violet/30 text-white' : 'bg-white/5 text-white/30'
              }`}
            >
              {key === 'fiftyFifty' ? '50:50' : key === 'twoX' ? '2X' : 'Hint'}
            </span>
          ))}
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={playAgain}
        className="shine-button glass glow-violet rounded-full px-10 py-4 font-display text-lg font-semibold"
      >
        Play Again
      </motion.button>
    </div>
  );
}

export default WinnerScreen;