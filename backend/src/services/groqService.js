import Groq from 'groq-sdk';
import { env } from '../config/env.js';
import { questionsResponseSchema } from '../utils/schemas.js';

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export class GroqServiceError extends Error {}

const TOPICS = [
  'artificial intelligence fundamentals',
  'machine learning concepts',
  'large language models (LLMs)',
  'generative AI',
  'recent AI/tech news and trends',
  'programming and developer trends',
  'major tech companies and their AI products',
];

function buildQuizPrompt(count) {
  return `Generate exactly ${count} multiple-choice quiz questions for a "Kaun Banega Crorepati"-style trivia game about AI, machine learning, LLMs, generative AI, and recent technology trends (topics include: ${TOPICS.join(', ')}).

Requirements for each question:
- Exactly 4 answer options.
- "correctAnswer" must be the exact text of one of the 4 options (character-for-character match).
- "explanation" is a short, friendly explanation of why the answer is correct.
- "difficulty" is one of "easy", "medium", or "hard". Order the questions so difficulty roughly increases - early questions "easy", middle ones "medium", later ones "hard".
- Do not repeat the same fact or question twice.
- Keep every question factually accurate and unambiguous - exactly one option should be correct.

Respond with ONLY a JSON object in this exact shape, with no markdown formatting, no code fences, and no extra commentary:
{"questions": [{"question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "...", "explanation": "...", "difficulty": "easy"}]}`;
}

function extractJson(raw) {
  // Some models still wrap output in markdown fences even when told not to - strip and grab the object
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new GroqServiceError('No JSON object found in Groq response');
  }
  return cleaned.slice(start, end + 1);
}

export async function generateQuestions(count) {
  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: env.GROQ_MODEL,
      messages: [
        { role: 'system', content: 'You are a quiz question generator. You only output valid JSON, nothing else.' },
        { role: 'user', content: buildQuizPrompt(count) },
      ],
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });
  } catch (err) {
    throw new GroqServiceError(`Groq API request failed: ${err.message}`);
  }

  const raw = completion.choices?.[0]?.message?.content;
  if (!raw) {
    throw new GroqServiceError('Groq returned an empty response');
  }

  let parsedJson;
  try {
    parsedJson = JSON.parse(extractJson(raw));
  } catch (err) {
    throw new GroqServiceError(`Groq response was not valid JSON: ${err.message}`);
  }

  const validated = questionsResponseSchema.safeParse(parsedJson);
  if (!validated.success) {
    throw new GroqServiceError(`Groq response failed schema validation: ${validated.error.message}`);
  }

  return validated.data.questions.slice(0, count);
}

export async function generateHint(question) {
  try {
    const completion = await groq.chat.completions.create({
      model: env.GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You give short, helpful quiz hints. You NEVER state or strongly imply the exact correct answer text. You only narrow things down.',
        },
        {
          role: 'user',
          content: `Question: "${question.question}"\nOptions: ${question.options.join(', ')}\nCorrect answer (for your reference only, never say this directly): "${question.correctAnswer}"\n\nGive a one-sentence hint that helps narrow down the answer without naming or quoting the correct option.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });
    const hint = completion.choices?.[0]?.message?.content?.trim();
    if (!hint) throw new GroqServiceError('Groq returned an empty hint');
    return hint;
  } catch (err) {
    throw new GroqServiceError(`Hint generation failed: ${err.message}`);
  }
}