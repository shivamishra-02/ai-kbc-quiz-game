import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const client = axios.create({ baseURL });

let sessionId = null;

client.interceptors.request.use((config) => {
  if (sessionId) {
    config.headers = { ...config.headers, 'x-session-id': sessionId };
  }
  return config;
});

export async function startGame() {
  const { data } = await client.post('/api/game/start');
  sessionId = data.sessionId;
  return data;
}

export async function getCurrentQuestion() {
  const { data } = await client.get('/api/game/question');
  return data;
}

export async function submitAnswer(selectedOption) {
  const { data } = await client.post('/api/game/answer', { selectedOption });
  return data;
}

export async function useLifeline(type) {
  const { data } = await client.post('/api/game/lifeline', { type });
  return data;
}

export function resetSession() {
  sessionId = null;
}