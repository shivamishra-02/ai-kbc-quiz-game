import { v4 as uuidv4 } from 'uuid';
import * as gameEngine from '../services/gameEngine.js';
import { TOTAL_QUESTIONS } from '../utils/milestones.js';

function getSessionId(req) {
  return req.headers['x-session-id'] || req.body?.sessionId || req.query?.sessionId;
}

function requireSessionId(req) {
  const sessionId = getSessionId(req);
  if (!sessionId) {
    const err = new Error('Missing session id - send it as the x-session-id header.');
    err.status = 400;
    throw err;
  }
  return sessionId;
}

export async function startGame(req, res, next) {
  try {
    const sessionId = uuidv4();
    const question = await gameEngine.startGame(sessionId);
    res.json({ success: true, sessionId, totalQuestions: TOTAL_QUESTIONS, question });
  } catch (err) {
    next(err);
  }
}

export function getCurrentQuestion(req, res, next) {
  try {
    const sessionId = requireSessionId(req);
    const question = gameEngine.getCurrentQuestion(sessionId);
    res.json({ success: true, question });
  } catch (err) {
    next(err);
  }
}

export function submitAnswer(req, res, next) {
  try {
    const sessionId = requireSessionId(req);
    const { selectedOption } = req.validated;
    const result = gameEngine.submitAnswer(sessionId, selectedOption);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function useLifeline(req, res, next) {
  try {
    const sessionId = requireSessionId(req);
    const { type } = req.validated;
    const result = await gameEngine.applyLifeline(sessionId, type);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}