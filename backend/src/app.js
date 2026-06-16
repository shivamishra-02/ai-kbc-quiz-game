import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV });
});

// Game routes get mounted here once they exist, e.g.:
// import gameRoutes from './routes/game.routes.js';
// app.use('/api/game', gameRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;