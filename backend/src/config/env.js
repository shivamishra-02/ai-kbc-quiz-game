import 'dotenv/config';
import { z } from 'zod';

// Fail fast: if a required var is missing, we want to know at boot time,
// not three requests later when groqService quietly breaks.
const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GROQ_API_KEY: z.string().min(1, 'GROQ_API_KEY is required - get one at console.groq.com'),
  GROQ_MODEL: z.string().default('llama-3.3-70b-versatile'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[env] Invalid or missing environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;