import { app } from './config/app';
import { initDbConnection } from './config/db';
import { logger } from './config/logger';

const port = process.env.PORT ?? 3000;

const startApp = async () => {
  await initDbConnection();

  app.listen(port, () => {
    logger.info(`The application is running and listening on port ${port}`);
  });
};

startApp().catch((error) => {
  logger.error('Unexpected error while starting service', { error });
  process.exit(1);
});
