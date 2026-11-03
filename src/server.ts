import { createApp } from './app';
import { env } from './configs/env';
import { logger } from './libs/logger';

const app = createApp();
const port = env.port;

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});