import { Router } from 'express';
import * as controller from '../controllers/game.controller.js';
import { validate } from '../middleware/validateRequest.js';
import { answerSchema, lifelineSchema } from '../utils/schemas.js';

const router = Router();

router.post('/start', controller.startGame);
router.get('/question', controller.getCurrentQuestion);
router.post('/answer', validate(answerSchema), controller.submitAnswer);
router.post('/lifeline', validate(lifelineSchema), controller.useLifeline);

export default router;