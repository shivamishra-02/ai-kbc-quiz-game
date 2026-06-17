import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import * as groqService from './groqService.js';
import * as sessionStore from './sessionStore.js';
import { TOTAL_QUESTIONS, getPointsForQuestion, isMilestone } from '../utils/milestones.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fallbackQuestions = JSON.parse(
  readFileSync(path.join(__dirname, '../data/fallbackQuestions.json'), 'utf-8')
);

async function buildQuiz() {
  let aiQuestions = [];
  try {
    aiQuestions = await groqService.generateQuestions(TOTAL_QUESTIONS);
  } catch (err) {
    console.error('[gameEngine] Groq generation failed, falling back to hardcoded bank:', err.message);
    aiQuestions = [];
  }

  const quiz = [...aiQuestions];

  // Top up any missing slots from the fallback bank so the game is always exactly
  // TOTAL_QUESTIONS long, whether Groq fully worked, partially worked, or failed entirely
  for (const candidate of fallbackQuestions) {
    if (quiz.length >= TOTAL_QUESTIONS) break;
    if (!quiz.some((q) => q.question === candidate.question)) {
      quiz.push(candidate);
    }
  }

  return quiz.slice(0, TOTAL_QUESTIONS).map((q, i) => ({
    ...q,
    questionNumber: i + 1,
    points: getPointsForQuestion(i + 1),
  }));
}

function sanitizeQuestion(session) {
  const q = session.questions[session.currentIndex];
  if (!q) return null;

  const options = session.fiftyFiftyAppliedOn === session.currentIndex
    ? session.fiftyFiftyOptions
    : q.options;

  return {
    questionNumber: q.questionNumber,
    totalQuestions: TOTAL_QUESTIONS,
    question: q.question,
    options,
    difficulty: q.difficulty,
    points: q.points,
    currentWinnings: session.score,
    lockedAmount: session.lockedAmount,
    lifelinesUsed: session.lifelinesUsed,
  };
}

function requireActiveSession(sessionId) {
  const session = sessionStore.getSession(sessionId);
  if (!session) {
    const err = new Error('Game session not found or expired. Start a new game.');
    err.status = 404;
    throw err;
  }
  if (session.status !== 'in-progress') {
    const err = new Error(`Game already ended (status: ${session.status}).`);
    err.status = 409;
    throw err;
  }
  return session;
}

export async function startGame(sessionId) {
  const questions = await buildQuiz();
  const session = sessionStore.createSession(sessionId, {
    questions,
    currentIndex: 0,
    score: 0,
    lockedAmount: 0,
    lifelinesUsed: { fiftyFifty: false, twoX: false, hint: false },
    twoXActiveOnCurrent: false,
    attemptsOnCurrent: 0,
    fiftyFiftyAppliedOn: null,
    fiftyFiftyOptions: null,
    status: 'in-progress',
  });
  return sanitizeQuestion(session);
}

export function getCurrentQuestion(sessionId) {
  const session = requireActiveSession(sessionId);
  return sanitizeQuestion(session);
}

export function submitAnswer(sessionId, selectedOption) {
  const session = requireActiveSession(sessionId);
  const current = session.questions[session.currentIndex];
  const isCorrect = selectedOption.trim().toLowerCase() === current.correctAnswer.trim().toLowerCase();

  // 2x lifeline: first wrong attempt on this question gets a second try, answer stays hidden
  if (!isCorrect && session.twoXActiveOnCurrent && session.attemptsOnCurrent < 1) {
    sessionStore.updateSession(sessionId, { attemptsOnCurrent: session.attemptsOnCurrent + 1 });
    return {
      correct: false,
      retryAllowed: true,
      message: 'Not quite - you get one more try on this question.',
    };
  }

  if (!isCorrect) {
    sessionStore.updateSession(sessionId, { status: 'lost' });
    return {
      correct: false,
      retryAllowed: false,
      correctAnswer: current.correctAnswer,
      explanation: current.explanation,
      finalScore: session.lockedAmount,
      gameStatus: 'lost',
    };
  }

  const newScore = current.points;
  const newLockedAmount = isMilestone(current.questionNumber) ? current.points : session.lockedAmount;
  const nextIndex = session.currentIndex + 1;
  const finished = nextIndex >= TOTAL_QUESTIONS;

  const updated = sessionStore.updateSession(sessionId, {
    score: newScore,
    lockedAmount: newLockedAmount,
    currentIndex: nextIndex,
    attemptsOnCurrent: 0,
    twoXActiveOnCurrent: false,
    status: finished ? 'won' : 'in-progress',
  });

  return {
    correct: true,
    correctAnswer: current.correctAnswer,
    explanation: current.explanation,
    scoreNow: updated.score,
    gameStatus: updated.status,
    nextQuestion: finished ? null : sanitizeQuestion(updated),
  };
}

export async function applyLifeline(sessionId, type) {
  const session = requireActiveSession(sessionId);

  if (session.lifelinesUsed[type]) {
    const err = new Error(`Lifeline "${type}" has already been used this game.`);
    err.status = 409;
    throw err;
  }

  const current = session.questions[session.currentIndex];
  const lifelinesUsed = { ...session.lifelinesUsed, [type]: true };

  if (type === 'fiftyFifty') {
    const wrongOptions = current.options.filter((o) => o !== current.correctAnswer);
    const keptWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    const reducedOptions = [current.correctAnswer, keptWrong].sort(() => Math.random() - 0.5);

    sessionStore.updateSession(sessionId, {
      lifelinesUsed,
      fiftyFiftyAppliedOn: session.currentIndex,
      fiftyFiftyOptions: reducedOptions,
    });
    return { type, options: reducedOptions };
  }

  if (type === 'twoX') {
    sessionStore.updateSession(sessionId, { lifelinesUsed, twoXActiveOnCurrent: true });
    return { type, message: 'You now get two attempts on this question.' };
  }

  if (type === 'hint') {
    let hint;
    try {
      hint = await groqService.generateHint(current);
    } catch (err) {
      console.error('[gameEngine] Hint generation failed, using fallback hint:', err.message);
      hint = current.hint || 'Try eliminating the option that feels the most out of place.';
    }
    sessionStore.updateSession(sessionId, { lifelinesUsed });
    return { type, hint };
  }
}