import { motion } from 'framer-motion';
import { POINTS_LADDER, MILESTONE_QUESTIONS } from '../utils/milestones.js';

function LockIcon({ className }) {
  return (
    <svg className={className} width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-7h-1V8a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-7-2a3 3 0 0 1 6 0v2H11V8z" />
    </svg>
  );
}

function PrizeLadder({ currentQuestionNumber }) {
  const rungs = POINTS_LADDER.map((points, i) => ({ number: i + 1, points })).reverse();

  return (
    <div className="glass hidden w-56 flex-col gap-1 rounded-2xl p-3 lg:flex">
      {rungs.map(({ number, points }) => {
        const isCurrent = number === currentQuestionNumber;
        const isPassed = number < currentQuestionNumber;
        const isMilestone = MILESTONE_QUESTIONS.includes(number);
        const isLockedIn = isMilestone && isPassed;

        let textClass = 'text-white/40';
        if (isCurrent) textClass = 'text-white';
        else if (isLockedIn) textClass = 'text-gold';
        else if (isMilestone) textClass = 'text-gold/70';
        else if (isPassed) textClass = 'text-white/20';

        return (
          <motion.div
            key={number}
            animate={isCurrent ? { scale: [1, 1.04, 1] } : {}}
            transition={isCurrent ? { duration: 1.6, repeat: Infinity } : {}}
            className={`flex items-center justify-between rounded-lg px-3 py-1.5 font-mono text-xs ${textClass} ${
              isCurrent ? 'glow-violet bg-violet/20' : ''
            }`}
          >
            <span className="flex items-center gap-1">
              {isLockedIn && <LockIcon className="text-gold" />}
              Q{number}
            </span>
            <span>₹{points.toLocaleString('en-IN')}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default PrizeLadder;