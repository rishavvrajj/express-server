import { Router } from 'express';
import { healthRouter } from './routes/health.routes';
import { authRouter } from './routes/auth.routes';
import { userTaskRouter } from './routes/user.task.routes';

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use("/tasks", userTaskRouter);