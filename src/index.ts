import { Router } from 'express';
import { healthRouter } from './routes/health.routes';
import { authRouter } from './routes/auth.routes';

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use('/auth', authRouter);