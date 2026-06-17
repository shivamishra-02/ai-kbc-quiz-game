import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrizeLadder from '../components/PrizeLadder.jsx';

function QuizScreen({ game }) {
  const {
    question,
    lastResult,
    hintText,
    gameStatus,
    loading,
    answer,
    lifeline,
    advanceToNext,
    dismissResult,
    goToWinnerScreen,
  } = game;

  useEffect(() => {
    if (!lastResult) return;
    const isRetry = !!lastResult.retryAllowed;
    const delay = gameStatus ? 1800 : isRetry ? 1200 : 1400;
    const timer = setTimeout(() => {
      if (gameStatus) goToWinnerScreen();
      else if (isRetry) dismissResult();
      else advanceToNext();
    }, delay);
    return () => clearTimeout(timer);
  }, [lastResult, gameStatus, advanceToNext, dismissResult, goToWinnerScreen]);

  if (!question) return null;

  return (
    <div className="flex min-h-screen items-center justify-center gap-6 p-6">
      <div className="flex w-full max-w-2xl flex-col items-center gap-6">
        <div className="flex w-full items-center justify-between font-mono text-sm text-cyan">
          <span>Q{question.questionNumber}/{question.totalQuestions}</span>
          <span className="text-gold">₹{question.points.toLocaleString('en-IN')}</span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-violet to-cyan"
            animate={{ width: `${(question.questionNumber / question.totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.questionNumber}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass w-full rounded-2xl p-6"
          >
            <p className="text-xl font-medium">{question.question}</p>
          </motion.div>
        </AnimatePresence>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {question.options.map((option, i) => {
            const isRevealedCorrect = lastResult?.correctAnswer === option;
            const feedbackClass = isRevealedCorrect
              ? lastResult.correct
                ? 'glow-emerald border border-emerald'
                : 'glow-rose border border-rose'
              : '';
            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                whileHover={!lastResult ? { scale: 1.02 } : {}}
                whileTap={!lastResult ? { scale: 0.98 } : {}}
                disabled={loading || !!lastResult}
                onClick={() => answer(option)}
                className={`glass rounded-xl p-4 text-left transition disabled:opacity-70 ${feedbackClass}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>

        <div className="flex gap-3">
          {!question.lifelinesUsed.fiftyFifty && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => lifeline('fiftyFifty')} disabled={loading} className="glass rounded-full px-4 py-2 text-sm">
              50:50
            </motion.button>
          )}
          {!question.lifelinesUsed.twoX && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => lifeline('twoX')} disabled={loading} className="glass rounded-full px-4 py-2 text-sm">
              2X
            </motion.button>
          )}
          {!question.lifelinesUsed.hint && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => lifeline('hint')} disabled={loading} className="glass rounded-full px-4 py-2 text-sm">
              Hint
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {lastResult?.retryAllowed && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-rose">
              {lastResult.message}
            </motion.p>
          )}
          {hintText && (
            <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-xl px-4 py-2 text-sm text-gold">
              {hintText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <PrizeLadder currentQuestionNumber={question.questionNumber} />
    </div>
  );
}

export default QuizScreen;