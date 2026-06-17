import { useEffect } from 'react';

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="font-mono text-sm text-cyan">
        Question {question.questionNumber}/{question.totalQuestions} · ₹{question.points.toLocaleString('en-IN')}
      </div>

      <div className="glass w-full max-w-2xl rounded-2xl p-6">
        <p className="text-xl font-medium">{question.question}</p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const isRevealedCorrect = lastResult?.correctAnswer === option;
          const feedbackClass = isRevealedCorrect
            ? lastResult.correct
              ? 'glow-emerald border border-emerald'
              : 'glow-rose border border-rose'
            : '';
          return (
            <button
              key={option}
              disabled={loading || !!lastResult}
              onClick={() => answer(option)}
              className={`glass rounded-xl p-4 text-left transition hover:border-violet disabled:opacity-70 ${feedbackClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        {!question.lifelinesUsed.fiftyFifty && (
          <button onClick={() => lifeline('fiftyFifty')} disabled={loading} className="glass rounded-full px-4 py-2 text-sm">
            50:50
          </button>
        )}
        {!question.lifelinesUsed.twoX && (
          <button onClick={() => lifeline('twoX')} disabled={loading} className="glass rounded-full px-4 py-2 text-sm">
            2X
          </button>
        )}
        {!question.lifelinesUsed.hint && (
          <button onClick={() => lifeline('hint')} disabled={loading} className="glass rounded-full px-4 py-2 text-sm">
            Hint
          </button>
        )}
      </div>

      {lastResult?.retryAllowed && <p className="text-rose">{lastResult.message}</p>}
      {hintText && <p className="glass rounded-xl px-4 py-2 text-sm text-gold">{hintText}</p>}
    </div>
  );
}

export default QuizScreen;