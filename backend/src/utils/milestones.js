// Authentic KBC-style prize ladder for 15 questions
export const POINTS_LADDER = [
  1000, 2000, 3000, 5000, 10000,
  20000, 40000, 80000, 160000, 320000,
  640000, 1250000, 2500000, 5000000, 7000000,
];

export const TOTAL_QUESTIONS = POINTS_LADDER.length;

// 1-indexed question numbers where winnings get locked in (padav)
export const MILESTONE_QUESTIONS = [5, 10];

export function getPointsForQuestion(questionNumber) {
  return POINTS_LADDER[questionNumber - 1] ?? 0;
}

export function isMilestone(questionNumber) {
  return MILESTONE_QUESTIONS.includes(questionNumber);
}