const sessions = new Map();
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour

export function createSession(sessionId, data) {
  const session = { ...data, createdAt: Date.now() };
  sessions.set(sessionId, session);
  return session;
}

export function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(sessionId);
    return null;
  }
  return session;
}

export function updateSession(sessionId, updates) {
  const session = getSession(sessionId);
  if (!session) return null;
  const updated = { ...session, ...updates };
  sessions.set(sessionId, updated);
  return updated;
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

// Sweep abandoned sessions periodically so memory doesn't grow forever
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.createdAt > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}, 15 * 60 * 1000);