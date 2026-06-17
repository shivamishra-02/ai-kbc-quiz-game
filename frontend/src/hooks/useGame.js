import { useState, useCallback } from 'react';
import * as api from '../services/api.js';

export function useGame() {
  const [screen, setScreen] = useState('start'); // 'start' | 'quiz' | 'winner'
  const [question, setQuestion] = useState(null);
  const [lastResult, setLastResult] = useState(null); // holds reveal info after an answer
  const [hintText, setHintText] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [gameStatus, setGameStatus] = useState(null); // 'won' | 'lost'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      api.resetSession();
      const data = await api.startGame();
      setQuestion(data.question);
      setLastResult(null);
      setHintText(null);
      setGameStatus(null);
      setScreen('quiz');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not start the game. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  const answer = useCallback(
    async (selectedOption) => {
      if (loading || lastResult) return;
      setLoading(true);
      setError(null);
      try {
        const result = await api.submitAnswer(selectedOption);
        setLastResult(result);
        if (result.gameStatus === 'won') {
          setFinalScore(result.scoreNow);
          setGameStatus('won');
        } else if (result.gameStatus === 'lost') {
          setFinalScore(result.finalScore);
          setGameStatus('lost');
        }
        // question itself only advances once the screen has shown the reveal -
        // see advanceToNext() below
      } catch (err) {
        setError(err.response?.data?.error || 'Something went wrong submitting your answer.');
      } finally {
        setLoading(false);
      }
    },
    [loading, lastResult]
  );

  const lifeline = useCallback(async (type) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.useLifeline(type);
      if (type === 'fiftyFifty' && result.options) {
        setQuestion((q) => ({ ...q, options: result.options, lifelinesUsed: { ...q.lifelinesUsed, fiftyFifty: true } }));
      }
      if (type === 'twoX') {
        setQuestion((q) => ({ ...q, lifelinesUsed: { ...q.lifelinesUsed, twoX: true } }));
      }
      if (type === 'hint') {
        setHintText(result.hint);
        setQuestion((q) => ({ ...q, lifelinesUsed: { ...q.lifelinesUsed, hint: true } }));
      }
      return result;
    } catch (err) {
      setError(err.response?.data?.error || 'That lifeline failed.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const advanceToNext = useCallback(() => {
    if (lastResult?.nextQuestion) {
      setQuestion(lastResult.nextQuestion);
    }
    setLastResult(null);
    setHintText(null);
  }, [lastResult]);

  const dismissResult = useCallback(() => setLastResult(null), []);

  const goToWinnerScreen = useCallback(() => setScreen('winner'), []);

  const playAgain = useCallback(() => {
    setScreen('start');
    setQuestion(null);
    setLastResult(null);
    setHintText(null);
    setGameStatus(null);
    setError(null);
  }, []);

  return {
    screen,
    question,
    lastResult,
    hintText,
    finalScore,
    gameStatus,
    loading,
    error,
    start,
    answer,
    lifeline,
    advanceToNext,
    dismissResult,
    goToWinnerScreen,
    playAgain,
  };
}