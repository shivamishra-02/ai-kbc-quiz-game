import { motion } from 'framer-motion';

const GITHUB_URL = 'https://github.com/shivamishra-02';
const LINKEDIN_URL = 'https://www.linkedin.com/in/shivam-mishra-3a741b253/';

function Credit() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="glass fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-2 text-xs text-white/70 sm:bottom-6"
    >
      <span className="font-display tracking-wide">
        <span className="text-white/50">Developer:</span> <span className="text-gold">Shivam Mishra</span>
      </span>
      <span className="h-3 w-px bg-white/20" />
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="text-white/70 transition hover:text-cyan"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 4.93 3.2 9.11 7.64 10.59.56.1.76-.24.76-.54 0-.27-.01-1.13-.02-2.04-3.11.68-3.77-1.32-3.77-1.32-.51-1.3-1.24-1.64-1.24-1.64-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.24.92.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.62 5.25-5.11 5.52.4.35.76 1.04.76 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.2.65.77.54A11.03 11.03 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5z" />
        </svg>
      </a>
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className="text-white/70 transition hover:text-cyan"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
        </svg>
      </a>
    </motion.div>
  );
}

export default Credit;