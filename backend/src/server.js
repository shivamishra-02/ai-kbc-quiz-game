import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`[server] listening on http://localhost:${env.PORT}`);
  console.log(`[server] health check: http://localhost:${env.PORT}/health`);
});

function shutdown(signal) {
  console.log(`[server] received ${signal}, shutting down gracefully`);
  server.close(() => {
    console.log('[server] closed all connections');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));