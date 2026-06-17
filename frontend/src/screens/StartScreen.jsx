import { useState } from 'react';
import { motion } from 'framer-motion';

const TOPICS = ['AI', 'Machine Learning', 'LLMs', 'Generative AI', 'Tech Trends'];

function FloatingOrb({ className, duration, delay }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function SoundToggle() {
  const [on, setOn] = useState(true);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      aria-label={on ? 'Mute sound' : 'Unmute sound'}
      className="glass fixed right-4 top-4 z-50 rounded-full p-2 text-white/70 transition hover:text-cyan"
    >
      {on ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 10v4h4l5 5V5L7 10H3zm15.54-3.54-1.41 1.41L19.17 10l-2.04 2.04 1.41 1.41L20.59 11l2.04 2.04 1.41-1.41L21.99 9.59l2.05-2.04-1.41-1.41L20.59 8.18z" />
        </svg>
      )}
    </button>
  );
}

function StartScreen({ game }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden p-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_var(--color-void)_85%)]" />
      <FloatingOrb className="-left-20 top-10 h-72 w-72 bg-violet/30" duration={10} delay={0} />
      <FloatingOrb className="right-0 top-1/3 h-80 w-80 bg-cyan/20" duration={12} delay={1} />
      <FloatingOrb className="bottom-0 left-1/3 h-64 w-64 bg-gold/20" duration={14} delay={2} />

      <SoundToggle />

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs uppercase tracking-[0.3em] text-cyan"
      >
        AI Quiz · 15 questions · ₹70,00,000 top prize
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
      >
        <h1 className="text-gradient-neon-animated font-display text-6xl font-extrabold sm:text-7xl">
          AI KBC
        </h1>
        <p className="mt-2 font-display text-base tracking-wide text-white/60 sm:text-lg">
          By:- <span className="text-gold">Shivam Mishra</span>
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="max-w-md text-white/70"
      >
        Climb the prize ladder by answering questions on AI, machine learning, and the latest tech.
        Three lifelines. Two locked milestones. One shot.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {TOPICS.map((topic) => (
          <span key={topic} className="glass rounded-full px-3 py-1 text-xs text-white/60">
            {topic}
          </span>
        ))}
      </motion.div>

      {game.error && (
        <p className="glass glow-rose rounded-xl px-4 py-2 text-sm text-rose">{game.error}</p>
      )}

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={game.start}
        disabled={game.loading}
        className="shine-button glass glow-violet rounded-full px-10 py-4 font-display text-lg font-semibold disabled:opacity-50"
      >
        {game.loading ? 'Starting…' : 'Start Game'}
      </motion.button>
    </div>
  );
}

export default StartScreen;