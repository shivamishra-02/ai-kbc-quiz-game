import { z } from 'zod';

// Shape of a single question - used to validate Groq's output before we ever trust it
export const questionSchema = z
  .object({
    question: z.string().min(10),
    options: z.array(z.string().min(1)).length(4),
    correctAnswer: z.string().min(1),
    explanation: z.string().min(5),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  })
  .refine((q) => q.options.includes(q.correctAnswer), {
    message: 'correctAnswer must exactly match one of the options',
    path: ['correctAnswer'],
  });

export const questionsResponseSchema = z.object({
  questions: z.array(questionSchema),
});

// Request body shapes for the game endpoints
export const answerSchema = z.object({
  selectedOption: z.string().min(1),
});

export const lifelineSchema = z.object({
  type: z.enum(['fiftyFifty', 'twoX', 'hint']),
});